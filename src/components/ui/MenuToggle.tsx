/**
 * Two rules, nothing more. Hovering spreads them apart by 0.2rem each rather
 * than morphing into an X — the close control is a separate, differently
 * shaped button inside the takeover.
 *
 * The 25x25 viewBox is rendered at 25px so one user unit is one pixel and the
 * rem-based hover offsets land where they should.
 */
export default function MenuToggle({
  onClick,
  expanded,
}: {
  onClick: () => void;
  expanded: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Open menu"
      aria-expanded={expanded}
      className="menu-toggle focus-ring relative -m-2.5 p-2.5 text-white"
    >
      <svg
        viewBox="0 0 25 25"
        className="h-[25px] w-[25px] overflow-visible"
        aria-hidden="true"
      >
        <path
          className="menu-line menu-line-top"
          d="M0 9.5h25"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        />
        <path
          className="menu-line menu-line-bottom"
          d="M0 15.5h25"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        />
      </svg>
    </button>
  );
}
