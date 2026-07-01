"use client";

import { useState } from "react";
import { Database, Search, PlusCircle, Edit, Trash2, CheckCircle2, X } from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import Button from "@/components/common/Button";
import Card from "@/components/common/Card";
import { useDashboardStore } from "@/lib/store";

export default function QuestionBankPage() {
  const { questions, addQuestion, deleteQuestion } = useDashboardStore();
  const [activeFormat, setActiveFormat] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Modal State for adding questions
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newQuestionText, setNewQuestionText] = useState("");
  const [newQuestionLevel, setNewQuestionLevel] = useState("L3 - Applying");
  const [newQuestionSubject, setNewQuestionSubject] = useState("Computer Science");
  const [newQuestionFormat, setNewQuestionFormat] = useState("Short Answer");
  const [newQuestionMarks, setNewQuestionMarks] = useState("5 Marks");

  // Filter and Search Logic
  const filteredQs = questions.filter(q => {
    const matchesFormat = activeFormat === "All" || q.format === activeFormat;
    const matchesSearch = q.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          q.subject.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFormat && matchesSearch;
  });

  const handleAddQuestionSubmit = (e) => {
    e.preventDefault();
    if (!newQuestionText.trim()) return;

    // Normalize marks string (e.g., "5 Marks" -> "5 M")
    const marksShort = newQuestionMarks.replace(" Marks", " M").replace(" Mark", " M");

    const newQ = {
      id: Date.now(),
      text: newQuestionText,
      level: newQuestionLevel,
      subject: newQuestionSubject,
      format: newQuestionFormat,
      marks: marksShort
    };

    addQuestion(newQ);
    
    // Reset Form
    setNewQuestionText("");
    setIsModalOpen(false);
  };

  return (
    <DashboardLayout>
      <div className="max-w-[1280px] mx-auto flex flex-col gap-8 font-sans">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex flex-col">
            <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
              Question Bank Library
            </h1>
            <p className="text-zinc-550 text-xs md:text-sm font-light mt-1">
              Store, search, and organize generated cognitive question items for future exam blueprints.
            </p>
          </div>
          
          <Button 
            variant="accent" 
            className="py-2 px-4 gap-1.5 font-bold shrink-0 w-full sm:w-auto cursor-pointer"
            onClick={() => setIsModalOpen(true)}
          >
            <PlusCircle className="w-4 h-4" /> Add Custom Question
          </Button>
        </div>

        {/* Filters & Search Toolbar */}
        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 border-b border-zinc-900 pb-5">
          {/* Formats filter */}
          <div className="flex items-center gap-1 bg-zinc-950 border border-zinc-900 rounded-lg p-1 w-fit select-none">
            {["All", "MCQ", "Short Answer", "Descriptive"].map(f => (
              <button
                key={f}
                onClick={() => setActiveFormat(f)}
                className={`px-3 py-1 rounded text-[10px] font-bold tracking-wide uppercase transition-colors duration-150 cursor-pointer ${
                  activeFormat === f ? "bg-zinc-900 text-white" : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative group max-w-xs w-full">
            <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-zinc-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search library questions..."
              className="w-full bg-zinc-950 border border-zinc-900 hover:border-zinc-800 focus:border-zinc-700 rounded-lg py-2 pl-9 pr-4 text-xs text-white focus:outline-none placeholder-zinc-550"
            />
          </div>
        </div>

        {/* Question List Cards */}
        <div className="flex flex-col gap-3">
          {filteredQs.length === 0 ? (
            <div className="py-12 text-center border border-zinc-850 bg-black/40 rounded-xl">
              <span className="text-zinc-550 text-xs font-light">No library questions found.</span>
            </div>
          ) : (
            filteredQs.map((q) => (
              <div
                key={q.id}
                className="p-4 rounded-xl bg-[#09090B] border border-zinc-800 flex items-start justify-between gap-6 hover:border-zinc-700 transition-all duration-150"
              >
                
                {/* Left description */}
                <div className="flex gap-4 items-start min-w-0">
                  <div className="p-2 rounded bg-zinc-950 border border-zinc-900 text-blue-500 shrink-0 select-none">
                    <Database className="w-3.5 h-3.5" />
                  </div>
                  
                  <div className="flex flex-col gap-1.5 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 text-[8px] font-mono select-none">
                      <span className="px-1.5 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-900 font-semibold uppercase">
                        {q.level}
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-zinc-900 text-zinc-400 border border-zinc-850 font-semibold">
                        {q.subject}
                      </span>
                      <span className="text-zinc-500 font-light">{q.format}</span>
                    </div>
                    <p className="text-zinc-200 text-xs font-light leading-relaxed truncate md:whitespace-normal">
                      {q.text}
                    </p>
                  </div>
                </div>

                {/* Right actions */}
                <div className="flex items-center gap-4 shrink-0 select-none">
                  <span className="text-zinc-300 font-mono text-[10px] font-bold bg-zinc-950 border border-zinc-900 px-2 py-0.5 rounded">
                    {q.marks}
                  </span>
                  <div className="flex items-center gap-2 text-zinc-500">
                    <button title="Delete Item" className="p-1 hover:text-red-400 transition-colors cursor-pointer" onClick={() => deleteQuestion(q.id)}>
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

              </div>
            ))
          )}
        </div>

        {/* Add Question Dialog Modal Overlay */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/85 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-[#09090B] border border-zinc-850 rounded-xl p-6 relative">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-zinc-500 hover:text-white p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <h2 className="text-white font-bold text-sm mb-4 border-b border-zinc-900 pb-2 flex items-center gap-2">
                <Database className="w-4 h-4 text-blue-500" />
                Add Custom Question
              </h2>

              <form onSubmit={handleAddQuestionSubmit} className="space-y-4 text-xs">
                <div className="flex flex-col gap-1.5">
                  <label className="text-zinc-400 font-medium">Question Text</label>
                  <textarea
                    rows={3}
                    value={newQuestionText}
                    onChange={(e) => setNewQuestionText(e.target.value)}
                    placeholder="Enter the question contents..."
                    className="bg-black border border-zinc-800 rounded-lg p-2.5 text-white placeholder-zinc-650 focus:outline-none focus:border-zinc-700 resize-none"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-zinc-400 font-medium">Bloom's Level</label>
                    <select
                      value={newQuestionLevel}
                      onChange={(e) => setNewQuestionLevel(e.target.value)}
                      className="bg-black border border-zinc-800 rounded-lg p-2 text-white focus:outline-none focus:border-zinc-700"
                    >
                      <option value="L1 - Remembering">L1 - Remembering</option>
                      <option value="L2 - Understanding">L2 - Understanding</option>
                      <option value="L3 - Applying">L3 - Applying</option>
                      <option value="L4 - Analyzing">L4 - Analyzing</option>
                      <option value="L5 - Evaluating">L5 - Evaluating</option>
                      <option value="L6 - Creating">L6 - Creating</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-zinc-400 font-medium">Subject / Course</label>
                    <input
                      type="text"
                      value={newQuestionSubject}
                      onChange={(e) => setNewQuestionSubject(e.target.value)}
                      placeholder="e.g. Data Structures"
                      className="bg-black border border-zinc-800 rounded-lg p-2 text-white placeholder-zinc-650 focus:outline-none focus:border-zinc-700"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-zinc-400 font-medium">Format</label>
                    <select
                      value={newQuestionFormat}
                      onChange={(e) => setNewQuestionFormat(e.target.value)}
                      className="bg-black border border-zinc-800 rounded-lg p-2 text-white focus:outline-none focus:border-zinc-700"
                    >
                      <option value="MCQ">MCQ</option>
                      <option value="Short Answer">Short Answer</option>
                      <option value="Descriptive">Descriptive</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-zinc-400 font-medium">Allocation Marks</label>
                    <select
                      value={newQuestionMarks}
                      onChange={(e) => setNewQuestionMarks(e.target.value)}
                      className="bg-black border border-zinc-800 rounded-lg p-2 text-white focus:outline-none focus:border-zinc-700"
                    >
                      <option value="1 Mark">1 Mark</option>
                      <option value="2 Marks">2 Marks</option>
                      <option value="5 Marks">5 Marks</option>
                      <option value="8 Marks">8 Marks</option>
                      <option value="10 Marks">10 Marks</option>
                    </select>
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-3 select-none">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 border border-zinc-800 hover:border-zinc-700 bg-transparent text-zinc-400 hover:text-white rounded-lg transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <Button type="submit" variant="accent" className="py-2 px-5 cursor-pointer">
                    Add Question
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}
