"use client";

import { useEffect, useState } from "react";

import { messageForSection, whatsappLink } from "@/lib/whatsapp";

/** WhatsApp's glyph, drawn rather than fetched — it has to sit on our own disc. */
function WhatsAppGlyph() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-[22px] w-[22px]">
      <path
        fill="currentColor"
        d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.46 1.32 4.97L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 18.15h-.01a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.11.82.83-3.04-.2-.31a8.19 8.19 0 0 1-1.26-4.38c0-4.54 3.7-8.23 8.24-8.23a8.2 8.2 0 0 1 8.22 8.24c0 4.54-3.7 8.23-8.23 8.23Zm4.52-6.16c-.25-.12-1.47-.72-1.7-.81-.23-.08-.4-.12-.56.13-.17.25-.66.81-.81.97-.15.17-.3.19-.55.06a6.7 6.7 0 0 1-1.97-1.22 7.4 7.4 0 0 1-1.37-1.7c-.14-.25-.02-.39.11-.51.11-.11.25-.3.37-.44.12-.15.17-.25.25-.42.08-.16.04-.31-.02-.43-.06-.13-.55-1.35-.76-1.84-.2-.48-.4-.42-.55-.42h-.47c-.17 0-.43.06-.66.31-.23.25-.87.85-.87 2.07 0 1.23.89 2.41 1.01 2.58.12.16 1.74 2.66 4.22 3.73.59.25 1.05.4 1.41.52.6.19 1.14.16 1.57.1.48-.07 1.47-.6 1.68-1.19.21-.58.21-1.08.15-1.19-.06-.1-.23-.16-.48-.28Z"
      />
    </svg>
  );
}

/**
 * The floating chat button.
 *
 * Two decisions worth stating. It holds off until the hero is behind you —
 * a chat prompt over the first screen asks for a conversation before the page
 * has said anything worth having one about. And the message it prefills names
 * the section you were reading when you tapped it, because "I used the
 * estimator" and "I'd like to see the finishes" are two different leads and the
 * webhook has no other way to tell them apart.
 */
export default function WhatsAppButton() {
  const [visible, setVisible] = useState(false);
  const [section, setSection] = useState<string | null>(null);

  useEffect(() => {
    // Passive: this runs on every frame of a Lenis-smoothed scroll, and it must
    // never be the reason a scroll janks.
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>("main section[id]")
    );
    if (!sections.length) return;

    // Whichever section owns the middle of the screen is the one being read.
    const observer = new IntersectionObserver(
      (entries) => {
        const hit = entries.find((entry) => entry.isIntersecting);
        if (hit) setSection(hit.target.id);
      },
      { rootMargin: "-45% 0px -45% 0px" }
    );

    sections.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  return (
    <a
      href={whatsappLink(messageForSection(section))}
      target="_blank"
      rel="noreferrer noopener"
      data-section={section ?? ""}
      aria-label="Chat with interiOne on WhatsApp"
      className={`focus-ring group fixed right-5 bottom-[calc(1.25rem+env(safe-area-inset-bottom))] z-40 flex items-center gap-0 overflow-hidden rounded-full bg-[#25D366] py-3.5 pl-4 text-white shadow-[0_10px_30px_-10px_rgba(0,0,0,0.45)] transition-all duration-500 hover:gap-2 sm:right-8 ${
        visible
          ? "pointer-events-auto translate-y-0 opacity-100"
          : "pointer-events-none translate-y-4 opacity-0"
      }`}
      style={{ paddingRight: "1rem" }}
    >
      <WhatsAppGlyph />
      {/* Collapsed to nothing until hover — the disc is the resting state, and
          the label only exists to say what happens on a device with a pointer. */}
      <span className="max-w-0 overflow-hidden text-[13px] whitespace-nowrap tracking-[-0.005em] opacity-0 transition-all duration-500 group-hover:max-w-[9rem] group-hover:opacity-100">
        Chat with us
      </span>
    </a>
  );
}
