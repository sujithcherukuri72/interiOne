import { cn } from "@/lib/cn";

/**
 * A material stand-in for a finish photograph. Real photography is nothing
 * but colour and light on a shutter face, so until studio shoots exist a
 * gradient built from the finish's own `hex`/`grain` pair reads truer than a
 * stock photo ever would — the swatch *is* the specification, not an
 * illustration of it.
 */
export default function Swatch({
  hex,
  grain,
  sheen,
  code,
  className,
}: {
  hex: string;
  grain: string;
  sheen?: string;
  code?: string;
  className?: string;
}) {
  return (
    <div
      className={cn("relative overflow-hidden", className)}
      style={{ background: `linear-gradient(155deg, ${hex} 0%, ${hex} 58%, ${grain} 100%)` }}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.14] mix-blend-multiply"
        style={{
          backgroundImage: `repeating-linear-gradient(112deg, ${grain} 0px, ${grain} 1px, transparent 1px, transparent 8px)`,
        }}
      />
      {(sheen || code) && (
        <div className="absolute bottom-3 left-3 flex items-center gap-2 text-[10px] font-medium tracking-[0.22em] text-white/80 uppercase mix-blend-difference">
          {code && <span>{code}</span>}
          {sheen && <span>{sheen}</span>}
        </div>
      )}
    </div>
  );
}
