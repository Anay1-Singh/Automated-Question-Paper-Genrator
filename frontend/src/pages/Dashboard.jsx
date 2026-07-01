import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Files, FileText, Database, Layers, FileUp, FilePlus } from 'lucide-react'
import Sidebar from '../components/dashboard/Sidebar'
import TopNavbar from '../components/dashboard/TopNavbar'
import StatsCard from '../components/dashboard/StatsCard'
import DocumentsTable from '../components/dashboard/DocumentsTable'
import RecentPapers from '../components/dashboard/RecentPapers'
import BloomChart from '../components/dashboard/BloomChart'
import DifficultyChart from '../components/dashboard/DifficultyChart'
import QuickActions from '../components/dashboard/QuickActions'
import ActivityTimeline from '../components/dashboard/ActivityTimeline'
import ProfileCard from '../components/dashboard/ProfileCard'
import AISuggestions from '../components/dashboard/AISuggestions'
import { api } from '../utils/api'

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await api.get('/auth/me')
        setUser(data)
      } catch (err) {
        console.error('Failed to load user session:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchUser()
  }, [])

  // Simulation states
  const [documents, setDocuments] = useState([
    { id: 1, name: 'Syllabus_Unit_3.pdf', size: '4.2 MB', subject: 'Deep Learning', uploadDate: '2026-06-28', status: 'Processed' },
    { id: 2, name: 'Deep_Learning_Lecture4.pdf', size: '12.8 MB', subject: 'Deep Learning', uploadDate: '2026-06-29', status: 'Processed' },
    { id: 3, name: 'Computer_Networks_Lab.docx', size: '1.5 MB', subject: 'Computer Networks', uploadDate: '2026-06-30', status: 'Analyzing' }
  ])

  const [papers, setPapers] = useState([
    { id: 1, title: 'Deep Learning Mid-Term', code: 'CST-402-MID', subject: 'Deep Learning', questionsCount: 20, maxMarks: 50, created: '2026-06-29', status: 'Completed' },
    { id: 2, title: 'Neural Networks Semester Quiz', code: 'CST-402-Q1', subject: 'Deep Learning', questionsCount: 15, maxMarks: 30, created: '2026-06-30', status: 'Completed' },
    { id: 3, title: 'Networks Final Prep Blueprint', code: 'IT-304-FIN', subject: 'Computer Networks', questionsCount: 45, maxMarks: 100, created: '2026-07-01', status: 'Draft' }
  ])

  // Document management triggers
  const handleUploadDocument = () => {
    const filename = prompt('Enter the name of your PDF / Word document:', 'Lecture_Notes_RNN.pdf')
    if (!filename) return

    const newDoc = {
      id: Date.now(),
      name: filename,
      size: '2.8 MB',
      subject: 'Deep Learning',
      uploadDate: new Date().toISOString().split('T')[0],
      status: 'Analyzing'
    }

    setDocuments((prev) => [newDoc, ...prev])

    // Simulate completion
    setTimeout(() => {
      setDocuments((curr) =>
        curr.map((d) => (d.id === newDoc.id ? { ...d, status: 'Processed' } : d))
      )
    }, 3000)
  }

  const handleDeleteDocument = (id) => {
    if (confirm('Are you sure you want to remove this document?')) {
      setDocuments(documents.filter((d) => d.id !== id))
    }
  }

  // Paper management triggers
  const handleGeneratePaper = () => {
    const title = prompt('Enter the title for your new Question Paper:', 'Discrete Mathematics Final')
    if (!title) return

    const newPaper = {
      id: Date.now(),
      title,
      code: 'MAT-301-GEN',
      subject: 'Discrete Math',
      questionsCount: 30,
      maxMarks: 100,
      created: new Date().toISOString().split('T')[0],
      status: 'Draft'
    }

    setPapers((prev) => [newPaper, ...prev])
  }

  const handleDeletePaper = (id) => {
    if (confirm('Are you sure you want to delete this question paper?')) {
      setPapers(papers.filter((p) => p.id !== id))
    }
  }

  const handleDownloadPaper = (id) => {
    const paper = papers.find((p) => p.id === id)
    alert(`Downloading LaTeX source and PDF template for: ${paper?.title}`)
  }

  const handleSuggestionTrigger = (title) => {
    alert(`Triggering suggestion action: "${title}"`)
  }

  // Content panels routing switch
  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="flex flex-col gap-8">
            {/* Quick Actions */}
            <QuickActions
              onGenerateClick={handleGeneratePaper}
              onUploadClick={handleUploadDocument}
              onBrowseBankClick={() => setActiveTab('qbank')}
              onDownloadClick={() => alert('Opening downloads folder...')}
              onAnalyticsClick={() => setActiveTab('analytics')}
            />

            <RecentPapers
              papers={papers}
              onDelete={handleDeletePaper}
              onDownload={handleDownloadPaper}
              onGenerateClick={handleGeneratePaper}
            />
            
            <DocumentsTable
              documents={documents}
              onDelete={handleDeleteDocument}
              onUploadClick={handleUploadDocument}
            />
          </div>
        )
      case 'documents':
        return (
          <div className="flex flex-col gap-4">
            <DocumentsTable
              documents={documents}
              onDelete={handleDeleteDocument}
              onUploadClick={handleUploadDocument}
            />
          </div>
        )
      case 'generate':
      case 'history':
        return (
          <div className="flex flex-col gap-4">
            <RecentPapers
              papers={papers}
              onDelete={handleDeletePaper}
              onDownload={handleDownloadPaper}
              onGenerateClick={handleGeneratePaper}
            />
          </div>
        )
      default:
        return (
          <div className="flex flex-col items-center justify-center p-12 border border-[#27272A] rounded-xl bg-[#18181B] text-center">
            <FileText className="w-8 h-8 text-blue-500 mb-4" />
            <h3 className="text-white font-semibold mb-1">Module View Pending</h3>
            <p className="text-zinc-500 text-xs max-w-xs">
              This module ({activeTab}) will link directly to FastAPI endpoints for live database CRUD integrations.
            </p>
          </div>
        )
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#09090B] flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs text-zinc-400 font-semibold font-mono">Authenticating session...</span>
        </div>
      </div>
    )
  }

  const userFirstName = user?.name ? user.name.split(' ')[0] : 'Professor'

  return (
    <div className="min-h-screen bg-[#09090B] text-white flex overflow-hidden">
      {/* Sidebar Panel */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
        user={user}
      />

      {/* Main Panel Viewport */}
      <div className="flex-grow flex flex-col min-h-screen overflow-y-auto">
        <TopNavbar
          activeTab={activeTab}
          setSidebarOpen={setSidebarOpen}
          user={user}
        />

        {/* Dashboard Grid Container */}
        <main className="flex-grow p-6 sm:p-8 max-w-7xl mx-auto w-full flex flex-col gap-8">
          
          {/* Welcome Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-left">
            <div>
              <h2 className="text-xl sm:text-2xl font-display font-bold text-white tracking-tight leading-none mb-2">
                Good Morning, {userFirstName}
              </h2>
              <p className="text-xs sm:text-sm text-zinc-500">
                Ready to generate your next AI-powered question paper?
              </p>
            </div>
            
            <div className="flex items-center gap-3 w-full md:w-auto">
              <button
                onClick={handleUploadDocument}
                className="flex-1 md:flex-initial inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-zinc-300 hover:text-white border border-[#27272A] bg-[#18181B] px-4 py-2.5 rounded-lg transition-colors"
              >
                <FileUp className="w-4 h-4 text-blue-500" />
                Upload Document
              </button>
              <button
                onClick={handleGeneratePaper}
                className="flex-1 md:flex-initial inline-flex items-center justify-center gap-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 px-4 py-2.5 rounded-lg shadow transition-colors"
              >
                <FilePlus className="w-4 h-4" />
                Generate Paper
              </button>
            </div>
          </div>

          {/* Tabular Layout Switch */}
          {activeTab === 'dashboard' ? (
            <>
              {/* Stats Metrics Cards Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                  label="Uploaded Course Materials"
                  value={`${documents.length} Files`}
                  icon={Files}
                  growth="+12%"
                  trend="up"
                  description="Updated 5 mins ago"
                />
                <StatsCard
                  label="Generated Papers"
                  value={`${papers.length} Sheets`}
                  icon={FileText}
                  growth="+3%"
                  trend="up"
                  description="Syllabus verified"
                />
                <StatsCard
                  label="Total Questions Catalog"
                  value="420 Qs"
                  icon={Database}
                  growth="+45 Qs"
                  trend="up"
                  description="Auto-indexed by tag"
                />
                <StatsCard
                  label="Bloom Taxon. Score"
                  value="96%"
                  icon={Layers}
                  growth="+2%"
                  trend="up"
                  description="Target alignment 100%"
                />
              </div>

              {/* Main Split Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Left Side: Dynamic render */}
                <div className="lg:col-span-8 flex flex-col gap-8">
                  {renderTabContent()}
                </div>

                {/* Right Side Support Panel */}
                <div className="lg:col-span-4 flex flex-col gap-8">
                  <ProfileCard user={user} />
                  <AISuggestions onSuggestionClick={handleSuggestionTrigger} />
                  <ActivityTimeline />
                </div>

              </div>
            </>
          ) : (
            /* Direct individual tab rendering */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-8">
                {renderTabContent()}
              </div>
              <div className="lg:col-span-4 flex flex-col gap-8">
                <ProfileCard user={user} />
                <ActivityTimeline />
              </div>
            </div>
          )}

        </main>
      </div>

    </div>
  )
}
