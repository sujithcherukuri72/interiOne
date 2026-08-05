"use client";

import { motion } from "framer-motion";

import { BRAND } from "@/data/brand";
import { EASE } from "@/lib/motion";

const ACTIONS = [
  { label: "Book a ₹2000 site visit", href: "#showrooms" },
  { label: "Get 3 free designs", href: "#showrooms" },
  { label: "Visit the Hyderabad studio", href: "#showrooms" },
  { label: "See the 30-day programme", href: "#journey" },
];

/**
 * The closer. Everything else on the page opens a takeover or a section
 * scroll; this is the one screen with nothing behind it — the page simply
 * ends here, the way the reference ends on its own last section rather than
 * handing off to a separate footer.
 */
export default function Contact() {
  return (
    <section id="contact" className="bg-ink py-[16vh] text-white">
      <div className="section-shell">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-80px" }}
          transition={{ duration: 0.8, ease: EASE }}
          className="text-[10px] font-medium tracking-[0.28em] text-white/45 uppercase"
        >
          {BRAND.tagline}
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-80px" }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.08 }}
          className="mt-8 max-w-[26ch] text-[clamp(2.1rem,4.6vw,4.2rem)] leading-[1.05] font-medium tracking-[-0.035em] text-balance"
        >
          Book your ₹2000 layout visit
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-80px" }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.16 }}
          className="mt-6 max-w-[46ch] text-[15px] leading-[1.6] tracking-[-0.01em] text-white/55"
        >
          Adjusted in full against your final order. A designer visits your
          site, and three costed concepts follow within a day.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-80px" }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.24 }}
          className="mt-9 flex flex-wrap gap-3"
        >
          {ACTIONS.map((action) => (
            <a
              key={action.label}
              href={action.href}
              className="focus-ring rounded-full border border-white/20 px-5 py-2.5 text-[13px] tracking-[-0.005em] text-white/80 transition-colors duration-300 hover:border-white/40 hover:text-white"
            >
              {action.label}
            </a>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-80px" }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.3 }}
          className="mt-16 flex flex-wrap items-center justify-between gap-6 border-t border-white/10 pt-8"
        >
          <div className="flex flex-wrap gap-x-8 gap-y-2 text-[14px] text-white/60">
            <a
              href={BRAND.phoneHref}
              className="focus-ring rounded transition-colors duration-300 hover:text-white"
            >
              {BRAND.phone}
            </a>
            <a
              href={`mailto:${BRAND.email}`}
              className="focus-ring rounded transition-colors duration-300 hover:text-white"
            >
              {BRAND.email}
            </a>
          </div>

          <p className="text-[12px] tracking-[-0.005em] text-white/35">
            © {new Date().getFullYear()} {BRAND.name} · In partnership with{" "}
            {BRAND.partner}, {BRAND.partnerParent}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
