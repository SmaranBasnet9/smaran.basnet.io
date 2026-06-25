# Marketing AI Assistant — local backend

Local Flask server that powers the chat widget on the blog page
([../blog/ai-marketing-assistant.html](../blog/ai-marketing-assistant.html)). Calls the
OpenAI API server-side (on free trial credit) so the API key is never exposed to the browser.

## Setup

```bash
cd chatbot
pip install -r requirements.txt
cp .env.example .env
# edit .env and set OPENAI_API_KEY=sk-...
python server.py
```

The server listens on `http://127.0.0.1:5050`. The chat widget on the
blog page calls `http://127.0.0.1:5050/api/chat` directly, so the
server must be running locally while you use the widget. It is not
deployed — it only works on this machine unless hosted separately.

## Security

- **CORS allowlist** — by default only `https://smaranbasnet.com.np`,
  `http://127.0.0.1:5500`, and `http://localhost:5500` may call the API
  from a browser. Override with a comma-separated `ALLOWED_ORIGINS` env
  var in `.env` if you serve the static site from a different origin.
- **Rate limiting** — `/api/chat` is capped at 10 requests/minute and
  60/hour per client IP (via `flask-limiter`), to prevent the local key
  from being run up by abuse if the server is ever reachable beyond
  your own machine.
- **API key** — loaded from `.env` (gitignored), never sent to the
  browser, never hardcoded.
