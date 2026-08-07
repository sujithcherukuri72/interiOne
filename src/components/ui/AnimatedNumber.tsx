"use client";

import { useEffect, useRef } from "react";
import { animate, useReducedMotion } from "framer-motion";

/**
 * A number that travels to its new value instead of jumping to it.
 *
 * Written straight to `textContent` rather than through state: a price in a
 * planner changes on every click, and re-rendering the tree sixty times a
 * second for a counter is how a smooth interface stops being one. The spring
 * runs on the value, the DOM node gets the result.
 *
 * Reduced motion gets the final figure immediately — a rolling number is
 * exactly the kind of movement that setting is asking us to stop.
 */
export default function AnimatedNumber({
  value,
  format = (n: number) => Math.round(n).toLocaleString("en-IN"),
  className,
}: {
  value: number;
  format?: (n: number) => string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const from = useRef(value);
  const reduced = useReducedMotion();

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (reduced) {
      node.textContent = format(value);
      from.current = value;
      return;
    }

    const controls = animate(from.current, value, {
      duration: 0.7,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => {
        node.textContent = format(latest);
      },
      onComplete: () => {
        from.current = value;
      },
    });

    return () => controls.stop();
  }, [value, format, reduced]);

  return (
    <span ref={ref} className={className}>
      {format(value)}
    </span>
  );
}
