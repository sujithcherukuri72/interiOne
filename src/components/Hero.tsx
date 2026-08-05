import { finishes } from "@/data/finishes";
import { finishImage } from "@/lib/finish-image";
import { SHUFFLE_PRESET } from "@/lib/shuffle";
import { CoverflowCarousel, type CoverflowSlide } from "./ui/coverflow-carousel";
import Shuffle from "./ui/Shuffle";

/** The whole catalogue, not a curated six — every finish gets a turn. */
const SLIDES: CoverflowSlide[] = finishes.map((finish) => ({
  src: finishImage(finish.hex, finish.grain),
  alt: `${finish.name} — ${finish.rangeLabel} ${finish.type.toLowerCase()} finish`,
  title: finish.name,
  subtitle: `${finish.rangeLabel} · ${finish.type}`,
  meta: [
    { label: "Code", value: finish.code },
    { label: "Sheen", value: finish.sheen },
    { label: "Range", value: finish.rangeLabel },
  ],
}));

export default function Hero() {
  return (
    <section className="flex min-h-[calc(100dvh-72px)] flex-1 flex-col justify-between overflow-hidden pt-[clamp(3.5rem,10vh,7rem)] pb-[5vh]">
      {/* Two lines, each its own shuffle-in strip — "the shuffle is the
          entrance", so `animate-rise` is never layered on top of it. */}
      <div className="px-5 sm:px-8">
        <Shuffle
          {...SHUFFLE_PRESET}
          tag="h1"
          text="Forged In Steel"
          textAlign="left"
          className="text-[clamp(2.25rem,min(9vw,13vh),9rem)] leading-[0.86] font-medium tracking-[-0.045em]"
        />
        <Shuffle
          {...SHUFFLE_PRESET}
          tag="h2"
          text="Not In Sawdust"
          textAlign="left"
          className="text-[clamp(2.25rem,min(9vw,13vh),9rem)] leading-[0.86] font-medium tracking-[-0.045em] text-foreground/35"
        />
      </div>

      {/* Every finish in the catalogue, on one shelf — drag it, arrow through
          it, or just watch it settle. */}
      <div className="animate-rise mt-[2vh]" style={{ animationDelay: "180ms" }}>
        <CoverflowCarousel
          slides={SLIDES}
          showCaption
          showNavigation
          cardWidth="280px"
          cardClassName="rounded-none shadow-none bg-line"
          label="interiOne finish catalogue"
        />
      </div>
    </section>
  );
}
