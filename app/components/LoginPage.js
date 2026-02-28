"use client";
import { useState } from "react";
import { useAuth } from "@/lib/AuthContext";

export default function LoginPage({ onSwitch }) {
    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            login(email, password);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-page">
            {/* Background decoration */}
            <div className="auth-bg-glow auth-bg-glow-1"></div>
            <div className="auth-bg-glow auth-bg-glow-2"></div>

            <div className="auth-container">
                {/* Left Panel - Branding */}
                <div className="auth-brand-panel">
                    <div className="auth-brand-content">
                        <div className="logo" style={{ marginBottom: "var(--space-lg)" }}>
                            <div className="logo-icon" style={{ width: 48, height: 48, fontSize: 28 }}>⚖️</div>
                            <div>
                                <div className="logo-text" style={{ fontSize: "1.5rem" }}>ASTRYX</div>
                                <div className="logo-subtitle">Legal Document Analyzer</div>
                            </div>
                        </div>
                        <h2 className="auth-brand-title">Know before you sign.</h2>
                        <p className="auth-brand-desc">
                            Upload any legal document and get a clear, plain English summary
                            with red-flag detection and AI-powered Q&A.
                        </p>
                        <div className="auth-features-mini">
                            <div className="auth-feature-mini">
                                <span>📝</span> Plain English Summaries
                            </div>
                            <div className="auth-feature-mini">
                                <span>🚩</span> Red Flag Detection
                            </div>
                            <div className="auth-feature-mini">
                                <span>💬</span> Interactive Legal Q&A
                            </div>
                            <div className="auth-feature-mini">
                                <span>⚡</span> Instant AI Analysis
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Panel - Form */}
                <div className="auth-form-panel">
                    <div className="auth-form-wrapper">
                        <h1 className="auth-title">Welcome back</h1>
                        <p className="auth-subtitle">Sign in to your account to continue</p>

                        <form onSubmit={handleSubmit} className="auth-form">
                            {error && (
                                <div className="auth-error">
                                    <span>⚠️</span> {error}
                                </div>
                            )}

                            <div className="auth-field">
                                <label htmlFor="login-email">Email address</label>
                                <input
                                    id="login-email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    required
                                    autoComplete="email"
                                />
                            </div>

                            <div className="auth-field">
                                <label htmlFor="login-password">Password</label>
                                <input
                                    id="login-password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                    required
                                    autoComplete="current-password"
                                />
                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary btn-lg auth-submit"
                                disabled={isLoading}
                                id="login-submit"
                            >
                                {isLoading ? "Signing in..." : "Sign In"}
                            </button>
                        </form>

                        <p className="auth-switch">
                            Don't have an account?{" "}
                            <button className="auth-switch-btn" onClick={onSwitch}>
                                Create one
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
