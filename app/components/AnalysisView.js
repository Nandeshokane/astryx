"use client";

export default function AnalysisView({ analysis }) {
    if (!analysis) return null;

    const { title, parties, summary, redFlags, obligations, keyDates, verdict } =
        analysis;

    const severityOrder = { high: 0, medium: 1, low: 2 };
    const sortedFlags = [...(redFlags || [])].sort(
        (a, b) =>
            (severityOrder[a.severity] || 2) - (severityOrder[b.severity] || 2)
    );

    const highCount = sortedFlags.filter((f) => f.severity === "high").length;
    const medCount = sortedFlags.filter((f) => f.severity === "medium").length;
    const lowCount = sortedFlags.filter((f) => f.severity === "low").length;

    return (
        <div className="analysis-content">
            {/* Document Title */}
            <div className="card summary-section animate-fade-in-up">
                <div className="card-header">
                    <h2 className="card-title">📋 {title || "Document Analysis"}</h2>
                </div>
                {parties && parties.length > 0 && (
                    <p
                        style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginBottom: "var(--space-md)" }}
                    >
                        <strong>Parties:</strong> {parties.join(" • ")}
                    </p>
                )}

                {/* Summary */}
                <h3
                    className="card-title"
                    style={{ fontSize: "0.9rem", marginBottom: "var(--space-sm)" }}
                >
                    📝 Plain English Summary
                </h3>
                <ul className="summary-list">
                    {(summary || []).map((item, i) => (
                        <li key={i}>{item}</li>
                    ))}
                </ul>
            </div>

            {/* Red Flags */}
            <div className="card red-flags-section animate-fade-in-up delay-2">
                <div className="card-header">
                    <h3 className="card-title">
                        🚩 Red Flags
                        {sortedFlags.length > 0 && (
                            <span
                                style={{ fontSize: "0.8rem", fontWeight: 400, color: "var(--text-muted)" }}
                            >
                                ({highCount > 0 ? `${highCount} high` : ""}
                                {highCount > 0 && medCount > 0 ? ", " : ""}
                                {medCount > 0 ? `${medCount} medium` : ""}
                                {(highCount > 0 || medCount > 0) && lowCount > 0 ? ", " : ""}
                                {lowCount > 0 ? `${lowCount} low` : ""})
                            </span>
                        )}
                    </h3>
                </div>

                {sortedFlags.length === 0 ? (
                    <div className="no-flags">
                        ✅ No red flags detected — this document appears fair!
                    </div>
                ) : (
                    sortedFlags.map((flag, i) => (
                        <div key={i} className={`red-flag-card severity-${flag.severity}`}>
                            <div className="red-flag-header">
                                <span className={`severity-badge ${flag.severity}`}>
                                    {flag.severity}
                                </span>
                                <span className="red-flag-title">{flag.title}</span>
                            </div>
                            {flag.clause && (
                                <div className="red-flag-clause">"{flag.clause}"</div>
                            )}
                            <p className="red-flag-explanation">{flag.explanation}</p>
                        </div>
                    ))
                )}
            </div>

            {/* Obligations */}
            {obligations && obligations.length > 0 && (
                <div className="card obligations-section animate-fade-in-up delay-3">
                    <div className="card-header">
                        <h3 className="card-title">⚖️ Your Obligations</h3>
                    </div>
                    <ul className="obligations-list">
                        {obligations.map((item, i) => (
                            <li key={i}>{item}</li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Key Dates */}
            {keyDates && keyDates.length > 0 && (
                <div className="card keydates-section animate-fade-in-up delay-4">
                    <div className="card-header">
                        <h3 className="card-title">📅 Key Dates & Deadlines</h3>
                    </div>
                    <ul className="keydates-list">
                        {keyDates.map((item, i) => (
                            <li key={i}>{item}</li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Verdict */}
            {verdict && (
                <div className="card verdict-section animate-fade-in-up delay-5">
                    <div className="card-header">
                        <h3 className="card-title">🔍 Overall Verdict</h3>
                    </div>
                    <div className="verdict-box">{verdict}</div>
                </div>
            )}
        </div>
    );
}
