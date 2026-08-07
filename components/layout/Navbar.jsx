"use client";

import { Bell, Settings, User } from "lucide-react";
import { motion } from "framer-motion";
import { useAgentStore } from "@/store/useAgentStore";
import Link from "next/link";

export function Navbar() {
  const agentStatus = useAgentStore((state) => state.agentStatus);
  const currentTask = useAgentStore((state) => state.currentTask);
  const setProfileModalOpen = useAgentStore((state) => state.setProfileModalOpen);

  const totalSteps = agentStatus.totalSteps || 4;
  const currentStep = agentStatus.currentStepIndex || 0;
  const progressPercent = totalSteps > 0 ? (currentStep / totalSteps) * 100 : 0;

  return (
    <nav className="h-11 border-b border-zinc-200 bg-white flex items-center justify-between px-4 shrink-0 z-50 shadow-sm">
      <div className="flex items-center gap-4">
        <Link href="/" className="flex items-center gap-2.5 hover:opacity-90 transition-opacity select-none group">
          <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white text-xs shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
            A
          </div>
          <h1 className="text-xs font-bold tracking-tight text-zinc-900">AgentFlow</h1>
        </Link>
        
        {/* Agent Status */}
        <div className="flex items-center gap-3 ml-4">
          <div className="flex items-center gap-2 px-2.5 py-0.5 rounded-md bg-zinc-100 text-xs text-zinc-700 border border-zinc-200 font-medium">
            <motion.div 
              animate={agentStatus.phase !== "idle" ? { opacity: [1, 0.5, 1] } : {}}
              transition={{ duration: 2, repeat: Infinity }}
              className={`w-2 h-2 rounded-full ${
                agentStatus.phase === "idle" ? "bg-zinc-400" :
                agentStatus.phase === "waiting_approval" ? "bg-yellow-500" :
                agentStatus.phase === "done" ? "bg-blue-600" : "bg-emerald-500"
              }`}
            />
            {agentStatus.phase === "idle" ? "Agent Idle" : `Phase: ${agentStatus.phase}`}
          </div>

          {currentTask && (
            <div className="hidden sm:flex items-center gap-2 px-2.5 py-0.5 rounded-md bg-blue-50 text-xs text-blue-700 border border-blue-200 font-medium">
              Step {currentStep} of {totalSteps}
              <div className="w-14 h-1 bg-blue-200 rounded-full ml-1 overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  className="h-full bg-blue-600 rounded-full"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 text-zinc-600">
        {/* User Profile / Settings Avatar Button */}
        <button 
          onClick={() => setProfileModalOpen(true)}
          className="flex items-center gap-2 px-2.5 py-1 rounded-lg hover:bg-zinc-100 border border-transparent hover:border-zinc-200 transition-all cursor-pointer group"
          title="User Profile & Settings"
        >
          <div className="w-6 h-6 rounded-full bg-zinc-900 text-white font-bold text-xs flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
            N
          </div>
          <span className="text-xs font-semibold text-zinc-700 group-hover:text-zinc-900">Settings</span>
        </button>
      </div>
    </nav>
  );
}
