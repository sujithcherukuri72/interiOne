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
    <section className="flex min-h-[calc(100dvh-72px)] flex-1 flex-col justify-between overflow-hidden pt-[clamp(2rem,7vh,7rem)] pb-[4vh]">
      {/* Two lines, each its own shuffle-in strip — "the shuffle is the
          entrance", so `animate-rise` is never layered on top of it.

          The size clamp is deliberately below what the space allows: each
          character sits in a shuffle window a fixed 1.2em tall, so the gap
          between the two lines is set by the font size and not by
          `leading-[0.86]`. Sized to fit the sentence, a phone got two
          over-large lines with a hole between them. */}
      {/* The page's one h1. The visible lines are the positioning, not the
          subject — a crawler landing here needs to be told in the first
          heading what this is and where it is, which "Forged In Steel" does
          not say. So the heading carries both: the sentence for machines, the
          two shuffled lines for everyone else. */}
      <h1 className="px-5 sm:px-8">
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
            className="block text-[clamp(1.75rem,min(7.5vw,11vh),8.5rem)] leading-[0.86] font-medium tracking-[-0.045em]"
          />
          <Shuffle
            {...SHUFFLE_PRESET}
            tag="span"
            text="Not In Sawdust"
            textAlign="left"
            className="block text-[clamp(1.75rem,min(7.5vw,11vh),8.5rem)] leading-[0.86] font-medium tracking-[-0.045em] text-foreground/35"
          />
        </span>
      </h1>

      {/* Every finish in the catalogue, on one shelf — drag it, arrow through
          it, or just watch it settle. */}
      <div className="animate-rise mt-[2vh]" style={{ animationDelay: "180ms" }}>
        <CoverflowCarousel
          slides={SLIDES}
          showCaption
          showNavigation
          // Fixed at 280px the centre card crowded both neighbours off a
          // 360px phone; the clamp keeps the rake readable down to 320px and
          // still tops out at the size the desktop layout was tuned for.
          cardWidth="clamp(186px, 58vw, 280px)"
          cardClassName="rounded-none shadow-none bg-line"
          label="interiOne finish catalogue"
        />
      </div>
    </section>
  );
}
