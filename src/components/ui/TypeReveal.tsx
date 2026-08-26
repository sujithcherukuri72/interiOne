"use client";

import { Fragment, useEffect, useRef, useState, type ElementType } from "react";

import { cn } from "@/lib/cn";

/**
 * Text that reveals itself, a word at a time, when it scrolls into view.
 *
 * Each word slides up from behind its own edge — mechanical rather than soft,
 * which is what the material argument these blocks carry should sound like.
 *
 * Everything is driven by CSS `animation-delay` off one class flip on the
 * root: a paragraph of forty words is forty spans, and the compositor can run
 * those alone. Animating them through a motion library would mean forty
 * subscribed components ticking every frame, which is the whole frame budget
 * on the mid-range Android most of this traffic is on.
 *
 * The animated words are hidden from assistive tech, with the full sentence
 * carried alongside in a screen-reader-only span. A crawler and a screen
 * reader both get the sentence; only the eye gets it in pieces.
 */

export type TypeRevealProps = {
  text: string;
  /** Rendered element. Copy blocks are paragraphs; headings pass their level. */
  as?: "p" | "h1" | "h2" | "h3" | "h4" | "span" | "div";
  className?: string;
  /** Milliseconds between one word starting and the next. */
  stagger?: number;
  /** Milliseconds before the first word fires, once in view. */
  delay?: number;
  /** How long a single word takes to resolve, in milliseconds. */
  duration?: number;
  /** Reveal once and stay set. The default replays on re-entry, like every other section. */
  once?: boolean;
  /** Fraction of the block that must be on screen before it starts. */
  amount?: number;
};

export default function TypeReveal({
  text,
  as = "p",
  className,
  stagger = 45,
  delay = 40,
  duration = 900,
  once = false,
  amount = 0.3,
}: TypeRevealProps) {
  const ref = useRef<HTMLElement>(null);
  const [revealed, setRevealed] = useState(false);

  const words = text.split(" ");

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          if (once) observer.disconnect();
        } else if (!once) {
          // Rewind on the way out, so scrolling back up replays it — the same
          // `once: false` behaviour the rest of the page's reveals use.
          setRevealed(false);
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
      data-revealed={revealed ? "on" : "off"}
      style={{ "--tr-duration": `${duration}ms` } as React.CSSProperties}
    >
      <span className="sr-only">{text}</span>

      <span aria-hidden="true">
        {words.map((word, w) => (
          // A word is atomic, so the line's break opportunity has to be a real
          // space *between* these boxes rather than one tucked inside them.
          <Fragment key={w}>
            <span className="type-reveal-word">
              <span
                className="type-reveal-inner"
                style={{ animationDelay: `${delay + w * stagger}ms` }}
              >
                {word}
              </span>
            </span>
            {w < words.length - 1 && " "}
          </Fragment>
        ))}
      </span>
    </Tag>
  );
}
