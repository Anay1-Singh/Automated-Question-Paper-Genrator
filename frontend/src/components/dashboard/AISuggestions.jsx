import { Sparkles, FileSpreadsheet, Plus, HelpCircle, ArrowRight } from 'lucide-react'

export default function AISuggestions({ onSuggestionClick }) {
  const suggestions = [
    {
      title: 'Generate Mid-Sem Blueprint',
      description: 'Quickly draft a 50-mark paper mapped to chapters 1-3.',
      icon: FileSpreadsheet,
      actionText: 'Generate Draft'
    },
    {
      title: 'Improve Bloom Compliance',
      description: 'Re-calibrate Q5 and Q8 to match required Evaluate levels.',
      icon: Sparkles,
      actionText: 'Re-evaluate'
    },
    {
      title: 'Extract MCQ Batch',
      description: 'Automatically pull 10 conceptual MCQs from Chapter 2 notes.',
      icon: Plus,
      actionText: 'Extract Qs'
    },
    {
      title: 'Integrity Scan',
      description: 'Scan active question pools against public university vaults.',
      icon: HelpCircle,
      actionText: 'Scan leaks'
    }
  ]

  return (
    <div className="bg-[#18181B] border border-[#27272A] p-5 rounded-xl text-left shadow-sm">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#27272A]/70 mb-4">
        <div className="flex flex-col">
          <span className="text-xs font-bold text-white uppercase tracking-wider">AI Suggestions</span>
          <span className="text-[10px] text-zinc-500 font-mono mt-0.5">Recommendations from analysis engine</span>
        </div>
        <Sparkles className="w-4 h-4 text-blue-500" />
      </div>

      {/* Suggestion list */}
      <div className="flex flex-col gap-3">
        {suggestions.map((sug) => (
          <div
            key={sug.title}
            className="p-3 bg-[#09090B]/50 border border-[#27272A]/70 rounded-lg hover:border-zinc-700 transition-colors flex flex-col justify-between gap-3 text-xs"
          >
            <div className="flex gap-2.5">
              <div className="w-7 h-7 rounded bg-blue-500/5 border border-blue-500/10 flex items-center justify-center text-blue-500 shrink-0 mt-0.5">
                <sug.icon className="w-4 h-4" />
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="font-bold text-white leading-tight">{sug.title}</span>
                <p className="text-[10px] text-zinc-400 leading-normal mt-0.5">{sug.description}</p>
              </div>
            </div>

            <button
              onClick={() => onSuggestionClick && onSuggestionClick(sug.title)}
              className="inline-flex items-center gap-1.5 self-end text-[10px] font-bold text-blue-500 hover:text-blue-400 hover:underline transition-all"
            >
              {sug.actionText}
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>

    </div>
  )
}
