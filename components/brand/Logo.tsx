"use client";

/**
 * InterioOne brand logo — SVG-coded approximation of the circular I1 monogram.
 *
 * Mark anatomy:
 *   · Gold ring: circle with stroke, no fill
 *   · Left glyph  "I": serif capital — top bar + vertical stem + bottom bar
 *   · Right glyph "1": architectural — angled entry stroke descending to vertical
 *
 * Variants:
 *   mark      — monogram ring only (square, for favicons / tight spaces)
 *   wordmark  — text lockup only (company name + tagline)
 *   lockup    — mark + wordmark side-by-side (default, for navbar)
 */

type Variant = "mark" | "wordmark" | "lockup";
type Size    = "sm" | "md" | "lg";

const SIZE_MAP: Record<Size, { mark: string; name: string; tag: string }> = {
  sm: { mark: "h-7 w-7",   name: "text-[11px]", tag: "text-[6.5px]" },
  md: { mark: "h-9 w-9",   name: "text-[13px]", tag: "text-[7.5px]" },
  lg: { mark: "h-12 w-12", name: "text-[16px]", tag: "text-[9px]"   },
};

function I1Mark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
    >
      {/* Outer ring */}
      <circle
        cx="50"
        cy="50"
        r="43"
        stroke="currentColor"
        strokeWidth="2.8"
      />

      {/* ── I glyph (left, centred ~x=29) ── */}
      {/* Top serif bar */}
      <line x1="21" y1="24" x2="37" y2="24" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" />
      {/* Vertical stem */}
      <line x1="29" y1="24" x2="29" y2="76" stroke="currentColor" strokeWidth="4"   strokeLinecap="round" />
      {/* Bottom serif bar */}
      <line x1="21" y1="76" x2="37" y2="76" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" />

      {/* ── 1 glyph (right, centred ~x=55) ── */}
      {/* Angled entry stroke (upper-left diagonal) */}
      <line x1="43" y1="34" x2="55" y2="24" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" />
      {/* Vertical stem */}
      <line x1="55" y1="24" x2="55" y2="76" stroke="currentColor" strokeWidth="4"   strokeLinecap="round" />
    </svg>
  );
}

type LogoProps = {
  variant?: Variant;
  size?: Size;
  /** Override colour — defaults to 'text-gold' in dark, 'text-foreground' in light */
  className?: string;
  /** Applies to the outer wrapper only */
  wrapperClassName?: string;
};

export function Logo({
  variant = "lockup",
  size = "md",
  className = "",
  wrapperClassName = "",
}: LogoProps) {
  const s = SIZE_MAP[size];

  if (variant === "mark") {
    return <I1Mark className={`${s.mark} ${className}`} />;
  }

  if (variant === "wordmark") {
    return (
      <div className={`flex flex-col justify-center ${wrapperClassName}`}>
        <span className={`font-semibold tracking-[0.2em] uppercase leading-none ${s.name} ${className}`}>
          Interio<em className="not-italic font-extralight">One</em>
        </span>
        <span className={`tracking-[0.35em] uppercase text-foreground/40 mt-[3px] ${s.tag}`}>
          Design · Create · Inspire
        </span>
      </div>
    );
  }

  /* lockup — mark + wordmark */
  return (
    <div className={`flex items-center gap-2.5 ${wrapperClassName}`}>
      <I1Mark className={`${s.mark} flex-shrink-0 ${className}`} />
      <div className="flex flex-col justify-center">
        <span className={`font-semibold tracking-[0.2em] uppercase leading-none ${s.name}`}>
          Interio<em className="not-italic font-extralight">One</em>
        </span>
        <span className={`tracking-[0.35em] uppercase text-foreground/40 mt-[3px] ${s.tag}`}>
          Design · Create · Inspire
        </span>
      </div>
    </div>
  );
}
