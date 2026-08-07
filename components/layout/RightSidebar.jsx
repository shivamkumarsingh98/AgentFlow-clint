"use client";

import { useEffect, useState } from "react";
import { Play, Pause, Square, Terminal, ListChecks, CheckCircle2, Loader2, PlayCircle, Info, Clock, Activity, AlertTriangle, XCircle, RefreshCw, Globe } from "lucide-react";
import { motion } from "framer-motion";
import { useAgentStore } from "@/store/useAgentStore";

export function RightSidebar() {
  const [taskInput, setTaskInput] = useState("");
  
  const currentTask = useAgentStore((state) => state.currentTask);
  const agentStatus = useAgentStore((state) => state.agentStatus);
  const stepsPlan = useAgentStore((state) => state.stepsPlan);
  const browser = useAgentStore((state) => state.browser);
  
  const setTask = useAgentStore((state) => state.setTask);
  const startAgent = useAgentStore((state) => state.startAgent);
  const pauseAgent = useAgentStore((state) => state.pauseAgent);
  const resumeAgent = useAgentStore((state) => state.resumeAgent);
  const stopAgent = useAgentStore((state) => state.stopAgent);
  const approveNextStep = useAgentStore((state) => state.approveNextStep);
  const rejectStep = useAgentStore((state) => state.rejectStep);
  const resetTask = useAgentStore((state) => state.resetTask);

  useEffect(() => {
    if (currentTask && !taskInput) {
      setTaskInput(currentTask.prompt);
    }
  }, [currentTask]);

  const handleStart = () => {
    if (!taskInput.trim()) return;
    setTask(taskInput);
    setTimeout(() => {
      startAgent();
    }, 200);
  };

  const handleClear = () => {
    resetTask();
    setTaskInput("");
  };

  const getActiveStepText = () => {
    if (currentTask?.status === "waiting_approval") {
      return "Waiting for human verification...";
    }
    const activeStep = stepsPlan.find(s => s.status === "active");
    return activeStep ? `${activeStep.description}...` : "Ready for next prompt";
  };

  const isIdle = !currentTask || currentTask.status === "idle";
  const isRunning = currentTask?.status === "running";
  const isPaused = currentTask?.status === "paused";
  const isWaitingApproval = currentTask?.status === "waiting_approval";
  const isFinished = currentTask?.status === "completed" || currentTask?.status === "failed";

  return (
    <aside className="w-80 border-l border-zinc-200 bg-zinc-100/90 flex flex-col shrink-0 overflow-hidden shadow-xs z-30 relative">
      {/* Task Input Section */}
      <div className="p-4 border-b border-zinc-200 bg-white">
        <h3 className="text-xs font-bold text-zinc-800 mb-2.5 flex items-center gap-2">
          <Terminal className="w-3.5 h-3.5 text-blue-600" /> Goal Prompt
        </h3>
        <textarea 
          value={taskInput}
          onChange={(e) => setTaskInput(e.target.value)}
          disabled={isRunning || isPaused || isWaitingApproval}
          placeholder="e.g. Find Python Developer jobs in San Francisco..."
          className="w-full h-20 bg-zinc-50 border border-zinc-200 rounded-xl p-3 text-xs text-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:border-blue-500 focus:bg-white transition-all resize-none shadow-xs disabled:opacity-60"
        />
        <button 
          onClick={handleStart}
          disabled={!taskInput.trim() || isRunning || isPaused || isWaitingApproval}
          className="w-full mt-2.5 bg-blue-600 hover:bg-blue-500 disabled:bg-zinc-200 disabled:text-zinc-400 text-white text-xs font-semibold py-2.5 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 transform active:scale-[0.98]"
        >
          <PlayCircle className="w-4 h-4" /> Start Agent Session
        </button>
        {isFinished && (
          <button 
            onClick={handleClear}
            className="w-full mt-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-medium py-2 rounded-lg transition-all border border-zinc-200 flex items-center justify-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5 text-zinc-500" /> New Task
          </button>
        )}
      </div>

      {/* Scrollable Middle Details */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-zinc-300 scrollbar-track-transparent">
        {/* Active Action Banner */}
        <div className="p-3.5 rounded-xl border border-zinc-200 bg-white shadow-xs">
          <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1 flex items-center gap-1.5">
            {isRunning ? (
              <Loader2 className="w-3 h-3 text-blue-600 animate-spin" />
            ) : isWaitingApproval ? (
              <AlertTriangle className="w-3 h-3 text-yellow-600 animate-bounce" />
            ) : (
              <span className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
            )}
            Current Action
          </div>
          <p className="text-xs font-medium text-zinc-800 leading-relaxed font-mono">
            {getActiveStepText()}
          </p>
        </div>

        {/* Simplified Stats Cards */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-white rounded-xl p-3 border border-zinc-200 shadow-xs">
            <span className="text-[10px] text-zinc-400 font-semibold uppercase tracking-wider block mb-1">Tokens</span>
            <span className="text-sm font-bold text-zinc-800 font-mono">{agentStatus.tokensUsed}</span>
          </div>
          <div className="bg-white rounded-xl p-3 border border-zinc-200 shadow-xs">
            <span className="text-[10px] text-zinc-400 font-semibold uppercase tracking-wider block mb-1">Time</span>
            <span className="text-sm font-bold text-zinc-800 font-mono">{agentStatus.executionTime}s</span>
          </div>
        </div>

        {/* Current Plan Checklist */}
        <div className="p-3.5 rounded-xl border border-zinc-200 bg-white shadow-xs space-y-3">
          <h4 className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
            <ListChecks className="w-3.5 h-3.5 text-blue-600" /> Execution Plan
          </h4>
          {stepsPlan.length > 0 ? (
            <div className="space-y-2.5">
              {stepsPlan.map((step) => (
                <div key={step.index} className="flex items-start gap-2.5 text-xs">
                  <div className="mt-0.5 shrink-0">
                    {step.status === "done" && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                    {step.status === "active" && (
                      <div className="w-3.5 h-3.5 rounded-full bg-blue-100 flex items-center justify-center border border-blue-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-ping" />
                      </div>
                    )}
                    {step.status === "pending" && <div className="w-3.5 h-3.5 rounded-full border border-zinc-300 bg-zinc-50" />}
                  </div>
                  <span className={`leading-snug ${
                    step.status === 'done' ? 'text-zinc-400 line-through' : 
                    step.status === 'active' ? 'text-zinc-900 font-semibold' : 'text-zinc-500'
                  }`}>
                    {step.description}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-zinc-400 italic">No task plan generated yet.</p>
          )}
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="p-4 border-t border-zinc-200 bg-white flex flex-col gap-2 shrink-0">
        {isWaitingApproval && (
          <div className="flex gap-2 w-full mb-1">
            <button 
              onClick={approveNextStep}
              className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg shadow-xs transition-all flex items-center justify-center gap-1 active:scale-95"
            >
              <CheckCircle2 className="w-3.5 h-3.5" /> Approve
            </button>
            <button 
              onClick={rejectStep}
              className="flex-1 py-2.5 bg-white hover:bg-zinc-100 border border-zinc-300 text-zinc-700 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1 active:scale-95"
            >
              <XCircle className="w-3.5 h-3.5 text-red-500" /> Reject
            </button>
          </div>
        )}
        
        <div className="flex gap-2 w-full">
          {isPaused ? (
            <button 
              onClick={resumeAgent}
              className="flex-1 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 shadow-xs"
            >
              <Play className="w-3.5 h-3.5" /> Resume
            </button>
          ) : (
            <button 
              onClick={pauseAgent}
              disabled={!isRunning}
              className="flex-1 py-2 bg-zinc-100 hover:bg-zinc-200 disabled:opacity-40 text-zinc-700 border border-zinc-200 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5"
            >
              <Pause className="w-3.5 h-3.5" /> Pause
            </button>
          )}
          
          <button 
            onClick={stopAgent}
            disabled={isIdle || isFinished}
            className="flex-1 py-2 bg-red-50 hover:bg-red-100 disabled:opacity-40 text-red-600 border border-red-200 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5"
          >
            <Square className="w-3.5 h-3.5" /> Stop
          </button>
        </div>
      </div>
    </aside>
  );
}
