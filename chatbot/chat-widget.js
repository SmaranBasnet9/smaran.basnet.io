(function () {
    const CHAT_ENDPOINT = "http://127.0.0.1:5050/api/chat";

    const log = document.getElementById("chatLog");
    const form = document.getElementById("chatForm");
    const input = document.getElementById("chatInput");
    const sendBtn = document.getElementById("chatSend");
    const errorEl = document.getElementById("chatError");

    if (!log || !form || !input) return;

    const history = [];

    function appendMessage(role, text) {
        const msg = document.createElement("div");
        msg.className = role === "user" ? "chat-msg chat-msg-user" : "chat-msg chat-msg-bot";
        const p = document.createElement("p");
        p.textContent = text;
        msg.appendChild(p);
        log.appendChild(msg);
        log.scrollTop = log.scrollHeight;
        return msg;
    }

    function setError(message) {
        if (!errorEl) return;
        if (message) {
            errorEl.textContent = message;
            errorEl.hidden = false;
        } else {
            errorEl.hidden = true;
        }
    }

    form.addEventListener("submit", async function (e) {
        e.preventDefault();
        const text = input.value.trim();
        if (!text) return;

        setError("");
        appendMessage("user", text);
        history.push({ role: "user", content: text });
        input.value = "";
        input.disabled = true;
        sendBtn.disabled = true;

        const typing = appendMessage("bot", "...");

        try {
            const res = await fetch(CHAT_ENDPOINT, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ messages: history }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Something went wrong.");
            }

            typing.querySelector("p").textContent = data.reply;
            history.push({ role: "assistant", content: data.reply });
        } catch (err) {
            typing.remove();
            setError(
                "Couldn't reach the assistant. Make sure the local chatbot server is running (see chatbot/README.md)."
            );
        } finally {
            input.disabled = false;
            sendBtn.disabled = false;
            input.focus();
        }
    });
})();
