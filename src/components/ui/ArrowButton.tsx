import { OCTAGON_PATH } from "@/lib/shapes";

/**
 * The forward control on each listing band — same chamfered octagon as
 * `CloseButton`, with an arrow instead of a cross. Everything reacts to hover
 * on the button as a whole: the outline comes up to full, the arrow slides,
 * and the label brightens.
 *
 * Colour comes from `currentColor`, so the caller sets the tone by putting a
 * text colour on this element or an ancestor.
 */
export default function ArrowButton({
  label,
  caption = "View property",
  onClick,
}: {
  /** Screen-reader name — the visible caption is the same on every band. */
  label: string;
  caption?: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="group focus-ring inline-flex items-center gap-4"
    >
      <span className="relative grid h-[54px] w-[54px] shrink-0 place-items-center">
        <svg
          viewBox="0 0 60 60"
          className="absolute inset-0 h-full w-full"
          aria-hidden="true"
        >
          <path
            d={OCTAGON_PATH}
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            className="opacity-30 transition-opacity duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:opacity-100"
          />
        </svg>

        <svg
          viewBox="0 0 24 24"
          className="relative h-[18px] w-[18px] transition-transform duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:translate-x-[3px]"
          aria-hidden="true"
        >
          <path
            d="M4 12h15M12.5 5.5 19 12l-6.5 6.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          />
        </svg>
      </span>

      <span
        aria-hidden="true"
        className="text-[11px] font-medium tracking-[0.28em] uppercase opacity-55 transition-opacity duration-300 group-hover:opacity-100"
      >
        {caption}
      </span>
    </button>
  );
}
