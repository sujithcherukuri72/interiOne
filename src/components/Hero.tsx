"use client";

import Image from "next/image";
import { motion } from "framer-motion";

import { ASSETS } from "@/data/assets";
import { HERO_MEDIA } from "@/data/kitchen-styles";
import { EASE } from "@/lib/motion";
import { SHUFFLE_PRESET } from "@/lib/shuffle";
import Shuffle from "./ui/Shuffle";

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

      {/* ── Foot ───────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: EASE, delay: 0.5 }}
        className="flex items-end justify-between gap-6 px-5 pb-[5vh] sm:px-8"
      >
        <p className="max-w-[34ch] text-[13.5px] leading-[1.6] tracking-[-0.01em] text-white/70">
          Steel-composite kitchens, built in Hyderabad and installed in 30 days.
        </p>

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
