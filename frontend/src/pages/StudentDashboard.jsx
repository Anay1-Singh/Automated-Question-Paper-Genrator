import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Upload,
  FileText,
  BookOpen,
  Star,
  Target,
  Settings,
  LogOut,
  Menu,
  X,
  TrendingUp,
  Sparkles,
  ChevronRight,
} from 'lucide-react'
import UploadNotes from '../components/student/UploadNotes'
import MySummaries from '../components/student/MySummaries'
import ImportantTopics from '../components/student/ImportantTopics'
import StudyFocus from '../components/student/StudyFocus'
import StudentSettings from '../components/student/StudentSettings'

const sidebarItems = [
  { key: 'overview', label: 'Overview', icon: LayoutDashboard },
  { key: 'upload-notes', label: 'Upload Notes', icon: Upload },
  { key: 'summaries', label: 'My Summaries', icon: FileText },
  { key: 'important-topics', label: 'Important Topics', icon: Star },
  { key: 'study-focus', label: 'Study Focus', icon: Target },
  { key: 'settings', label: 'Settings', icon: Settings },
]

const statsData = [
  { label: 'Notes Uploaded', value: '0', icon: Upload, color: 'emerald' },
  { label: 'Summaries Created', value: '0', icon: FileText, color: 'teal' },
  { label: 'Topics Bookmarked', value: '0', icon: Star, color: 'cyan' },
  { label: 'Study Hours', value: '0', icon: Target, color: 'green' },
]

export default function StudentDashboard() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('overview')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const user = JSON.parse(localStorage.getItem('user') || '{}')

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('role')
    navigate('/login')
  }

  const activeItem = sidebarItems.find((i) => i.key === activeTab)

  return (
    <div className="flex h-screen bg-[#09090B] text-white overflow-hidden">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#0a0a0c] border-r border-[#1a1a2e] flex flex-col transition-transform duration-300 lg:relative lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-5 border-b border-[#1a1a2e]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-black text-sm shadow-lg shadow-emerald-900/30">
              P
            </div>
            <span className="text-sm font-bold tracking-tight">PaperMind AI</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-zinc-500 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User card */}
        <div className="px-4 py-4 border-b border-[#1a1a2e]">
          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-emerald-500/8 border border-emerald-500/15">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-xs shadow-md">
              {(user.name || 'S').charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-white truncate">{user.name || 'Student'}</p>
              <p className="text-[10px] text-emerald-400 font-semibold uppercase tracking-wider">Student</p>
            </div>
          </div>
        </div>

        {/* Nav items */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
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
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 shadow-sm'
                    : 'text-zinc-500 hover:text-zinc-300 hover:bg-[#111116] border border-transparent'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {item.label}
              </button>
            )
          })}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-[#1a1a2e]">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-red-400/70 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="h-16 flex items-center justify-between px-4 sm:px-6 border-b border-[#1a1a2e] bg-[#09090B]/80 backdrop-blur-md shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-zinc-500 hover:text-white"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 text-sm font-bold text-white">
              {activeItem && <activeItem.icon className="w-4 h-4 text-emerald-400" />}
              {activeItem?.label || 'Dashboard'}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
              Student Portal
            </span>
          </div>
        </header>

        {/* Content area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Welcome */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
                    Welcome, <span className="text-emerald-400">{user.name || 'Student'}</span>
                  </h1>
                  <p className="text-xs text-zinc-500 mt-1">Your personal study companion powered by AI.</p>
                </div>
                <button className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-lg shadow-emerald-900/20 transition-all duration-200 hover:-translate-y-0.5 shrink-0">
                  <Sparkles className="w-3.5 h-3.5" />
                  Upload Notes
                </button>
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {statsData.map((stat) => {
                  const Icon = stat.icon
                  const colorMap = {
                    emerald: 'from-emerald-500/15 to-emerald-500/5 border-emerald-500/15 text-emerald-400',
                    teal: 'from-teal-500/15 to-teal-500/5 border-teal-500/15 text-teal-400',
                    cyan: 'from-cyan-500/15 to-cyan-500/5 border-cyan-500/15 text-cyan-400',
                    green: 'from-green-500/15 to-green-500/5 border-green-500/15 text-green-400',
                  }
                  return (
                    <div
                      key={stat.label}
                      className={`p-4 rounded-2xl bg-gradient-to-br border ${colorMap[stat.color]} backdrop-blur-sm`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <Icon className="w-5 h-5 opacity-80" />
                        <TrendingUp className="w-3.5 h-3.5 opacity-40" />
                      </div>
                      <p className="text-2xl font-black">{stat.value}</p>
                      <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider mt-1">{stat.label}</p>
                    </div>
                  )
                })}
              </div>

              {/* Quick actions */}
              <div className="p-5 rounded-2xl bg-[#0f0f14] border border-[#1a1a2e]">
                <h3 className="text-sm font-bold mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { label: 'Upload Notes', desc: 'Upload your class notes or materials', icon: Upload, tab: 'upload-notes' },
                    { label: 'My Summaries', desc: 'View AI-generated summaries', icon: FileText, tab: 'summaries' },
                    { label: 'Important Topics', desc: 'See topics predicted for exams', icon: Star, tab: 'important-topics' },
                  ].map((action) => {
                    const Icon = action.icon
                    return (
                      <button
                        key={action.label}
                        onClick={() => setActiveTab(action.tab)}
                        className="flex items-center gap-3 p-3.5 rounded-xl bg-[#09090B] border border-[#27272A] hover:border-emerald-500/30 hover:bg-emerald-500/5 transition-all duration-200 text-left group"
                      >
                        <div className="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
                          <Icon className="w-4 h-4 text-emerald-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-white">{action.label}</p>
                          <p className="text-[10px] text-zinc-500 mt-0.5">{action.desc}</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-emerald-400 transition-colors shrink-0" />
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Empty study activity */}
              <div className="p-5 rounded-2xl bg-[#0f0f14] border border-[#1a1a2e]">
                <h3 className="text-sm font-bold mb-4">Study Activity</h3>
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center mb-3">
                    <BookOpen className="w-5 h-5 text-emerald-400/50" />
                  </div>
                  <p className="text-xs font-semibold text-zinc-500">No study activity yet</p>
                  <p className="text-[10px] text-zinc-600 mt-1">Upload your notes to get started with AI summaries and study tools.</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'upload-notes' && <UploadNotes />}
          {activeTab === 'summaries' && <MySummaries />}
          {activeTab === 'important-topics' && <ImportantTopics />}
          {activeTab === 'study-focus' && <StudyFocus />}
          {activeTab === 'settings' && <StudentSettings />}
        </div>
      </main>
    </div>
  )
}
