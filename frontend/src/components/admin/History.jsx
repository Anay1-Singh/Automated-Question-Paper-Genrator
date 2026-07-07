import {
  Search,
  Eye,
  Download,
  Trash2,
  FileText,
  ChevronDown,
  Calendar,
  Filter,
} from 'lucide-react'
import { useState } from 'react'

const placeholderPapers = [
  {
    id: 1,
    title: 'Operating Systems Mid-term',
    subject: 'Operating Systems',
    date: 'Jun 28, 2026',
    totalMarks: 100,
    questions: 25,
    bloomFocus: 'Analyze',
    bloomColor: 'text-yellow-300',
  },
  {
    id: 2,
    title: 'Data Structures Final Exam',
    subject: 'Data Structures',
    date: 'Jun 15, 2026',
    totalMarks: 75,
    questions: 20,
    bloomFocus: 'Apply',
    bloomColor: 'text-green-300',
  },
  {
    id: 3,
    title: 'DBMS Unit Test 3',
    subject: 'DBMS',
    date: 'Jun 10, 2026',
    totalMarks: 25,
    questions: 10,
    bloomFocus: 'Remember',
    bloomColor: 'text-zinc-300',
  },
  {
    id: 4,
    title: 'Computer Networks Quiz',
    subject: 'Computer Networks',
    date: 'May 30, 2026',
    totalMarks: 50,
    questions: 15,
    bloomFocus: 'Understand',
    bloomColor: 'text-blue-300',
  },
  {
    id: 5,
    title: 'Software Engineering Assessment',
    subject: 'Software Engineering',
    date: 'May 22, 2026',
    totalMarks: 100,
    questions: 30,
    bloomFocus: 'Evaluate',
    bloomColor: 'text-orange-300',
  },
]

export default function HistorySection() {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold tracking-tight sm:text-2xl">Generated Papers</h1>
        <p className="text-xs text-zinc-500 mt-1">View and manage your previously generated question papers.</p>
      </div>

      {/* Search & Filters */}
      <div className="rounded-2xl border border-[#1a1a2e] bg-[#0f0f14] p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-600" />
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search papers..."
              className="w-full rounded-xl border border-[#27272A] bg-[#09090B] py-2.5 pl-10 pr-4 text-sm text-white outline-none placeholder:text-zinc-700 focus:border-indigo-500"
            />
          </div>
          <div className="flex gap-2">
            <button className="inline-flex items-center gap-2 rounded-xl border border-[#27272A] bg-[#09090B] px-3 py-2 text-xs font-semibold text-zinc-400 hover:border-zinc-600 hover:text-zinc-300 transition-colors">
              <Calendar className="h-3.5 w-3.5" />
              Date Range
            </button>
            <div className="relative">
              <select className="appearance-none rounded-xl border border-[#27272A] bg-[#09090B] px-3 py-2 pr-8 text-xs font-semibold text-zinc-400 outline-none focus:border-indigo-500">
                <option>All Subjects</option>
                <option>Operating Systems</option>
                <option>Data Structures</option>
                <option>DBMS</option>
                <option>Computer Networks</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-[#1a1a2e] bg-[#0f0f14] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="border-b border-[#1a1a2e]">
                {['Paper Title', 'Subject', 'Date', 'Marks', 'Questions', 'Bloom Focus', 'Actions'].map(col => (
                  <th key={col} className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-zinc-600">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {placeholderPapers.map((paper, idx) => (
                <tr
                  key={paper.id}
                  className={`border-b border-[#1a1a2e]/50 transition-colors hover:bg-indigo-500/5 ${idx === placeholderPapers.length - 1 ? 'border-b-0' : ''}`}
                >
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10">
                        <FileText className="h-3.5 w-3.5 text-indigo-400" />
                      </div>
                      <span className="text-xs font-bold text-white">{paper.title}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-xs text-zinc-400">{paper.subject}</td>
                  <td className="px-4 py-3.5 text-xs text-zinc-500">{paper.date}</td>
                  <td className="px-4 py-3.5 text-xs font-bold text-zinc-300">{paper.totalMarks}</td>
                  <td className="px-4 py-3.5 text-xs text-zinc-400">{paper.questions}</td>
                  <td className="px-4 py-3.5">
                    <span className={`text-xs font-bold ${paper.bloomColor}`}>{paper.bloomFocus}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1.5">
                      <button className="rounded-lg p-1.5 text-zinc-500 transition-colors hover:bg-indigo-500/10 hover:text-indigo-400" title="View">
                        <Eye className="h-3.5 w-3.5" />
                      </button>
                      <button className="rounded-lg p-1.5 text-zinc-500 transition-colors hover:bg-indigo-500/10 hover:text-indigo-400" title="Download">
                        <Download className="h-3.5 w-3.5" />
                      </button>
                      <button className="rounded-lg p-1.5 text-zinc-500 transition-colors hover:bg-red-500/10 hover:text-red-400" title="Delete">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
