import "server-only";

/**
 * Where a WhatsApp conversation becomes a lead the sales team owns.
 *
 * Deliberately one outbound POST rather than an integration with anything in
 * particular. Whatever the studio actually runs on — a Google Sheet through
 * Zapier, a Slack channel, Zoho, an internal CRM — all of them accept a JSON
 * webhook, and none of them should be a dependency of this repo. Point
 * `LEAD_WEBHOOK_URL` at it and the mapping is done.
 *
 * A failure here is logged and swallowed on purpose: the visitor is mid-
 * conversation, and their auto-reply must not be held up by the CRM being down.
 * The message itself is still in the studio's WhatsApp inbox either way, so a
 * dropped webhook loses the routing, never the lead.
 */

export type Lead = {
  /** WhatsApp ID — the number in international format, digits only. */
  waId: string;
  /** Whatever name the contact has set on their WhatsApp profile. */
  name?: string;
  /** Their first message, verbatim. */
  message?: string;
  /** Which section of the site they tapped the button from, when known. */
  source?: string;
  /** Which button they pressed, when they pressed one. */
  intent?: string;
  receivedAt: string;
};

export async function forwardLead(lead: Lead) {
  const url = process.env.LEAD_WEBHOOK_URL;

  if (!url) {
    // Still worth a line in the log — this is how a misconfigured deployment
    // gets noticed before a week of leads has gone nowhere.
    console.info("[lead] no LEAD_WEBHOOK_URL set", JSON.stringify(lead));
    return { ok: false, error: "LEAD_WEBHOOK_URL is not set" };
  }

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...lead, channel: "whatsapp" }),
      cache: "no-store",
    });
    if (!response.ok) {
      console.error("[lead] webhook responded", response.status);
      return { ok: false, error: `Webhook responded ${response.status}` };
    }
    return { ok: true };
  } catch (error) {
    console.error("[lead] webhook failed", error);
    return { ok: false, error: (error as Error).message };
  }
}
