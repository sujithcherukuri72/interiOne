# WhatsApp auto-reply assets

Meta fetches these by URL when the webhook sends them, so they have to be
committed and publicly reachable on the deployed site.

Expected files — names are what `src/data/whatsapp-reply.ts` asks for:

| File | What it is | Notes |
| --- | --- | --- |
| `project-01.jpg` | Recent kitchen, Jubilee Hills | Landscape, ≤ 5 MB, JPEG or PNG |
| `project-02.jpg` | Recent kitchen, Kokapet | Same |
| `project-03.jpg` | Recent kitchen, Gachibowli | Same |
| `interione-brochure.pdf` | The catalogue | ≤ 100 MB, but keep it under 5 MB — this arrives on a phone, often on mobile data |

After adding a file, set its `ready` flag to `true` in
`src/data/whatsapp-reply.ts`. Anything left `false` is skipped, so a missing
asset costs a skipped attachment rather than a failed conversation.

Captions live in that same file — change them there, not in the filenames.
