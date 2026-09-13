# 🎙️ communication_coach — Private AI Communication Coach

<div align="center">

[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-61dafb.svg?style=flat-square&logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.1-646cff.svg?style=flat-square&logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8.svg?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Node.js-24.x-339933.svg?style=flat-square&logo=nodedotjs)](https://nodejs.org/)
[![Gemini Live API](https://img.shields.io/badge/Gemini_Live_API-3.5_Transcribe-8e24aa.svg?style=flat-square&logo=google)](https://ai.google.dev/)
[![Gemini Flash](https://img.shields.io/badge/Gemini_Model-3.6_Flash-4285f4.svg?style=flat-square&logo=google)](https://ai.google.dev/)
[![Tests](https://img.shields.io/badge/Vitest-21_Passed-10b981.svg?style=flat-square&logo=vitest)](https://vitest.dev/)
[![Privacy](https://img.shields.io/badge/Privacy-Local--First_%26_Ephemeral-10b981.svg?style=flat-square&logo=shield)](https://github.com/jajamchlramoji/recall)

<br/>

> *“Be clear enough to follow, structured enough to remember, light enough to stay with.”*

**communication_coach** is a local-first, privacy-first personal speaking gym and private AI communication coach. Designed for high-standard professionals, team leads, and executives, it helps you become clearer in everyday communication, exceptionally memorable at storytelling, poised in public presentations and interviews, and naturally witty without forced jokes.

</div>

---

## 📑 Table of Contents

- [Product Mission](#-product-mission)
- [Key Features](#-key-features)
- [Live Feedback HUD & Line-by-Line Rewrites](#-live-feedback-hud--line-by-line-rewrites)
- [Privacy & Ephemeral Storage Architecture](#-privacy--ephemeral-storage-architecture)
- [Architecture & Tech Stack](#-architecture--tech-stack)
- [Official Gemini Models Integration](#-official-gemini-models-integration)
- [Project Structure](#-project-structure)
- [Quick Start Guide](#-quick-start-guide)
- [Automated Testing Suite](#-automated-testing-suite)
- [The 6 Core Skill Tracks](#-the-6-core-skill-tracks)
- [License & Privacy Guarantee](#-license--privacy-guarantee)

---

## 🎯 Product Mission

Most communication tools are either generic spell-checkers or awkward teleprompters. **communication_coach** is neither. It is an intentional **daily-practice speaking gym** that trains speech muscle memory through:

- **Clarity & Correctness**: Cutting preamble throat-clearing, replacing hedging with active ownership, and enforcing the Bottom-Line-Upfront (BLUF) standard.
- **Memorable Storytelling**: Constructing narratives across 6 fundamental story markers: *Hook → Context → Tension → Insight → Concrete Example → Action Takeaway*.
- **Executive Poise**: Rewarding deliberate silence and comfortable breath boundaries while eliminating frantic filler words (*um*, *basically*, *kind of*, *you know*).
- **Purposeful Levity**: Teaching natural, understated tension release (contrast, self-aware understatement, surprising comparison, callbacks) without forced comedy.

---

## ✨ Key Features

```
┌────────────────────────────────────────────────────────────────────────┐
│                   COMMUNICATION_COACH SPEAKING STUDIO                  │
├──────────────────────────┬─────────────────────────────────────────────┤
│   Live Speaking Stage    │      Active Real-Time Feedback HUD          │
│                          ├─────────────────────────────────────────────┤
│  • 60s–10m Calm Timer    │  • Speaking Cadence (Live WPM Meter)        │
│  • Audio Energy Bar      │  • Real-Time Filler Counter (um, basically) │
│  • Thought Boundary Lamp │  • Observable Camera Framing Guide          │
│  • Subtle Cue Governor   │  • Live Line-by-Line "Formatted Better"     │
└──────────────────────────┴─────────────────────────────────────────────┘
```

### 1. Studio Dashboard
- **Guiding Principle**: Prominently anchors your session mindset.
- **Streak Tracker & Mode History**: Builds daily consistency across meeting replies, speeches, interviews, and impromptu curveballs.
- **5-Dimension Trend Bars**: Tracks progress over time for *Clarity*, *Structure*, *Audience Engagement*, *Delivery & Pacing*, and *Purposeful Wit*.
- **Baseline Assessment Indicator**: Shows statistical confidence based on session volume (solidifies after 5 sessions).
- **Recommended 5–10 Min Next Practice**: Daily actionable exercise card.

### 2. Session Setup
- **4 Real-World Situations**:
  1. *Public Speech / Presentation* (e.g. legacy sunset announcements, team realignment).
  2. *Meeting / Professional Reply* (e.g. timeline slippage defense, scope pushback).
  3. *Interview* (e.g. incomplete data trade-offs, managing failure).
  4. *Impromptu Curveballs* (e.g. town hall pushback, CEO elevator pitches).
- **Seeded Realistic Challenge Prompts**: High-stakes, nuanced scenarios—no generic school prompts.
- **Customizable Duration**: 1m, 2m, 3m, 5m, 10m.
- **Audience Context**: Leadership, Colleagues, Clients, Interview Panel, General Public.
- **Coaching Intensity**: *Gentle live, direct afterward* (default), *Silent observer*, or *Rhythm coach*.
- **Camera Mode**: Audio-only or Audio + Observable Delivery Signals.
- **Explicit 3-Way Storage Choice**: Ephemeral, Metrics Only, or Full Local Recording.

### 3. Live Practice Studio
- **Focused, Calm Dark-Slate Workspace**: Designed like a supportive rehearsal studio, not a surveillance dashboard.
- **Single Subtle Next Cue**: One actionable cue at a time (*“Land the point.”*, *“Add one concrete example.”*, *“Pause — let that idea breathe.”*, *“Name the tension.”*, *“Give them the why.”*, *“Try a lighter bridge.”*).
- **Thought-Boundary Detection**: Cues are evaluated only during natural pauses or sustained rambling stretches; the assistant **never** speaks over the user.
- **Live Streaming Subtitles**: Distinguishes tentative interim hypotheses from finalized speech segments.
- **Observable Visual Delivery (Optional)**: 100% on-device framing, head stability, and eye contact indicators.

### 4. 12-Section Post-Session Coaching Debrief
1. **One-Sentence Executive Summary**: Distillation of core communication intent.
2. **“What People Will Remember” Spotlight**: The single most durable memory anchor or idea.
3. **Scorecard with Evidence**: 7 dimensions (Clarity, Concision, Structure, Storytelling, Engagement, Delivery, Wit) backed by concrete speech telemetry.
4. **Three Precise Strengths**: Quoting exact moments and timestamps.
5. **Three Highest-Leverage Improvements**: Direct and constructive with before/after contrast comparisons.
6. **Friction Spots Breakdown**: Filler count & density per 100 words, repeated phrases, run-ons, weak transitions, and jargon.
7. **Story Map Architecture**: Visual Hook → Context → Tension → Insight → Example → Takeaway evaluator.
8. **Audience Engagement Analysis**: Honestly labeled *“likely risks”* from speech patterns (e.g., abstraction without examples).
9. **“Make It Memorable” Rewrites**: Upgraded opening, connective bridge, vivid analogy, and closing in the user's authentic voice.
10. **“Lighter Moment” Option**: Teaches the mechanics of understated levity without forced jokes.
11. **Interactive Line-by-Line Replay**: Clickable transcript lines with alternative phrasings.
12. **Immediate Skill Retry**: 30–60 second targeted drill with one-click setup.

---

## ⚡ Live Feedback HUD & Line-by-Line Rewrites

communication_coach analyzes your speech **sentence-by-sentence in real time**:

```text
[0:14]  Score: 45/100 • Hedging
You Said: “Um, so basically we kind of had to delay the launch by two weeks because of Stripe.”
✨ Formatted Better: “We delayed the launch by two weeks to finalize our Stripe compliance sign-off.”
💡 Coach Tip: Eliminate hedging language to state timeline adjustments with ownership.
```

- **Live Line Scoring**: Automatically evaluates sentence directness (0–100 scale) with badges (`Crisp & Direct`, `Strong Point`, `Hedging / Softener`, `Wordy / Run-on`).
- **Inline "Formatted Better" Cards**: Real-time cleaner phrasings generated instantly (sub-20ms heuristic + async `gemini-3.6-flash` refinement).
- **Speedometer**: Dynamic WPM tracking (Optimal: 125–155 WPM, Rushing: >165 WPM, Slow: <110 WPM).
- **Live Filler Counter**: Real-time ticker tracking filler density as you speak.
- **Mode Toggle**: Seamlessly switch between **Active Feedback** and **Subtle Cue Only** with one click in the studio header.

---

## 🔒 Privacy & Ephemeral Storage Architecture

communication_coach enforces uncompromising data privacy standards:

```
                  ┌────────────────────────────────────────────────────────┐
                  │                 BROWSER CLIENT (Local)                 │
                  │   • Web Audio API (16kHz PCM downsampler)              │
                  │   • Local Canvas Video Analysis (Zero frames upload)   │
                  │   • IndexedDB & LocalStorage (User-controlled)         │
                  └───────────────────────────┬────────────────────────────┘
                                              │ Audio chunks / WebSocket
                                              ▼
                  ┌────────────────────────────────────────────────────────┐
                  │        COMMUNICATION_COACH LOCAL BACKEND PROXY         │
                  │   • Node.js 24 + Express + Native WebSockets           │
                  │   • GEMINI_API_KEY isolated in server/.env             │
                  │   • NEVER exposed to frontend, logs, or screenshots    │
                  └───────────────────────────┬────────────────────────────┘
                                              │ Authenticated upstream
                                              ▼
                  ┌────────────────────────────────────────────────────────┐
                  │                 OFFICIAL GOOGLE GEMINI                 │
                  │   • gemini-3.5-transcribe-live (WebSocket Speech)      │
                  │   • gemini-3.6-flash (Structured Debriefs & Rewrites)  │
                  └────────────────────────────────────────────────────────┘
```

1. **Server-Side API Key Proxy**:
   - The user's Gemini API key is configured strictly on the backend in `.env`.
   - The key is **never** bundled in browser client code, network inspection panels, client-side bundles, or logs.
2. **Three-Tier Storage Choice on Every Session**:
   - **1. Ephemeral (Default)**: Process live, save nothing. Transcripts, audio, and metrics exist only in volatile RAM and are completely erased when leaving or closing the session.
   - **2. Metrics Only**: Transcripts and scorecards are saved locally in `localStorage`. Audio streams are discarded immediately upon report generation.
   - **3. Full Recording**: Audio recordings are saved strictly in your local browser’s `IndexedDB`. Zero media files are uploaded to any external server.
3. **Observable Delivery Cues Only**:
   - Camera analysis runs 100% locally on-device via HTML5 canvas heuristics (measuring centering, head motion stability, and optical camera gaze).
   - communication_coach **strictly prohibits and avoids pseudo-science**: it never claims to infer emotions, personality, confidence, intelligence, or audience reaction.
4. **Complete Data Sovereignty**:
   - Delete individual sessions with a single click in the **Session History** archive.
   - Permanently purge all databases and streak records with the **Clear All Data** control.

---

## 🤖 Official Gemini Models Integration

| Capability | Model Name | Protocol | Role & Functionality |
| :--- | :--- | :--- | :--- |
| **Live Speech Recognition** | `gemini-3.5-transcribe-live` | Upstream WebSocket (`v1beta`) | Real-time speech streaming over 16kHz PCM audio with interim hypotheses and finalized turns. |
| **Coaching Debrief & Rewrites** | `gemini-3.6-flash` | REST (`generateContent` with JSON schema) | High-standard, candid debrief analysis generating structured scorecards, story maps, and memorable rewrites. |
| **Rapid Line Refinement** | `gemini-3.6-flash` | REST (`/api/analyze-line`) | Sub-second sentence polish providing inline "Formatted Better" alternatives while speaking. |
| **Offline & Demo Mode** | Local Heuristic Engine | In-browser / Node.js | Provides complete simulation and analysis without requiring an API key or internet connection. |

---

## 📂 Project Structure

```text
communication_coach/
├── .env.example                     # Environment template (never commit real keys)
├── .gitignore                       # Standard rules ignoring .env, recordings, dist
├── package.json                     # Root workspace configuration
├── vitest.config.ts                 # Vitest test runner configuration
├── README.md                        # Comprehensive documentation
│
├── server/                          # Local Backend Proxy
│   ├── package.json
│   ├── tsconfig.json
│   └── src/
│       ├── index.ts                 # Express REST & WebSocket server
│       ├── geminiProxy.ts           # Gemini Live WebSocket proxy (gemini-3.5-transcribe-live)
│       └── analyzer.ts              # Coaching report engine (gemini-3.6-flash)
│
├── client/                          # React + Vite Client
│   ├── index.html
│   ├── package.json
│   ├── vite.config.ts               # Proxies /api and /ws to backend
│   ├── tailwind.config.js
│   └── src/
│       ├── main.tsx
│       ├── App.tsx                  # Root state machine & view router
│       ├── types/index.ts           # Shared TypeScript definitions
│       ├── data/
│       │   ├── prompts.ts           # Realistic seeded challenge prompts
│       │   ├── skillTracks.ts       # 6 core skill tracks & progressive exercises
│       │   └── mockReports.ts       # Comprehensive offline demo reports
│       ├── services/
│       │   ├── storage.ts           # Ephemeral, metrics, & IndexedDB storage engine
│       │   ├── audioCapture.ts      # Web Audio API 16kHz PCM downsampler
│       │   ├── visualDelivery.ts    # Observable canvas framing analyzer
│       │   ├── cueEngine.ts         # Subtle live cue governor
│       │   ├── analyzerUtils.ts     # Speech metrics, WPM, and story map parser
│       │   └── liveLineAnalyzer.ts  # Real-time sentence scoring & formatted better
│       └── components/
│           ├── Navbar.tsx           # Header, streak counter, status badge, privacy trigger
│           ├── HomeDashboard.tsx    # Studio dashboard, 5 trends, principle quote
│           ├── SessionSetupModal.tsx# Scenario, duration, audience, sensors, storage choice
│           ├── LivePracticeView.tsx # Live studio, WPM HUD, live cues, formatted better stream
│           ├── PostSessionReport.tsx# 12-section debrief with interactive replay
│           ├── SkillTracksView.tsx  # 6 skill tracks curriculum browser
│           ├── HistoryView.tsx      # Authorized session archives & deletion controls
│           └── PrivacyModal.tsx     # Privacy architecture & nuclear data wipe
│
└── tests/                           # Automated Vitest Test Suite
    ├── cueEngine.test.ts            # Live cue cooldown & thought boundary tests
    ├── liveLineAnalyzer.test.ts     # Real-time line scoring & formatted better tests
    ├── scoring.test.ts              # WPM, filler word density, & score normalization
    ├── storyMap.test.ts             # 6-stage story map pattern detection
    ├── storagePrivacy.test.ts       # Ephemeral isolation & permanent delete tests
    └── demoFlow.test.ts             # End-to-end demo session simulation tests
```

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js**: v20+ (tested on Node v24)
- **npm**: v10+

### 2. Environment Configuration
Copy the `.env.example` file to `.env`:
```bash
cp .env.example .env
```
Configure your environment variables:
```env
PORT=3001
GEMINI_API_KEY=your_gemini_api_key_here
DEMO_MODE=false
```
*(If no API key is provided, communication_coach runs automatically in Demo Mode with realistic simulated speech streams and seeded debrief reports).*

### 3. Install Dependencies
```bash
npm install
```

### 4. Run Development Servers
Start both backend proxy and frontend Vite development servers:
```bash
npm run dev
```
- Frontend UI: **`http://localhost:5173`**
- Backend Proxy: **`http://localhost:3001`** (WebSocket at `ws://localhost:3001/ws/live`)

### 5. Build for Production
```bash
npm run build
```
Compiles server TypeScript to `server/dist` and builds the client bundle with Vite.

---

## 🧪 Automated Testing Suite

communication_coach includes 21 comprehensive unit and integration tests across 6 test suites:

```bash
npm test
```

### Test Coverage Highlights:
- **`tests/cueEngine.test.ts`**: Verifies single subtle cue invariant, thought boundary pauses, and cooldown suppression.
- **`tests/liveLineAnalyzer.test.ts`**: Tests real-time line scoring, hedging detection, filler stripping, and run-on splitting.
- **`tests/scoring.test.ts`**: Validates WPM math, single/multi-word filler counts, and dimension score normalization `[0, 100]`.
- **`tests/storyMap.test.ts`**: Verifies pattern detection for Hook, Context, Tension, Insight, Example, and Takeaway stages.
- **`tests/storagePrivacy.test.ts`**: Ensures Ephemeral mode never writes to disk, verifies Metrics-only mode, and tests deletion.
- **`tests/demoFlow.test.ts`**: Validates realistic seeded prompts, 6 skill tracks, and end-to-end report generation.

---

## 📚 The 6 Core Skill Tracks

1. **Clear Replies**: Master bottom-line-upfront (BLUF) answering, two-reason arguments, and clean transitions.
2. **Memorable Stories**: Anchor abstract ideas in sensory detail, dramatic tension, and unforgettable narrative turns.
3. **Executive Presence**: Command respect through deliberate three-second breath pauses, low vocal tension, and zero-apology framing.
4. **Interview Thinking**: Structure answers on the fly with STAR signposting, transparent trade-off calculus, and honest retrospectives.
5. **Impromptu Speaking**: Formulate crisp replies under pressure using the Past/Present/Future and Zoom-In/Zoom-Out frameworks.
6. **Lightness and Wit**: Release room tension gracefully using understated contrast, self-aware callbacks, and relatable analogies without forced humor.

---

## ⚖️ License & Privacy Guarantee

- **Local-First Software**: All processing is mediated through your local machine.
- **Zero Third-Party Tracking**: No analytics scripts, tracking cookies, or external telemetry libraries are included.
- **Open Source**: MIT License.
