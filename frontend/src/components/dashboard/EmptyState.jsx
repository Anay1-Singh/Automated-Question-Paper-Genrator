import { FileUp } from 'lucide-react'

export default function EmptyState({ onUpload }) {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 sm:p-16 border border-dashed border-[#27272A] rounded-xl bg-[#18181B]/35">
      {/* HTML/CSS-only Document Icon Animation */}
      <div className="w-16 h-16 bg-blue-500/5 border border-blue-500/25 rounded-2xl flex items-center justify-center text-blue-500 mb-6 relative group">
        <div className="absolute inset-0 rounded-2xl bg-blue-500/5 animate-pulse" />
        <FileUp className="w-6 h-6 text-blue-500 relative z-10" />
      </div>

      <h3 className="font-display font-semibold text-white text-base mb-1 tracking-tight">
        You haven't uploaded any documents yet
      </h3>
      <p className="text-zinc-500 text-xs max-w-sm mb-6 leading-relaxed">
        Upload textbook PDFs, lecture notes, or course syllabi to let PaperMind AI start analyzing curriculum topics.
      </p>

      <button
        onClick={onUpload}
        className="inline-flex items-center gap-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 px-4 py-2.5 rounded-lg shadow transition-colors"
      >
        <FileUp className="w-3.5 h-3.5" />
        Upload First Document
      </button>
    </div>
  )
}
