import React, { useState, useRef } from "react";

/**
 * Minimal AI Assistant widget using OpenAI via backend proxy.
 * UI: Fixed panel, bottom-right. Modern floating style.
 * Customize: See App.css for .ai-assistant-* CSS vars or adjust layout as needed.
 *
 * Usage:
 *   Add <AIAssistant /> to your app layout.
 */
 // PUBLIC_INTERFACE
function AIAssistant() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hi! I’m your AI assistant. Ask me anything, or get help with your notes.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [error, setError] = useState(null);
  const messagesRef = useRef(null);

  async function handleSend(e) {
    e.preventDefault();
    if (!input.trim()) return;
    setError(null);
    const userMessage = { role: "user", content: input.trim() };
    setMessages((msgs) => [...msgs, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/openai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            ...messages.filter(m => m.role !== "error"),
            userMessage,
          ],
        }),
      });
      const data = await response.json();
      if (!response.ok || !data.choices || !data.choices[0]) {
        setMessages((msgs) => [
          ...msgs,
          {
            role: "error",
            content: "Sorry, there was an error with the AI API.",
          },
        ]);
        setError(
          data && data.error
            ? (typeof data.error === "string" ? data.error : data.error.message)
            : "OpenAI API error"
        );
      } else {
        setMessages((msgs) => [
          ...msgs,
          {
            role: "assistant",
            content: data.choices[0].message.content,
          },
        ]);
      }
    } catch (e) {
      setMessages((msgs) => [
        ...msgs,
        {
          role: "error",
          content: "Network error – try again later.",
        },
      ]);
      setError(String(e));
    } finally {
      setLoading(false);
      setTimeout(() => {
        if (messagesRef.current)
          messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
      }, 50);
    }
  }

  function handleMinimize() {
    setShow(false);
  }
  function handleOpen() {
    setShow(true);
    setTimeout(() => {
      if (messagesRef.current)
        messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }, 150);
  }

  // PUBLIC_INTERFACE
  return (
    <div>
      {!show && (
        <button
          className="ai-assistant-fab"
          aria-label="Open AI Assistant"
          onClick={handleOpen}
        >
          🤖
        </button>
      )}
      {show && (
        <div className="ai-assistant-widget">
          <div className="ai-assistant-header">
            <span>AI Assistant</span>
            <button
              className="ai-assistant-close"
              aria-label="Minimize AI Assistant"
              onClick={handleMinimize}
            >
              ×
            </button>
          </div>
          <div className="ai-assistant-messages" ref={messagesRef}>
            {messages.map((m, i) => (
              <div
                key={i}
                className={
                  "ai-msg " +
                  (m.role === "user"
                    ? "ai-msg-user"
                    : m.role === "assistant"
                    ? "ai-msg-assistant"
                    : "ai-msg-error")
                }
              >
                {m.content}
              </div>
            ))}
            {loading && (
              <div className="ai-msg ai-msg-assistant">
                <span className="ai-typing">Assistant is typing…</span>
              </div>
            )}
          </div>
          <form
            className="ai-assistant-input-row"
            onSubmit={handleSend}
            autoComplete="off"
          >
            <input
              className="ai-assistant-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything or get note advice…"
              disabled={loading}
              aria-label="Type your question to the AI"
            />
            <button
              className="ai-assistant-send"
              type="submit"
              disabled={loading || !input.trim()}
              tabIndex={0}
              aria-label="Send message to Assistant"
            >
              ➤
            </button>
          </form>
          {error && (
            <div className="ai-assistant-error" aria-live="polite">
              {error}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default AIAssistant;
