# 🌐 AgentFlow Client - Next.js Web Console

This is the Next.js frontend web application for **AgentFlow**, an autonomous browser automation platform. It provides a premium, responsive dashboard for triggering agent tasks, live-monitoring browser sessions, approving checkpoints, and exporting extracted data.

---

## 🎨 Key Features & Screenshots

### 1. Landing Page
A dark-mode styled landing page designed to introduce the platform's autonomous capabilities.
![Landing Page](public/screenshots/landing_page.png)

### 2. Authentication Panel
Secure authentication gateway allowing users to register and log in to manage their search sessions.
![Login Page](public/screenshots/login_page.png)

### 3. Dashboard Standby
The primary control workspace in standby mode, waiting for a user to input a goal prompt and start an automation session.
![Dashboard Idle](public/screenshots/workspace_idle.png)

### 4. Active Automation & Live Stream
Shows the live browser screenshot (synchronized frame-by-frame via WebSockets) alongside the real-time execution log stream on the right.
![Live Session Stream](public/screenshots/live_session.png)

### 5. Normalized Job Records
A tabular list representation of the parsed results extracted from crawled websites, featuring search/filter functionality and direct links to apply.
![Extracted Listings](public/screenshots/extracted_listings.png)

---

## 🚀 Key Features

- **Live Browser Stream**: Direct frame-by-frame rendering of the remote Playwright browser instance.
- **Execution Stream (Timeline)**: Live logs parsed dynamically into visual cards (e.g. formatting raw JSON listings into clean job listings inline).
- **Human-in-the-Loop Checkpoints**: Action confirmation banner prompting the user to approve/reject steps before the agent proceeds.
- **Search History**: Interactive history view allowing users to review previous runs, view extracted details in a beautiful detail popup, and export data.
- **Data Exporter**: One-click CSV extraction of scraped tables.

---

## 🛠️ Technology Stack

- **Framework**: [Next.js](https://nextjs.org/) (React 19, App Router)
- **Styling**: Tailwind CSS
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)

---

## ⚙️ Environment Variables

Create a `.env` file in the root directory:

```env
NEXT_PUBLIC_AGENT_API_URL=http://localhost:8000
```
*(Point this to your running backend FastAPI server URL, e.g. `https://your-backend.railway.app` in production).*

---

## 🏃 Getting Started (Local Development)

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to view the client dashboard.

### 3. Build for Production
```bash
npm run build
npm start
```
