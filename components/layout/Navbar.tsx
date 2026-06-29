"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Logo } from "@/components/brand/Logo";

/**
 * Drop interio-one-logo.jpeg into public/brand/ to activate the photo logo.
 * While the image is absent the SVG monogram renders as fallback.
 */
const LOGO_IMAGE = "/brand/interio-one-logo.jpeg";
const JSW_LOGO   = "/brand/jsw-logo.jpeg";

const NAV_LINKS = [
  { href: "/collections", label: "Collections" },
  { href: "/materials", label: "Materials" },
  { href: "/process", label: "Process" },
  { href: "/about", label: "About" },
] as const;

function NavLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="relative py-1 text-xs font-medium tracking-[0.15em] uppercase text-foreground/70 hover:text-foreground transition-colors duration-200"
    >
      {label}
      <motion.span
        aria-hidden
        className="absolute bottom-0 left-0 h-px w-full bg-foreground"
        style={{ originX: 0 }}
        initial={{ scaleX: 0 }}
        whileHover={{ scaleX: 1 }}
        transition={{ duration: 0.28, ease: [0.32, 0, 0.67, 0] }}
      />
    </Link>
  );
}

function BrandLogo() {
  const [imgFailed, setImgFailed] = useState(false);

  if (imgFailed) {
    return <Logo variant="lockup" size="sm" />;
  }

  return (
    <span className="flex items-center gap-2.5">
      <span className="relative h-7 w-7 flex-shrink-0 overflow-hidden rounded-full">
        <Image
          src={LOGO_IMAGE}
          alt="InterioOne"
          fill
          sizes="28px"
          priority
          className="object-cover"
          onError={() => setImgFailed(true)}
        />
      </span>
      <span className="flex flex-col justify-center">
        <span className="text-[11px] font-semibold tracking-[0.2em] uppercase leading-none">
          Interio<em className="not-italic font-extralight">One</em>
        </span>
        <span className="text-[6.5px] tracking-[0.35em] uppercase text-foreground/40 mt-[3px]">
          Design · Create · Inspire
        </span>
      </span>
    </span>
  );
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      role="banner"
      className={[
        "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500",
        scrolled
          ? "bg-background/60 backdrop-blur-xl border-b border-foreground/[0.06] shadow-[0_1px_24px_rgba(0,0,0,0.06)]"
          : "bg-transparent",
      ].join(" ")}
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{
        duration: 0.72,
        ease: [0.16, 1, 0.3, 1],
        delay: 0.08,
      }}
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-10 h-16 flex items-center justify-between gap-8">
        {/* Brand lockup — shows real image if present, SVG monogram otherwise */}
        <Link
          href="/"
          className="shrink-0 select-none text-foreground hover:text-gold transition-colors duration-300"
          aria-label="InterioOne home"
        >
          <BrandLogo />
        </Link>

        {/* Primary nav */}
        <nav
          aria-label="Primary navigation"
          className="hidden md:flex items-center gap-7"
        >
          {NAV_LINKS.map(({ href, label }) => (
            <NavLink key={href} href={href} label={label} />
          ))}
        </nav>

        {/* CTA */}
        <motion.div
          className="hidden md:block shrink-0"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          transition={{ duration: 0.18 }}
        >
          <Link
            href="/contact"
            className="inline-flex items-center px-5 py-[7px] text-[11px] font-medium tracking-[0.18em] uppercase border border-foreground/30 rounded-full hover:border-foreground hover:bg-foreground hover:text-background transition-colors duration-300"
          >
            Consult
          </Link>
        </motion.div>
      </div>
    </motion.header>
  );
}
