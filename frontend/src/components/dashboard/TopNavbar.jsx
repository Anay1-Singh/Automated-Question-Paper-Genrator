import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, Bell, Menu, ChevronDown, User, Settings, LogOut } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function TopNavbar({
  activeTab,
  setSidebarOpen,
  user
}) {
  const navigate = useNavigate()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  // Format tab label for breadcrumb
  const getBreadcrumbLabel = (tab) => {
    switch (tab) {
      case 'dashboard': return 'Dashboard Overview'
      case 'generate': return 'Generate Question Paper'
      case 'documents': return 'Course Documents'
      case 'qbank': return 'Question Bank Management'
      case 'analytics': return 'Assessment Analytics'
      case 'history': return 'Paper Generation History'
      case 'settings': return 'Portal Settings'
      case 'help': return 'Help & Support'
      default: return 'Portal'
    }
  }

  // Handle click outside dropdown to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

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

  return (
    <header className="bg-[#18181B] border-b border-[#27272A] px-6 py-4 flex items-center justify-between sticky top-0 z-30">
      
      {/* Left: Mobile Toggle & Breadcrumb */}
      <div className="flex items-center gap-4 text-left">
        <button
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors"
          aria-label="Open navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider font-mono">Academic Portal</span>
          <h1 className="text-sm sm:text-base font-bold text-white tracking-tight mt-0.5">
            {getBreadcrumbLabel(activeTab)}
          </h1>
        </div>
      </div>

      {/* Right: Search, Notifications, Avatar Profile Dropdown */}
      <div className="flex items-center gap-6">
        
        {/* Search bar */}
        <div className="hidden md:flex items-center gap-2 bg-[#09090B] border border-[#27272A] rounded-xl px-3 py-1.5 text-zinc-500 text-xs w-60">
          <Search className="w-3.5 h-3.5" />
          <input
            type="text"
            placeholder="Search papers, questions..."
            className="bg-transparent border-none text-white focus:outline-none w-full placeholder-zinc-500"
          />
        </div>

        {/* Notifications */}
        <button
          className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800/60 transition-colors relative"
          aria-label="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-blue-500 rounded-full" />
        </button>

        <div className="h-4 w-px bg-[#27272A]" />

        {/* User profile dropdown container */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 group focus:outline-none"
            aria-expanded={dropdownOpen}
            aria-label="User dropdown menu"
          >
            <div className="w-8 h-8 rounded-full bg-blue-600 border border-blue-500/20 text-white font-bold text-xs flex items-center justify-center shrink-0">
              {userInitials}
            </div>
            <ChevronDown className={`w-3.5 h-3.5 text-zinc-400 group-hover:text-white transition-transform duration-200 ${dropdownOpen ? 'rotate-180 text-blue-500' : ''}`} />
          </button>

          {/* Dropdown Menu */}
          <AnimatePresence>
            {dropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-3 w-52 bg-[#18181B] border border-[#27272A] rounded-xl p-2 shadow-2xl flex flex-col gap-1 z-40 text-left"
              >
                <div className="px-3 py-2 border-b border-[#27272A]/60 mb-1">
                  <p className="text-xs font-bold text-white truncate">{userName}</p>
                  <p className="text-[10px] text-zinc-500 truncate mt-0.5">{user?.email || 'name@university.edu'}</p>
                </div>
                
                <button
                  onClick={() => { setDropdownOpen(false); navigate('/dashboard') }}
                  className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-lg text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors text-left"
                >
                  <User className="w-3.5 h-3.5" />
                  My Profile
                </button>
                <button
                  onClick={() => { setDropdownOpen(false); navigate('/dashboard') }}
                  className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-lg text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors text-left"
                >
                  <Settings className="w-3.5 h-3.5" />
                  Account Settings
                </button>
                
                <div className="h-px bg-[#27272A]/60 my-1" />
                
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/5 transition-colors text-left w-full"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Logout
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </header>
  )
}
