"use client";

import { useEffect, useState } from "react";
import { Play, Pause, Square, Terminal, ListChecks, CheckCircle2, Loader2, PlayCircle, Info, Clock, Activity, AlertTriangle, XCircle, RefreshCw } from "lucide-react";
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

  // Sync initial input state if store has a task already
  useEffect(() => {
    if (currentTask && !taskInput) {
      setTaskInput(currentTask.prompt);
    }
  }, [currentTask]);

  const handleStart = () => {
    if (!taskInput.trim()) return;
    setTask(taskInput);
    // Timeout to simulate starting
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
      return "> Waiting for human operator approval...";
    }
    const activeStep = stepsPlan.find(s => s.status === "active");
    return activeStep ? `> ${activeStep.description}...` : "> Ready to initialize...";
  };

  // State checks for disabling controls
  const isIdle = !currentTask || currentTask.status === "idle";
  const isRunning = currentTask?.status === "running";
  const isPaused = currentTask?.status === "paused";
  const isWaitingApproval = currentTask?.status === "waiting_approval";
  const isFinished = currentTask?.status === "completed" || currentTask?.status === "failed";

  return (
    <aside className="w-[340px] border-l border-zinc-800 bg-zinc-900/30 flex flex-col shrink-0 overflow-hidden shadow-2xl z-40 relative">
      {/* Task Input */}
      <div className="p-4 border-b border-zinc-800 bg-zinc-900/50">
        <h3 className="text-sm font-semibold text-zinc-300 mb-3 flex items-center gap-2">
          <Terminal className="w-4 h-4 text-blue-400" /> New Task
        </h3>
        <textarea 
          value={taskInput}
          onChange={(e) => setTaskInput(e.target.value)}
          disabled={isRunning || isPaused || isWaitingApproval}
          placeholder="What do you want the agent to do?"
          className="w-full h-24 bg-zinc-950/80 border border-zinc-800/80 rounded-lg p-3 text-sm text-zinc-300 placeholder:text-zinc-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all resize-none shadow-inner disabled:opacity-50"
        />
        <button 
          onClick={handleStart}
          disabled={!taskInput.trim() || isRunning || isPaused || isWaitingApproval}
          className="w-full mt-3 bg-blue-600 hover:bg-blue-500 disabled:bg-zinc-850 disabled:text-zinc-600 text-white text-sm font-medium py-2.5 rounded-lg transition-all shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2 hover:shadow-blue-900/40 transform active:scale-[0.98] disabled:scale-100 disabled:shadow-none"
        >
          <PlayCircle className="w-4 h-4" /> Start Agent
        </button>
        {isFinished && (
          <button 
            onClick={handleClear}
            className="w-full mt-2 bg-zinc-800 hover:bg-zinc-750 text-zinc-300 text-xs font-semibold py-2 rounded-lg transition-all border border-zinc-700/50 flex items-center justify-center gap-2 hover:text-zinc-200 active:scale-[0.97]"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Clear &amp; New Prompt
          </button>
        )}
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {/* Current Step */}
        <div className="p-4 border-b border-zinc-800/60 bg-zinc-800/10 backdrop-blur-sm">
          <h3 className="text-[11px] font-bold text-emerald-400 mb-2.5 uppercase tracking-widest flex items-center gap-2">
            {isRunning ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : isWaitingApproval ? (
              <AlertTriangle className="w-3 h-3 text-yellow-500 animate-pulse" />
            ) : (
              <div className="w-1.5 h-1.5 rounded-full bg-zinc-500" />
            )}
            Current Action
          </h3>
          <motion.div 
            key={getActiveStepText()}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className={`text-sm p-3.5 rounded-lg border font-mono shadow-inner leading-relaxed ${
              isWaitingApproval 
                ? "bg-yellow-950/20 border-yellow-800/40 text-yellow-200" 
                : "bg-zinc-950/80 border-zinc-700/50 text-zinc-200"
            }`}
          >
            {getActiveStepText()}
          </motion.div>
        </div>

        {/* Execution Details */}
        <div className="p-4 border-b border-zinc-800/60">
          <h3 className="text-[11px] font-bold text-zinc-500 mb-3 uppercase tracking-widest flex items-center gap-2">
            <Info className="w-3 h-3" /> Execution Details
          </h3>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-zinc-900/60 rounded-lg p-3 border border-zinc-800/80 hover:border-zinc-700/80 transition-colors">
              <div className="text-[10px] text-zinc-500 mb-1 flex items-center gap-1.5"><GlobeIcon className="w-3 h-3" /> URL</div>
              <div className="text-xs text-zinc-300 font-mono truncate" title={browser.url}>{browser.url === "about:blank" ? "none" : browser.url.replace("https://", "")}</div>
            </div>
            <div className="bg-zinc-900/60 rounded-lg p-3 border border-zinc-800/80 hover:border-zinc-700/80 transition-colors">
              <div className="text-[10px] text-zinc-500 mb-1 flex items-center gap-1.5"><Activity className="w-3 h-3" /> Tokens</div>
              <div className="text-xs text-zinc-300 font-mono">{agentStatus.tokensUsed}</div>
            </div>
            <div className="bg-zinc-900/60 rounded-lg p-3 border border-zinc-800/80 hover:border-zinc-700/80 transition-colors">
              <div className="text-[10px] text-zinc-500 mb-1 flex items-center gap-1.5"><Clock className="w-3 h-3" /> Time</div>
              <div className="text-xs text-zinc-300 font-mono">{agentStatus.executionTime}s</div>
            </div>
            <div className="bg-zinc-900/60 rounded-lg p-3 border border-zinc-800/80 hover:border-zinc-700/80 transition-colors">
              <div className="text-[10px] text-zinc-500 mb-1 flex items-center gap-1.5"><AlertTriangle className="w-3 h-3" /> Retries</div>
              <div className="text-xs text-zinc-300 font-mono">{agentStatus.retries}</div>
            </div>
          </div>
        </div>

        {/* Current Plan */}
        <div className="p-4">
          <h3 className="text-[11px] font-bold text-purple-400 mb-4 uppercase tracking-widest flex items-center gap-2">
            <ListChecks className="w-3.5 h-3.5" /> Current Plan
          </h3>
          {stepsPlan.length > 0 ? (
            <ul className="space-y-4 relative before:content-[''] before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-[1px] before:bg-zinc-800">
              {stepsPlan.map((step) => (
                <li key={step.index} className="flex gap-4 text-sm relative z-10 group">
                  <div className="mt-0.5 shrink-0 bg-zinc-900 p-0.5 rounded-full">
                    {step.status === "done" && <CheckCircle2 className="w-4 h-4 text-blue-500 bg-zinc-950 rounded-full" />}
                    {step.status === "active" && (
                      <div className="w-4 h-4 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/40 relative">
                        <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1.5, repeat: Infinity }} className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        <div className="absolute inset-0 rounded-full border border-emerald-500/30 animate-ping" />
                      </div>
                    )}
                    {step.status === "pending" && <div className="w-4 h-4 rounded-full border-2 border-zinc-700/50 bg-zinc-900/50" />}
                    {step.status === "failed" && <AlertTriangle className="w-4 h-4 text-red-500 bg-zinc-950 rounded-full" />}
                    {step.status === "rejected" && <XCircle className="w-4 h-4 text-red-500 bg-zinc-950 rounded-full" />}
                  </div>
                  <span className={`transition-colors ${
                    step.status === 'done' ? 'text-zinc-500 line-through' : 
                    step.status === 'active' ? 'text-zinc-100 font-medium' : 
                    step.status === 'rejected' ? 'text-red-500 font-medium' : 'text-zinc-600'
                  }`}>
                    {step.description}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-xs text-zinc-600 italic">No plan formulated yet. Enter a task to generate a plan.</div>
          )}
        </div>
      </div>

      {/* Agent Controls */}
      <div className="p-4 border-t border-zinc-800 bg-zinc-900/80 backdrop-blur-md flex flex-col gap-2 shrink-0">
        {/* Human in the loop controls */}
        <div className="flex gap-2 mb-1">
          <button 
            onClick={approveNextStep}
            disabled={!isWaitingApproval}
            className="flex-1 flex items-center justify-center gap-2 bg-emerald-600/90 hover:bg-emerald-500 disabled:bg-zinc-850/40 disabled:text-zinc-600 text-white text-sm font-medium py-2.5 rounded-lg transition-all shadow-lg shadow-emerald-900/20 hover:shadow-emerald-900/40 transform active:scale-[0.98] disabled:scale-100 disabled:shadow-none"
          >
            <CheckCircle2 className="w-4 h-4" /> Approve
          </button>
          <button 
            onClick={rejectStep}
            disabled={!isWaitingApproval}
            className="flex-1 flex items-center justify-center gap-2 bg-red-950/60 hover:bg-red-900/60 disabled:bg-zinc-850/40 disabled:text-zinc-600 text-red-400 border border-red-900/30 text-sm font-medium py-2.5 rounded-lg transition-all transform active:scale-[0.98] disabled:scale-100"
          >
            <XCircle className="w-4 h-4" /> Reject
          </button>
        </div>
        
        <div className="flex gap-2">
          {isPaused ? (
            <button 
              onClick={resumeAgent}
              className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium py-2 rounded-lg transition-colors shadow-md"
            >
              <Play className="w-4 h-4" /> Resume
            </button>
          ) : (
            <button 
              onClick={pauseAgent}
              disabled={!isRunning}
              className="flex-1 flex items-center justify-center gap-2 bg-zinc-800/80 hover:bg-zinc-700 disabled:bg-zinc-850/20 disabled:text-zinc-600 text-zinc-300 text-sm font-medium py-2 rounded-lg transition-colors border border-zinc-700/50"
            >
              <Pause className="w-4 h-4" /> Pause
            </button>
          )}
          
          <button 
            onClick={stopAgent}
            disabled={isIdle || isFinished}
            className="flex-1 flex items-center justify-center gap-2 bg-red-950/40 hover:bg-red-900/60 disabled:bg-zinc-850/20 disabled:text-zinc-600 text-red-400 border border-red-900/50 text-sm font-medium py-2 rounded-lg transition-colors"
          >
            <Square className="w-4 h-4" /> Stop
          </button>
        </div>
      </div>
    </aside>
  );
}

function GlobeIcon(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
  );
}
