# Grasp
**Grasp** is a Next.js-based frontend for visualizing academic syllabi as interactive knowledge graphs. Clickable nodes represent topics, and each one generates an AI-powered explanation using Google's Gemini API — helping students understand concepts, not just read them.

## Features
- 📚 Interactive syllabus graph (powered by React Flow)
- 🤖 On-click topic explanation using Gemini
- 🧩 Modular panel layout with resizable panes
- 🪄 Markdown-rendered topic summaries
- 🧠 Persistent explanation cache via Zustand (no repeat API calls)

## Getting Started

### 1. Clone the repo
```bash
git clone https://github.com/aether-flux/grasp-frontend.git
cd grasp-frontend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set up the environment
Make sure the backend is running at `http://localhost:5000/`. You can edit the API base URL if needed in the fetch calls.
More info about the backend [here](https://github.com/swarupgoswami/grasp-backend).

### 4. Run the dev server
```bash
npm run dev
```
The app will be available at `http://localhost:3000/`.

## Built With
- Next.js (App Router)
- React Flow
- Zustand
- TailwindCSS + ShadCN
- React Markdown + remark-gfm, for rendering explanations.

## Gemini API
This frontend relies on a custom backend endpoint that interfaces with Gemini to generate explanations. For local development, ensure your backend is:
- Running at `http://localhost:5000/`
- Has a valid `GEMINI_API_KEY` and `MONGO_URI` in its `.env`

## Project Philosophy
Grasp aims to turn syllabi into **living maps of knowledge**, helping learners not just navigate what to study — but understand why.

