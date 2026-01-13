'use client';

import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function ChatButton() {
  const [isOpen, setIsOpen] = useState(false);
  const { t, language } = useLanguage();

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gov-blue dark:bg-blue-600 text-white rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all flex items-center justify-center group"
        aria-label="Need Help?"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
        {!isOpen && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse"></span>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-80 md:w-96 bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700">
          <div className="bg-gov-blue dark:bg-blue-600 text-white p-4 rounded-t-lg flex justify-between items-center">
            <h3 className="font-semibold">
              {language === 'hi' ? 'सहायता चाहिए?' : 'Need Help?'}
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-gray-200 transition-colors"
              aria-label="Close"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="p-4 max-h-96 overflow-y-auto">
            <div className="space-y-4">
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                {language === 'hi' 
                  ? 'हमसे संपर्क करें या सहायता प्राप्त करें।' 
                  : 'Contact us or get help with your complaint.'}
              </p>
              <div className="space-y-2">
                <a
                  href="/contact"
                  className="block w-full bg-blue-50 dark:bg-gray-700 hover:bg-blue-100 dark:hover:bg-gray-600 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-lg transition-colors text-sm font-medium"
                >
                  {language === 'hi' ? '📧 संपर्क करें' : '📧 Contact Us'}
                </a>
                <a
                  href="/help"
                  className="block w-full bg-blue-50 dark:bg-gray-700 hover:bg-blue-100 dark:hover:bg-gray-600 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-lg transition-colors text-sm font-medium"
                >
                  {language === 'hi' ? '❓ सहायता' : '❓ Help & Support'}
                </a>
                <a
                  href="/track"
                  className="block w-full bg-blue-50 dark:bg-gray-700 hover:bg-blue-100 dark:hover:bg-gray-600 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-lg transition-colors text-sm font-medium"
                >
                  {language === 'hi' ? '📊 शिकायत ट्रैक करें' : '📊 Track Complaint'}
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

