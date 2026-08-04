"use client";

import { Activity, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BrowserPreview } from "./BrowserPreview";
import { Timeline } from "./Timeline";
import { ResultsPanel } from "./ResultsPanel";
import { useAgentStore } from "@/store/useAgentStore";

export function BrowserWorkspace() {
  const [resultsOpen, setResultsOpen] = useState(false);
  const currentTask = useAgentStore((state) => state.currentTask);
  const agentStatus = useAgentStore((state) => state.agentStatus);

  useEffect(() => {
    if (
      agentStatus?.phase === "extracting" ||
      agentStatus?.phase === "done" ||
      currentTask?.status === "completed"
    ) {
      setResultsOpen(true);
    }
  }, [agentStatus?.phase, currentTask?.status]);

  return (
    <main className="flex-1 flex flex-col min-w-0 bg-zinc-950 overflow-hidden relative">
      {/* Browser Preview (70% height) */}
      <div className="flex flex-col p-4 pb-2 transition-all duration-300 z-10" style={{ height: resultsOpen ? '45%' : '72%' }}>
        <div className="flex items-center justify-between mb-3 shrink-0">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold text-zinc-300 tracking-wide">Browser Preview</h2>
          </div>
          <div className="flex items-center gap-2 text-xs text-zinc-500 font-mono">
            1920x1080 <span className="w-px h-3 bg-zinc-800"></span> 100%
          </div>
        </div>
        
        <BrowserPreview />
      </div>

      {/* Event Timeline & Results Container */}
      <div className="flex-1 flex flex-col p-4 pt-2 overflow-hidden bg-zinc-950/50 z-20" style={{ height: resultsOpen ? '55%' : '28%' }}>
        {/* Toggle Results Button */}
        <div className="flex items-center justify-between mb-3 shrink-0">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-zinc-500" />
            <h2 className="text-sm font-semibold text-zinc-300 tracking-wide">Action Timeline</h2>
          </div>
          <button 
            onClick={() => setResultsOpen(!resultsOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 hover:text-zinc-200 text-xs font-medium text-zinc-400 transition-all active:scale-95"
          >
            {resultsOpen ? "Hide Panel" : "View Results Panel"}
            <motion.div animate={{ rotate: resultsOpen ? 180 : 0 }}>
              <ChevronDown className="w-3.5 h-3.5" />
            </motion.div>
          </button>
        </div>
        
        <div className="flex-1 flex gap-4 overflow-hidden">
          {/* Timeline Panel */}
          <div className={`flex flex-col transition-all duration-300 ${resultsOpen ? 'w-1/3 border-r border-zinc-800/60 pr-2' : 'w-full'} overflow-hidden`}>
            <Timeline />
          </div>

          {/* Results Table Panel */}
          <AnimatePresence>
            {resultsOpen && (
              <motion.div 
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "66.666%" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                className="flex-1 overflow-hidden h-full flex flex-col pl-2"
              >
                <ResultsPanel />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}
