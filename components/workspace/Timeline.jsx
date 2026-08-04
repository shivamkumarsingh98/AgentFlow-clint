"use client";

import { useEffect, useRef, useState } from "react";
import { CheckCircle2, Clock, AlertTriangle, Info, ShieldAlert, RotateCcw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAgentStore } from "@/store/useAgentStore";

export function Timeline() {
  const timeline = useAgentStore((state) => state.timeline);
  const currentTask = useAgentStore((state) => state.currentTask);
  const addTimelineEvent = useAgentStore((state) => state.addTimelineEvent);
  
  const containerRef = useRef(null);
  const bottomRef = useRef(null);
  const [streamActive, setStreamActive] = useState(false);

  useEffect(() => {
    if (currentTask?.status === "running") {
      setStreamActive(true);
    } else {
      setStreamActive(false);
    }
  }, [currentTask?.status]);

  // Automatically scroll to the newest event when timeline changes
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [timeline]);

  const getStatusIcon = (status) => {
    switch (status) {
      case "success": return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />;
      case "loading": return <Clock className="w-3.5 h-3.5 text-blue-400" />;
      case "warning": return <AlertTriangle className="w-3.5 h-3.5 text-yellow-500" />;
      case "error": return <AlertTriangle className="w-3.5 h-3.5 text-red-500" />;
      default: return <Info className="w-3.5 h-3.5 text-zinc-400" />;
    }
  };

  return (
    <div 
      ref={containerRef}
      className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-3 scroll-smooth"
    >
      <AnimatePresence initial={false}>
        {timeline.length > 0 ? (
          timeline.map((event) => (
            <motion.div 
              layout
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              key={event.id} 
              className="bg-zinc-900/60 border border-zinc-800/80 rounded-lg p-3 hover:bg-zinc-900 hover:border-zinc-700/80 transition-all shadow-sm group flex items-start gap-3 shrink-0"
            >
              <div className={`mt-0.5 p-1.5 rounded-md ${
                event.status === 'success' ? 'bg-emerald-500/10' : 
                event.status === 'loading' ? 'bg-blue-500/10' : 
                event.status === 'warning' ? 'bg-yellow-500/10' : 
                event.status === 'error' ? 'bg-red-500/10' : 'bg-zinc-800'
              }`}>
                {getStatusIcon(event.status)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1 gap-2">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                      event.status === 'success' ? 'bg-emerald-950 text-emerald-400 border border-emerald-900/50' : 
                      event.status === 'loading' ? 'bg-blue-950 text-blue-400 border border-blue-900/50' : 
                      event.status === 'warning' ? 'bg-yellow-950 text-yellow-400 border border-yellow-900/50' : 
                      event.status === 'error' ? 'bg-red-950 text-red-400 border border-red-900/50' : 'bg-zinc-800'
                    }`}>
                      {event.badge}
                    </span>
                    
                    {event.retryCount > 0 && (
                      <span className="text-[10px] bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded border border-zinc-700/50 flex items-center gap-1 font-mono">
                        <RotateCcw className="w-2.5 h-2.5" /> Retry {event.retryCount}
                      </span>
                    )}
                  </div>
                  
                  <span className="text-[10px] text-zinc-500 font-mono shrink-0">{event.timestamp}</span>
                </div>
                <p className="text-sm text-zinc-300 group-hover:text-zinc-200 transition-colors leading-relaxed">{event.text}</p>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="h-full flex items-center justify-center border border-dashed border-zinc-800/80 rounded-lg bg-zinc-900/10 text-zinc-600 text-xs py-8">
            <div className="text-center">
              <p className="font-medium">Timeline is empty</p>
              <p className="text-[10px] text-zinc-500 mt-1">Start a task to stream live agent events.</p>
            </div>
          </div>
        )}
      </AnimatePresence>
      <div ref={bottomRef} className="h-1 shrink-0" />
    </div>
  );
}
