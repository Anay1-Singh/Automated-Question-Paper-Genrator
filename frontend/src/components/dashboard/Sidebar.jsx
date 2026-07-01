import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import {
  BrainCircuit,
  LayoutDashboard,
  FilePlus,
  Files,
  Database,
  BarChart3,
  History,
  Settings,
  HelpCircle,
  LogOut,
  X
} from 'lucide-react'

export default function Sidebar({
  activeTab,
  setActiveTab,
  isOpen,
  setIsOpen,
  user
}) {
  const navigate = useNavigate()

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'generate', label: 'Generate Paper', icon: FilePlus },
    { id: 'documents', label: 'Documents', icon: Files },
    { id: 'qbank', label: 'Question Bank', icon: Database },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'history', label: 'History', icon: History },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'help', label: 'Help & Support', icon: HelpCircle }
  ]

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/')
  }

  // Get user initials and name
  const userName = user?.name || 'Academic User'
  const userInitials = userName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  const sidebarContent = (
    <div className="h-full flex flex-col justify-between bg-[#18181B] border-r border-[#27272A] p-4 text-left">
      
      {/* Header / Logo */}
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between px-2 py-3">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="p-1.5 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <BrainCircuit className="w-5 h-5 text-blue-500" />
            </div>
            <span className="font-display font-bold text-lg text-white tracking-tight">
              PaperMind<span className="text-blue-500">.ai</span>
            </span>
          </Link>
          
          {/* Collapse Icon on Mobile */}
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden p-1 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex flex-col gap-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = activeTab === item.id
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id)
                  setIsOpen(false) // Close drawer on mobile
                }}
                className={`w-full flex items-center gap-3 px-3 py-3 text-xs sm:text-sm font-semibold rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-600/10 text-blue-500 border border-blue-500/15'
                    : 'text-[#A1A1AA] hover:text-white hover:bg-zinc-800/40 border border-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-blue-500' : 'text-zinc-500'}`} />
                <span>{item.label}</span>
              </button>
            )
          })}
        </nav>
      </div>

      {/* User Actions & Logout */}
      <div className="flex flex-col gap-4 border-t border-[#27272A]/70 pt-4">
        {/* Profile Card Summary */}
        <div className="flex items-center gap-3 px-2">
          <div className="w-9 h-9 rounded-full bg-blue-600 border border-blue-500/20 text-white font-bold text-xs flex items-center justify-center shrink-0">
            {userInitials}
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="text-xs font-bold text-white truncate max-w-[120px]">{userName}</span>
            <span className="text-[10px] text-zinc-500 font-medium">{user?.role || 'Professor'}</span>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-3 text-xs sm:text-sm font-semibold text-red-400 hover:text-red-300 hover:bg-red-500/5 rounded-xl border border-transparent hover:border-red-500/10 transition-colors"
        >
          <LogOut className="w-4 h-4 text-red-400 shrink-0" />
          <span>Logout</span>
        </button>
      </div>

    </div>
  )

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:block lg:w-64 xl:w-72 h-screen shrink-0 sticky top-0">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Black Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black"
          />

          {/* Drawer Panel Container */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="relative w-64 max-w-xs h-full z-10"
          >
            {sidebarContent}
          </motion.div>
        </div>
      )}
    </>
  )
}
