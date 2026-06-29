import Image from "next/image";

const FOOTER_LINKS = [
  { href: "/collections", label: "Collections" },
  { href: "/materials", label: "Materials" },
  { href: "/process", label: "Process" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

export function Footer() {
  return (
    <footer className="border-t border-foreground/[0.06] py-14">
      <div className="mx-auto max-w-7xl px-6 lg:px-10 space-y-10">
        {/* Main row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
          {/* Brand wordmark */}
          <div className="space-y-1">
            <p className="text-[15px] font-semibold tracking-[0.12em] uppercase">
              Interio
              <em className="not-italic font-extralight tracking-[0.16em]">One</em>
            </p>
            <p className="text-[10px] font-medium tracking-[0.28em] uppercase text-foreground/35">
              Design&nbsp;•&nbsp;Create&nbsp;•&nbsp;Inspire
            </p>
          </div>

          {/* Footer nav */}
          <nav aria-label="Footer navigation" className="flex flex-wrap gap-x-6 gap-y-2">
            {FOOTER_LINKS.map(({ href, label }) => (
              <a
                key={href}
                href={href}
                className="text-[11px] font-medium tracking-[0.15em] uppercase text-foreground/40 hover:text-foreground transition-colors duration-200"
              >
                {label}
              </a>
            ))}
          </nav>

          {/* Copyright */}
          <p className="text-[11px] tracking-wide text-foreground/25 shrink-0">
            &copy; {new Date().getFullYear()} InterioOne
          </p>
        </div>

        {/* Partner logo strip */}
        <div className="flex items-center gap-4 pt-4 border-t border-foreground/[0.04]">
          <p className="text-[9px] font-medium tracking-[0.22em] uppercase text-foreground/20">
            Powered by
          </p>
          {/* JSW logo — place jsw-logo.jpeg in public/brand/ to activate */}
          <div className="relative h-6 w-16 opacity-40 grayscale hover:opacity-70 hover:grayscale-0 transition-all duration-300">
            <Image
              src="/brand/jsw-logo.jpeg"
              alt="JSW"
              fill
              sizes="64px"
              className="object-contain object-left"
            />
          </div>
          <p className="text-[9px] text-foreground/15 tracking-wide">
            Modula — PPGF 30 Composite Panels
          </p>
        </div>
      </div>
    </footer>
  );
}
