import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import apiClient from '../lib/api'
import {
  LayoutDashboard,
  Upload,
  UploadCloud,
  FileText,
  File,
  BookOpen,
  History,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  Plus,
  TrendingUp,
  Users,
  FileCheck,
  ChevronRight,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Loader2,
  CalendarDays,
  HardDrive,
  Type,
  Clock,
  Languages,
} from 'lucide-react'
import { api, API_BASE_URL } from '../utils/api'
import GeneratePaper from '../components/teacher/GeneratePaper'
import QuestionBank from '../components/teacher/QuestionBank'
import HistorySection from '../components/teacher/History'
import Analytics from '../components/teacher/Analytics'
import TeacherSettings from '../components/teacher/Settings'
import PaperPreview from '../components/teacher/PaperPreview'

const MAX_FILE_SIZE = 20 * 1024 * 1024

const sidebarItems = [
  { key: 'overview', label: 'Overview', icon: LayoutDashboard },
  { key: 'upload', label: 'Upload Document', icon: Upload },
  { key: 'generate', label: 'Generate Paper', icon: FileText },
  { key: 'question-bank', label: 'Question Bank', icon: BookOpen },
  { key: 'history', label: 'History', icon: History },
  { key: 'analytics', label: 'Analytics', icon: BarChart3 },
  { key: 'settings', label: 'Settings', icon: Settings },
]

const fileTypeConfig = {
  pdf: {
    label: 'PDF',
    icon: FileText,
    iconClass: 'text-red-400 bg-red-500/10 border-red-500/20',
  },
  docx: {
    label: 'DOCX',
    icon: BookOpen,
    iconClass: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  },
  txt: {
    label: 'TXT',
    icon: File,
    iconClass: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  },
}

const statusConfig = {
  uploading: 'text-zinc-300 bg-zinc-500/10 border-zinc-500/20',
  extracting: 'text-blue-300 bg-blue-500/10 border-blue-500/20',
  uploaded: 'text-sky-300 bg-sky-500/10 border-sky-500/20',
  processing: 'text-amber-300 bg-amber-500/10 border-amber-500/20',
  processed: 'text-emerald-300 bg-emerald-500/10 border-emerald-500/20',
  ready: 'text-emerald-300 bg-emerald-500/10 border-emerald-500/20',
  failed: 'text-red-300 bg-red-500/10 border-red-500/20',
}

function getFileType(filename = '') {
  const extension = filename.split('.').pop()?.toLowerCase()
  return ['pdf', 'docx', 'txt'].includes(extension) ? extension : ''
}

function getFileTypeDetails(fileType) {
  return fileTypeConfig[fileType] || fileTypeConfig.txt
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

function formatReadingTime(minutes = 0) {
  if (!minutes) return '0 min read'
  return `${minutes} min read`
}

function formatLanguage(language = 'en') {
  return language === 'hi' ? 'Hindi' : 'English'
}

function getApiErrorMessage(error) {
  if (axios.isAxiosError(error)) {
    const statusCode = error.response?.status
    const detail = error.response?.data?.detail
    if (statusCode === 413) return 'File too large. Maximum file size is 20 MB.'
    if (statusCode === 415) return 'Unsupported file type. Upload PDF, DOCX, or TXT only.'
    if (statusCode === 401) return 'Your session has expired. Please sign in again.'
    if (statusCode === 400) return detail || 'The file could not be uploaded.'
    return detail || 'Server error while uploading the document.'
  }
  return error?.message || 'Something went wrong. Please try again.'
}

function validateSelectedFile(file) {
  if (!file) return 'Choose a PDF, DOCX, or TXT file to upload.'

  const fileType = getFileType(file.name)
  if (!fileType) return 'Unsupported file type. Upload PDF, DOCX, or TXT only.'
  if (file.size > MAX_FILE_SIZE) return 'File too large. Maximum file size is 20 MB.'

  return ''
}

function FileTypeIcon({ type, className = 'w-5 h-5' }) {
  const details = getFileTypeDetails(type)
  const Icon = details.icon
  return <Icon className={className} />
}

function DocumentCard({ document, onDelete, deletingId }) {
  const fileDetails = getFileTypeDetails(document.file_type)
  const isDeleting = deletingId === document.id

  return (
    <article className="rounded-xl border border-[#1f1f2f] bg-[#0b0b10] p-4 transition-colors hover:border-indigo-500/25">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 gap-3">
          <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${fileDetails.iconClass}`}>
            <FileTypeIcon type={document.file_type} className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="break-words text-sm font-bold text-white">{document.title}</h3>
              <span className={`rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${statusConfig[document.status] || statusConfig.uploaded}`}>
                {document.status}
              </span>
            </div>
            <p className="mt-1 break-all text-xs text-zinc-500">{document.original_filename}</p>
            {document.subject && (
              <p className="mt-1 text-xs font-semibold text-indigo-300">{document.subject}</p>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={() => onDelete(document)}
          disabled={isDeleting}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs font-bold text-red-300 transition-colors hover:bg-red-500/15 disabled:cursor-not-allowed disabled:opacity-60"
          aria-label={`Delete ${document.title}`}
          title="Delete document"
        >
          {isDeleting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
          Delete
        </button>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-2 text-xs text-zinc-500 sm:grid-cols-2 xl:grid-cols-3">
        <div className="flex items-center gap-2">
          <CalendarDays className="h-3.5 w-3.5 text-zinc-600" />
          {formatDate(document.created_at)}
        </div>
        <div className="flex items-center gap-2">
          <BookOpen className="h-3.5 w-3.5 text-zinc-600" />
          {document.page_count || 0} pages
        </div>
        <div className="flex items-center gap-2">
          <Type className="h-3.5 w-3.5 text-zinc-600" />
          {formatWords(document.word_count)}
        </div>
        <div className="flex items-center gap-2">
          <Clock className="h-3.5 w-3.5 text-zinc-600" />
          {formatReadingTime(document.reading_time_minutes)}
        </div>
        <div className="flex items-center gap-2">
          <Languages className="h-3.5 w-3.5 text-zinc-600" />
          {formatLanguage(document.language)}
        </div>
        <div className="flex items-center gap-2">
          <HardDrive className="h-3.5 w-3.5 text-zinc-600" />
          {formatFileSize(document.file_size)}
        </div>
      </div>
    </article>
  )
}

export default function TeacherDashboard() {
  const navigate = useNavigate()
  const fileInputRef = useRef(null)
  const [activeTab, setActiveTab] = useState('overview')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [documents, setDocuments] = useState([])
  const [papers, setPapers] = useState([])
  const [documentsLoading, setDocumentsLoading] = useState(true)
  const [papersLoading, setPapersLoading] = useState(true)
  const [documentsError, setDocumentsError] = useState('')
  const [papersError, setPapersError] = useState('')
  const [paperToEdit, setPaperToEdit] = useState(null)
  const [previewPaper, setPreviewPaper] = useState(null)
  const [previewMode, setPreviewMode] = useState('paper')
  const [selectedFile, setSelectedFile] = useState(null)
  const [title, setTitle] = useState('')
  const [subject, setSubject] = useState('')
  const [description, setDescription] = useState('')
  const [formError, setFormError] = useState('')
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [deletingId, setDeletingId] = useState('')

  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const token = localStorage.getItem('token')

  const fetchDocuments = async ({ silent = false } = {}) => {
    if (!silent) {
      setDocumentsLoading(true)
      setDocumentsError('')
    }

    try {
      const data = await api.get('/documents')
      setDocuments(data)
    } catch (error) {
      setDocumentsError(error.message || 'Unable to load uploaded documents.')
    } finally {
      setDocumentsLoading(false)
    }
  }

  const fetchPapers = async ({ silent = false } = {}) => {
    if (!silent) {
      setPapersLoading(true)
      setPapersError('')
    }

    try {
      const data = await api.get('/papers')
      setPapers(data)
    } catch (error) {
      setPapersError(error.message || 'Unable to load generated papers.')
    } finally {
      setPapersLoading(false)
    }
  }

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      fetchDocuments()
      fetchPapers()
    }, 0)

    return () => window.clearTimeout(timerId)
  }, [])

  const recentActivity = useMemo(() => {
    const uploads = documents.map((document) => ({
      id: `doc-${document.id}`,
      type: 'document',
      title: document.title,
      fileType: document.file_type,
      createdAt: document.created_at,
    }))
    const generated = papers.map((paper) => ({
      id: `paper-${paper.id}`,
      type: 'paper',
      title: paper.title,
      fileType: 'paper',
      createdAt: paper.generated_at || paper.created_at,
      questionCount: paper.questions?.length || paper.total_questions || 0,
    }))
    return [...uploads, ...generated]
      .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
      .slice(0, 5)
  }, [documents, papers])

  const paperStats = useMemo(() => {
    const questionsGenerated = papers.reduce(
      (total, paper) => total + (paper.questions?.length || paper.total_questions || 0),
      0,
    )
    return {
      generatedPapers: papers.length,
      questionsGenerated,
      questionBank: questionsGenerated,
    }
  }, [papers])

  const statsData = useMemo(
    () => [
      { label: 'Generated Papers', value: String(paperStats.generatedPapers), icon: FileCheck, color: 'indigo' },
      { label: 'Questions Generated', value: String(paperStats.questionsGenerated), icon: BookOpen, color: 'blue' },
      { label: 'Documents Uploaded', value: String(documents.length), icon: Upload, color: 'violet' },
      { label: 'Question Bank', value: String(paperStats.questionBank), icon: Users, color: 'sky' },
    ],
    [documents.length, paperStats],
  )

  const handlePaperGenerated = (paper) => {
    setPapers((current) => [paper, ...current.filter((item) => item.id !== paper.id)])
    setPaperToEdit(paper)
    setPreviewPaper(paper)
  }

  const handlePaperUpdated = (paper) => {
    setPapers((current) => current.map((item) => (item.id === paper.id ? paper : item)))
    setPaperToEdit(paper)
    setPreviewPaper((current) => (current?.id === paper.id ? paper : current))
  }

  const handlePaperDeleted = async (paper) => {
    if (!window.confirm(`Delete "${paper.title}"? This cannot be undone.`)) {
      return false
    }

    try {
      await api.delete(`/papers/${paper.id}`)
      setPapers((current) => current.filter((item) => item.id !== paper.id))
      if (paperToEdit?.id === paper.id) setPaperToEdit(null)
      if (previewPaper?.id === paper.id) setPreviewPaper(null)
      await fetchPapers({ silent: true })
      return true
    } catch (error) {
      setPapersError(error.message || 'Unable to delete this paper.')
      return false
    }
  }

  const handleEditPaper = (paper) => {
    if (!paper?.id) return
    setPaperToEdit(paper)
    setActiveTab('generate')
  }

  const handlePreviewPaper = (paper, mode = 'paper') => {
    if (!paper?.id) return
    setPreviewPaper(paper)
    setPreviewMode(mode)
    setActiveTab('paper-preview')
  }

  const handleDownloadPaper = async (paper, answerKey = false) => {
    if (!paper?.id) return
    setPapersError('')
    try {
      await api.download(`/papers/${paper.id}${answerKey ? '/answers/pdf' : '/pdf'}`)
    } catch (error) {
      setPapersError(error.message || 'Unable to download this PDF.')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('role')
    navigate('/login')
  }

  const resetUploadForm = () => {
    setSelectedFile(null)
    setTitle('')
    setSubject('')
    setDescription('')
    setUploadProgress(0)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleFileSelect = (file) => {
    const validationError = validateSelectedFile(file)
    setFormError(validationError)
    setUploadSuccess(false)

    if (validationError) {
      setSelectedFile(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
      return
    }

    setSelectedFile(file)
    if (!title.trim()) {
      setTitle(file.name.replace(/\.[^/.]+$/, ''))
    }
  }

  const handleDrop = (event) => {
    event.preventDefault()
    event.stopPropagation()
    setDragActive(false)
    handleFileSelect(event.dataTransfer.files?.[0])
  }

  const handleUploadSubmit = async (event) => {
    event.preventDefault()
    setFormError('')
    setUploadSuccess(false)

    const validationError = validateSelectedFile(selectedFile)
    if (validationError) {
      setFormError(validationError)
      return
    }

    if (!title.trim()) {
      setFormError('Document title is required.')
      return
    }

    setUploading(true)
    setUploadProgress(0)

    try {
      const formData = new FormData()
      formData.append('file', selectedFile)
      formData.append('title', title.trim())
      if (subject.trim()) formData.append('subject', subject.trim())
      if (description.trim()) formData.append('description', description.trim())

      const response = await apiClient.post(`/documents/upload`, formData, {
        headers: { Authorization: `Bearer ${token}` },
        onUploadProgress: (progressEvent) => {
          if (!progressEvent.total) return
          setUploadProgress(Math.min(Math.round((progressEvent.loaded * 100) / progressEvent.total), 99))
        },
      })

      setDocuments((current) => [response.data, ...current.filter((doc) => doc.id !== response.data.id)])
      setUploadProgress(100)
      setUploadSuccess(true)
      resetUploadForm()
      await fetchDocuments({ silent: true })
      window.setTimeout(() => setUploadSuccess(false), 2500)
    } catch (error) {
      setFormError(getApiErrorMessage(error))
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        localStorage.removeItem('token')
        window.dispatchEvent(new Event('auth_logout'))
      }
    } finally {
      setUploading(false)
    }
  }

  const handleDeleteDocument = async (document) => {
    if (!window.confirm(`Delete "${document.title}"? This cannot be undone.`)) {
      return
    }

    setDeletingId(document.id)
    setDocumentsError('')

    try {
      await api.delete(`/documents/${document.id}`)
      setDocuments((current) => current.filter((item) => item.id !== document.id))
      setPapers((current) => current.filter((paper) => paper.document_id !== document.id))
      await fetchDocuments({ silent: true })
      await fetchPapers({ silent: true })
    } catch (error) {
      setDocumentsError(error.message || 'Unable to delete this document.')
    } finally {
      setDeletingId('')
    }
  }

  const activeItem = activeTab === 'paper-preview'
    ? { label: previewMode === 'answers' ? 'Answer Key' : 'Paper Preview' }
    : sidebarItems.find((i) => i.key === activeTab)
  const selectedFileType = getFileType(selectedFile?.name)
  const selectedFileDetails = selectedFileType ? getFileTypeDetails(selectedFileType) : null

  return (
    <div className="flex h-screen overflow-hidden bg-[#09090B] text-white">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-[#1a1a2e] bg-[#0a0a0c] transition-transform duration-300 lg:relative lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-[#1a1a2e] px-5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-blue-600 text-sm font-black text-white shadow-lg shadow-indigo-900/30">
              P
            </div>
            <span className="text-sm font-bold tracking-tight">PaperMind AI</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-zinc-500 hover:text-white lg:hidden"
            aria-label="Close sidebar"
            title="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="border-b border-[#1a1a2e] px-4 py-4">
          <div className="flex items-center gap-3 rounded-xl border border-indigo-500/15 bg-indigo-500/8 p-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-blue-600 text-xs font-bold text-white shadow-md">
              {(user.name || 'A').charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-bold text-white">{user.name || 'Teacher'}</p>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-indigo-400">Teacher</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {sidebarItems.map((item) => {
            const Icon = item.icon
            const isActive = activeTab === item.key
            return (
              <button
                key={item.key}
                onClick={() => {
                  setActiveTab(item.key)
                  setSidebarOpen(false)
                }}
                className={`flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-xs font-semibold transition-all duration-200 ${
                  isActive
                    ? 'border-indigo-500/20 bg-indigo-500/15 text-indigo-400 shadow-sm'
                    : 'border-transparent text-zinc-500 hover:bg-[#111116] hover:text-zinc-300'
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {item.label}
              </button>
            )
          })}
        </nav>

        <div className="border-t border-[#1a1a2e] p-3">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold text-red-400/70 transition-all duration-200 hover:bg-red-500/10 hover:text-red-400"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>

      <main className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-[#1a1a2e] bg-[#09090B]/80 px-4 backdrop-blur-md sm:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-zinc-500 hover:text-white lg:hidden"
              aria-label="Open sidebar"
              title="Open sidebar"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-2 text-sm font-bold text-white">
              {activeItem?.icon && <activeItem.icon className="h-4 w-4 text-indigo-400" />}
              {activeItem?.label || 'Dashboard'}
            </div>
          </div>
          <span className="rounded-full border border-indigo-500/20 bg-indigo-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-indigo-400">
            Teacher Workspace
          </span>
        </header>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {papersError && activeTab !== 'history' && (
            <div className="mb-4 flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-xs font-semibold text-red-300">
              <AlertCircle className="h-4 w-4" />
              {papersError}
            </div>
          )}

          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h1 className="text-xl font-bold tracking-tight sm:text-2xl">
                    Welcome back, <span className="text-indigo-400">{user.name || 'Teacher'}</span>
                  </h1>
                  <p className="mt-1 text-xs text-zinc-500">Here is an overview of your academic workspace.</p>
                </div>
                <button
                  onClick={() => setActiveTab('generate')}
                  className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-indigo-900/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-indigo-500"
                >
                  <Plus className="h-3.5 w-3.5" />
                  New Paper
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {statsData.map((stat) => {
                  const Icon = stat.icon
                  const colorMap = {
                    indigo: 'from-indigo-500/15 to-indigo-500/5 border-indigo-500/15 text-indigo-400',
                    blue: 'from-blue-500/15 to-blue-500/5 border-blue-500/15 text-blue-400',
                    violet: 'from-violet-500/15 to-violet-500/5 border-violet-500/15 text-violet-400',
                    sky: 'from-sky-500/15 to-sky-500/5 border-sky-500/15 text-sky-400',
                  }
                  return (
                    <div
                      key={stat.label}
                      className={`rounded-2xl border bg-gradient-to-br p-4 backdrop-blur-sm ${colorMap[stat.color]}`}
                    >
                      <div className="mb-3 flex items-center justify-between">
                        <Icon className="h-5 w-5 opacity-80" />
                        <TrendingUp className="h-3.5 w-3.5 opacity-40" />
                      </div>
                      <p className="text-2xl font-black">{stat.value}</p>
                      <p className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">{stat.label}</p>
                    </div>
                  )
                })}
              </div>

              <div className="rounded-2xl border border-[#1a1a2e] bg-[#0f0f14] p-5">
                <h3 className="mb-4 text-sm font-bold">Quick Actions</h3>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  {[
                    { label: 'Upload Document', desc: 'Add course material', icon: Upload, tab: 'upload' },
                    { label: 'Generate Paper', desc: 'Create a new question paper', icon: FileText, tab: 'generate' },
                    { label: 'View History', desc: 'Browse previous papers', icon: History, tab: 'history' },
                  ].map((action) => {
                    const Icon = action.icon
                    return (
                      <button
                        key={action.label}
                        onClick={() => setActiveTab(action.tab)}
                        className="group flex items-center gap-3 rounded-xl border border-[#27272A] bg-[#09090B] p-3.5 text-left transition-all duration-200 hover:border-indigo-500/30 hover:bg-indigo-500/5"
                      >
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10">
                          <Icon className="h-4 w-4 text-indigo-400" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-white">{action.label}</p>
                          <p className="mt-0.5 text-[10px] text-zinc-500">{action.desc}</p>
                        </div>
                        <ChevronRight className="h-4 w-4 shrink-0 text-zinc-600 transition-colors group-hover:text-indigo-400" />
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="rounded-2xl border border-[#1a1a2e] bg-[#0f0f14] p-5">
                <h3 className="mb-4 text-sm font-bold">Recent Activity</h3>
                {recentActivity.length > 0 ? (
                  <div className="space-y-3">
                    {recentActivity.map((activity) => {
                      const isPaper = activity.type === 'paper'
                      const fileDetails = isPaper
                        ? {
                            label: 'PAPER',
                            iconClass: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
                          }
                        : getFileTypeDetails(activity.fileType)
                      return (
                        <div
                          key={activity.id}
                          className="flex items-center gap-3 rounded-xl border border-[#202033] bg-[#09090B] p-3"
                        >
                          <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border ${fileDetails.iconClass}`}>
                            {isPaper ? <FileCheck className="h-4 w-4" /> : <FileTypeIcon type={activity.fileType} className="h-4 w-4" />}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-xs font-bold text-white">{activity.title}</p>
                            <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-wider text-zinc-600">
                              {isPaper ? `${activity.questionCount} questions` : fileDetails.label} - {formatDate(activity.createdAt)}
                            </p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-500/10">
                      <FileCheck className="h-5 w-5 text-indigo-400/50" />
                    </div>
                    <p className="text-xs font-semibold text-zinc-500">No recent activity</p>
                    <p className="mt-1 text-[10px] text-zinc-600">Your generated papers and uploads will appear here.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'upload' && (
            <div className="mx-auto flex max-w-6xl flex-col gap-6">
              <div className="flex flex-col gap-2">
                <h1 className="text-xl font-bold tracking-tight sm:text-2xl">Upload Document</h1>
                <p className="text-xs text-zinc-500">PDF, DOCX, and TXT study material up to 20 MB.</p>
              </div>

              <form
                onSubmit={handleUploadSubmit}
                className="grid grid-cols-1 gap-5 rounded-2xl border border-[#1a1a2e] bg-[#0f0f14] p-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(300px,0.85fr)] lg:p-5"
              >
                <div className="space-y-4">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    onDragEnter={(event) => {
                      event.preventDefault()
                      setDragActive(true)
                    }}
                    onDragOver={(event) => {
                      event.preventDefault()
                      setDragActive(true)
                    }}
                    onDragLeave={(event) => {
                      event.preventDefault()
                      setDragActive(false)
                    }}
                    onDrop={handleDrop}
                    disabled={uploading}
                    className={`flex min-h-56 w-full flex-col items-center justify-center rounded-xl border border-dashed p-6 text-center transition-colors ${
                      dragActive
                        ? 'border-indigo-400 bg-indigo-500/10'
                        : 'border-[#34344a] bg-[#09090B] hover:border-indigo-500/40 hover:bg-indigo-500/5'
                    } ${uploading ? 'cursor-not-allowed opacity-70' : ''}`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.docx,.txt"
                      className="hidden"
                      onChange={(event) => handleFileSelect(event.target.files?.[0])}
                      disabled={uploading}
                    />
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-indigo-500/20 bg-indigo-500/10">
                      <UploadCloud className="h-7 w-7 text-indigo-400" />
                    </div>
                    <p className="text-sm font-bold text-white">Drop a document here or click to browse</p>
                    <p className="mt-2 text-xs text-zinc-500">PDF, DOCX, TXT - maximum 20 MB</p>
                  </button>

                  {selectedFile && selectedFileDetails && (
                    <div className="flex items-center justify-between gap-3 rounded-xl border border-[#27272A] bg-[#09090B] p-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border ${selectedFileDetails.iconClass}`}>
                          <FileTypeIcon type={selectedFileType} className="h-5 w-5" />
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-xs font-bold text-white">{selectedFile.name}</p>
                          <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
                            {selectedFileDetails.label} - {formatFileSize(selectedFile.size)}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedFile(null)
                          if (fileInputRef.current) fileInputRef.current.value = ''
                        }}
                        disabled={uploading}
                        className="rounded-lg p-2 text-zinc-500 transition-colors hover:bg-zinc-800 hover:text-white disabled:cursor-not-allowed"
                        aria-label="Remove selected file"
                        title="Remove selected file"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  )}

                  {(formError || uploadSuccess) && (
                    <div
                      className={`flex items-center gap-2 rounded-xl border p-3 text-xs font-semibold ${
                        uploadSuccess
                          ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-300'
                          : 'border-red-500/20 bg-red-500/10 text-red-300'
                      }`}
                    >
                      {uploadSuccess ? (
                        <CheckCircle2 className="h-4 w-4 animate-bounce" />
                      ) : (
                        <AlertCircle className="h-4 w-4" />
                      )}
                      {uploadSuccess ? 'Document uploaded and processed successfully.' : formError}
                    </div>
                  )}

                  {uploading && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                        <span>Uploading</span>
                        <span>{uploadProgress}%</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-[#202033]">
                        <div
                          className="h-full rounded-full bg-indigo-500 transition-all duration-200"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <label htmlFor="document-title" className="mb-1.5 block text-xs font-bold text-zinc-300">
                      Title
                    </label>
                    <input
                      id="document-title"
                      value={title}
                      onChange={(event) => setTitle(event.target.value)}
                      disabled={uploading}
                      required
                      className="w-full rounded-xl border border-[#27272A] bg-[#09090B] px-3 py-3 text-sm text-white outline-none transition-colors placeholder:text-zinc-700 focus:border-indigo-500"
                      placeholder="Document title"
                    />
                  </div>

                  <div>
                    <label htmlFor="document-subject" className="mb-1.5 block text-xs font-bold text-zinc-300">
                      Subject
                    </label>
                    <input
                      id="document-subject"
                      value={subject}
                      onChange={(event) => setSubject(event.target.value)}
                      disabled={uploading}
                      className="w-full rounded-xl border border-[#27272A] bg-[#09090B] px-3 py-3 text-sm text-white outline-none transition-colors placeholder:text-zinc-700 focus:border-indigo-500"
                      placeholder="Subject"
                    />
                  </div>

                  <div>
                    <label htmlFor="document-description" className="mb-1.5 block text-xs font-bold text-zinc-300">
                      Description
                    </label>
                    <textarea
                      id="document-description"
                      value={description}
                      onChange={(event) => setDescription(event.target.value)}
                      disabled={uploading}
                      rows={5}
                      className="w-full resize-none rounded-xl border border-[#27272A] bg-[#09090B] px-3 py-3 text-sm text-white outline-none transition-colors placeholder:text-zinc-700 focus:border-indigo-500"
                      placeholder="Optional context for this material"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={uploading}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-900/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                    {uploading ? 'Uploading...' : 'Upload Document'}
                  </button>
                </div>
              </form>

              <section className="rounded-2xl border border-[#1a1a2e] bg-[#0f0f14] p-4 lg:p-5">
                <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-sm font-bold text-white">Uploaded Documents</h2>
                    <p className="mt-1 text-xs text-zinc-500">{documents.length} documents available for future AI generation.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => fetchDocuments()}
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#27272A] bg-[#09090B] px-3 py-2 text-xs font-bold text-zinc-300 transition-colors hover:border-indigo-500/30 hover:text-white"
                  >
                    <TrendingUp className="h-3.5 w-3.5" />
                    Refresh
                  </button>
                </div>

                {documentsError && (
                  <div className="mb-4 flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-xs font-semibold text-red-300">
                    <AlertCircle className="h-4 w-4" />
                    {documentsError}
                  </div>
                )}

                {documentsLoading ? (
                  <div className="flex items-center justify-center gap-3 py-14 text-xs font-semibold text-zinc-500">
                    <Loader2 className="h-4 w-4 animate-spin text-indigo-400" />
                    Loading documents...
                  </div>
                ) : documents.length > 0 ? (
                  <div className="space-y-3">
                    {documents.map((document) => (
                      <DocumentCard
                        key={document.id}
                        document={document}
                        deletingId={deletingId}
                        onDelete={handleDeleteDocument}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[#34344a] bg-[#09090B] px-6 py-14 text-center">
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-500/10">
                      <UploadCloud className="h-5 w-5 text-indigo-400/60" />
                    </div>
                    <p className="text-xs font-semibold text-zinc-500">No documents uploaded yet</p>
                    <p className="mt-1 text-[10px] text-zinc-600">Uploaded study material will appear here instantly.</p>
                  </div>
                )}
              </section>
            </div>
          )}

          {activeTab === 'generate' && (
            <GeneratePaper
              documents={documents}
              papers={papers}
              paperToEdit={paperToEdit}
              onPaperGenerated={handlePaperGenerated}
              onPaperUpdated={handlePaperUpdated}
              onPapersRefresh={fetchPapers}
              onPreviewPaper={(paper) => handlePreviewPaper(paper, 'paper')}
              onViewAnswers={(paper) => handlePreviewPaper(paper, 'answers')}
              onDownloadPaper={(paper) => handleDownloadPaper(paper, false)}
              onDownloadAnswers={(paper) => handleDownloadPaper(paper, true)}
            />
          )}
          {activeTab === 'question-bank' && (
            <QuestionBank
              papers={papers}
              onPreviewPaper={(paper) => handlePreviewPaper(paper, 'paper')}
              onViewAnswers={(paper) => handlePreviewPaper(paper, 'answers')}
              onDownloadPaper={(paper) => handleDownloadPaper(paper, false)}
              onDownloadAnswers={(paper) => handleDownloadPaper(paper, true)}
              onEditPaper={handleEditPaper}
              onDeletePaper={handlePaperDeleted}
            />
          )}
          {activeTab === 'history' && (
            <HistorySection
              papers={papers}
              loading={papersLoading}
              error={papersError}
              onPreviewPaper={(paper) => handlePreviewPaper(paper, 'paper')}
              onViewAnswers={(paper) => handlePreviewPaper(paper, 'answers')}
              onDownloadPaper={(paper) => handleDownloadPaper(paper, false)}
              onDownloadAnswers={(paper) => handleDownloadPaper(paper, true)}
              onEditPaper={handleEditPaper}
              onDeletePaper={handlePaperDeleted}
            />
          )}
          {activeTab === 'paper-preview' && (
            <PaperPreview
              key={`${previewPaper?.id || 'none'}-${previewMode}`}
              paper={previewPaper}
              initialMode={previewMode}
              onBack={() => setActiveTab('history')}
              onEdit={handleEditPaper}
              onDelete={async (paper) => {
                const deleted = await handlePaperDeleted(paper)
                if (deleted) setActiveTab('history')
              }}
            />
          )}
          {activeTab === 'analytics' && <Analytics documents={documents} papers={papers} />}
          {activeTab === 'settings' && <TeacherSettings user={user} />}
        </div>
      </main>
    </div>
  )
}
