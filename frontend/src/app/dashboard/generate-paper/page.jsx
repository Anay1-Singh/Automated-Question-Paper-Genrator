"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sliders, UploadCloud, Cpu, Sparkles, BookOpen, AlertCircle, RefreshCw, FileText, CheckCircle } from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import Button from "@/components/common/Button";
import Card from "@/components/common/Card";
import { useDashboardStore } from "@/lib/store";

export default function GeneratePaperPage() {
  const router = useRouter();
  const { documents, addPaper, addDocument } = useDashboardStore();

  // Form States
  const [courseCode, setCourseCode] = useState("CS-202");
  const [courseName, setCourseName] = useState("Analysis of Algorithms");
  const [selectedDocId, setSelectedDocId] = useState(documents[0]?.id || "");
  const [mcqCount, setMcqCount] = useState("10");
  const [shortCount, setShortCount] = useState("5");
  const [descCount, setDescCount] = useState("2");

  // Bloom's Weights
  const [bloomWeights, setBloomWeights] = useState({
    remember: 20,
    understand: 20,
    apply: 30,
    analyze: 15,
    evaluate: 10,
    create: 5
  });

  // Difficulty Allocation
  const [difficulty, setDifficulty] = useState({
    easy: 30,
    medium: 50,
    hard: 20
  });

  // Upload/File States
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");

  // Generation Loading Overlay States
  const [isGenerating, setIsGenerating] = useState(false);
  const [genStep, setGenStep] = useState(0);

  const totalWeight = Object.values(bloomWeights).reduce((a, b) => a + b, 0);

  const handleWeightChange = (key, val) => {
    setBloomWeights(prev => ({
      ...prev,
      [key]: parseInt(val) || 0
    }));
  };

  // Mock upload document inside this screen
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadProgress("Reading file content...");

    setTimeout(() => {
      setUploadProgress("Injecting syllabus indexes...");
      setTimeout(() => {
        let docType = "Text";
        if (file.name.endsWith(".pdf")) docType = "PDF";
        else if (file.name.endsWith(".docx") || file.name.endsWith(".doc")) docType = "Word";

        const newDoc = {
          id: Date.now(),
          name: file.name,
          type: docType,
          size: `${(file.size / 1024).toFixed(0)} KB`,
          date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
          status: "Parsed",
          qs: Math.floor(12 + Math.random() * 20)
        };

        addDocument(newDoc);
        setSelectedDocId(newDoc.id);
        setIsUploading(false);
      }, 1000);
    }, 1000);
  };

  // Run the cinematic AI generation sequence
  const handleGenerate = (e) => {
    e.preventDefault();
    if (totalWeight !== 100) return;

    setIsGenerating(true);
    setGenStep(0);

    const steps = [
      "Analyzing uploaded syllabus reference guidelines...",
      "Drafting cognitive L1-L6 level question blueprints...",
      "Optimizing cognitive weights & syllabus coverage...",
      "Calibrating easy/medium/hard difficulty ratios...",
      "Polishing final question paper rubrics and answer schemes..."
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      if (currentStep < steps.length) {
        setGenStep(currentStep);
      } else {
        clearInterval(interval);
        
        // Compute total marks
        const totalMarks = (parseInt(mcqCount) * 1) + (parseInt(shortCount) * 5) + (parseInt(descCount) * 10);
        
        // Add generated paper to store
        const newPaper = {
          id: Date.now(),
          title: `${courseName} End Sem`,
          subject: courseName,
          code: courseCode,
          marks: `${totalMarks} Marks`,
          date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
          compliance: "98% Index",
          status: "Approved"
        };
        addPaper(newPaper);

        // Redirect to list page
        router.push("/dashboard/question-papers");
      }
    }, 700);
  };

  const selectedDoc = documents.find(d => d.id === Number(selectedDocId));

  return (
    <DashboardLayout>
      <div className="max-w-[1000px] mx-auto flex flex-col gap-8">
        
        {/* Header */}
        <div className="flex flex-col">
          <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
            Generate Question Paper
          </h1>
          <p className="text-zinc-550 text-xs md:text-sm font-light mt-1">
            Specify curriculum constraints, upload reference materials, and configure cognitive weights.
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleGenerate} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Form Fields (Col 8) */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            
            {/* Section 1: Course Info & Material */}
            <Card hoverBorder={false} className="flex flex-col gap-4">
              <span className="text-white font-bold text-sm border-b border-zinc-900 pb-3 block select-none">
                1. Course Details & Source Material
              </span>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-zinc-400 text-[10px] uppercase font-bold tracking-wider">Course Code</label>
                  <input
                    type="text"
                    value={courseCode}
                    onChange={(e) => setCourseCode(e.target.value)}
                    placeholder="e.g. CS-101"
                    className="bg-black border border-zinc-800 rounded-lg p-2.5 text-xs text-white placeholder-zinc-650 focus:outline-none focus:border-zinc-700"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-zinc-400 text-[10px] uppercase font-bold tracking-wider">Course Name</label>
                  <input
                    type="text"
                    value={courseName}
                    onChange={(e) => setCourseName(e.target.value)}
                    placeholder="e.g. Data Structures"
                    className="bg-black border border-zinc-800 rounded-lg p-2.5 text-xs text-white placeholder-zinc-650 focus:outline-none focus:border-zinc-700"
                    required
                  />
                </div>
              </div>

              {/* Source Document Selection */}
              <div className="flex flex-col gap-2 mt-2">
                <label className="text-zinc-400 text-[10px] uppercase font-bold tracking-wider">Select Source Reference Material</label>
                
                {documents.length > 0 ? (
                  <div className="flex gap-2">
                    <select
                      value={selectedDocId}
                      onChange={(e) => setSelectedDocId(e.target.value)}
                      className="flex-1 bg-black border border-zinc-800 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-zinc-700"
                      required
                    >
                      <option value="" disabled>Select an uploaded document</option>
                      {documents.map(d => (
                        <option key={d.id} value={d.id}>
                          {d.name} ({d.status === "Parsed" ? `${d.qs} Qs indexed` : "Parsing..."})
                        </option>
                      ))}
                    </select>

                    <button
                      type="button"
                      onClick={() => document.getElementById("form-file-uploader")?.click()}
                      className="px-3 border border-zinc-800 hover:border-zinc-700 bg-zinc-950 text-xs text-zinc-400 hover:text-white rounded-lg transition-colors cursor-pointer"
                    >
                      Upload New
                    </button>
                  </div>
                ) : (
                  <div className="border border-zinc-850 bg-black/20 p-4 rounded-lg text-center flex flex-col items-center justify-center">
                    <span className="text-xs text-zinc-550">No documents found. Upload a syllabus first.</span>
                    <button
                      type="button"
                      onClick={() => document.getElementById("form-file-uploader")?.click()}
                      className="mt-2 text-xs text-blue-500 hover:underline flex items-center gap-1 font-semibold"
                    >
                      <UploadCloud className="w-3.5 h-3.5" /> Upload now
                    </button>
                  </div>
                )}

                {selectedDoc && (
                  <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-light mt-1 bg-zinc-950/60 p-2.5 rounded-lg border border-zinc-900">
                    <FileText className="w-3.5 h-3.5 text-blue-500" />
                    <span>Selected source: <strong>{selectedDoc.name}</strong> • Size: {selectedDoc.size} • Status: <span className="text-emerald-400">{selectedDoc.status}</span></span>
                  </div>
                )}

                <input
                  type="file"
                  id="form-file-uploader"
                  onChange={handleFileUpload}
                  accept=".pdf,.docx,.doc,.txt"
                  className="hidden"
                />

                {isUploading && (
                  <div className="mt-2 p-2 bg-blue-950/20 border border-blue-900/40 rounded-lg flex items-center gap-2 text-[10px] text-blue-400">
                    <RefreshCw className="w-3 h-3 animate-spin" />
                    <span>{uploadProgress}</span>
                  </div>
                )}
              </div>
            </Card>

            {/* Section 2: Structure */}
            <Card hoverBorder={false} className="flex flex-col gap-4">
              <span className="text-white font-bold text-sm border-b border-zinc-900 pb-3 block select-none">
                2. Question Formats & Marks
              </span>
              <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-zinc-400 text-[10px] uppercase font-bold tracking-wider">MCQs (1 Mark)</label>
                  <input
                    type="number"
                    value={mcqCount}
                    onChange={(e) => setMcqCount(e.target.value)}
                    min="0"
                    className="bg-black border border-zinc-800 rounded-lg p-2.5 text-xs text-white font-mono focus:outline-none focus:border-zinc-700"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-zinc-400 text-[10px] uppercase font-bold tracking-wider">Short Answer (5 Marks)</label>
                  <input
                    type="number"
                    value={shortCount}
                    onChange={(e) => setShortCount(e.target.value)}
                    min="0"
                    className="bg-black border border-zinc-800 rounded-lg p-2.5 text-xs text-white font-mono focus:outline-none focus:border-zinc-700"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-zinc-400 text-[10px] uppercase font-bold tracking-wider">Descriptive (10 Marks)</label>
                  <input
                    type="number"
                    value={descCount}
                    onChange={(e) => setDescCount(e.target.value)}
                    min="0"
                    className="bg-black border border-zinc-800 rounded-lg p-2.5 text-xs text-white font-mono focus:outline-none focus:border-zinc-700"
                    required
                  />
                </div>
              </div>
            </Card>

            {/* Section 3: Cognitive distribution */}
            <Card hoverBorder={false} className="flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
                <span className="text-white font-bold text-sm select-none">
                  3. Bloom's Taxonomy Cognitive Allocation
                </span>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold ${
                  totalWeight === 100 ? "bg-emerald-950 text-emerald-400 border border-emerald-900" : "bg-red-950 text-red-400 border border-red-900"
                }`}>
                  Sum: {totalWeight}% / 100%
                </span>
              </div>

              {totalWeight !== 100 && (
                <div className="p-3 bg-red-950/20 border border-red-900/40 rounded-lg flex items-center gap-2.5 text-red-400 text-xs font-light">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>Cognitive allocation must sum to exactly 100% to generate balanced papers.</span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-2">
                {[
                  { key: "remember", label: "L1 - Remembering" },
                  { key: "understand", label: "L2 - Understanding" },
                  { key: "apply", label: "L3 - Applying" },
                  { key: "analyze", label: "L4 - Analyzing" },
                  { key: "evaluate", label: "L5 - Evaluating" },
                  { key: "create", label: "L6 - Creating" }
                ].map((item) => (
                  <div key={item.key} className="flex flex-col gap-2 bg-black/40 p-3 rounded-lg border border-zinc-900">
                    <div className="flex justify-between items-center text-[10px] font-medium text-zinc-300">
                      <span>{item.label}</span>
                      <span className="font-mono text-white font-bold">{bloomWeights[item.key]}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="5"
                      value={bloomWeights[item.key]}
                      onChange={(e) => handleWeightChange(item.key, e.target.value)}
                      className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-blue-650"
                    />
                  </div>
                ))}
              </div>
            </Card>

          </div>

          {/* Right Side Options & Summary (Col 4) */}
          <div className="lg:col-span-4 flex flex-col gap-6 sticky top-20">
            <Card hoverBorder={false} className="flex flex-col gap-4">
              <span className="text-white font-bold text-sm border-b border-zinc-900 pb-3 block select-none">
                Difficulty Settings
              </span>
              
              {["Easy", "Medium", "Hard"].map((lvl) => {
                const key = lvl.toLowerCase();
                return (
                  <div key={lvl} className="flex flex-col gap-1.5">
                    <div className="flex justify-between items-center text-[10px] font-medium text-zinc-400">
                      <span>{lvl} questions</span>
                      <span className="font-mono font-bold text-zinc-200">{difficulty[key]}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="10"
                      value={difficulty[key]}
                      onChange={(e) => setDifficulty(prev => ({ ...prev, [key]: parseInt(e.target.value) }))}
                      className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-blue-650"
                    />
                  </div>
                );
              })}
            </Card>

            <Card hoverBorder={false} className="flex flex-col gap-4 bg-zinc-950">
              <span className="text-white font-bold text-xs uppercase tracking-wider select-none">
                AI Generation Blueprint
              </span>
              <div className="flex flex-col gap-2.5 text-xs text-zinc-400 font-light leading-relaxed">
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-blue-500 shrink-0" />
                  <span>Parsing source files under semantic LLM guidelines</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-blue-500 shrink-0" />
                  <span>Strict alignment with Bloom's Taxonomy cognitive levels</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-500 shrink-0" />
                  <span>Auto-generates answer key and rubrics marking schemes</span>
                </div>
              </div>

              <div className="border-t border-zinc-900 pt-4 mt-2">
                <Button
                  type="submit"
                  variant="accent"
                  disabled={totalWeight !== 100 || isUploading}
                  className="w-full py-3 text-xs font-bold uppercase tracking-wider disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                >
                  Generate Question Paper
                </Button>
              </div>
            </Card>
          </div>

        </form>

        {/* Cinematic Loading Overlay */}
        {isGenerating && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex flex-col items-center justify-center p-6 text-center select-none animate-fade-in">
            <div className="w-full max-w-sm flex flex-col items-center bg-[#09090B] border border-zinc-850 p-8 rounded-2xl shadow-2xl">
              
              {/* Spinning AI Core icon */}
              <div className="relative w-16 h-16 mb-6">
                <div className="absolute inset-0 rounded-full border-4 border-zinc-800" />
                <div className="absolute inset-0 rounded-full border-4 border-blue-500 border-t-transparent animate-spin" />
                <Cpu className="w-7 h-7 text-blue-500 absolute inset-0 m-auto" />
              </div>

              <h2 className="text-white font-bold text-sm uppercase tracking-widest mb-1.5">
                AI Orchestrating Blueprint
              </h2>
              
              <div className="w-full h-1 bg-zinc-900 rounded-full overflow-hidden mt-3 mb-4">
                <div 
                  className="h-full bg-blue-500 transition-all duration-500 rounded-full" 
                  style={{ width: `${(genStep + 1) * 20}%` }}
                />
              </div>

              <p className="text-zinc-400 text-xs font-light leading-relaxed min-h-[36px] flex items-center justify-center">
                {
                  [
                    "Analyzing uploaded syllabus reference guidelines...",
                    "Drafting cognitive L1-L6 level question blueprints...",
                    "Optimizing cognitive weights & syllabus coverage...",
                    "Calibrating easy/medium/hard difficulty ratios...",
                    "Polishing final question paper rubrics and answer schemes..."
                  ][genStep]
                }
              </p>
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}
