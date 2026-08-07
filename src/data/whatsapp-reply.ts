import { BRAND } from "@/data/brand";
import { DIRECTIONS_URL } from "@/lib/map";
import { SITE_URL } from "@/lib/site";

/**
 * What the studio sends back, the moment a visitor's first message lands.
 *
 * Kept as data rather than buried in the webhook so the sales team can have the
 * wording changed without anyone touching the delivery logic.
 *
 * `ready` is the switch on every attachment. Meta fetches media by URL and a
 * 404 fails that send, so an asset stays `false` until the file is actually
 * committed under `public/`. With everything false the flow still works — it
 * just sends the greeting and the buttons, which is a better first impression
 * than three broken attachments.
 */

/* Paths are site-relative here and made absolute at send time — Meta's servers
   fetch them, not the visitor's browser, so they resolve against SITE_URL. */

export const WELCOME = `Thanks for writing in — this is the ${BRAND.name} studio in Jubilee Hills.

We build kitchens on JSW Xteel®: a steel-composite core instead of plywood, so nothing swells, nothing burns and there is nothing for termites to feed on.

Here is some of our recent work.`;

export type ReplyImage = {
  path: string;
  caption: string;
  ready: boolean;
};

/**
 * Three, not ten. Each one arrives as its own message and its own notification,
 * and a phone buzzing eight times in four seconds reads as spam whatever the
 * pictures are of.
 */
export const PROJECT_IMAGES: ReplyImage[] = [
  {
    path: "/assets/whatsapp/project-01.jpg",
    caption: "Jubilee Hills · L-shape in Tuscan Oak with a quartz counter",
    ready: false,
  },
  {
    path: "/assets/whatsapp/project-02.jpg",
    caption: "Kokapet · parallel kitchen, matte graphite shutters",
    ready: false,
  },
  {
    path: "/assets/whatsapp/project-03.jpg",
    caption: "Gachibowli · U-shape with full-height loft storage",
    ready: false,
  },
];

export const BROCHURE = {
  path: "/assets/whatsapp/interione-brochure.pdf",
  filename: "interiOne-Kitchens.pdf",
  caption: "Our catalogue — finishes, hardware and what each package includes.",
  ready: false,
};

/**
 * The three ways forward, offered after the work and the catalogue have been
 * sent. Titles are capped at 20 characters by the API — a longer one fails the
 * whole message rather than truncating, so these are counted.
 */
export const REPLY_BUTTONS = [
  { id: "designer", title: "Talk to a designer" },
  { id: "visit", title: "Visit the studio" },
  { id: "estimate", title: "Price my kitchen" },
] as const;

export type ReplyIntent = (typeof REPLY_BUTTONS)[number]["id"];

export const MENU_PROMPT = "What would be most useful next?";

/** What each button answers with. The lead is forwarded either way. */
export const INTENT_REPLIES: Record<ReplyIntent, string> = {
  designer: `A designer will call you shortly. If it is easier, we are on ${BRAND.phone} — Mon to Sun, 10:00 to 20:00.`,
  visit: `We are at ${BRAND.address}, open Mon to Sun, 10:00 to 20:00.

Directions: ${DIRECTIONS_URL}

Tell me a day that suits and I will keep a designer free.`,
  estimate: `Send me the wall lengths in feet — one number per wall — and I will come back with an indicative figure.

You can also run it yourself: ${SITE_URL}/#estimate`,
};

/** For a returning contact — no second welcome, no second brochure. */
export const FOLLOW_UP =
  "Thanks — that has gone to the studio team and someone will pick it up shortly.";
