import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import Logo from "@/components/ui/Logo";
import { AREAS, areaPath } from "@/data/areas";
import { BRAND } from "@/data/brand";
import { JOURNEY } from "@/data/journey";
import { XTEEL_FEATURES } from "@/data/technology";
import { SITE, SITE_URL, STUDIO } from "@/lib/site";
import { whatsappLink } from "@/lib/whatsapp";

/**
 * Locality landing page — "modular kitchen Kokapet" and friends.
 *
 * Server-rendered and static: plain HTML for the crawler, with one H1, a
 * unique title and description, its own canonical and a Service + breadcrumb
 * graph pointing back at the studio on the home page.
 */

export const dynamicParams = false;

export function generateStaticParams() {
  return AREAS.map(({ slug }) => ({ area: slug }));
}

type Props = { params: Promise<{ area: string }> };

const findArea = async (params: Props["params"]) => {
  const { area } = await params;
  return AREAS.find((a) => a.slug === area);
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const area = await findArea(params);
  if (!area) return {};
  const title = `Modular Kitchens & Kitchen Interiors in ${area.name}`;
  const description = `Modular kitchen designers for ${area.name}, Hyderabad. Termite-proof, fire-safe, plywood-free steel kitchens on JSW Xteel® — free site visit, 3 costed designs, installed in 30 days. Call ${BRAND.phone}.`;
  return {
    title,
    description,
    keywords: [
      `modular kitchen ${area.name}`,
      `modular kitchens in ${area.name}`,
      `kitchen interiors ${area.name}`,
      `kitchen interior designers ${area.name}`,
      `steel kitchen ${area.name}`,
      `kitchen renovation ${area.name}`,
      `modular kitchen ${area.name} Hyderabad`,
    ],
    alternates: { canonical: areaPath(area.name) },
    openGraph: { title, description, url: areaPath(area.name) },
  };
}

export default async function AreaPage({ params }: Props) {
  const area = await findArea(params);
  if (!area) notFound();

  const url = `${SITE_URL}${areaPath(area.name)}`;
  const nearby = AREAS.filter((a) => a.slug !== area.slug);
  const chat = whatsappLink(
    `Hi ${BRAND.name} — I'd like a modular kitchen for my home in ${area.name}.`
  );

  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `${url}#service`,
        name: `Modular kitchen design and installation in ${area.name}`,
        serviceType: "Modular kitchen",
        description: area.note,
        provider: { "@id": `${SITE_URL}/#studio` },
        areaServed: { "@type": "Place", name: `${area.name}, Hyderabad` },
        url,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: SITE.name, item: `${SITE_URL}/` },
          { "@type": "ListItem", position: 2, name: `Modular kitchens in ${area.name}`, item: url },
        ],
      },
    ],
  };

  return (
    <main className="flex-1 bg-background pb-20 text-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
      />

      <header className="section-shell flex h-[72px] items-center border-b border-line">
        <Link href="/" aria-label="interiOne — home" className="focus-ring rounded">
          <Logo className="text-[17px] sm:text-[19px]" variant="dark" />
        </Link>
      </header>

      <div className="section-shell mx-auto max-w-5xl">
        <nav aria-label="Breadcrumb" className="mt-8 font-mono text-[11px] tracking-[0.18em] text-foreground/50 uppercase">
          <Link href="/" className="hover:text-foreground">Home</Link> / {area.name}
        </nav>

        <h1 className="mt-6 max-w-[22ch] text-[clamp(2rem,5vw,4rem)] leading-[1.05] font-medium tracking-[-0.035em] text-balance">
          Modular kitchens in {area.name}, Hyderabad
        </h1>

        <p className="mt-6 max-w-[62ch] text-[clamp(1.05rem,1.6vw,1.3rem)] leading-[1.6] text-foreground/80">
          {area.note}
        </p>
        <p className="mt-4 max-w-[62ch] text-[clamp(1.05rem,1.6vw,1.3rem)] leading-[1.6] text-foreground/80">
          Every {SITE.name} kitchen is built on JSW Xteel® — a steel-composite
          core made by {BRAND.partner}, {BRAND.partnerParent.toLowerCase()} —
          instead of plywood or MDF. A designer from our Madhapur studio
          measures your {area.name} home for free and returns three costed
          designs, and the kitchen is installed in 30 days.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <a href={chat} target="_blank" rel="noopener noreferrer" className="focus-ring rounded-full bg-foreground px-6 py-3 text-[14px] text-background">
            Book a free site visit in {area.name}
          </a>
          <a href={BRAND.phoneHref} className="focus-ring rounded-full border border-line px-6 py-3 text-[14px]">
            Call {BRAND.phone}
          </a>
        </div>

        <section className="mt-16">
          <h2 className="text-[clamp(1.4rem,2.6vw,2rem)] font-medium tracking-[-0.02em]">
            Why a steel-composite kitchen for your {area.name} home
          </h2>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2">
            {XTEEL_FEATURES.map((f) => (
              <li key={f.id} className="rounded-xl border border-line p-5">
                <h3 className="font-medium">{f.title} — {f.claim}</h3>
                <p className="mt-2 text-foreground/70">{f.description}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-16">
          <h2 className="text-[clamp(1.4rem,2.6vw,2rem)] font-medium tracking-[-0.02em]">
            From site visit to installed kitchen in 30 days
          </h2>
          <ol className="mt-6 grid gap-3">
            {JOURNEY.map((j) => (
              <li key={j.step} className="flex gap-4 border-b border-line pb-3">
                <span className="w-24 shrink-0 font-mono text-[12px] text-foreground/50 uppercase">{j.day}</span>
                <span>
                  <strong className="font-medium">{j.title}.</strong>{" "}
                  <span className="text-foreground/70">{j.description}</span>
                </span>
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-16">
          <h2 className="text-[clamp(1.4rem,2.6vw,2rem)] font-medium tracking-[-0.02em]">
            Visit the studio
          </h2>
          <p className="mt-4 text-foreground/80">
            {STUDIO.streetAddress}, {STUDIO.locality} {STUDIO.postalCode} · Open daily{" "}
            {STUDIO.opens}–{STUDIO.closes} · <a href={BRAND.phoneHref} className="underline">{BRAND.phone}</a> ·{" "}
            <a href={`mailto:${BRAND.email}`} className="underline">{BRAND.email}</a>
          </p>
        </section>

        <section className="mt-16">
          <h2 className="font-mono text-[11px] tracking-[0.2em] text-foreground/50 uppercase">
            Modular kitchens across Hyderabad
          </h2>
          <ul className="mt-4 flex flex-wrap gap-2">
            {nearby.map((a) => (
              <li key={a.slug}>
                <Link href={areaPath(a.name)} className="block rounded-full border border-line px-3 py-1.5 text-[13px] text-foreground/70 hover:text-foreground">
                  Modular kitchen {a.name}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}
