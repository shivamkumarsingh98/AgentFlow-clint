"use client";

import { Activity, Globe, Table, CheckCircle2, AlertTriangle, Terminal, XCircle, Sparkles, ArrowUpRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { BrowserPreview } from "./BrowserPreview";
import { Timeline } from "./Timeline";
import { ResultsPanel } from "./ResultsPanel";
import { useAgentStore } from "@/store/useAgentStore";

export function BrowserWorkspace() {
  const activeTab = useAgentStore((state) => state.activeWorkspaceTab);
  const setActiveTab = useAgentStore((state) => state.setActiveWorkspaceTab);
  const currentTask = useAgentStore((state) => state.currentTask);
  const agentStatus = useAgentStore((state) => state.agentStatus);
  const results = useAgentStore((state) => state.results);
  const approveNextStep = useAgentStore((state) => state.approveNextStep);
  const rejectStep = useAgentStore((state) => state.rejectStep);

  const timeline = useAgentStore((state) => state.timeline);
  const isWaitingApproval = currentTask?.status === "waiting_approval";
  const latestApprovalEvent = timeline.slice().reverse().find((e) => e.badge === "approval_required" || e.status === "warning");
  const approvalMessage = latestApprovalEvent?.text || (results.length > 0 ? `Review ${results.length} extracted listings and approve to finalize.` : "Human Checkpoint: Review action and approve to proceed.");

  return (
    <main className="flex-1 flex flex-col min-w-0 bg-white overflow-hidden relative">
      {/* Workspace Top Header Bar */}
      <div className="h-11 border-b border-zinc-200 bg-white flex items-center justify-between px-5 shrink-0 z-20 shadow-2xs">
        {/* Left Tabs */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveTab("live")}
            className={`flex items-center gap-2 px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              activeTab === "live"
                ? "bg-blue-50 text-blue-700 border border-blue-200 font-semibold shadow-2xs"
                : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100"
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            Live Stream
          </button>

          <button
            onClick={() => setActiveTab("results")}
            className={`flex items-center gap-2 px-3 py-1 rounded-lg text-xs font-medium transition-all relative ${
              activeTab === "results"
                ? "bg-blue-50 text-blue-700 border border-blue-200 font-semibold shadow-2xs"
                : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100"
            }`}
          >
            <Table className="w-3.5 h-3.5" />
            Extracted Listings
            {results.length > 0 && (
              <span className="ml-1 px-1.5 py-0.2 text-[10px] font-bold bg-blue-600 text-white rounded-full">
                {results.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("timeline")}
            className={`flex items-center gap-2 px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              activeTab === "timeline"
                ? "bg-blue-50 text-blue-700 border border-blue-200 font-semibold shadow-2xs"
                : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100"
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            Timeline Log
          </button>
        </div>

        {/* Right Status Badge */}
        <div className="flex items-center gap-3 text-xs">
          {currentTask && (
            <div className="hidden md:flex items-center gap-2 text-zinc-600 font-mono text-[11px] bg-zinc-50 px-2.5 py-0.5 rounded border border-zinc-200">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
              <span className="text-zinc-800 font-sans truncate max-w-[260px]">
                {currentTask.prompt}
              </span>
            </div>
          )}

          <span
            className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
              currentTask?.status === "running"
                ? "bg-blue-50 text-blue-700 border-blue-200"
                : isWaitingApproval
                ? "bg-yellow-50 text-yellow-700 border-yellow-200 animate-pulse"
                : currentTask?.status === "completed"
                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                : "bg-zinc-100 text-zinc-600 border-zinc-200"
            }`}
          >
            {currentTask?.status || "Idle"}
          </span>
        </div>
      </div>

      {/* Human Approval Banner */}
      <AnimatePresence>
        {isWaitingApproval && (
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="bg-yellow-50 border-b border-yellow-200 px-5 py-3 flex items-center justify-between z-30 shrink-0 shadow-xs"
          >
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-yellow-100 border border-yellow-300 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-4 h-4 text-yellow-700 animate-bounce" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-yellow-900">
                  Human Approval Checkpoint Required
                </h4>
                <p className="text-[11px] text-yellow-800 font-medium">
                  {approvalMessage}
                </p>
              </div>
            </div>

            {/* <div className="flex items-center gap-2">
              <button
                onClick={approveNextStep}
                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg shadow-xs transition-all flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5" /> Approve &amp; Deliver
              </button>
              <button
                onClick={rejectStep}
                className="px-3 py-1.5 bg-white hover:bg-zinc-100 border border-zinc-300 text-zinc-700 text-xs font-semibold rounded-lg transition-all"
              >
                Reject
              </button>
            </div> */}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Workspace Body */}
      <div className="flex-1 p-4 overflow-hidden flex flex-col bg-zinc-50/50">
        {activeTab === "live" && (
          <div className="flex-1 flex flex-col md:flex-row gap-4 overflow-hidden">
            {/* Left 60%: Live Browser Preview */}
            <div className="w-full md:w-3/5 h-full flex flex-col overflow-hidden min-h-0">
              <BrowserPreview />
            </div>

            {/* Right 40%: Realtime Agent Execution Console */}
            <div className="w-full md:w-2/5 h-full flex flex-col bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-xs min-h-0">
              <div className="h-10 border-b border-zinc-200 bg-zinc-50/80 flex items-center px-3.5 justify-between shrink-0">
                <div className="flex items-center gap-2 text-xs font-bold text-zinc-800">
                  <Terminal className="w-3.5 h-3.5 text-blue-600" />
                  Execution Stream
                </div>
                <span className="text-[10px] text-zinc-400 font-mono">Live Logs</span>
              </div>
              <div className="flex-1 p-3 overflow-hidden flex flex-col">
                <Timeline />
              </div>
            </div>
          </div>
        )}

        {activeTab === "results" && (
          <div className="flex-1 overflow-hidden flex flex-col min-h-0 bg-white rounded-xl border border-zinc-200 p-4 shadow-xs">
            <ResultsPanel />
          </div>
        )}

        {activeTab === "timeline" && (
          <div className="flex-1 bg-white border border-zinc-200 rounded-xl p-4 overflow-hidden flex flex-col min-h-0 shadow-xs">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-zinc-200 shrink-0">
              <h3 className="text-xs font-bold text-zinc-800 flex items-center gap-2">
                <Activity className="w-3.5 h-3.5 text-blue-600" /> Complete Activity Timeline
              </h3>
            </div>
            <div className="flex-1 overflow-hidden flex flex-col">
              <Timeline />
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
