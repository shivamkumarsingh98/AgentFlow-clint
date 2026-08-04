import { LayoutDashboard, History, Save, Globe, FileBarChart, Settings } from "lucide-react";
import { useAgentStore } from "@/store/useAgentStore";

export function LeftSidebar() {
  const activeView = useAgentStore((state) => state.activeView);
  const setActiveView = useAgentStore((state) => state.setActiveView);

  const navItems = [
    { name: "Dashboard", id: "dashboard", icon: <LayoutDashboard className="w-4 h-4" /> },
    { name: "History", id: "history", icon: <History className="w-4 h-4" /> },
    { name: "Saved Tasks", id: "saved_tasks", icon: <Save className="w-4 h-4" /> },
    { name: "Browser Sessions", id: "browser_sessions", icon: <Globe className="w-4 h-4" /> },
    { name: "Reports", id: "reports", icon: <FileBarChart className="w-4 h-4" /> },
  ];

  return (
    <aside className="w-64 border-r border-zinc-800 bg-zinc-900/30 flex flex-col shrink-0 overflow-y-auto">
      <div className="flex-1 py-4 flex flex-col gap-1 px-3">
        <div className="text-xs font-semibold text-zinc-500 mb-2 px-2 uppercase tracking-wider">Menu</div>
        {navItems.map((item) => (
          <button
            key={item.name}
            onClick={() => setActiveView(item.id)}
            className={`flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors text-left border ${
              activeView === item.id 
                ? "text-blue-400 bg-blue-950/20 border-blue-900/30" 
                : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50 border-transparent"
            }`}
          >
            {item.icon}
            {item.name}
          </button>
        ))}
      </div>

      <div className="p-4 border-t border-zinc-800">
        <button className="flex items-center gap-3 px-3 py-2 w-full text-sm text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50 rounded-md transition-colors text-left">
          <Settings className="w-4 h-4" />
          Settings
        </button>
      </div>
    </aside>
  );
}
