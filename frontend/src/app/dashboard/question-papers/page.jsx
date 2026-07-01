"use client";

import { useState } from "react";
import { FileText, Search, Download, Eye, Share2, Trash2, CheckCircle, XCircle } from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import Button from "@/components/common/Button";
import Card from "@/components/common/Card";
import { useDashboardStore } from "@/lib/store";

export default function QuestionPapersPage() {
  const { papers, deletePaper } = useDashboardStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("info"); // info, success

  // Filter papers by title or code
  const filteredPapers = papers.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const showToast = (message, type = "info") => {
    setToastMessage(message);
    setToastType(type);
    setTimeout(() => {
      setToastMessage("");
    }, 2500);
  };

  const handleDownload = (title) => {
    showToast(`Downloading ${title}.pdf blueprint & solutions key...`, "success");
  };

  const handleShare = (title) => {
    showToast(`Copied secure sharing link for ${title} to clipboard!`, "success");
  };

  const handlePreview = (title) => {
    showToast(`Opening interactive PDF layout preview for ${title}...`, "info");
  };

  return (
    <DashboardLayout>
      <div className="max-w-[1280px] mx-auto flex flex-col gap-8">
        
        {/* Header */}
        <div className="flex flex-col">
          <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
            Question Papers
          </h1>
          <p className="text-zinc-550 text-xs md:text-sm font-light mt-1">
            Access, download, and review generated examinations blueprints and solutions.
          </p>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 border-b border-zinc-900 pb-5">
          <div className="flex items-center gap-3">
            <span className="text-zinc-400 text-xs font-semibold select-none">
              Total Papers: {filteredPapers.length}
            </span>
          </div>

          {/* Search bar */}
          <div className="relative group max-w-xs w-full">
            <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-zinc-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search papers by course code or title..."
              className="w-full bg-zinc-950 border border-zinc-900 hover:border-zinc-800 focus:border-zinc-700 rounded-lg py-2 pl-9 pr-4 text-xs text-white focus:outline-none placeholder-zinc-550"
            />
          </div>
        </div>

        {/* Grid cards of papers (enterprise catalog style) */}
        {filteredPapers.length === 0 ? (
          <div className="py-20 text-center border border-zinc-850 rounded-xl bg-black/40">
            <span className="text-sm text-zinc-550 block font-light">No question papers found matching your query.</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPapers.map((paper) => (
              <Card key={paper.id} hoverBorder={true} className="flex flex-col justify-between h-[215px] p-5">
                
                {/* Top details */}
                <div>
                  <div className="flex justify-between items-start mb-3 border-b border-zinc-900 pb-2.5">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-blue-500 shrink-0" />
                      <span className="text-[10px] text-zinc-400 font-mono bg-zinc-950 border border-zinc-900 px-1.5 py-0.5 rounded">
                        {paper.code}
                      </span>
                    </div>
                    <span className="text-[9px] font-mono text-zinc-500 font-light">{paper.date}</span>
                  </div>

                  <h3 className="text-white font-semibold text-sm truncate" title={paper.title}>
                    {paper.title}
                  </h3>
                  <span className="text-zinc-500 text-[10px] mt-0.5 block font-light">{paper.subject}</span>
                </div>

                {/* Middle Metrics info */}
                <div className="flex gap-4 items-center mt-3 bg-zinc-950 p-2 rounded border border-zinc-900 text-[10px]">
                  <div className="flex flex-col flex-1">
                    <span className="text-zinc-550 text-[8px] uppercase tracking-wider">Max Marks</span>
                    <span className="text-zinc-200 font-bold font-mono mt-0.5">{paper.marks}</span>
                  </div>
                  <div className="w-px h-6 bg-zinc-900 shrink-0" />
                  <div className="flex flex-col flex-1">
                    <span className="text-zinc-550 text-[8px] uppercase tracking-wider">Cognitive Index</span>
                    <span className="text-emerald-400 font-bold font-mono mt-0.5 flex items-center gap-1">
                      <CheckCircle className="w-2.5 h-2.5" /> {paper.compliance}
                    </span>
                  </div>
                </div>

                {/* Bottom Actions footer */}
                <div className="mt-4 pt-3.5 border-t border-zinc-900 flex items-center justify-between text-zinc-400">
                  <button 
                    onClick={() => handlePreview(paper.title)}
                    className="flex items-center gap-1.5 hover:text-white transition-colors text-[10px] font-semibold cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 text-zinc-550" /> Preview
                  </button>
                  
                  <div className="flex items-center gap-3.5">
                    <button 
                      title="Share Link" 
                      onClick={() => handleShare(paper.title)}
                      className="hover:text-white p-1 transition-colors cursor-pointer text-zinc-500"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </button>
                    <button 
                      title="Download PDF" 
                      onClick={() => handleDownload(paper.title)}
                      className="hover:text-white p-1 transition-colors cursor-pointer text-zinc-500"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                    <button 
                      title="Delete Draft" 
                      onClick={() => {
                        deletePaper(paper.id);
                        showToast(`Deleted draft: ${paper.title}`, "info");
                      }}
                      className="hover:text-red-400 p-1 transition-colors cursor-pointer text-zinc-500"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

              </Card>
            ))}
          </div>
        )}

        {/* Global Toast Notification */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 animate-slide-up flex items-center gap-2.5 px-4 py-3 rounded-lg border bg-[#09090B] border-zinc-800 text-white shadow-2xl text-xs font-medium">
            <CheckCircle className={`w-4 h-4 ${toastType === "success" ? "text-emerald-400" : "text-blue-400"}`} />
            <span>{toastMessage}</span>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}
