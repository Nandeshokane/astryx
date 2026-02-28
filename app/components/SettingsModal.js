"use client";
import { useState, useEffect } from "react";

export default function SettingsModal({ isOpen, onClose, settings, onSave }) {
    const [apiKey, setApiKey] = useState("");
    const [baseUrl, setBaseUrl] = useState("");
    const [model, setModel] = useState("");

    useEffect(() => {
        if (settings) {
            setApiKey(settings.apiKey || "");
            setBaseUrl(settings.baseUrl || "https://api.groq.com/openai/v1");
            setModel(settings.model || "llama-3.3-70b-versatile");
        }
    }, [settings, isOpen]);

    if (!isOpen) return null;

    const handleSave = () => {
        const newSettings = { apiKey, baseUrl, model };
        localStorage.setItem("astryx_settings", JSON.stringify(newSettings));
        onSave(newSettings);
        onClose();
    };

    const presets = [
        {
            name: "Groq (Free)",
            url: "https://api.groq.com/openai/v1",
            model: "llama-3.3-70b-versatile",
        },
        {
            name: "OpenAI",
            url: "https://api.openai.com/v1",
            model: "gpt-4o-mini",
        },
        {
            name: "Together AI",
            url: "https://api.together.xyz/v1",
            model: "meta-llama/Llama-3-70b-chat-hf",
        },
    ];

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <h2>⚙️ AI Settings</h2>

                <div className="form-group">
                    <label>Quick Preset</label>
                    <select
                        onChange={(e) => {
                            const preset = presets[e.target.value];
                            if (preset) {
                                setBaseUrl(preset.url);
                                setModel(preset.model);
                            }
                        }}
                        defaultValue=""
                    >
                        <option value="" disabled>
                            Choose a provider...
                        </option>
                        {presets.map((p, i) => (
                            <option key={i} value={i}>
                                {p.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label>API Key</label>
                    <input
                        type="password"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        placeholder="sk-... or gsk_..."
                    />
                    <p className="hint">
                        Get a free key at{" "}
                        <a
                            href="https://console.groq.com"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            console.groq.com
                        </a>
                    </p>
                </div>

                <div className="form-group">
                    <label>Base URL</label>
                    <input
                        type="text"
                        value={baseUrl}
                        onChange={(e) => setBaseUrl(e.target.value)}
                        placeholder="https://api.groq.com/openai/v1"
                    />
                </div>

                <div className="form-group">
                    <label>Model</label>
                    <input
                        type="text"
                        value={model}
                        onChange={(e) => setModel(e.target.value)}
                        placeholder="llama-3.3-70b-versatile"
                    />
                </div>

                <div className="modal-actions">
                    <button className="btn" onClick={onClose}>
                        Cancel
                    </button>
                    <button className="btn btn-primary" onClick={handleSave}>
                        Save Settings
                    </button>
                </div>
            </div>
        </div>
    );
}
