"use client";

import { Navbar } from "@/components/layout/Navbar";
import { LeftSidebar } from "@/components/layout/LeftSidebar";
import { RightSidebar } from "@/components/layout/RightSidebar";
import { ProfileModal } from "@/components/layout/ProfileModal";
import { BrowserWorkspace } from "@/components/workspace/BrowserWorkspace";
import { ReportsView } from "@/components/workspace/ReportsView";
import { HistoryView } from "@/components/workspace/HistoryView";
import { useAgentStore } from "@/store/useAgentStore";

export default function WorkspacePage() {
  const activeView = useAgentStore((state) => state.activeView);

  return (
    <div className="flex flex-col h-screen w-full overflow-hidden bg-white text-zinc-900">
      <ProfileModal />
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <LeftSidebar />
        {activeView === "reports" ? (
          <ReportsView />
        ) : activeView === "history" ? (
          <HistoryView />
        ) : (
          <>
            <BrowserWorkspace />
            <RightSidebar />
          </>
        )}
      </div>
    </div>
  );
}
