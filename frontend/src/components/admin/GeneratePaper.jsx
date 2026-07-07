import {
  FileText,
  Sparkles,
  ChevronDown,
  CheckSquare,
  Sliders,
  BookOpen,
  Brain,
  Lightbulb,
  Search,
  Layers,
  PenTool,
  ToggleLeft,
  ListChecks,
} from 'lucide-react'
import { useState } from 'react'

const bloomLevels = [
  { key: 'remember', label: 'Remember', color: 'bg-zinc-500', text: 'text-zinc-300' },
  { key: 'understand', label: 'Understand', color: 'bg-blue-500', text: 'text-blue-300' },
  { key: 'apply', label: 'Apply', color: 'bg-green-500', text: 'text-green-300' },
  { key: 'analyze', label: 'Analyze', color: 'bg-yellow-500', text: 'text-yellow-300' },
  { key: 'evaluate', label: 'Evaluate', color: 'bg-orange-500', text: 'text-orange-300' },
  { key: 'create', label: 'Create', color: 'bg-purple-500', text: 'text-purple-300' },
]

const questionTypes = [
  { key: 'mcq', label: 'MCQ', icon: ListChecks },
  { key: 'short', label: 'Short Answer', icon: PenTool },
  { key: 'long', label: 'Long Answer', icon: FileText },
  { key: 'fill', label: 'Fill in the Blanks', icon: ToggleLeft },
  { key: 'tf', label: 'True / False', icon: CheckSquare },
]

const marksOptions = [25, 50, 75, 100]

export default function GeneratePaper() {
  const [selectedDoc, setSelectedDoc] = useState('')
  const [paperTitle, setPaperTitle] = useState('')
  const [subject, setSubject] = useState('')
  const [totalMarks, setTotalMarks] = useState(100)
  const [numQuestions, setNumQuestions] = useState(25)
  const [difficulty, setDifficulty] = useState({ easy: 30, medium: 50, hard: 20 })
  const [bloom, setBloom] = useState({ remember: 20, understand: 20, apply: 20, analyze: 15, evaluate: 15, create: 10 })
  const [selectedTypes, setSelectedTypes] = useState(['mcq', 'short', 'long'])

  const handleDifficultyChange = (key, value) => {
    const num = Math.max(0, Math.min(100, parseInt(value) || 0))
    setDifficulty(prev => ({ ...prev, [key]: num }))
  }

  const handleBloomChange = (key, value) => {
    const num = Math.max(0, Math.min(100, parseInt(value) || 0))
    setBloom(prev => ({ ...prev, [key]: num }))
  }

  const toggleType = (key) => {
    setSelectedTypes(prev =>
      prev.includes(key) ? prev.filter(t => t !== key) : [...prev, key]
    )
  }

  const diffTotal = difficulty.easy + difficulty.medium + difficulty.hard
  const bloomTotal = Object.values(bloom).reduce((a, b) => a + b, 0)

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-xl font-bold tracking-tight sm:text-2xl">Generate Question Paper</h1>
        <p className="text-xs text-zinc-500">Configure your AI-powered question paper using Bloom's Taxonomy.</p>
      </div>

      {/* Form */}
      <div className="rounded-2xl border border-[#1a1a2e] bg-[#0f0f14] p-5 space-y-6">

        {/* Document & Title Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 block text-xs font-bold text-zinc-300">Select Document</label>
            <div className="relative">
              <select
                value={selectedDoc}
                onChange={e => setSelectedDoc(e.target.value)}
                className="w-full appearance-none rounded-xl border border-[#27272A] bg-[#09090B] px-3 py-3 pr-10 text-sm text-white outline-none transition-colors focus:border-indigo-500"
              >
                <option value="">Choose a document...</option>
                <option value="os-unit2">Operating Systems Unit 2</option>
                <option value="ds-linked-list">Data Structures - Linked Lists</option>
                <option value="dbms-normalization">DBMS Normalization Notes</option>
                <option value="cn-tcp-ip">Computer Networks - TCP/IP</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-bold text-zinc-300">Paper Title</label>
            <input
              value={paperTitle}
              onChange={e => setPaperTitle(e.target.value)}
              className="w-full rounded-xl border border-[#27272A] bg-[#09090B] px-3 py-3 text-sm text-white outline-none transition-colors placeholder:text-zinc-700 focus:border-indigo-500"
              placeholder="Mid-Term Examination 2026"
            />
          </div>
        </div>

        {/* Subject & Marks Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 block text-xs font-bold text-zinc-300">Subject</label>
            <input
              value={subject}
              onChange={e => setSubject(e.target.value)}
              className="w-full rounded-xl border border-[#27272A] bg-[#09090B] px-3 py-3 text-sm text-white outline-none transition-colors placeholder:text-zinc-700 focus:border-indigo-500"
              placeholder="Computer Science"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-bold text-zinc-300">Total Marks</label>
            <div className="flex gap-2">
              {marksOptions.map(m => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setTotalMarks(m)}
                  className={`flex-1 rounded-xl border py-2.5 text-xs font-bold transition-all duration-200 ${
                    totalMarks === m
                      ? 'border-indigo-500/40 bg-indigo-500/15 text-indigo-400'
                      : 'border-[#27272A] bg-[#09090B] text-zinc-500 hover:border-zinc-600 hover:text-zinc-300'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Number of Questions */}
        <div className="max-w-xs">
          <label className="mb-1.5 block text-xs font-bold text-zinc-300">Number of Questions</label>
          <input
            type="number"
            min={1}
            max={200}
            value={numQuestions}
            onChange={e => setNumQuestions(parseInt(e.target.value) || 0)}
            className="w-full rounded-xl border border-[#27272A] bg-[#09090B] px-3 py-3 text-sm text-white outline-none transition-colors placeholder:text-zinc-700 focus:border-indigo-500"
          />
        </div>

        {/* Difficulty Distribution */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Sliders className="h-4 w-4 text-indigo-400" />
            <label className="text-xs font-bold text-zinc-300">Difficulty Distribution</label>
            <span className={`ml-auto text-[10px] font-bold ${diffTotal === 100 ? 'text-emerald-400' : 'text-red-400'}`}>
              {diffTotal}%
            </span>
          </div>
          <div className="grid grid-cols-3 gap-3 mb-3">
            {[
              { key: 'easy', label: 'Easy', color: 'text-emerald-400', bar: 'bg-emerald-500' },
              { key: 'medium', label: 'Medium', color: 'text-yellow-400', bar: 'bg-yellow-500' },
              { key: 'hard', label: 'Hard', color: 'text-red-400', bar: 'bg-red-500' },
            ].map(d => (
              <div key={d.key} className="space-y-1.5">
                <label className={`text-[10px] font-bold uppercase tracking-wider ${d.color}`}>{d.label}</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={difficulty[d.key]}
                    onChange={e => handleDifficultyChange(d.key, e.target.value)}
                    className="w-full rounded-lg border border-[#27272A] bg-[#09090B] px-2 py-2 text-center text-xs font-bold text-white outline-none focus:border-indigo-500"
                  />
                  <span className="text-[10px] text-zinc-500">%</span>
                </div>
              </div>
            ))}
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-[#202033] flex">
            <div className="bg-emerald-500 transition-all duration-300" style={{ width: `${difficulty.easy}%` }} />
            <div className="bg-yellow-500 transition-all duration-300" style={{ width: `${difficulty.medium}%` }} />
            <div className="bg-red-500 transition-all duration-300" style={{ width: `${difficulty.hard}%` }} />
          </div>
        </div>

        {/* Bloom's Taxonomy Distribution */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Brain className="h-4 w-4 text-indigo-400" />
            <label className="text-xs font-bold text-zinc-300">Bloom's Taxonomy Distribution</label>
            <span className={`ml-auto text-[10px] font-bold ${bloomTotal === 100 ? 'text-emerald-400' : 'text-red-400'}`}>
              {bloomTotal}%
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {bloomLevels.map(b => (
              <div key={b.key} className="space-y-1.5">
                <label className={`text-[10px] font-bold uppercase tracking-wider ${b.text}`}>{b.label}</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={bloom[b.key]}
                  onChange={e => handleBloomChange(b.key, e.target.value)}
                  className="w-full rounded-lg border border-[#27272A] bg-[#09090B] px-2 py-2 text-center text-xs font-bold text-white outline-none focus:border-indigo-500"
                />
                <div className="h-1.5 overflow-hidden rounded-full bg-[#202033]">
                  <div className={`h-full ${b.color} transition-all duration-300 rounded-full`} style={{ width: `${bloom[b.key]}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Question Types */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Layers className="h-4 w-4 text-indigo-400" />
            <label className="text-xs font-bold text-zinc-300">Question Types</label>
          </div>
          <div className="flex flex-wrap gap-2">
            {questionTypes.map(qt => {
              const Icon = qt.icon
              const isSelected = selectedTypes.includes(qt.key)
              return (
                <button
                  key={qt.key}
                  type="button"
                  onClick={() => toggleType(qt.key)}
                  className={`inline-flex items-center gap-2 rounded-xl border px-3.5 py-2.5 text-xs font-bold transition-all duration-200 ${
                    isSelected
                      ? 'border-indigo-500/40 bg-indigo-500/15 text-indigo-400'
                      : 'border-[#27272A] bg-[#09090B] text-zinc-500 hover:border-zinc-600 hover:text-zinc-300'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {qt.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Generate Button */}
        <button
          type="button"
          className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-900/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-indigo-500"
        >
          <Sparkles className="h-4 w-4" />
          Generate Question Paper
        </button>
      </div>

      {/* Paper Preview Placeholder */}
      <div className="rounded-2xl border border-dashed border-[#34344a] bg-[#0b0b10] p-6">
        <h3 className="text-sm font-bold text-zinc-400 mb-4">Paper Preview</h3>
        <div className="space-y-4 opacity-40">
          {/* Skeleton title */}
          <div className="text-center space-y-2 pb-4 border-b border-[#27272A]">
            <div className="mx-auto h-5 w-64 rounded bg-[#1a1a2e]" />
            <div className="mx-auto h-3 w-40 rounded bg-[#1a1a2e]" />
            <div className="flex justify-center gap-6 mt-3">
              <div className="h-3 w-24 rounded bg-[#1a1a2e]" />
              <div className="h-3 w-24 rounded bg-[#1a1a2e]" />
            </div>
          </div>
          {/* Skeleton sections */}
          {[1, 2, 3].map(sec => (
            <div key={sec} className="space-y-2">
              <div className="h-4 w-36 rounded bg-[#1a1a2e]" />
              {[1, 2, 3].map(q => (
                <div key={q} className="ml-4 flex items-start gap-2">
                  <div className="mt-1 h-3 w-3 rounded-sm bg-[#1a1a2e] shrink-0" />
                  <div className="h-3 w-full rounded bg-[#1a1a2e]" style={{ maxWidth: `${70 + Math.random() * 30}%` }} />
                </div>
              ))}
            </div>
          ))}
        </div>
        <p className="text-center text-xs text-zinc-600 mt-6">Your generated question paper will appear here</p>
      </div>
    </div>
  )
}
