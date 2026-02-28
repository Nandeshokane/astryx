"use client";
import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";

export default function ChatPanel({ documentText, settings }) {
    const [messages, setMessages] = useState([
        {
            role: "assistant",
            content:
                "I've analyzed your document. Ask me anything about it — I'll explain everything in plain, simple English. 💬",
        },
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const quickQuestions = [
        "What are the main risks?",
        "Can I exit this contract early?",
        "What happens if I breach this?",
        "Explain the payment terms",
    ];

    const sendMessage = async (text) => {
        const question = text || input.trim();
        if (!question || isLoading) return;

        const userMsg = { role: "user", content: question };
        const newMessages = [...messages, userMsg];
        setMessages(newMessages);
        setInput("");
        setIsLoading(true);

        try {
            // Build chat history (exclude first assistant greeting)
            const chatHistory = newMessages.slice(1).map((m) => ({
                role: m.role,
                content: m.content,
            }));

            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    question,
                    documentText,
                    chatHistory,
                    apiKey: settings?.apiKey,
                    baseUrl: settings?.baseUrl,
                    model: settings?.model,
                }),
            });

            const data = await response.json();

            if (data.error) {
                setMessages([
                    ...newMessages,
                    {
                        role: "assistant",
                        content: `⚠️ **Error:** ${data.error}`,
                    },
                ]);
            } else {
                setMessages([
                    ...newMessages,
                    { role: "assistant", content: data.reply },
                ]);
            }
        } catch (err) {
            setMessages([
                ...newMessages,
                {
                    role: "assistant",
                    content: `⚠️ **Connection error:** ${err.message}. Please check your settings.`,
                },
            ]);
        } finally {
            setIsLoading(false);
            inputRef.current?.focus();
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <div className="chat-panel">
            <div className="chat-header">
                <div className="status-dot"></div>
                <span>Astryx Legal Agent</span>
            </div>

            {/* Quick Questions */}
            {messages.length <= 1 && (
                <div className="quick-questions">
                    {quickQuestions.map((q, i) => (
                        <button
                            key={i}
                            className="quick-q-btn"
                            onClick={() => sendMessage(q)}
                        >
                            {q}
                        </button>
                    ))}
                </div>
            )}

            {/* Messages */}
            <div className="chat-messages">
                {messages.map((msg, i) => (
                    <div key={i} className={`chat-message ${msg.role}`}>
                        <div className="chat-avatar">
                            {msg.role === "assistant" ? "⚖️" : "👤"}
                        </div>
                        <div className="chat-bubble">
                            {msg.role === "assistant" ? (
                                <ReactMarkdown>{msg.content}</ReactMarkdown>
                            ) : (
                                <p>{msg.content}</p>
                            )}
                        </div>
                    </div>
                ))}

                {isLoading && (
                    <div className="chat-message assistant">
                        <div className="chat-avatar">⚖️</div>
                        <div className="chat-bubble">
                            <div className="chat-typing">
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="chat-input-area">
                <div className="chat-input-wrapper">
                    <textarea
                        ref={inputRef}
                        className="chat-input"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Ask about your document..."
                        rows={1}
                        disabled={isLoading}
                        id="chat-input"
                    />
                    <button
                        className="chat-send-btn"
                        onClick={() => sendMessage()}
                        disabled={!input.trim() || isLoading}
                        id="chat-send"
                    >
                        ➤
                    </button>
                </div>
            </div>
        </div>
    );
}
