# Smaran Basnet AI Tools Platform — Architecture Document

Full replacement of smaranbasnet.com.np. A G2/Capterra-style AI tool discovery
and review marketplace, with a personal-brand layer (authority, news,
consulting leads) folded in as sections rather than a separate site.

Stack: Next.js (App Router) + TypeScript + TailwindCSS + Neon (serverless
Postgres) + Prisma + Auth.js (NextAuth, email + Google OAuth) + Vercel
Blob/Cloudflare R2 (file storage) + OpenAI + Claude + n8n.

---

## 1. Information Architecture

```
/                          Home — hero, featured tools, trending news, top deals, CTA to consult
/reviews                   AI Reviews — browse/filter all tool reviews
/reviews/[category]        e.g. /reviews/writing-assistants
/tool/[slug]               Single tool review page (the core unit)
/compare                   Compare Tools — picker UI
/compare/[slugA]-vs-[slugB]  Generated comparison page (SEO gold)
/news                      Tech News — AI/tech news feed (existing pipeline output)
/news/[slug]               Single news article
/guides                    Guides — "best AI tools for X", how-tos
/guides/[slug]             Single guide
/deals                     Deals — active discount codes, indexed by tool
/about                     About Smaran Basnet — authority/bio page
/contact                   Contact — consulting lead form
/submit-tool               Vendor tool submission (revenue: paid featured listing)
/account                   User dashboard (reviews written, votes, saved tools)
/account/reviews/new       Leave a review (auth-gated)
/admin                     Internal moderation + analytics dashboard (Smaran only)
```

Navigation: Home · AI Reviews · Compare · News · Guides · Deals · About · Contact.
Footer: category index (for SEO), legal, affiliate disclosure (required — FTC).

---

## 2. User Flows

**Visitor discovering a tool**
Land on Home/category → filter by use case/pricing/rating → open `/tool/[slug]`
→ read Overview/Pricing/Pros-Cons → scroll to Affiliate Offer + Discount →
click out via tracked affiliate link → (optional) return and leave a review.

**Comparing tools**
`/compare` → pick 2-3 tools → generated side-by-side table → click through to
whichever wins → affiliate link.

**Leaving a review**
Visitor → Auth.js sign-in (magic-link email or Google OAuth) →
`/account/reviews/new?tool=slug` →
rating + structured fields (used-for, pros, cons, would-recommend) → submitted
as `pending` → Moderation queue → published → visible on tool page, author
gets reputation points.

**Consulting lead**
Any tool/guide page → "Need help choosing/implementing?" CTA → `/contact` form
→ stored as a lead with source-page attribution → Smaran follow-up.

**Vendor submission (revenue)**
`/submit-tool` → vendor fills tool data + picks tier (Free listing / Featured /
Sponsored placement) → Stripe checkout for paid tiers → enters Research Agent
pipeline for verification before publish.

---

## 3. Database Schema (Prisma / PostgreSQL)

```prisma
model User {
  id            String   @id @default(uuid())
  email         String   @unique
  emailVerified DateTime?
  name          String?
  avatarUrl     String?
  role          Role     @default(USER)
  reputation    Int      @default(0)
  createdAt     DateTime @default(now())
  accounts      Account[]
  sessions      Session[]
  reviews       Review[]
  votes         ReviewVote[]
  reports       ReviewReport[]
  leads         Lead[]
}

enum Role { USER MODERATOR ADMIN }

// Auth.js (NextAuth) Prisma adapter models
model Account {
  id                String  @id @default(uuid())
  userId            String
  user              User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  type              String
  provider          String
  providerAccountId String
  refresh_token     String?
  access_token      String?
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String?
  session_state     String?
  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(uuid())
  sessionToken String   @unique
  userId       String
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  expires      DateTime
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime
  @@unique([identifier, token])
}

model Tool {
  id              String   @id @default(uuid())
  slug            String   @unique
  name            String
  tagline         String
  logoUrl         String
  websiteUrl      String
  categoryId      String
  category        Category @relation(fields: [categoryId], references: [id])
  pricingModel    String   // "freemium" | "paid" | "free" | "contact"
  startingPrice   Decimal?
  overview        String   @db.Text
  features        Json     // [{title, description}]
  pros            String[]
  cons            String[]
  bestFor         String[]
  expertReview    String   @db.Text
  finalVerdict    String   @db.Text
  expertRating    Decimal  // 0-5, set by Review Writer Agent + Smaran review
  status          ToolStatus @default(DRAFT)
  sponsoredTier   SponsorTier @default(NONE)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  reviews         Review[]
  alternatives    ToolAlternative[] @relation("ToolToAlt")
  alternativeOf   ToolAlternative[] @relation("AltToTool")
  affiliateOffers AffiliateOffer[]
  discounts       Discount[]
  comparisons     ComparisonEntry[]
}

enum ToolStatus { DRAFT IN_REVIEW PUBLISHED ARCHIVED }
enum SponsorTier { NONE FEATURED SPONSORED }

model ToolAlternative {
  toolId    String
  tool      Tool @relation("ToolToAlt", fields: [toolId], references: [id])
  altToolId String
  altTool   Tool @relation("AltToTool", fields: [altToolId], references: [id])
  @@id([toolId, altToolId])
}

model Category {
  id    String @id @default(uuid())
  slug  String @unique
  name  String
  tools Tool[]
}

model Review {
  id          String   @id @default(uuid())
  toolId      String
  tool        Tool     @relation(fields: [toolId], references: [id])
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  rating      Int      // 1-5
  usedFor     String
  pros        String
  cons        String
  body        String   @db.Text
  status      ReviewStatus @default(PENDING)
  helpfulCount Int     @default(0)
  createdAt   DateTime @default(now())
  votes       ReviewVote[]
  reports     ReviewReport[]

  @@index([toolId, status])
}

enum ReviewStatus { PENDING PUBLISHED REJECTED }

model ReviewVote {
  id        String  @id @default(uuid())
  reviewId  String
  review    Review  @relation(fields: [reviewId], references: [id])
  userId    String
  user      User    @relation(fields: [userId], references: [id])
  value     Int     // +1 / -1
  @@unique([reviewId, userId])
}

model ReviewReport {
  id        String  @id @default(uuid())
  reviewId  String
  review    Review  @relation(fields: [reviewId], references: [id])
  userId    String
  user      User    @relation(fields: [userId], references: [id])
  reason    String
  status    ReportStatus @default(OPEN)
  createdAt DateTime @default(now())
}

enum ReportStatus { OPEN ACTIONED DISMISSED }

model AffiliateOffer {
  id          String   @id @default(uuid())
  toolId      String
  tool        Tool     @relation(fields: [toolId], references: [id])
  network     String   // "direct" | "impact" | "partnerstack" | ...
  baseUrl     String
  trackingParam String  // appended param e.g. ?ref=smaranbasnet
  commissionType String // "percent" | "flat" | "cpa"
  commissionValue Decimal
  clicks      AffiliateClick[]
}

model AffiliateClick {
  id          String   @id @default(uuid())
  offerId     String
  offer       AffiliateOffer @relation(fields: [offerId], references: [id])
  sessionId   String
  referrerPage String
  userAgent   String?
  ipHash      String   // hashed, never raw IP
  clickedAt   DateTime @default(now())
  converted   Boolean  @default(false)
}

model Discount {
  id          String   @id @default(uuid())
  toolId      String
  tool        Tool     @relation(fields: [toolId], references: [id])
  code        String?
  description String
  expiresAt   DateTime?
  exclusive   Boolean  @default(false)
}

model NewsArticle {
  id        String   @id @default(uuid())
  slug      String   @unique
  title     String
  summary   String
  body      String   @db.Text
  sourceUrl String
  publishedAt DateTime @default(now())
}

model Guide {
  id        String   @id @default(uuid())
  slug      String   @unique
  title     String
  body      String   @db.Text
  toolRefs  String[] // tool slugs referenced, for internal linking
  publishedAt DateTime @default(now())
}

model ComparisonEntry {
  id        String  @id @default(uuid())
  toolId    String
  tool      Tool    @relation(fields: [toolId], references: [id])
  slugPair  String  // "tool-a-vs-tool-b", indexed for static generation
}

model Lead {
  id          String   @id @default(uuid())
  userId      String?
  user        User?    @relation(fields: [userId], references: [id])
  name        String
  email       String
  message     String
  sourcePage  String
  createdAt   DateTime @default(now())
  status      LeadStatus @default(NEW)
}

enum LeadStatus { NEW CONTACTED CLOSED }

model AgentRun {
  id        String   @id @default(uuid())
  agentName String   // "research" | "fact_check" | "review_writer" | "seo" | "affiliate" | "publisher" | "analytics"
  toolId    String?
  input     Json
  output    Json
  status    String   // "success" | "failed"
  createdAt DateTime @default(now())
}
```

Indexes beyond the inline ones: `Tool.categoryId`, `Tool.status`, full-text
search index on `Tool.name`/`tagline`/`overview` (Postgres `tsvector`) for
search-as-you-type.

---

## 4. AI Agent Architecture

All agents run as n8n workflows calling OpenAI (`gpt-4o-mini` for
classification/extraction, `gpt-4o` or Claude for long-form writing where
quality matters more than cost) — each writes an `AgentRun` row for
auditability.

```
Research Agent
  Input: tool name/URL (from submission or a discovery crawl)
  Does: scrapes vendor site + pricing page + G2/Capterra/Reddit mentions,
        extracts features/pricing/positioning into structured JSON
  Output: draft Tool record (status DRAFT)

Fact-Check Agent
  Input: Research Agent's draft
  Does: cross-checks claimed pricing/features against ≥2 independent
        sources, flags unverifiable claims rather than inventing numbers
  Output: verified draft + confidence flags; blocks pipeline if confidence low

Review Writer Agent
  Input: verified draft
  Does: writes Overview, Expert Review, Final Verdict, Pros/Cons, Best For
        in Smaran's voice (reuses smaran-voice-prompt.md from the news
        pipeline); proposes expertRating with justification
  Output: full Tool content fields, status IN_REVIEW

SEO Agent
  Input: completed review content
  Does: generates meta title/description, slug, internal links to
        related guides/comparisons, schema.org Product/Review JSON-LD,
        target keyword + heading structure check
  Output: SEO metadata block attached to the page

Affiliate Agent
  Input: tool's vendor/affiliate program info
  Does: resolves the correct affiliate network link + tracking param,
        checks for an active discount code, flags if no program exists
        (review still publishes, just without a monetized CTA)
  Output: AffiliateOffer + Discount records

Publisher Agent
  Input: fully assembled, SEO-tagged tool record
  Does: opens a GitHub PR (same human-merge gate pattern as the news
        pipeline) OR, once trust is established, publishes directly via
        Prisma write + triggers ISR revalidation for the page
  Output: status PUBLISHED

Analytics Agent
  Runs nightly, not per-tool
  Does: aggregates AffiliateClick conversion rates, review velocity,
        page traffic (via Vercel Analytics) into a digest
  Output: summary posted to admin dashboard + optional email digest
```

Pipeline order: Research → Fact-Check → Review Writer → SEO → Affiliate →
Publisher, mirroring the existing Fetch→Filter→Decide→Rewrite→Publish news
pipeline's human-gate philosophy. Analytics runs orthogonally.

---

## 5. API Design (Next.js Route Handlers, REST-ish under `/api`)

```
GET   /api/tools                 ?category=&pricing=&rating=&q=&page=
GET   /api/tools/:slug
GET   /api/tools/:slug/alternatives
GET   /api/compare?slugs=a,b,c

POST  /api/reviews               { toolId, rating, usedFor, pros, cons, body }  [auth]
GET   /api/reviews/:toolId       paginated, status=PUBLISHED only for public
POST  /api/reviews/:id/vote      { value }  [auth]
POST  /api/reviews/:id/report    { reason } [auth]

POST  /api/affiliate/click       { offerId, referrerPage }  → logs click, 302 redirect
POST  /api/affiliate/webhook     network conversion postback → sets converted=true

GET   /api/news                  ?page=
GET   /api/news/:slug
GET   /api/guides
GET   /api/guides/:slug
GET   /api/deals                 active discounts, joined with tool

POST  /api/leads                 { name, email, message, sourcePage }
POST  /api/tools/submit          vendor submission → enters agent pipeline

# Admin (role-gated via Next.js middleware + Role.ADMIN check)
GET   /api/admin/moderation/queue
POST  /api/admin/moderation/:reviewId/approve
POST  /api/admin/moderation/:reviewId/reject
GET   /api/admin/analytics/summary
```

Auth: Auth.js (NextAuth, Prisma adapter) with magic-link email + Google
OAuth, session via JWT/cookie. Since Neon has no row-level-security
equivalent enforced at the DB-driver level by default, ownership checks
(`Review`, `ReviewVote`, `ReviewReport`, `Lead` only readable/writable by
their `userId`) are enforced in the Next.js API route handlers themselves
(`session.user.id === resource.userId`) before any Prisma write — never
trust a client-supplied `userId`. `Tool`/`NewsArticle`/`Guide` writes are
restricted to routes gated by `Role.ADMIN`/`MODERATOR` middleware checks;
agents write via a server-only Prisma client using a direct Neon connection
string that's never exposed to the browser.

---

## 6. Dashboard Design

**User dashboard** (`/account`): reviews written (with status badges),
helpful-vote tally, saved/bookmarked tools, edit profile.

**Admin dashboard** (`/admin`, Smaran only):
- Moderation queue: pending reviews, approve/reject with one click, abuse
  reports inbox.
- Agent pipeline monitor: recent `AgentRun`s, failures surfaced first.
- Affiliate performance: clicks/conversions per tool, revenue estimate.
- Leads inbox: new consulting leads, mark contacted/closed.
- Content pipeline: tools in DRAFT/IN_REVIEW awaiting publish decision
  (the human-gate step).

---

## 7–8. Wireframes & Production UI Design

Given dark-mode glassmorphism premium-SaaS direction, key screens:

- **Home**: full-bleed dark hero, glass-card "Featured Tools" carousel,
  trending news strip, deals ticker, consulting CTA banner.
- **Tool review page**: sticky sidebar (rating, affiliate CTA, discount
  badge) + main content column (Overview → Features → Pricing table →
  Pros/Cons two-column → Best For → Alternatives cards → Expert Review →
  User Reviews list w/ vote buttons → Final Verdict → sticky-repeated CTA).
- **Compare page**: horizontally scrollable glass table, sticky header row,
  green/red cell highlighting per feature.
- **Reviews/Guides/News index**: card grid, filter sidebar, infinite scroll.

These will be built as actual Next.js components/screens in the
implementation pass rather than static mockups here — glassmorphism dark
mode is straightforward to prototype directly in Tailwind and iterate live.

---

## 9. Component Library (shared, Tailwind + minimal headless UI)

`Button`, `GlassCard`, `RatingStars`, `PricingTable`, `ProsConsList`,
`ToolCard`, `CompareTable`, `ReviewCard`, `VoteWidget`, `Badge` (Featured /
Sponsored / Verified), `DiscountBanner`, `AffiliateCTA`, `FilterSidebar`,
`SearchBar` (with debounced API call), `Pagination`, `Modal`, `Toast`,
`AdminTable` (reusable for moderation/leads/agent-run lists).

---

## 10. Monetization Strategy

1. **Affiliate commissions** — primary revenue, tracked per `AffiliateOffer`.
2. **Featured/Sponsored listings** — vendors pay for placement tier
   (`SponsorTier`); must be visually disclosed ("Sponsored") to stay
   FTC-compliant and preserve trust.
3. **Exclusive discount partnerships** — negotiate codes directly with
   vendors in exchange for guaranteed placement in `/deals`.
4. **Consulting leads** — the platform's authority drives `/contact`
   conversions; track `sourcePage` to see which content converts to leads.
5. **Newsletter/sponsorship** (later) — digest of new tools + deals,
   sponsorable slot once subscriber count justifies it.

---

## 11. SEO Strategy

- Programmatic comparison pages (`/compare/a-vs-b`) — high-intent,
  low-competition long-tail keywords, statically generated + ISR.
- Category pages (`/reviews/[category]`) target "best [category] tools 2026".
- Tool pages target "[tool name] review" + "[tool name] pricing/alternatives".
- JSON-LD: `Product`, `Review`, `AggregateRating`, `FAQPage` on tool pages;
  `Article` on news/guides.
- Internal linking enforced by the SEO Agent (every tool page links to ≥3
  related guides/comparisons; every guide links back to referenced tools).
- Core Web Vitals: static generation + ISR for content pages, image
  optimization via `next/image`, no client JS blocking first paint.

---

## 12. Affiliate Tracking System

- Every outbound affiliate click goes through `/api/affiliate/click`
  (server-side redirect, not a raw `<a href>`), which logs `AffiliateClick`
  (session id, referrer page, hashed IP, timestamp) before 302-redirecting
  to `baseUrl + trackingParam`.
- Network postback webhooks (`/api/affiliate/webhook`) mark conversions when
  the affiliate network reports them, matched by tracking param/session id.
- Click and conversion data rolls into the Analytics Agent's nightly digest
  and the admin dashboard's per-tool revenue view (Vercel Analytics for raw
  traffic, since there's no Supabase logs pipeline).
- IP is hashed (never stored raw) — click data is for attribution, not
  individual tracking, keeping this GDPR-reasonable.

---

## 13. Review Moderation System

- All user reviews land as `PENDING`, invisible to the public.
- Lightweight automated pre-filter (OpenAI moderation endpoint) flags
  spam/abuse/profanity before it even reaches the human queue.
- Admin reviews queue in `/admin`: approve → `PUBLISHED`; reject → `REJECTED`
  (with optional reason stored for the author).
- Abuse reports (`ReviewReport`) on already-published reviews surface in a
  separate inbox; 3+ open reports on one review auto-hides it pending
  re-review (status flips back to PENDING).
- Reputation system: published reviews and upvotes increase `User.reputation`;
  high-reputation users' future reviews could (later) skip the queue —
  not built initially, just leaving the schema room for it.

---

## 14. Security Architecture

- **Auth**: Auth.js, no custom password storage — magic-link tokens and
  OAuth only, sessions signed/encrypted (JWT) or stored via the Prisma
  adapter `Session` table.
- **Authorization**: no DB-level RLS on Neon, so every ownership check
  (a user editing/voting/reporting only their own rows) is enforced in
  route-handler code against `session.user.id`; admin/agent writes use a
  separate server-only Prisma client and are never reachable from
  client-supplied credentials.
- **API keys**: OpenAI/Claude keys and the Neon direct connection string
  live in server env vars only (Vercel project env, n8n instance env) —
  never in client bundles.
- **Affiliate redirect**: server-side route, not client-side link rewriting,
  preventing tampering with tracking params.
- **Rate limiting**: review submission, voting, and lead forms rate-limited
  per IP/user (reuse the `flask-limiter`-equivalent pattern already used in
  `chatbot/server.py`, via Next.js middleware + Upstash/Redis).
- **Input validation**: zod schemas on every API route, sanitized HTML
  rendering for review bodies (no raw HTML from users).
- **Abuse**: report-threshold auto-hide (above), OpenAI moderation
  pre-filter, admin-only moderation actions gated by `Role.ADMIN`/`MODERATOR`.
- **Connection pooling**: Neon's serverless driver/pooled connection string
  used in API routes (cold-start-friendly); a separate direct connection
  reserved for Prisma migrations only.

---

## Build Phasing (next steps)

1. Scaffold Next.js + TS + Tailwind + Prisma, provision a Neon project,
   point `DATABASE_URL` (pooled) and `DIRECT_URL` (migrations) at it.
2. Migrate schema above, seed 10-15 real tools by hand (no agents yet) to
   validate the review-page template end-to-end.
3. Build core pages: Home, Tool page, Reviews index, Compare.
4. Wire Auth.js (Prisma adapter) + review submission + moderation queue.
5. Build affiliate click/redirect system.
6. Stand up the n8n agent pipeline (Research → Fact-Check → Review Writer →
   SEO → Affiliate → Publisher) reusing the existing news-pipeline pattern.
7. News/Guides/Deals pages (News pipeline already exists — adapt its output
   to the new schema).
8. Admin dashboard.
9. SEO pass (JSON-LD, sitemap, programmatic compare pages).
10. Cut over DNS from the static site to the new Next.js deployment.
