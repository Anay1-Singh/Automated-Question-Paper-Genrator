import { useRef, useState } from 'react'
import axios from 'axios'
import {
  AlertCircle,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Clock,
  File,
  FileText,
  HardDrive,
  Languages,
  Loader2,
  Sparkles,
  Trash2,
  Type,
  UploadCloud,
  X,
} from 'lucide-react'
import { api, API_BASE_URL } from '../../utils/api'

const MAX_FILE_SIZE = 20 * 1024 * 1024

const fileTypeConfig = {
  pdf: { label: 'PDF', icon: FileText, iconClass: 'text-red-400 bg-red-500/10 border-red-500/20' },
  docx: { label: 'DOCX', icon: BookOpen, iconClass: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
  txt: { label: 'TXT', icon: File, iconClass: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
}

const statusConfig = {
  uploading: 'text-zinc-300 bg-zinc-500/10 border-zinc-500/20',
  extracting: 'text-blue-300 bg-blue-500/10 border-blue-500/20',
  processing: 'text-amber-300 bg-amber-500/10 border-amber-500/20',
  processed: 'text-emerald-300 bg-emerald-500/10 border-emerald-500/20',
  failed: 'text-red-300 bg-red-500/10 border-red-500/20',
}

function getFileType(name = '') {
  const ext = name.split('.').pop()?.toLowerCase()
  return ['pdf', 'docx', 'txt'].includes(ext) ? ext : ''
}

function formatFileSize(bytes = 0) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function formatDate(value) {
  if (!value) return 'Today'
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(value))
}

function formatWords(count = 0) {
  return `${new Intl.NumberFormat('en-US').format(count)} words`
}

function formatLanguage(language = 'en') {
  return language === 'hi' ? 'Hindi' : 'English'
}

function validateSelectedFile(file) {
  if (!file) return 'Choose a PDF, DOCX, or TXT file to upload.'
  if (!getFileType(file.name)) return 'Unsupported file type. Upload PDF, DOCX, or TXT only.'
  if (file.size > MAX_FILE_SIZE) return 'File too large. Maximum file size is 20 MB.'
  return ''
}

function getApiErrorMessage(error) {
  if (axios.isAxiosError(error)) {
    const statusCode = error.response?.status
    const detail = error.response?.data?.detail
    if (statusCode === 413) return 'File too large. Maximum file size is 20 MB.'
    if (statusCode === 415) return 'Unsupported file type. Upload PDF, DOCX, or TXT only.'
    if (statusCode === 401) return 'Your session has expired. Please sign in again.'
    return detail || 'Server error while uploading the document.'
  }
  return error?.message || 'Something went wrong. Please try again.'
}

export default function UploadNotes({
  documents = [],
  documentsLoading = false,
  onDocumentsChange,
  onRefreshDocuments,
}) {
  const fileInputRef = useRef(null)
  const [selectedFile, setSelectedFile] = useState(null)
  const [title, setTitle] = useState('')
  const [subject, setSubject] = useState('')
  const [dragActive, setDragActive] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [deletingId, setDeletingId] = useState('')

  const token = localStorage.getItem('token')

  const resetForm = () => {
    setSelectedFile(null)
    setTitle('')
    setSubject('')
    setUploadProgress(0)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleFileSelect = (file) => {
    const validationError = validateSelectedFile(file)
    setError(validationError)
    setSuccess(false)

    if (validationError) {
      setSelectedFile(null)
      if (fileInputRef.current) fileInputRef.current.value = ''
      return
    }

    setSelectedFile(file)
    if (!title.trim()) setTitle(file.name.replace(/\.[^/.]+$/, ''))
  }

  const handleDrop = (event) => {
    event.preventDefault()
    setDragActive(false)
    handleFileSelect(event.dataTransfer.files?.[0])
  }

  const handleUpload = async (event) => {
    event.preventDefault()
    setError('')
    setSuccess(false)

    const validationError = validateSelectedFile(selectedFile)
    if (validationError) {
      setError(validationError)
      return
    }

    if (!title.trim()) {
      setError('Document title is required.')
      return
    }

    setUploading(true)
    setUploadProgress(0)

    try {
      const formData = new FormData()
      formData.append('file', selectedFile)
      formData.append('title', title.trim())
      if (subject.trim()) formData.append('subject', subject.trim())

      const response = await axios.post(`${API_BASE_URL}/documents/upload`, formData, {
        headers: { Authorization: `Bearer ${token}` },
        onUploadProgress: (progressEvent) => {
          if (!progressEvent.total) return
          setUploadProgress(Math.min(Math.round((progressEvent.loaded * 100) / progressEvent.total), 99))
        },
      })

      onDocumentsChange?.((current) => [response.data, ...current.filter((doc) => doc.id !== response.data.id)])
      setUploadProgress(100)
      setSuccess(true)
      resetForm()
      await onRefreshDocuments?.({ silent: true })
      window.setTimeout(() => setSuccess(false), 2500)
    } catch (err) {
      setError(getApiErrorMessage(err))
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (document) => {
    if (!window.confirm(`Delete "${document.title}"? This cannot be undone.`)) {
      return
    }

    setDeletingId(document.id)
    setError('')
    try {
      await api.delete(`/documents/${document.id}`)
      onDocumentsChange?.((current) => current.filter((item) => item.id !== document.id))
      await onRefreshDocuments?.({ silent: true })
    } catch (err) {
      setError(err.message || 'Unable to delete this note.')
    } finally {
      setDeletingId('')
    }
  }

  const selectedFileType = getFileType(selectedFile?.name)
  const fileDetails = fileTypeConfig[selectedFileType]

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-xl font-bold tracking-tight sm:text-2xl">Upload Notes</h1>
        <p className="text-xs text-zinc-500">Upload class notes and study material for AI processing.</p>
      </div>

      <form onSubmit={handleUpload} className="space-y-4 rounded-2xl border border-[#1a1a2e] bg-[#0f0f14] p-5">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          onDragEnter={(event) => { event.preventDefault(); setDragActive(true) }}
          onDragOver={(event) => { event.preventDefault(); setDragActive(true) }}
          onDragLeave={(event) => { event.preventDefault(); setDragActive(false) }}
          onDrop={handleDrop}
          disabled={uploading}
          className={`flex min-h-48 w-full flex-col items-center justify-center rounded-xl border border-dashed p-6 text-center transition-colors ${
            dragActive
              ? 'border-emerald-400 bg-emerald-500/10'
              : 'border-[#34344a] bg-[#09090B] hover:border-emerald-500/40 hover:bg-emerald-500/5'
          } ${uploading ? 'cursor-not-allowed opacity-70' : ''}`}
        >
          <input ref={fileInputRef} type="file" accept=".pdf,.docx,.txt" className="hidden" onChange={(event) => handleFileSelect(event.target.files?.[0])} />
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-500/20 bg-emerald-500/10">
            <UploadCloud className="h-7 w-7 text-emerald-400" />
          </div>
          <p className="text-sm font-bold text-white">Drop your notes here or click to browse</p>
          <p className="mt-2 text-xs text-zinc-500">PDF, DOCX, TXT - maximum 20 MB</p>
        </button>

        {selectedFile && fileDetails && (
          <div className="flex items-center justify-between gap-3 rounded-xl border border-[#27272A] bg-[#09090B] p-3">
            <div className="flex min-w-0 items-center gap-3">
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border ${fileDetails.iconClass}`}>
                <fileDetails.icon className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-xs font-bold text-white">{selectedFile.name}</p>
                <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                  {fileDetails.label} - {formatFileSize(selectedFile.size)}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => { setSelectedFile(null); if (fileInputRef.current) fileInputRef.current.value = '' }}
              className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-800 hover:text-white"
              aria-label="Remove selected file"
              title="Remove selected file"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-bold text-zinc-300">Title</label>
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              disabled={uploading}
              className="w-full rounded-xl border border-[#27272A] bg-[#09090B] px-3 py-3 text-sm text-white outline-none placeholder:text-zinc-700 focus:border-emerald-500"
              placeholder="Document title"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-bold text-zinc-300">Subject</label>
            <input
              value={subject}
              onChange={(event) => setSubject(event.target.value)}
              disabled={uploading}
              className="w-full rounded-xl border border-[#27272A] bg-[#09090B] px-3 py-3 text-sm text-white outline-none placeholder:text-zinc-700 focus:border-emerald-500"
              placeholder="Subject"
            />
          </div>
        </div>

        {(error || success) && (
          <div className={`flex items-center gap-2 rounded-xl border p-3 text-xs font-semibold ${
            success ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-300' : 'border-red-500/20 bg-red-500/10 text-red-300'
          }`}>
            {success ? <CheckCircle2 className="h-4 w-4 animate-bounce" /> : <AlertCircle className="h-4 w-4" />}
            {success ? 'Document uploaded and processed successfully.' : error}
          </div>
        )}

        {uploading && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-zinc-500">
              <span>Uploading</span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-[#202033]">
              <div className="h-full rounded-full bg-emerald-500 transition-all duration-200" style={{ width: `${uploadProgress}%` }} />
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={uploading}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-900/20 transition-all hover:-translate-y-0.5 hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
          {uploading ? 'Uploading...' : 'Upload & Process'}
        </button>
      </form>

      <div className="rounded-2xl border border-[#1a1a2e] bg-[#0f0f14] p-5">
        <h3 className="mb-4 text-sm font-bold">Your Uploaded Notes</h3>
        {documentsLoading ? (
          <div className="flex items-center justify-center gap-3 py-12 text-xs font-semibold text-zinc-500">
            <Loader2 className="h-4 w-4 animate-spin text-emerald-400" />
            Loading notes...
          </div>
        ) : documents.length > 0 ? (
          <div className="space-y-3">
            {documents.map((document) => {
              const cfg = fileTypeConfig[document.file_type] || fileTypeConfig.txt
              const Icon = cfg.icon
              const isDeleting = deletingId === document.id
              return (
                <article key={document.id} className="rounded-xl border border-[#1f1f2f] bg-[#0b0b10] p-4 transition-colors hover:border-emerald-500/25">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-start gap-3">
                      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${cfg.iconClass}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="text-sm font-bold text-white">{document.title}</h4>
                          <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${statusConfig[document.status] || statusConfig.processed}`}>
                            {document.status}
                          </span>
                        </div>
                        <p className="mt-1 break-all text-xs text-zinc-500">{document.original_filename}</p>
                        {document.subject && <p className="mt-1 text-xs font-semibold text-emerald-300">{document.subject}</p>}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDelete(document)}
                      disabled={isDeleting}
                      className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-red-500/20 bg-red-500/10 px-2.5 py-2 text-[10px] font-bold text-red-300 hover:bg-red-500/15 disabled:opacity-60"
                      title="Delete note"
                    >
                      {isDeleting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                      Delete
                    </button>
                  </div>
                  <div className="mt-3 grid grid-cols-1 gap-2 text-xs text-zinc-500 sm:grid-cols-2 lg:grid-cols-3">
                    <div className="flex items-center gap-2"><CalendarDays className="h-3.5 w-3.5 text-zinc-600" />{formatDate(document.created_at)}</div>
                    <div className="flex items-center gap-2"><BookOpen className="h-3.5 w-3.5 text-zinc-600" />{document.page_count || 0} pages</div>
                    <div className="flex items-center gap-2"><Type className="h-3.5 w-3.5 text-zinc-600" />{formatWords(document.word_count)}</div>
                    <div className="flex items-center gap-2"><Clock className="h-3.5 w-3.5 text-zinc-600" />{document.reading_time_minutes || 0} min read</div>
                    <div className="flex items-center gap-2"><Languages className="h-3.5 w-3.5 text-zinc-600" />{formatLanguage(document.language)}</div>
                    <div className="flex items-center gap-2"><HardDrive className="h-3.5 w-3.5 text-zinc-600" />{formatFileSize(document.file_size)}</div>
                  </div>
                </article>
              )
            })}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-[#34344a] bg-[#09090B] px-6 py-12 text-center">
            <p className="text-xs font-semibold text-zinc-500">No notes uploaded yet</p>
            <p className="mt-1 text-[10px] text-zinc-600">Upload a document to generate summaries, topics, and study focus.</p>
          </div>
        )}
      </div>
    </div>
  )
}
