import { LayoutDashboard, History, Save, Globe, FileBarChart, Settings } from "lucide-react";
import { useAgentStore } from "@/store/useAgentStore";

export function LeftSidebar() {
  const activeView = useAgentStore((state) => state.activeView);
  const setActiveView = useAgentStore((state) => state.setActiveView);
  const setProfileModalOpen = useAgentStore((state) => state.setProfileModalOpen);

  const navItems = [
    { name: "Dashboard", id: "dashboard", icon: <LayoutDashboard className="w-4 h-4" /> },
    { name: "History", id: "history", icon: <History className="w-4 h-4" /> },
    // { name: "Saved Tasks", id: "saved_tasks", icon: <Save className="w-4 h-4" /> },
    // { name: "Browser Sessions", id: "browser_sessions", icon: <Globe className="w-4 h-4" /> },
    { name: "Reports", id: "reports", icon: <FileBarChart className="w-4 h-4" /> },
  ];

  return (
    <aside className="w-60 border-r border-zinc-200 bg-zinc-100/90 flex flex-col shrink-0 overflow-y-auto">
      <div className="flex-1 py-3 flex flex-col gap-1 px-3">
        <div className="text-[10px] font-bold text-zinc-400 mb-2 px-2 uppercase tracking-wider">Workspace</div>
        {navItems.map((item) => (
          <button
            key={item.name}
            onClick={() => setActiveView(item.id)}
            className={`flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-lg transition-all text-left ${activeView === item.id
                ? "text-blue-700 bg-blue-50 border border-blue-200 font-semibold shadow-xs"
                : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/60 border-transparent"
              }`}
          >
            {item.icon}
            {item.name}
          </button>
        ))}
      </div>

      <div className="p-3 border-t border-zinc-200">
        <button
          onClick={() => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
          }}
          className="flex items-center gap-2.5 px-3 py-2 w-full text-xs font-semibold text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all text-left"
        >
          <div className="w-5 h-5 rounded-full bg-red-100 text-red-500 text-[10px] font-bold flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
          </div>
          Logout
        </button>
      </div>
    </aside>
  );
}
