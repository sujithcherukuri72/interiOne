"use client";

import {
  Fragment,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ElementType,
} from "react";

import { cn } from "@/lib/cn";

/**
 * Text that types itself in when it scrolls into view.
 *
 * Each character resolves out of a blur rather than simply appearing, and a
 * hairline coral edge rides the reveal head — so it reads as a machine setting
 * the line, not as a fade. That is the point: this copy carries the material
 * argument for the product, and typing it makes the reader take it a word at a
 * time instead of skimming the block.
 *
 * Everything is driven by CSS `animation-delay` off one class flip on the
 * root. A 240-character paragraph is 240 spans; animating those through a
 * motion library means 240 subscribed components ticking every frame, which is
 * the whole frame budget on the mid-range Android most of this traffic is on.
 * The compositor can run it alone.
 *
 * Words are the wrapping unit — characters never break across a line — and the
 * animated characters are hidden from assistive tech, with the full sentence
 * carried alongside in a screen-reader-only span. A crawler and a screen reader
 * both get the sentence; only the eye gets it letter by letter.
 */

export type TypeRevealProps = {
  text: string;
  /** Rendered element. Copy blocks are paragraphs; headings pass their level. */
  as?: "p" | "h1" | "h2" | "h3" | "h4" | "span" | "div";
  className?: string;
  /** Milliseconds between one character starting and the next. */
  speed?: number;
  /** Milliseconds before the first character fires, once in view. */
  delay?: number;
  /** How long a single character takes to resolve, in milliseconds. */
  duration?: number;
  /** Leave the coral head off — for quieter, secondary blocks. */
  caret?: boolean;
  /** Type once and stay set. The default replays on re-entry, like every other section. */
  once?: boolean;
  /** Fraction of the block that must be on screen before it starts. */
  amount?: number;
};

export default function TypeReveal({
  text,
  as = "p",
  className,
  speed = 16,
  delay = 60,
  duration = 460,
  caret = true,
  once = false,
  amount = 0.3,
}: TypeRevealProps) {
  const ref = useRef<HTMLElement>(null);
  const [typing, setTyping] = useState(false);

  /**
   * The sentence, pre-split into words of characters with each character's
   * delay already resolved.
   *
   * Done once per string rather than per render: a scroll-driven parent
   * re-renders this constantly, and the delays are a pure function of the
   * text, so recomputing them on every pass is wasted work.
   */
  const words = useMemo(() => {
    // Delay is a function of the character's position in the *sentence*, not
    // in its word, so the whole string is timed first and only then cut into
    // words. Grouping afterwards keeps the rhythm even across a line break
    // and leaves the spaces counted — which is what makes the reveal head
    // pause in the gap rather than skip it.
    const timed = Array.from(text).map((char, i) => ({
      char,
      delay: delay + i * speed,
    }));

    return timed.reduce<{ char: string; delay: number }[][]>(
      (words, entry) =>
        entry.char === " "
          ? [...words, []]
          : [...words.slice(0, -1), [...words[words.length - 1], entry]],
      [[]],
    );
  }, [text, delay, speed]);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTyping(true);
          if (once) observer.disconnect();
        } else if (!once) {
          // Rewind on the way out, so scrolling back up re-types it — the same
          // `once: false` behaviour the rest of the page's reveals use.
          setTyping(false);
        }
      },
      // A tall paragraph never reaches a high threshold on a phone, so the
      // fraction is deliberately low and the trigger is nudged up the screen.
      { threshold: amount, rootMargin: "0px 0px -10% 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [once, amount]);

  // Widening to ElementType keeps the ref assignable — with `as` left as a
  // union of intrinsic tags, TypeScript resolves `ref` to a union it cannot
  // satisfy, and every branch here is an HTMLElement anyway.
  const Tag = as as ElementType;

  return (
    <Tag
      ref={ref}
      className={cn("type-reveal", className)}
      data-typing={typing ? "on" : "off"}
      data-caret={caret ? "on" : "off"}
      style={
        {
          "--tr-duration": `${duration}ms`,
          "--tr-speed": `${speed}ms`,
        } as React.CSSProperties
      }
    >
      <span className="sr-only">{text}</span>

      <span aria-hidden="true">
        {words.map((chars, w) => (
          // A word is atomic, so the line's break opportunity has to be a real
          // space *between* these boxes rather than one tucked inside them.
          <Fragment key={w}>
            <span className="type-reveal-word">
              {chars.map(({ char, delay: at }, c) => (
                <span
                  key={c}
                  className="type-reveal-char"
                  style={{ animationDelay: `${at}ms` }}
                >
                  {char}
                </span>
              ))}
            </span>
            {w < words.length - 1 && " "}
          </Fragment>
        ))}
      </span>
    </Tag>
  );
}
