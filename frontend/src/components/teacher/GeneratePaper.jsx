import {
  AlertCircle,
  Brain,
  CheckCircle2,
  CheckSquare,
  ChevronDown,
  Download,
  Eye,
  FileDown,
  FileText,
  GripVertical,
  KeyRound,
  Layers,
  ListChecks,
  Loader2,
  PenLine,
  RotateCcw,
  Save,
  Shuffle,
  Sparkles,
  Trash2,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import { api } from '../../utils/api'

const bloomLevels = [
  { key: 'remember', label: 'Remember', color: 'bg-zinc-500', text: 'text-zinc-300' },
  { key: 'understand', label: 'Understand', color: 'bg-blue-500', text: 'text-blue-300' },
  { key: 'apply', label: 'Apply', color: 'bg-green-500', text: 'text-green-300' },
  { key: 'analyze', label: 'Analyze', color: 'bg-yellow-500', text: 'text-yellow-300' },
  { key: 'evaluate', label: 'Evaluate', color: 'bg-orange-500', text: 'text-orange-300' },
  { key: 'create', label: 'Create', color: 'bg-purple-500', text: 'text-purple-300' },
]

const difficultyLevels = [
  { key: 'easy', label: 'Easy', color: 'text-emerald-400', bar: 'bg-emerald-500' },
  { key: 'medium', label: 'Medium', color: 'text-yellow-400', bar: 'bg-yellow-500' },
  { key: 'hard', label: 'Hard', color: 'text-red-400', bar: 'bg-red-500' },
]

const questionTypes = [
  { key: 'mcq', label: 'MCQ', icon: ListChecks },
  { key: 'short_answer', label: 'Short Answer', icon: PenLine },
  { key: 'long_answer', label: 'Long Answer', icon: FileText },
  { key: 'true_false', label: 'True/False', icon: CheckSquare },
  { key: 'fill_blank', label: 'Fill in the Blanks', icon: Sparkles },
  { key: 'case_study', label: 'Case Study', icon: Brain },
]

const marksOptions = [25, 50, 75, 100]

const badgeColors = {
  remember: 'text-zinc-300 bg-zinc-500/15 border-zinc-500/20',
  understand: 'text-blue-300 bg-blue-500/15 border-blue-500/20',
  apply: 'text-green-300 bg-green-500/15 border-green-500/20',
  analyze: 'text-yellow-300 bg-yellow-500/15 border-yellow-500/20',
  evaluate: 'text-orange-300 bg-orange-500/15 border-orange-500/20',
  create: 'text-purple-300 bg-purple-500/15 border-purple-500/20',
  easy: 'text-emerald-300 bg-emerald-500/15 border-emerald-500/20',
  medium: 'text-yellow-300 bg-yellow-500/15 border-yellow-500/20',
  hard: 'text-red-300 bg-red-500/15 border-red-500/20',
}

function sumValues(values) {
  return Object.values(values).reduce((total, value) => total + Number(value || 0), 0)
}

function clampPercent(value) {
  return Math.max(0, Math.min(100, Number.parseInt(value, 10) || 0))
}

function formatDate(value) {
  if (!value) return 'Now'
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(value))
}

function labelForType(type) {
  return questionTypes.find((item) => item.key === type)?.label || type
}

function labelForBloom(level) {
  return bloomLevels.find((item) => item.key === level)?.label || level
}

function buildInitialForm(paper) {
  return {
    documentId: paper?.document_id || '',
    title: paper?.title || '',
    subject: paper?.subject || '',
    examName: paper?.exam_name || '',
    totalMarks: paper?.total_marks || 100,
    totalQuestions: paper?.total_questions || 25,
    difficulty: paper?.configuration?.difficulty_distribution || { easy: 30, medium: 50, hard: 20 },
    bloom: paper?.configuration?.bloom_distribution || { remember: 20, understand: 20, apply: 20, analyze: 15, evaluate: 15, create: 10 },
    questionTypes: paper?.configuration?.question_types || ['mcq', 'short_answer', 'long_answer'],
    instructions: paper?.configuration?.instructions || '',
  }
}

export default function GeneratePaper({
  documents = [],
  paperToEdit = null,
  onPaperGenerated,
  onPaperUpdated,
  onPapersRefresh,
  onPreviewPaper,
  onViewAnswers,
  onDownloadPaper,
  onDownloadAnswers,
}) {
  const [form, setForm] = useState(() => buildInitialForm(paperToEdit))
  const [currentPaper, setCurrentPaper] = useState(() => paperToEdit)
  const [generating, setGenerating] = useState(false)
  const [saving, setSaving] = useState(false)
  const [regeneratingId, setRegeneratingId] = useState('')
  const [progress, setProgress] = useState(0)
  const [progressLabel, setProgressLabel] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const processedDocuments = useMemo(
    () => documents.filter((document) => ['processed', 'ready'].includes(document.status)),
    [documents],
  )

  const selectedDocument = processedDocuments.find((document) => document.id === form.documentId)
  const diffTotal = sumValues(form.difficulty)
  const bloomTotal = sumValues(form.bloom)
  const generatedMarks = currentPaper?.questions?.reduce((sum, question) => sum + Number(question.marks || 0), 0) || 0

  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const updateDistribution = (group, key, value) => {
    setForm((prev) => ({
      ...prev,
      [group]: {
        ...prev[group],
        [key]: clampPercent(value),
      },
    }))
  }

  const handleDocumentSelect = (documentId) => {
    const document = processedDocuments.find((item) => item.id === documentId)
    setForm((prev) => ({
      ...prev,
      documentId,
      subject: prev.subject || document?.subject || '',
      title: prev.title || (document ? `${document.title} Question Paper` : ''),
    }))
  }

  const toggleType = (key) => {
    setForm((prev) => ({
      ...prev,
      questionTypes: prev.questionTypes.includes(key)
        ? prev.questionTypes.filter((item) => item !== key)
        : [...prev.questionTypes, key],
    }))
  }

  const validateForm = () => {
    if (!form.documentId) return 'Select a processed document first.'
    if (!form.title.trim()) return 'Paper title is required.'
    if (!form.subject.trim()) return 'Subject is required.'
    if (form.totalQuestions < 1 || form.totalQuestions > 100) return 'Question count must be between 1 and 100.'
    if (form.totalMarks < form.totalQuestions) return 'Total marks must be at least the number of questions.'
    if (diffTotal !== 100) return 'Difficulty distribution must add up to 100%.'
    if (bloomTotal !== 100) return "Bloom's Taxonomy distribution must add up to 100%."
    if (!form.questionTypes.length) return 'Select at least one question type.'
    return ''
  }

  const startProgress = () => {
    setProgress(8)
    setProgressLabel('Preparing document context')
    const labels = ['Balancing Bloom levels', 'Generating questions', 'Validating marks', 'Saving paper']
    let index = 0
    const timer = window.setInterval(() => {
      setProgress((value) => Math.min(value + 12, 88))
      setProgressLabel(labels[index % labels.length])
      index += 1
    }, 800)
    return timer
  }

  const handleGenerate = async () => {
    setError('')
    setSuccess('')
    const validationError = validateForm()
    if (validationError) {
      setError(validationError)
      return
    }

    setGenerating(true)
    const timer = startProgress()
    const payload = {
      document_id: form.documentId,
      title: form.title.trim(),
      subject: form.subject.trim(),
      exam_name: form.examName.trim() || null,
      total_marks: Number(form.totalMarks),
      total_questions: Number(form.totalQuestions),
      bloom_distribution: form.bloom,
      difficulty_distribution: form.difficulty,
      question_types: form.questionTypes,
      instructions: form.instructions.trim() || null,
    }

    try {
      const paper = await api.post('/papers/generate', payload)
      await onPapersRefresh?.({ silent: true })
      setCurrentPaper(paper)
      onPaperGenerated?.(paper)
      setProgress(100)
      setProgressLabel('Paper generated')
      setSuccess('Question paper generated and saved.')
    } catch (err) {
      setError(err.message || 'Unable to generate this paper.')
    } finally {
      window.clearInterval(timer)
      setGenerating(false)
    }
  }

  const updateQuestion = (questionId, patch) => {
    setCurrentPaper((paper) => {
      if (!paper) return paper
      const questions = paper.questions.map((question) =>
        question.id === questionId ? { ...question, ...patch } : question,
      )
      return {
        ...paper,
        questions,
        total_questions: questions.length,
        total_marks: questions.reduce((sum, item) => sum + Number(item.marks || 0), 0),
      }
    })
  }

  const deleteQuestion = (questionId) => {
    setCurrentPaper((paper) => {
      if (!paper || paper.questions.length <= 1) return paper
      const questions = paper.questions.filter((question) => question.id !== questionId)
      return {
        ...paper,
        questions,
        total_questions: questions.length,
        total_marks: questions.reduce((sum, item) => sum + Number(item.marks || 0), 0),
      }
    })
  }

  const shuffleQuestions = () => {
    setCurrentPaper((paper) => {
      if (!paper) return paper
      const questions = [...paper.questions]
      for (let index = questions.length - 1; index > 0; index -= 1) {
        const swapIndex = Math.floor(Math.random() * (index + 1))
        const currentQuestion = questions[index]
        questions[index] = questions[swapIndex]
        questions[swapIndex] = currentQuestion
      }
      return { ...paper, questions }
    })
  }

  const savePaper = async () => {
    if (!currentPaper) return
    setSaving(true)
    setError('')
    setSuccess('')
    const payload = {
      title: currentPaper.title,
      subject: currentPaper.subject,
      exam_name: currentPaper.exam_name,
      total_marks: generatedMarks,
      instructions: currentPaper.configuration?.instructions || form.instructions || null,
      questions: currentPaper.questions,
    }

    try {
      const savedPaper = await api.put(`/papers/${currentPaper.id}`, payload)
      await onPapersRefresh?.({ silent: true })
      setCurrentPaper(savedPaper)
      onPaperUpdated?.(savedPaper)
      setSuccess('Paper saved.')
    } catch (err) {
      setError(err.message || 'Unable to save this paper.')
    } finally {
      setSaving(false)
    }
  }

  const regenerateQuestion = async (question) => {
    if (!currentPaper) return
    setRegeneratingId(question.id)
    setError('')
    setSuccess('')

    try {
      const nextPaper = await api.post(`/papers/${currentPaper.id}/questions/${question.id}/regenerate`, {
        instructions: form.instructions || null,
      })
      await onPapersRefresh?.({ silent: true })
      setCurrentPaper(nextPaper)
      onPaperUpdated?.(nextPaper)
      setSuccess('Question regenerated.')
    } catch (err) {
      setError(err.message || 'Unable to regenerate this question.')
    } finally {
      setRegeneratingId('')
    }
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-xl font-bold tracking-tight sm:text-2xl">Generate Question Paper</h1>
        <p className="text-xs text-zinc-500">Create balanced, editable papers from processed study material.</p>
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(340px,420px)_minmax(0,1fr)]">
        <section className="rounded-2xl border border-[#1a1a2e] bg-[#0f0f14] p-5">
          <div className="space-y-5">
            <div>
              <label className="mb-1.5 block text-xs font-bold text-zinc-300">Processed Document</label>
              <div className="relative">
                <select
                  value={form.documentId}
                  onChange={(event) => handleDocumentSelect(event.target.value)}
                  className="w-full appearance-none rounded-xl border border-[#27272A] bg-[#09090B] px-3 py-3 pr-10 text-sm text-white outline-none transition-colors focus:border-indigo-500"
                >
                  <option value="">Choose a processed document...</option>
                  {processedDocuments.map((document) => (
                    <option key={document.id} value={document.id}>
                      {document.title} {document.subject ? `- ${document.subject}` : ''}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
              </div>
              {processedDocuments.length === 0 && (
                <p className="mt-2 text-[11px] text-amber-300">Upload and process a document before generating papers.</p>
              )}
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-1">
              <div>
                <label className="mb-1.5 block text-xs font-bold text-zinc-300">Paper Title</label>
                <input
                  value={form.title}
                  onChange={(event) => updateField('title', event.target.value)}
                  className="w-full rounded-xl border border-[#27272A] bg-[#09090B] px-3 py-3 text-sm text-white outline-none placeholder:text-zinc-700 focus:border-indigo-500"
                  placeholder="Paper title"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-bold text-zinc-300">Subject</label>
                <input
                  value={form.subject}
                  onChange={(event) => updateField('subject', event.target.value)}
                  className="w-full rounded-xl border border-[#27272A] bg-[#09090B] px-3 py-3 text-sm text-white outline-none placeholder:text-zinc-700 focus:border-indigo-500"
                  placeholder={selectedDocument?.subject || 'Subject'}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-bold text-zinc-300">Exam Name</label>
                <input
                  value={form.examName}
                  onChange={(event) => updateField('examName', event.target.value)}
                  className="w-full rounded-xl border border-[#27272A] bg-[#09090B] px-3 py-3 text-sm text-white outline-none placeholder:text-zinc-700 focus:border-indigo-500"
                  placeholder="Exam name"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold text-zinc-300">Total Marks</label>
              <div className="grid grid-cols-4 gap-2">
                {marksOptions.map((marks) => (
                  <button
                    key={marks}
                    type="button"
                    onClick={() => updateField('totalMarks', marks)}
                    className={`rounded-xl border py-2.5 text-xs font-bold transition-colors ${
                      form.totalMarks === marks
                        ? 'border-indigo-500/40 bg-indigo-500/15 text-indigo-300'
                        : 'border-[#27272A] bg-[#09090B] text-zinc-500 hover:border-zinc-600 hover:text-zinc-300'
                    }`}
                  >
                    {marks}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold text-zinc-300">Number of Questions</label>
              <input
                type="number"
                min={1}
                max={100}
                value={form.totalQuestions}
                onChange={(event) => updateField('totalQuestions', Number.parseInt(event.target.value, 10) || 1)}
                className="w-full rounded-xl border border-[#27272A] bg-[#09090B] px-3 py-3 text-sm text-white outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <div className="mb-3 flex items-center gap-2">
                <Layers className="h-4 w-4 text-indigo-400" />
                <span className="text-xs font-bold text-zinc-300">Difficulty Distribution</span>
                <span className={`ml-auto text-[10px] font-bold ${diffTotal === 100 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {diffTotal}%
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {difficultyLevels.map((item) => (
                  <div key={item.key}>
                    <label className={`mb-1 block text-[10px] font-bold uppercase ${item.color}`}>{item.label}</label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={form.difficulty[item.key]}
                      onChange={(event) => updateDistribution('difficulty', item.key, event.target.value)}
                      className="w-full rounded-lg border border-[#27272A] bg-[#09090B] px-2 py-2 text-center text-xs font-bold text-white outline-none focus:border-indigo-500"
                    />
                  </div>
                ))}
              </div>
              <div className="mt-3 flex h-2.5 overflow-hidden rounded-full bg-[#202033]">
                {difficultyLevels.map((item) => (
                  <div key={item.key} className={`${item.bar} transition-all`} style={{ width: `${form.difficulty[item.key]}%` }} />
                ))}
              </div>
            </div>

            <div>
              <div className="mb-3 flex items-center gap-2">
                <Brain className="h-4 w-4 text-indigo-400" />
                <span className="text-xs font-bold text-zinc-300">Bloom's Distribution</span>
                <span className={`ml-auto text-[10px] font-bold ${bloomTotal === 100 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {bloomTotal}%
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-2">
                {bloomLevels.map((item) => (
                  <div key={item.key}>
                    <label className={`mb-1 block text-[10px] font-bold uppercase ${item.text}`}>{item.label}</label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={form.bloom[item.key]}
                      onChange={(event) => updateDistribution('bloom', item.key, event.target.value)}
                      className="w-full rounded-lg border border-[#27272A] bg-[#09090B] px-2 py-2 text-center text-xs font-bold text-white outline-none focus:border-indigo-500"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="mb-3 flex items-center gap-2">
                <ListChecks className="h-4 w-4 text-indigo-400" />
                <span className="text-xs font-bold text-zinc-300">Question Types</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {questionTypes.map((item) => {
                  const Icon = item.icon
                  const selected = form.questionTypes.includes(item.key)
                  return (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => toggleType(item.key)}
                      className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-bold transition-colors ${
                        selected
                          ? 'border-indigo-500/40 bg-indigo-500/15 text-indigo-300'
                          : 'border-[#27272A] bg-[#09090B] text-zinc-500 hover:border-zinc-600 hover:text-zinc-300'
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      {item.label}
                    </button>
                  )
                })}
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold text-zinc-300">Optional Instructions</label>
              <textarea
                value={form.instructions}
                onChange={(event) => updateField('instructions', event.target.value)}
                rows={4}
                className="w-full resize-none rounded-xl border border-[#27272A] bg-[#09090B] px-3 py-3 text-sm text-white outline-none placeholder:text-zinc-700 focus:border-indigo-500"
                placeholder="Mention section format, unit focus, answer length, or institution rules."
              />
            </div>

            {error && (
              <div className="flex items-start gap-2 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-300">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                {error}
              </div>
            )}
            {success && (
              <div className="flex items-start gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-xs text-emerald-300">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                {success}
              </div>
            )}

            {generating && (
              <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/10 p-3">
                <div className="mb-2 flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-indigo-300">
                  <span>{progressLabel}</span>
                  <span>{progress}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-[#202033]">
                  <div className="h-full rounded-full bg-indigo-500 transition-all" style={{ width: `${progress}%` }} />
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={handleGenerate}
              disabled={generating}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-900/20 transition-colors hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {generating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              {generating ? 'Generating Paper...' : 'Generate Question Paper'}
            </button>
          </div>
        </section>

        <section className="min-w-0 rounded-2xl border border-[#1a1a2e] bg-[#0f0f14] p-5">
          {!currentPaper ? (
            <div className="flex min-h-[520px] flex-col items-center justify-center rounded-xl border border-dashed border-[#34344a] bg-[#09090B] p-6 text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/10">
                <FileText className="h-7 w-7 text-indigo-400" />
              </div>
              <h2 className="text-sm font-bold text-white">Paper preview will appear here</h2>
              <p className="mt-2 max-w-sm text-xs text-zinc-500">Generate from a processed document to review, edit, regenerate, shuffle, and save questions.</p>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="flex flex-col gap-4 border-b border-[#1a1a2e] pb-5 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0">
                  <input
                    value={currentPaper.title}
                    onChange={(event) => setCurrentPaper((paper) => ({ ...paper, title: event.target.value }))}
                    className="w-full border-none bg-transparent text-lg font-black text-white outline-none"
                  />
                  <div className="mt-2 flex flex-wrap gap-2 text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                    <span>{currentPaper.subject}</span>
                    <span>{currentPaper.exam_name || 'Question Paper'}</span>
                    <span>{formatDate(currentPaper.generated_at)}</span>
                    <span>{currentPaper.generation_provider}</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => onPreviewPaper?.(currentPaper)}
                    className="inline-flex items-center gap-2 rounded-lg border border-indigo-500/20 bg-indigo-500/10 px-3 py-2 text-xs font-bold text-indigo-300 hover:bg-indigo-500/15"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    Preview
                  </button>
                  <button
                    type="button"
                    onClick={() => onViewAnswers?.(currentPaper)}
                    className="inline-flex items-center gap-2 rounded-lg border border-amber-500/20 bg-amber-500/10 px-3 py-2 text-xs font-bold text-amber-300 hover:bg-amber-500/15"
                  >
                    <KeyRound className="h-3.5 w-3.5" />
                    Answers
                  </button>
                  <button
                    type="button"
                    onClick={() => onDownloadPaper?.(currentPaper)}
                    className="inline-flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-xs font-bold text-emerald-300 hover:bg-emerald-500/15"
                  >
                    <Download className="h-3.5 w-3.5" />
                    Question PDF
                  </button>
                  <button
                    type="button"
                    onClick={() => onDownloadAnswers?.(currentPaper)}
                    className="inline-flex items-center gap-2 rounded-lg border border-amber-500/20 bg-amber-500/10 px-3 py-2 text-xs font-bold text-amber-300 hover:bg-amber-500/15"
                  >
                    <FileDown className="h-3.5 w-3.5" />
                    Answer PDF
                  </button>
                  <button
                    type="button"
                    onClick={shuffleQuestions}
                    className="inline-flex items-center gap-2 rounded-lg border border-[#27272A] bg-[#09090B] px-3 py-2 text-xs font-bold text-zinc-300 hover:border-indigo-500/40"
                  >
                    <Shuffle className="h-3.5 w-3.5" />
                    Shuffle
                  </button>
                  <button
                    type="button"
                    onClick={savePaper}
                    disabled={saving}
                    className="inline-flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-xs font-bold text-emerald-300 hover:bg-emerald-500/15 disabled:opacity-70"
                  >
                    {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                    Save
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs sm:grid-cols-4">
                <div className="rounded-xl border border-[#202033] bg-[#09090B] p-3">
                  <p className="text-[10px] font-bold uppercase text-zinc-600">Questions</p>
                  <p className="mt-1 text-xl font-black text-white">{currentPaper.questions.length}</p>
                </div>
                <div className="rounded-xl border border-[#202033] bg-[#09090B] p-3">
                  <p className="text-[10px] font-bold uppercase text-zinc-600">Marks</p>
                  <p className="mt-1 text-xl font-black text-white">{generatedMarks}</p>
                </div>
                <div className="rounded-xl border border-[#202033] bg-[#09090B] p-3">
                  <p className="text-[10px] font-bold uppercase text-zinc-600">Document</p>
                  <p className="mt-1 truncate text-xs font-bold text-zinc-300">{currentPaper.document_title}</p>
                </div>
                <div className="rounded-xl border border-[#202033] bg-[#09090B] p-3">
                  <p className="text-[10px] font-bold uppercase text-zinc-600">Status</p>
                  <p className="mt-1 text-xs font-bold uppercase text-emerald-300">{currentPaper.status}</p>
                </div>
              </div>

              <div className="space-y-4">
                {currentPaper.questions.map((question, index) => (
                  <article key={question.id} className="rounded-xl border border-[#202033] bg-[#09090B] p-4">
                    <div className="mb-3 flex flex-wrap items-center gap-2">
                      <GripVertical className="h-4 w-4 text-zinc-700" />
                      <span className="text-xs font-black text-white">Q{index + 1}</span>
                      <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase ${badgeColors[question.bloom_level]}`}>
                        {labelForBloom(question.bloom_level)}
                      </span>
                      <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase ${badgeColors[question.difficulty]}`}>
                        {question.difficulty}
                      </span>
                      <span className="rounded-full border border-[#27272A] bg-[#111116] px-2 py-0.5 text-[10px] font-bold uppercase text-zinc-500">
                        {labelForType(question.question_type)}
                      </span>
                      <span className="ml-auto text-[10px] font-bold uppercase text-zinc-600">Chunk {question.source_chunk || 0}</span>
                    </div>

                    <div className="grid grid-cols-1 gap-3 lg:grid-cols-[minmax(0,1fr)_180px]">
                      <div className="space-y-3">
                        <textarea
                          value={question.question_text}
                          onChange={(event) => updateQuestion(question.id, { question_text: event.target.value })}
                          rows={3}
                          className="w-full resize-y rounded-lg border border-[#27272A] bg-[#0f0f14] px-3 py-2 text-xs leading-relaxed text-white outline-none focus:border-indigo-500"
                        />
                        <textarea
                          value={question.answer}
                          onChange={(event) => updateQuestion(question.id, { answer: event.target.value })}
                          rows={2}
                          className="w-full resize-y rounded-lg border border-[#27272A] bg-[#0f0f14] px-3 py-2 text-xs leading-relaxed text-zinc-300 outline-none focus:border-indigo-500"
                        />
                        <input
                          value={question.explanation}
                          onChange={(event) => updateQuestion(question.id, { explanation: event.target.value })}
                          className="w-full rounded-lg border border-[#27272A] bg-[#0f0f14] px-3 py-2 text-xs text-zinc-400 outline-none focus:border-indigo-500"
                          placeholder="Explanation"
                        />
                      </div>

                      <div className="space-y-2">
                        <select
                          value={question.bloom_level}
                          onChange={(event) => updateQuestion(question.id, { bloom_level: event.target.value })}
                          className="w-full rounded-lg border border-[#27272A] bg-[#0f0f14] px-2 py-2 text-xs text-white outline-none"
                        >
                          {bloomLevels.map((item) => <option key={item.key} value={item.key}>{item.label}</option>)}
                        </select>
                        <select
                          value={question.difficulty}
                          onChange={(event) => updateQuestion(question.id, { difficulty: event.target.value })}
                          className="w-full rounded-lg border border-[#27272A] bg-[#0f0f14] px-2 py-2 text-xs text-white outline-none"
                        >
                          {difficultyLevels.map((item) => <option key={item.key} value={item.key}>{item.label}</option>)}
                        </select>
                        <select
                          value={question.question_type}
                          onChange={(event) => updateQuestion(question.id, { question_type: event.target.value })}
                          className="w-full rounded-lg border border-[#27272A] bg-[#0f0f14] px-2 py-2 text-xs text-white outline-none"
                        >
                          {questionTypes.map((item) => <option key={item.key} value={item.key}>{item.label}</option>)}
                        </select>
                        <input
                          type="number"
                          min={1}
                          value={question.marks}
                          onChange={(event) => updateQuestion(question.id, { marks: Number.parseInt(event.target.value, 10) || 1 })}
                          className="w-full rounded-lg border border-[#27272A] bg-[#0f0f14] px-2 py-2 text-xs text-white outline-none"
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => regenerateQuestion(question)}
                            disabled={regeneratingId === question.id}
                            className="inline-flex items-center justify-center gap-1 rounded-lg border border-indigo-500/20 bg-indigo-500/10 px-2 py-2 text-[10px] font-bold text-indigo-300 hover:bg-indigo-500/15 disabled:opacity-70"
                          >
                            {regeneratingId === question.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <RotateCcw className="h-3 w-3" />}
                            Regen
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteQuestion(question.id)}
                            className="inline-flex items-center justify-center gap-1 rounded-lg border border-red-500/20 bg-red-500/10 px-2 py-2 text-[10px] font-bold text-red-300 hover:bg-red-500/15"
                          >
                            <Trash2 className="h-3 w-3" />
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
