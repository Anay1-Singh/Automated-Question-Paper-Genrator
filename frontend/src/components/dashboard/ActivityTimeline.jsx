import { FileUp, FileDown, CheckCircle, Edit, Key, Circle } from 'lucide-react'

export default function ActivityTimeline() {
  const activities = [
    {
      title: 'Downloaded PDF',
      description: 'CST-402 Deep Learning final exam paper downloaded',
      time: '12 mins ago',
      icon: FileDown,
      color: 'text-blue-500 bg-blue-500/5 border-blue-500/15'
    },
    {
      title: 'Generated Question Paper',
      description: 'Draft compiled for CST-402 (35 Qs, 100 Marks)',
      time: '1 hour ago',
      icon: CheckCircle,
      color: 'text-emerald-500 bg-emerald-500/5 border-emerald-500/15'
    },
    {
      title: 'Uploaded Document',
      description: 'Syllabus_Unit_3.pdf uploaded to Computer Science',
      time: '3 hours ago',
      icon: FileUp,
      color: 'text-purple-500 bg-purple-500/5 border-purple-500/15'
    },
    {
      title: 'Edited Exam draft',
      description: 'Modified Q3 marks allocation in CST-402 draft',
      time: 'Yesterday',
      icon: Edit,
      color: 'text-amber-500 bg-amber-500/5 border-amber-500/15'
    },
    {
      title: 'Secure Account Authentication',
      time: '2 days ago',
      description: 'Logged in from Firefox (Windows 11, IP: 192.168.1.45)',
      icon: Key,
      color: 'text-zinc-500 bg-zinc-500/5 border-zinc-500/15'
    }
  ]

  return (
    <div className="bg-[#18181B] border border-[#27272A] p-5 rounded-xl text-left shadow-sm">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#27272A]/70 mb-5">
        <div className="flex flex-col">
          <span className="text-xs font-bold text-white uppercase tracking-wider">Activity Logs</span>
          <span className="text-[10px] text-zinc-500 font-mono mt-0.5">Real-time workspace activity audit</span>
        </div>
        <Circle className="w-2 h-2 text-emerald-500 fill-emerald-500 animate-pulse" />
      </div>

      {/* Timeline items */}
      <div className="relative pl-6 space-y-6 before:absolute before:top-2 before:bottom-2 before:left-[11px] before:w-px before:bg-[#27272A] z-10">
        
        {activities.map((act, index) => {
          const Icon = act.icon
          return (
            <div key={index} className="relative flex gap-4 text-xs sm:text-sm">
              {/* Outer timeline indicator dot */}
              <div className="absolute left-[-22px] top-1">
                <div className={`w-6 h-6 rounded-full border flex items-center justify-center bg-[#18181B] ${act.color}`}>
                  <Icon className="w-3 h-3" />
                </div>
              </div>

              {/* Log Detail */}
              <div className="flex-grow flex flex-col gap-0.5">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-white leading-none">{act.title}</span>
                  <span className="text-[9px] text-zinc-500 font-mono leading-none">{act.time}</span>
                </div>
                <p className="text-[11px] text-[#A1A1AA] leading-relaxed mt-1">
                  {act.description}
                </p>
              </div>

            </div>
          )
        })}
      </div>

    </div>
  )
}
