import crypto from "node:crypto";
import { NextResponse, after } from "next/server";

import {
  BROCHURE,
  FOLLOW_UP,
  INTENT_REPLIES,
  MENU_PROMPT,
  PROJECT_IMAGES,
  REPLY_BUTTONS,
  WELCOME,
  type ReplyIntent,
} from "@/data/whatsapp-reply";
import { forwardLead } from "@/lib/leads";
import { SITE_URL } from "@/lib/site";
import {
  WHATSAPP_CONFIG,
  markRead,
  sendButtons,
  sendDocument,
  sendImage,
  sendText,
  whatsappConfigured,
} from "@/lib/whatsapp-cloud";

/**
 * The WhatsApp Cloud API webhook.
 *
 * Meta calls this twice in its life for two different reasons: once with a GET
 * to prove we own the endpoint, and then with a POST for every message,
 * delivery receipt and read receipt on the number, forever.
 *
 * Deliveries are answered 200 immediately and the actual replies are sent in
 * `after()`. Meta re-delivers anything it does not get a prompt 200 for, and a
 * greeting plus three images plus a PDF is five sequential Graph calls — long
 * enough to earn a retry, and a retry would send the whole sequence twice.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/* ── Replay and session state ─────────────────────────────────────────────── */

/**
 * In-memory, and therefore per-instance and lost on redeploy.
 *
 * That is a real limitation and an acceptable one: the worst case is a visitor
 * who is greeted twice because their second message landed on a cold instance.
 * If this number gets busy enough for that to matter, both maps want to be a
 * KV store keyed the same way — the shape here is chosen so that swap is local.
 */
const HANDLED = new Map<string, number>();
const GREETED = new Map<string, number>();

const REPLAY_TTL = 10 * 60 * 1000;
/** Matches WhatsApp's own customer-service window. */
const SESSION_TTL = 24 * 60 * 60 * 1000;

function seen(map: Map<string, number>, key: string, ttl: number) {
  const now = Date.now();
  // Cheap sweep — these maps only ever hold minutes or hours of traffic.
  for (const [id, at] of map) if (now - at > ttl) map.delete(id);
  const hit = map.has(key);
  map.set(key, now);
  return hit;
}

/* ── Verification ─────────────────────────────────────────────────────────── */

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;

  if (
    params.get("hub.mode") === "subscribe" &&
    WHATSAPP_CONFIG.verifyToken &&
    params.get("hub.verify_token") === WHATSAPP_CONFIG.verifyToken
  ) {
    // Meta expects the challenge echoed back as bare text, not JSON.
    return new Response(params.get("hub.challenge") ?? "", { status: 200 });
  }

  return new Response("Forbidden", { status: 403 });
}

/**
 * Proves the delivery came from Meta and not from anyone who found the URL.
 *
 * Without this the endpoint is a way for a stranger to make the studio's number
 * send messages to anyone they name. The comparison is length-checked first
 * because `timingSafeEqual` throws on a length mismatch.
 */
function signatureValid(raw: string, header: string | null) {
  if (!WHATSAPP_CONFIG.appSecret) return false;
  if (!header?.startsWith("sha256=")) return false;

  const expected = crypto
    .createHmac("sha256", WHATSAPP_CONFIG.appSecret)
    .update(raw, "utf8")
    .digest("hex");
  const given = header.slice("sha256=".length);

  if (given.length !== expected.length) return false;
  return crypto.timingSafeEqual(Buffer.from(given), Buffer.from(expected));
}

/* ── Delivery ─────────────────────────────────────────────────────────────── */

type InboundMessage = {
  from: string;
  id: string;
  type: string;
  text?: { body?: string };
  interactive?: {
    type?: string;
    button_reply?: { id?: string; title?: string };
  };
  /** Present when the chat was opened from a website click-to-chat link. */
  referral?: { source_url?: string; headline?: string };
};

type Payload = {
  entry?: {
    changes?: {
      field?: string;
      value?: {
        contacts?: { wa_id?: string; profile?: { name?: string } }[];
        messages?: InboundMessage[];
        statuses?: unknown[];
      };
    }[];
  }[];
};

export async function POST(request: Request) {
  // The raw body, not the parsed one: the signature is over the exact bytes,
  // and `JSON.parse` followed by `JSON.stringify` is not byte-identical.
  const raw = await request.text();

  if (!signatureValid(raw, request.headers.get("x-hub-signature-256"))) {
    return new Response("Invalid signature", { status: 401 });
  }

  let payload: Payload;
  try {
    payload = JSON.parse(raw) as Payload;
  } catch {
    return new Response("Bad request", { status: 400 });
  }

  // Meta reads a non-200 as "try again", so accept first and work afterwards.
  after(async () => {
    try {
      await handle(payload);
    } catch (error) {
      console.error("[whatsapp] handler failed", error);
    }
  });

  return NextResponse.json({ received: true });
}

async function handle(payload: Payload) {
  if (!whatsappConfigured) {
    console.warn("[whatsapp] delivery received but no credentials configured");
    return;
  }

  for (const entry of payload.entry ?? []) {
    for (const change of entry.changes ?? []) {
      const value = change.value;
      // Delivery and read receipts arrive on the same subscription. They are
      // not conversations and there is nothing to answer.
      if (!value?.messages?.length) continue;

      const profileName = value.contacts?.[0]?.profile?.name;

      for (const message of value.messages) {
        if (seen(HANDLED, message.id, REPLAY_TTL)) continue;
        await respond(message, profileName);
      }
    }
  }
}

/** Which section of the site the chat was opened from, if the link carried it. */
function sourceOf(message: InboundMessage) {
  const url = message.referral?.source_url;
  if (!url) return undefined;
  try {
    const parsed = new URL(url);
    return parsed.hash ? parsed.hash.replace("#", "") : parsed.pathname;
  } catch {
    return undefined;
  }
}

async function respond(message: InboundMessage, profileName?: string) {
  const to = message.from;
  const receivedAt = new Date().toISOString();

  await markRead(message.id);

  /* A button press: answer that specific ask, and route it. */
  const buttonId = message.interactive?.button_reply?.id;
  if (buttonId && buttonId in INTENT_REPLIES) {
    const intent = buttonId as ReplyIntent;
    await sendText(to, INTENT_REPLIES[intent]);
    await forwardLead({
      waId: to,
      name: profileName,
      message: message.interactive?.button_reply?.title,
      intent,
      source: sourceOf(message),
      receivedAt,
    });
    return;
  }

  const body = message.text?.body;

  /* Already greeted inside the window — don't restart the sequence. */
  if (seen(GREETED, to, SESSION_TTL)) {
    await sendText(to, FOLLOW_UP);
    await forwardLead({
      waId: to,
      name: profileName,
      message: body,
      source: sourceOf(message),
      receivedAt,
    });
    return;
  }

  /* The first message. This is the sequence the visitor opened the window for.
     Sent one at a time, and a failure on any one of them is logged rather than
     thrown — a missing brochure must not cost them the greeting. */
  await sendText(to, WELCOME, false);

  for (const image of PROJECT_IMAGES.filter((i) => i.ready)) {
    const result = await sendImage(to, `${SITE_URL}${image.path}`, image.caption);
    if (!result.ok) console.error("[whatsapp] image failed", image.path, result.error);
  }

  if (BROCHURE.ready) {
    const result = await sendDocument(
      to,
      `${SITE_URL}${BROCHURE.path}`,
      BROCHURE.filename,
      BROCHURE.caption
    );
    if (!result.ok) console.error("[whatsapp] brochure failed", result.error);
  }

  await sendButtons(
    to,
    MENU_PROMPT,
    REPLY_BUTTONS.map((button) => ({ id: button.id, title: button.title }))
  );

  await forwardLead({
    waId: to,
    name: profileName,
    message: body,
    source: sourceOf(message),
    receivedAt,
  });
}
