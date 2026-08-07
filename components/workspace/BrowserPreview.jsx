"use client";

import { useState } from "react";
import { Globe2, ExternalLink, Loader2, ShieldAlert } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAgentStore } from "@/store/useAgentStore";

export function BrowserPreview() {
  const browser = useAgentStore((state) => state.browser);
  const agentStatus = useAgentStore((state) => state.agentStatus);
  const currentTask = useAgentStore((state) => state.currentTask);
  
  const displayUrl = browser.url && browser.url !== "about:blank" ? browser.url : "about:blank";

  const handleOpenUrl = () => {
    if (displayUrl && displayUrl.startsWith("http")) {
      window.open(displayUrl, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div className="w-full h-full border border-zinc-200 rounded-xl bg-white overflow-hidden flex flex-col shadow-xs relative">
      {/* Browser Toolbar */}
      <div className="h-10 border-b border-zinc-200 bg-zinc-50 flex items-center px-3.5 gap-3 shrink-0">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400"></div>
        </div>
        
        {/* Address Bar */}
        <div 
          onClick={handleOpenUrl}
          className="flex-1 bg-white rounded-md border border-zinc-200 h-6 flex items-center px-2.5 gap-2 group hover:border-zinc-300 transition-colors cursor-pointer shadow-2xs"
          title={displayUrl.startsWith("http") ? "Click to open URL in new tab" : ""}
        >
          <Globe2 className="w-3 h-3 text-zinc-400 group-hover:text-blue-600 transition-colors shrink-0" />
          <span className="text-[11px] text-zinc-700 font-mono flex-1 truncate select-all">
            {displayUrl}
          </span>
          {displayUrl.startsWith("http") && (
            <ExternalLink className="w-3 h-3 text-zinc-400 group-hover:text-blue-600 shrink-0 transition-colors" />
          )}
        </div>

        {/* Status Indicator */}
        <div className="flex items-center gap-2">
          <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
            currentTask?.status === 'running' 
              ? 'bg-blue-50 text-blue-700 border-blue-200' 
              : currentTask?.status === 'waiting_approval'
              ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
              : currentTask?.status === 'completed'
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : 'bg-zinc-100 text-zinc-500 border-zinc-200'
          }`}>
            {currentTask?.status || "idle"}
          </span>
        </div>
      </div>
      
      {/* Browser Viewport */}
      <div className="flex-1 bg-zinc-100/60 flex items-center justify-center relative overflow-auto p-2">
        {/* Screenshot Viewport Container */}
        {browser.screenshot?.url ? (
          <div className="w-full h-full flex items-start justify-center overflow-auto rounded-lg bg-white border border-zinc-200 shadow-2xs">
            {/* Real Browser Screenshot */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={browser.screenshot.url} 
              alt="Playwright live session screenshot" 
              className="max-w-full max-h-full object-contain rounded shadow-xs"
            />
          </div>
        ) : (
          /* Empty State */
          <div className="text-center text-zinc-400 text-xs font-mono p-8 flex flex-col items-center gap-2">
            <Globe2 className="w-7 h-7 text-zinc-300 animate-pulse" />
            <span>Waiting for live browser session...</span>
          </div>
        )}
      </div>
    </div>
  );
}