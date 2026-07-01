import { FileDown, Printer, Trash2, CheckCircle2, FileText, Plus } from 'lucide-react'

export default function RecentPapers({
  papers = [],
  onDownload,
  onDelete,
  onGenerateClick
}) {
  return (
    <div className="bg-[#18181B] border border-[#27272A] rounded-xl overflow-hidden shadow-sm">
      {/* Panel Header */}
      <div className="px-6 py-4 border-b border-[#27272A] flex items-center justify-between">
        <div className="flex flex-col text-left">
          <span className="text-xs font-bold text-white uppercase tracking-wider">Recent Question Papers</span>
          <span className="text-[10px] text-zinc-500 font-mono mt-0.5">Compiled exam blueprints and PDFs</span>
        </div>
        <button
          onClick={onGenerateClick}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-500 hover:text-blue-400 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          New Paper
        </button>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto w-full">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#27272A]/80 text-[10px] font-bold text-zinc-500 uppercase tracking-wider bg-[#09090B]/30 select-none">
              <th className="px-6 py-4.5">Title</th>
              <th className="px-6 py-4.5">Subject</th>
              <th className="px-6 py-4.5">Questions</th>
              <th className="px-6 py-4.5">Max Marks</th>
              <th className="px-6 py-4.5">Created</th>
              <th className="px-6 py-4.5">Status</th>
              <th className="px-6 py-4.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#27272A]/60">
            {papers.map((paper) => (
              <tr
                key={paper.id}
                className="text-xs sm:text-sm hover:bg-[#09090B]/10 transition-colors duration-150"
              >
                {/* Title */}
                <td className="px-6 py-4 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/5 border border-blue-500/10 flex items-center justify-center text-blue-500 shrink-0">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="font-semibold text-white truncate max-w-[160px] sm:max-w-[200px]">
                      {paper.title}
                    </span>
                    <span className="text-[10px] text-zinc-500 font-mono mt-0.5">{paper.code}</span>
                  </div>
                </td>

                {/* Subject */}
                <td className="px-6 py-4 text-zinc-300 font-medium text-left">
                  {paper.subject}
                </td>

                {/* Questions */}
                <td className="px-6 py-4 text-zinc-400 font-mono text-left">
                  {paper.questionsCount} Qs
                </td>

                {/* Max Marks */}
                <td className="px-6 py-4 text-zinc-400 font-mono text-left">
                  {paper.maxMarks} Pts
                </td>

                {/* Created */}
                <td className="px-6 py-4 text-zinc-500 font-mono text-left">
                  {paper.created}
                </td>

                {/* Status Badges */}
                <td className="px-6 py-4 text-left">
                  {paper.status === 'Completed' ? (
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded border border-emerald-500/25 bg-emerald-500/5 text-emerald-400 text-[10px] font-semibold">
                      <span className="w-1 h-1 bg-emerald-500 rounded-full" />
                      Ready
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded border border-amber-500/25 bg-amber-500/5 text-amber-400 text-[10px] font-semibold">
                      <span className="w-1 h-1 bg-amber-500 rounded-full animate-pulse" />
                      Draft
                    </span>
                  )}
                </td>

                {/* Actions Button Row */}
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => onDownload && onDownload(paper.id)}
                      className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800/40 rounded-lg transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-blue-500"
                      aria-label={`Download ${paper.title}`}
                    >
                      <FileDown className="w-4 h-4" />
                    </button>
                    <button
                      className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800/40 rounded-lg transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-blue-500"
                      aria-label="Print paper"
                    >
                      <Printer className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete && onDelete(paper.id)}
                      className="p-1.5 text-zinc-500 hover:text-red-400 hover:bg-zinc-800/40 rounded-lg transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-blue-500"
                      aria-label={`Delete ${paper.title}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
