"use client";

import { useState, useEffect } from "react";
import { Briefcase, MapPin, DollarSign, Building, Search, Star, ExternalLink, GraduationCap, Award, Cpu, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { useAgentStore } from "@/store/useAgentStore";

export function ResultsPanel() {
  const currentTask = useAgentStore((state) => state.currentTask);
  const agentStatus = useAgentStore((state) => state.agentStatus);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  // Simulate loading skeleton states when the agent starts extracting data
  useEffect(() => {
    if (agentStatus.phase === "extracting") {
      setLoading(true);
    } else if (agentStatus.phase === "analyzing" || agentStatus.phase === "done" || currentTask?.status === "completed") {
      setLoading(false);
    } else if (!currentTask) {
      setLoading(false);
    }
  }, [agentStatus.phase, currentTask]);

  const results = useAgentStore((state) => state.results);

  // Filtering based on search term
  const filteredResults = results.filter(
    (row) =>
      row.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.loc.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Render Skeleton rows for loading state
  const renderSkeletons = () => (
    <div className="space-y-3">
      {/* Skeletons header */}
      <div className="grid grid-cols-4 gap-4 mb-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-20 bg-zinc-900 border border-zinc-800 rounded-xl p-4 animate-pulse flex flex-col justify-between">
            <div className="h-2.5 bg-zinc-800 rounded w-1/2"></div>
            <div className="h-4 bg-zinc-800 rounded w-1/3"></div>
          </div>
        ))}
      </div>
      {/* Skeletons table */}
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

  // Render Empty State
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

  // Calculate dynamic stats from real scraped jobs
  const totalJobs = results.length;
  const relevantJobs = results.filter(row => (row.match || 0) >= 90).length;
  const matchPercentage = totalJobs > 0 ? Math.round((relevantJobs / totalJobs) * 100) : 0;

  // Extract numerical salary averages
  const parseSalary = (salStr) => {
    if (!salStr) return 0;
    const clean = salStr.replace(/[^0-9]/g, "");
    const val = parseInt(clean);
    return isNaN(val) ? 0 : val;
  };
  const salaries = results.map(item => parseSalary(item.sal)).filter(s => s > 0);
  const avgSalary = salaries.length > 0 
    ? Math.round(salaries.reduce((acc, val) => acc + val, 0) / salaries.length) 
    : 0;

  return (
    <div className="flex-1 flex flex-col gap-4 overflow-hidden h-full">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 shrink-0">
        <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-xl p-3.5 flex flex-col justify-between hover:border-zinc-700/80 transition-colors shadow-sm">
          <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider flex items-center gap-1.5">
            <Briefcase className="w-3.5 h-3.5 text-blue-500" /> Jobs Found
          </span>
          <span className="text-2xl font-semibold mt-2 text-zinc-100">{totalJobs}</span>
        </div>

        <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-xl p-3.5 flex flex-col justify-between hover:border-zinc-700/80 transition-colors shadow-sm">
          <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider flex items-center gap-1.5">
            <Star className="w-3.5 h-3.5 text-emerald-500" /> Relevant Jobs
          </span>
          <span className="text-2xl font-semibold mt-2 text-zinc-100">{relevantJobs} <span className="text-xs text-zinc-500 font-normal">({matchPercentage}%)</span></span>
        </div>

        <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-xl p-3.5 flex flex-col justify-between hover:border-zinc-700/80 transition-colors shadow-sm">
          <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-purple-500" /> Average Salary
          </span>
          <span className="text-2xl font-semibold mt-2 text-zinc-100">{avgSalary > 0 ? `$${avgSalary.toLocaleString()}` : "N/A"}</span>
        </div>

        <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-xl p-3.5 flex flex-col justify-between hover:border-zinc-700/80 transition-colors shadow-sm">
          <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-yellow-500" /> Top Skills
          </span>
          <div className="flex gap-1.5 flex-wrap mt-2.5">
            {["Python", "FastAPI", "Pandas"].map((skill) => (
              <span key={skill} className="text-[9px] font-medium bg-zinc-850 px-1.5 py-0.5 rounded border border-zinc-800 text-zinc-300">
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="flex-1 bg-zinc-900/80 border border-zinc-800 rounded-xl overflow-hidden shadow-2xl flex flex-col min-h-0">
        {/* Search Toolbar */}
        <div className="h-12 border-b border-zinc-800 bg-zinc-950/40 flex items-center px-4 justify-between gap-4 shrink-0">
          <h3 className="text-xs font-semibold text-zinc-300 flex items-center gap-2">
            <Briefcase className="w-3.5 h-3.5 text-zinc-500" /> Extracted Listings
          </h3>
          <div className="relative w-64">
            <Search className="w-3.5 h-3.5 text-zinc-650 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by company, role or location..."
              className="w-full h-8 bg-zinc-900 border border-zinc-800 rounded-md pl-9 pr-3 text-xs text-zinc-300 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-700 transition-colors"
            />
          </div>
        </div>

        {/* Scrollable Results Table */}
        <div className="flex-1 overflow-auto custom-scrollbar">
          {filteredResults.length > 0 ? (
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-zinc-900/50 text-zinc-400 text-[10px] uppercase tracking-wider sticky top-0 z-10 backdrop-blur-md border-b border-zinc-800">
                <tr>
                  <th className="px-4 py-3 font-medium">Company</th>
                  <th className="px-4 py-3 font-medium">Role</th>
                  <th className="px-4 py-3 font-medium">Location</th>
                  <th className="px-4 py-3 font-medium">Experience</th>
                  <th className="px-4 py-3 font-medium">Salary</th>
                  <th className="px-4 py-3 font-medium">Match Score</th>
                  <th className="px-4 py-3 font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/50 text-zinc-300">
                {filteredResults.map((row) => (
                  <tr key={row.id} className="hover:bg-zinc-800/30 transition-colors group">
                    <td className="px-4 py-3.5 flex items-center gap-2 font-medium text-zinc-200">
                      <Building className="w-3.5 h-3.5 text-zinc-500" /> {row.company}
                    </td>
                    <td className="px-4 py-3.5 text-zinc-200">{row.role}</td>
                    <td className="px-4 py-3.5 text-zinc-400"><MapPin className="w-3 h-3 inline mr-1" /> {row.loc}</td>
                    <td className="px-4 py-3.5 text-zinc-400"><GraduationCap className="w-3.5 h-3.5 inline mr-1" /> {row.exp}</td>
                    <td className="px-4 py-3.5 font-mono text-zinc-400"><DollarSign className="w-3 h-3 inline mr-0.5" /> {row.sal}</td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <span className="bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded text-[11px] border border-emerald-900/50 font-semibold">
                          {row.match}%
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <a 
                        href={row.url} 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 hover:underline"
                      >
                        Apply <ExternalLink className="w-3 h-3" />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center text-zinc-650 py-12">
              <Search className="w-8 h-8 mx-auto mb-2 text-zinc-700" />
              <p className="text-xs">No matching listings found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
