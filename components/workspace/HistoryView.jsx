"use client";

import { useState, useEffect } from "react";
import {
  History,
  Loader2,
  AlertCircle,
  FileText,
  ChevronRight,
  Download,
} from "lucide-react";

export function HistoryView() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem("token");
        const backendUrl = (process.env.NEXT_PUBLIC_AGENT_API_URL || "http://localhost:8000").replace(/\/$/, "");
        const res = await fetch(`${backendUrl}/api/results/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        let data;
        try {
          data = await res.json();
        } catch (e) {
          data = null; // Backend didn't return JSON
        }

        if (!res.ok) {
          // Gracefully handle missing data or errors without throwing
          if (res.status === 404) {
            setHistory([]);
          } else {
            setError(
              data?.detail || "Could not load your history at this time.",
            );
          }
          return;
        }

        // Successfully got data
        setHistory(data?.history || (Array.isArray(data) ? data : []));
      } catch (err) {
        // Network error (server might be down)
        setError("Network error connecting to the server.");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  return (
    <div className="flex-1 flex flex-col h-full bg-zinc-50 overflow-hidden">
      {/* Header */}
      <div className="px-8 py-6 border-b border-zinc-200 bg-white">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
            <History className="w-4 h-4" />
          </div>
          <h1 className="text-xl font-bold text-zinc-900">
            Your Search History
          </h1>
        </div>
        <p className="text-sm text-zinc-500 pl-11">
          Review your past browser automation runs and extracted data reports.
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 text-zinc-400">
            <Loader2 className="w-8 h-8 animate-spin mb-4 text-blue-500" />
            <p className="text-sm font-medium">
              Loading your secure history...
            </p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-64 text-zinc-500">
            <AlertCircle className="w-12 h-12 text-zinc-300 mb-4" />
            <p className="text-sm font-medium text-zinc-600 mb-2">Oops!</p>
            <p className="text-xs text-zinc-400 max-w-sm text-center">
              {error}
            </p>
          </div>
        ) : history.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-zinc-500">
            <FileText className="w-12 h-12 text-zinc-200 mb-4" />
            <p className="text-sm font-medium text-zinc-600">
              No history found
            </p>
            <p className="text-xs text-zinc-400 mt-1">
              Your automated search reports will appear here securely.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {history.map((item, index) => (
              <div
                key={item.id || index}
                className="bg-white border border-zinc-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">
                      Completed
                    </span>
                  </div>
                  <span className="text-[10px] text-zinc-400 font-mono">
                    {item.date || new Date().toLocaleDateString()}
                  </span>
                </div>

                <h3 className="font-semibold text-zinc-900 text-sm mb-2 line-clamp-2">
                  {item.prompt || "Search Task"}
                </h3>

                <p className="text-xs text-zinc-500 mb-4">
                  {item.itemsCount || 0} items extracted securely.
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-zinc-100">
                  <button className="text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1">
                    <Download className="w-3.5 h-3.5" />
                    Export CSV
                  </button>
                  <button className="text-xs font-medium text-zinc-600 hover:text-zinc-900 flex items-center gap-1">
                    View Data
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
