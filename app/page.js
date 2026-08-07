"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion as fm, AnimatePresence } from "framer-motion";
import {
  Play,
  ArrowRight,
  Bot,
  Zap,
  CheckCircle2,
  Shield,
  Layers,
  Database,
  Sparkles,
  Terminal,
  Search,
  Globe,
  Loader2,
  FileSpreadsheet,
  MousePointer,
  Pause,
  RotateCcw,
  Check,
  X,
  AlertTriangle,
  HelpCircle
} from "lucide-react";

// Mock data representing the live automation simulation in the Hero & Transparency sections
const HERO_SIMULATED_STEPS = [
  {
    id: 1,
    time: "10:02:15 AM",
    thought: "Goal: Find Python Developer jobs in San Francisco & compile their details. Starting browser session...",
    status: "Planning",
    action: "Launch",
    selector: "chrome.init()",
    url: "about:blank"
  },
  {
    id: 2,
    time: "10:02:18 AM",
    thought: "Navigating to LinkedIn Job search for 'Python Developer' in 'San Francisco'.",
    status: "Navigating",
    action: "Navigate",
    selector: "linkedin.com/jobs/search?keywords=python&location=sf",
    url: "linkedin.com/jobs/search?keywords=python&location=sf"
  },
  {
    id: 3,
    time: "10:02:22 AM",
    thought: "Overlay popup detected blocking the screen. Need to dismiss it to view search listings.",
    status: "Recovering",
    action: "Dismiss Modal",
    selector: "button.modal-close-btn",
    url: "linkedin.com/jobs/search?keywords=python&location=sf"
  },
  {
    id: 4,
    time: "10:02:25 AM",
    thought: "Page loaded. Found search results. Scraping company names and salaries for the first listing: 'Staff Software Engineer at Stripe'.",
    status: "Extracting",
    action: "Click",
    selector: "li.job-card:nth-child(1)",
    url: "linkedin.com/jobs/view/stripe-staff-python"
  },

  {
    id: 6,
    time: "10:02:34 AM",
    thought: "Scraped: OpenAI | AI Backend Developer | $200,050 - $310,000 | Remote. Next: 'Senior Python Engineer at Scale AI'.",
    status: "Extracting",
    action: "Click",
    selector: "li.job-card:nth-child(3)",
    url: "linkedin.com/jobs/view/scaleai-senior-python"
  },
  {
    id: 7,
    time: "10:02:38 AM",
    thought: "Scraped: Scale AI | Senior Python Engineer | $170,000 - $210,000 | SF Office. All target entries extracted. Formatting results table.",
    status: "Formatting",
    action: "Compile",
    selector: "export.csv()",
    url: "linkedin.com/jobs/search?keywords=python&location=sf"
  },
  {
    id: 8,
    time: "10:02:41 AM",
    thought: "Goal achieved successfully. Compiled 3 verified job openings into a structured data format.",
    status: "Completed",
    action: "Success",
    selector: "task.finish()",
    url: "about:blank"
  }
];

const MOCK_JOB_RESULTS = [
  { company: "Stripe", role: "Staff Python Engineer", compensation: "$185k - $240k", type: "Hybrid" },
  { company: "OpenAI", role: "AI Backend Developer", compensation: "$200k - $310k", type: "Remote" },
  { company: "Scale AI", role: "Senior Python Engineer", compensation: "$170k - $210k", type: "On-site" }
];

export default function RedesignedLandingPage() {
  const [selectedSimStep, setSelectedSimStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [userPromptInput, setUserPromptInput] = useState(
    "Find Python Developer jobs on LinkedIn in San Francisco, extract salary packages, and format it in a clean table."
  );
  const [targetRoute, setTargetRoute] = useState("/register");

  useEffect(() => {
    if (localStorage.getItem("token")) {
      setTargetRoute("/workspace");
    }
  }, []);
  
  // Custom simulator loops
  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setSelectedSimStep((prev) => {
          if (prev < HERO_SIMULATED_STEPS.length - 1) {
            return prev + 1;
          } else {
            return 0; // restart loop
          }
        });
      }, 3000); // 3 seconds per step
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const currentStepData = HERO_SIMULATED_STEPS[selectedSimStep];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-150 flex flex-col font-sans overflow-x-hidden antialiased">
      {/* Background radial glows reminiscent of premium SaaS apps */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-[radial-gradient(circle_at_top,rgba(37,99,235,0.08)_0%,transparent_60%)] pointer-events-none" />
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(59,130,246,0.04)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(16,185,129,0.02)_0%,transparent_70%)] pointer-events-none" />
      
      {/* Soft Grid Layout */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1b1b1f_1px,transparent_1px),linear-gradient(to_bottom,#1b1b1f_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_80%,transparent_100%)] pointer-events-none" />

      {/* Header / Navigation Bar */}
      <header className="sticky top-0 z-50 w-full border-b border-zinc-900 bg-zinc-950/70 backdrop-blur-md px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group select-none">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform duration-200">
              B
            </div>
            <span className="font-semibold text-base tracking-wider text-zinc-100 font-mono">
              BrowserAgent
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold uppercase tracking-wider text-zinc-400">
            <a href="#how-it-works" className="hover:text-zinc-100 transition-colors">How it works</a>
            <a href="#features" className="hover:text-zinc-100 transition-colors">Features</a>
            <a href="#use-cases" className="hover:text-zinc-100 transition-colors">Use Cases</a>
            <a href="#transparency" className="hover:text-zinc-100 transition-colors">Transparency</a>
          </nav>

          <div className="flex items-center gap-4">
            <Link
              href={targetRoute}
              className="relative rounded-lg px-4.5 py-2 text-xs font-bold uppercase tracking-wider text-white transition-all bg-gradient-to-r from-blue-600 to-blue-700 shadow-md shadow-blue-900/30 hover:shadow-lg hover:shadow-blue-500/20 hover:scale-[1.02] flex items-center gap-2"
            >
              Start Free
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-16 pb-20 md:pt-24 md:pb-32 flex flex-col items-center text-center">
        {/* Release / Status Tag */}
        <fm.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-zinc-800 bg-zinc-900/50 text-[10px] uppercase font-bold tracking-widest text-blue-400 mb-6 shadow-inner"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Autonomous LLM Web Agent
        </fm.div>

        {/* Headings */}
        <fm.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl md:text-7xl font-bold tracking-tight text-white max-w-4xl leading-[1.1] mb-8 font-sans"
        >
          Give it a goal. <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-blue-500 to-indigo-500">
            Watch it work.
          </span>
        </fm.h1>

        <fm.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-base md:text-xl text-zinc-400 max-w-2xl leading-relaxed mb-10"
        >
          An autonomous AI agent that researches across multiple sites and compiles structured briefs in real-time. Describe your goal in plain English, and watch it navigate, search, click, and extract live.
        </fm.p>

        {/* Hero CTAs */}
        <fm.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full max-w-md mb-18"
        >
          <Link
            href={targetRoute}
            className="w-full sm:w-auto px-7 py-4.5 rounded-xl bg-blue-600 hover:bg-blue-500 font-semibold text-sm text-zinc-50 flex items-center justify-center gap-2 shadow-xl shadow-blue-500/20 hover:scale-[1.02] transition-all cursor-pointer border border-blue-500"
          >
            Start Automating Free
            <Play className="w-3.5 h-3.5 fill-white" />
          </Link>
          <a
            href="#how-it-works"
            className="w-full sm:w-auto px-7 py-4.5 rounded-xl bg-zinc-900 border border-zinc-800 hover:bg-zinc-850 font-semibold text-sm text-zinc-300 flex items-center justify-center gap-2 hover:text-zinc-150 transition-all"
          >
            How it works
          </a>
        </fm.div>

        {/* Hero Interactive Workspace Mockup Area */}
        <fm.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="w-full max-w-5xl bg-zinc-900/60 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl relative"
        >
          {/* Mockup Title bar */}
          <div className="bg-zinc-950/80 px-4 py-3 border-b border-zinc-800/80 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
              <span className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
              <span className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
              <div className="h-4 w-[1px] bg-zinc-800 mx-2" />
              <span className="text-[10px] text-zinc-500 font-mono select-none flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Agent Sandbox View
              </span>
            </div>
            {/* Play/Pause Simulator Control */}
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-zinc-900 border border-zinc-800 text-[10px] font-mono text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-3 h-3 text-amber-500" /> PAUSE SIMULATION
                </>
              ) : (
                <>
                  <Play className="w-3 h-3 text-emerald-500 fill-emerald-500" /> RESUME SIMULATION
                </>
              )}
            </button>
          </div>

          {/* Interactive Workspace Simulator Split Layout */}
          <div className="grid grid-cols-1 md:grid-cols-5 min-h-[460px] text-left">
            
            {/* Timeline Stream Panel (2 Columns) */}
            <div className="md:col-span-2 border-r border-zinc-800/85 bg-zinc-950/30 p-4.5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-zinc-400 font-semibold text-xs border-b border-zinc-850 pb-3 mb-4">
                  <span className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-zinc-300">
                    <Terminal className="w-4 h-4 text-blue-500" />
                    Action Timeline
                  </span>
                  <span className="text-[10px] text-zinc-500 font-mono bg-zinc-900 px-1.5 py-0.5 rounded border border-zinc-800">
                    Step {selectedSimStep + 1} of {HERO_SIMULATED_STEPS.length}
                  </span>
                </div>

                {/* Steps Timeline Container */}
                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                  {HERO_SIMULATED_STEPS.slice(0, selectedSimStep + 1).map((step, index) => {
                    const isActive = index === selectedSimStep;
                    return (
                      <div
                        key={step.id}
                        className={`p-3 rounded-xl border transition-all text-xs leading-relaxed ${
                          isActive
                            ? "bg-blue-950/15 border-blue-900/60 shadow-lg shadow-blue-950/10"
                            : "bg-zinc-900/30 border-zinc-850 text-zinc-500"
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              isActive
                                ? "bg-blue-500 animate-pulse"
                                : step.status === "Completed"
                                ? "bg-emerald-500"
                                : step.status === "Recovering"
                                ? "bg-amber-500"
                                : "bg-zinc-700"
                            }`}
                          />
                          <span className={`font-mono text-[9px] uppercase tracking-wider font-semibold ${isActive ? "text-blue-400" : "text-zinc-500"}`}>
                            {step.status}
                          </span>
                          <span className="text-[9px] font-mono opacity-50 ml-auto">{step.time}</span>
                        </div>
                        <p className={`font-mono leading-relaxed ${isActive ? "text-zinc-200" : "text-zinc-400/70"}`}>
                          {step.thought}
                        </p>
                        {step.action && (
                          <div className="mt-2 text-[9px] font-mono text-zinc-500 flex items-center gap-1.5">
                            <span className="px-1 py-0.5 rounded bg-zinc-950 border border-zinc-850 text-blue-400">{step.action}</span>
                            <span className="truncate max-w-[140px] text-zinc-600">{step.selector}</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Live Goal Input box */}
              <div className="mt-4 pt-4 border-t border-zinc-850">
                <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-1.5">Current Prompt Goal</div>
                <div className="bg-zinc-900 border border-zinc-850 rounded-lg p-2.5 flex items-start gap-2">
                  <Bot className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                  <p className="text-[10px] font-mono text-zinc-300 leading-normal">{userPromptInput}</p>
                </div>
              </div>
            </div>

            {/* Simulated Live Browser View Panel (3 Columns) */}
            <div className="md:col-span-3 flex flex-col bg-zinc-900/10">
              {/* Virtual Browser address bar */}
              <div className="bg-zinc-950/40 px-4 py-2 border-b border-zinc-850 flex items-center gap-2">
                <div className="flex gap-1.5 shrink-0">
                  <span className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
                  <span className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
                </div>
                <div className="flex-1 bg-zinc-950 border border-zinc-850 rounded px-3 py-1 text-[11px] text-zinc-400 font-mono flex items-center gap-2 max-w-md truncate">
                  <Globe className="w-3.5 h-3.5 text-zinc-500" />
                  <span className="text-zinc-500 font-sans select-none">https://</span>
                  <span>{currentStepData.url}</span>
                </div>
              </div>

              {/* Virtual Page Content Sandbox */}
              <div className="flex-1 p-6 flex flex-col justify-between relative min-h-[300px]">
                {/* Floating Agent Pointer Mock */}
                {isPlaying && currentStepData.status === "Extracting" && (
                  <fm.div
                    animate={{
                      x: [40, 150, 90],
                      y: [30, 95, 75]
                    }}
                    transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                    className="absolute z-30 pointer-events-none"
                  >
                    <div className="relative">
                      <MousePointer className="w-5 h-5 text-blue-500 fill-blue-500/25 drop-shadow-md" />
                      <div className="absolute -top-7 left-3 px-1.5 py-0.5 rounded bg-blue-600 text-[8px] text-white font-mono border border-blue-400 shadow-lg">
                        Agent Selector
                      </div>
                    </div>
                  </fm.div>
                )}

                {/* Main page content area */}
                <div className="max-w-md w-full mx-auto mt-4 bg-zinc-950/80 border border-zinc-850 rounded-xl p-5 relative overflow-hidden shadow-xl min-h-[220px] flex flex-col justify-between">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-blue-600/5 rounded-full blur-xl" />
                  
                  <div>
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-zinc-850 pb-2 mb-3">
                      <div className="flex items-center gap-1.5">
                        <Search className="w-3.5 h-3.5 text-blue-500" />
                        <span className="text-xs font-semibold text-zinc-300">
                          {currentStepData.status === "Planning" ? "Initializing Agent..." : "LinkedIn Job Search"}
                        </span>
                      </div>
                      <span className="text-[9px] font-mono bg-zinc-900 border border-zinc-800 px-1.5 py-0.5 rounded text-zinc-500">
                        {currentStepData.status}
                      </span>
                    </div>

                    {/* Web details based on current step */}
                    {currentStepData.status === "Planning" && (
                      <div className="flex flex-col items-center justify-center py-6 text-center text-zinc-500">
                        <Loader2 className="w-6 h-6 animate-spin text-blue-500 mb-2" />
                        <p className="text-[11px] font-mono">Formulating browser strategy...</p>
                      </div>
                    )}

                    {currentStepData.status === "Navigating" && (
                      <div className="space-y-2 py-2">
                        <div className="h-3 w-1/3 bg-zinc-850 rounded animate-pulse" />
                        <div className="h-6 w-full bg-zinc-900 rounded border border-zinc-850 animate-pulse" />
                        <p className="text-[10px] text-zinc-500 font-mono">Fetching page payload...</p>
                      </div>
                    )}

                    {currentStepData.status === "Recovering" && (
                      <div className="space-y-3">
                        <div className="p-2.5 bg-amber-950/20 border border-amber-900/50 rounded-lg text-[10px] text-amber-400 font-mono flex items-start gap-2">
                          <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                          <div>
                            <strong>Bypassing Modal Overlay</strong>
                            <p className="text-[9px] text-amber-500/70 mt-0.5">Attempting to locate close button selector to resume job details scraping.</p>
                          </div>
                        </div>
                        <div className="h-10 w-full bg-zinc-900/40 rounded border border-zinc-850" />
                      </div>
                    )}

                    {(currentStepData.status === "Extracting" || currentStepData.status === "Formatting") && (
                      <div className="space-y-2">
                        <div className="text-[10px] font-mono text-zinc-500">Active Job Listing Search Results:</div>
                        <div className="space-y-1.5">
                          {MOCK_JOB_RESULTS.map((job, idx) => {
                            const isCurrentHighlight = 
                              (idx === 0 && currentStepData.id === 4) ||
                              (idx === 1 && currentStepData.id === 5) ||
                              (idx === 2 && currentStepData.id === 6);
                            return (
                              <div
                                key={idx}
                                className={`p-2 rounded border text-[10px] font-mono flex justify-between items-center transition-all ${
                                  isCurrentHighlight 
                                    ? "bg-blue-950/40 border-blue-600/80 text-zinc-200" 
                                    : "bg-zinc-900/30 border-zinc-850 text-zinc-400"
                                }`}
                              >
                                <div>
                                  <span className="font-semibold text-zinc-200">{job.company}</span>
                                  <span className="text-zinc-500 mx-1.5">|</span>
                                  <span>{job.role}</span>
                                </div>
                                <span className="text-[9px] px-1 bg-zinc-950 border border-zinc-850 rounded text-blue-400">{job.compensation}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {currentStepData.status === "Completed" && (
                      <div className="space-y-3">
                        <div className="p-3 bg-emerald-950/15 border border-emerald-900/50 rounded-lg text-[10px] text-emerald-400 font-mono flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                          <div>
                            <strong>Goal Achieved Successfully</strong>
                            <p className="text-[9px] text-emerald-400/80 mt-0.5">Scraped 3 items from LinkedIn and compiled structured CSV output.</p>
                          </div>
                        </div>

                        {/* Export Action Simulation */}
                        <div className="bg-zinc-900 rounded-lg border border-zinc-850 p-2 text-[9px] font-mono flex items-center justify-between">
                          <span className="flex items-center gap-1 text-zinc-400">
                            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-500" />
                            python_jobs_sf.csv
                          </span>
                          <button className="px-2 py-1 rounded bg-emerald-600 text-white font-bold hover:bg-emerald-500 transition-colors">
                            DOWNLOAD
                          </button>
                        </div>
                      </div>
                    )}

                  </div>

                  {/* Mock browser status bar */}
                  <div className="mt-4 pt-3 border-t border-zinc-850 flex items-center justify-between text-[8px] font-mono text-zinc-600">
                    <span>DOM: Ready</span>
                    <span>No Hardcoded Script Active</span>
                  </div>
                </div>

                {/* Verification footer */}
                <div className="w-full text-center mt-4">
                  <span className="text-[9px] font-mono text-zinc-600">
                    Powered by LLM Browser-Reasoning Engine (v1.2)
                  </span>
                </div>
              </div>
            </div>

          </div>
        </fm.div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-6 py-20 border-t border-zinc-900">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-4">
            How Browser Agent Works
          </h2>
          <p className="text-zinc-400 max-w-2xl mx-auto text-sm md:text-base">
            No scripts, no selectors, no fragile APIs. Just direct browser automation guided by real-time LLM planning.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Step 1 */}
          <div className="relative bg-zinc-900/30 border border-zinc-850 p-6 rounded-2xl flex flex-col justify-between">
            <div>
              <div className="w-8 h-8 rounded-lg bg-blue-950 border border-blue-900 flex items-center justify-center font-mono font-bold text-blue-400 text-xs mb-6">
                01
              </div>
              <h3 className="font-semibold text-white text-sm mb-2 uppercase tracking-wide">Describe your goal</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Provide a prompt in plain English, like: <code className="text-blue-400 bg-zinc-950 px-1 py-0.5 rounded border border-zinc-850 font-mono">LinkedIn se python developer jobs compile karo</code>.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="relative bg-zinc-900/30 border border-zinc-850 p-6 rounded-2xl flex flex-col justify-between">
            <div>
              <div className="w-8 h-8 rounded-lg bg-blue-950 border border-blue-900 flex items-center justify-center font-mono font-bold text-blue-400 text-xs mb-6">
                02
              </div>
              <h3 className="font-semibold text-white text-sm mb-2 uppercase tracking-wide">Agent plans steps</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                The agent parses the prompt and generates a real-time plan: navigating sites, locating inputs, clicking, and filling fields.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="relative bg-zinc-900/30 border border-zinc-850 p-6 rounded-2xl flex flex-col justify-between">
            <div>
              <div className="w-8 h-8 rounded-lg bg-blue-950 border border-blue-900 flex items-center justify-center font-mono font-bold text-blue-400 text-xs mb-6">
                03
              </div>
              <h3 className="font-semibold text-white text-sm mb-2 uppercase tracking-wide">Watch Stream Live</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Follow along with full screenshots, reasoning logs, and exact interactive mouse markers showing every single click.
              </p>
            </div>
          </div>

          {/* Step 4 */}
          <div className="relative bg-zinc-900/30 border border-zinc-850 p-6 rounded-2xl flex flex-col justify-between">
            <div>
              <div className="w-8 h-8 rounded-lg bg-blue-950 border border-blue-900 flex items-center justify-center font-mono font-bold text-blue-400 text-xs mb-6">
                04
              </div>
              <h3 className="font-semibold text-white text-sm mb-2 uppercase tracking-wide">Get Clean Outputs</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Download final structured output formats (CSV, JSON tables, summary files) once the agent meets your goals.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features Grid Section */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-20 border-t border-zinc-900">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-4">
            Designed for Absolute Transparency
          </h2>
          <p className="text-zinc-400 max-w-2xl mx-auto text-sm md:text-base">
            Browser Agent isn&apos;t a black box script. Enjoy interactive controls, real-time reviews, and self-healing web navigations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <div className="bg-zinc-900/30 border border-zinc-850 rounded-2xl p-8 hover:bg-zinc-900/60 hover:border-zinc-800 transition-all duration-300 group">
            <div className="w-11 h-11 rounded-lg bg-blue-950 border border-blue-900/60 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
              <Globe className="w-5 h-5 text-blue-400" />
            </div>
            <h3 className="text-base font-semibold text-white mb-2 uppercase tracking-wider font-mono">Live Browser Preview</h3>
            <p className="text-zinc-400 text-xs leading-relaxed">
              Every tab navigation, search input, button interaction, and viewport scroll happens live in our virtual sandbox browser. Watch it execute in real time.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-zinc-900/30 border border-zinc-850 rounded-2xl p-8 hover:bg-zinc-900/60 hover:border-zinc-800 transition-all duration-300 group">
            <div className="w-11 h-11 rounded-lg bg-blue-950 border border-blue-900/60 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
              <Terminal className="w-5 h-5 text-blue-400" />
            </div>
            <h3 className="text-base font-semibold text-white mb-2 uppercase tracking-wider font-mono">Real-Time Action Timeline</h3>
            <p className="text-zinc-400 text-xs leading-relaxed">
              Get full transparency. The agent prints its exact reasoning step (e.g., &quot;Thought: I need to click renew to reach pricing.&quot;) alongside selectors and actions.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-zinc-900/30 border border-zinc-850 rounded-2xl p-8 hover:bg-zinc-900/60 hover:border-zinc-800 transition-all duration-300 group">
            <div className="w-11 h-11 rounded-lg bg-blue-950 border border-blue-900/60 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
              <Shield className="w-5 h-5 text-blue-400" />
            </div>
            <h3 className="text-base font-semibold text-white mb-2 uppercase tracking-wider font-mono">Human-in-the-Loop Control</h3>
            <p className="text-zinc-400 text-xs leading-relaxed">
              Maintain ultimate control. Pause, resume, edit, or reject the agent&apos;s actions mid-run. Approve payments, CAPTCHAs, or critical profile changes securely.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="bg-zinc-900/30 border border-zinc-850 rounded-2xl p-8 hover:bg-zinc-900/60 hover:border-zinc-800 transition-all duration-300 group">
            <div className="w-11 h-11 rounded-lg bg-blue-950 border border-blue-900/60 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
              <RotateCcw className="w-5 h-5 text-blue-400" />
            </div>
            <h3 className="text-base font-semibold text-white mb-2 uppercase tracking-wider font-mono">Graceful Error Recovery</h3>
            <p className="text-zinc-400 text-xs leading-relaxed">
              If an unexpected overlay, layout change, or login error occurs, the agent self-heals by backtracking steps, dismissing blockers, or trying alternative elements.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="bg-zinc-900/30 border border-zinc-850 rounded-2xl p-8 hover:bg-zinc-900/60 hover:border-zinc-800 transition-all duration-300 group">
            <div className="w-11 h-11 rounded-lg bg-blue-950 border border-blue-900/60 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
              <Layers className="w-5 h-5 text-blue-400" />
            </div>
            <h3 className="text-base font-semibold text-white mb-2 uppercase tracking-wider font-mono">Any Browser Workflow</h3>
            <p className="text-zinc-400 text-xs leading-relaxed">
              No task is too niche. From complex market research audits to recurring municipal portal entries, if a human can click it, Browser Agent can automate it.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="bg-zinc-900/30 border border-zinc-850 rounded-2xl p-8 hover:bg-zinc-900/60 hover:border-zinc-800 transition-all duration-300 group">
            <div className="w-11 h-11 rounded-lg bg-blue-950 border border-blue-900/60 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform">
              <Database className="w-5 h-5 text-blue-400" />
            </div>
            <h3 className="text-base font-semibold text-white mb-2 uppercase tracking-wider font-mono">Structured Data Outputs</h3>
            <p className="text-zinc-400 text-xs leading-relaxed">
              Receive outputs clean, parsed, and ready. Automatically maps scattered text pages into pristine tables, JSON databases, or downloadable spreadsheets.
            </p>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section id="use-cases" className="max-w-7xl mx-auto px-6 py-20 border-t border-zinc-900">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-4">
            Banish Tedious Browser Clicks
          </h2>
          <p className="text-zinc-400 max-w-2xl mx-auto text-sm md:text-base">
            Explore typical multi-step workflows that make teams dread manual data entry.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-zinc-900/40 border border-zinc-850 p-6.5 rounded-2xl hover:border-zinc-800 transition-colors">
            <h4 className="text-xs font-mono uppercase tracking-widest text-blue-400 mb-2">Research & Audit</h4>
            <h3 className="text-lg font-semibold text-zinc-100 mb-3">Multi-Site Research Campaigns</h3>
            <p className="text-zinc-400 text-xs leading-relaxed mb-4">
              Scours various news pages, domain registries, or competitor shops, navigating through search fields, parsing and combining descriptions across directories automatically.
            </p>
            <div className="bg-zinc-950 p-2.5 rounded-lg border border-zinc-900 font-mono text-[9px] text-zinc-500">
              Prompt: &quot;Find startup blogs on Medium, extract writer emails, and check domain availability.&quot;
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-zinc-900/40 border border-zinc-850 p-6.5 rounded-2xl hover:border-zinc-800 transition-colors">
            <h4 className="text-xs font-mono uppercase tracking-widest text-blue-400 mb-2">Data Scrapes</h4>
            <h3 className="text-lg font-semibold text-zinc-100 mb-3">Portal Extraction into Tables</h3>
            <p className="text-zinc-400 text-xs leading-relaxed mb-4">
              Navigates paginated account dashboards, downloads PDF invoices, scrapes quarterly costs, and calculates totals, putting them in a clean layout.
            </p>
            <div className="bg-zinc-950 p-2.5 rounded-lg border border-zinc-900 font-mono text-[9px] text-zinc-500">
              Prompt: &quot;Go to municipal tax portal, sign in, copy bills from 2025, and export to Excel.&quot;
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-zinc-900/40 border border-zinc-850 p-6.5 rounded-2xl hover:border-zinc-800 transition-colors">
            <h4 className="text-xs font-mono uppercase tracking-widest text-blue-400 mb-2">Workflow Filings</h4>
            <h3 className="text-lg font-semibold text-zinc-100 mb-3">Automate Tedious Account Setups</h3>
            <p className="text-zinc-400 text-xs leading-relaxed mb-4">
              Fills repetitive registration forms, uploads credentials, accepts verification redirects, logs profile creation confirmation safely and autonomously.
            </p>
            <div className="bg-zinc-950 p-2.5 rounded-lg border border-zinc-900 font-mono text-[9px] text-zinc-500">
              Prompt: &quot;Register 10 accounts on staging server using credentials.json and upload logo image.&quot;
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Transparency Section */}
      <section id="transparency" className="max-w-6xl mx-auto px-6 py-20 border-t border-zinc-900 flex flex-col lg:flex-row items-center gap-12">
        <div className="flex-1 text-left">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-blue-950 border border-blue-900/60 text-[9px] font-mono text-blue-400 uppercase tracking-widest mb-4">
            Zero Black Box Magic
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-6">
            Complete visibility into every action, every decision.
          </h2>
          <p className="text-zinc-400 text-sm leading-relaxed mb-6">
            Other AI scraping utilities run inside invisible backend scripts, making debugging or auditing workflows impossible. 
          </p>
          <p className="text-zinc-400 text-sm leading-relaxed mb-6">
            Browser Agent operates with absolute transparency. It writes its logical thoughts in a readable timeline and streams current tab snapshots, meaning you always know *why* the agent clicked an element.
          </p>
          
          <div className="space-y-3.5">
            <div className="flex items-center gap-3">
              <Check className="w-4.5 h-4.5 text-emerald-500 shrink-0" />
              <span className="text-xs text-zinc-200 font-mono">Thought-Process Logging before execution</span>
            </div>
            <div className="flex items-center gap-3">
              <Check className="w-4.5 h-4.5 text-emerald-500 shrink-0" />
              <span className="text-xs text-zinc-200 font-mono">Dynamic screenshots matched directly to step action</span>
            </div>
            <div className="flex items-center gap-3">
              <Check className="w-4.5 h-4.5 text-emerald-500 shrink-0" />
              <span className="text-xs text-zinc-200 font-mono">Secure interactive inputs for credential entering</span>
            </div>
          </div>
        </div>

        {/* Visual of Reasoning timeline stream */}
        <div className="flex-1 w-full max-w-lg bg-zinc-900/50 border border-zinc-850 p-6 rounded-2xl font-mono text-[11px] shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-xl" />
          
          <div className="flex items-center justify-between text-zinc-400 border-b border-zinc-850 pb-3 mb-4">
            <span className="flex items-center gap-1 text-[10px] text-zinc-300 font-bold uppercase tracking-wider">
              <Terminal className="w-3.5 h-3.5 text-blue-500" /> Reasoning Stream
            </span>
            <span className="text-[8px] bg-blue-950 px-1 py-0.5 text-blue-400 rounded">AUDIT LOG</span>
          </div>

          <div className="space-y-4">
            {/* Step 1 */}
            <div className="p-3 bg-zinc-950 rounded-lg border border-zinc-850 text-zinc-400">
              <div className="text-[9px] text-zinc-500 flex justify-between mb-1">
                <span>STEP_ID: #0294</span>
                <span>STATUS: RETRYING</span>
              </div>
              <p className="text-amber-400">&gt; Thought: The search button is currently covered by a cookies banner overlay. Clicking cookie banner overlay first.</p>
              <div className="mt-2 text-[9px] text-zinc-600">
                Action: <code className="bg-zinc-900 px-1 py-0.5 rounded text-blue-400">click(&quot;button.cookies-accept&quot;)</code>
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-3 bg-zinc-950 rounded-lg border border-zinc-850 text-zinc-300">
              <div className="text-[9px] text-zinc-500 flex justify-between mb-1">
                <span>STEP_ID: #0295</span>
                <span>STATUS: SUCCESS</span>
              </div>
              <p className="text-zinc-200">&gt; Thought: Banner dismissed. Search button is now clickable. Typing search keyword &apos;python developer&apos;.</p>
              <div className="mt-2 text-[9px] text-zinc-600">
                Action: <code className="bg-zinc-900 px-1 py-0.5 rounded text-blue-400">type(&quot;input#search-jobs&quot;, &quot;python developer&quot;)</code>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final Call to Action (CTA) Section */}
      <section className="max-w-5xl mx-auto px-6 py-16 mb-24 bg-gradient-to-b from-blue-950/20 to-zinc-900/10 border border-blue-900/20 rounded-3xl relative overflow-hidden text-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.06)_0%,transparent_80%)] pointer-events-none" />
        
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-6">
          Start automating your first task
        </h2>
        <p className="text-zinc-400 max-w-lg mx-auto mb-10 text-sm md:text-base leading-relaxed">
          Sign up to Browser Agent, specify your goals in plain English, and watch the browser dread disappear.
        </p>

        <Link
          href={targetRoute}
          className="inline-flex items-center gap-2 px-8 py-4.5 rounded-xl bg-blue-600 hover:bg-blue-500 font-semibold text-zinc-50 shadow-xl shadow-blue-500/20 hover:scale-[1.02] transition-all cursor-pointer border border-blue-500 text-sm"
        >
          Launch Browser Workspace
          <ArrowRight className="w-4.5 h-4.5" />
        </Link>
      </section>

      {/* Footer */}
      <footer className="w-full border-t border-zinc-900 bg-zinc-950 py-12 px-6 relative z-10 text-zinc-500 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded bg-zinc-800 flex items-center justify-center font-bold text-zinc-400 text-xs">
              B
            </div>
            <span className="font-semibold text-sm tracking-wider text-zinc-300 font-mono">
              BrowserAgent
            </span>
          </div>

          <p>© {new Date().getFullYear()} BrowserAgent. All rights reserved.</p>

          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-zinc-300 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-zinc-300 transition-colors">Terms of Use</a>
            <a href="#" className="hover:text-zinc-300 transition-colors">API Keys</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
