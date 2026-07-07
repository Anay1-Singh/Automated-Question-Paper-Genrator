import { useState, useRef } from 'react'
import {
  UploadCloud,
  FileText,
  BookOpen,
  File,
  X,
  Sparkles,
  CalendarDays,
  HardDrive,
  Type,
} from 'lucide-react'

const fileTypeConfig = {
  pdf: { label: 'PDF', icon: FileText, iconClass: 'text-red-400 bg-red-500/10 border-red-500/20' },
  docx: { label: 'DOCX', icon: BookOpen, iconClass: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
  txt: { label: 'TXT', icon: File, iconClass: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
}

const placeholderNotes = [
  { id: 1, title: 'Operating Systems Unit 2', filename: 'os_unit2.pdf', type: 'pdf', size: '2.4 MB', words: '3,240', date: 'Jul 3, 2026', status: 'uploaded' },
  { id: 2, title: 'Data Structures - Linked Lists', filename: 'ds_linked_lists.docx', type: 'docx', size: '1.1 MB', words: '1,820', date: 'Jul 1, 2026', status: 'ready' },
  { id: 3, title: 'DBMS Normalization Notes', filename: 'dbms_nf.txt', type: 'txt', size: '45 KB', words: '640', date: 'Jun 28, 2026', status: 'uploaded' },
]

export default function UploadNotes() {
  const fileInputRef = useRef(null)
  const [selectedFile, setSelectedFile] = useState(null)
  const [title, setTitle] = useState('')
  const [subject, setSubject] = useState('')
  const [dragActive, setDragActive] = useState(false)

  const getFileType = (name = '') => {
    const ext = name.split('.').pop()?.toLowerCase()
    return ['pdf', 'docx', 'txt'].includes(ext) ? ext : ''
  }

  const handleFileSelect = (file) => {
    if (!file) return
    setSelectedFile(file)
    if (!title.trim()) setTitle(file.name.replace(/\.[^/.]+$/, ''))
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragActive(false)
    handleFileSelect(e.dataTransfer.files?.[0])
  }

  const selectedFileType = getFileType(selectedFile?.name)
  const fileDetails = fileTypeConfig[selectedFileType]

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-xl font-bold tracking-tight sm:text-2xl">Upload Notes</h1>
        <p className="text-xs text-zinc-500">Upload your class notes and study material for AI-powered analysis.</p>
      </div>

      {/* Upload Form */}
      <div className="rounded-2xl border border-[#1a1a2e] bg-[#0f0f14] p-5 space-y-4">
        {/* Drag & Drop Zone */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          onDragEnter={e => { e.preventDefault(); setDragActive(true) }}
          onDragOver={e => { e.preventDefault(); setDragActive(true) }}
          onDragLeave={e => { e.preventDefault(); setDragActive(false) }}
          onDrop={handleDrop}
          className={`flex min-h-48 w-full flex-col items-center justify-center rounded-xl border border-dashed p-6 text-center transition-colors ${
            dragActive
              ? 'border-emerald-400 bg-emerald-500/10'
              : 'border-[#34344a] bg-[#09090B] hover:border-emerald-500/40 hover:bg-emerald-500/5'
          }`}
        >
          <input ref={fileInputRef} type="file" accept=".pdf,.docx,.txt" className="hidden" onChange={e => handleFileSelect(e.target.files?.[0])} />
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-500/20 bg-emerald-500/10">
            <UploadCloud className="h-7 w-7 text-emerald-400" />
          </div>
          <p className="text-sm font-bold text-white">Drop your notes here or click to browse</p>
          <p className="mt-2 text-xs text-zinc-500">PDF, DOCX, TXT — maximum 20 MB</p>
        </button>

        {/* Selected File Preview */}
        {selectedFile && fileDetails && (
          <div className="flex items-center justify-between gap-3 rounded-xl border border-[#27272A] bg-[#09090B] p-3">
            <div className="flex min-w-0 items-center gap-3">
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border ${fileDetails.iconClass}`}>
                <fileDetails.icon className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-xs font-bold text-white">{selectedFile.name}</p>
                <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                  {fileDetails.label} — {(selectedFile.size / (1024 * 1024)).toFixed(1)} MB
                </p>
              </div>
            </div>
            <button onClick={() => { setSelectedFile(null); if (fileInputRef.current) fileInputRef.current.value = '' }} className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-800 hover:text-white">
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Title & Subject */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 block text-xs font-bold text-zinc-300">Title</label>
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full rounded-xl border border-[#27272A] bg-[#09090B] px-3 py-3 text-sm text-white outline-none placeholder:text-zinc-700 focus:border-emerald-500"
              placeholder="Operating Systems Unit 2"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-bold text-zinc-300">Subject (optional)</label>
            <input
              value={subject}
              onChange={e => setSubject(e.target.value)}
              className="w-full rounded-xl border border-[#27272A] bg-[#09090B] px-3 py-3 text-sm text-white outline-none placeholder:text-zinc-700 focus:border-emerald-500"
              placeholder="Computer Science"
            />
          </div>
        </div>

        <button className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-900/20 transition-all hover:-translate-y-0.5 hover:bg-emerald-500">
          <Sparkles className="h-4 w-4" />
          Upload & Analyze
        </button>

        <p className="text-center text-[10px] text-zinc-600">
          Our AI will extract key topics and generate a summary from your uploaded notes.
        </p>
      </div>

      {/* Uploaded Notes List */}
      <div className="rounded-2xl border border-[#1a1a2e] bg-[#0f0f14] p-5">
        <h3 className="text-sm font-bold mb-4">Your Uploaded Notes</h3>
        <div className="space-y-3">
          {placeholderNotes.map(note => {
            const cfg = fileTypeConfig[note.type]
            const Icon = cfg.icon
            return (
              <article key={note.id} className="rounded-xl border border-[#1f1f2f] bg-[#0b0b10] p-4 transition-colors hover:border-emerald-500/25">
                <div className="flex items-start gap-3">
                  <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${cfg.iconClass}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-white">{note.title}</h4>
                      <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                        note.status === 'ready' ? 'text-emerald-300 bg-emerald-500/10 border-emerald-500/20' : 'text-sky-300 bg-sky-500/10 border-sky-500/20'
                      }`}>{note.status}</span>
                    </div>
                    <p className="text-xs text-zinc-500 mt-1">{note.filename}</p>
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2 text-xs text-zinc-500">
                  <div className="flex items-center gap-2"><CalendarDays className="h-3.5 w-3.5 text-zinc-600" />{note.date}</div>
                  <div className="flex items-center gap-2"><HardDrive className="h-3.5 w-3.5 text-zinc-600" />{note.size}</div>
                  <div className="flex items-center gap-2"><Type className="h-3.5 w-3.5 text-zinc-600" />{note.words} words</div>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </div>
  )
}
