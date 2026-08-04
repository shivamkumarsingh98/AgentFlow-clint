"use client";

import { Navbar } from "@/components/layout/Navbar";
import { LeftSidebar } from "@/components/layout/LeftSidebar";
import { RightSidebar } from "@/components/layout/RightSidebar";
import { BrowserWorkspace } from "@/components/workspace/BrowserWorkspace";
import { ReportsView } from "@/components/workspace/ReportsView";
import { useAgentStore } from "@/store/useAgentStore";

export default function WorkspacePage() {
  const activeView = useAgentStore((state) => state.activeView);

  return (
    <div className="flex flex-col h-screen w-full overflow-hidden bg-zinc-950">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <LeftSidebar />
        {activeView === "reports" ? (
          <ReportsView />
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
