"use client";

import { useState, useRef } from "react";
import { UploadCloud, FileText, Search, PlusCircle, Trash2, Eye, RefreshCw, CheckCircle, AlertTriangle } from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import Button from "@/components/common/Button";
import Card from "@/components/common/Card";
import { useDashboardStore } from "@/lib/store";

export default function DocumentsPage() {
  const { documents, addDocument, deleteDocument } = useDashboardStore();
  const [filter, setFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  // Filter and search logic
  const filteredDocs = documents.filter(doc => {
    const matchesFilter = filter === "All" || doc.type === filter;
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleFile = (file) => {
    if (!file) return;

    // Detect format type
    let docType = "Text";
    if (file.name.endsWith(".pdf")) docType = "PDF";
    else if (file.name.endsWith(".docx") || file.name.endsWith(".doc")) docType = "Word";

    const fileSizeStr = file.size > 1024 * 1024
      ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
      : `${(file.size / 1024).toFixed(0)} KB`;

    // 1. Create a document in "Parsing" state
    const newDocId = Date.now();
    const newDoc = {
      id: newDocId,
      name: file.name,
      type: docType,
      size: fileSizeStr,
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      status: "Parsing",
      qs: 0
    };

    addDocument(newDoc);

    // 2. Simulate AI parsing delay, then set to "Parsed"
    setTimeout(() => {
      const simulatedQs = Math.floor(10 + Math.random() * 25);
      deleteDocument(newDocId);
      addDocument({
        ...newDoc,
        id: newDocId, // Keep same ID so the UI updates in-place stably
        status: "Parsed",
        qs: simulatedQs
      });
    }, 1800);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleSelectFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-[1280px] mx-auto flex flex-col gap-8">
        
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex flex-col">
            <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
              Syllabus Documents
            </h1>
            <p className="text-zinc-550 text-xs md:text-sm font-light mt-1">
              Upload and manage study guidelines, reference textbooks, and lecture transcripts.
            </p>
          </div>
          
          <Button 
            variant="accent" 
            className="py-2 px-4 gap-1.5 font-bold shrink-0 w-full sm:w-auto cursor-pointer"
            onClick={handleSelectFileClick}
          >
            <PlusCircle className="w-4 h-4" /> Upload Document
          </Button>
        </div>

        {/* Hidden File Input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileInputChange}
          accept=".pdf,.docx,.doc,.txt"
          className="hidden"
        />

        {/* Interactive Dropzone */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleSelectFileClick}
          className={`border border-dashed transition-all duration-300 p-8 rounded-xl text-center cursor-pointer select-none ${
            isDragging
              ? "border-blue-500 bg-blue-950/10 scale-[1.01]"
              : "border-zinc-800 hover:border-zinc-700 bg-black/40"
          }`}
        >
          <div className="flex flex-col items-center justify-center">
            <UploadCloud className={`w-10 h-10 mb-3 transition-colors ${isDragging ? "text-blue-400" : "text-zinc-500"}`} />
            <h3 className="text-white font-bold text-sm">
              {isDragging ? "Drop your syllabus here" : "Drag and drop document files"}
            </h3>
            <p className="text-zinc-550 text-[10px] mt-1 max-w-sm font-light">
              Supported file configurations include PDF, Microsoft Word, or plain Text documents. Maximum size limit is 15MB.
            </p>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 border-b border-zinc-900 pb-5">
          {/* Filters */}
          <div className="flex items-center gap-1 bg-zinc-950 border border-zinc-900 rounded-lg p-1 w-fit select-none">
            {["All", "PDF", "Word", "Text"].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1 rounded text-[10px] font-bold tracking-wide uppercase transition-colors duration-150 cursor-pointer ${
                  filter === f ? "bg-zinc-900 text-white" : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative group max-w-xs w-full">
            <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-zinc-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search files by title..."
              className="w-full bg-zinc-950 border border-zinc-900 hover:border-zinc-800 focus:border-zinc-700 rounded-lg py-2 pl-9 pr-4 text-xs text-white focus:outline-none placeholder-zinc-550"
            />
          </div>
        </div>

        {/* File Table list */}
        <div className="flex flex-col border border-zinc-800 bg-[#09090B] rounded-xl overflow-hidden">
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse text-[11px] min-w-[600px]">
              <thead>
                <tr className="border-b border-zinc-900 text-zinc-500 uppercase tracking-wider text-[9px] font-semibold bg-zinc-950/40 select-none">
                  <th className="py-2.5 px-4">Filename</th>
                  <th className="py-2.5 px-4">Upload Date</th>
                  <th className="py-2.5 px-4">File Size</th>
                  <th className="py-2.5 px-4">Generated Qs</th>
                  <th className="py-2.5 px-4 text-center">Status</th>
                  <th className="py-2.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900 font-sans">
                {filteredDocs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-zinc-550 text-xs font-light">
                      No documents found matching the search criteria.
                    </td>
                  </tr>
                ) : (
                  filteredDocs.map((doc) => (
                    <tr key={doc.id} className="hover:bg-zinc-900/10 transition-colors">
                      {/* Name */}
                      <td className="py-3 px-4 font-semibold text-zinc-100 flex items-center gap-3">
                        <FileText className="w-4 h-4 text-red-400 shrink-0" />
                        <span className="truncate max-w-[250px]">{doc.name}</span>
                      </td>
                      
                      {/* Upload Date */}
                      <td className="py-3 px-4 text-zinc-400 font-light">{doc.date}</td>
                      
                      {/* Size */}
                      <td className="py-3 px-4 text-zinc-500 font-mono">{doc.size}</td>
                      
                      {/* Generated items */}
                      <td className="py-3 px-4 text-zinc-300 font-mono font-medium">
                        {doc.status === "Parsed" ? `${doc.qs} items` : "—"}
                      </td>
                      
                      {/* Status badge */}
                      <td className="py-3 px-4 text-center">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-semibold font-mono tracking-wide ${
                          doc.status === "Parsed"
                            ? "bg-emerald-950/40 text-emerald-400 border border-emerald-900/50"
                            : doc.status === "Parsing"
                            ? "bg-blue-950/40 text-blue-400 border border-blue-900/50"
                            : "bg-red-950/40 text-red-400 border border-red-900/50"
                        }`}>
                          {doc.status === "Parsing" && <RefreshCw className="w-2.5 h-2.5 animate-spin" />}
                          {doc.status === "Parsed" && <CheckCircle className="w-2.5 h-2.5 text-emerald-450" />}
                          {doc.status === "Failed" && <AlertTriangle className="w-2.5 h-2.5 text-red-450" />}
                          {doc.status}
                        </span>
                      </td>
                      
                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-3.5 text-zinc-550 select-none">
                          <button title="View Details" className="hover:text-white transition-colors cursor-pointer">
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button 
                            title="Delete File" 
                            className="hover:text-red-400 transition-colors cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteDocument(doc.id);
                            }}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
