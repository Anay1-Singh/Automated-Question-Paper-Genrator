import {
  AlertCircle,
  BookOpen,
  CalendarDays,
  FileText,
  Loader2,
  Search,
  Upload,
} from 'lucide-react'
import { useMemo, useState } from 'react'

const typeIcons = {
  pdf: { icon: FileText, cls: 'text-red-400 bg-red-500/10 border-red-500/20' },
  docx: { icon: BookOpen, cls: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
  txt: { icon: FileText, cls: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
}

function formatDate(value) {
  if (!value) return 'Today'
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(value))
}

export default function MySummaries({
  documents = [],
  loading = false,
  error = '',
  onUploadClick,
}) {
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedId, setExpandedId] = useState('')

  const summarizedDocuments = useMemo(
    () => documents.filter((document) => document.summary && ['processed', 'ready'].includes(document.status)),
    [documents],
  )

  const filteredSummaries = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    if (!query) return summarizedDocuments
    return summarizedDocuments.filter((document) =>
      [document.title, document.subject, document.summary, ...(document.topics || [])]
        .some((value) => String(value || '').toLowerCase().includes(query)),
    )
  }, [summarizedDocuments, searchQuery])

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight sm:text-2xl">My Summaries</h1>
        <p className="mt-1 text-xs text-zinc-500">AI-generated summaries from your uploaded notes.</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-600" />
        <input
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder="Search summaries..."
          className="w-full rounded-xl border border-[#27272A] bg-[#09090B] py-2.5 pl-10 pr-4 text-sm text-white outline-none placeholder:text-zinc-700 focus:border-emerald-500"
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center gap-2 rounded-2xl border border-[#1a1a2e] bg-[#0f0f14] py-16 text-xs font-semibold text-zinc-500">
          <Loader2 className="h-4 w-4 animate-spin text-emerald-400" />
          Loading summaries...
        </div>
      ) : error ? (
        <div className="flex items-start gap-2 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-300">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          {error}
        </div>
      ) : filteredSummaries.length > 0 ? (
        <div className="space-y-4">
          {filteredSummaries.map((document) => {
            const typeConfig = typeIcons[document.file_type] || typeIcons.txt
            const Icon = typeConfig.icon
            const expanded = expandedId === document.id
            return (
              <article key={document.id} className="rounded-2xl border border-[#1a1a2e] bg-[#0f0f14] p-5 transition-colors hover:border-emerald-500/15">
                <div className="mb-4 flex items-start gap-3">
                  <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${typeConfig.cls}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-bold text-white">{document.title}</h3>
                    <p className="mt-1 flex items-center gap-1.5 text-[10px] text-zinc-500">
                      <CalendarDays className="h-3 w-3" />
                      Uploaded {formatDate(document.created_at)}
                    </p>
                    {document.subject && <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-emerald-400">{document.subject}</p>}
                  </div>
                </div>

                <p className={`mb-4 text-xs leading-relaxed text-zinc-400 ${expanded ? '' : 'line-clamp-4'}`}>
                  {document.summary}
                </p>

                {document.topics?.length > 0 && (
                  <div className="mb-4 flex flex-wrap gap-1.5">
                    {document.topics.slice(0, expanded ? document.topics.length : 8).map((topic) => (
                      <span key={topic} className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400">
                        {topic}
                      </span>
                    ))}
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => setExpandedId(expanded ? '' : document.id)}
                  className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-3.5 py-2 text-xs font-bold text-emerald-300 transition-colors hover:bg-emerald-500/20"
                >
                  {expanded ? 'Collapse Summary' : 'View Full Summary'}
                </button>
              </article>
            )
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#34344a] bg-[#0f0f14] px-6 py-16 text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10">
            <FileText className="h-5 w-5 text-emerald-400/60" />
          </div>
          <p className="text-xs font-semibold text-zinc-500">No summaries yet</p>
          <p className="mt-1 max-w-sm text-[10px] text-zinc-600">Upload and process a document to generate summaries for this workspace.</p>
          <button
            type="button"
            onClick={onUploadClick}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-emerald-500"
          >
            <Upload className="h-3.5 w-3.5" />
            Upload Notes
          </button>
        </div>
      )}
    </div>
  )
}
