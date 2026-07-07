import {
  Target,
  AlertCircle,
  Clock,
  BookOpen,
  CheckCircle,
  HelpCircle,
  Award
} from 'lucide-react'

const examAreas = [
  {
    topic: 'CPU Scheduling Algorithms',
    priority: 'High',
    reason: 'Heavy focus on numerical questions (FCFS, Round Robin) in past University exams.',
    badgeClass: 'text-red-400 bg-red-500/10 border-red-500/20'
  },
  {
    topic: 'Deadlock necessary conditions & Banker\'s Algorithm',
    priority: 'High',
    reason: 'Frequently tested for resource allocation verification and safety algorithm tracing.',
    badgeClass: 'text-red-400 bg-red-500/10 border-red-500/20'
  },
  {
    topic: 'Paging vs Segmentation comparison',
    priority: 'Medium',
    reason: 'Common conceptual distinction question asked in descriptive papers.',
    badgeClass: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20'
  },
  {
    topic: 'Process states transitions',
    priority: 'Medium',
    reason: 'Typically tested as a 5-mark short answer diagram illustration.',
    badgeClass: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20'
  },
  {
    topic: 'Semaphore implementation & IPC',
    priority: 'Low',
    reason: 'Appears occasionally in theory-based multi-threading questions.',
    badgeClass: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
  }
]

const studyOrder = [
  { topic: 'Process Scheduling Algorithms', time: '2 hours' },
  { topic: 'Deadlock Avoidance (Banker\'s Algorithm)', time: '3 hours' },
  { topic: 'Virtual Memory & Page Replacement', time: '3 hours' },
  { topic: 'Inter-process Communication & Semaphores', time: '2 hours' },
  { topic: 'Process Lifecycle & Context Switching', time: '2 hours' }
]

const prepTimeBreakdown = [
  { section: 'Process Management', hours: 4, pct: 100 },
  { section: 'Memory Management', hours: 3, pct: 75 },
  { section: 'Deadlock Control', hours: 3, pct: 60 },
  { section: 'IPC & Synchronization', hours: 2, pct: 40 }
]

const revisionTips = [
  'Focus on numeric calculations for Banker\'s Algorithm safety state validation.',
  'Draw clean process transition state diagrams to score full credits on state questions.',
  'Remember the difference between Internal and External Fragmentation and which algorithms cause them.',
  'Practice dry-running FIFO, LRU, and Optimal page replacement algorithms with reference strings.'
]

export default function StudyFocus() {
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-xl font-bold tracking-tight sm:text-2xl">Study Focus</h1>
        <p className="text-xs text-zinc-500">Personalized study recommendations based on your material.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Exam Areas & Study Order */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Likely Exam Areas */}
          <div className="rounded-2xl border border-[#1a1a2e] bg-[#0f0f14] p-5">
            <div className="flex items-center gap-2 mb-4">
              <Award className="h-4 w-4 text-emerald-400" />
              <h3 className="text-sm font-bold">Likely Exam Areas</h3>
            </div>
            <div className="space-y-3">
              {examAreas.map((area, idx) => (
                <div key={idx} className="flex gap-3 items-start p-3 rounded-xl border border-[#1f1f2f] bg-[#09090B] hover:border-emerald-500/10 transition-colors">
                  <span className={`rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider shrink-0 mt-0.5 ${area.badgeClass}`}>
                    {area.priority}
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white">{area.topic}</p>
                    <p className="text-[10px] text-zinc-500 mt-1">{area.reason}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Study Order */}
          <div className="rounded-2xl border border-[#1a1a2e] bg-[#0f0f14] p-5">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle className="h-4 w-4 text-emerald-400" />
              <h3 className="text-sm font-bold">Recommended Study Order</h3>
            </div>
            <div className="space-y-2.5">
              {studyOrder.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between gap-3 p-3 rounded-xl border border-[#1f1f2f] bg-[#09090B]">
                  <label className="flex items-center gap-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded bg-[#09090B] border border-[#27272A] text-emerald-600 focus:ring-emerald-500 focus:ring-offset-[#18181B] accent-emerald-600"
                      disabled
                    />
                    <span className="text-xs font-bold text-zinc-300">
                      {idx + 1}. {item.topic}
                    </span>
                  </label>
                  <span className="text-[10px] font-bold text-zinc-500 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {item.time}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Prep Time & Revision Tips */}
        <div className="space-y-6">
          
          {/* Estimated Prep Time */}
          <div className="rounded-2xl border border-[#1a1a2e] bg-[#0f0f14] p-5">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="h-4 w-4 text-emerald-400" />
              <h3 className="text-sm font-bold">Estimated Prep Time</h3>
            </div>
            <div className="text-center py-4 border-b border-[#1a1a2e]/50 mb-4">
              <p className="text-3xl font-black text-emerald-400">12 hours</p>
              <p className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider mt-1">Total Study Time</p>
            </div>
            <div className="space-y-3">
              {prepTimeBreakdown.map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-[10px] font-bold text-zinc-400">
                    <span>{item.section}</span>
                    <span>{item.hours}h</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-[#202033] overflow-hidden">
                    <div className="h-full rounded-full bg-emerald-500 transition-all duration-500" style={{ width: `${item.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Revision Tips */}
          <div className="rounded-2xl border border-[#1a1a2e] bg-[#0f0f14] p-5">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="h-4 w-4 text-emerald-400" />
              <h3 className="text-sm font-bold">Quick Revision Tips</h3>
            </div>
            <ul className="space-y-3">
              {revisionTips.map((tip, idx) => (
                <li key={idx} className="flex gap-2 text-[11px] leading-relaxed text-zinc-400">
                  <span className="text-emerald-400 font-bold shrink-0">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>
    </div>
  )
}
