import { useState } from 'react'
import {
  Search,
  Settings,
  HelpCircle,
  FileText,
  Sliders,
  FileDown,
  Trash2,
  Edit2,
  Check,
  Plus,
  RotateCcw,
  Sparkles,
  ChevronDown
} from 'lucide-react'

export default function DashboardPreview() {
  const [selectedDifficulty, setSelectedDifficulty] = useState('balanced')

  const initialQuestions = [
    {
      id: 1,
      number: 'Q1',
      text: 'Analyze the impact of self-attention mechanics on transformer training latency compared to recurrent network architectures.',
      marks: 10,
      bloom: 'Analyze',
      bloomColor: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
      difficulty: 'Hard',
      diffColor: 'bg-red-500/10 text-red-400 border-red-500/20'
    },
    {
      id: 2,
      number: 'Q2',
      text: 'Design a high-throughput, fault-tolerant system architecture for real-time document analysis using Kafka and Apache Spark.',
      marks: 15,
      bloom: 'Create',
      bloomColor: 'bg-red-500/10 text-red-400 border-red-500/20',
      difficulty: 'Hard',
      diffColor: 'bg-red-500/10 text-red-400 border-red-500/20'
    },
    {
      id: 3,
      number: 'Q3',
      text: 'Explain the mathematical formulation of backpropagation through time (BPTT) and identify how it leads to vanishing gradients.',
      marks: 8,
      bloom: 'Understand',
      bloomColor: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      difficulty: 'Medium',
      diffColor: 'bg-orange-500/10 text-orange-400 border-orange-500/20'
    },
    {
      id: 4,
      number: 'Q4',
      text: 'Implement a custom regularization function in PyTorch to penalize weights that deviate from a normal distribution.',
      marks: 12,
      bloom: 'Apply',
      bloomColor: 'bg-green-500/10 text-green-400 border-green-500/20',
      difficulty: 'Medium',
      diffColor: 'bg-orange-500/10 text-orange-400 border-orange-500/20'
    }
  ]

  const [questions, setQuestions] = useState(initialQuestions)

  const handleDelete = (id) => {
    setQuestions(questions.filter(q => q.id !== id))
  }

  const bloomDistribution = [
    { level: 'Create', value: 15, target: 15, color: 'bg-red-500' },
    { level: 'Evaluate', value: 15, target: 15, color: 'bg-orange-500' },
    { level: 'Analyze', value: 20, target: 20, color: 'bg-yellow-500' },
    { level: 'Apply', value: 25, target: 30, color: 'bg-green-500' },
    { level: 'Understand', value: 15, target: 10, color: 'bg-blue-500' },
    { level: 'Remember', value: 10, target: 10, color: 'bg-zinc-500' }
  ]

  const activityLogs = [
    { action: 'Syllabus parsed successfully', time: '1m ago', status: 'success' },
    { action: 'LaTeX mathematical formulas verified', time: '3m ago', status: 'success' },
    { action: 'Bloom taxonomy validation: Level "Create" matches syllabus target', time: '5m ago', status: 'success' },
    { action: 'Generated 45 candidate questions for review', time: '8m ago', status: 'info' }
  ]

  return (
    <section id="showcase" className="bg-[#09090B] py-24 md:py-32 px-6 md:px-8 border-b border-[#27272A]/40 relative">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-white mb-4 tracking-tight">
            Take Control of the Assessment Process
          </h2>
          <p className="text-[#A1A1AA] text-lg">
            Review questions, calibrate difficulty ratios, map cognitive weights, and export directly to your university LMS.
          </p>
        </div>

        {/* Dashboard Showcase Frame */}
        <div className="w-full bg-[#18181B] border border-[#27272A] rounded-2xl overflow-hidden shadow-2xl relative">
          
          {/* Top Address Bar / Browser Frame */}
          <div className="bg-[#09090B] border-b border-[#27272A] px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 rounded-full bg-[#FF5F56] opacity-90" />
              <div className="w-3.5 h-3.5 rounded-full bg-[#FFBD2E] opacity-90" />
              <div className="w-3.5 h-3.5 rounded-full bg-[#27C93F] opacity-90" />
            </div>
            
            <div className="w-full max-w-md mx-4">
              <div className="bg-[#18181B] border border-[#27272A]/85 rounded-lg px-3 py-1 flex items-center gap-2 text-zinc-500 text-xs font-mono select-none">
                <Search className="w-3.5 h-3.5 text-zinc-600" />
                <span className="text-[#A1A1AA]">app.papermind.ai/paper/cst-402-final</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-1 text-zinc-400 hover:text-white rounded-lg hover:bg-[#18181B] cursor-pointer transition-colors">
                <HelpCircle className="w-4 h-4" />
              </div>
              <div className="p-1 text-zinc-400 hover:text-white rounded-lg hover:bg-[#18181B] cursor-pointer transition-colors">
                <Settings className="w-4 h-4" />
              </div>
              <div className="w-7 h-7 rounded-full bg-blue-600 border border-blue-500/20 text-white font-bold text-xs flex items-center justify-center">
                PM
              </div>
            </div>
          </div>

          {/* Sidebar & Dashboard Body Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[640px]">
            
            {/* Sidebar Column */}
            <aside className="lg:col-span-2 bg-[#09090B]/50 border-r border-[#27272A] p-4 flex flex-col gap-6 text-left">
              <div className="px-2 py-1">
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">Academic Portal</span>
              </div>

              <div className="flex flex-col gap-1">
                <button className="flex items-center gap-2.5 px-3 py-2 text-sm font-semibold rounded-lg bg-blue-500/10 text-blue-500 text-left border border-blue-500/15">
                  <FileText className="w-4 h-4" />
                  Question Papers
                </button>
                <button className="flex items-center gap-2.5 px-3 py-2 text-sm font-medium rounded-lg text-[#A1A1AA] hover:text-white hover:bg-[#18181B] text-left transition-colors">
                  <Sliders className="w-4 h-4" />
                  Templates
                </button>
              </div>

              <div className="h-px bg-[#27272A]/70" />

              <div className="flex flex-col gap-1.5">
                <span className="px-3 text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-1">Workspace</span>
                <span className="px-3 py-1.5 text-xs text-[#A1A1AA] truncate block">Uploaded documents</span>
                <span className="px-3 py-1.5 text-xs text-[#A1A1AA] truncate block">Generated papers</span>
                <span className="px-3 py-1.5 text-xs text-[#A1A1AA] truncate block">Question bank</span>
              </div>
            </aside>

            {/* Dashboard Content Container */}
            <main className="lg:col-span-10 p-6 flex flex-col gap-6 bg-[#18181B] text-left">
              
              {/* Paper Meta Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-5 border-b border-[#27272A]">
                <div>
                  <div className="flex items-center gap-2.5 mb-1.5">
                    <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">AI-Generated Question Paper</h1>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded border border-emerald-500/25 bg-emerald-500/5 text-emerald-400 text-[10px] font-semibold uppercase">
                      <span className="w-1 h-1 bg-emerald-500 rounded-full" />
                      Bloom Checked
                    </span>
                  </div>
                  <p className="text-xs text-zinc-500">Built from authenticated workspace documents and teacher configuration</p>
                </div>
                
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-[#A1A1AA] hover:text-white border border-[#27272A] bg-[#09090B] px-3.5 py-2 rounded-lg transition-colors">
                    <RotateCcw className="w-3.5 h-3.5" />
                    Regenerate
                  </button>
                  <button className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 px-3.5 py-2 rounded-lg shadow-sm transition-colors">
                    <FileDown className="w-3.5 h-3.5" />
                    Export PDF
                  </button>
                </div>
              </div>

              {/* Core Panels Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Left Side: Question List (Col span 2) */}
                <div className="lg:col-span-2 flex flex-col gap-4">
                  <div className="flex justify-between items-center pb-2 border-b border-[#27272A]/70">
                    <span className="text-xs font-bold text-white uppercase tracking-wider">Active Questions ({questions.length})</span>
                    <button className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-500 hover:text-blue-400 transition-colors">
                      <Plus className="w-3.5 h-3.5" />
                      Add Custom Question
                    </button>
                  </div>

                  <div className="flex flex-col gap-3">
                    {questions.map((q) => (
                      <div
                        key={q.id}
                        className="bg-[#09090B]/60 border border-[#27272A] rounded-lg p-4 hover:border-zinc-700 transition-all duration-200 flex gap-4"
                      >
                        <div className="flex flex-col items-center">
                          <span className="w-8 h-8 rounded bg-[#18181B] border border-[#27272A] flex items-center justify-center text-xs font-mono font-bold text-blue-500">
                            {q.number}
                          </span>
                          <span className="text-[10px] text-zinc-500 font-mono mt-2 font-bold whitespace-nowrap">{q.marks} Pts</span>
                        </div>
                        
                        <div className="flex-grow flex flex-col gap-2.5">
                          <p className="text-xs text-zinc-300 leading-relaxed font-sans">{q.text}</p>
                          
                          <div className="flex items-center gap-2">
                            <span className={`text-[9px] font-bold border px-2 py-0.5 rounded ${q.bloomColor}`}>
                              Bloom: {q.bloom}
                            </span>
                            <span className={`text-[9px] font-bold border px-2 py-0.5 rounded ${q.diffColor}`}>
                              Diff: {q.difficulty}
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-col justify-between items-end gap-2 shrink-0">
                          <button className="p-1.5 text-zinc-500 hover:text-white hover:bg-[#18181B] rounded transition-colors">
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(q.id)}
                            className="p-1.5 text-zinc-500 hover:text-red-400 hover:bg-[#18181B] rounded transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Side: Calibration & Analytics (Col span 1) */}
                <div className="flex flex-col gap-6">
                  
                  {/* Bloom Calibration Progress */}
                  <div className="bg-[#09090B]/40 border border-[#27272A] rounded-xl p-5">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-xs font-bold text-white uppercase tracking-wider">Bloom Taxonomy Alignment</span>
                      <Sliders className="w-3.5 h-3.5 text-blue-500" />
                    </div>
                    
                    <div className="flex flex-col gap-3.5">
                      {bloomDistribution.map((item) => (
                        <div key={item.level} className="space-y-1">
                          <div className="flex justify-between items-center text-[11px] font-semibold text-zinc-300">
                            <span>{item.level}</span>
                            <span className="text-zinc-500">
                              <span className="text-white">{item.value}%</span> / {item.target}%
                            </span>
                          </div>
                          <div className="w-full bg-[#18181B] h-1.5 rounded-full overflow-hidden relative">
                            {/* Target ticks indicator */}
                            <div className="absolute top-0 bottom-0 w-px bg-zinc-600 z-10" style={{ left: `${item.target}%` }} title="Target line" />
                            <div className={`${item.color} h-full rounded-full`} style={{ width: `${item.value}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Calibration Configuration Panel */}
                  <div className="bg-[#09090B]/40 border border-[#27272A] rounded-xl p-5">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-xs font-bold text-white uppercase tracking-wider">Calibration Parameters</span>
                      <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-2">Cognitive Blueprint</label>
                        <div className="bg-[#18181B] border border-[#27272A] px-3 py-2 rounded-lg flex items-center justify-between text-xs text-white cursor-pointer hover:border-zinc-700 transition-colors">
                          <span>Rigorous Engineering Standard</span>
                          <ChevronDown className="w-4 h-4 text-zinc-500" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-2">Difficulty Balancing</label>
                        <div className="grid grid-cols-3 gap-2 bg-[#18181B] p-1 border border-[#27272A] rounded-lg">
                          {['easy', 'balanced', 'hard'].map((opt) => (
                            <button
                              key={opt}
                              onClick={() => setSelectedDifficulty(opt)}
                              className={`text-[10px] font-bold capitalize py-1.5 rounded-md transition-all ${
                                selectedDifficulty === opt
                                  ? 'bg-blue-600 text-white shadow'
                                  : 'text-zinc-400 hover:text-white'
                              }`}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Realtime Process Logs */}
                  <div className="bg-[#09090B]/40 border border-[#27272A] rounded-xl p-5">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-xs font-bold text-white uppercase tracking-wider">Validation Engine Logs</span>
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    </div>
                    <div className="space-y-2">
                      {activityLogs.map((log, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-[10px] font-mono leading-relaxed text-zinc-400">
                          <Check className="w-3 h-3 text-emerald-400 shrink-0 mt-0.5" />
                          <div className="flex-grow">
                            <span>{log.action}</span>
                            <span className="block text-[8px] text-zinc-600 mt-0.5">{log.time}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

              </div>
            </main>

          </div>
        </div>

      </div>
    </section>
  )
}
