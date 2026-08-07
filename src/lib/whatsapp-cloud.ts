import "server-only";

/**
 * The WhatsApp Cloud API, wrapped to the four things this site sends.
 *
 * Everything here is server-only and unprefixed by `NEXT_PUBLIC_`: the access
 * token can send messages as the business, so it must never reach a bundle.
 *
 * The one rule that shapes all of this: a business may only send free-form
 * messages inside the 24-hour window a *customer's* message opens. Every send
 * below is a reply to something the visitor just sent, which is why none of it
 * needs an approved template. Anything the studio wants to send cold — a
 * follow-up the next morning, a nudge to a lead who went quiet — is a template
 * message and a different problem.
 */

const GRAPH_VERSION = process.env.WHATSAPP_GRAPH_VERSION ?? "v23.0";

export const WHATSAPP_CONFIG = {
  phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID ?? "",
  accessToken: process.env.WHATSAPP_ACCESS_TOKEN ?? "",
  /** Echoed back to Meta during webhook verification. Any string you choose. */
  verifyToken: process.env.WHATSAPP_VERIFY_TOKEN ?? "",
  /** App secret, used to prove a delivery really came from Meta. */
  appSecret: process.env.WHATSAPP_APP_SECRET ?? "",
} as const;

export const whatsappConfigured = Boolean(
  WHATSAPP_CONFIG.phoneNumberId && WHATSAPP_CONFIG.accessToken
);

type SendResult = { ok: boolean; id?: string; error?: string };

async function send(payload: Record<string, unknown>): Promise<SendResult> {
  if (!whatsappConfigured) {
    return { ok: false, error: "WhatsApp Cloud API is not configured" };
  }

  const url = `https://graph.facebook.com/${GRAPH_VERSION}/${WHATSAPP_CONFIG.phoneNumberId}/messages`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${WHATSAPP_CONFIG.accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ messaging_product: "whatsapp", ...payload }),
      // Never cached: two identical sends are two messages, not one.
      cache: "no-store",
    });

    const body = (await response.json()) as {
      messages?: { id: string }[];
      error?: { message?: string };
    };

    if (!response.ok) {
      return {
        ok: false,
        error: body.error?.message ?? `Graph API responded ${response.status}`,
      };
    }
    return { ok: true, id: body.messages?.[0]?.id };
  } catch (error) {
    return { ok: false, error: (error as Error).message };
  }
}

export function sendText(to: string, body: string, preview = true) {
  return send({
    to,
    type: "text",
    // Off for the media captions, on for anything carrying a studio link.
    text: { body, preview_url: preview },
  });
}

/**
 * Media is sent by URL rather than uploaded first. Meta fetches it once and
 * caches it, so the file has to be publicly reachable — which everything under
 * `public/` on the deployed site is.
 */
export function sendImage(to: string, link: string, caption?: string) {
  return send({ to, type: "image", image: { link, caption } });
}

export function sendDocument(
  to: string,
  link: string,
  filename: string,
  caption?: string
) {
  return send({ to, type: "document", document: { link, filename, caption } });
}

/**
 * Up to three reply buttons. Titles are hard-capped at 20 characters by the
 * API — a longer one fails the whole message rather than truncating.
 */
export function sendButtons(
  to: string,
  body: string,
  buttons: { id: string; title: string }[]
) {
  return send({
    to,
    type: "interactive",
    interactive: {
      type: "button",
      body: { text: body },
      action: {
        buttons: buttons.slice(0, 3).map((button) => ({
          type: "reply",
          reply: { id: button.id, title: button.title.slice(0, 20) },
        })),
      },
    },
  });
}

/** Turns the visitor's message blue-ticked, so the reply reads as a reply. */
export function markRead(messageId: string) {
  return send({ status: "read", message_id: messageId });
}
