"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/AuthContext";
import { ThemeToggle } from "@/lib/ThemeContext";
import LoginPage from "./components/LoginPage";
import SignupPage from "./components/SignupPage";
import FileUpload from "./components/FileUpload";
import SettingsModal from "./components/SettingsModal";
import AnalysisView from "./components/AnalysisView";
import ChatPanel from "./components/ChatPanel";

export default function Home() {
  const { user, isLoading: authLoading, logout } = useAuth();
  const [authView, setAuthView] = useState("login");

  const [appState, setAppState] = useState("upload");
  const [settings, setSettings] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [documentText, setDocumentText] = useState("");
  const [documentName, setDocumentName] = useState("");
  const [pageCount, setPageCount] = useState(0);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("astryx_settings");
    if (saved) setSettings(JSON.parse(saved));
  }, []);

  if (authLoading) {
    return (
      <div className="loading-screen">
        <div className="analyzing-spinner"></div>
      </div>
    );
  }

  if (!user) {
    if (authView === "signup") {
      return <SignupPage onSwitch={() => setAuthView("login")} />;
    }
    return <LoginPage onSwitch={() => setAuthView("signup")} />;
  }

  const handleFileUpload = async (file) => {
    setError(null);
    setDocumentName(file.name);
    setAppState("extracting");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const extractRes = await fetch("/api/extract", { method: "POST", body: formData });
      const extractData = await extractRes.json();
      if (extractData.error) throw new Error(extractData.error);

      setDocumentText(extractData.text);
      setPageCount(extractData.pageCount);

      if (!settings?.apiKey) {
        setShowSettings(true);
        setAppState("upload");
        setError("Please configure your AI API key in Settings first.");
        return;
      }

      setAppState("analyzing");
      const analyzeRes = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: extractData.text,
          apiKey: settings.apiKey,
          baseUrl: settings.baseUrl,
          model: settings.model,
        }),
      });

      const analyzeData = await analyzeRes.json();
      if (analyzeData.error) throw new Error(analyzeData.error);

      setAnalysis(analyzeData.analysis);
      setAppState("results");
    } catch (err) {
      setError(err.message);
      setAppState("upload");
    }
  };

  const handleReAnalyze = async () => {
    if (!documentText || !settings?.apiKey) return;
    setError(null);
    setAppState("analyzing");

    try {
      const analyzeRes = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: documentText,
          apiKey: settings.apiKey,
          baseUrl: settings.baseUrl,
          model: settings.model,
        }),
      });

      const analyzeData = await analyzeRes.json();
      if (analyzeData.error) throw new Error(analyzeData.error);

      setAnalysis(analyzeData.analysis);
      setAppState("results");
    } catch (err) {
      setError(err.message);
      setAppState("upload");
    }
  };

  const handleNewUpload = () => {
    setAppState("upload");
    setDocumentText("");
    setDocumentName("");
    setPageCount(0);
    setAnalysis(null);
    setError(null);
  };

  return (
    <>
      <header className="header">
        <div className="header-inner">
          <div className="logo">
            <div className="logo-icon">⚖️</div>
            <span className="logo-text">Astryx</span>
          </div>
          <div className="header-actions">
            {appState === "results" && (
              <button className="btn btn-sm" onClick={handleReAnalyze} id="re-analyze-btn">
                ↻ Re-analyze
              </button>
            )}
            <button
              className="btn btn-icon"
              onClick={() => setShowSettings(true)}
              title="Settings"
              id="settings-btn"
            >
              ⚙
            </button>
            <ThemeToggle />
            <div className="user-menu">
              <div className="user-avatar">{user.avatar}</div>
              <span className="user-name">{user.name}</span>
              <button className="btn btn-sm btn-ghost" onClick={logout} id="logout-btn">
                Log out
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="container">
        {error && (
          <div className="error-banner" style={{ marginTop: 16 }}>
            <span>⚠</span>
            <span>{error}</span>
            <button className="btn btn-sm btn-ghost" onClick={() => setError(null)} style={{ marginLeft: "auto" }}>
              ✕
            </button>
          </div>
        )}

        {appState === "upload" && (
          <div>
            <section className="hero">
              <div className="hero-badge">AI-Powered Legal Analysis</div>
              <h1>
                Understand any legal document<br />
                <span>in plain English</span>
              </h1>
              <p>
                Upload contracts, agreements, or legal documents and get instant
                plain-language summaries with red-flag detection.
              </p>
            </section>

            <FileUpload onFileUpload={handleFileUpload} isUploading={false} />

            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon">📝</div>
                <h4>Plain English</h4>
                <p>Legalese to simple language</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">🚩</div>
                <h4>Red Flags</h4>
                <p>Hidden fees & unfair terms</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">💬</div>
                <h4>Ask Questions</h4>
                <p>Chat about your document</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">⚡</div>
                <h4>Instant</h4>
                <p>Results in seconds</p>
              </div>
            </div>

            {!settings?.apiKey && (
              <div style={{ textAlign: "center", marginTop: 40 }}>
                <p style={{ color: "var(--text-3)", fontSize: "0.8rem" }}>
                  Click{" "}
                  <button className="btn btn-sm btn-primary" onClick={() => setShowSettings(true)}>
                    ⚙ Settings
                  </button>{" "}
                  to add your free API key from{" "}
                  <a href="https://console.groq.com" target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent)" }}>
                    Groq
                  </a>
                </p>
              </div>
            )}
          </div>
        )}

        {appState === "extracting" && (
          <div className="analyzing-wrapper">
            <div className="analyzing-spinner"></div>
            <h2>Reading document...</h2>
            <p style={{ color: "var(--text-2)", fontSize: "0.85rem" }}>Extracting text from {documentName}</p>
          </div>
        )}

        {appState === "analyzing" && (
          <div className="analyzing-wrapper">
            <div className="analyzing-spinner"></div>
            <h2>Analyzing...</h2>
            <p style={{ color: "var(--text-2)", fontSize: "0.85rem" }}>
              Scanning {pageCount} page{pageCount !== 1 ? "s" : ""} of {documentName}
            </p>
            <div className="analyzing-steps">
              <div className="analyzing-step done">✓ Text extracted</div>
              <div className="analyzing-step active">Generating summary...</div>
              <div className="analyzing-step">Detecting red flags...</div>
            </div>
          </div>
        )}

        {appState === "results" && analysis && (
          <>
            <div className="doc-info-bar">
              <span>📄</span>
              <div>
                <div className="doc-name">{documentName}</div>
                <div className="doc-meta">
                  {pageCount} page{pageCount !== 1 ? "s" : ""} · {documentText.length.toLocaleString()} characters
                </div>
              </div>
              <button className="btn btn-sm new-upload-btn" onClick={handleNewUpload} id="new-upload-btn">
                New document
              </button>
            </div>
            <div className="results-layout">
              <AnalysisView analysis={analysis} />
              <ChatPanel documentText={documentText} settings={settings} />
            </div>
          </>
        )}
      </main>

      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        settings={settings}
        onSave={(s) => {
          setSettings(s);
          if (documentText && !analysis) handleReAnalyze();
        }}
      />
    </>
  );
}
