# WhatsApp

Two layers. The first works now; the second needs a Meta account and about an
hour of console work.

## Layer 1 — the chat button (live)

`components/ui/WhatsAppButton.tsx` floats bottom-right once the hero has
scrolled past. It opens WhatsApp with a message already typed, worded for
whichever section the visitor was reading — `lib/whatsapp.ts` holds those
openers. The number comes from `BRAND.phone`, so there is nothing to configure.

The visitor still has to press send. That press is what matters: it opens the
**24-hour customer service window**, and inside that window the business may
reply with anything at all. Outside it, every message must be a pre-approved
template. This is why the whole flow is built as a reply and not as an outbound
campaign.

## Layer 2 — the automatic reply

`app/api/whatsapp/webhook/route.ts`. On a visitor's first message it sends, in
order:

1. A greeting (`data/whatsapp-reply.ts` → `WELCOME`)
2. The project photographs, one message each
3. The brochure, as a PDF document
4. Three reply buttons — talk to a designer / visit the studio / price my kitchen

Then it POSTs the lead to `LEAD_WEBHOOK_URL`. A button press answers that
specific ask and forwards a second lead carrying the intent. A returning contact
inside the same 24 hours gets a short acknowledgement instead of the whole
sequence again.

### Setup

1. **Meta app.** developers.facebook.com → create an app → add the **WhatsApp**
   product. You get a test number immediately; a real number needs a verified
   WhatsApp Business Account, and a number already registered to the WhatsApp
   *app* has to be deleted from it first — a number cannot be on both.
2. **Fill in `.env.local`** from `.env.example`: `WHATSAPP_PHONE_NUMBER_ID`,
   `WHATSAPP_ACCESS_TOKEN`, `WHATSAPP_VERIFY_TOKEN` (any string you invent),
   `WHATSAPP_APP_SECRET`.
3. **Deploy**, so the webhook has a public HTTPS URL. Meta will not accept
   localhost. For local work, tunnel it (`ngrok http 3000`) and use the tunnel
   URL.
4. **Register the webhook.** Meta → WhatsApp → Configuration → Callback URL is
   `https://your-domain/api/whatsapp/webhook`, Verify Token is the string from
   step 2. Subscribe to the **messages** field. Meta will GET the endpoint and
   expect the challenge echoed back; the route does that.
5. **Drop the assets in** under `public/assets/whatsapp/` — three project
   photographs and the brochure PDF, named as `data/whatsapp-reply.ts` expects —
   then flip each `ready: false` to `true`. Until you do, the flow sends the
   greeting and the buttons and skips the attachments, which is deliberate: Meta
   fetches media by URL, and a 404 fails that send.
6. **Point `LEAD_WEBHOOK_URL`** at whatever the sales team actually watches.

### Testing

- Meta's Configuration screen has a "Test" button that fires a sample delivery.
  It will be rejected unless `WHATSAPP_APP_SECRET` is set — the route verifies
  the `X-Hub-Signature-256` HMAC on every POST, because without that check the
  endpoint is a way for a stranger to make the studio's number message anyone.
- Then send a real message from your own phone via the site's button. Watch the
  server logs: every failed send is logged with its reason.

### Known limits

- **Replay and session state are in memory** (`HANDLED`, `GREETED` in the
  route). Per-instance and lost on redeploy, so the worst case is a visitor
  greeted twice. If the number gets busy, move both to a KV store — the maps are
  keyed so that swap is local to that file.
- **Notifying sales *on WhatsApp* needs a template.** The 24-hour window belongs
  to the customer's conversation; messaging a salesperson is business-initiated,
  so it needs an approved template message. The JSON webhook avoids the problem
  entirely, which is why it is the default.
- **There is no shared agent inbox here.** Several people answering one number
  needs WhatsApp Business Platform tooling on top (Meta's own inbox, or any of
  the vendors). This repo delivers the conversation and the lead; who picks it up
  is a process decision.
