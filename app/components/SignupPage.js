"use client";
import { useState } from "react";
import { useAuth } from "@/lib/AuthContext";

export default function SignupPage({ onSwitch }) {
    const { signup } = useAuth();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (password.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setIsLoading(true);

        try {
            signup(name, email, password);
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
                            Join thousands who never sign a document without understanding it first.
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
                        <h1 className="auth-title">Create your account</h1>
                        <p className="auth-subtitle">
                            Start analyzing legal documents in seconds
                        </p>

                        <form onSubmit={handleSubmit} className="auth-form">
                            {error && (
                                <div className="auth-error">
                                    <span>⚠️</span> {error}
                                </div>
                            )}

                            <div className="auth-field">
                                <label htmlFor="signup-name">Full name</label>
                                <input
                                    id="signup-name"
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="John Doe"
                                    required
                                    autoComplete="name"
                                />
                            </div>

                            <div className="auth-field">
                                <label htmlFor="signup-email">Email address</label>
                                <input
                                    id="signup-email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    required
                                    autoComplete="email"
                                />
                            </div>

                            <div className="auth-field">
                                <label htmlFor="signup-password">Password</label>
                                <input
                                    id="signup-password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="At least 6 characters"
                                    required
                                    autoComplete="new-password"
                                />
                            </div>

                            <div className="auth-field">
                                <label htmlFor="signup-confirm">Confirm password</label>
                                <input
                                    id="signup-confirm"
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Repeat your password"
                                    required
                                    autoComplete="new-password"
                                />
                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary btn-lg auth-submit"
                                disabled={isLoading}
                                id="signup-submit"
                            >
                                {isLoading ? "Creating account..." : "Create Account"}
                            </button>
                        </form>

                        <p className="auth-switch">
                            Already have an account?{" "}
                            <button className="auth-switch-btn" onClick={onSwitch}>
                                Sign in
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
