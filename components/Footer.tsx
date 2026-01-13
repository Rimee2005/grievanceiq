'use client';

import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-blue-900 dark:bg-slate-900 text-white mt-auto transition-colors duration-200 border-t border-blue-800 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          {/* Column 1: About with Logo */}
          <div className="space-y-5 sm:col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity group">
              <div className="relative flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 flex-shrink-0">
                {/* Reused Logo from Navbar - Exact same SVG */}
                <svg
                  width="64"
                  height="64"
                  viewBox="0 0 40 40"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="absolute inset-0 filter drop-shadow-lg"
                >
                  {/* Speech Bubble Outline - White stroke, clearly visible */}
                  <path
                    d="M8 8C8 5.79086 9.79086 4 12 4H28C30.2091 4 32 5.79086 32 8V24C32 26.2091 30.2091 28 28 28H20L12 34V28C9.79086 28 8 26.2091 8 24V8Z"
                    fill="none"
                    stroke="white"
                    strokeWidth="2.5"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    className="group-hover:brightness-110 transition-all"
                  />
                  {/* Building - White, clearly defined with three columns and triangular roof */}
                  {/* Left Column */}
                  <rect x="13.5" y="18" width="3.5" height="7" fill="white" />
                  {/* Center Column (taller) */}
                  <rect x="18.5" y="15.5" width="3.5" height="9.5" fill="white" />
                  {/* Right Column */}
                  <rect x="23.5" y="18" width="3.5" height="7" fill="white" />
                  {/* Triangular Roof - More prominent */}
                  <path d="M11.5 18L20 11L28.5 18H11.5Z" fill="white" />
                  
                  {/* Circuit Elements - Light blue (#60a5fa), with lines extending outwards */}
                  {/* Left Circuit Element */}
                  <circle cx="15.5" cy="10" r="2" fill="#60a5fa" />
                  <line x1="15.5" y1="10" x2="13" y2="7.5" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" />
                  <line x1="15.5" y1="10" x2="18" y2="7.5" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" />
                  <circle cx="13" cy="7.5" r="1.3" fill="#60a5fa" />
                  <circle cx="18" cy="7.5" r="1.3" fill="#60a5fa" />
                  
                  {/* Center Circuit Element */}
                  <circle cx="20" cy="10" r="2" fill="#60a5fa" />
                  <line x1="20" y1="10" x2="17.5" y2="7.5" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" />
                  <line x1="20" y1="10" x2="22.5" y2="7.5" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" />
                  <circle cx="17.5" cy="7.5" r="1.3" fill="#60a5fa" />
                  <circle cx="22.5" cy="7.5" r="1.3" fill="#60a5fa" />
                  
                  {/* Right Circuit Element */}
                  <circle cx="24.5" cy="10" r="2" fill="#60a5fa" />
                  <line x1="24.5" y1="10" x2="22" y2="7.5" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" />
                  <line x1="24.5" y1="10" x2="27" y2="7.5" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" />
                  <circle cx="22" cy="7.5" r="1.3" fill="#60a5fa" />
                  <circle cx="27" cy="7.5" r="1.3" fill="#60a5fa" />
                </svg>
              </div>
              <span className="text-2xl sm:text-3xl font-extrabold leading-tight tracking-tight">
                <span className="text-white drop-shadow-md">Grievance</span>
                <span className="text-blue-300 drop-shadow-md">AI</span>
              </span>
            </Link>
            <p className="text-gray-300 text-base leading-relaxed max-w-sm">
              GrievanceAI – an AI-powered grievance redressal platform for transparent and faster resolution.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-5">
            <h3 className="text-lg font-semibold text-white">{t('footer.quicklinks') || 'Quick Links'}</h3>
            <ul className="space-y-3.5">
              <li>
                <Link href="/" className="text-gray-300 hover:text-white transition-colors duration-200 inline-block text-base">
                  {t('nav.home') || 'Home'}
                </Link>
              </li>
              <li>
                <Link href="/submit" className="text-gray-300 hover:text-white transition-colors duration-200 inline-block text-base">
                  {t('nav.submit') || 'Submit Complaint'}
                </Link>
              </li>
              <li>
                <Link href="/track" className="text-gray-300 hover:text-white transition-colors duration-200 inline-block text-base">
                  {t('nav.track') || 'Track Complaint'}
                </Link>
              </li>
              <li>
                <Link href="/admin" className="text-gray-300 hover:text-white transition-colors duration-200 inline-block text-base">
                  {t('nav.admin') || 'Admin'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Support */}
          <div className="space-y-5">
            <h3 className="text-lg font-semibold text-white">{t('footer.support') || 'Support'}</h3>
            <ul className="space-y-3.5">
              <li>
                <Link href="/help" className="text-gray-300 hover:text-white transition-colors duration-200 inline-block text-base">
                  {t('nav.help') || 'Help and Support'}
                </Link>
              </li>
              <li>
                <Link href="/#faq" className="text-gray-300 hover:text-white transition-colors duration-200 inline-block text-base">
                  FAQs
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-white transition-colors duration-200 inline-block text-base">
                  {t('nav.contact') || 'Contact Support'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Social Media */}
          <div className="space-y-5">
            <h3 className="text-lg font-semibold text-white">{t('footer.follow') || 'Follow Us'}</h3>
            <div className="flex flex-row gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full bg-blue-800 dark:bg-slate-800 hover:bg-[#1877F2] text-gray-200 hover:text-white flex items-center justify-center transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[#1877F2] focus:ring-offset-2 focus:ring-offset-blue-900 dark:focus:ring-offset-slate-900"
                aria-label="Facebook"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full bg-blue-800 dark:bg-slate-800 hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black text-gray-200 flex items-center justify-center transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-blue-900 dark:focus:ring-offset-slate-900"
                aria-label="X (formerly Twitter)"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full bg-blue-800 dark:bg-slate-800 hover:bg-[#0A66C2] text-gray-200 hover:text-white flex items-center justify-center transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[#0A66C2] focus:ring-offset-2 focus:ring-offset-blue-900 dark:focus:ring-offset-slate-900"
                aria-label="LinkedIn"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full bg-blue-800 dark:bg-slate-800 hover:bg-gradient-to-br hover:from-[#833AB4] hover:via-[#FD1D1D] hover:to-[#FCAF45] text-gray-200 hover:text-white flex items-center justify-center transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 focus:ring-offset-blue-900 dark:focus:ring-offset-slate-900"
                aria-label="Instagram"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a
                href="https://discord.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full bg-blue-800 dark:bg-slate-800 hover:bg-[#5865F2] text-gray-200 hover:text-white flex items-center justify-center transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[#5865F2] focus:ring-offset-2 focus:ring-offset-blue-900 dark:focus:ring-offset-slate-900"
                aria-label="Discord"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.007-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928-1.793 6.4-1.793 10.28 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-blue-800 dark:border-slate-800 mt-8 pt-5">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-base">
            <p className="text-gray-200 dark:text-gray-300 text-center sm:text-left">
              &copy; 2026 GrievanceAI. All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-gray-200 dark:text-gray-300">
              <Link href="/privacy" className="hover:text-white dark:hover:text-white transition-colors duration-200">
                Privacy Policy
              </Link>
              <span className="text-blue-700 dark:text-slate-600">|</span>
              <Link href="/terms" className="hover:text-white dark:hover:text-white transition-colors duration-200">
                Terms & Conditions
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

