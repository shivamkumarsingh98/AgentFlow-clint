"use client";

import { useState, useEffect } from "react";
import { Briefcase, MapPin, Building, Search, ExternalLink, Calendar, DollarSign } from "lucide-react";
import { useAgentStore } from "@/store/useAgentStore";

export function ResultsPanel() {
  const currentTask = useAgentStore((state) => state.currentTask);
  const agentStatus = useAgentStore((state) => state.agentStatus);
  const results = useAgentStore((state) => state.results);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (agentStatus.phase === "extracting") {
      setLoading(true);
    } else if (agentStatus.phase === "analyzing" || agentStatus.phase === "done" || currentTask?.status === "completed") {
      setLoading(false);
    } else if (!currentTask) {
      setLoading(false);
    }
  }, [agentStatus.phase, currentTask]);

  // Filter logic
  const filteredResults = results.filter((row) => {
    const role = row.title || row.role || "";
    const company = row.company || "";
    const location = row.location || row.loc || "";
    return (
      role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      location.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const renderSkeletons = () => (
    <div className="space-y-3">
      <div className="grid grid-cols-4 gap-4 mb-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-20 bg-zinc-900 border border-zinc-800 rounded-xl p-4 animate-pulse flex flex-col justify-between">
            <div className="h-2.5 bg-zinc-800 rounded w-1/2"></div>
            <div className="h-4 bg-zinc-800 rounded w-1/3"></div>
          </div>
        ))}
      </div>
      <div className="border border-zinc-800 rounded-xl bg-zinc-900/40 p-4 space-y-4 animate-pulse">
        <div className="h-6 bg-zinc-900 rounded w-1/4 mb-4"></div>
        {[1, 2, 3].map((row) => (
          <div key={row} className="flex justify-between items-center py-2 border-b border-zinc-800/50">
            <div className="h-3 bg-zinc-800 rounded w-1/6"></div>
            <div className="h-3 bg-zinc-800 rounded w-1/4"></div>
            <div className="h-3 bg-zinc-800 rounded w-1/12"></div>
            <div className="h-4 bg-zinc-800 rounded w-12"></div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderEmptyState = () => (
    <div className="flex-1 flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-zinc-800/80 rounded-xl bg-zinc-900/10 min-h-[300px]">
      <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-4 shadow-xl text-zinc-500">
        <Briefcase className="w-8 h-8" />
      </div>
      <h3 className="text-sm font-semibold text-zinc-300">No Job Results Extracted</h3>
      <p className="text-xs text-zinc-500 mt-1.5 max-w-xs mx-auto">
        Results will populate here dynamically once the browser agent crawls and extracts listing data.
      </p>
    </div>
  );

  if (!currentTask || results.length === 0) {
    return renderEmptyState();
  }

  if (loading) {
    return renderSkeletons();
  }

  const totalJobs = results.length;

  return (
    <div className="flex-1 flex flex-col gap-4 overflow-hidden h-full">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 shrink-0">
        <div className="bg-white border border-zinc-200 rounded-xl p-3.5 flex flex-col justify-between shadow-2xs">
          <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
            <Briefcase className="w-3.5 h-3.5 text-blue-600" /> Jobs Extracted
          </span>
          <span className="text-xl font-bold mt-1 text-zinc-900">{totalJobs}</span>
        </div>

        <div className="bg-white border border-zinc-200 rounded-xl p-3.5 flex flex-col justify-between shadow-2xs">
          <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
            <Building className="w-3.5 h-3.5 text-emerald-600" /> Companies
          </span>
          <span className="text-xl font-bold mt-1 text-zinc-900">
            {new Set(results.map(r => r.company || "N/A")).size}
          </span>
        </div>
      </div>

      {/* Table Section */}
      <div className="flex-1 bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-2xs flex flex-col min-h-0">
        {/* Search Toolbar */}
        <div className="h-11 border-b border-zinc-200 bg-zinc-50/80 flex items-center px-4 justify-between gap-4 shrink-0">
          <h3 className="text-xs font-bold text-zinc-800 flex items-center gap-2">
            <Briefcase className="w-3.5 h-3.5 text-zinc-500" /> Listing Records
          </h3>
          <div className="relative w-64">
            <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search company, role or location..."
              className="w-full h-7 bg-white border border-zinc-200 rounded-md pl-8 pr-3 text-xs text-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
        </div>

        {/* Scrollable Results Table */}
        <div className="flex-1 overflow-auto scrollbar-thin scrollbar-thumb-zinc-300 scrollbar-track-transparent">
          {filteredResults.length > 0 ? (
            <table className="w-full text-left text-xs whitespace-nowrap">
              <thead className="bg-zinc-50 text-zinc-500 text-[10px] font-bold uppercase tracking-wider sticky top-0 z-10 border-b border-zinc-200">
                <tr>
                  <th className="px-4 py-2.5 font-semibold">Company</th>
                  <th className="px-4 py-2.5 font-semibold">Role</th>
                  <th className="px-4 py-2.5 font-semibold">Location</th>
                  <th className="px-4 py-2.5 font-semibold">Salary</th>
                  <th className="px-4 py-2.5 font-semibold">Posted Date</th>
                  <th className="px-4 py-2.5 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 text-zinc-800">
                {filteredResults.map((row, index) => (
                  <tr key={index} className="hover:bg-blue-50/40 transition-colors">
                    <td className="px-4 py-3 font-semibold text-zinc-900">
                      <Building className="w-3.5 h-3.5 text-zinc-400 inline mr-1.5" /> {row.company || "N/A"}
                    </td>
                    <td className="px-4 py-3 text-zinc-900 font-medium">{row.title || row.role || "N/A"}</td>
                    <td className="px-4 py-3 text-zinc-600"><MapPin className="w-3 h-3 inline mr-1 text-zinc-400" /> {row.location || row.loc || "N/A"}</td>
                    <td className="px-4 py-3 text-zinc-600 font-mono text-xs">{row.salary || row.sal || "Not disclosed"}</td>
                    <td className="px-4 py-3 text-zinc-500 text-xs"><Calendar className="w-3 h-3 inline mr-1 text-zinc-400" /> {row.posted_date || row.postedDate || "Recently"}</td>
                    <td className="px-4 py-3">
                      {row.link || row.url ? (
                        <a
                          href={row.link || row.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1 hover:underline font-bold"
                        >
                          Apply Link <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <span className="text-xs text-zinc-400">No Link</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center text-zinc-400 py-10">
              <Search className="w-7 h-7 mx-auto mb-2 text-zinc-300" />
              <p className="text-xs">No matching listings found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}