"use client";

import { useState } from "react";
import { Globe2, ExternalLink, Loader2, ShieldAlert } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAgentStore } from "@/store/useAgentStore";

export function BrowserPreview() {
  const browser = useAgentStore((state) => state.browser);
  const agentStatus = useAgentStore((state) => state.agentStatus);
  
  const [connectionError, setConnectionError] = useState(false);

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
            {browser.url || "about:blank"}
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
            {/* Real Browser Screenshot ONLY */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={browser.screenshot.url} 
              alt="Playwright live session screenshot" 
              className="w-full h-full object-cover relative z-10"
            />
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