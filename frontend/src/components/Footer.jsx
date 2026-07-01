import { BrainCircuit } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const productLinks = [
    { name: 'Features', href: '#features' },
    { name: 'Showcase', href: '#showcase' },
    { name: 'LMS Sync', href: '#features' }
  ]

  const resourceLinks = [
    { name: 'Documentation', href: '#docs' },
    { name: 'Bloom\'s Guide', href: '#guides' },
    { name: 'Security standards', href: '#security' },
    { name: 'Help Center', href: '#help' }
  ]

  const companyLinks = [
    { name: 'About', href: '#about' },
    { name: 'Blog', href: '#blog' },
    { name: 'Careers', href: '#careers' },
    { name: 'Contact Sales', href: '#contact' }
  ]

  const socialIcons = [
    {
      name: 'Github',
      href: 'https://github.com',
      svg: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
        </svg>
      )
    },
    {
      name: 'Twitter',
      href: 'https://twitter.com',
      svg: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      )
    },
    {
      name: 'Discord',
      href: 'https://discord.com',
      svg: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.094 13.094 0 01-1.873-.894.077.077 0 01-.008-.128c.126-.093.252-.19.372-.287a.075.075 0 01.077-.011c3.92 1.793 8.18 1.793 12.061 0a.073.073 0 01.078.009c.12.099.246.195.373.289a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.894.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.156-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.156 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.156-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.156 2.418z" />
        </svg>
      )
    },
    {
      name: 'LinkedIn',
      href: 'https://linkedin.com',
      svg: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
        </svg>
      )
    }
  ]

  return (
    <footer className="bg-[#09090B] border-t border-[#27272A] pt-20 pb-10 px-6 md:px-8 text-left relative z-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8 pb-16 border-b border-[#27272A]/60">
        
        {/* Logo and Description */}
        <div className="md:col-span-4 flex flex-col gap-4">
          <a href="#" className="flex items-center gap-2 group self-start">
            <div className="p-1.5 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <BrainCircuit className="w-5 h-5 text-blue-500" />
            </div>
            <span className="font-display font-bold text-lg text-white">
              PaperMind<span className="text-blue-500">.ai</span>
            </span>
          </a>
          <p className="text-xs text-[#A1A1AA] leading-relaxed max-w-sm">
            AI-driven assessment design engine helping universities automatically generate, audit, and calibrate cognitive-level question papers compliant with Bloom's Taxonomy.
          </p>
        </div>

        {/* Links Grid */}
        <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-8">
          <div>
            <h4 className="text-[10px] font-bold text-white uppercase tracking-widest mb-4">Product</h4>
            <ul className="flex flex-col gap-3">
              {productLinks.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-xs text-[#A1A1AA] hover:text-white transition-colors duration-150">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] font-bold text-white uppercase tracking-widest mb-4">Resources</h4>
            <ul className="flex flex-col gap-3">
              {resourceLinks.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-xs text-[#A1A1AA] hover:text-white transition-colors duration-150">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] font-bold text-white uppercase tracking-widest mb-4">Company</h4>
            <ul className="flex flex-col gap-3">
              {companyLinks.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-xs text-[#A1A1AA] hover:text-white transition-colors duration-150">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

      </div>

      {/* Bottom Legal & Social */}
      <div className="max-w-7xl mx-auto pt-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        
        {/* Left Side: Copyright and Terms */}
        <div className="flex flex-col sm:flex-row items-center gap-4 text-[11px] text-[#A1A1AA] font-medium text-center sm:text-left">
          <span>&copy; {currentYear} PaperMind AI Inc. All rights reserved.</span>
          <div className="hidden sm:block w-1 h-1 bg-[#27272A] rounded-full" />
          <div className="flex items-center gap-4">
            <a href="#privacy" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#terms" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>

        {/* Right Side: Social Media Icons */}
        <div className="flex items-center gap-4">
          {socialIcons.map((soc) => {
            return (
              <a
                key={soc.name}
                href={soc.href}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded-lg bg-[#18181B] border border-[#27272A]/80 text-[#A1A1AA] hover:text-white hover:border-zinc-700 transition-all duration-200"
                aria-label={soc.name}
              >
                {soc.svg}
              </a>
            )
          })}
        </div>

      </div>
    </footer>
  )
}
