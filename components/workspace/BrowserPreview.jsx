"use client";

import { useEffect, useState } from "react";
import { Globe2, ExternalLink, Loader2, Image as ImageIcon, ShieldAlert, Cpu } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAgentStore } from "@/store/useAgentStore";

export function BrowserPreview() {
  const browser = useAgentStore((state) => state.browser);
  const agentStatus = useAgentStore((state) => state.agentStatus);
  
  const [connectionError, setConnectionError] = useState(false);

  const getSvgState = () => {
    if (!browser.screenshot?.url) return "idle";
    const urlText = browser.screenshot.url;
    if (urlText.includes("Navigating")) return "navigating";
    if (urlText.includes("Extracting")) return "extracting";
    if (urlText.includes("Approval") || urlText.includes("Awaiting")) return "approval";
    if (urlText.includes("Completed") || urlText.includes("Success")) return "completed";
    return "idle";
  };

  const isSvg = browser.screenshot?.url?.startsWith("data:image/svg+xml") || browser.screenshot?.url?.includes("<svg");
  const svgState = getSvgState();

  const getDisplayUrl = () => {
    if (!browser.screenshot?.url) return "about:blank";
    if (isSvg) {
      if (svgState === "navigating") return "https://www.linkedin.com/jobs";
      if (svgState === "extracting" || svgState === "approval") return "https://www.linkedin.com/jobs/search?keywords=python";
      if (svgState === "completed") return "https://www.linkedin.com/jobs/search?keywords=python";
    }
    return browser.url;
  };

  return (
    <div className="flex-1 border border-zinc-800/80 rounded-xl bg-zinc-900 overflow-hidden flex flex-col shadow-2xl ring-1 ring-white/5 relative">
      {/* Browser Toolbar */}
      <div className="h-12 border-b border-zinc-800 bg-zinc-950/80 flex items-center px-4 gap-4 backdrop-blur-md shrink-0">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/80 hover:bg-red-400 transition-colors cursor-pointer"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500/80 hover:bg-yellow-400 transition-colors cursor-pointer"></div>
          <div className="w-3 h-3 rounded-full bg-green-500/80 hover:bg-green-400 transition-colors cursor-pointer"></div>
        </div>
        
        {/* Address Bar */}
        <div className="flex-1 max-w-2xl bg-zinc-900/80 rounded-md border border-zinc-700/50 h-7 flex items-center px-3 gap-2 group hover:border-zinc-600 transition-colors cursor-text">
          <Globe2 className="w-3 h-3 text-zinc-500 group-hover:text-zinc-400 transition-colors" />
          <span className="text-xs text-zinc-300 font-mono flex-1 truncate select-all">
            {getDisplayUrl()}
          </span>
          <ExternalLink className="w-3 h-3 text-zinc-600 hover:text-zinc-400 cursor-pointer" />
        </div>

        {/* Status Indicator */}
        <div className="flex items-center gap-2">
          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
            connectionError 
              ? 'bg-red-950 text-red-400 border-red-900/50' 
              : 'bg-zinc-800 text-zinc-300 border-zinc-700/50'
          }`}>
            {connectionError ? "disconnected" : agentStatus.phase}
          </span>
        </div>
      </div>
      
      {/* Browser Viewport */}
      <div className="flex-1 bg-zinc-950 flex items-center justify-center relative overflow-hidden">
        {/* Connection Error Message */}
        {connectionError && (
          <div className="absolute inset-0 bg-zinc-950/90 z-35 flex items-center justify-center p-6 text-center backdrop-blur-sm">
            <div className="max-w-xs">
              <ShieldAlert className="w-12 h-12 text-red-500 mx-auto mb-3 animate-bounce" />
              <h3 className="text-sm font-semibold text-zinc-200">API Connection Lost</h3>
              <p className="text-xs text-zinc-500 mt-1">Failed to establish stream connection. Retrying in background...</p>
            </div>
          </div>
        )}

        {/* Loading Overlay */}
        <AnimatePresence>
          {browser.isLoading && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-zinc-950/60 z-30 flex items-center justify-center backdrop-blur-[2px]"
            >
              <div className="flex flex-col items-center gap-2 bg-zinc-900/90 px-4 py-3 rounded-lg border border-zinc-800 shadow-xl">
                <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
                <span className="text-xs text-zinc-400 font-medium">Headless Browser Loading...</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Screenshot Viewport Container */}
        {browser.screenshot?.url ? (
          <div className="w-full h-full flex items-center justify-center">
            {isSvg ? (
              /* If SVG, render a clean client-mocked web view instead of nested Chrome frames */
              <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-950 p-6 text-center">
                {svgState === "navigating" && (
                  <div className="space-y-4">
                    <Loader2 className="w-8 h-8 text-blue-500 animate-spin mx-auto" />
                    <h3 className="text-sm font-semibold text-zinc-250">Navigating to LinkedIn Job Search...</h3>
                    <p className="text-xs text-zinc-500">Establishing session context and opening page</p>
                  </div>
                )}
                {svgState === "extracting" && (
                  <div className="space-y-4">
                    <Loader2 className="w-8 h-8 text-emerald-500 animate-spin mx-auto" />
                    <h3 className="text-sm font-semibold text-zinc-250">Extracting job listings from LinkedIn page...</h3>
                    <p className="text-xs text-zinc-500">Scanning elements and collecting card parameters</p>
                  </div>
                )}
                {svgState === "approval" && (
                  <div className="space-y-4 max-w-sm bg-zinc-900 border border-zinc-800 rounded-xl p-5 shadow-2xl">
                    <span className="text-xl">⚠️</span>
                    <h3 className="text-sm font-semibold text-zinc-200">Verification Checkpoint Reached</h3>
                    <p className="text-xs text-zinc-500">Verify extracted listing data. Approve or Reject the step in the controls panel on the right.</p>
                  </div>
                )}
                {svgState === "completed" && (
                  <div className="space-y-4">
                    <span className="text-3xl">✅</span>
                    <h3 className="text-sm font-semibold text-zinc-200">Task Completed Successfully!</h3>
                    <p className="text-xs text-zinc-500">All job entries have been parsed and compiled.</p>
                  </div>
                )}
              </div>
            ) : (
              /* Real Browser Screenshot */
              /* eslint-disable-next-line @next/next/no-img-element */
              <img 
                src={browser.screenshot.url} 
                alt="Playwright live session screenshot" 
                className="w-full h-full object-cover relative z-10"
              />
            )}
          </div>
        ) : (
          /* Empty State / Initial Placeholder representation */
          <div className="text-center text-zinc-500 text-xs font-mono animate-pulse">
            Waiting for browser to start...
          </div>
        )}
      </div>
    </div>
  );
}
