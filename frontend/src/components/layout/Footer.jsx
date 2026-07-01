"use client";

import { FOOTER_LINKS } from "@/constants/content";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-black border-t border-zinc-850 pt-16 pb-8 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-8 relative z-10">
        
        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pb-12">
          
          {/* Column 1 - Product */}
          <div>
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase mb-5 select-none">
              Product
            </h4>
            <ul className="flex flex-col gap-3">
              {FOOTER_LINKS.product.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-zinc-400 hover:text-white transition-colors duration-150 text-[13px]"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2 - Resources */}
          <div>
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase mb-5 select-none">
              Resources
            </h4>
            <ul className="flex flex-col gap-3">
              {FOOTER_LINKS.resources.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-zinc-400 hover:text-white transition-colors duration-150 text-[13px]"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 - Company */}
          <div>
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase mb-5 select-none">
              Company
            </h4>
            <ul className="flex flex-col gap-3">
              {FOOTER_LINKS.company.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-zinc-400 hover:text-white transition-colors duration-150 text-[13px]"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4 - Contact */}
          <div>
            <h4 className="text-white font-semibold text-xs tracking-wider uppercase mb-5 select-none">
              Contact
            </h4>
            <ul className="flex flex-col gap-3">
              {FOOTER_LINKS.contact.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-zinc-400 hover:text-white transition-colors duration-150 text-[13px]"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Footer Bottom */}
        <div className="pt-8 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-zinc-500 text-xs">
            &copy; {currentYear} EduBloom AI. Dedicated to curriculum assessment excellence.
          </p>
          <div className="flex gap-5 text-zinc-500 text-xs">
            <a href="#" className="hover:text-zinc-400 transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-zinc-400 transition-colors">
              Terms of Service
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}
