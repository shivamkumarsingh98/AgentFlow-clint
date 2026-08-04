"use client";

import { Bell, Settings, User } from "lucide-react";
import { motion } from "framer-motion";
import { useAgentStore } from "@/store/useAgentStore";
import Link from "next/link";

export function Navbar() {
  const agentStatus = useAgentStore((state) => state.agentStatus);
  const currentTask = useAgentStore((state) => state.currentTask);

  const totalSteps = agentStatus.totalSteps || 4;
  const currentStep = agentStatus.currentStepIndex || 0;
  const progressPercent = totalSteps > 0 ? (currentStep / totalSteps) * 100 : 0;

  return (
    <nav className="h-14 border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-md flex items-center justify-between px-4 shrink-0 z-50">
      <div className="flex items-center gap-4">
        <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity select-none group">
          {/* Logo Placeholder */}
          <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center font-bold text-white shadow-lg shadow-blue-900/20 group-hover:scale-105 transition-transform duration-200">
            A
          </div>
          <h1 className="text-sm font-semibold tracking-wide text-zinc-100">Browser Agent</h1>
        </Link>
        
        {/* Agent Status Placeholder */}
        <div className="flex items-center gap-3 ml-6">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-800/80 text-xs text-zinc-300 border border-zinc-700/50 shadow-sm">
            <motion.div 
              animate={agentStatus.phase !== "idle" ? { opacity: [1, 0.5, 1] } : {}}
              transition={{ duration: 2, repeat: Infinity }}
              className={`w-2 h-2 rounded-full ${
                agentStatus.phase === "idle" ? "bg-zinc-500" :
                agentStatus.phase === "waiting_approval" ? "bg-yellow-500" :
                agentStatus.phase === "done" ? "bg-blue-500" : "bg-emerald-500"
              }`}
            />
            {agentStatus.phase === "idle" ? "Agent Idle" : `Phase: ${agentStatus.phase}`}
          </div>

          {currentTask && (
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-900/20 text-xs text-blue-400 border border-blue-900/50 font-medium">
              Step {currentStep} of {totalSteps}
              <div className="w-16 h-1 bg-zinc-800 rounded-full ml-1 overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  className="h-full bg-blue-500 rounded-full"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3 text-zinc-400">
        <button className="p-2 hover:bg-zinc-800 hover:text-zinc-200 rounded-md transition-all duration-200" title="Notifications">
          <Bell className="w-4 h-4" />
        </button>
        <button className="p-2 hover:bg-zinc-800 hover:text-zinc-200 rounded-md transition-all duration-200" title="Settings">
          <Settings className="w-4 h-4" />
        </button>
        <div className="w-8 h-8 ml-2 rounded-full bg-zinc-700 flex items-center justify-center overflow-hidden border border-zinc-600 shadow-sm hover:border-zinc-500 transition-colors cursor-pointer">
          <User className="w-5 h-5 text-zinc-400" />
        </div>
      </div>
    </nav>
  );
}
