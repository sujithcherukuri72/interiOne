"use client";

import Image from "next/image";
import { motion } from "framer-motion";

import { ASSETS } from "@/data/assets";
import { HERO_MEDIA } from "@/data/kitchen-styles";
import { EASE } from "@/lib/motion";
import { SHUFFLE_PRESET } from "@/lib/shuffle";
import { BOOK_VISIT_LINK } from "@/lib/whatsapp";
import Shuffle from "./ui/Shuffle";

/** Four claims the sections below back up, in the order they are made. */
const HERO_PROOF = [
  "Termite proof",
  "Fire safe · UL 94 V-0",
  "Zero plywood",
  "Installed in 30 days",
] as const;

/**
 * The hero: a kitchen playing behind the headline, and nothing else.
 *
 * The style rail that used to sit along the bottom now lives in the planning
 * section, where picking one leads somewhere — here it was a second thing to
 * look at on a screen whose whole job is the first line.
 */
export default function Hero() {
  return (
    <section className="relative isolate flex min-h-[100dvh] flex-1 flex-col justify-between overflow-hidden">
      {/* ── Background ─────────────────────────────────────────────── */}
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <video
          className="h-full w-full object-cover"
          poster={HERO_MEDIA.poster}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        >
          {HERO_MEDIA.hasMp4 && <source src={HERO_MEDIA.videoMp4} type="video/mp4" />}
          <source src={HERO_MEDIA.video} type="video/webm" />
        </video>

        {/* Scrim. Warm rather than black, so the page's cream carries into it
            and the headline holds whatever frame the video is on. */}
        <div className="absolute inset-0 bg-gradient-to-b from-brown-deep/70 via-brown-deep/40 to-brown-deep/80" />
      </div>

      {/* ── Headline ───────────────────────────────────────────────────
          The 72px clears the fixed bar, which the video now runs behind. */}
      <h1 className="px-5 pt-[calc(72px+clamp(1.5rem,6vh,5rem))] sm:px-8">
        <span className="sr-only">
          Modular kitchens in Hyderabad — steel-composite kitchens by interiOne,
          forged in steel, not in sawdust.
        </span>

        <span aria-hidden="true">
          <Shuffle
            {...SHUFFLE_PRESET}
            tag="span"
            text="Forged In Steel"
            textAlign="left"
            className="block text-[clamp(1.75rem,min(7.5vw,11vh),8.5rem)] leading-[0.86] font-medium tracking-[-0.045em] text-white"
          />
          <Shuffle
            {...SHUFFLE_PRESET}
            tag="span"
            text="Not In Sawdust"
            textAlign="left"
            className="block text-[clamp(1.75rem,min(7.5vw,11vh),8.5rem)] leading-[0.86] font-medium tracking-[-0.045em] text-white/45"
          />
        </span>
      </h1>

      {/* ── Foot ─────────────────────────────────────────────────────
          One cluster, bottom-left: the line, the four facts under a hairline,
          then the ask. Floated on its own mid-screen it cut the kitchen in
          half — hung off the same baseline as the JSW mark it reads as the
          foot of the frame instead of a band across it. */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: EASE, delay: 0.5 }}
        className="flex items-end justify-between gap-6 px-5 pb-[5vh] sm:px-8"
      >
        <div className="max-w-[46ch]">
          <p className="max-w-[34ch] text-[13.5px] leading-[1.6] tracking-[-0.01em] text-white/70">
            Steel-composite kitchens, built in Hyderabad and installed in 30 days.
          </p>

          {/* Set at caption weight and kept to one line on anything but a
              phone: it is a footnote to the headline, not a second headline. */}
          <ul className="mt-5 flex flex-wrap items-center gap-x-2.5 gap-y-1.5 border-t border-white/15 pt-4 font-mono text-[9px] tracking-[0.18em] text-white/55 uppercase sm:text-[10px] sm:tracking-[0.22em]">
            {HERO_PROOF.map((item, i) => (
              <li key={item} className="flex items-center gap-2.5">
                {i > 0 && (
                  <span aria-hidden="true" className="h-2.5 w-px bg-white/20" />
                )}
                {item}
              </li>
            ))}
          </ul>

          <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3">
            <a
              href={BOOK_VISIT_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="focus-ring rounded-full bg-white/95 px-5 py-2.5 text-[12.5px] font-medium tracking-[-0.01em] text-brown-deep transition-colors duration-300 hover:bg-white"
            >
              Book a free site visit
            </a>
            {/* A link, not a second button — two pills side by side made the
                corner read as a form. */}
            <a
              href="#technology"
              className="focus-ring group inline-flex items-center gap-2 rounded text-[12.5px] tracking-[-0.01em] text-white/70 transition-colors duration-300 hover:text-white"
            >
              See how it&rsquo;s built
              <span
                aria-hidden="true"
                className="inline-block transition-transform duration-300 group-hover:translate-y-0.5"
              >
                ↓
              </span>
            </a>
          </div>
        </div>

        <span className="flex shrink-0 flex-col items-end gap-5">
          {/* The parent group, straight onto the photograph.
              Reversed to white rather than left in navy and red: JSW's navy is
              almost exactly the value of the scrim behind it, so in full colour
              on this ground the mark half-disappears. A single-colour reverse
              is the standard treatment for that, and it sits with the white
              type beside it instead of fighting it. */}
          <span className="flex items-center gap-3">
            <span className="hidden font-mono text-[9px] tracking-[0.2em] text-white/45 uppercase sm:block">
              A JSW
              <br />
              Enterprise
            </span>
            <Image
              src={ASSETS.brand.jsw}
              alt="JSW"
              width={4000}
              height={1980}
              sizes="76px"
              priority
              className="h-auto w-[76px] opacity-90 brightness-0 invert drop-shadow-[0_2px_8px_rgba(0,0,0,0.45)]"
            />
          </span>

          {/* A line that draws itself down, once. Enough to say the page
              continues without asking anyone to read the word "scroll". */}
          <span
            aria-hidden="true"
            className="hidden flex-col items-center gap-3 sm:flex"
          >
            <span className="font-mono text-[9.5px] tracking-[0.28em] text-white/45 uppercase">
              Scroll
            </span>
            <span className="relative block h-14 w-px overflow-hidden bg-white/20">
              <motion.span
                className="absolute inset-x-0 top-0 block h-1/2 bg-white/80"
                animate={{ y: ["-100%", "200%"] }}
                transition={{ duration: 2.4, ease: "easeInOut", repeat: Infinity }}
              />
            </span>
          </span>
        </span>
      </motion.div>
    </section>
  );
}
