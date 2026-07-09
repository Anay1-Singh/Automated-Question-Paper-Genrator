import {
  BookOpen,
  Brain,
  ChevronDown,
  Download,
  Eye,
  Filter,
  Gauge,
  FileDown,
  KeyRound,
  Layers,
  Pencil,
  RotateCcw,
  Search,
  Trash2,
} from 'lucide-react'
import { useMemo, useState } from 'react'

const bloomBadgeColors = {
  remember: 'text-zinc-300 bg-zinc-500/15 border-zinc-500/20',
  understand: 'text-blue-300 bg-blue-500/15 border-blue-500/20',
  apply: 'text-green-300 bg-green-500/15 border-green-500/20',
  analyze: 'text-yellow-300 bg-yellow-500/15 border-yellow-500/20',
  evaluate: 'text-orange-300 bg-orange-500/15 border-orange-500/20',
  create: 'text-purple-300 bg-purple-500/15 border-purple-500/20',
}

const difficultyBadgeColors = {
  easy: 'text-emerald-300 bg-emerald-500/15 border-emerald-500/20',
  medium: 'text-yellow-300 bg-yellow-500/15 border-yellow-500/20',
  hard: 'text-red-300 bg-red-500/15 border-red-500/20',
}

const bloomOptions = ['remember', 'understand', 'apply', 'analyze', 'evaluate', 'create']
const difficultyOptions = ['easy', 'medium', 'hard']
const typeOptions = ['mcq', 'short_answer', 'long_answer', 'true_false', 'fill_blank', 'case_study']

function formatLabel(value = '') {
  return value
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

function FilterDropdown({ label, value, onChange, options }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="appearance-none rounded-lg border border-[#27272A] bg-[#09090B] px-3 py-2 pr-8 text-xs font-semibold text-zinc-400 outline-none transition-colors focus:border-indigo-500"
      >
        <option value="all">{label}</option>
        {options.map((option) => (
          <option key={option} value={option}>{formatLabel(option)}</option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-600" />
    </div>
  )
}

export default function QuestionBank({
  papers = [],
  onPreviewPaper,
  onViewAnswers,
  onDownloadPaper,
  onDownloadAnswers,
  onEditPaper,
  onDeletePaper,
}) {
  const [searchQuery, setSearchQuery] = useState('')
  const [subjectFilter, setSubjectFilter] = useState('all')
  const [bloomFilter, setBloomFilter] = useState('all')
  const [difficultyFilter, setDifficultyFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')

  const questions = useMemo(
    () => papers.flatMap((paper) =>
      (paper.questions || []).map((question) => ({
        ...question,
        paperId: paper.id,
        paperTitle: paper.title,
        subject: paper.subject,
      })),
    ),
    [papers],
  )

  const subjects = useMemo(
    () => [...new Set(questions.map((question) => question.subject).filter(Boolean))],
    [questions],
  )

  const filteredQuestions = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    return questions.filter((question) => {
      const matchesQuery = !query || [
        question.question_text,
        question.answer,
        question.paperTitle,
        question.subject,
      ].some((value) => String(value || '').toLowerCase().includes(query))
      return matchesQuery
        && (subjectFilter === 'all' || question.subject === subjectFilter)
        && (bloomFilter === 'all' || question.bloom_level === bloomFilter)
        && (difficultyFilter === 'all' || question.difficulty === difficultyFilter)
        && (typeFilter === 'all' || question.question_type === typeFilter)
    })
  }, [questions, searchQuery, subjectFilter, bloomFilter, difficultyFilter, typeFilter])

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight sm:text-2xl">Question Bank</h1>
          <p className="mt-1 text-xs text-zinc-500">Browse and reuse questions generated from your documents.</p>
        </div>
        <span className="rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1.5 text-xs font-bold text-indigo-400">
          Total Questions: {questions.length}
        </span>
      </div>

      <div className="space-y-3 rounded-2xl border border-[#1a1a2e] bg-[#0f0f14] p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-600" />
          <input
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search questions..."
            className="w-full rounded-xl border border-[#27272A] bg-[#09090B] py-2.5 pl-10 pr-4 text-sm text-white outline-none placeholder:text-zinc-700 focus:border-indigo-500"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Filter className="h-3.5 w-3.5 text-zinc-600" />
          <FilterDropdown label="Subject" value={subjectFilter} onChange={setSubjectFilter} options={subjects} />
          <FilterDropdown label="Bloom Level" value={bloomFilter} onChange={setBloomFilter} options={bloomOptions} />
          <FilterDropdown label="Difficulty" value={difficultyFilter} onChange={setDifficultyFilter} options={difficultyOptions} />
          <FilterDropdown label="Question Type" value={typeFilter} onChange={setTypeFilter} options={typeOptions} />
        </div>
      </div>

      {filteredQuestions.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-[#1a1a2e] bg-[#0f0f14] py-16 text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-500/10">
            <BookOpen className="h-5 w-5 text-indigo-400/60" />
          </div>
          <p className="text-xs font-semibold text-zinc-500">No questions found</p>
          <p className="mt-1 text-[10px] text-zinc-600">Generated paper questions will appear here automatically.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {filteredQuestions.map((question) => {
            const parentPaper = papers.find((paper) => paper.id === question.paperId)
            return (
              <article
                key={`${question.paperId}-${question.id}`}
                className="flex flex-col gap-3 rounded-xl border border-[#1f1f2f] bg-[#0b0b10] p-4 transition-colors hover:border-indigo-500/25"
              >
                <p className="whitespace-pre-line text-xs leading-relaxed text-zinc-300">{question.question_text}</p>
                <p className="line-clamp-2 text-[11px] leading-relaxed text-zinc-500">{question.answer}</p>

                <div className="flex flex-wrap gap-1.5">
                  <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${bloomBadgeColors[question.bloom_level]}`}>
                    <Brain className="h-2.5 w-2.5" />
                    {formatLabel(question.bloom_level)}
                  </span>
                  <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${difficultyBadgeColors[question.difficulty]}`}>
                    <Gauge className="h-2.5 w-2.5" />
                    {formatLabel(question.difficulty)}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full border border-[#27272A] bg-[#111116] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                    <BookOpen className="h-2.5 w-2.5" />
                    {question.subject}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full border border-[#27272A] bg-[#111116] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                    <Layers className="h-2.5 w-2.5" />
                    {formatLabel(question.question_type)}
                  </span>
                </div>

                <div className="mt-auto flex flex-col gap-2 pt-1 sm:flex-row sm:items-center sm:justify-between">
                  <span className="truncate text-[10px] font-semibold text-zinc-600">{question.paperTitle}</span>
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      onClick={() => onPreviewPaper?.(parentPaper)}
                      className="rounded-lg p-1.5 text-zinc-500 transition-colors hover:bg-indigo-500/10 hover:text-indigo-400"
                      title="Preview paper"
                    >
                      <Eye className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => onViewAnswers?.(parentPaper)}
                      className="rounded-lg p-1.5 text-zinc-500 transition-colors hover:bg-amber-500/10 hover:text-amber-400"
                      title="View answers"
                    >
                      <KeyRound className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => onDownloadPaper?.(parentPaper)}
                      className="rounded-lg p-1.5 text-zinc-500 transition-colors hover:bg-emerald-500/10 hover:text-emerald-400"
                      title="Download question paper PDF"
                    >
                      <Download className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => onDownloadAnswers?.(parentPaper)}
                      className="rounded-lg p-1.5 text-zinc-500 transition-colors hover:bg-amber-500/10 hover:text-amber-400"
                      title="Download answer key PDF"
                    >
                      <FileDown className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => onEditPaper?.(parentPaper)}
                      className="rounded-lg p-1.5 text-zinc-500 transition-colors hover:bg-blue-500/10 hover:text-blue-400"
                      title="Edit"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => onEditPaper?.(parentPaper)}
                      className="rounded-lg p-1.5 text-zinc-500 transition-colors hover:bg-violet-500/10 hover:text-violet-400"
                      title="Regenerate individual questions"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => onDeletePaper?.(parentPaper)}
                      className="rounded-lg p-1.5 text-zinc-500 transition-colors hover:bg-red-500/10 hover:text-red-400"
                      title="Delete paper"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}
