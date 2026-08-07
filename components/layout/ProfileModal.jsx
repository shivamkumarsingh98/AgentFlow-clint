"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, User, ShieldCheck, Database, Key, Server, Cpu, LogOut, CheckCircle2 } from "lucide-react";
import { useAgentStore } from "@/store/useAgentStore";

export function ProfileModal() {
  const isOpen = useAgentStore((state) => state.isProfileModalOpen);
  const setOpen = useAgentStore((state) => state.setProfileModalOpen);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.15 }}
          className="w-full max-w-md bg-white border border-zinc-200 rounded-2xl shadow-2xl overflow-hidden text-zinc-900"
        >
          {/* Modal Header */}
          <div className="px-6 py-4 bg-zinc-50 border-b border-zinc-200 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                N
              </div>
              <div>
                <h3 className="text-sm font-bold text-zinc-900">User Profile &amp; Settings</h3>
                <p className="text-[11px] text-zinc-500">AgentFlow Workspace Profile</p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-200/60 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Modal Content */}
          <div className="p-6 space-y-5">
            {/* User Info Card */}
            <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-full bg-zinc-900 text-white flex items-center justify-center text-lg font-bold shadow-md">
                N
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-zinc-900">Guest Developer</span>
                  <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-700 rounded-md border border-emerald-200">
                    Active
                  </span>
                </div>
                <p className="text-xs text-zinc-500 font-mono mt-0.5 truncate">guest@agentflow.ai</p>
              </div>
            </div>

            {/* Infrastructure & Services Status */}
            <div>
              <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2.5">
                Connected Infrastructure
              </h4>
              <div className="space-y-2">
                <div className="p-3 rounded-lg border border-zinc-200 bg-white flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <Key className="w-4 h-4 text-purple-600" />
                    <div>
                      <span className="font-semibold text-zinc-800">Groq LLM Engine</span>
                      <p className="text-[10px] text-zinc-500">llama-3.3-70b-versatile</p>
                    </div>
                  </div>
                  <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-600">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Ready
                  </span>
                </div>

                <div className="p-3 rounded-lg border border-zinc-200 bg-white flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <Server className="w-4 h-4 text-blue-600" />
                    <div>
                      <span className="font-semibold text-zinc-800">Upstash Redis Queue</span>
                      <p className="text-[10px] text-zinc-500">TLS Encryption (SSL)</p>
                    </div>
                  </div>
                  <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-600">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Connected
                  </span>
                </div>

                <div className="p-3 rounded-lg border border-zinc-200 bg-white flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <Database className="w-4 h-4 text-emerald-600" />
                    <div>
                      <span className="font-semibold text-zinc-800">Neon Postgres DB</span>
                      <p className="text-[10px] text-zinc-500">User Isolation Enabled</p>
                    </div>
                  </div>
                  <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-600">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Synced
                  </span>
                </div>
              </div>
            </div>

            {/* Mode Indicator */}
            <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-blue-600" />
                <span className="font-medium text-blue-900">Playwright Execution Mode</span>
              </div>
              <span className="font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded text-[11px]">
                Headless
              </span>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="px-6 py-3.5 bg-zinc-50 border-t border-zinc-200 flex items-center justify-between">
            <span className="text-[11px] text-zinc-400">AgentFlow v2.0</span>
            <button
              onClick={() => setOpen(false)}
              className="px-4 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold rounded-lg transition-all"
            >
              Done
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
