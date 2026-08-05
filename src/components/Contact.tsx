"use client";

import { motion } from "framer-motion";

import { BRAND } from "@/data/brand";
import { EASE } from "@/lib/motion";
import { LogoWord } from "@/components/ui/Logo";

const ACTIONS = [
  { label: "Book a site visit", href: "#showrooms" },
  { label: "Get 3 free designs", href: "#showrooms" },
  { label: "Visit the Hyderabad studio", href: "#showrooms" },
  { label: "See the 30-day programme", href: "#journey" },
];

const LEGAL = [
  { label: "Privacy", href: "#contact" },
  { label: "Terms", href: "#contact" },
  { label: "Warranty", href: "#contact" },
];

const reveal = (delay: number) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: false, margin: "-80px" },
  transition: { duration: 0.8, ease: EASE, delay },
});

/** Small line icons for the contact rows — stroked, so they inherit weight. */
function Icon({ name }: { name: "phone" | "mail" | "pin" }) {
  const paths = {
    phone:
      "M4.5 3h3l1.5 3.6-2 1.4a11 11 0 0 0 5 5l1.4-2L17 12.5v3a1.5 1.5 0 0 1-1.6 1.5A13 13 0 0 1 3 4.6 1.5 1.5 0 0 1 4.5 3Z",
    mail: "M3 5h14v10H3z M3 5.5l7 5 7-5",
    pin: "M10 17s5.5-5 5.5-9a5.5 5.5 0 1 0-11 0c0 4 5.5 9 5.5 9Z M10 8.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z",
  };

  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="h-[18px] w-[18px] shrink-0"
    >
      {paths[name].split(" M").map((d, i) => (
        <path key={i} d={i === 0 ? d : `M${d}`} />
      ))}
    </svg>
  );
}

/**
 * The closer. Everything else on the page opens a takeover or a section
 * scroll; this is the one screen with nothing behind it — the page simply
 * ends here, the way the reference ends on its own last section rather than
 * handing off to a separate footer.
 */
export default function Contact() {
  return (
    <section id="contact" className="bg-background pt-[14vh] text-foreground">
      <div className="section-shell">
        <motion.p
          {...reveal(0)}
          className="font-mono text-[10px] font-medium tracking-[0.28em] text-muted uppercase"
        >
          {BRAND.tagline}
        </motion.p>

        <motion.p
          {...reveal(0.08)}
          className="mt-8 max-w-[26ch] text-[clamp(2.1rem,4.6vw,4.2rem)] leading-[1.05] font-medium tracking-[-0.035em] text-balance"
        >
          Book your layout visit
        </motion.p>

        <motion.p
          {...reveal(0.16)}
          className="mt-6 max-w-[46ch] text-[15px] leading-[1.6] tracking-[-0.01em] text-muted"
        >
          Adjusted in full against your final order. A designer visits your
          site, and three costed concepts follow within a day.
        </motion.p>

        <motion.div {...reveal(0.24)} className="mt-9 flex flex-wrap gap-3">
          {ACTIONS.map((action) => (
            <a
              key={action.label}
              href={action.href}
              className="focus-ring rounded-full border border-line px-5 py-2.5 text-[13px] tracking-[-0.005em] text-foreground/75 transition-colors duration-300 hover:border-foreground/40 hover:text-foreground"
            >
              {action.label}
            </a>
          ))}
        </motion.div>

        {/* Contact rows — icon, then the detail, stacked at the gutter. */}
        <motion.div
          {...reveal(0.3)}
          className="mt-16 flex flex-col gap-3.5 text-[14px] text-foreground/70"
        >
          <a
            href={BRAND.phoneHref}
            className="focus-ring inline-flex w-fit items-center gap-3 rounded transition-colors duration-300 hover:text-foreground"
          >
            <Icon name="phone" />
            {BRAND.phone}
          </a>
          <a
            href={`mailto:${BRAND.email}`}
            className="focus-ring inline-flex w-fit items-center gap-3 rounded transition-colors duration-300 hover:text-foreground"
          >
            <Icon name="mail" />
            {BRAND.email}
          </a>
          <span className="inline-flex items-center gap-3">
            <Icon name="pin" />
            {BRAND.address}
          </span>
        </motion.div>

        {/* The oversized wordmark, hairline-ruled top and bottom. */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false, margin: "-80px" }}
          transition={{ duration: 1, ease: EASE }}
          className="mt-16 border-t border-line pt-[6vh] pb-[4vh]"
        >
          {/* The logo lockup at display size — same face, same interlocked
              O's. `leading-[1.15]` and the padding below keep the descenders
              off the legal rule underneath. */}
          <LogoWord
            tracking="0.02em"
            className="block w-full select-none text-center text-[clamp(2.6rem,13.5vw,13rem)] leading-[1.15] font-light text-foreground/15"
          />
        </motion.div>

        {/* Legal bar. */}
        <div className="flex flex-col gap-4 border-t border-line py-7 font-mono text-[10px] tracking-[0.16em] text-muted uppercase sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {BRAND.name} · In partnership with{" "}
            {BRAND.partner}, {BRAND.partnerParent}
          </p>

          <div className="flex items-center gap-7">
            {LEGAL.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="focus-ring rounded transition-colors duration-300 hover:text-foreground"
              >
                {item.label}
              </a>
            ))}
            <span
              aria-hidden="true"
              className="h-1.5 w-1.5 rounded-full bg-coral"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
