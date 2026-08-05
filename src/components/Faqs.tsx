"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { EASE } from "@/lib/motion";
import { FAQS } from "@/data/faqs";

/**
 * An index, not an accordion.
 *
 * Each row is numbered like a drawing register, and opening one indents it
 * and drops a coral rule down the answer — so an open question reads as a
 * marked-up page rather than a box that grew. One open at a time keeps the
 * list scannable, which is the whole job of an FAQ.
 */
export default function Faqs() {
  const [openId, setOpenId] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  const marked = FAQS.find((f) => f.id === (hovered ?? openId));

  return (
    <section id="faq" className="bg-background py-[14vh]">
      <div className="section-shell">
        <div className="grid gap-y-14 md:grid-cols-12 md:gap-x-8">
          {/* ── Sticky index head ────────────────────────────────────── */}
          <div className="md:col-span-4">
            <div className="md:sticky md:top-[18vh]">
              <p className="font-mono text-[11px] tracking-[0.28em] text-foreground/45 uppercase">
                Questions
              </p>

              <h2 className="mt-10 max-w-[14ch] text-[clamp(1.9rem,3.4vw,3rem)] leading-[1.05] font-medium tracking-[-0.035em] text-balance">
                Everything people ask before they sign
              </h2>

              {/* The tag of whatever row you are pointing at — a quiet
                  read-out that makes the list feel instrumented. */}
              <div className="mt-10 flex h-6 items-center gap-3">
                <span className="h-1.5 w-1.5 rounded-full bg-coral" />
                <AnimatePresence mode="wait">
                  <motion.span
                    key={marked?.id ?? "idle"}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.25, ease: EASE }}
                    className="font-mono text-[10px] tracking-[0.22em] text-muted uppercase"
                  >
                    {marked ? marked.tag : `${FAQS.length} entries`}
                  </motion.span>
                </AnimatePresence>
              </div>

              <p className="mt-8 max-w-[32ch] text-[14px] leading-[1.6] tracking-[-0.01em] text-muted">
                Anything not covered here, the studio will answer on the phone
                in five minutes.
              </p>
            </div>
          </div>

          {/* ── The register ─────────────────────────────────────────── */}
          <div className="md:col-span-7 md:col-start-6">
            <ul className="border-t border-line">
              {FAQS.map((faq, i) => {
                const open = openId === faq.id;
                const panelId = `faq-panel-${faq.id}`;

                return (
                  <li
                    key={faq.id}
                    className="border-b border-line"
                    onMouseEnter={() => setHovered(faq.id)}
                    onMouseLeave={() => setHovered(null)}
                  >
                    <h3>
                      <button
                        type="button"
                        onClick={() => setOpenId(open ? null : faq.id)}
                        aria-expanded={open}
                        aria-controls={panelId}
                        className="focus-ring group flex w-full items-start gap-5 py-6 text-left sm:gap-7"
                      >
                        <span
                          className={`mt-[0.35em] font-mono text-[10px] tracking-[0.18em] tabular-nums transition-colors duration-300 ${
                            open ? "text-coral" : "text-muted"
                          }`}
                        >
                          {String(i + 1).padStart(2, "0")}
                        </span>

                        <span
                          className={`flex-1 text-[clamp(1.05rem,1.7vw,1.35rem)] leading-[1.35] tracking-[-0.02em] transition-[color,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                            open
                              ? "translate-x-1 text-foreground"
                              : "text-foreground/70 group-hover:translate-x-1 group-hover:text-foreground"
                          }`}
                        >
                          {faq.question}
                        </span>

                        {/* Plus rotating to minus — one bar turns, the other
                            fades, so the mark never looks like it spun. */}
                        <span
                          aria-hidden="true"
                          className="relative mt-[0.5em] block h-3 w-3 shrink-0"
                        >
                          <span
                            className={`absolute top-1/2 left-0 h-px w-3 -translate-y-1/2 transition-colors duration-300 ${
                              open ? "bg-coral" : "bg-foreground/60"
                            }`}
                          />
                          <span
                            className={`absolute top-0 left-1/2 h-3 w-px -translate-x-1/2 origin-center transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                              open
                                ? "scale-y-0 bg-coral opacity-0"
                                : "bg-foreground/60"
                            }`}
                          />
                        </span>
                      </button>
                    </h3>

                    <AnimatePresence initial={false}>
                      {open && (
                        <motion.div
                          id={panelId}
                          key="panel"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.5, ease: EASE }}
                          className="overflow-hidden"
                        >
                          <div className="flex gap-5 pb-8 sm:gap-7">
                            {/* The rule drops from the number column, marking
                                the answer as belonging to that entry. */}
                            <motion.span
                              initial={{ scaleY: 0 }}
                              animate={{ scaleY: 1 }}
                              exit={{ scaleY: 0 }}
                              transition={{ duration: 0.5, ease: EASE }}
                              className="ml-[0.6rem] w-px origin-top bg-coral/60"
                            />
                            <p className="max-w-[52ch] flex-1 text-[14.5px] leading-[1.7] tracking-[-0.01em] text-muted">
                              {faq.answer}
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
