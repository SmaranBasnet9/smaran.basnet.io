# Smaran daily AI articles → Sanity drafts (n8n)

A second, separate n8n workflow from `smaran-news-workflow.json`
(`README.md`). This one publishes **2 long-form articles a day**, SEO-
optimized, aimed at a Gen Z audience interested in AI tools/trends — and
writes them directly into Sanity (the CMS behind `web/` + `studio/`), not
into static HTML.

The two pipelines don't overlap and don't need to be merged:
- **News pipeline** (existing): short blurbs → GitHub PR → static homepage
  feed (`index.html`).
- **Articles pipeline** (this one): long-form articles → Sanity `article`
  drafts → reviewed/published manually in Sanity Studio.

## Pipeline steps (multi-agent, not one prompt)
Runs twice daily (08:00 and 16:00 server time). Each step is its own
OpenAI call with a distinct job:

1. **Topic Agent** — proposes one specific, narrow article topic (an AI
   tool, feature, or trend) likely to interest Gen Z. Skips/aborts the run
   if it can't produce valid JSON.
2. **Writer Agent** — writes the full 600-900 word article in the "Smaran
   voice" long-form persona (`smaran-articles-voice-prompt.md`).
3. **SEO Agent** — takes the title/body and produces an SEO title,
   description, and tags optimized for the topic's primary keyword.
4. **Image Agent** — generates an AI cover image (OpenAI image generation)
   from the article's title/excerpt.
5. **Markdown → Portable Text** (code node) — converts the article body
   into the block format Sanity's `article.body` field expects.
6. **Upload Image to Sanity** — uploads the generated image to Sanity's
   asset store, capturing the asset reference.
7. **Lookup Category** — resolves the article's category string to an
   existing Sanity `category` document reference (falls back to none if
   no match — assign one manually in Studio if so).
8. **Create Draft Article** — creates the `article` document in Sanity
   with `status: "draft"`. **Nothing is public yet** — it won't appear on
   the live site until you open it in Sanity Studio, review it, and flip
   `status` to `published`.

Any malformed/missing agent output at steps 1-3 stops the run cleanly —
no partial or junk documents get created.

## Setup

### 1. Import the workflow
In n8n: Workflows → Import from File → `smaran-articles-workflow.json`.

### 2. Reuse your OpenAI API key
Same `OPENAI_API_KEY` as the news workflow — no new key needed. Image
generation (`gpt-image-1`) uses the same key and billing.

### 3. Get your Sanity write token
In sanity.io/manage → your project → API → Tokens → Add API token, with
**Editor** (or higher) permissions so it can create documents and upload
assets. This should be the same token already used by `SANITY_API_TOKEN`
in `web/.env.local` (`web/src/lib/sanityWrite.ts`) — reuse that value here
rather than minting a separate one, unless you want it scoped/revocable
independently.

### 4. Set environment variables in n8n
- `OPENAI_API_KEY` — reuse from the news workflow
- `SANITY_PROJECT_ID` — same value as `NEXT_PUBLIC_SANITY_PROJECT_ID` in
  `web/.env.local`
- `SANITY_DATASET` — same value as `NEXT_PUBLIC_SANITY_DATASET`
- `SANITY_API_VERSION` — same value as `NEXT_PUBLIC_SANITY_API_VERSION`
  (no leading `v`, e.g. `2024-01-01`)
- `SANITY_API_TOKEN` — the write-capable token from step 3
- `ARTICLE_VOICE_SYSTEM_PROMPT` — paste the persona text from
  `smaran-articles-voice-prompt.md` (everything below the `---`) as a
  single string

### 5. Activate the workflow
Toggle it "Active" in n8n. It fires at 08:00 and 16:00 daily.

## What you'll see day to day
Twice a day, a new `article` document shows up in Sanity Studio with
`status: Draft` — title, excerpt, body, AI-generated cover image, SEO
title/description, and tags already filled in. Open it in Studio, edit
anything that needs a human touch, assign/confirm the category if the
auto-lookup didn't find a match, then change `status` to **Published**
(and `featured` if you want it on the homepage). It will not appear on
`/blog` or anywhere on the live site until you do that — `getAllArticles`/
`getArticleBySlug` only return documents where `status == "published"`
(or no `status` set, for articles created before this field existed).

## Schema dependency
This workflow depends on the `seoTitle`, `seoDescription`, `tags`, and
`status` fields on `studio/schemaTypes/article.ts`. If you ever rename or
remove those fields in the schema, update `Create Draft Article`'s mutation
body in `smaran-articles-workflow.json` to match.
