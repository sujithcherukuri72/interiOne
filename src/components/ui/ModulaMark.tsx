import Image from "next/image";

import {
  ASSETS,
  JSW_MARK_SIZE,
  MODULA_LOGO_SIZE,
} from "@/data/assets";
import { cn } from "@/lib/cn";

/**
 * The partner attribution, drawn once here so the bar, the statement and the
 * footer all set it the same way.
 *
 * Two grounds, as everywhere else on this page: `variant="light"` is the
 * artwork *for* a dark ground (white Modula, reversed JSW), `variant="dark"` is
 * the artwork for the cream page (brown Modula, the group's own navy-and-red).
 *
 * Everything is sized in `em`, so a call site sets one font-size and the mark,
 * the rule and the caption all scale together.
 */

type Variant = "light" | "dark";

/**
 * The group mark on its own, cropped to the letterforms so it can be set
 * *inside* a line of type without opening a hole in it.
 *
 * On dark grounds it is knocked back to white rather than left in colour:
 * JSW's navy is close enough to an ink panel that the mark half-disappears in
 * full colour, and a single-colour reverse is the standard treatment for that.
 */
export function JswMark({
  variant = "dark",
  className,
}: {
  variant?: Variant;
  className?: string;
}) {
  return (
    <Image
      src={ASSETS.brand.jswMark}
      alt="JSW"
      width={JSW_MARK_SIZE.width}
      height={JSW_MARK_SIZE.height}
      sizes="64px"
      className={cn(
        "inline-block h-[1.3em] w-auto",
        variant === "light" && "brightness-0 invert",
        className
      )}
    />
  );
}

/**
 * "A JSW Enterprise", with the three letters set as the mark itself.
 *
 * The words either side stay live text — only the initialism becomes artwork —
 * so the line still reads as one sentence to a screen reader (`alt="JSW"`)
 * rather than as a decorative image with a caption.
 */
export function JswEnterprise({
  variant = "dark",
  className,
}: {
  variant?: Variant;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-[0.5em] whitespace-nowrap",
        className
      )}
    >
      A
      <JswMark variant={variant} />
      Enterprise
    </span>
  );
}

/**
 * The Modula lockup — mark plus wordmark, as supplied.
 *
 * Two flat colourways rather than one file filtered in CSS: the mark is a
 * solid tile with the arrow knocked *out* of it, so `invert` would turn the
 * artwork inside out instead of reversing it.
 */
export function ModulaLogo({
  variant = "dark",
  className,
}: {
  variant?: Variant;
  className?: string;
}) {
  return (
    <Image
      src={variant === "light" ? ASSETS.brand.modulaWhite : ASSETS.brand.modulaBrown}
      alt="Modula"
      width={MODULA_LOGO_SIZE.width}
      height={MODULA_LOGO_SIZE.height}
      sizes="160px"
      className={cn("h-[1.65em] w-auto", className)}
    />
  );
}

/**
 * Modula, followed by who Modula belongs to — the full attribution, with a
 * hairline between the two so the group mark reads as the parent rather than
 * as a second brand standing beside it.
 *
 * `enterprise={false}` drops the tail where the line has no room for it; the
 * rule goes with it, since a divider with nothing after it is just a tick.
 */
export default function ModulaLockup({
  variant = "dark",
  enterprise = true,
  className,
}: {
  variant?: Variant;
  enterprise?: boolean;
  className?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-[0.85em]", className)}>
      <ModulaLogo variant={variant} />

      {enterprise && (
        <>
          <span
            aria-hidden="true"
            className={cn(
              "h-[1.5em] w-px",
              variant === "light" ? "bg-white/25" : "bg-foreground/15"
            )}
          />
          <JswEnterprise
            variant={variant}
            className="text-[0.62em] tracking-[0.14em] uppercase opacity-70"
          />
        </>
      )}
    </span>
  );
}
