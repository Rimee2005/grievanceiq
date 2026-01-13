'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';

export default function Navbar() {
  const pathname = usePathname();
  const { t, language, setLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '/', key: 'nav.home' },
    { href: '/submit', key: 'nav.submit' },
    { href: '/track', key: 'nav.track' },
    { href: '/contact', key: 'nav.contact' },
    { href: '/admin', key: 'nav.admin' },
  ];

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'hi' : 'en');
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 text-white shadow-lg transition-all duration-300 ${
      scrolled 
        ? 'bg-gov-blue/90 dark:bg-gray-800/90 backdrop-blur-md shadow-xl' 
        : 'bg-gov-blue dark:bg-gray-800'
    }`}>
      <div className="w-full px-2 sm:px-3 lg:px-4">
        <div className="flex items-center h-16 relative">
          {/* Logo - Extreme left corner */}
          <div className="flex items-center flex-shrink-0 z-10">
            <Link href="/" className="flex items-center gap-2.5 hover:opacity-90 transition-opacity group">
              <div className="relative flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14">
                {/* Speech Bubble with Building and Circuit Elements - Perfectly matching theme */}
                <svg
                  width="56"
                  height="56"
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
              <span className="text-xl sm:text-2xl font-extrabold hidden sm:block leading-tight tracking-tight">
                <span className="text-white drop-shadow-md">Grievance</span>
                <span className="text-blue-300 drop-shadow-md">AI</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation - Center-aligned with equal spacing */}
          <div className="hidden md:flex items-center justify-center absolute left-1/2 transform -translate-x-1/2 gap-4 lg:gap-5 xl:gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3.5 py-2.5 rounded-lg text-sm font-semibold transition-all whitespace-nowrap leading-relaxed ${
                  pathname === link.href || pathname?.startsWith(link.href + '/')
                    ? 'bg-blue-700 dark:bg-blue-600 text-white shadow-md scale-105'
                    : 'hover:bg-blue-700 dark:hover:bg-blue-600 hover:scale-105'
                }`}
              >
                {t(link.key)}
              </Link>
            ))}
          </div>

          {/* Toggle Buttons - Right side with minimum padding */}
          <div className="hidden md:flex items-center gap-3 mr-2 sm:mr-3 lg:mr-4 ml-auto z-10">
            {/* Language Toggle Button */}
            <button
              onClick={toggleLanguage}
              className="w-10 h-10 rounded-lg bg-gray-700/80 dark:bg-gray-600/80 hover:bg-gray-600 dark:hover:bg-gray-500 flex items-center justify-center transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
              aria-label={`Switch to ${language === 'en' ? 'Hindi' : 'English'}`}
              title={`Switch to ${language === 'en' ? 'Hindi' : 'English'}`}
            >
              <span className="text-white text-base font-semibold leading-none">文A</span>
            </button>

            {/* Dark/Light Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="w-10 h-10 rounded-lg bg-gray-700/80 dark:bg-gray-600/80 hover:bg-gray-600 dark:hover:bg-gray-500 flex items-center justify-center transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? (
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              )}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-3 mr-2 sm:mr-3 ml-auto">
            {/* Grouped Toggle Buttons for Mobile - Equal size and styling */}
            <div className="flex items-center gap-2.5">
              {/* Language Toggle for Mobile */}
              <button
                onClick={toggleLanguage}
                className="w-9 h-9 rounded-lg bg-gray-700/80 hover:bg-gray-600 flex items-center justify-center transition-all duration-200"
                aria-label={`Switch to ${language === 'en' ? 'Hindi' : 'English'}`}
              >
                <span className="text-white text-sm font-semibold leading-none">文A</span>
              </button>

              {/* Dark/Light Mode Toggle for Mobile */}
              <button
                onClick={toggleTheme}
                className="w-9 h-9 rounded-lg bg-gray-700/80 hover:bg-gray-600 flex items-center justify-center transition-all duration-200"
                aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              >
                {theme === 'light' ? (
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                )}
              </button>
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              aria-label="Toggle menu"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {mobileMenuOpen ? (
                  <path d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-3 rounded-lg text-base font-semibold transition-colors leading-relaxed ${
                  pathname === link.href || pathname?.startsWith(link.href + '/')
                    ? 'bg-blue-700 dark:bg-blue-600'
                    : 'hover:bg-blue-700 dark:hover:bg-blue-600'
                }`}
              >
                {t(link.key)}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}

