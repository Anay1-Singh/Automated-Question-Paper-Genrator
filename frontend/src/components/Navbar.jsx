import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Menu, X, BrainCircuit, ChevronRight } from 'lucide-react'

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { name: 'Features', href: '/#features' },
    { name: 'How It Works', href: '/#how-it-works' },
    { name: 'Showcase', href: '/#showcase' },
    { name: 'FAQ', href: '/#faq' }
  ]

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#09090B]/80 backdrop-blur-md border-b border-[#27272A]/80 py-4'
          : 'bg-transparent border-b border-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-8 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group focus-visible:ring-2 focus-visible:ring-blue-500 rounded-lg">
          <div className="p-1.5 bg-blue-500/10 border border-blue-500/20 rounded-lg group-hover:border-blue-500/40 transition-colors duration-300">
            <BrainCircuit className="w-6 h-6 text-blue-500" />
          </div>
          <span className="font-display font-bold text-xl tracking-tight text-white">
            PaperMind<span className="text-blue-500">.ai</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-[#A1A1AA] hover:text-white transition-colors duration-200"
            >
              {link.name}
            </a>
          ))}
        </div>

        {/* Desktop CTA Action Buttons */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            to="/login"
            className="text-sm font-medium text-[#A1A1AA] hover:text-white px-4 py-2 transition-colors duration-200"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 px-4 py-2.5 rounded-lg shadow-sm shadow-blue-900/10 hover:shadow-blue-900/20 hover:-translate-y-0.5 transition-all duration-200"
          >
            Get Started
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 text-[#A1A1AA] hover:text-white transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-blue-500 rounded-lg"
          aria-label="Toggle Menu"
          aria-expanded={isMobileMenuOpen}
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-[#09090B] border-b border-[#27272A] py-6 px-6 flex flex-col gap-6 animate-in fade-in slide-in-from-top-5 duration-200">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-base font-medium text-[#A1A1AA] hover:text-white transition-colors duration-200 py-1"
              >
                {link.name}
              </a>
            ))}
          </div>
          <div className="h-px bg-[#27272A]" />
          <div className="flex flex-col gap-3">
            <Link
              to="/login"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-center text-sm font-semibold text-[#A1A1AA] hover:text-white py-3 border border-[#27272A] rounded-lg transition-colors duration-200"
            >
              Login
            </Link>
            <Link
              to="/signup"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-center text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 py-3 rounded-lg shadow-md transition-colors duration-200"
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
