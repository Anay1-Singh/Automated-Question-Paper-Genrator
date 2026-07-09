import {
  Activity,
  BarChart3,
  BookOpen,
  Brain,
  Clock,
  FileCheck,
  FileText,
  Sparkles,
  TrendingUp,
  Upload,
} from 'lucide-react'
import { useMemo } from 'react'

const bloomLevels = [
  { key: 'remember', label: 'Remember', color: 'bg-zinc-500', text: 'text-zinc-300' },
  { key: 'understand', label: 'Understand', color: 'bg-blue-500', text: 'text-blue-300' },
  { key: 'apply', label: 'Apply', color: 'bg-green-500', text: 'text-green-300' },
  { key: 'analyze', label: 'Analyze', color: 'bg-yellow-500', text: 'text-yellow-300' },
  { key: 'evaluate', label: 'Evaluate', color: 'bg-orange-500', text: 'text-orange-300' },
  { key: 'create', label: 'Create', color: 'bg-purple-500', text: 'text-purple-300' },
]

const difficultyLevels = [
  { key: 'easy', label: 'Easy', color: 'text-emerald-400', ring: 'border-emerald-500', bg: 'bg-emerald-500/10' },
  { key: 'medium', label: 'Medium', color: 'text-yellow-400', ring: 'border-yellow-500', bg: 'bg-yellow-500/10' },
  { key: 'hard', label: 'Hard', color: 'text-red-400', ring: 'border-red-500', bg: 'bg-red-500/10' },
]

function formatDate(value) {
  if (!value) return 'Recently'
  return new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(
    Math.ceil((new Date(value).getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
    'day',
  )
}

function countQuestions(papers) {
  return papers.reduce((total, paper) => total + (paper.questions?.length || paper.total_questions || 0), 0)
}

function percent(count, total) {
  if (!total) return 0
  return Math.round((count / total) * 100)
}

export default function Analytics({ documents = [], papers = [] }) {
  const questions = useMemo(
    () => papers.flatMap((paper) => (paper.questions || []).map((question) => ({ ...question, paper }))),
    [papers],
  )

  const totalQuestions = questions.length || countQuestions(papers)

  const bloomUsage = useMemo(() => {
    const counts = questions.reduce((acc, question) => {
      acc[question.bloom_level] = (acc[question.bloom_level] || 0) + 1
      return acc
    }, {})
    return bloomLevels.map((item) => ({
      ...item,
      pct: percent(counts[item.key] || 0, questions.length),
    }))
  }, [questions])

  const difficultyStats = useMemo(() => {
    const counts = questions.reduce((acc, question) => {
      acc[question.difficulty] = (acc[question.difficulty] || 0) + 1
      return acc
    }, {})
    return difficultyLevels.map((item) => ({
      ...item,
      pct: percent(counts[item.key] || 0, questions.length),
    }))
  }, [questions])

  const subjectUsage = useMemo(() => {
    const counts = papers.reduce((acc, paper) => {
      acc[paper.subject] = (acc[paper.subject] || 0) + 1
      return acc
    }, {})
    return Object.entries(counts)
      .map(([name, value]) => ({ name, pct: percent(value, Math.max(1, papers.length)) }))
      .sort((a, b) => b.pct - a.pct)
      .slice(0, 6)
  }, [papers])

  const recentActivity = useMemo(() => {
    const uploadItems = documents.map((document) => ({
      text: `Uploaded ${document.title}`,
      time: formatDate(document.created_at),
      icon: Upload,
      color: 'text-indigo-400 bg-indigo-500/10',
      createdAt: document.created_at,
    }))
    const paperItems = papers.map((paper) => ({
      text: `Generated ${paper.title}`,
      time: formatDate(paper.generated_at || paper.created_at),
      icon: Sparkles,
      color: 'text-violet-400 bg-violet-500/10',
      createdAt: paper.generated_at || paper.created_at,
    }))
    return [...uploadItems, ...paperItems]
      .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
      .slice(0, 5)
  }, [documents, papers])

  const topStats = [
    { label: 'Total Uploads', value: String(documents.length), icon: Upload, color: 'from-indigo-500/15 to-indigo-500/5 border-indigo-500/15 text-indigo-400' },
    { label: 'Papers Generated', value: String(papers.length), icon: FileCheck, color: 'from-blue-500/15 to-blue-500/5 border-blue-500/15 text-blue-400' },
    { label: 'Questions Created', value: String(totalQuestions), icon: BookOpen, color: 'from-violet-500/15 to-violet-500/5 border-violet-500/15 text-violet-400' },
    { label: 'Avg Marks', value: papers.length ? String(Math.round(papers.reduce((sum, paper) => sum + paper.total_marks, 0) / papers.length)) : '0', icon: Brain, color: 'from-sky-500/15 to-sky-500/5 border-sky-500/15 text-sky-400' },
  ]

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight sm:text-2xl">Analytics</h1>
        <p className="mt-1 text-xs text-zinc-500">Insights into generated papers and source document usage.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {topStats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className={`rounded-2xl border bg-gradient-to-br p-4 backdrop-blur-sm ${stat.color}`}>
              <div className="mb-3 flex items-center justify-between">
                <Icon className="h-5 w-5 opacity-80" />
                <TrendingUp className="h-3.5 w-3.5 opacity-40" />
              </div>
              <p className="text-2xl font-black">{stat.value}</p>
              <p className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">{stat.label}</p>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-[#1a1a2e] bg-[#0f0f14] p-5">
          <div className="mb-5 flex items-center gap-2">
            <Brain className="h-4 w-4 text-indigo-400" />
            <h3 className="text-sm font-bold">Bloom's Taxonomy Usage</h3>
          </div>
          <div className="space-y-3.5">
            {bloomUsage.map((item) => (
              <div key={item.key} className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-bold ${item.text}`}>{item.label}</span>
                  <span className="text-[10px] font-bold text-zinc-500">{item.pct}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-[#202033]">
                  <div className={`h-full rounded-full ${item.color} transition-all duration-500`} style={{ width: `${item.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-[#1a1a2e] bg-[#0f0f14] p-5">
          <div className="mb-5 flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-indigo-400" />
            <h3 className="text-sm font-bold">Difficulty Distribution</h3>
          </div>
          <div className="flex flex-wrap items-center justify-around gap-4 py-4">
            {difficultyStats.map((item) => (
              <div key={item.key} className="flex flex-col items-center gap-2">
                <div className={`flex h-20 w-20 items-center justify-center rounded-full border-4 ${item.ring} ${item.bg}`}>
                  <span className={`text-xl font-black ${item.color}`}>{item.pct}%</span>
                </div>
                <span className={`text-xs font-bold ${item.color}`}>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-[#1a1a2e] bg-[#0f0f14] p-5">
          <div className="mb-4 flex items-center gap-2">
            <Activity className="h-4 w-4 text-indigo-400" />
            <h3 className="text-sm font-bold">Recent Activity</h3>
          </div>
          <div className="space-y-3">
            {recentActivity.length === 0 ? (
              <p className="py-8 text-center text-xs text-zinc-600">Upload documents and generate papers to populate analytics.</p>
            ) : recentActivity.map((item) => {
              const Icon = item.icon
              return (
                <div key={`${item.text}-${item.createdAt}`} className="flex items-center gap-3 rounded-xl border border-[#202033] bg-[#09090B] p-3">
                  <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${item.color}`}>
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-semibold text-zinc-300">{item.text}</p>
                    <p className="mt-0.5 flex items-center gap-1 text-[10px] text-zinc-600">
                      <Clock className="h-2.5 w-2.5" />
                      {item.time}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="rounded-2xl border border-[#1a1a2e] bg-[#0f0f14] p-5">
          <div className="mb-4 flex items-center gap-2">
            <FileText className="h-4 w-4 text-indigo-400" />
            <h3 className="text-sm font-bold">Subject Usage</h3>
          </div>
          <div className="space-y-4">
            {subjectUsage.length === 0 ? (
              <p className="py-8 text-center text-xs text-zinc-600">No generated paper subjects yet.</p>
            ) : subjectUsage.map((subject) => (
              <div key={subject.name} className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-300">{subject.name}</span>
                  <span className="text-[10px] font-bold text-zinc-500">{subject.pct}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-[#202033]">
                  <div className="h-full rounded-full bg-indigo-500 transition-all duration-500" style={{ width: `${subject.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
