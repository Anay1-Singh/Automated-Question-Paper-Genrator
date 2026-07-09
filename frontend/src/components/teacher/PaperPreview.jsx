import {
  AlertCircle,
  ArrowLeft,
  BookOpen,
  Download,
  Eye,
  FileDown,
  KeyRound,
  Loader2,
  Pencil,
  Printer,
  RotateCcw,
  Trash2,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { api } from '../../utils/api'

const labelMap = {
  mcq: 'MCQ',
  short_answer: 'Short Answer',
  long_answer: 'Long Answer',
  true_false: 'True/False',
  fill_blank: 'Fill in the Blanks',
  case_study: 'Case Study',
  remember: 'Remember',
  understand: 'Understand',
  apply: 'Apply',
  analyze: 'Analyze',
  evaluate: 'Evaluate',
  create: 'Create',
}

function label(value = '') {
  return labelMap[value] || String(value).replaceAll('_', ' ').replace(/\b\w/g, (char) => char.toUpperCase())
}

function formatDate(value) {
  if (!value) return 'To be specified'
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(value))
}

function buildMetadata(paper) {
  return {
    department: paper?.configuration?.export_metadata?.department || '',
    course_code: paper?.configuration?.export_metadata?.course_code || '',
    semester: paper?.configuration?.export_metadata?.semester || '',
    exam_type: paper?.configuration?.export_metadata?.exam_type || paper?.exam_name || '',
    duration: paper?.configuration?.export_metadata?.duration || '',
    exam_date: paper?.configuration?.export_metadata?.exam_date || formatDate(paper?.generated_at || paper?.created_at),
    instructions: paper?.configuration?.instructions || 'Answer all questions. Marks are indicated against each question. Write clearly and justify answers where required.',
  }
}

function queryFromMetadata(metadata) {
  const params = new URLSearchParams()
  Object.entries(metadata).forEach(([key, value]) => {
    if (String(value || '').trim()) {
      params.set(key, String(value).trim())
    }
  })
  const query = params.toString()
  return query ? `?${query}` : ''
}

function metadataValue(value) {
  return String(value ?? '').trim() || 'To be specified'
}

function MetadataField({ label: fieldLabel, value, onChange, placeholder }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">{fieldLabel}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="rounded-xl border border-[#27272A] bg-[#09090B] px-3 py-2.5 text-xs text-white outline-none placeholder:text-zinc-700 focus:border-indigo-500"
      />
    </label>
  )
}

function ActionButton({ children, icon: Icon, onClick, disabled = false, tone = 'neutral', title }) {
  const tones = {
    neutral: 'border-[#27272A] bg-[#09090B] text-zinc-300 hover:border-zinc-600 hover:text-white',
    indigo: 'border-indigo-500/20 bg-indigo-500/10 text-indigo-300 hover:bg-indigo-500/15',
    emerald: 'border-emerald-500/20 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/15',
    amber: 'border-amber-500/20 bg-amber-500/10 text-amber-300 hover:bg-amber-500/15',
    red: 'border-red-500/20 bg-red-500/10 text-red-300 hover:bg-red-500/15',
  }
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`inline-flex items-center justify-center gap-2 rounded-xl border px-3 py-2 text-xs font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${tones[tone]}`}
    >
      {Icon && <Icon className="h-3.5 w-3.5" />}
      {children}
    </button>
  )
}

export default function PaperPreview({
  paper,
  initialMode = 'paper',
  onBack,
  onEdit,
  onDelete,
}) {
  const [mode, setMode] = useState(initialMode)
  const [metadata, setMetadata] = useState(() => buildMetadata(paper))
  const [answers, setAnswers] = useState(null)
  const [answersLoading, setAnswersLoading] = useState(false)
  const [downloading, setDownloading] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (!paper || mode !== 'answers' || answers) return
    const loadAnswers = async () => {
      setAnswersLoading(true)
      setError('')
      try {
        const data = await api.get(`/papers/${paper.id}/answers`)
        setAnswers(data)
      } catch (err) {
        setError(err.message || 'Unable to load the answer key.')
      } finally {
        setAnswersLoading(false)
      }
    }
    loadAnswers()
  }, [answers, mode, paper])

  const totalMarks = useMemo(
    () => paper?.questions?.reduce((sum, question) => sum + Number(question.marks || 0), 0) || paper?.total_marks || 0,
    [paper],
  )

  if (!paper) {
    return (
      <div className="mx-auto flex max-w-4xl flex-col items-center justify-center rounded-2xl border border-[#1a1a2e] bg-[#0f0f14] px-6 py-20 text-center">
        <FileDown className="mb-4 h-10 w-10 text-zinc-600" />
        <h1 className="text-lg font-bold text-white">No paper selected</h1>
        <p className="mt-2 text-xs text-zinc-500">Open a generated paper from History or Question Bank to preview it.</p>
        <ActionButton icon={ArrowLeft} onClick={onBack} tone="indigo" title="Back">
          Back
        </ActionButton>
      </div>
    )
  }

  const updateMetadata = (key, value) => {
    setMetadata((current) => ({ ...current, [key]: value }))
  }

  const downloadPdf = async (type) => {
    setDownloading(type)
    setError('')
    const suffix = type === 'answers' ? '/answers/pdf' : '/pdf'
    try {
      await api.download(`/papers/${paper.id}${suffix}${queryFromMetadata(metadata)}`)
    } catch (err) {
      setError(err.message || 'Unable to download this PDF.')
    } finally {
      setDownloading('')
    }
  }

  const answerItems = answers?.answers || paper.questions || []

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <button
            type="button"
            onClick={onBack}
            className="mb-3 inline-flex items-center gap-2 text-xs font-bold text-zinc-500 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back
          </button>
          <h1 className="text-xl font-bold tracking-tight sm:text-2xl">Preview Paper</h1>
          <p className="mt-1 text-xs text-zinc-500">Review formatted paper and faculty answer key before export.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <ActionButton icon={Eye} onClick={() => setMode('paper')} tone={mode === 'paper' ? 'indigo' : 'neutral'}>
            Preview
          </ActionButton>
          <ActionButton icon={KeyRound} onClick={() => setMode('answers')} tone={mode === 'answers' ? 'amber' : 'neutral'}>
            View Answers
          </ActionButton>
          <ActionButton icon={Download} onClick={() => downloadPdf('paper')} disabled={downloading === 'paper'} tone="emerald">
            {downloading === 'paper' ? 'Downloading...' : 'Question PDF'}
          </ActionButton>
          <ActionButton icon={FileDown} onClick={() => downloadPdf('answers')} disabled={downloading === 'answers'} tone="amber">
            {downloading === 'answers' ? 'Downloading...' : 'Answer PDF'}
          </ActionButton>
          <ActionButton icon={Printer} onClick={() => window.print()} tone="neutral">
            Print
          </ActionButton>
          <ActionButton icon={Pencil} onClick={() => onEdit?.(paper)} tone="indigo" title="Edit and regenerate">
            Edit
          </ActionButton>
          <ActionButton icon={RotateCcw} onClick={() => onEdit?.(paper)} tone="indigo" title="Regenerate individual questions">
            Regenerate
          </ActionButton>
          <ActionButton icon={Trash2} onClick={() => onDelete?.(paper)} tone="red">
            Delete
          </ActionButton>
        </div>
      </div>

      {error && (
        <div className="flex items-start gap-2 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-300">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      <section className="rounded-2xl border border-[#1a1a2e] bg-[#0f0f14] p-5">
        <div className="mb-4 flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-indigo-400" />
          <h2 className="text-sm font-bold">Export Metadata</h2>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <MetadataField label="Department" value={metadata.department} onChange={(value) => updateMetadata('department', value)} placeholder="Department" />
          <MetadataField label="Course Code" value={metadata.course_code} onChange={(value) => updateMetadata('course_code', value)} placeholder="Course code" />
          <MetadataField label="Semester" value={metadata.semester} onChange={(value) => updateMetadata('semester', value)} placeholder="Semester" />
          <MetadataField label="Exam Type" value={metadata.exam_type} onChange={(value) => updateMetadata('exam_type', value)} placeholder="Exam type" />
          <MetadataField label="Duration" value={metadata.duration} onChange={(value) => updateMetadata('duration', value)} placeholder="Duration" />
          <MetadataField label="Exam Date" value={metadata.exam_date} onChange={(value) => updateMetadata('exam_date', value)} placeholder="Exam date" />
        </div>
        <label className="mt-3 flex flex-col gap-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Instructions</span>
          <textarea
            value={metadata.instructions}
            onChange={(event) => updateMetadata('instructions', event.target.value)}
            rows={3}
            className="resize-none rounded-xl border border-[#27272A] bg-[#09090B] px-3 py-2.5 text-xs text-white outline-none placeholder:text-zinc-700 focus:border-indigo-500"
          />
        </label>
      </section>

      {mode === 'paper' ? (
        <section className="rounded-2xl border border-zinc-200 bg-white p-6 text-zinc-950 shadow-2xl shadow-black/20 sm:p-8">
          <div className="text-center">
            <h2 className="text-lg font-black tracking-wide">KR MANGALAM UNIVERSITY</h2>
            <p className="mt-1 text-xs font-bold uppercase tracking-[0.2em] text-zinc-600">Question Paper</p>
            <h3 className="mt-4 text-base font-bold">{paper.title}</h3>
          </div>

          <div className="mt-6 grid grid-cols-1 border border-zinc-300 text-xs sm:grid-cols-2">
            {[
              ['Department', metadataValue(metadata.department)],
              ['Course Code', metadataValue(metadata.course_code)],
              ['Subject', paper.subject || 'To be specified'],
              ['Semester', metadataValue(metadata.semester)],
              ['Examination', metadataValue(metadata.exam_type)],
              ['Duration', metadataValue(metadata.duration)],
              ['Maximum Marks', totalMarks],
              ['Date', metadataValue(metadata.exam_date)],
            ].map(([key, value]) => (
              <div key={key} className="grid grid-cols-[130px_1fr] border-b border-zinc-300 last:border-b-0 sm:[&:nth-last-child(-n+2)]:border-b-0">
                <div className="border-r border-zinc-300 bg-zinc-100 px-3 py-2 font-bold">{key}</div>
                <div className="px-3 py-2">{value}</div>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <h4 className="text-sm font-bold">Instructions</h4>
            <ol className="mt-2 list-decimal space-y-1 pl-5 text-xs leading-relaxed">
              {metadata.instructions.split(/\n|;/).filter(Boolean).map((item) => (
                <li key={item}>{item.trim()}</li>
              ))}
            </ol>
          </div>

          <div className="mt-6 space-y-5">
            {paper.questions.map((question, index) => (
              <article key={question.id} className="break-inside-avoid">
                <div className="grid grid-cols-[44px_1fr_56px] gap-2 text-sm leading-relaxed">
                  <span className="font-bold">Q{index + 1}.</span>
                  <p>{question.question_text}</p>
                  <span className="text-right font-bold">[{question.marks}]</span>
                </div>
                {question.options?.length > 0 && (
                  <ol className="mt-2 list-lower-alpha space-y-1 pl-16 text-xs">
                    {question.options.map((option) => <li key={option}>{option}</li>)}
                  </ol>
                )}
              </article>
            ))}
          </div>
        </section>
      ) : (
        <section className="rounded-2xl border border-[#1a1a2e] bg-[#0f0f14] p-5">
          {answersLoading ? (
            <div className="flex items-center justify-center gap-2 py-16 text-xs font-bold text-zinc-500">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading answer key...
            </div>
          ) : (
            <div className="space-y-4">
              <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-3 text-xs font-semibold text-amber-200">
                Faculty answer key for {paper.title}. Keep this view restricted to teachers.
              </div>
              {answerItems.map((item, index) => (
                <article key={item.question_id || item.id} className="rounded-xl border border-[#202033] bg-[#09090B] p-4">
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    <span className="text-xs font-black text-white">Q{item.number || index + 1}</span>
                    <span className="rounded-full border border-indigo-500/20 bg-indigo-500/10 px-2 py-0.5 text-[10px] font-bold uppercase text-indigo-300">{label(item.bloom_level)}</span>
                    <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold uppercase text-emerald-300">{label(item.difficulty)}</span>
                    <span className="rounded-full border border-[#27272A] bg-[#111116] px-2 py-0.5 text-[10px] font-bold uppercase text-zinc-500">{label(item.question_type)}</span>
                    <span className="ml-auto text-[10px] font-bold uppercase text-zinc-600">{item.marks} marks</span>
                  </div>
                  <p className="whitespace-pre-line text-xs leading-relaxed text-zinc-300">{item.question_text}</p>
                  <div className="mt-3 rounded-xl border border-emerald-500/15 bg-emerald-500/5 p-3">
                    <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-emerald-300">Answer</p>
                    <p className="whitespace-pre-line text-xs leading-relaxed text-zinc-200">{item.answer}</p>
                  </div>
                  {item.explanation && (
                    <p className="mt-3 text-[11px] leading-relaxed text-zinc-500">Explanation: {item.explanation}</p>
                  )}
                </article>
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  )
}
