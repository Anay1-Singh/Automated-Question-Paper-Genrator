"use client";

import { Eye, Download, Trash2 } from "lucide-react";

export default function PaperTable({ papers }) {
  return (
    <div className="flex flex-col border border-zinc-800 bg-[#09090B] rounded-xl overflow-hidden select-none">
      
      {/* Table Header Row */}
      <div className="bg-zinc-950/40 px-4 py-3 border-b border-zinc-800 flex items-center justify-between">
        <span className="text-white font-bold text-xs">
          Recent Question Papers
        </span>
        <span className="text-zinc-550 text-[10px]">
          Showing latest {papers.length} drafts
        </span>
      </div>

      {/* Responsive Table Wrapper */}
      <div className="overflow-x-auto w-full">
        <table className="w-full text-left border-collapse text-[11px] min-w-[500px]">
          <thead>
            <tr className="border-b border-zinc-900 text-zinc-500 uppercase tracking-wider text-[9px] font-semibold bg-black/10 select-none">
              <th className="py-2.5 px-4">Title</th>
              <th className="py-2.5 px-4">Subject</th>
              <th className="py-2.5 px-4">Marks</th>
              <th className="py-2.5 px-4">Generated Date</th>
              <th className="py-2.5 px-4 text-center">Status</th>
              <th className="py-2.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-900 font-sans">
            {papers.map((row) => (
              <tr
                key={row.id}
                className="hover:bg-zinc-900/10 transition-colors"
              >
                {/* Title */}
                <td className="py-3 px-4 text-zinc-100 font-semibold max-w-[200px] truncate">
                  {row.title}
                </td>
                
                {/* Subject */}
                <td className="py-3 px-4 text-zinc-400 font-light">
                  {row.subject}
                </td>
                
                {/* Marks */}
                <td className="py-3 px-4 font-mono text-zinc-300 font-medium">
                  {row.marks}
                </td>
                
                {/* Date */}
                <td className="py-3 px-4 text-zinc-500 font-light">
                  {row.date}
                </td>
                
                {/* Status Badges */}
                <td className="py-3 px-4 text-center">
                  <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-semibold font-mono tracking-wide ${
                    row.status === "Approved"
                      ? "bg-emerald-950/40 text-emerald-400 border border-emerald-900/50"
                      : row.status === "Draft"
                      ? "bg-amber-950/40 text-amber-400 border border-amber-900/50"
                      : "bg-blue-950/40 text-blue-400 border border-blue-900/50"
                  }`}>
                    {row.status}
                  </span>
                </td>
                
                {/* Action Buttons */}
                <td className="py-3 px-4 text-right">
                  <div className="flex items-center justify-end gap-3.5 text-zinc-500">
                    <button
                      title="Preview Paper"
                      className="hover:text-white transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    <button
                      title="Download PDF"
                      className="hover:text-white transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                    <button
                      title="Delete Draft"
                      className="hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
