import {
  AlertCircle,
  Calendar,
  ChevronDown,
  Download,
  Eye,
  FileDown,
  FileText,
  KeyRound,
  Loader2,
  Pencil,
  RotateCcw,
  Search,
  Trash2,
} from 'lucide-react'
import { useMemo, useState } from 'react'

function formatDate(value) {
  if (!value) return 'Now'
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(value))
}

function getBloomFocus(paper) {
  const counts = paper.questions?.reduce((acc, question) => {
    acc[question.bloom_level] = (acc[question.bloom_level] || 0) + 1
    return acc
  }, {}) || {}
  const [level] = Object.entries(counts).sort((a, b) => b[1] - a[1])[0] || ['remember']
  return level.replace('_', ' ')
}

export default function HistorySection({
  papers = [],
  loading = false,
  error = '',
  onPreviewPaper,
  onViewAnswers,
  onDownloadPaper,
  onDownloadAnswers,
  onEditPaper,
  onDeletePaper,
}) {
  const [searchQuery, setSearchQuery] = useState('')
  const [subjectFilter, setSubjectFilter] = useState('all')

  const subjects = useMemo(
    () => [...new Set(papers.map((paper) => paper.subject).filter(Boolean))],
    [papers],
  )

  const filteredPapers = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    return papers.filter((paper) => {
      const matchesQuery = !query || [
        paper.title,
        paper.subject,
        paper.exam_name,
        paper.document_title,
      ].some((value) => String(value || '').toLowerCase().includes(query))
      const matchesSubject = subjectFilter === 'all' || paper.subject === subjectFilter
      return matchesQuery && matchesSubject
    })
  }, [papers, searchQuery, subjectFilter])

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight sm:text-2xl">Generated Papers</h1>
        <p className="mt-1 text-xs text-zinc-500">View and manage generated question papers.</p>
      </div>

      <div className="rounded-2xl border border-[#1a1a2e] bg-[#0f0f14] p-4">
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-600" />
            <input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search papers..."
              className="w-full rounded-xl border border-[#27272A] bg-[#09090B] py-2.5 pl-10 pr-4 text-sm text-white outline-none placeholder:text-zinc-700 focus:border-indigo-500"
            />
          </div>
          <div className="flex gap-2">
            <button className="inline-flex items-center gap-2 rounded-xl border border-[#27272A] bg-[#09090B] px-3 py-2 text-xs font-semibold text-zinc-400 transition-colors hover:border-zinc-600 hover:text-zinc-300">
              <Calendar className="h-3.5 w-3.5" />
              Newest First
            </button>
            <div className="relative">
              <select
                value={subjectFilter}
                onChange={(event) => setSubjectFilter(event.target.value)}
                className="appearance-none rounded-xl border border-[#27272A] bg-[#09090B] px-3 py-2 pr-8 text-xs font-semibold text-zinc-400 outline-none focus:border-indigo-500"
              >
                <option value="all">All Subjects</option>
                {subjects.map((subject) => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-600" />
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="flex items-start gap-2 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-300">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-[#1a1a2e] bg-[#0f0f14]">
        {loading ? (
          <div className="flex items-center justify-center gap-2 py-16 text-xs font-bold text-zinc-500">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading papers...
          </div>
        ) : filteredPapers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-500/10">
              <FileText className="h-5 w-5 text-indigo-400/60" />
            </div>
            <p className="text-xs font-semibold text-zinc-500">No generated papers found</p>
            <p className="mt-1 text-[10px] text-zinc-600">Generate a paper from a processed document to see it here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[920px]">
              <thead>
                <tr className="border-b border-[#1a1a2e]">
                  {['Paper Title', 'Subject', 'Date', 'Marks', 'Questions', 'Bloom Focus', 'Actions'].map((col) => (
                    <th key={col} className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-zinc-600">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredPapers.map((paper, index) => (
                  <tr
                    key={paper.id}
                    className={`border-b border-[#1a1a2e]/50 transition-colors hover:bg-indigo-500/5 ${index === filteredPapers.length - 1 ? 'border-b-0' : ''}`}
                  >
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10">
                          <FileText className="h-3.5 w-3.5 text-indigo-400" />
                        </div>
                        <div className="min-w-0">
                          <span className="block truncate text-xs font-bold text-white">{paper.title}</span>
                          <span className="block truncate text-[10px] text-zinc-600">{paper.document_title}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-xs text-zinc-400">{paper.subject}</td>
                    <td className="px-4 py-3.5 text-xs text-zinc-500">{formatDate(paper.generated_at || paper.created_at)}</td>
                    <td className="px-4 py-3.5 text-xs font-bold text-zinc-300">{paper.total_marks}</td>
                    <td className="px-4 py-3.5 text-xs text-zinc-400">{paper.questions?.length || paper.total_questions}</td>
                    <td className="px-4 py-3.5 text-xs font-bold capitalize text-indigo-300">{getBloomFocus(paper)}</td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => onPreviewPaper?.(paper)}
                          className="rounded-lg p-1.5 text-zinc-500 transition-colors hover:bg-indigo-500/10 hover:text-indigo-400"
                          title="Preview"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => onViewAnswers?.(paper)}
                          className="rounded-lg p-1.5 text-zinc-500 transition-colors hover:bg-amber-500/10 hover:text-amber-400"
                          title="View answers"
                        >
                          <KeyRound className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => onDownloadPaper?.(paper)}
                          className="rounded-lg p-1.5 text-zinc-500 transition-colors hover:bg-emerald-500/10 hover:text-emerald-400"
                          title="Download question paper PDF"
                        >
                          <Download className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => onDownloadAnswers?.(paper)}
                          className="rounded-lg p-1.5 text-zinc-500 transition-colors hover:bg-amber-500/10 hover:text-amber-400"
                          title="Download answer key PDF"
                        >
                          <FileDown className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => onEditPaper?.(paper)}
                          className="rounded-lg p-1.5 text-zinc-500 transition-colors hover:bg-blue-500/10 hover:text-blue-400"
                          title="Edit"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => onEditPaper?.(paper)}
                          className="rounded-lg p-1.5 text-zinc-500 transition-colors hover:bg-violet-500/10 hover:text-violet-400"
                          title="Regenerate individual questions"
                        >
                          <RotateCcw className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => onDeletePaper?.(paper)}
                          className="rounded-lg p-1.5 text-zinc-500 transition-colors hover:bg-red-500/10 hover:text-red-400"
                          title="Delete"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
