import { OCTAGON_PATH } from "@/lib/shapes";

/**
 * The chamfered-octagon close control. The outline sits at low opacity until
 * hover, when it comes up to full and the cross turns a quarter turn.
 *
 * `tone` picks the text colour (and so `currentColor` for both strokes) —
 * "light" for ink panels, "dark" for takeovers on the cream background.
 */
export default function CloseButton({
  onClick,
  label = "Close menu",
  tone = "light",
}: {
  onClick: () => void;
  label?: string;
  tone?: "light" | "dark";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`group focus-ring relative grid h-[60px] w-[60px] place-items-center ${
        tone === "light" ? "text-white" : "text-foreground"
      }`}
    >
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
        className="relative h-[22px] w-[22px] transition-transform duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:rotate-90"
        aria-hidden="true"
      >
        <path
          d="M4 4 L20 20 M20 4 L4 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        />
      </svg>
    </button>
  );
}
