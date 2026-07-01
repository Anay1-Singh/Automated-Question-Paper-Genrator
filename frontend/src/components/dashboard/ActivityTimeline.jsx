"use client";

import { UploadCloud, FileText, Download, Database, Clock } from "lucide-react";

const EVENTS = [
  {
    icon: UploadCloud,
    text: "Uploaded Machine Learning.pdf",
    time: "2 hours ago",
    color: "text-blue-500"
  },
  {
    icon: FileText,
    text: "Generated Operating Systems Mid Sem paper",
    time: "4 hours ago",
    color: "text-emerald-500"
  },
  {
    icon: Download,
    text: "Downloaded CS-101 Question Paper (PDF)",
    time: "Yesterday",
    color: "text-zinc-400"
  },
  {
    icon: Database,
    text: "Created Question Bank for Data Structures",
    time: "2 days ago",
    color: "text-amber-500"
  }
];

export default function ActivityTimeline() {
  return (
    <div className="p-5 rounded-xl bg-[#09090B] border border-zinc-800 flex flex-col select-none">
      <div className="flex items-center gap-2 border-b border-zinc-900 pb-3 mb-4">
        <Clock className="w-4 h-4 text-blue-500 shrink-0" />
        <span className="text-white font-bold text-xs">Recent Activity</span>
      </div>

      <div className="relative flex flex-col">
        {EVENTS.map((event, idx) => {
          const Icon = event.icon;
          const isLast = idx === EVENTS.length - 1;

          return (
            <div key={idx} className="flex gap-3 relative">
              {/* Vertical connector line */}
              {!isLast && (
                <div className="absolute left-[11px] top-7 bottom-0 w-px bg-zinc-900" />
              )}

              {/* Icon bullet */}
              <div className={`p-1.5 rounded-lg bg-zinc-950 border border-zinc-850 ${event.color} shrink-0 z-10`}>
                <Icon className="w-3 h-3" />
              </div>

              {/* Event details */}
              <div className="flex flex-col pb-5 min-w-0">
                <span className="text-zinc-200 text-[11px] font-medium truncate">{event.text}</span>
                <span className="text-zinc-550 text-[9px] mt-0.5">{event.time}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
