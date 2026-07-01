import { Trash2, FileText, CheckCircle2, Loader2, Plus } from 'lucide-react'
import EmptyState from './EmptyState'

export default function DocumentsTable({
  documents = [],
  onDelete,
  onUploadClick
}) {
  if (documents.length === 0) {
    return <EmptyState onUpload={onUploadClick} />
  }

  return (
    <div className="bg-[#18181B] border border-[#27272A] rounded-xl overflow-hidden shadow-sm">
      {/* Panel Header */}
      <div className="px-6 py-4 border-b border-[#27272A] flex items-center justify-between">
        <div className="flex flex-col text-left">
          <span className="text-xs font-bold text-white uppercase tracking-wider">Course Materials</span>
          <span className="text-[10px] text-zinc-500 font-mono mt-0.5">Syllabus details and reference books</span>
        </div>
        <button
          onClick={onUploadClick}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-500 hover:text-blue-400 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          Upload Document
        </button>
      </div>

      {/* Responsive Scrollable Container */}
      <div className="overflow-x-auto w-full">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#27272A]/80 text-[10px] font-bold text-zinc-500 uppercase tracking-wider bg-[#09090B]/30 select-none">
              <th className="px-6 py-4.5">File Name</th>
              <th className="px-6 py-4.5">Subject</th>
              <th className="px-6 py-4.5">Upload Date</th>
              <th className="px-6 py-4.5">Status</th>
              <th className="px-6 py-4.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#27272A]/60">
            {documents.map((doc) => (
              <tr
                key={doc.id}
                className="text-xs sm:text-sm hover:bg-[#09090B]/10 transition-colors duration-150"
              >
                {/* File name */}
                <td className="px-6 py-4 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/5 border border-blue-500/10 flex items-center justify-center text-blue-500 shrink-0">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="font-semibold text-white truncate max-w-[160px] sm:max-w-[240px]">
                      {doc.name}
                    </span>
                    <span className="text-[10px] text-zinc-500 font-mono mt-0.5">{doc.size}</span>
                  </div>
                </td>

                {/* Subject */}
                <td className="px-6 py-4 text-zinc-300 font-medium text-left">
                  {doc.subject}
                </td>

                {/* Upload Date */}
                <td className="px-6 py-4 text-zinc-500 font-mono text-left">
                  {doc.uploadDate}
                </td>

                {/* Status Badges */}
                <td className="px-6 py-4 text-left">
                  {doc.status === 'Processed' ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md border border-emerald-500/25 bg-emerald-500/5 text-emerald-400 text-[10px] font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Processed
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md border border-amber-500/25 bg-amber-500/5 text-amber-400 text-[10px] font-semibold">
                      <Loader2 className="w-3 h-3 animate-spin" />
                      Analyzing
                    </span>
                  )}
                </td>

                {/* Actions Delete button */}
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => onDelete && onDelete(doc.id)}
                    className="p-2 text-zinc-500 hover:text-red-400 hover:bg-zinc-800/40 rounded-lg transition-all focus:outline-none focus-visible:ring-1 focus-visible:ring-blue-500"
                    aria-label={`Delete ${doc.name}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
