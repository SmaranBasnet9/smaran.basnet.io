# Decision Log

One entry per architecture decision. Newest first. Each entry: what was
decided, why, and what it replaced.

---

## 2026-06-25 — Content split: Sanity for editorial, Prisma for tools/affiliate data

**Decided**: `NewsArticle` and `Guide` content migrate to Sanity as a unified
`post` document type (`postType: "news" | "guide" | "article"`, Portable
Text body), replacing the Prisma `NewsArticle`/`Guide` tables as the source
of editorial content. `Tool`, `Category`, `Review`, `ReviewVote`,
`ReviewReport`, `AffiliateOffer`, `AffiliateClick`, `Discount`,
`ComparisonEntry`, `Lead`, `AgentRun`, and all auth models stay in
Prisma/Postgres (Neon). Confirmed via `AskUserQuestion`: "Migrate content to
Sanity, keep Prisma for tools/affiliate data."

**Why**: Editorial content (news/guides/articles) benefits from Sanity's
Portable Text editing UX and CMS workflow; transactional/relational data
(tool reviews, affiliate tracking, leads) is better served by Prisma's typed
queries and existing Postgres schema. Splitting by content shape avoids
forcing either system to do what it's bad at.

**Built**: completed the remaining blueprint routes on top of this split —
`web/src/app/tag/[slug]/page.tsx`, `web/src/app/case-studies/page.tsx` +
`[slug]/page.tsx`, `web/src/app/author/smaran-basnet/page.tsx`,
`web/src/app/pillars/[slug]/page.tsx` (new route path, no prior decision
existed), `web/src/app/sitemap.ts` (combines Prisma tool slugs + Sanity
post/case-study/pillar slugs), `web/src/lib/site.ts` (new `siteUrl`/
`siteName` constants used by `metadataBase` and JSON-LD). Added JSON-LD
structured data: `Organization` in `layout.tsx`, `Review`/`Article` in
`/blog/[slug]` (covering both the Prisma tool-review branch and the Sanity
post branch), `Person` on the author page. All pages degrade gracefully via
`sanityFetch`'s null-fallback when no Sanity project is configured yet.

**Verification**: `npx tsc --noEmit` passes clean across all new/modified
files.

**Follow-on**: No live Sanity project exists yet — `NEXT_PUBLIC_SANITY_PROJECT_ID`/
`NEXT_PUBLIC_SANITY_DATASET`/`SANITY_API_TOKEN` still need to be provisioned
and added to `.env.local` before any real content renders. Whether existing
`NewsArticle`/`Guide` rows in the live Neon DB contain real content needing
migration into Sanity (vs. being seed-only) is not yet investigated.
Retiring the Flask `cms/` admin (per the original blueprint) is an
operational change to an actively-running system and should be confirmed
with the user before acting. The `https://smaranbasnet.io` placeholder in
`web/src/lib/site.ts` is a guessed domain and should be confirmed/corrected.

---

## 2026-06-25 — Trending AI cards: aimagazine-style image header (hybrid)

**Decided**: Restyle each Trending AI carousel card with an aimagazine.com-
inspired header — a gradient "image" band (per-category color, one per
`nth-child`), a circular white "TOP 5" badge in the top-left, and the
category title overlaid in white at the bottom of the band. The ranked
tool list moves below into a separate `.trending-ai-card-body`. The
horizontal slide-scroll carousel itself is unchanged — user explicitly
chose the "hybrid" option (restyle cards, don't replace carousel with the
full sidebar layout) over an `AskUserQuestion` showing a screenshot of
aimagazine.com's Top 10 section.

**Why**: User shared a screenshot of aimagazine.com's "Top 10" module and
asked for the second homepage division to look like it. No real per-
category images exist in `images/`, so CSS gradients stand in for photos
until real artwork is sourced.

**Built**: `components/trending-ai.html` (added `.trending-ai-card-media`
wrapping a `.trending-ai-badge` + `h3`, and `.trending-ai-card-body`
wrapping the existing `.trending-ai-list`); `style.css` (new
`.trending-ai-card-media`, `.trending-ai-badge`, `.trending-ai-card-body`
rules; reworked `.trending-ai-card` to `overflow: hidden` for the image
band; per-`nth-child` gradient backgrounds for cards 2-6).

**Verification**: `curl` against the running live-server returned 200 for
`components/trending-ai.html` and `index.html`.

**Follow-on**: Swap the CSS gradients for real category photography if/when
the user sources images.

---

## 2026-06-25 — Trending AI section: top-5-per-category horizontal carousel

**Decided**: Add a second homepage section, right after the news section,
showing 6 categories — AI in Marketing, AI in Data Analytics, AI in Social
Media Marketing, AI in CRM, AI in Content Creation, AI in Business
Operations — each as a card listing its top 5 real, well-known tools inline
(no click-to-expand), laid out as a horizontal slide-scroll carousel
(`scroll-snap-type: x`).

**Built**:
- `components/trending-ai.html` — new component, 6 `.trending-ai-card`s in a
  `.trending-ai-track` flex row inside a horizontally scrollable
  `.trending-ai-scroll` container. Each card is a ranked `<ol>` of 5 tools:
  - Marketing: Jasper, HubSpot AI, Surfer SEO, Persado, AdCreative.ai
  - Data Analytics: Power BI Copilot, Tableau AI, DataRobot, Qlik AutoML, Alteryx AI
  - Social Media Marketing: Hootsuite OwlyWriter, Buffer AI Assistant, Sprout Social AI, Lately AI, Ocoya
  - CRM: Salesforce Einstein, HubSpot AI CRM, Zoho Zia, Dynamics 365 Copilot, Freshsales Freddy AI
  - Content Creation: Copy.ai, Writesonic, ChatGPT, Canva Magic Studio, Grammarly
  - Business Operations: Notion AI, Asana Intelligence, Monday.com AI, ClickUp Brain, Atlassian Intelligence
- `index.html` — added `<div id="trending-ai-root"></div>` inside `<main>`,
  directly after `#news-root`.
- `app.js` — added `['trending-ai-root', 'components/trending-ai.html']` to
  the `COMPONENTS` array, consistent with the existing fetch-injection
  pattern.
- `style.css` — added `.trending-ai-section/-scroll/-track/-card/-list` rules:
  horizontally scrollable flex track with snap points, glass-card styling
  matching `.news-card`, numbered circular rank badges, and a 480px
  breakpoint shrinking card width.

**Why**: user's explicit request to put "top 5 trending AIs for [each]
category" in the homepage's second division, listing the six categories by
name. Categories and real tool names were chosen from well-known, widely
adopted products in each space rather than invented placeholders.

**Verification**: confirmed `components/trending-ai.html` and `index.html`
return HTTP 200 from local live-server on port 5500.

**Follow-on**: none currently planned.

---

## 2026-06-25 — News section: big featured + side list layout (supersedes 4-col magazine grid)

**Decided**: Replace the 4-equal-column "featured + 3 cards" news grid with a
classic magazine treatment — one large featured story (full-height image) on
the left, and the other 3 stories as a compact vertical list (small thumbnail
+ title + short excerpt + meta) on the right.

**Built**:
- `components/news-section.html` — wrapped the 3 secondary stories in a new
  `<div class="news-side-list">`, each as a `.news-card-mini` (96px square
  thumbnail + tag + title + 2-line excerpt + source line) instead of full
  `.news-card`s.
- `style.css` — `.magazine-grid` changed from `1.5fr 1fr 1fr 1fr` to
  `1.6fr 1fr` (featured + side list); featured card image now fills full
  column height (`min-height: 420px`); added `.news-side-list`,
  `.news-card-mini`, `.news-card-mini-image-wrap/-image/-body` rules; replaced
  the old 1024px/640px breakpoints (which assumed 4 cards) with a single
  860px breakpoint that stacks featured-on-top, side-list-below, plus a 480px
  tweak shrinking mini-thumbnails to 76px.

**Why**: user reviewed a screenshot of the homepage and asked for a layout
restructure of the news section; chose "big featured + side list" over an
asymmetric masonry grid or full-width banner option.

**Verification**: confirmed `index.html` still returns HTTP 200 from local
live-server on port 5500 after the markup/CSS change.

**Follow-on**: none — this only touches the news section's internal layout;
component-file boundaries from the prior decision are unchanged.

---

## 2026-06-25 — Root static homepage: split into components + one app.js bootstrap

**Decided**: User asked to break `index.html` into multiple component files
plus a single app file that pulls in all library sources, instead of one
monolithic HTML file. Chosen approach: a JS partial loader — each section
becomes its own `.html` file under `components/`, and `app.js` is the single
entry point that injects library `<link>`/`<script>` tags, fetches each
component into a placeholder `<div>`, then loads `script.js` once the DOM is
assembled.

**Built**:
- `components/header.html` — theme toggle button + site header/nav.
- `components/hero.html` — homepage hero section.
- `components/news-section.html` — the aimagazine-style magazine grid (content unchanged from the prior decision below).
- `components/contact-modal.html` — the quick-contact modal.
- `components/footer.html` — site footer.
- `app.js` — injects boxicons CSS, Google Fonts preconnects/links, and the
  three.js `<script>` tag into `<head>`; fetches the five components above
  into their root `<div>`s (`theme-toggle-root`, `hero-root`, `news-root`,
  `modal-root`, `footer-root`); then loads `script.js` last so it runs after
  the real DOM exists.
- `index.html` — reduced to a shell: `<canvas id="bg-canvas">`, the five
  placeholder roots, and a single `<script src="app.js">` tag. No more inline
  library `<link>`/`<script>` tags or hardcoded section markup.
- `script.js` — added an `onDomReady()` helper so its setup code runs
  immediately when `app.js` loads it (since `DOMContentLoaded` has already
  fired by the time components are injected), instead of waiting on an event
  that will never fire again.

**Why**: user's explicit instruction — "lets make multiple components and
multiple files for multiple purpose and one app file to put all library
sources to run." Scoped to `index.html` only for now (other pages —
about/contact/blog — keep their existing inline markup, untouched).

**Verification**: confirmed `index.html`, `app.js`, and
`components/header.html` all return HTTP 200 from a local live-server on
port 5500.

**Follow-on**: the still-pending "Trending AI" top-5-per-category
slide-scroll section (Marketing AI / Web Dev AI / Content Creation AI /
Video Generation AI) should be added as its own `components/trending-ai.html`
file plus a new root `<div>` in `index.html` and an entry in app.js's
`COMPONENTS` list, rather than being inlined directly into `index.html`,
to keep this new component structure consistent.

---

## 2026-06-25 — Root static homepage: aimagazine.com-style featured + grid layout (supersedes headline-strip)

**Decided**: User shared a screenshot of aimagazine.com's homepage grid
(one large "Featured" story with image + dark caption panel, followed by a
row of standard cards: image, tag, headline, excerpt) and confirmed this is
the layout to match. This replaces the TechCrunch-style headline-strip
treatment from earlier the same day — the headline strip is removed; the
glassmorphism `.news-card` base styling is kept and extended.

**Built**:
- `index.html`: removed the `<ul class="headline-strip">` block. Restructured
  `.news-grid` (now `.news-grid.magazine-grid`) so the first of the four real
  articles (Attentive) is marked `featured-card` and the remaining three
  (OpenAI, AdRoll, Microsoft) sit alongside it in a 4-column grid
  (`1.5fr 1fr 1fr 1fr`). No new content — same four existing `news/*.html`
  articles, only the markup/class structure changed.
- `style.css`: added `.magazine-grid` (grid layout), `.featured-card`
  treatment (taller image, dark translucent caption panel
  `rgba(10,14,26,0.85)` matching the glass aesthetic, outlined white tag pill,
  white headline/excerpt text), and `.news-card-tag-inline` (outlined tag
  moved below the excerpt for the three secondary cards, matching the
  reference screenshot instead of the prior corner-badge tag). Responsive
  fallback: 2-column at ≤1024px (featured spans both columns), 1-column at
  ≤640px.

**Verification**: `localhost:5500/index.html` returns HTTP 200 after the
change. Not yet visually screenshotted in a live browser — still worth
eyeballing the featured-card dark panel contrast and the 4-column grid at
desktop width before calling this fully final.

**Follow-on**: if more articles are added later, keep the "first item
featured, rest in equal columns" pattern rather than reverting to a flat
grid or reintroducing the headline strip, since this is now the
user-confirmed reference layout (recorded in project memory
`design_direction_homepage`).

---

## 2026-06-25 — Root static homepage: TechCrunch-style headline strip + glassmorphism news cards

**Decided**: After an earlier aimagazine.com-inspired "Cover Story" hero
section was built and then explicitly undone by the user, the user
confirmed via WebFetch of techcrunch.com's real front page that the
homepage news section (`index.html`/`style.css`, root static site, port
5500) should follow TechCrunch's denser, no-hero, tag-driven pattern
instead. Glassmorphism for the cards was confirmed against Dribbble's
documented glassmorphism recipe (translucent background + backdrop blur +
subtle border, no heavy gradients) and matched to this project's existing
`.glass-card`/theme-toggle blur primitives rather than inventing a new
visual language.

**Built**:
- New `<ul class="headline-strip">` inserted above the existing
  `.news-grid.news-feed` in `index.html`, reusing the same four real
  `news/*.html` articles already in the grid (no new content) as a
  text-only headline list with a small uppercase category tag per item —
  mirrors TechCrunch's Top Headlines block.
- `.news-card` restyled in `style.css`: background changed from solid
  `var(--surface)` to `rgba(15, 25, 48, 0.55)` (dark) /
  `rgba(255, 255, 255, 0.6)` (light, via `[data-theme="light"] .news-card`)
  with `backdrop-filter: blur(14px)` added, so cards read as glass over the
  page's canvas/background instead of a flat surface. Border, radius,
  shadow, and hover-lift behavior unchanged.

**Verification**: `localhost:5500/index.html` returns HTTP 200 after the
change. Not yet visually screenshotted in a browser — worth eyeballing the
blur contrast against the canvas background before considering this final.

**Follow-on**: if further homepage sections are added, keep using the
`.headline-strip` + glass `.news-card` pattern rather than reintroducing a
magazine-cover hero, per the user's explicit preference. Design research
sources (Dribbble, Figma community, Reddit, techcrunch.com) and this
decision are also recorded in this project's persistent assistant memory.

---

## 2026-06-25 — Hybrid homepage (AI News + AI Magazine) and a real `/blog` review section

**Decided**: User asked to use `artificialintelligence-news.com` and
`aimagazine.com` as references and "make a hybrid system in home page and
review of ai in blog section." Researched both:
- `artificialintelligence-news.com` (verified via WebFetch): dense
  news-portal structure — multi-level category nav, large hero + secondary
  featured cards, "Latest"/"Popular Posts" card grids, tag+date+view-count
  metadata on every card. The existing news-channel homepage (ticker,
  masthead, lead-story+rail, category ticker) already mirrors this.
- `aimagazine.com`: **WebFetch returned HTTP 403 Forbidden — could not be
  verified directly.** Influence on this pass is from general background
  knowledge only (B2B AI magazine conventions: large cover-feature banner,
  "Editor Score"-style framing, ranked listicle rails for reviews), not a
  confirmed fetch. Flagging this explicitly so it isn't mistaken for
  verified research later.

Built a new `/blog` section as the "AI Magazine"-style half of the hybrid,
distinct from the existing AI-News-style homepage:
- `web/src/app/blog/page.tsx`: cover-feature review banner (top-rated
  `Tool`, magazine-style with a big Editor Score box), a "Top Reviews"
  numbered listicle rail (reusing the homepage's rank-numeral pattern), and
  a dense "Latest" grid merging `Tool` reviews + `NewsArticle` + `Guide`
  sorted by date — same data-merge pattern as the homepage's lead-rail.
- `web/src/app/blog/[slug]/page.tsx`: a single polymorphic detail route.
  Tries `prisma.tool.findUnique` first (renders a long-form magazine
  review: overview, features, expert review, pros/cons, final verdict,
  CTA out to the tool + link to its `/tools/[slug]` directory listing),
  then `prisma.newsArticle.findUnique` (news article layout with source
  link), then `prisma.guide.findUnique` (guide layout with `toolRefs`),
  calling `notFound()` if none match.
- Homepage (`page.tsx`): "Editor's Pick" CTA now links to
  `/blog/${editorsPick.slug}` (the magazine review) instead of
  `/tools/${slug}` (the plain directory listing), and a new "From the
  Blog" card-grid section was added above the CTA so the homepage visibly
  surfaces the blog section — the actual "hybrid" tie-in between the two
  reference sites' patterns.
- Added "Blog" to the header nav and footer "Explore" column in
  `layout.tsx`.

**Schema decision**: No new Prisma model or migration. `Tool` already has
every field a long-form review needs (`overview`, `features`, `pros`/
`cons`, `expertReview`, `finalVerdict`, `expertRating`) and `NewsArticle`/
`Guide` already have unique `slug` columns — reusing all three via one
polymorphic route avoids a redundant "Article"/"Review" content model that
would just duplicate existing columns, consistent with this project's
running pattern of not adding speculative schema.

**Verification**: `npm run build` → Turbopack compiles, TypeScript passes,
all 15 routes generate (`/blog` static, `/blog/[slug]` dynamic, alongside
the existing 13 routes).

**Follow-on**: `/tools/[slug]` (plain directory listing) and
`/blog/[slug]` (magazine review) now both exist for `Tool` rows and
intentionally render different things — worth watching for user confusion
about which link goes where; the blog article links back to the tools
listing but not vice versa. aimagazine.com's actual layout should be
re-verified (different fetch method, or manual screenshot) if more
AI-Magazine-specific fidelity is wanted later — current cover-banner
styling is an educated guess, not a confirmed reference.

---

## 2026-06-25 — Homepage restyled as an actual news-channel front end

**Decided**: User feedback on the prior pass was direct: "the ui design is
still normal make it like a news channel fornt end" — the Hero →
Latest-strip → Editor's-pick → Categories → Top-rated layout still read
as a generic glass-card SaaS marketing page. Rewrote `page.tsx`'s
structure to borrow real news-portal conventions instead:
- **Breaking ticker**: full-bleed bar directly under the sticky header
  (outside the `max-w-6xl` container), a pulsing "Live" `Radio`-icon tag
  on a solid `bg-primary` chip, feeding a `.animate-marquee`-scrolled
  duplicated list of `NewsArticle` titles (new `@keyframes marquee` /
  `.animate-marquee` utility added to `globals.css`: `translateX(0)` →
  `translateX(-50%)`, 32s linear infinite — duplicating the list once
  makes the loop seamless).
- **Masthead**: replaced the centered hero with a left-aligned
  newspaper-style masthead — uppercase tracked-out dateline
  (`toLocaleDateString` weekday/month/day/year), a bold/black site title
  ("The AI Desk"), one-line subhead, and the CTA buttons moved to the
  right side instead of stacked center.
- **Lead story + side rail**: replaced the horizontally-scrolling
  "Latest" card strip with an asymmetric 3-column grid — the most recent
  `news`/`guide` item (by `publishedAt`) takes the left 2/3 as an
  oversized "lead story" card (bg-grain, large headline, "Breaking"/
  "Guide" badge, summary, timestamp), the next 4 items stack as a dense
  divided list in the right rail, ending in an "All headlines" link.
- **Category ticker**: categories changed from a padded 6-col card grid
  to a single-row wrap of pill chips with tool counts, styled like a
  newspaper section-jump bar.
- **Numbered reviews rail**: top-rated tool cards gained large faint
  background rank numerals (`02`, `03`, ...) — a wire-service "ranked
  list" visual cue — and section headers got a small vertical accent bar
  + bold uppercase label (`Editor's Pick`, `Reviews`) instead of plain
  `text-xl font-semibold` headings, to read more like section dividers in
  a news layout.

**Why**: A glass-card grid with a centered hero is a SaaS-marketing
pattern, not a news pattern. Real news-channel UI signals are: motion
(ticker), information density (rail of headlines), asymmetry (lead story
dominance), and typographic hierarchy via section dividers/rank numerals
rather than uniform card grids. Reused 100% of the existing
`.glass`/`.glass-hover`/`.bg-grain` utilities and oklch dark palette — no
new design-token system, just new layout/composition.

**Problem hit + fix**: The in-progress edit had temporarily dropped
`Sparkles` from the `lucide-react` import while it was still referenced
in the old Hero JSX (latent break from a partial edit mid-session). The
full Hero/ticker rewrite removed the `Sparkles` badge entirely as part of
the masthead redesign, so the dangling reference no longer exists — no
separate fix needed beyond completing the rewrite.

**Verification**: `npm run build` → Turbopack compiles, TypeScript
passes, all 13 routes generate, `/` static.

**Follow-on**: `/news` and `/guides` listing pages still use the older,
simpler card style — now even more visually inconsistent with the
homepage's news-channel treatment than before; worth a follow-up pass.
Tool logo assets in `public/logos/` remain missing.

---

## 2026-06-25 — Homepage redesigned as a news+review hybrid, seeded real-looking content

**Decided**: Seeded `NewsArticle` (6 rows) and `Guide` (4 rows) in
`prisma/seed.ts` with realistic titles/summaries and staggered
`publishedAt` timestamps (computed from a `daysAgo` field, stripped before
write), then rewrote `web/src/app/page.tsx`'s section order to:
Hero (tightened) → **Latest** strip (`NewsArticle` + `Guide` merged and
sorted by `publishedAt`, horizontally scrollable on mobile, each card
showing a type icon and `Intl.RelativeTimeFormat`-based "2d ago" label) →
**Editor's pick** (single oversized glass card, breaking grid rhythm,
linking to the tool detail page) → Categories (denser padding) →
Top-rated tools grid → CTA. Dropped the previously-proposed separate
"From the guides" section — folding guides into the Latest strip avoids
showing the same 4 guides twice on one page.

**Why**: The homepage previously had zero news-shaped content despite the
site framing itself as a "news and AI review" site — it was a pure tool
directory. A user-approved UX critique identified that news+review
hybrids need visible freshness signals (relative timestamps, mixed
content types) and editorial curation (a single dominant pick), not just
a static ranked grid.

**Schema decision**: No new `Tool.featured`/`editorsPick` column was
added. `Tool` has no such field, and adding one + a migration for a
purely presentational "pick one card to feature" concern was unnecessary
churn — the homepage instead destructures the first row off
`prisma.tool.findMany({ orderBy: { expertRating: "desc" } })` to get the
editor's pick, and slices the rest for the grid below it.

**Problem hit + fix**: `npx prisma db seed` failed ("No seed command
configured" — `prisma.config.ts` has no `migrations.seed` entry).
Worked around it by running `npx tsx prisma/seed.ts` directly; did not
add the missing config property since it wasn't required to reach the
goal. `NewsArticle.sourceUrl` values intentionally point to real
companies' stable root/blog URLs (e.g. `https://openai.com/blog`) rather
than fabricated specific article paths, to avoid presenting invented URLs
as real individual articles.

**Verification**: `npx tsx prisma/seed.ts` → `Seeded 6 categories, 13
tools, 6 news articles, 4 guides.` `npm run build` → Turbopack compiles,
TypeScript passes, all 13 routes generate (`/` static).

**Follow-on**: `/news` and `/guides` listing pages still render their own
older, simpler card layouts (built in the prior "all nav/footer routes"
pass) — not yet updated to match the new homepage's relative-time/density
treatment; revisit if visual inconsistency between `/` and `/news` stands
out. Tool logo assets in `public/logos/` are still missing.

---

## 2026-06-25 — All nav/footer routes built and verified (real Prisma data, no mocks)

**Decided**: Built every previously-404ing route referenced in
`layout.tsx`'s nav/footer: `/tools` (category-filterable listing),
`/tools/[slug]` (detail page with overview, features, pros/cons, expert
review, verdict, deals, alternatives), `/compare` (pill-toggle multi-tool
comparison via `?tools=slug1,slug2`), `/news`, `/guides`, `/deals`
(listings against `NewsArticle`/`Guide`/`Discount`), and `/about`,
`/contact`, `/privacy`, `/terms`. All are Server Components querying
Prisma directly — no mock content, no API-route indirection — and reuse
the existing `.glass`/`.glass-hover`/`.text-gradient` utility classes for
visual consistency with the homepage.

**Why**: Continues the standing instruction to develop and verify code,
not just plan it. `NewsArticle`, `Guide`, and `Discount` are unseeded, so
`/news`, `/guides`, `/deals` ship with explicit empty-state copy
("check back soon... browse tool reviews in the meantime") instead of
faking content. `/guides` renders each `Guide.body` inline on the listing
card rather than linking to a `/guides/[slug]` detail route — out of
scope for this pass since no detail route was requested; revisit if guide
content grows long enough to need its own page.

**Problem hit + fix**: No `Textarea`/`Label`/`Form` shadcn components
existed for the contact form. Rather than generate new Base UI–wrapped
components for a single field, hand-styled a native `<textarea>` using
`input.tsx`'s existing Tailwind classes, and used plain native
`<label htmlFor>` elements. The contact form submits via a Next.js Server
Action (`web/src/app/contact/actions.ts`, `"use server"`, passed directly
as `<form action={submitLead}>`) that creates a `Lead` row and redirects
back with `?success=1`/`?error=1` — keeps the page a Server Component, no
client JS or API route needed. All polymorphic buttons (e.g. "Visit
{tool.name}" linking out to the tool's own site) use the project's
Base UI `render` prop, not Radix `asChild`, consistent with the prior
homepage fix.

**Verification**: `npm run build` → Turbopack compiles, TypeScript
passes, all 13 routes generate successfully (`/about`, `/deals`,
`/guides`, `/news`, `/privacy`, `/terms` static; `/compare`, `/contact`,
`/tools`, `/tools/[slug]`, `/api/auth/[...nextauth]` dynamic).

**Follow-on**: Tool `logoUrl` seed values (e.g. `/logos/chatgpt.svg`)
still don't resolve to real files in `public/logos/` — not blocking since
no card currently renders an `<img>` for them, but worth adding actual
logo assets or an initials-based fallback before launch. `NewsArticle`,
`Guide`, `Discount` tables remain unseeded — populate or wire up a CMS
flow before these pages are meaningful to real visitors.

---

## 2026-06-25 — Homepage/layout UI executed and verified (glassmorphism, real data)

**Decided**: Executed the shadcn/ui + Framer Motion + Tailwind-utility-glass
decision below into actual code rather than leaving it planned. Replaced the
default `create-next-app` boilerplate in `web/src/app/layout.tsx` and
`page.tsx` with a real dark-glass homepage: sticky glass header with nav
(`/tools`, `/compare`, `/news`, `/guides`, `/deals`, `/about`), a hero
section, a category grid, a top-rated-tools grid, a CTA section, and a glass
footer. Added a dark, blue-violet-tinted oklch palette (`.dark` block in
`globals.css`), new `.glass`/`.glass-hover`/`.text-gradient`/`.bg-grain`
utility classes, and a fixed `.app-bg` ambient background (three blurred
radial-gradient blobs) for the "glass cards floating over an animated
gradient background" Dribbble reference. Made dark mode the permanent
default by adding `dark` directly to the root `<html>` class.

**Why**: All homepage content is sourced from the real seeded Prisma data
(`prisma/seed.ts` — 6 categories, 13 tools) via direct Server Component
queries in `page.tsx` (`prisma.tool.findMany`/`prisma.category.findMany`),
not placeholder copy — consistent with "develop the code and check if it's
working," not just plan it.

**Problem hit + fix**: This project's shadcn Button (style "base-nova") is
built on `@base-ui/react/button`, not Radix UI as training data would
assume (`web/AGENTS.md` warns about exactly this). Base UI has no `asChild`
prop — polymorphic rendering uses a `render` prop instead
(`<Button render={<Link href="/tools" />}>Browse Reviews</Button>`). Found
by reading `src/components/ui/button.tsx`'s actual prop signature
(`ButtonPrimitive.Props`) after `npm run build` failed TypeScript checking
on the Radix-style `asChild`+child pattern. Fixed all three CTA buttons.

**Verification**: `npm run build` → Turbopack compiles, TypeScript passes,
static generation succeeds; `/` prerenders as static content alongside the
dynamic `/api/auth/[...nextauth]` route.

**Follow-on**: Nav/footer links to `/tools`, `/compare`, `/news`, `/guides`,
`/deals`, `/about`, `/contact`, `/privacy`, `/terms` all 404 — only `/`
exists. Building those routes is the next deliverable. Tool `logoUrl` seed
values (e.g. `/logos/chatgpt.svg`) point to files that don't exist in
`public/logos/` yet; current cards are text/badge-only and don't reference
them, so this isn't blocking yet.

---

## 2026-06-24 — Auth: Auth.js (NextAuth) on Neon, drop Supabase entirely

**Decided**: Remove `@supabase/ssr` and `@supabase/supabase-js`. Use
`next-auth` (Auth.js v5) with the Prisma adapter, backed by the same Neon
Postgres database already used for application data. Email magic-link +
Google OAuth as the two sign-in methods (per `PLATFORM_ARCHITECTURE.md`
section 5).

**Why**: The app's data already lives 100% on Neon (`DATABASE_URL` in
`web/.env` already points at a Neon project). A partially-built version of
this app had live Supabase Auth credentials wired in as an auth-only
service, but the user confirmed they want a single Postgres provider (Neon)
for everything, not a two-vendor split. One database, one ORM (Prisma), one
auth layer on top of it — simpler ops, no second service to provision/pay
for/monitor.

**Replaces**: `web/src/lib/supabase/*` (client/server/admin Supabase
clients) — deleted. `NEXT_PUBLIC_SUPABASE_URL`,
`NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` — removed from
`.env`/`.env.example`.

**Follow-on changes**: Added `Account`, `Session`, `VerificationToken`
models to `prisma/schema.prisma` (Auth.js Prisma adapter contract). Added
`AUTH_SECRET`, `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET`, `EMAIL_SERVER`,
`EMAIL_FROM` env vars. Authorization (row ownership checks) is enforced in
API route handlers against `session.user.id`, since Neon has no
Supabase-style RLS — see `PLATFORM_ARCHITECTURE.md` section 5 and 14.

---

## 2026-06-24 — UI: Tailwind v4 + shadcn/ui + Framer Motion for glassmorphism

**Decided**: Build the component library on top of **shadcn/ui** (Radix
primitives, copy-in components, already idiomatic with the Tailwind v4
setup already in `web/`) plus **Framer Motion** for the entrance/hover
motion glassmorphism needs to feel premium rather than flat. Glass surfaces
are a small set of reusable Tailwind utility classes
(`backdrop-blur-xl bg-white/5 border border-white/10`), not a third-party
glassmorphism package.

**Why** (researched alternatives before deciding):
- **shadcn/ui** over Chakra/MUI/Mantine: it's unstyled-by-default Radix
  primitives you own the source of — required for a premium, opinionated
  dark-glass look, because Chakra/MUI fight you on deep visual customization
  and ship runtime CSS-in-JS overhead. shadcn also has the largest current
  ecosystem of Dribbble-style SaaS templates to reference/adapt.
- **Framer Motion** over React Spring/GSAP: best Next.js App Router/RSC
  compatibility and the most common choice in the premium-dark-SaaS
  Dribbble references (subtle card-hover lift, staggered fade-ins, sticky
  CTA reveal).
- **No glassmorphism npm package** (e.g. `react-glass`): these are thin
  wrappers around 3 CSS properties (`backdrop-filter`, translucent bg,
  thin border) — a dependency adds little over a Tailwind utility class,
  and we keep full control over blur radius/perf tuning per breakpoint.

**Reference direction**: dark-mode premium SaaS dashboards/marketing pages
on Dribbble — large-radius glass cards floating over a subtly animated
gradient/noise background, high-contrast white-on-near-black text,
restrained accent color (single hue) for CTAs/badges only.

**Replaces**: nothing — first UI library decision for this project.

---

## 2026-06-24 — Auth.js migration executed and verified on Neon

**Decided**: Executed the prior Auth.js/Neon decision end-to-end rather than
leaving it as a plan: rewrote `web/.env` and `web/.env.example` (removed
`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
`SUPABASE_SERVICE_ROLE_KEY`; added `AUTH_SECRET`, `AUTH_GOOGLE_ID`,
`AUTH_GOOGLE_SECRET`, `EMAIL_SERVER`, `EMAIL_FROM`), pushed the `Account`/
`Session`/`VerificationToken` schema to the live Neon database, regenerated
the Prisma client, and rebaselined the migration history.

**Why**: `prisma migrate dev` failed with "migration `0001_init` was
modified after it was applied" — the committed `0001_init/migration.sql`
no longer matched the live schema (history drift from earlier ad hoc
changes). Checked the DB first: 0 users, 13 seed tools, no real user data
at risk. Used `prisma db push --accept-data-loss` to sync the schema
directly (the only "data loss" was a lossless `Decimal` → `Decimal(65,30)`
precision widening on 13 seed rows) instead of `migrate reset`, which would
have dropped the seed data. Then rebuilt `prisma/migrations/0001_init/` from
`prisma migrate diff --from-empty --to-schema` and ran
`prisma migrate resolve --applied 0001_init` so the migration history
matches the live schema again for future `migrate dev` runs.

**Verification**: `npx prisma migrate status` → "Database schema is up to
date". `npm run build` → compiles successfully, TypeScript passes, and
`/api/auth/[...nextauth]` is generated as a dynamic route alongside the
existing static `/` page.

**Follow-on**: `prisma/migrations/0001_init/migration.sql` was regenerated
from scratch (single baseline migration) — old per-step migration history
is gone, which is acceptable pre-launch with no production deploys yet.
Next: build the actual homepage/layout UI (still default
`create-next-app` boilerplate) per the shadcn/ui + Framer Motion glass
decision above.
