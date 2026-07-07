import {
  Search,
  ChevronDown,
  Plus,
  Trash2,
  BookOpen,
  Brain,
  Gauge,
  Layers,
  Filter,
} from 'lucide-react'
import { useState } from 'react'

const bloomBadgeColors = {
  Remember: 'text-zinc-300 bg-zinc-500/15 border-zinc-500/20',
  Understand: 'text-blue-300 bg-blue-500/15 border-blue-500/20',
  Apply: 'text-green-300 bg-green-500/15 border-green-500/20',
  Analyze: 'text-yellow-300 bg-yellow-500/15 border-yellow-500/20',
  Evaluate: 'text-orange-300 bg-orange-500/15 border-orange-500/20',
  Create: 'text-purple-300 bg-purple-500/15 border-purple-500/20',
}

const difficultyBadgeColors = {
  Easy: 'text-emerald-300 bg-emerald-500/15 border-emerald-500/20',
  Medium: 'text-yellow-300 bg-yellow-500/15 border-yellow-500/20',
  Hard: 'text-red-300 bg-red-500/15 border-red-500/20',
}

const placeholderQuestions = [
  {
    id: 1,
    text: 'Explain the concept of process scheduling in operating systems. What are the key differences between preemptive and non-preemptive scheduling?',
    bloom: 'Understand',
    difficulty: 'Medium',
    subject: 'Operating Systems',
    type: 'Long Answer',
  },
  {
    id: 2,
    text: 'Which of the following is NOT a valid page replacement algorithm?\n(a) FIFO  (b) LRU  (c) LIFO  (d) Optimal',
    bloom: 'Remember',
    difficulty: 'Easy',
    subject: 'Operating Systems',
    type: 'MCQ',
  },
  {
    id: 3,
    text: 'Apply Dijkstra\'s algorithm to find the shortest path in the given weighted graph from node A to node F.',
    bloom: 'Apply',
    difficulty: 'Hard',
    subject: 'Data Structures',
    type: 'Long Answer',
  },
  {
    id: 4,
    text: 'Analyze the time complexity of merge sort and compare it with quicksort in worst-case scenarios.',
    bloom: 'Analyze',
    difficulty: 'Hard',
    subject: 'Data Structures',
    type: 'Short Answer',
  },
  {
    id: 5,
    text: 'Define normalization in database management systems. List and briefly describe the first three normal forms.',
    bloom: 'Remember',
    difficulty: 'Easy',
    subject: 'DBMS',
    type: 'Short Answer',
  },
  {
    id: 6,
    text: 'Evaluate the trade-offs between using TCP and UDP for real-time video streaming applications.',
    bloom: 'Evaluate',
    difficulty: 'Medium',
    subject: 'Computer Networks',
    type: 'Long Answer',
  },
]

function FilterDropdown({ label, options }) {
  return (
    <div className="relative">
      <select className="appearance-none rounded-lg border border-[#27272A] bg-[#09090B] px-3 py-2 pr-8 text-xs font-semibold text-zinc-400 outline-none transition-colors focus:border-indigo-500">
        <option>{label}</option>
        {options.map(o => <option key={o}>{o}</option>)}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-600" />
    </div>
  )
}

export default function QuestionBank() {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight sm:text-2xl">Question Bank</h1>
          <p className="text-xs text-zinc-500 mt-1">Browse, search, and manage your question collection.</p>
        </div>
        <span className="text-xs font-bold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1.5 rounded-full">
          Total Questions: {placeholderQuestions.length}
        </span>
      </div>

      {/* Search & Filters */}
      <div className="rounded-2xl border border-[#1a1a2e] bg-[#0f0f14] p-4 space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-600" />
          <input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search questions..."
            className="w-full rounded-xl border border-[#27272A] bg-[#09090B] py-2.5 pl-10 pr-4 text-sm text-white outline-none placeholder:text-zinc-700 focus:border-indigo-500"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Filter className="h-3.5 w-3.5 text-zinc-600" />
          <FilterDropdown label="Subject" options={['Operating Systems', 'Data Structures', 'DBMS', 'Computer Networks']} />
          <FilterDropdown label="Bloom Level" options={['Remember', 'Understand', 'Apply', 'Analyze', 'Evaluate', 'Create']} />
          <FilterDropdown label="Difficulty" options={['Easy', 'Medium', 'Hard']} />
          <FilterDropdown label="Question Type" options={['MCQ', 'Short Answer', 'Long Answer', 'Fill in the Blanks', 'True/False']} />
        </div>
      </div>

      {/* Question Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {placeholderQuestions.map(q => (
          <article
            key={q.id}
            className="rounded-xl border border-[#1f1f2f] bg-[#0b0b10] p-4 transition-colors hover:border-indigo-500/25 flex flex-col gap-3"
          >
            {/* Question text */}
            <p className="text-xs leading-relaxed text-zinc-300 whitespace-pre-line">{q.text}</p>

            {/* Badges */}
            <div className="flex flex-wrap gap-1.5">
              <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${bloomBadgeColors[q.bloom]}`}>
                <Brain className="h-2.5 w-2.5" />
                {q.bloom}
              </span>
              <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${difficultyBadgeColors[q.difficulty]}`}>
                <Gauge className="h-2.5 w-2.5" />
                {q.difficulty}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-[#27272A] bg-[#111116] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                <BookOpen className="h-2.5 w-2.5" />
                {q.subject}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-[#27272A] bg-[#111116] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                <Layers className="h-2.5 w-2.5" />
                {q.type}
              </span>
            </div>

            {/* Actions */}
            <div className="flex gap-2 mt-auto pt-1">
              <button className="inline-flex items-center gap-1.5 rounded-lg border border-indigo-500/20 bg-indigo-500/10 px-3 py-1.5 text-[10px] font-bold text-indigo-300 transition-colors hover:bg-indigo-500/20">
                <Plus className="h-3 w-3" />
                Add to Paper
              </button>
              <button className="inline-flex items-center gap-1.5 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-1.5 text-[10px] font-bold text-red-300 transition-colors hover:bg-red-500/15">
                <Trash2 className="h-3 w-3" />
                Delete
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
