"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight, Clock, MapPin, Phone } from "lucide-react";

import { ASSETS, LOGO_MARK_SIZE } from "@/data/assets";
import { SHOWROOM } from "@/data/showrooms";
import { DIRECTIONS_URL } from "@/lib/map";
import { EASE } from "@/lib/motion";
import { HYDERABAD_AREAS, STUDIO } from "@/lib/site";
import { BOOK_VISIT_LINK } from "@/lib/whatsapp";
import StudioMap from "@/components/ui/StudioMap";

/* ponytail: haversine from STUDIO to each area's rough centre, worked out once
   and written down — not drive times, which change by the hour here. */
const NEARBY = [
  ["Jubilee Hills", "1.6"],
  ["Gachibowli", "4.7"],
  ["Banjara Hills", "4.9"],
  ["Financial District", "5.5"],
  ["Kukatpally", "7.0"],
  ["Secunderabad", "11.3"],
] as const;

export default function Showrooms() {
  return (
    <section id="showrooms" className="bg-surface py-[clamp(3.5rem,9vh,7.5rem)]">
      <div className="section-shell">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-80px" }}
          transition={{ duration: 0.8, ease: EASE }}
        >
          <p className="text-[10px] font-medium tracking-[0.28em] text-foreground/45 uppercase">
            Showroom
          </p>
          {/* One studio, said plainly. The old line claimed seven cities; the
              structured data only ever claimed this one, and the page and the
              markup have to agree. */}
          <h2 className="mt-8 max-w-[36ch] text-[clamp(1.5rem,2.6vw,2.4rem)] leading-[1.2] font-medium tracking-[-0.03em] text-balance">
            One studio. Kavuri Hills, Madhapur.
          </h2>
          <p className="mt-4 max-w-[46ch] text-[14px] leading-[1.6] tracking-[-0.01em] text-foreground/60">
            Put your hand on the finish first. Then book a designer to your
            site.
          </p>
        </motion.div>

        {/* Split: the address set large on the left, the map framed like a
            postcard on the right. Stacks address-first on a phone. */}
        <div className="mt-[clamp(2.25rem,5.5vh,4.5rem)] grid items-center gap-[clamp(2.5rem,5vw,5rem)] lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)]">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: "-60px" }}
            transition={{ duration: 0.9, ease: EASE }}
          >
            {SHOWROOM.flagship && (
              <span className="text-[10px] font-medium tracking-[0.22em] text-coral uppercase">
                Flagship studio
              </span>
            )}
            <h3 className="mt-3 text-[clamp(2rem,4.2vw,3.6rem)] leading-[0.95] font-medium tracking-[-0.045em]">
              {SHOWROOM.name}
            </h3>

            <p className="mt-6 flex items-start gap-2.5 text-[15px] leading-[1.5] text-foreground/70">
              <MapPin size={15} strokeWidth={1.75} className="mt-0.5 shrink-0" />
              {SHOWROOM.address}, {SHOWROOM.city}, {SHOWROOM.state}
            </p>
            <p className="mt-2.5 flex items-center gap-2.5 text-[14px] text-foreground/55">
              <Clock size={14} strokeWidth={1.75} />
              {SHOWROOM.hours}
            </p>
            <a
              href={SHOWROOM.phoneHref}
              className="focus-ring mt-2.5 flex w-fit items-center gap-2.5 rounded text-[14px] text-foreground/55 transition-colors duration-300 hover:text-foreground"
            >
              <Phone size={14} strokeWidth={1.75} />
              {SHOWROOM.phone}
            </a>

            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href={DIRECTIONS_URL}
                target="_blank"
                rel="noreferrer noopener"
                className="focus-ring inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-[13px] tracking-[-0.005em] text-background transition-colors duration-300 hover:bg-brown"
              >
                Get directions
                <ArrowUpRight size={14} strokeWidth={1.75} />
              </a>
              <a
                href={BOOK_VISIT_LINK}
                target="_blank"
                rel="noreferrer noopener"
                className="focus-ring inline-flex items-center gap-2 rounded-full border border-foreground/20 px-5 py-2.5 text-[13px] tracking-[-0.005em] transition-colors duration-300 hover:border-foreground/50"
              >
                Book a visit
              </a>
            </div>

            {/* How far the studio is from where people actually live. */}
            <dl className="mt-9 border-t border-foreground/15">
              {NEARBY.map(([area, km]) => (
                <div
                  key={area}
                  className="flex items-baseline gap-3 border-b border-foreground/10 py-2.5 text-[13.5px]"
                >
                  <dt className="text-foreground/70">{area}</dt>
                  <span aria-hidden="true" className="flex-1 border-b border-dotted border-foreground/20" />
                  <dd className="font-mono text-[11px] tracking-[0.08em] text-foreground/55">
                    ≈ {km} km
                  </dd>
                </div>
              ))}
            </dl>
            <p className="mt-2 font-mono text-[9.5px] tracking-[0.16em] text-foreground/40 uppercase">
              Straight-line from the studio
            </p>
          </motion.div>

          {/* The postcard. */}
          <motion.figure
            initial={{ opacity: 0, y: 36, rotate: 4 }}
            whileInView={{ opacity: 1, y: 0, rotate: 1.2 }}
            viewport={{ once: false, margin: "-60px" }}
            transition={{ duration: 1, ease: EASE }}
            className="relative bg-cream p-3 pb-12 shadow-[0_30px_60px_-30px_rgba(58,26,26,0.55)] transition-[rotate] duration-700 hover:rotate-0! sm:p-4 sm:pb-14"
          >
            <StudioMap className="h-[clamp(320px,56vh,560px)] w-full rounded-[2px]" />

            {/* Postage stamp in the corner, the perforation a dashed cream rim. */}
            <span
              aria-hidden="true"
              className="absolute -top-5 -right-3 z-10 grid h-[84px] w-[70px] rotate-6 place-items-center bg-ink shadow-md outline-2 -outline-offset-4 outline-cream outline-dashed sm:-right-5"
            >
              <span className="grid h-[60px] w-[46px] place-items-center border border-coral/60">
                <Image src={ASSETS.logo.mark} alt="" width={LOGO_MARK_SIZE.width} height={LOGO_MARK_SIZE.height} sizes="40px" className="h-auto w-8" />
              </span>
            </span>

            <figcaption className="absolute right-4 bottom-3 left-4 flex items-baseline justify-between gap-3 sm:bottom-4">
              <span className="font-serif text-[clamp(1.1rem,1.8vw,1.5rem)] leading-none text-brown italic">
                Greetings from Madhapur
              </span>
              <span className="hidden font-mono text-[9.5px] tracking-[0.18em] text-muted uppercase sm:block">
                {SHOWROOM.city} · {STUDIO.postalCode}
              </span>
            </figcaption>
          </motion.figure>
        </div>

        {/* Where a designer will actually drive for a survey.
            This is the same list the LocalBusiness `areaServed` block claims —
            an area asserted in markup but named nowhere a visitor can read it
            is a thin signal, and these are the words people search with. */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-60px" }}
          transition={{ duration: 0.7, ease: EASE }}
          className="mt-[clamp(2.5rem,6.5vh,5.5rem)] border-t border-foreground/15 pt-8"
        >
          <h3 className="font-mono text-[10px] tracking-[0.24em] text-foreground/45 uppercase">
            Hyderabad — where we survey
          </h3>

          <p className="mt-5 max-w-[62ch] text-[14px] leading-[1.65] tracking-[-0.01em] text-foreground/70">
            The Madhapur studio covers the whole city. A designer measures
            on site anywhere inside the Outer Ring Road at no charge, and three
            costed plans follow within a day.
          </p>

          <ul className="mt-6 flex flex-wrap gap-x-2 gap-y-2">
            {HYDERABAD_AREAS.map((area) => (
              <li
                key={area}
                className="rounded-full border border-line px-3 py-1.5 text-[12.5px] tracking-[-0.005em] text-foreground/60"
              >
                {area}
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}
