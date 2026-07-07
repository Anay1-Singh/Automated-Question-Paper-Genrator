import { useState } from 'react'
import {
  Star,
  ChevronDown,
  BookOpen,
  HelpCircle,
  Hash,
  AlertCircle,
  Network
} from 'lucide-react'

const placeholderTopics = [
  {
    id: 1,
    name: 'CPU Scheduling Algorithms',
    desc: 'Determines the execution order of processes in the ready queue using preemptive or non-preemptive algorithms.',
    importance: 'High',
    frequency: 14
  },
  {
    id: 2,
    name: 'Deadlock Necessary Conditions',
    desc: 'Mutual exclusion, hold and wait, no preemption, and circular wait must hold simultaneously for a deadlock to occur.',
    importance: 'High',
    frequency: 11
  },
  {
    id: 3,
    name: 'Paging & Virtual Memory',
    desc: 'Memory management scheme that maps virtual addresses to physical pages to prevent fragmentation.',
    importance: 'High',
    frequency: 12
  },
  {
    id: 4,
    name: 'Inter-process Communication',
    desc: 'Mechanisms like shared memory and message queues allowing processes to synchronize and exchange data.',
    importance: 'Medium',
    frequency: 8
  },
  {
    id: 5,
    name: 'Singly vs Doubly Linked Lists',
    desc: 'Comparison of node pointers, memory overhead, and implementation complexity of linear lists.',
    importance: 'Medium',
    frequency: 9
  },
  {
    id: 6,
    name: 'Database Normal Forms',
    desc: 'The guidelines (1NF, 2NF, 3NF, BCNF) designed to minimize redundancy and dependency anomalies in schemas.',
    importance: 'High',
    frequency: 15
  },
  {
    id: 7,
    name: 'TCP/IP Handshake Protocol',
    desc: 'The three-step synchronization sequence used to establish a reliable connection over network sockets.',
    importance: 'Medium',
    frequency: 7
  },
  {
    id: 8,
    name: 'Process States lifecycle',
    desc: 'Transitions of a process between New, Ready, Running, Waiting, and Terminated execution statuses.',
    importance: 'Low',
    frequency: 4
  }
]

const vocabulary = [
  { term: 'Context Switch', def: 'The process of storing and restoring the state (CPU registers) of a process so execution can resume later.' },
  { term: 'Mutual Exclusion', def: 'A condition where only one process at a time can use a shared resource or critical section.' },
  { term: 'Thrashing', def: 'A state where the system spends more time swapping pages in and out of disk than executing useful processes.' },
  { term: 'ACID Properties', def: 'Atomicity, Consistency, Isolation, and Durability - properties that guarantee reliable transaction processing in database systems.' },
  { term: 'Packet Swapping', def: 'A method of grouping data transmitted over a digital network into packets containing routing information.' }
]

const importanceBadgeColors = {
  High: 'text-red-400 bg-red-500/10 border-red-500/20',
  Medium: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
  Low: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
}

export default function ImportantTopics() {
  const [selectedDoc, setSelectedDoc] = useState('os-unit2')

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-xl font-bold tracking-tight sm:text-2xl">Important Topics</h1>
        <p className="text-xs text-zinc-500">Key concepts extracted from your study material.</p>
      </div>

      {/* Document Selector */}
      <div className="rounded-2xl border border-[#1a1a2e] bg-[#0f0f14] p-4 max-w-md">
        <label className="mb-1.5 block text-xs font-bold text-zinc-300">Select a document to view its topics</label>
        <div className="relative">
          <select
            value={selectedDoc}
            onChange={e => setSelectedDoc(e.target.value)}
            className="w-full appearance-none rounded-xl border border-[#27272A] bg-[#09090B] px-3 py-2.5 pr-10 text-xs text-white outline-none transition-colors focus:border-emerald-500"
          >
            <option value="os-unit2">Operating Systems Unit 2 (Active)</option>
            <option value="ds-linked-list">Data Structures - Linked Lists</option>
            <option value="dbms-normalization">DBMS Normalization Notes</option>
            <option value="cn-tcp-ip">Computer Networks - TCP/IP</option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
        </div>
      </div>

      {/* Grid of Topics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {placeholderTopics.map(topic => (
          <article
            key={topic.id}
            className="rounded-xl border border-[#1f1f2f] bg-[#0b0b10] p-4 transition-colors hover:border-emerald-500/25 flex flex-col justify-between min-h-[170px]"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <h4 className="text-xs font-bold text-white line-clamp-1" title={topic.name}>{topic.name}</h4>
                <span className={`rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider shrink-0 ${importanceBadgeColors[topic.importance]}`}>
                  {topic.importance}
                </span>
              </div>
              <p className="mt-2 text-[11px] leading-relaxed text-zinc-400 line-clamp-3">{topic.desc}</p>
            </div>
            
            <div className="mt-4 pt-2 border-t border-[#1a1a2e] flex items-center justify-between text-[10px] text-zinc-500 font-semibold">
              <span className="flex items-center gap-1.5">
                <Hash className="h-3 w-3 text-emerald-500" />
                Mentioned {topic.frequency} times
              </span>
              <button className="text-[10px] font-bold text-emerald-400 hover:underline">
                Read Section
              </button>
            </div>
          </article>
        ))}
      </div>

      {/* Key Vocabulary */}
      <div className="rounded-2xl border border-[#1a1a2e] bg-[#0f0f14] p-5">
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="h-4 w-4 text-emerald-400" />
          <h3 className="text-sm font-bold">Key Vocabulary</h3>
        </div>
        <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {vocabulary.map((v, i) => (
            <div key={i} className="p-3.5 rounded-xl border border-[#1f1f2f] bg-[#09090B] space-y-1">
              <dt className="text-xs font-bold text-emerald-400 flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0" />
                {v.term}
              </dt>
              <dd className="text-[11px] leading-relaxed text-zinc-400 pl-3.5">{v.def}</dd>
            </div>
          ))}
        </dl>
      </div>

      {/* Concept Map Placeholder */}
      <div className="rounded-2xl border border-dashed border-emerald-500/20 bg-[#0b0b10] p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Network className="h-4 w-4 text-emerald-400" />
            <h3 className="text-sm font-bold">Concept Map</h3>
          </div>
          <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
            Coming Soon
          </span>
        </div>
        
        {/* Simple visual mock diagram */}
        <div className="flex flex-col items-center justify-center py-10 text-center relative overflow-hidden bg-emerald-950/5 rounded-xl border border-[#1a1a2e]">
          <svg className="w-64 h-36 opacity-30 pointer-events-none" viewBox="0 0 200 100">
            <line x1="100" y1="50" x2="50" y2="25" stroke="#10b981" strokeWidth="1" strokeDasharray="3" />
            <line x1="100" y1="50" x2="150" y2="25" stroke="#10b981" strokeWidth="1" strokeDasharray="3" />
            <line x1="100" y1="50" x2="50" y2="75" stroke="#10b981" strokeWidth="1" strokeDasharray="3" />
            <line x1="100" y1="50" x2="150" y2="75" stroke="#10b981" strokeWidth="1" strokeDasharray="3" />
            
            <circle cx="100" cy="50" r="10" fill="#09090b" stroke="#10b981" strokeWidth="2" />
            <circle cx="50" cy="25" r="8" fill="#09090b" stroke="#10b981" strokeWidth="1.5" />
            <circle cx="150" cy="25" r="8" fill="#09090b" stroke="#10b981" strokeWidth="1.5" />
            <circle cx="50" cy="75" r="8" fill="#09090b" stroke="#10b981" strokeWidth="1.5" />
            <circle cx="150" cy="75" r="8" fill="#09090b" stroke="#10b981" strokeWidth="1.5" />
          </svg>
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b10] via-transparent to-transparent" />
          <p className="text-xs font-semibold text-zinc-400 relative z-10">Interactive concept map coming soon</p>
          <p className="text-[10px] text-zinc-600 mt-1 max-w-xs relative z-10">
            Our AI will visually map how scheduling, memory pages, and lock states correlate to build a comprehensive knowledge graph.
          </p>
        </div>
      </div>
    </div>
  )
}
