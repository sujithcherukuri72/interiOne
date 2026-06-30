"use client";

import Image from "next/image";
import { Logo } from "@/components/brand/Logo";
import { TelanganaMap } from "@/components/layout/TelanganaMap";

/* ── Social icon inline SVGs (lucide-react has no brand icons) ── */
function IconInstagram() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="w-[18px] h-[18px]">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function IconFacebook() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="w-[18px] h-[18px]">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function IconLinkedin() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="w-[18px] h-[18px]">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function IconPinterest() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="w-[18px] h-[18px]">
      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.236 2.636 7.855 6.356 9.312-.088-.791-.167-2.005.035-2.868.181-.78 1.172-4.97 1.172-4.97s-.299-.598-.299-1.482c0-1.388.806-2.428 1.808-2.428.853 0 1.267.641 1.267 1.408 0 .858-.546 2.141-.828 3.33-.236.995.499 1.806 1.476 1.806 1.772 0 3.135-1.867 3.135-4.563 0-2.386-1.715-4.054-4.163-4.054-2.835 0-4.498 2.127-4.498 4.326 0 .856.33 1.773.741 2.274a.3.3 0 0 1 .069.284c-.076.31-.243.995-.276 1.134-.044.183-.146.222-.337.134-1.249-.581-2.03-2.407-2.03-3.874 0-3.154 2.292-6.052 6.608-6.052 3.469 0 6.165 2.473 6.165 5.776 0 3.447-2.173 6.22-5.19 6.22-1.013 0-1.966-.527-2.292-1.148l-.623 2.378c-.226.869-.835 1.958-1.244 2.621.937.29 1.931.446 2.962.446 5.523 0 10-4.477 10-10S17.523 2 12 2z" />
    </svg>
  );
}

function IconYoutube() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="w-[18px] h-[18px]">
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
      <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="#0E0D0D" />
    </svg>
  );
}

const SOCIAL_LINKS = [
  { href: "https://instagram.com/interioone", label: "Instagram", Icon: IconInstagram },
  { href: "https://facebook.com/interioone",  label: "Facebook",  Icon: IconFacebook  },
  { href: "https://linkedin.com/company/interioone", label: "LinkedIn", Icon: IconLinkedin },
  { href: "https://pinterest.com/interioone", label: "Pinterest", Icon: IconPinterest  },
  { href: "https://youtube.com/@interioone",  label: "YouTube",   Icon: IconYoutube   },
] as const;

/* ── Footer nav ── */
const FOOTER_LINKS = [
  { href: "/collections", label: "Collections" },
  { href: "/materials",   label: "Materials"   },
  { href: "/process",     label: "Process"     },
  { href: "/about",       label: "About"       },
  { href: "/contact",     label: "Contact"     },
] as const;

export function Footer() {
  return (
    <footer
      className="border-t border-foreground/[0.06]"
      style={{ backgroundColor: "var(--obsidian)", color: "var(--foreground)" }}
    >
      {/* ── Main split: brand (narrow) | map (wide) ── */}
      <div className="mx-auto max-w-7xl px-6 lg:px-10 py-14 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-12 lg:gap-10 items-center">

          {/* ── LEFT: brand + address + social ── */}
          <div className="flex flex-col gap-8">

            {/* Logo lockup */}
            <Logo
              variant="lockup"
              size="lg"
              className="text-gold"
              wrapperClassName="self-start"
            />

            {/* Address block */}
            <address
              className="not-italic leading-relaxed text-[13px] tracking-wide"
              style={{ color: "rgba(245,237,216,0.55)" }}
            >
              <p
                className="text-[11px] font-semibold tracking-[0.2em] uppercase mb-3"
                style={{ color: "var(--gold)" }}
              >
                Main Branch
              </p>
              <p className="font-medium" style={{ color: "rgba(245,237,216,0.85)" }}>
                InterioOne Design Studio
              </p>
              <p>Kapil Kavuri Hub, Nanakramguda,</p>
              <p>Hyderabad — 500 032</p>
              <p>Telangana, India</p>
              <p className="mt-3">
                <a
                  href="tel:+914023456789"
                  className="transition-colors duration-200 hover:text-gold"
                  style={{ color: "rgba(245,237,216,0.55)" }}
                >
                  +91 40 2345 6789
                </a>
              </p>
              <p>
                <a
                  href="mailto:studio@interioone.in"
                  className="transition-colors duration-200 hover:text-gold"
                  style={{ color: "rgba(245,237,216,0.55)" }}
                >
                  studio@interioone.in
                </a>
              </p>
            </address>

            {/* Social icons */}
            <div className="flex items-center gap-4">
              {SOCIAL_LINKS.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="footer-social-icon flex items-center justify-center w-9 h-9 rounded-full border transition-all duration-300"
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          {/* ── RIGHT: Telangana map ── */}
          <div className="w-full flex flex-col items-center lg:items-start">
            <p
              className="text-[11px] font-semibold tracking-[0.2em] uppercase mb-6 self-center"
              style={{ color: "var(--gold)" }}
            >
              Our Presence
            </p>
            <div className="w-full" style={{ maxWidth: 560 }}>
              <TelanganaMap />
            </div>
          </div>

        </div>
      </div>

      {/* ── Bottom bar: nav + copyright ── */}
      <div
        className="border-t mx-auto max-w-7xl px-6 lg:px-10 py-5 flex flex-col sm:flex-row items-center justify-between gap-4"
        style={{ borderColor: "rgba(245,237,216,0.06)" }}
      >
        <nav aria-label="Footer navigation" className="flex flex-wrap gap-x-6 gap-y-2 justify-center sm:justify-start">
          {FOOTER_LINKS.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              className="text-[11px] font-medium tracking-[0.15em] uppercase transition-colors duration-200 hover:text-gold"
              style={{ color: "rgba(245,237,216,0.35)" }}
            >
              {label}
            </a>
          ))}
        </nav>

        {/* JSW partner strip */}
        <div className="flex items-center gap-3 shrink-0">
          <span
            className="text-[9px] font-medium tracking-[0.2em] uppercase"
            style={{ color: "rgba(245,237,216,0.2)" }}
          >
            Powered by
          </span>
          <div className="relative h-5 w-14 opacity-35 grayscale hover:opacity-60 hover:grayscale-0 transition-all duration-300">
            <Image src="/brand/jsw-logo.jpeg" alt="JSW" fill sizes="56px" className="object-contain object-left" />
          </div>
          <span
            className="text-[9px] tracking-wide"
            style={{ color: "rgba(245,237,216,0.15)" }}
          >
            Modula — PPGF 30 Composite
          </span>
        </div>

        <p
          className="text-[11px] tracking-wide shrink-0"
          style={{ color: "rgba(245,237,216,0.2)" }}
        >
          &copy; {new Date().getFullYear()} InterioOne. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
