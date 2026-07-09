import { useMemo, useState } from 'react'
import {
  AlertCircle,
  BookOpen,
  ChevronDown,
  Hash,
  Loader2,
  Search,
  Upload,
} from 'lucide-react'

const importanceBadgeColors = {
  High: 'text-red-400 bg-red-500/10 border-red-500/20',
  Medium: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
  Low: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
}

function buildTopicRows(documents, selectedDocumentId) {
  const sourceDocuments = selectedDocumentId === 'all'
    ? documents
    : documents.filter((document) => document.id === selectedDocumentId)

  const counts = new Map()
  for (const document of sourceDocuments) {
    for (const topic of document.topics || []) {
      const key = topic.trim()
      if (!key) continue
      const existing = counts.get(key) || {
        id: key,
        name: key,
        frequency: 0,
        documents: new Set(),
        keywords: new Set(),
      }
      existing.frequency += 1
      existing.documents.add(document.title)
      for (const keyword of document.keywords || []) {
        if (existing.keywords.size < 5) existing.keywords.add(keyword)
      }
      counts.set(key, existing)
    }
  }

  return [...counts.values()]
    .map((topic) => ({
      ...topic,
      documents: [...topic.documents],
      keywords: [...topic.keywords],
      importance: topic.frequency >= 3 ? 'High' : topic.frequency >= 2 ? 'Medium' : 'Low',
    }))
    .sort((a, b) => b.frequency - a.frequency || a.name.localeCompare(b.name))
}

export default function ImportantTopics({
  documents = [],
  loading = false,
  error = '',
  onUploadClick,
}) {
  const processedDocuments = useMemo(
    () => documents.filter((document) => ['processed', 'ready'].includes(document.status)),
    [documents],
  )
  const [selectedDocumentId, setSelectedDocumentId] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const topicRows = useMemo(
    () => buildTopicRows(processedDocuments, selectedDocumentId),
    [processedDocuments, selectedDocumentId],
  )

  const filteredTopics = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    if (!query) return topicRows
    return topicRows.filter((topic) =>
      [topic.name, topic.importance, ...topic.documents, ...topic.keywords]
        .some((value) => String(value || '').toLowerCase().includes(query)),
    )
  }, [topicRows, searchQuery])

  const vocabulary = useMemo(() => {
    const rows = new Map()
    for (const document of processedDocuments) {
      for (const keyword of document.keywords || []) {
        if (!keyword.trim()) continue
        const existing = rows.get(keyword) || { term: keyword, count: 0, documents: new Set() }
        existing.count += 1
        existing.documents.add(document.title)
        rows.set(keyword, existing)
      }
    }
    return [...rows.values()]
      .sort((a, b) => b.count - a.count || a.term.localeCompare(b.term))
      .slice(0, 20)
      .map((item) => ({
        ...item,
        documents: [...item.documents],
      }))
  }, [processedDocuments])

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-xl font-bold tracking-tight sm:text-2xl">Important Topics</h1>
        <p className="text-xs text-zinc-500">Key concepts extracted from your processed documents.</p>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-[minmax(240px,360px)_minmax(0,1fr)]">
        <div className="rounded-2xl border border-[#1a1a2e] bg-[#0f0f14] p-4">
          <label className="mb-1.5 block text-xs font-bold text-zinc-300">Document</label>
          <div className="relative">
            <select
              value={selectedDocumentId}
              onChange={(event) => setSelectedDocumentId(event.target.value)}
              className="w-full appearance-none rounded-xl border border-[#27272A] bg-[#09090B] px-3 py-2.5 pr-10 text-xs text-white outline-none transition-colors focus:border-emerald-500"
            >
              <option value="all">All processed documents</option>
              {processedDocuments.map((document) => (
                <option key={document.id} value={document.id}>{document.title}</option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-600" />
          <input
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search extracted topics..."
            className="h-full min-h-[74px] w-full rounded-2xl border border-[#1a1a2e] bg-[#0f0f14] py-2.5 pl-10 pr-4 text-sm text-white outline-none placeholder:text-zinc-700 focus:border-emerald-500"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center gap-2 rounded-2xl border border-[#1a1a2e] bg-[#0f0f14] py-16 text-xs font-semibold text-zinc-500">
          <Loader2 className="h-4 w-4 animate-spin text-emerald-400" />
          Loading topics...
        </div>
      ) : error ? (
        <div className="flex items-start gap-2 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-300">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          {error}
        </div>
      ) : filteredTopics.length > 0 ? (
        <>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredTopics.map((topic) => (
              <article
                key={topic.id}
                className="flex min-h-[170px] flex-col justify-between rounded-xl border border-[#1f1f2f] bg-[#0b0b10] p-4 transition-colors hover:border-emerald-500/25"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="line-clamp-2 text-xs font-bold text-white" title={topic.name}>{topic.name}</h4>
                    <span className={`shrink-0 rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${importanceBadgeColors[topic.importance]}`}>
                      {topic.importance}
                    </span>
                  </div>
                  <p className="mt-2 line-clamp-3 text-[11px] leading-relaxed text-zinc-400">
                    Found in {topic.documents.length} document{topic.documents.length === 1 ? '' : 's'}.
                    {topic.keywords.length > 0 ? ` Related terms: ${topic.keywords.slice(0, 3).join(', ')}.` : ''}
                  </p>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-[#1a1a2e] pt-2 text-[10px] font-semibold text-zinc-500">
                  <span className="flex items-center gap-1.5">
                    <Hash className="h-3 w-3 text-emerald-500" />
                    Mentioned {topic.frequency} time{topic.frequency === 1 ? '' : 's'}
                  </span>
                </div>
              </article>
            ))}
          </div>

          {vocabulary.length > 0 && (
            <div className="rounded-2xl border border-[#1a1a2e] bg-[#0f0f14] p-5">
              <div className="mb-4 flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-emerald-400" />
                <h3 className="text-sm font-bold">Key Vocabulary</h3>
              </div>
              <dl className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {vocabulary.map((item) => (
                  <div key={item.term} className="space-y-1 rounded-xl border border-[#1f1f2f] bg-[#09090B] p-3.5">
                    <dt className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                      <div className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
                      {item.term}
                    </dt>
                    <dd className="pl-3.5 text-[11px] leading-relaxed text-zinc-400">
                      Appears in {item.documents.length} document{item.documents.length === 1 ? '' : 's'}.
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
        </>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#34344a] bg-[#0f0f14] px-6 py-16 text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10">
            <BookOpen className="h-5 w-5 text-emerald-400/60" />
          </div>
          <p className="text-xs font-semibold text-zinc-500">No topics available yet</p>
          <p className="mt-1 max-w-sm text-[10px] text-zinc-600">Upload and process notes to extract important topics and vocabulary.</p>
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
