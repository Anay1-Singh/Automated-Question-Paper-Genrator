"use client";

import Link from "next/link";
import { FileText } from "lucide-react";
import { useDashboardStore } from "@/lib/store";

export default function DocumentList() {
  const { documents } = useDashboardStore();

  // Show only the 4 most recent documents
  const recentDocs = documents.slice(0, 4);

  return (
    <div className="p-5 rounded-xl bg-[#09090B] border border-zinc-800 flex flex-col select-none">
      <div className="flex items-center justify-between border-b border-zinc-900 pb-3 mb-4">
        <span className="text-white font-bold text-xs">Recent Documents</span>
        <Link href="/dashboard/documents" className="text-blue-500 text-[10px] font-semibold hover:underline">
          View All
        </Link>
      </div>

      <div className="flex flex-col divide-y divide-zinc-900">
        {recentDocs.length === 0 ? (
          <div className="py-6 text-center text-xs text-zinc-500 font-light">
            No reference materials uploaded yet.
          </div>
        ) : (
          recentDocs.map((doc) => (
            <div key={doc.id} className="flex items-center gap-3 py-3 hover:bg-zinc-950/30 -mx-2 px-2 rounded transition-colors">
              <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-850 text-red-400 shrink-0">
                <FileText className="w-4 h-4" />
              </div>
              <div className="flex flex-col flex-1 min-w-0">
                <span className="text-zinc-200 text-[11px] font-semibold truncate">{doc.name}</span>
                <span className="text-zinc-550 text-[9px]">{doc.date}</span>
              </div>
              <span className="text-zinc-500 text-[9px] font-mono shrink-0">{doc.size}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
