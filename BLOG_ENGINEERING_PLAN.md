# Blog Engineering Plan

## Goal

Build the website around a blog-first personal brand:

- AI in digital marketing
- SEO and search behavior
- Paid ads and campaign testing
- Analytics and reporting
- Marketing automation
- Technology for business growth

The homepage should prove thinking through writing first. About Me should explain who Smaran is, what he studies, and why the topics matter.

## Recommended Build Path

### Phase 1: Static Blog Publishing

Use the current HTML/CSS/JS project.

This is the best first step because it is fast, SEO-friendly, cheap to host, and simple to maintain.

Current structure:

```text
index.html
blog.html
blog/
  ai-in-digital-marketing.html
style.css
script.js
images/
```

For every new article:

1. Create a new HTML file inside `blog/`.
2. Copy the structure from `blog/ai-in-digital-marketing.html`.
3. Update the article title, meta description, Open Graph tags, date, category, and body content.
4. Add the article card to `blog.html`.
5. Add one featured or recent article card on `index.html` if it is important.
6. Test the page locally in the browser.
7. Commit and publish.

This gives full control and strong SEO with no backend complexity.

### Phase 2: Content System

When there are 10 or more posts, move article data into a simple content index.

Recommended structure:

```text
content/
  posts.json
blog/
  ai-in-digital-marketing.html
  ai-for-seo-research.html
```

Each post in `posts.json` should contain:

```json
{
  "title": "AI in Digital Marketing: How Businesses Can Use It Without Losing Strategy",
  "slug": "ai-in-digital-marketing",
  "category": "AI & Strategy",
  "excerpt": "A practical look at where AI helps marketing teams and where human judgment still leads.",
  "date": "2026-06-22",
  "readTime": "9 min read",
  "url": "blog/ai-in-digital-marketing.html"
}
```

This makes it easier to generate blog cards without manually repeating content.

### Phase 3: Admin Uploading

Do not build a custom backend yet unless publishing articles manually becomes painful.

Best admin options:

1. Decap CMS with GitHub
   - Good for static sites.
   - Gives `/admin` login.
   - Saves posts to the GitHub repository.
   - No custom database needed.

2. Cloudflare Pages CMS or Git-based CMS
   - Good if hosting moves to Cloudflare.
   - Still keeps content in files.

3. Full backend with Next.js + Supabase
   - Only worth it if the site needs user accounts, comments, drafts, media uploads, database search, or multi-author publishing.

Recommended choice for this project:

```text
Static blog now.
Decap CMS later.
Full backend only if the blog becomes a serious publishing platform.
```

## Admin CMS Requirements

If adding `/admin`, the admin should support:

- Secure login
- Create article
- Edit article
- Upload image
- Set category
- Set title and SEO meta description
- Save draft
- Publish post
- Update blog listing automatically

Suggested admin fields:

```text
Title
Slug
Meta Description
Category
Excerpt
Cover Image
Published Date
Read Time
Body Content
Featured Post Toggle
```

## Homepage Content Direction

Homepage sections should be:

1. Hero
   - AI marketing notes and digital growth positioning
   - CTA to latest article
   - CTA to About Me

2. Core Themes
   - AI in Marketing
   - SEO & Search
   - Paid Media
   - Analytics & Growth

3. About Me
   - Personal/professional introduction
   - What Smaran is learning and writing about
   - Why AI and marketing matter to the portfolio

4. Content Method
   - Research the topic
   - Connect it to practice
   - Write the takeaway

5. Writing Areas
   - AI for SEO
   - AI in Paid Ads
   - Social Media Strategy
   - Content Strategy
   - Marketing Automation
   - Analytics & Reporting
   - Conversion Optimization

6. Featured Notes
   - Latest article
   - Coming soon topics

7. Tools & Platforms
   - GA4
   - Search Console
   - Google Ads
   - Meta Ads
   - HubSpot
   - Semrush
   - Ahrefs
   - Mailchimp

8. Reader Value
   - Business owners
   - Marketing learners
   - Hiring teams

9. Contact
   - Questions
   - Collaboration
   - Topic suggestions
   - Project ideas

## First 10 Blog Topics

1. AI in Digital Marketing: How Businesses Can Use It Without Losing Strategy
2. Using AI for SEO Research Without Publishing Generic Content
3. How AI Changes Content Strategy for Small Businesses
4. What Small Businesses Should Track Before Spending More on Ads
5. AI Tools Every Digital Marketer Should Understand
6. How to Use AI for Social Media Planning Without Sounding Robotic
7. The Difference Between Marketing Automation and Random AI Tools
8. How Google Analytics Helps You Find Better Marketing Decisions
9. Why Paid Ads Fail When Tracking Is Weak
10. How AI Can Help Local Businesses Improve Their Online Presence

## Backend Decision

A backend is not needed for the current stage.

Reason:

- Static pages are better for speed and SEO.
- The site has only one article right now.
- Admin authentication, databases, uploads, and security add complexity.
- Manual publishing is acceptable until the blog has regular content volume.

Build admin later when:

- There are 10-20 articles.
- Publishing manually feels slow.
- Images and drafts need better management.
- The site needs a real editorial workflow.

