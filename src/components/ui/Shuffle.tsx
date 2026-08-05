"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText as GSAPSplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

import "./Shuffle.css";

gsap.registerPlugin(ScrollTrigger, GSAPSplitText, useGSAP);

type ShuffleDirection = "left" | "right" | "up" | "down";
type ShuffleTag = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span";

export type ShuffleProps = {
  text: string;
  className?: string;
  style?: React.CSSProperties;
  shuffleDirection?: ShuffleDirection;
  duration?: number;
  maxDelay?: number;
  ease?: string | ((progress: number) => number);
  threshold?: number;
  rootMargin?: string;
  tag?: ShuffleTag;
  textAlign?: React.CSSProperties["textAlign"];
  onShuffleComplete?: () => void;
  shuffleTimes?: number;
  animationMode?: "evenodd" | "random";
  loop?: boolean;
  loopDelay?: number;
  stagger?: number;
  scrambleCharset?: string;
  colorFrom?: string;
  colorTo?: string;
  triggerOnce?: boolean;
  respectReducedMotion?: boolean;
  triggerOnHover?: boolean;
  /**
   * Whether scrolling the text into view plays it. Off means the strips are
   * built and left at rest, and only `triggerOnHover` ever starts a run —
   * which is what a hover-only control wants. Safe because with no
   * `scrambleCharset` every copy in a strip is the same glyph, so a strip
   * parked at its start offset is indistinguishable from plain text.
   */
  playOnEnter?: boolean;
};

/**
 * Per-letter shuffle-in, from React Bits, ported to TypeScript.
 *
 * Each character is replaced by a fixed-size window holding a vertical (or
 * horizontal) strip of copies; the strip slides so the real glyph lands in the
 * window. Type is inherited from the call site — see Shuffle.css.
 */
const Shuffle = ({
  text,
  className = "",
  style = {},
  shuffleDirection = "right",
  duration = 0.35,
  maxDelay = 0,
  ease = "power3.out",
  threshold = 0.1,
  rootMargin = "-100px",
  tag = "p",
  textAlign = "center",
  onShuffleComplete,
  shuffleTimes = 1,
  animationMode = "evenodd",
  loop = false,
  loopDelay = 0,
  stagger = 0.03,
  scrambleCharset = "",
  colorFrom,
  colorTo,
  triggerOnce = true,
  respectReducedMotion = true,
  triggerOnHover = true,
  playOnEnter = true,
}: ShuffleProps) => {
  const ref = useRef<HTMLElement | null>(null);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [ready, setReady] = useState(false);

  const splitRef = useRef<GSAPSplitText | null>(null);
  const wrappersRef = useRef<HTMLElement[]>([]);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const playingRef = useRef(false);
  const hoverHandlerRef = useRef<(() => void) | null>(null);

  // Measuring character widths before the webfont swaps in would size every
  // strip to the fallback face. `fonts.ready` resolves immediately when the
  // font is already loaded, so routing both paths through a promise keeps the
  // state update out of the effect body (react-hooks/set-state-in-effect).
  useEffect(() => {
    let cancelled = false;
    const done = () => {
      if (!cancelled) setFontsLoaded(true);
    };
    if ("fonts" in document) document.fonts.ready.then(done);
    else Promise.resolve().then(done);
    return () => {
      cancelled = true;
    };
  }, []);

  const scrollTriggerStart = useMemo(() => {
    const startPct = (1 - threshold) * 100;
    const mm = /^(-?\d+(?:\.\d+)?)(px|em|rem|%)?$/.exec(rootMargin || "");
    const mv = mm ? parseFloat(mm[1]) : 0;
    const mu = mm ? mm[2] || "px" : "px";
    const sign =
      mv === 0 ? "" : mv < 0 ? `-=${Math.abs(mv)}${mu}` : `+=${mv}${mu}`;
    return `top ${startPct}%${sign}`;
  }, [threshold, rootMargin]);

  useGSAP(
    () => {
      if (!ref.current || !text || !fontsLoaded) return;
      if (
        respectReducedMotion &&
        window.matchMedia &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ) {
        setReady(true);
        onShuffleComplete?.();
        return;
      }

      const el = ref.current;
      const start = scrollTriggerStart;

      const removeHover = () => {
        if (hoverHandlerRef.current && ref.current) {
          ref.current.removeEventListener("mouseenter", hoverHandlerRef.current);
          hoverHandlerRef.current = null;
        }
      };

      const teardown = () => {
        if (tlRef.current) {
          tlRef.current.kill();
          tlRef.current = null;
        }
        if (wrappersRef.current.length) {
          wrappersRef.current.forEach((wrap) => {
            const inner = wrap.firstElementChild;
            const orig = inner?.querySelector('[data-orig="1"]');
            if (orig && wrap.parentNode) wrap.parentNode.replaceChild(orig, wrap);
          });
          wrappersRef.current = [];
        }
        try {
          splitRef.current?.revert();
        } catch {
          /* noop */
        }
        splitRef.current = null;
        playingRef.current = false;
      };

      const build = () => {
        teardown();

        splitRef.current = new GSAPSplitText(el, {
          type: "chars",
          charsClass: "shuffle-char",
          wordsClass: "shuffle-word",
          linesClass: "shuffle-line",
          smartWrap: true,
          reduceWhiteSpace: false,
        });

        const chars = (splitRef.current.chars || []) as HTMLElement[];
        wrappersRef.current = [];

        const rolls = Math.max(1, Math.floor(shuffleTimes));
        const rand = (set: string) =>
          set.charAt(Math.floor(Math.random() * set.length)) || "";
        const isVertical = shuffleDirection === "up" || shuffleDirection === "down";

        chars.forEach((ch) => {
          const parent = ch.parentElement;
          if (!parent) return;

          const rect = ch.getBoundingClientRect();
          const w = rect.width;
          if (!w) return;

          // `rect.height` is the char's *line box*, which inherits whatever
          // line-height the caller set (e.g. the hero's `leading-[0.82]`). A
          // tight line box is shorter than the glyph's actual ink — descenders
          // on letters like "y" or "p" sit below it — so sizing the wrap's
          // `overflow: hidden` window to the raw rect height clips them. Floor
          // it at 1.2x the font size, comfortably inside typical ascent+descent,
          // to guarantee the whole glyph fits regardless of how tight the
          // caller's leading is. Rows are given this same explicit height below
          // (via flexbox, not the block-layout line box) so the transform step
          // distance stays in sync with what's actually rendered.
          const fontSizePx = parseFloat(getComputedStyle(ch).fontSize) || rect.height;
          const h = isVertical ? Math.max(rect.height, fontSizePx * 1.2) : rect.height;

          const wrap = document.createElement("span");
          Object.assign(wrap.style, {
            display: "inline-block",
            overflow: "hidden",
            width: w + "px",
            height: isVertical ? h + "px" : "auto",
            verticalAlign: "bottom",
          });

          const inner = document.createElement("span");
          Object.assign(inner.style, {
            display: "inline-block",
            whiteSpace: isVertical ? "normal" : "nowrap",
            willChange: "transform",
          });

          parent.insertBefore(wrap, ch);
          wrap.appendChild(inner);

          // Vertical rows are centred in a fixed-height flexbox instead of a
          // block with inherited line-height — that's what lets `h` above (not
          // the tight line box) be the row's real, rendered height, so the
          // transform step distance (steps * h) lines up with what's on screen.
          const rowStyle: Partial<CSSStyleDeclaration> = isVertical
            ? {
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: w + "px",
                height: h + "px",
              }
            : { display: "inline-block", width: w + "px", textAlign: "center" };

          const firstOrig = ch.cloneNode(true) as HTMLElement;
          Object.assign(firstOrig.style, rowStyle);

          ch.setAttribute("data-orig", "1");
          Object.assign(ch.style, rowStyle);

          inner.appendChild(firstOrig);
          for (let k = 0; k < rolls; k++) {
            const c = ch.cloneNode(true) as HTMLElement;
            if (scrambleCharset) c.textContent = rand(scrambleCharset);
            Object.assign(c.style, rowStyle);
            inner.appendChild(c);
          }
          inner.appendChild(ch);

          const steps = rolls + 1;

          if (shuffleDirection === "right" || shuffleDirection === "down") {
            const firstCopy = inner.firstElementChild;
            const real = inner.lastElementChild;
            if (real) inner.insertBefore(real, inner.firstChild);
            if (firstCopy) inner.appendChild(firstCopy);
          }

          let startX = 0;
          let finalX = 0;
          let startY = 0;
          let finalY = 0;

          if (shuffleDirection === "right") {
            startX = -steps * w;
            finalX = 0;
          } else if (shuffleDirection === "left") {
            startX = 0;
            finalX = -steps * w;
          } else if (shuffleDirection === "down") {
            startY = -steps * h;
            finalY = 0;
          } else if (shuffleDirection === "up") {
            startY = 0;
            finalY = -steps * h;
          }

          if (!isVertical) {
            gsap.set(inner, { x: startX, y: 0, force3D: true });
            inner.setAttribute("data-start-x", String(startX));
            inner.setAttribute("data-final-x", String(finalX));
          } else {
            gsap.set(inner, { x: 0, y: startY, force3D: true });
            inner.setAttribute("data-start-y", String(startY));
            inner.setAttribute("data-final-y", String(finalY));
          }

          if (colorFrom) inner.style.color = colorFrom;
          wrappersRef.current.push(wrap);
        });
      };

      const inners = () =>
        wrappersRef.current
          .map((w) => w.firstElementChild)
          .filter((s): s is HTMLElement => s instanceof HTMLElement);

      const randomizeScrambles = () => {
        if (!scrambleCharset) return;
        wrappersRef.current.forEach((w) => {
          const strip = w.firstElementChild;
          if (!strip) return;
          const kids = Array.from(strip.children);
          for (let i = 1; i < kids.length - 1; i++) {
            kids[i].textContent = scrambleCharset.charAt(
              Math.floor(Math.random() * scrambleCharset.length),
            );
          }
        });
      };

      const cleanupToStill = () => {
        wrappersRef.current.forEach((w) => {
          const strip = w.firstElementChild;
          if (!(strip instanceof HTMLElement)) return;
          const real = strip.querySelector('[data-orig="1"]');
          if (!real) return;
          strip.replaceChildren(real);
          strip.style.transform = "none";
          strip.style.willChange = "auto";
        });
      };

      const play = () => {
        const strips = inners();
        if (!strips.length) return;

        playingRef.current = true;
        const isVertical =
          shuffleDirection === "up" || shuffleDirection === "down";

        const tl = gsap.timeline({
          smoothChildTiming: true,
          repeat: loop ? -1 : 0,
          repeatDelay: loop ? loopDelay : 0,
          onRepeat: () => {
            if (scrambleCharset) randomizeScrambles();
            if (isVertical) {
              gsap.set(strips, {
                y: (i: number, t: Element) =>
                  parseFloat(t.getAttribute("data-start-y") || "0"),
              });
            } else {
              gsap.set(strips, {
                x: (i: number, t: Element) =>
                  parseFloat(t.getAttribute("data-start-x") || "0"),
              });
            }
            onShuffleComplete?.();
          },
          onComplete: () => {
            playingRef.current = false;
            if (!loop) {
              cleanupToStill();
              if (colorTo) gsap.set(strips, { color: colorTo });
              onShuffleComplete?.();
              armHover();
            }
          },
        });

        const addTween = (targets: HTMLElement[], at: number) => {
          const vars: gsap.TweenVars = {
            duration,
            ease,
            force3D: true,
            stagger: animationMode === "evenodd" ? stagger : 0,
          };
          if (isVertical) {
            vars.y = (i: number, t: Element) =>
              parseFloat(t.getAttribute("data-final-y") || "0");
          } else {
            vars.x = (i: number, t: Element) =>
              parseFloat(t.getAttribute("data-final-x") || "0");
          }

          tl.to(targets, vars, at);

          if (colorFrom && colorTo) {
            tl.to(targets, { color: colorTo, duration, ease }, at);
          }
        };

        if (animationMode === "evenodd") {
          const odd = strips.filter((_, i) => i % 2 === 1);
          const even = strips.filter((_, i) => i % 2 === 0);
          const oddTotal = duration + Math.max(0, odd.length - 1) * stagger;
          const evenStart = odd.length ? oddTotal * 0.7 : 0;
          if (odd.length) addTween(odd, 0);
          if (even.length) addTween(even, evenStart);
        } else {
          strips.forEach((strip) => {
            const d = Math.random() * maxDelay;
            const vars: gsap.TweenVars = { duration, ease, force3D: true };
            if (isVertical) {
              vars.y = parseFloat(strip.getAttribute("data-final-y") || "0");
            } else {
              vars.x = parseFloat(strip.getAttribute("data-final-x") || "0");
            }
            tl.to(strip, vars, d);
            if (colorFrom && colorTo) {
              tl.fromTo(
                strip,
                { color: colorFrom },
                { color: colorTo, duration, ease },
                d,
              );
            }
          });
        }

        tlRef.current = tl;
      };

      const armHover = () => {
        if (!triggerOnHover || !ref.current) return;
        removeHover();
        const handler = () => {
          // Upstream bails whenever a run is in flight, and with `loop` on a
          // run is *always* in flight — `onComplete` never fires for an
          // infinite repeat, so `playingRef` never clears and hover would be
          // dead for the whole life of the page. Restart the running timeline
          // instead, which is what hover-replay means in a looping context.
          if (loop && tlRef.current) {
            if (scrambleCharset) randomizeScrambles();
            tlRef.current.restart();
            return;
          }
          if (playingRef.current) return;
          build();
          if (scrambleCharset) randomizeScrambles();
          play();
        };
        hoverHandlerRef.current = handler;
        ref.current.addEventListener("mouseenter", handler);
      };

      const create = () => {
        build();
        if (scrambleCharset) randomizeScrambles();
        if (playOnEnter) play();
        armHover();
        setReady(true);
      };

      // A hover-only control (playOnEnter: false) has nothing to gate on
      // scroll position — it never plays until the pointer arrives. Building
      // it immediately, rather than waiting on a ScrollTrigger that will
      // never have a reason to fire early, is what makes it visible and
      // hoverable from first paint instead of staying invisible forever for
      // any instance ScrollTrigger doesn't happen to evaluate as "entered" at
      // creation time (which for anything below the very top of the page,
      // this depends on a scroll event actually arriving first).
      let st: ScrollTrigger | null = null;
      if (playOnEnter) {
        st = ScrollTrigger.create({
          trigger: el,
          start,
          once: triggerOnce,
          onEnter: create,
        });
      } else {
        create();
      }

      return () => {
        st?.kill();
        removeHover();
        teardown();
        setReady(false);
      };
    },
    {
      dependencies: [
        text,
        duration,
        maxDelay,
        ease,
        scrollTriggerStart,
        fontsLoaded,
        shuffleDirection,
        shuffleTimes,
        animationMode,
        loop,
        loopDelay,
        stagger,
        scrambleCharset,
        colorFrom,
        colorTo,
        triggerOnce,
        respectReducedMotion,
        triggerOnHover,
        playOnEnter,
        onShuffleComplete,
      ],
      scope: ref as React.RefObject<HTMLElement>,
    },
  );

  const commonStyle = useMemo(
    () => ({ textAlign, ...style }) as React.CSSProperties,
    [textAlign, style],
  );

  const classes = useMemo(
    () => `shuffle-parent ${ready ? "is-ready" : ""} ${className}`,
    [ready, className],
  );

  return React.createElement(
    tag || "p",
    { ref, className: classes, style: commonStyle },
    text,
  );
};

export default Shuffle;
