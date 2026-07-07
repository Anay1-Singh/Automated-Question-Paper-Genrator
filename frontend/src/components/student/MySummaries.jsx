import {
  FileText,
  BookOpen,
  Download,
  Eye,
  CalendarDays,
} from 'lucide-react'

const placeholderSummaries = [
  {
    id: 1,
    title: 'Operating Systems Unit 2',
    type: 'pdf',
    date: 'Jul 3, 2026',
    summary: 'This unit covers process management, including process states, scheduling algorithms (FCFS, SJF, Round Robin, Priority), and context switching. It also explores inter-process communication mechanisms such as shared memory and message passing. The chapter concludes with a detailed analysis of deadlock conditions and prevention strategies.',
    topics: ['Process Scheduling', 'Context Switching', 'Deadlock Prevention', 'IPC Mechanisms', 'CPU Scheduling Algorithms'],
  },
  {
    id: 2,
    title: 'Data Structures - Linked Lists',
    type: 'docx',
    date: 'Jul 1, 2026',
    summary: 'Comprehensive coverage of singly linked lists, doubly linked lists, and circular linked lists. Key operations including insertion, deletion, traversal, and reversal are covered with time complexity analysis. The material also compares linked lists with arrays in terms of memory allocation and access patterns.',
    topics: ['Singly Linked List', 'Doubly Linked List', 'Circular Linked List', 'Time Complexity', 'Memory Allocation'],
  },
  {
    id: 3,
    title: 'DBMS Normalization Notes',
    type: 'txt',
    date: 'Jun 28, 2026',
    summary: 'These notes outline the principles of database normalization from 1NF through BCNF. Each normal form is illustrated with examples showing functional dependencies and decomposition techniques. The material highlights common anomalies (insertion, update, deletion) that normalization resolves.',
    topics: ['First Normal Form', 'Second Normal Form', 'Third Normal Form', 'BCNF', 'Functional Dependencies'],
  },
]

const typeIcons = {
  pdf: { icon: FileText, cls: 'text-red-400 bg-red-500/10 border-red-500/20' },
  docx: { icon: BookOpen, cls: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
  txt: { icon: FileText, cls: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
}

export default function MySummaries() {
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight sm:text-2xl">My Summaries</h1>
        <p className="text-xs text-zinc-500 mt-1">AI-generated summaries of your uploaded notes.</p>
      </div>

      <div className="space-y-4">
        {placeholderSummaries.map(s => {
          const typeConfig = typeIcons[s.type] || typeIcons.txt
          const Icon = typeConfig.icon
          return (
            <article key={s.id} className="rounded-2xl border border-[#1a1a2e] bg-[#0f0f14] p-5 transition-colors hover:border-emerald-500/15">
              {/* Header */}
              <div className="flex items-start gap-3 mb-4">
                <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${typeConfig.cls}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-bold text-white">{s.title}</h3>
                  <p className="text-[10px] text-zinc-500 flex items-center gap-1.5 mt-1">
                    <CalendarDays className="h-3 w-3" />
                    Uploaded {s.date}
                  </p>
                </div>
              </div>

              {/* Summary paragraph */}
              <p className="text-xs leading-relaxed text-zinc-400 mb-4">{s.summary}</p>

              {/* Topic tags */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {s.topics.map(topic => (
                  <span key={topic} className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400">
                    {topic}
                  </span>
                ))}
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-3.5 py-2 text-xs font-bold text-emerald-300 transition-colors hover:bg-emerald-500/20">
                  <Eye className="h-3.5 w-3.5" />
                  View Full Summary
                </button>
                <button className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-3.5 py-2 text-xs font-bold text-emerald-300 transition-colors hover:bg-emerald-500/20">
                  <Download className="h-3.5 w-3.5" />
                  Download Summary
                </button>
              </div>
            </article>
          )
        })}
      </div>
    </div>
  )
}
