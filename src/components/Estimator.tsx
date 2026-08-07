"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";

import { EASE } from "@/lib/motion";
import { LAYOUTS } from "@/data/layouts";
import type { RangeId } from "@/data/finishes";
import {
  COUNTERTOPS,
  EXTRAS,
  LAYOUT_DEFAULTS,
  RANGE_RATES,
  RUN_MAX,
  RUN_MIN,
  SPREAD,
  STORAGE,
  type CountertopId,
  type ExtraId,
  type StorageId,
} from "@/data/estimator";

/** â‚¹4.62 L above a lakh, plain Indian grouping below it. */
function money(n: number) {
  if (n >= 100000) {
    const l = n / 100000;
    return `â‚¹${l.toFixed(l >= 10 ? 1 : 2)} L`;
  }
  return `â‚¹${new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(n)}`;
}

const RANGE_IDS: RangeId[] = ["select", "premier", "signature"];

export default function Estimator() {
  const [layoutId, setLayoutId] = useState(LAYOUTS[0].id);
  const [run, setRun] = useState(LAYOUT_DEFAULTS[LAYOUTS[0].id]);
  const [range, setRange] = useState<RangeId>("premier");
  const [counter, setCounter] = useState<CountertopId>("granite");
  const [storage, setStorage] = useState<StorageId[]>(["drawers"]);
  const [extras, setExtras] = useState<ExtraId[]>(["chimney", "hob", "sink"]);

  // Changing layout resets the run to that layout's typical length â€” the
  // number people came in with, which they can then push either way.
  const pickLayout = (id: string) => {
    setLayoutId(id);
    setRun(LAYOUT_DEFAULTS[id]);
  };

  const toggle = <T extends string>(
    list: T[],
    set: (v: T[]) => void,
    id: T,
  ) => set(list.includes(id) ? list.filter((x) => x !== id) : [...list, id]);

  const lines = useMemo(() => {
    const cabinetry = RANGE_RATES[range].perFoot * run;
    const countertop =
      (COUNTERTOPS.find((c) => c.id === counter)?.perFoot ?? 0) * run;
    const storageTotal = STORAGE.filter((s) => storage.includes(s.id)).reduce(
      (sum, s) => sum + s.perFoot * run,
      0,
    );
    const extrasTotal = EXTRAS.filter((e) => extras.includes(e.id)).reduce(
      (sum, e) => sum + e.price,
      0,
    );

    return [
      { label: "Cabinetry", value: cabinetry },
      { label: "Countertop", value: countertop },
      { label: "Added storage", value: storageTotal },
      { label: "Units & appliances", value: extrasTotal },
    ];
  }, [range, run, counter, storage, extras]);

  const mid = lines.reduce((sum, l) => sum + l.value, 0);
  const low = Math.round((mid * (1 - SPREAD)) / 1000) * 1000;
  const high = Math.round((mid * (1 + SPREAD)) / 1000) * 1000;

  return (
    <section id="estimate" className="bg-surface py-[clamp(3.5rem,9vh,7.5rem)]">
      <div className="section-shell">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-100px" }}
          transition={{ duration: 0.8, ease: EASE }}
        >
          <p className="font-mono text-[11px] tracking-[0.28em] text-foreground/45 uppercase">
            Estimate
          </p>
          <h2 className="mt-8 max-w-[18ch] text-[clamp(1.9rem,3.4vw,3rem)] leading-[1.05] font-medium tracking-[-0.035em] text-balance">
            Six answers and you have a number
          </h2>
          <p className="mt-6 max-w-[46ch] text-[15px] leading-[1.65] tracking-[-0.01em] text-muted">
            Indicative, not a quote â€” but built on the same rates the studio
            works from, so it lands close. The survey replaces it with a firm
            figure.
          </p>
        </motion.div>

        <div className="mt-16 grid gap-y-14 md:grid-cols-12 md:gap-x-8">
          {/* â”€â”€ Controls â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
          <div className="flex flex-col gap-10 md:col-span-7">
            <Field index="01" label="Layout">
              <Segmented
                options={LAYOUTS.map((l) => ({ id: l.id, label: l.name }))}
                value={layoutId}
                onChange={pickLayout}
              />
            </Field>

            <Field
              index="02"
              label="Counter run"
              aside={`${run} ft`}
            >
              <input
                type="range"
                min={RUN_MIN}
                max={RUN_MAX}
                step={1}
                value={run}
                onChange={(e) => setRun(Number(e.target.value))}
                aria-label="Counter run in feet"
                className="estimator-range mt-1 w-full"
              />
              <div className="mt-3 flex justify-between font-mono text-[10px] tracking-[0.16em] text-muted uppercase">
                <span>{RUN_MIN} ft</span>
                <span>{RUN_MAX} ft</span>
              </div>
            </Field>

            <Field index="03" label="Finish range">
              <Segmented
                options={RANGE_IDS.map((id) => ({
                  id,
                  label: RANGE_RATES[id].label,
                }))}
                value={range}
                onChange={(v) => setRange(v as RangeId)}
              />
              <p className="mt-3 text-[13px] leading-[1.55] text-muted">
                {RANGE_RATES[range].note} Â·{" "}
                <span className="font-mono text-[11px] tracking-[0.1em] text-foreground/60">
                  {money(RANGE_RATES[range].perFoot)}/FT
                </span>
              </p>
            </Field>

            <Field index="04" label="Countertop">
              <Segmented
                options={COUNTERTOPS.map((c) => ({ id: c.id, label: c.label }))}
                value={counter}
                onChange={(v) => setCounter(v as CountertopId)}
              />
            </Field>

            <Field index="05" label="Added storage">
              <div className="flex flex-col gap-3">
                {STORAGE.map((s) => (
                  <Check
                    key={s.id}
                    checked={storage.includes(s.id)}
                    onChange={() => toggle(storage, setStorage, s.id)}
                    label={s.label}
                    detail={s.detail}
                  />
                ))}
              </div>
            </Field>

            <Field index="06" label="Units & appliances">
              <div className="flex flex-wrap gap-2">
                {EXTRAS.map((e) => {
                  const on = extras.includes(e.id);
                  return (
                    <button
                      key={e.id}
                      type="button"
                      onClick={() => toggle(extras, setExtras, e.id)}
                      aria-pressed={on}
                      className={`focus-ring rounded-full border px-4 py-2 text-[13px] tracking-[-0.005em] transition-colors duration-300 ${
                        on
                          ? "border-foreground/45 bg-foreground/[0.06] text-foreground"
                          : "border-line text-foreground/50 hover:border-foreground/30 hover:text-foreground"
                      }`}
                    >
                      {e.label}
                      <span className="ml-2 font-mono text-[10px] tracking-[0.1em] text-muted">
                        {money(e.price)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </Field>
          </div>

          {/* â”€â”€ Running total â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
          <div className="md:col-span-4 md:col-start-9">
            <div className="md:sticky md:top-[16vh]">
              <div className="border border-foreground/15 bg-background p-6 sm:p-7">
                <p className="font-mono text-[10px] tracking-[0.22em] text-muted uppercase">
                  Indicative total
                </p>

                <p className="mt-5 text-[clamp(1.8rem,3vw,2.5rem)] leading-[1.05] font-medium tracking-[-0.04em] tabular-nums">
                  {money(low)}
                  <span className="text-foreground/30"> â€“ </span>
                  {money(high)}
                </p>

                <ul className="mt-8 flex flex-col gap-3 border-t border-line pt-6">
                  {lines.map((line) => (
                    <li
                      key={line.label}
                      className={`flex items-baseline justify-between gap-4 text-[13.5px] tracking-[-0.01em] transition-opacity duration-300 ${
                        line.value === 0 ? "opacity-35" : ""
                      }`}
                    >
                      <span className="text-muted">{line.label}</span>
                      <span className="tabular-nums text-foreground/80">
                        {money(line.value)}
                      </span>
                    </li>
                  ))}
                </ul>

                <p className="mt-7 border-t border-line pt-5 text-[12.5px] leading-[1.6] text-muted">
                  Excludes civil work, electrical points and taxes. Site
                  conditions move the final figure â€” the survey settles it.
                </p>

                <a
                  href="#contact"
                  className="focus-ring mt-7 inline-flex w-full items-center justify-between gap-3 rounded-full bg-ink px-5 py-3 text-[13px] tracking-[-0.005em] text-white transition-opacity duration-300 hover:opacity-85"
                >
                  Get this costed properly
                  <span aria-hidden="true">â†’</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* On a phone the total card is a full screen below the last control,
            so every answer is given blind and the number is a scroll away.
            This rail keeps it in frame while the fields are being worked, and
            `sticky` inside the section means it appears with the estimator and
            leaves with it â€” no page-level furniture. */}
        <div
          aria-hidden="true"
          className="sticky bottom-0 z-20 -mx-5 mt-12 flex items-center justify-between gap-4 border-t border-foreground/15 bg-surface/95 px-5 py-3 backdrop-blur-sm md:hidden"
        >
          <span className="font-mono text-[9.5px] tracking-[0.2em] text-muted uppercase">
            Indicative
          </span>
          <span className="text-[17px] font-medium tracking-[-0.03em] tabular-nums">
            {money(low)}
            <span className="text-foreground/30"> â€“ </span>
            {money(high)}
          </span>
        </div>
      </div>
    </section>
  );
}

/* â”€â”€ Small parts â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */

function Field({
  index,
  label,
  aside,
  children,
}: {
  index: string;
  label: string;
  aside?: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="border-t border-line pt-6">
      <legend className="sr-only">{label}</legend>
      <div className="mb-5 flex items-baseline justify-between gap-4">
        <span className="flex items-baseline gap-4">
          <span className="font-mono text-[10px] tracking-[0.18em] text-muted tabular-nums">
            {index}
          </span>
          <span className="text-[15px] tracking-[-0.015em] text-foreground">
            {label}
          </span>
        </span>
        {aside && (
          <span className="font-mono text-[13px] tracking-[0.06em] text-coral tabular-nums">
            {aside}
          </span>
        )}
      </div>
      {children}
    </fieldset>
  );
}

function Segmented({
  options,
  value,
  onChange,
}: {
  options: { id: string; label: string }[];
  value: string;
  onChange: (id: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const on = option.id === value;
        return (
          <button
            key={option.id}
            type="button"
            onClick={() => onChange(option.id)}
            aria-pressed={on}
            className={`focus-ring rounded-full border px-4 py-2 text-[13px] tracking-[-0.005em] transition-colors duration-300 ${
              on
                ? "border-transparent bg-ink text-white"
                : "border-line text-foreground/55 hover:border-foreground/30 hover:text-foreground"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

function Check({
  checked,
  onChange,
  label,
  detail,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
  detail: string;
}) {
  return (
    <label className="group flex cursor-pointer items-start gap-4">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="peer sr-only"
      />
      {/* A drawn tick rather than a native box, to match the plan drawings. */}
      <span
        aria-hidden="true"
        className={`mt-[0.15em] flex h-4 w-4 shrink-0 items-center justify-center border transition-colors duration-300 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 ${
          checked ? "border-coral bg-coral" : "border-foreground/30"
        }`}
      >
        <svg viewBox="0 0 12 12" className="h-2.5 w-2.5">
          <path
            d="M2 6.4 4.6 9 10 3.2"
            fill="none"
            stroke="white"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity={checked ? 1 : 0}
          />
        </svg>
      </span>
      <span>
        <span className="block text-[14px] tracking-[-0.01em] text-foreground/85">
          {label}
        </span>
        <span className="mt-0.5 block text-[12.5px] leading-[1.5] text-muted">
          {detail}
        </span>
      </span>
    </label>
  );
}
