import {
  AlertCircle,
  Award,
  BookOpen,
  CheckCircle,
  Clock,
  Loader2,
  Upload,
} from 'lucide-react'
import { useMemo } from 'react'

const priorityClasses = {
  High: 'text-red-400 bg-red-500/10 border-red-500/20',
  Medium: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
  Low: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
}

function buildFocusData(documents) {
  const processed = documents.filter((document) => ['processed', 'ready'].includes(document.status))
  const topicCounts = new Map()

  for (const document of processed) {
    for (const topic of document.topics || []) {
      const key = topic.trim()
      if (!key) continue
      const existing = topicCounts.get(key) || {
        topic: key,
        count: 0,
        wordCount: 0,
        readingMinutes: 0,
        subjects: new Set(),
      }
      existing.count += 1
      existing.wordCount += document.word_count || 0
      existing.readingMinutes += document.reading_time_minutes || 0
      if (document.subject) existing.subjects.add(document.subject)
      topicCounts.set(key, existing)
    }
  }

  const areas = [...topicCounts.values()]
    .map((item) => {
      const priority = item.count >= 3 ? 'High' : item.count >= 2 ? 'Medium' : 'Low'
      return {
        ...item,
        priority,
        reason: `Extracted from ${item.count} processed document${item.count === 1 ? '' : 's'}${item.subjects.size ? ` in ${[...item.subjects].join(', ')}` : ''}.`,
        hours: Math.max(1, Math.ceil((item.readingMinutes || 20) / 60)),
      }
    })
    .sort((a, b) => b.count - a.count || b.wordCount - a.wordCount)

  const totalMinutes = processed.reduce((sum, document) => sum + (document.reading_time_minutes || 0), 0)
  const totalHours = Math.max(0, Math.ceil(totalMinutes / 60))
  return {
    processed,
    areas,
    totalHours,
  }
}

export default function StudyFocus({
  documents = [],
  loading = false,
  error = '',
  onUploadClick,
}) {
  const { processed, areas, totalHours } = useMemo(
    () => buildFocusData(documents),
    [documents],
  )

  const studyOrder = areas.slice(0, 8)
  const prepBreakdown = processed
    .slice()
    .sort((a, b) => (b.reading_time_minutes || 0) - (a.reading_time_minutes || 0))
    .slice(0, 6)

  const revisionTips = useMemo(() => {
    const tips = []
    if (areas[0]) tips.push(`Start with ${areas[0].topic}; it appears most often in your processed material.`)
    if (processed.some((document) => (document.summary || '').length > 0)) tips.push('Review each generated summary before attempting detailed revision.')
    if (processed.some((document) => (document.keywords || []).length > 10)) tips.push('Use extracted keywords as quick recall prompts after reading each document.')
    if (processed.length > 1) tips.push('Compare overlapping topics across documents to strengthen conceptual links.')
    return tips
  }, [areas, processed])

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-xl font-bold tracking-tight sm:text-2xl">Study Focus</h1>
        <p className="text-xs text-zinc-500">Personalized study recommendations from your processed notes.</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center gap-2 rounded-2xl border border-[#1a1a2e] bg-[#0f0f14] py-16 text-xs font-semibold text-zinc-500">
          <Loader2 className="h-4 w-4 animate-spin text-emerald-400" />
          Loading study focus...
        </div>
      ) : error ? (
        <div className="flex items-start gap-2 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-300">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          {error}
        </div>
      ) : areas.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <div className="rounded-2xl border border-[#1a1a2e] bg-[#0f0f14] p-5">
              <div className="mb-4 flex items-center gap-2">
                <Award className="h-4 w-4 text-emerald-400" />
                <h3 className="text-sm font-bold">Priority Study Areas</h3>
              </div>
              <div className="space-y-3">
                {areas.slice(0, 8).map((area) => (
                  <div key={area.topic} className="flex items-start gap-3 rounded-xl border border-[#1f1f2f] bg-[#09090B] p-3 transition-colors hover:border-emerald-500/10">
                    <span className={`mt-0.5 shrink-0 rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${priorityClasses[area.priority]}`}>
                      {area.priority}
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-white">{area.topic}</p>
                      <p className="mt-1 text-[10px] text-zinc-500">{area.reason}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-[#1a1a2e] bg-[#0f0f14] p-5">
              <div className="mb-4 flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-400" />
                <h3 className="text-sm font-bold">Recommended Study Order</h3>
              </div>
              <div className="space-y-2.5">
                {studyOrder.map((item, index) => (
                  <div key={item.topic} className="flex items-center justify-between gap-3 rounded-xl border border-[#1f1f2f] bg-[#09090B] p-3">
                    <label className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border border-[#27272A] bg-[#09090B] text-emerald-600 accent-emerald-600 focus:ring-emerald-500 focus:ring-offset-[#18181B]"
                      />
                      <span className="text-xs font-bold text-zinc-300">
                        {index + 1}. {item.topic}
                      </span>
                    </label>
                    <span className="flex items-center gap-1 text-[10px] font-bold text-zinc-500">
                      <Clock className="h-3 w-3" />
                      {item.hours}h
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl border border-[#1a1a2e] bg-[#0f0f14] p-5">
              <div className="mb-4 flex items-center gap-2">
                <Clock className="h-4 w-4 text-emerald-400" />
                <h3 className="text-sm font-bold">Estimated Prep Time</h3>
              </div>
              <div className="mb-4 border-b border-[#1a1a2e]/50 py-4 text-center">
                <p className="text-3xl font-black text-emerald-400">{totalHours}h</p>
                <p className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">Total Study Time</p>
              </div>
              <div className="space-y-3">
                {prepBreakdown.map((document) => {
                  const pct = totalHours ? Math.min(100, Math.round(((document.reading_time_minutes || 0) / (totalHours * 60)) * 100)) : 0
                  return (
                    <div key={document.id} className="space-y-1">
                      <div className="flex justify-between gap-3 text-[10px] font-bold text-zinc-400">
                        <span className="truncate">{document.title}</span>
                        <span>{document.reading_time_minutes || 0}m</span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-[#202033]">
                        <div className="h-full rounded-full bg-emerald-500 transition-all duration-500" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="rounded-2xl border border-[#1a1a2e] bg-[#0f0f14] p-5">
              <div className="mb-4 flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-emerald-400" />
                <h3 className="text-sm font-bold">Quick Revision Tips</h3>
              </div>
              <ul className="space-y-3">
                {revisionTips.map((tip) => (
                  <li key={tip} className="flex gap-2 text-[11px] leading-relaxed text-zinc-400">
                    <span className="shrink-0 font-bold text-emerald-400">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#34344a] bg-[#0f0f14] px-6 py-16 text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10">
            <TargetIcon />
          </div>
          <p className="text-xs font-semibold text-zinc-500">No study focus yet</p>
          <p className="mt-1 max-w-sm text-[10px] text-zinc-600">Upload and process notes to build a personalized revision plan.</p>
          <button
            type="button"
            onClick={onUploadClick}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-emerald-500"
          >
            <Upload className="h-3.5 w-3.5" />
            Upload Notes
          </button>
        </div>
      )}
    </div>
  )
}

function TargetIcon() {
  return <Award className="h-5 w-5 text-emerald-400/60" />
}
