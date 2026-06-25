import os

from openai import OpenAI
from dotenv import load_dotenv
from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

load_dotenv()

app = Flask(__name__)

ALLOWED_ORIGINS = [
    origin.strip()
    for origin in os.environ.get(
        "ALLOWED_ORIGINS",
        "https://smaranbasnet.com.np,http://127.0.0.1:5500,http://localhost:5500",
    ).split(",")
    if origin.strip()
]
CORS(app, origins=ALLOWED_ORIGINS)

limiter = Limiter(get_remote_address, app=app, default_limits=["60 per hour"])

client = OpenAI(api_key=os.environ["OPENAI_API_KEY"])

SYSTEM_PROMPT = (
    "You are Mara, an AI marketing assistant on Smaran Basnet's website. "
    "You help visitors understand AI tools and technologies that help with marketing — "
    "things like AI copywriting tools, AI ad bidding and budget automation, AI-driven "
    "personalization, marketing analytics platforms, SEO tools, and AI agents for "
    "campaign optimization. Speak in plain, natural human language, keep answers "
    "concise and practical, and when relevant suggest the visitor get in touch with "
    "Smaran for a strategy call. Stay focused on marketing and AI-for-marketing topics."
)

MAX_HISTORY_MESSAGES = 20


@app.route("/api/chat", methods=["POST"])
@limiter.limit("10 per minute")
def chat():
    data = request.get_json(silent=True) or {}
    messages = data.get("messages")

    if not isinstance(messages, list) or not messages:
        return jsonify({"error": "messages must be a non-empty list"}), 400

    cleaned = []
    for m in messages[-MAX_HISTORY_MESSAGES:]:
        role = m.get("role")
        content = m.get("content")
        if role in ("user", "assistant") and isinstance(content, str) and content.strip():
            cleaned.append({"role": role, "content": content.strip()[:4000]})

    if not cleaned:
        return jsonify({"error": "no valid messages provided"}), 400

    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            max_tokens=600,
            messages=[{"role": "system", "content": SYSTEM_PROMPT}, *cleaned],
        )
        reply = response.choices[0].message.content
    except Exception as exc:
        return jsonify({"error": f"upstream error: {exc}"}), 502

    return jsonify({"reply": reply})


@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"})


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5050, debug=False)
