# smaran.basnet.io

Personal portfolio and blog website for Smaran Basnet.

This repository contains the source for a responsive, static personal website built with HTML, CSS, and vanilla JavaScript. It includes animated background effects, smooth scrolling, light/dark theme toggling, a blog section with an interactive AI chat assistant, and an about/CV page.

---

## 🚀 Overview

The site consists of these pages:

- **`index.html`** — Homepage: introduction, services, stats, contact CTA.
- **`about.html`** — CV/resume-style page (experience, case studies, toolkit, testimonials).
- **`blog.html`** — Blog listing page ("Digital Marketing Insights & AI Notes"), magazine-style card grid.
- **`blog/*.html`** — Individual blog articles, plus the live AI chat assistant page (`blog/ai-marketing-assistant.html`).
- **`contact.html`** — Contact page.
- **`portfolio.html`** — Legacy/reference page (not actively maintained as part of the current site).

Shared theming: a dark/light theme toggle (`#themeToggle`, persisted via `localStorage`) drives the main site, with a separate "magazine" light/dark theme scoped to the blog listing and article pages (`.mag-page`).

The site is optimized for GitHub Pages deployment and uses a custom domain via the `CNAME` file.

---

## 🛠 Tech Stack

- HTML5, CSS3, vanilla JavaScript (no framework, no build step) for the entire site
- Three.js (animated canvas background)
- **Exception:** the blog's AI chat assistant feature ("Mara") uses a small local Python backend (Flask + the Anthropic SDK) to call the Claude API server-side — see [Chatbot feature](#-chatbot-feature-mara) below. This is the only part of the project that isn't static HTML/CSS/JS.

---

## 📁 Project Structure

```
.
├── index.html              # Homepage
├── about.html               # About / CV page
├── blog.html                 # Blog listing page
├── blog/                     # Individual blog articles
│   ├── ai-in-digital-marketing.html
│   ├── ai-agents-data-driven-marketing.html
│   ├── ai-personalization-customer-journeys.html
│   ├── marketing-analytics-automation-tools.html
│   └── ai-marketing-assistant.html   # Live AI chat assistant page
├── contact.html               # Contact page
├── portfolio.html             # Legacy reference page (not maintained)
├── style.css                  # All styling (shared + magazine theme + chat widget)
├── script.js                  # Shared interactivity/animations (theme toggle, scroll, menu)
├── chatbot/                    # Local Python backend + JS widget for the AI chat assistant
│   ├── server.py
│   ├── chat-widget.js
│   ├── requirements.txt
│   ├── .env.example
│   └── README.md
├── images/                     # Image assets
├── CNAME                       # Custom domain configuration
└── README.md                   # Project documentation (this file)
```

---

## 💻 Running Locally

Because the project uses JavaScript, it's recommended to run it with a local server.

### Option 1: Using VS Code Live Server
1. Open the project in VS Code
2. Install the Live Server extension
3. Right-click `index.html`
4. Click "Open with Live Server"

### Option 2: Using Python

```bash
python -m http.server 5500
```

Then open:

```
http://localhost:5500
```

This serves all static pages. The chat assistant page will load, but live chat requires the local backend below to also be running.

---

## 🤖 Chatbot feature (Mara)

The blog includes "Mara," an AI assistant focused on marketing tools and AI-for-marketing topics, available at `blog/ai-marketing-assistant.html`. The chat widget (`chatbot/chat-widget.js`) is plain JS with no framework, and it talks to a small local Flask server (`chatbot/server.py`) which calls the Anthropic Claude API server-side, so the API key is never exposed in the browser.

To run it:

```bash
cd chatbot
pip install -r requirements.txt
cp .env.example .env
# edit .env and set ANTHROPIC_API_KEY=sk-ant-...
python server.py
```

The server listens on `http://127.0.0.1:5050`. It must be running locally for the chat widget on the blog page to work. See [chatbot/README.md](chatbot/README.md) for details. The real `.env` (containing the API key) is git-ignored and must never be committed.

---

## 🌐 Deployment (GitHub Pages)

1. Push code to the `main` branch.
2. Go to GitHub → Settings → Pages.
3. Set source to "Deploy from a branch".
4. Select `main` and root directory.
5. If using a custom domain, ensure `CNAME` is configured correctly.

Note: GitHub Pages only serves static files. The chatbot's Python backend is local-only and is not deployed with the rest of the site — without it running, the chat widget will show a connection error.

---

## 🎨 Customization Guide

To modify the website:

- Update homepage content → `index.html`
- Update about/CV content → `about.html`
- Add or edit blog articles → `blog.html` (listing) and `blog/*.html` (articles)
- Change styles/colors → `style.css`
- Edit animations/interactions → `script.js`
- Change the chat assistant's behavior/persona → `chatbot/server.py` (`SYSTEM_PROMPT`)
- Replace images → `images/` folder

---

## 📄 License

No license file is currently included.
If you want to allow reuse or modification, consider adding an MIT License.
