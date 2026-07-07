import {
  Upload,
  FileText,
  BookOpen,
  Brain,
  TrendingUp,
  BarChart3,
  Activity,
  FileCheck,
  Sparkles,
  Clock,
} from 'lucide-react'

const topStats = [
  { label: 'Total Uploads', value: '12', icon: Upload, color: 'from-indigo-500/15 to-indigo-500/5 border-indigo-500/15 text-indigo-400' },
  { label: 'Papers Generated', value: '8', icon: FileCheck, color: 'from-blue-500/15 to-blue-500/5 border-blue-500/15 text-blue-400' },
  { label: 'Questions Created', value: '204', icon: BookOpen, color: 'from-violet-500/15 to-violet-500/5 border-violet-500/15 text-violet-400' },
  { label: 'Avg Bloom Score', value: '3.8', icon: Brain, color: 'from-sky-500/15 to-sky-500/5 border-sky-500/15 text-sky-400' },
]

const bloomUsage = [
  { label: 'Remember', pct: 45, color: 'bg-zinc-500', text: 'text-zinc-300' },
  { label: 'Understand', pct: 30, color: 'bg-blue-500', text: 'text-blue-300' },
  { label: 'Apply', pct: 55, color: 'bg-green-500', text: 'text-green-300' },
  { label: 'Analyze', pct: 40, color: 'bg-yellow-500', text: 'text-yellow-300' },
  { label: 'Evaluate', pct: 20, color: 'bg-orange-500', text: 'text-orange-300' },
  { label: 'Create', pct: 10, color: 'bg-purple-500', text: 'text-purple-300' },
]

const difficultyStats = [
  { label: 'Easy', pct: 35, color: 'text-emerald-400', ring: 'border-emerald-500', bg: 'bg-emerald-500/10' },
  { label: 'Medium', pct: 45, color: 'text-yellow-400', ring: 'border-yellow-500', bg: 'bg-yellow-500/10' },
  { label: 'Hard', pct: 20, color: 'text-red-400', ring: 'border-red-500', bg: 'bg-red-500/10' },
]

const recentActivity = [
  { text: 'Uploaded Operating Systems.pdf', time: '2 hours ago', icon: Upload, color: 'text-indigo-400 bg-indigo-500/10' },
  { text: 'Generated Mid-term Paper', time: '5 hours ago', icon: FileCheck, color: 'text-blue-400 bg-blue-500/10' },
  { text: 'Uploaded Data Structures Notes.docx', time: 'Yesterday', icon: Upload, color: 'text-indigo-400 bg-indigo-500/10' },
  { text: 'Created 25 questions from DBMS material', time: '2 days ago', icon: Sparkles, color: 'text-violet-400 bg-violet-500/10' },
  { text: 'Downloaded Computer Networks Quiz', time: '3 days ago', icon: FileText, color: 'text-sky-400 bg-sky-500/10' },
]

const subjectUsage = [
  { name: 'Operating Systems', pct: 75 },
  { name: 'Data Structures', pct: 55 },
  { name: 'DBMS', pct: 40 },
  { name: 'Computer Networks', pct: 25 },
]

export default function Analytics() {
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold tracking-tight sm:text-2xl">Analytics</h1>
        <p className="text-xs text-zinc-500 mt-1">Insights into your question paper generation and content usage.</p>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {topStats.map(stat => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className={`p-4 rounded-2xl bg-gradient-to-br border backdrop-blur-sm ${stat.color}`}>
              <div className="flex items-center justify-between mb-3">
                <Icon className="h-5 w-5 opacity-80" />
                <TrendingUp className="h-3.5 w-3.5 opacity-40" />
              </div>
              <p className="text-2xl font-black">{stat.value}</p>
              <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider mt-1">{stat.label}</p>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bloom's Taxonomy Usage */}
        <div className="rounded-2xl border border-[#1a1a2e] bg-[#0f0f14] p-5">
          <div className="flex items-center gap-2 mb-5">
            <Brain className="h-4 w-4 text-indigo-400" />
            <h3 className="text-sm font-bold">Bloom's Taxonomy Usage</h3>
          </div>
          <div className="space-y-3.5">
            {bloomUsage.map(b => (
              <div key={b.label} className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-bold ${b.text}`}>{b.label}</span>
                  <span className="text-[10px] font-bold text-zinc-500">{b.pct}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-[#202033]">
                  <div className={`h-full rounded-full ${b.color} transition-all duration-500`} style={{ width: `${b.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Difficulty Distribution */}
        <div className="rounded-2xl border border-[#1a1a2e] bg-[#0f0f14] p-5">
          <div className="flex items-center gap-2 mb-5">
            <BarChart3 className="h-4 w-4 text-indigo-400" />
            <h3 className="text-sm font-bold">Difficulty Distribution</h3>
          </div>
          <div className="flex items-center justify-around py-4">
            {difficultyStats.map(d => (
              <div key={d.label} className="flex flex-col items-center gap-2">
                <div className={`flex h-20 w-20 items-center justify-center rounded-full border-4 ${d.ring} ${d.bg}`}>
                  <span className={`text-xl font-black ${d.color}`}>{d.pct}%</span>
                </div>
                <span className={`text-xs font-bold ${d.color}`}>{d.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="rounded-2xl border border-[#1a1a2e] bg-[#0f0f14] p-5">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="h-4 w-4 text-indigo-400" />
            <h3 className="text-sm font-bold">Recent Activity</h3>
          </div>
          <div className="space-y-3">
            {recentActivity.map((item, idx) => {
              const Icon = item.icon
              return (
                <div key={idx} className="flex items-center gap-3 rounded-xl border border-[#202033] bg-[#09090B] p-3">
                  <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${item.color}`}>
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-zinc-300 truncate">{item.text}</p>
                    <p className="text-[10px] text-zinc-600 flex items-center gap-1 mt-0.5">
                      <Clock className="h-2.5 w-2.5" />
                      {item.time}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Subject Usage */}
        <div className="rounded-2xl border border-[#1a1a2e] bg-[#0f0f14] p-5">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="h-4 w-4 text-indigo-400" />
            <h3 className="text-sm font-bold">Subject Usage</h3>
          </div>
          <div className="space-y-4">
            {subjectUsage.map(sub => (
              <div key={sub.name} className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-300">{sub.name}</span>
                  <span className="text-[10px] font-bold text-zinc-500">{sub.pct}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-[#202033]">
                  <div className="h-full rounded-full bg-indigo-500 transition-all duration-500" style={{ width: `${sub.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
