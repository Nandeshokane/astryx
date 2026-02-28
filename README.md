# Astryx — Legal Documents to Plain English

> **"Know before you sign."** — Upload any legal document and get a clear, plain English summary with red-flag detection and AI-powered Q&A.

## Features

- 📝 **Plain English Summaries** — Translates dense legalese into simple bullet points
- 🚩 **Red Flag Detection** — Automatically highlights hidden fees, unfair terms, and traps
- 💬 **Interactive Q&A** — Ask questions about your document and get contextual answers
- 🌗 **Dark/Light Mode** — Toggle between themes with system preference detection
- 🔐 **User Accounts** — Login/signup with session persistence

## Tech Stack

- **Frontend:** Next.js 16 + React
- **Styling:** Vanilla CSS with CSS custom properties (dual theme)
- **AI:** OpenAI SDK (works with Groq, OpenAI, Together AI, or any compatible API)
- **PDF Parsing:** pdf-parse

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Run the dev server

```bash
npm run dev
```

### 3. Configure AI

1. Get a free API key from [Groq](https://console.groq.com)
2. Open `http://localhost:3000`
3. Click **⚙ Settings** → select **Groq (Free)** → paste your API key → Save

### 4. Use it

Upload any legal PDF → get your plain English analysis with red flags → ask questions in the chat!

## Project Structure

```
app/
├── api/
│   ├── extract/route.js   # PDF text extraction
│   ├── analyze/route.js   # AI analysis (summary + red flags)
│   └── chat/route.js      # Interactive Q&A
├── components/
│   ├── AnalysisView.js    # Summary + red flags display
│   ├── ChatPanel.js       # Interactive chat
│   ├── FileUpload.js      # Drag-and-drop upload
│   ├── LoginPage.js       # Login
│   ├── SignupPage.js      # Registration
│   └── SettingsModal.js   # API key configuration
├── globals.css            # Design system (light + dark themes)
├── layout.js              # Root layout
└── page.js                # Main app page
lib/
├── AuthContext.js          # Authentication provider
├── ThemeContext.js          # Theme provider + toggle
└── prompts.js              # AI prompt templates
```

## License

MIT
