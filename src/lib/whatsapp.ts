import { BRAND } from "@/data/brand";

/**
 * Click-to-chat, the half of the WhatsApp flow that needs no account setup.
 *
 * `wa.me` takes a plain international number with no punctuation, and a
 * `text` parameter that lands in the composer already typed — the visitor still
 * has to press send, which is what opens the 24-hour window the auto-reply in
 * `api/whatsapp/webhook` is allowed to answer inside. So the prefilled text is
 * not decoration: it is the thing that makes the conversation start at all, and
 * whatever context it carries is the only context the webhook will ever see.
 */

/** Digits only, country code included — the format wa.me requires. */
export const WHATSAPP_NUMBER = BRAND.phoneHref.replace(/\D/g, "");

/** What the visitor's first message says when nothing more specific is known. */
const DEFAULT_MESSAGE = `Hi ${BRAND.name} — I'd like to know more about your steel kitchens.`;

/**
 * Openers per section, so the sales team can tell a browsing visitor from
 * someone who has already priced a kitchen. Keyed by the section `id`s in
 * `app/page.tsx`.
 */
const SECTION_MESSAGES: Record<string, string> = {
  technology: `Hi ${BRAND.name} — I was reading about the Xteel steel-composite panel. Can you tell me more?`,
  planning: `Hi ${BRAND.name} — I'd like help planning a kitchen layout.`,
  finishes: `Hi ${BRAND.name} — I'd like to see the finish range.`,
  estimate: `Hi ${BRAND.name} — I used the estimator on your site and would like this costed properly.`,
  journey: `Hi ${BRAND.name} — I'd like to know how the 30-day installation works.`,
  showrooms: `Hi ${BRAND.name} — I'd like to visit the Jubilee Hills studio.`,
  faq: `Hi ${BRAND.name} — I have a question about your kitchens.`,
  contact: `Hi ${BRAND.name} — I'd like to book a site visit.`,
};

export function messageForSection(section?: string | null) {
  if (!section) return DEFAULT_MESSAGE;
  return SECTION_MESSAGES[section] ?? DEFAULT_MESSAGE;
}

/**
 * The chat link.
 *
 * `api.whatsapp.com/send` and `wa.me` behave identically on mobile; wa.me is
 * the shorter one and is what WhatsApp itself documents, so it is what a
 * visitor sees if they long-press the link.
 */
export function whatsappLink(message = DEFAULT_MESSAGE) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
