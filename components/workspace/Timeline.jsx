"use client";

import { useEffect, useRef } from "react";
import { CheckCircle2, Clock, AlertTriangle, Info, Building, MapPin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAgentStore } from "@/store/useAgentStore";

// Sub-component to render job cards when text has a JSON jobs array
function PrettyJobsList({ jobs }) {
  return (
    <div className="mt-2.5 space-y-2 max-h-60 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-zinc-200 scrollbar-track-transparent">
      {jobs.map((job, idx) => (
        <div key={idx} className="p-2.5 bg-zinc-50 border border-zinc-150 rounded-lg space-y-1 text-[11px] shadow-3xs hover:border-zinc-200 transition-colors">
          <div className="flex justify-between items-start gap-2">
            <span className="font-semibold text-zinc-900 leading-tight">
              {job.title || job.role || "Job Listing"}
            </span>
            {job.salary && job.salary !== "Not specified" && job.salary !== "Not disclosed" && (
              <span className="text-[9px] bg-blue-50 text-blue-700 px-1.5 py-0.2 rounded font-mono font-bold shrink-0">
                {job.salary || job.sal}
              </span>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-zinc-500 font-medium">
            {job.company && (
              <span className="text-zinc-700 font-semibold flex items-center gap-1">
                <Building className="w-3 h-3 text-zinc-400" />
                {job.company}
              </span>
            )}
            {(job.location || job.loc) && (
              <span className="flex items-center gap-1 text-[10px]">
                <MapPin className="w-3 h-3 text-zinc-400" />
                {job.location || job.loc}
              </span>
            )}
            {job.posted_date && (
              <span className="text-zinc-400 text-[10px]">({job.posted_date || job.postedDate})</span>
            )}
          </div>
          {job.link && (
            <a
              href={job.link}
              target="_blank"
              rel="noreferrer"
              className="text-[10px] text-blue-600 hover:text-blue-800 font-bold inline-block hover:underline"
            >
              Apply Link →
            </a>
          )}
        </div>
      ))}
    </div>
  );
}

// Sub-component to render general JSON objects beautifully
function PrettyJSONViewer({ data }) {
  return (
    <div className="mt-2 bg-zinc-950 border border-zinc-900 rounded-lg p-3 font-mono text-[10px] overflow-x-auto text-emerald-400 max-h-60 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
      <pre className="whitespace-pre-wrap break-all leading-relaxed">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}

export function Timeline() {
  const timeline = useAgentStore((state) => state.timeline);
  const bottomRef = useRef(null);

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

  // Helper to extract and parse potential JSON content inside message text
  const parseEmbeddedJson = (text) => {
    if (typeof text !== "string") return null;

    const startArray = text.indexOf("[");
    const startObject = text.indexOf("{");
    
    let startIdx = -1;
    let endIdx = -1;
    let type = null;

    if (startArray !== -1 && (startObject === -1 || startArray < startObject)) {
      startIdx = startArray;
      endIdx = text.lastIndexOf("]");
      type = "array";
    } else if (startObject !== -1) {
      startIdx = startObject;
      endIdx = text.lastIndexOf("}");
      type = "object";
    }

    if (startIdx !== -1 && endIdx > startIdx) {
      const jsonCandidate = text.substring(startIdx, endIdx + 1);
      try {
        const parsed = JSON.parse(jsonCandidate);
        const prefix = text.substring(0, startIdx).trim();
        return { prefix, data: parsed, type };
      } catch (e) {
        return null;
      }
    }

    return null;
  };

  const renderTimelineText = (text) => {
    const parsedJson = parseEmbeddedJson(text);
    
    if (parsedJson) {
      const { prefix, data, type } = parsedJson;
      const isJobs = type === "array" && Array.isArray(data) && data.length > 0 && (data[0].title || data[0].role || data[0].company);

      return (
        <div className="space-y-1">
          {prefix && <div className="text-xs text-zinc-800 leading-relaxed font-sans">{prefix}</div>}
          {isJobs ? (
            <PrettyJobsList jobs={data} />
          ) : (
            <PrettyJSONViewer data={data} />
          )}
        </div>
      );
    }

    return (
      <div className="text-xs text-zinc-800 leading-relaxed font-sans break-words whitespace-pre-wrap">
        {text}
      </div>
    );
  };

  return (
    <div className="flex-1 overflow-y-auto pr-2 space-y-2.5 scrollbar-thin scrollbar-thumb-zinc-300 scrollbar-track-transparent">
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
                {renderTimelineText(event.text)}
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
