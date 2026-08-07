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
      className="flex-1 overflow-y-auto pr-2 space-y-2.5 scrollbar-thin scrollbar-thumb-zinc-300 scrollbar-track-transparent"
    >
      <AnimatePresence initial={false}>
        {timeline.length > 0 ? (
          timeline.map((event) => (
            <motion.div 
              layout
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.12 }}
              key={event.id} 
              className="bg-white border border-zinc-200 rounded-xl p-3 hover:border-zinc-300 transition-all shadow-2xs flex items-start gap-2.5 shrink-0"
            >
              <div className={`mt-0.5 p-1 rounded-md shrink-0 ${
                event.status === 'success' ? 'bg-emerald-50 text-emerald-600' : 
                event.status === 'loading' ? 'bg-blue-50 text-blue-600' : 
                event.status === 'warning' ? 'bg-yellow-50 text-yellow-600' : 
                event.status === 'error' ? 'bg-red-50 text-red-600' : 'bg-zinc-100 text-zinc-600'
              }`}>
                {getStatusIcon(event.status)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1 gap-2">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.2 rounded border ${
                    event.status === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
                    event.status === 'loading' ? 'bg-blue-50 text-blue-700 border-blue-200' : 
                    event.status === 'warning' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : 
                    event.status === 'error' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-zinc-100 text-zinc-600 border-zinc-200'
                  }`}>
                    {event.badge}
                  </span>
                  <span className="text-[10px] text-zinc-400 font-mono shrink-0">{event.timestamp}</span>
                </div>
                <div className="text-xs text-zinc-800 leading-relaxed font-sans break-words whitespace-pre-wrap">
                  {event.text}
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="h-full flex items-center justify-center border border-dashed border-zinc-300 rounded-xl bg-zinc-50 text-zinc-400 text-xs py-10">
            <div className="text-center space-y-1">
              <p className="font-semibold text-zinc-600">Timeline Stream Standby</p>
              <p className="text-[11px] text-zinc-400">Events will populate here in real-time.</p>
            </div>
          </div>
        )}
      </AnimatePresence>
      <div ref={bottomRef} className="h-1 shrink-0" />
    </div>
  );
}
