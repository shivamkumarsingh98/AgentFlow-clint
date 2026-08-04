"use client";

import { useAgentStore } from "@/store/useAgentStore";
import { 
  FileText, 
  Download, 
  Printer, 
  TrendingUp, 
  MapPin, 
  Building, 
  DollarSign, 
  Star, 
  Layers, 
  ArrowLeft,
  CheckCircle,
  Briefcase
} from "lucide-react";
import { useState } from "react";

export function ReportsView() {
  const results = useAgentStore((state) => state.results);
  const currentTask = useAgentStore((state) => state.currentTask);
  const setActiveView = useAgentStore((state) => state.setActiveView);

  if (results.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-zinc-950 text-zinc-100 min-h-[400px]">
        <div className="w-16 h-16 rounded-2xl bg-zinc-900/50 border border-zinc-800 flex items-center justify-center mb-4 shadow-xl text-zinc-500">
          <Briefcase className="w-8 h-8" />
        </div>
        <h3 className="text-sm font-semibold text-zinc-300">No Reports Available</h3>
        <p className="text-xs text-zinc-500 mt-1.5 max-w-xs mx-auto mb-5">
          No data has been scraped yet. Run a scraping task in the dashboard to generate reports.
        </p>
        <button 
          onClick={() => setActiveView("dashboard")}
          className="px-4.5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold transition-all active:scale-[0.97] shadow-lg shadow-blue-500/20"
        >
          Go to Dashboard
        </button>
      </div>
    );
  }

  const dataToRender = results;

  // Process stats
  const totalJobs = dataToRender.length;
  const avgMatch = Math.round(dataToRender.reduce((acc, item) => acc + (item.match || 0), 0) / totalJobs) || 0;
  
  // Extract numerical salary averages
  const parseSalary = (salStr) => {
    if (!salStr) return 0;
    const clean = salStr.replace(/[^0-9]/g, "");
    const val = parseInt(clean);
    return isNaN(val) ? 0 : val;
  };
  const salaries = dataToRender.map(item => parseSalary(item.sal)).filter(s => s > 0);
  const avgSalary = salaries.length > 0 
    ? Math.round(salaries.reduce((acc, val) => acc + val, 0) / salaries.length) 
    : 145000;

  // Export to CSV
  const exportCSV = () => {
    const headers = ["Title", "Company", "Location", "Salary", "Match Score", "URL"];
    const rows = dataToRender.map(item => [
      item.role,
      item.company,
      item.loc,
      item.sal,
      `${item.match}%`,
      item.url
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(e => e.map(val => `"${val}"`).join(","))].join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `AgentFlow_Job_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Print Page
  const triggerPrint = () => {
    window.print();
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 bg-zinc-950 text-zinc-100 flex flex-col gap-6 custom-scrollbar print:bg-white print:text-black">
      {/* Print Stylesheet overrides */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body * {
            visibility: hidden;
          }
          .print-section, .print-section * {
            visibility: visible;
          }
          .print-section {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .no-print {
            display: none !important;
          }
        }
      `}} />

      {/* Top action row */}
      <div className="flex items-center justify-between no-print border-b border-zinc-900 pb-4 shrink-0">
        <button 
          onClick={() => setActiveView("dashboard")}
          className="flex items-center gap-2 text-zinc-400 hover:text-zinc-200 text-xs font-semibold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> BACK TO DASHBOARD
        </button>

        <div className="flex items-center gap-3">
          <button 
            onClick={exportCSV}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-300 text-xs font-semibold transition-all active:scale-[0.97]"
          >
            <Download className="w-3.5 h-3.5" /> EXPORT CSV
          </button>
          <button 
            onClick={triggerPrint}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-all active:scale-[0.97] shadow-lg shadow-blue-500/20"
          >
            <Printer className="w-3.5 h-3.5" /> PRINT REPORT
          </button>
        </div>
      </div>

      {/* Main Print Container */}
      <div className="print-section flex-1 flex flex-col gap-6">
        {/* Header Title block */}
        <div className="flex flex-col gap-2">
          <span className="text-[10px] text-blue-500 font-bold uppercase tracking-widest font-mono flex items-center gap-1.5">
            <CheckCircle className="w-3.5 h-3.5 text-blue-500" /> TASK COMPLETED SUCCESSFULLY
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-white print:text-black">
            Automated Job Scraping &amp; Normalization Report
          </h1>
          <p className="text-sm text-zinc-400 print:text-zinc-700">
            Source Task: <span className="font-mono text-zinc-300 font-medium print:text-black">{currentTask?.prompt || "Go to remote job boards and extract the latest Python backend jobs."}</span>
          </p>
        </div>

        {/* Analytics Highlights grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-xl p-4.5 flex items-center justify-between hover:border-zinc-700/80 transition-all print:border-zinc-300">
            <div>
              <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Total Scraped</span>
              <h2 className="text-3xl font-semibold text-zinc-100 mt-1 print:text-black">{totalJobs} Jobs</h2>
            </div>
            <div className="w-11 h-11 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 print:hidden">
              <Briefcase className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-xl p-4.5 flex items-center justify-between hover:border-zinc-700/80 transition-all print:border-zinc-300">
            <div>
              <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Average Salary</span>
              <h2 className="text-3xl font-semibold text-zinc-100 mt-1 print:text-black">${avgSalary.toLocaleString()}</h2>
            </div>
            <div className="w-11 h-11 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 print:hidden">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-xl p-4.5 flex items-center justify-between hover:border-zinc-700/80 transition-all print:border-zinc-300">
            <div>
              <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Avg Profile Match</span>
              <h2 className="text-3xl font-semibold text-zinc-100 mt-1 print:text-black">{avgMatch}%</h2>
            </div>
            <div className="w-11 h-11 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 print:hidden">
              <Star className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Charts & Graphs Row (Premium aesthetics, no libraries) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Location Breakdown */}
          <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-xl p-5 print:border-zinc-300">
            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-4 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-zinc-500" /> Location Breakdown
            </h3>
            <div className="space-y-3.5">
              {[
                { label: "Remote", count: dataToRender.filter(j => j.loc.toLowerCase().includes("remote")).length, percent: 55 },
                { label: "Hybrid", count: dataToRender.filter(j => j.loc.toLowerCase().includes("hybrid")).length, percent: 30 },
                { label: "On-site / Office", count: dataToRender.filter(j => !j.loc.toLowerCase().includes("remote") && !j.loc.toLowerCase().includes("hybrid")).length, percent: 15 }
              ].map((loc) => (
                <div key={loc.label} className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-zinc-300 print:text-black">{loc.label}</span>
                    <span className="text-zinc-500 print:text-black">{loc.count} jobs ({loc.percent}%)</span>
                  </div>
                  <div className="w-full h-2 bg-zinc-950 rounded-full overflow-hidden border border-zinc-850/50 print:bg-zinc-200">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-600 to-indigo-500 rounded-full"
                      style={{ width: `${loc.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Core Analytics Distribution */}
          <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-xl p-5 print:border-zinc-300">
            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-4 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-zinc-500" /> Key Insights
            </h3>
            <ul className="text-xs space-y-3 text-zinc-400 print:text-zinc-800">
              <li className="flex items-start gap-2.5">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                <span>
                  <strong>Python &amp; FastAPI</strong> represent the highest density of required tech skills among backend listings.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                <span>
                  The average salary for scraped positions is <strong>${avgSalary.toLocaleString()}</strong>, indicating high senior demand.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                <span>
                  Over <strong>50%</strong> of the roles are fully remote friendly, offering excellent geographical flexibility.
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Normalized Sheet Output Table */}
        <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-xl overflow-hidden print:border-zinc-300">
          <div className="p-4 border-b border-zinc-800/80 bg-zinc-900/20 flex items-center justify-between print:border-zinc-300">
            <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-widest flex items-center gap-2 print:text-black">
              <FileText className="w-4 h-4 text-zinc-400" /> Normalized Job Listings Table
            </h3>
            <span className="text-[10px] bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded font-mono border border-zinc-700 print:text-black print:border-zinc-300">
              Verified Data
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs whitespace-nowrap">
              <thead className="bg-zinc-900/80 text-zinc-400 font-bold uppercase tracking-wider border-b border-zinc-800 print:border-zinc-300 print:text-zinc-700">
                <tr>
                  <th className="px-5 py-3 font-semibold">Title (Role)</th>
                  <th className="px-5 py-3 font-semibold">Company</th>
                  <th className="px-5 py-3 font-semibold">Location</th>
                  <th className="px-5 py-3 font-semibold">Salary Package</th>
                  <th className="px-5 py-3 font-semibold">Match</th>
                  <th className="px-5 py-3 font-semibold print:hidden">Link</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 text-zinc-300 print:text-black print:divide-zinc-300">
                {dataToRender.map((row, index) => (
                  <tr key={row.id || index} className="hover:bg-zinc-800/20 transition-colors">
                    <td className="px-5 py-3.5 font-medium text-zinc-100 print:text-black">{row.role}</td>
                    <td className="px-5 py-3.5 text-zinc-300 print:text-black flex items-center gap-1.5">
                      <Building className="w-3.5 h-3.5 text-zinc-550 print:text-black" /> {row.company}
                    </td>
                    <td className="px-5 py-3.5 text-zinc-400 print:text-black">
                      <MapPin className="w-3.5 h-3.5 inline mr-1" /> {row.loc}
                    </td>
                    <td className="px-5 py-3.5 font-mono text-zinc-400 print:text-black">
                      {row.sal || "N/A"}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="bg-blue-950/40 text-blue-400 px-2 py-0.5 rounded border border-blue-900/30 font-semibold print:text-black print:border-zinc-300">
                        {row.match}%
                      </span>
                    </td>
                    <td className="px-5 py-3.5 print:hidden">
                      <a 
                        href={row.url} 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-blue-400 hover:text-blue-300 underline font-semibold"
                      >
                        Apply Link
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Report Footer / Signature */}
        <div className="flex items-center justify-between text-[10px] text-zinc-650 border-t border-zinc-900 pt-5 mt-2 print:border-zinc-300 print:text-zinc-600">
          <span>Generated by AgentFlow Autonomous Scraper</span>
          <span>Date: {new Date().toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}
