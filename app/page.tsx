'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';

const features = [
  { en: 'AI-powered automatic classification', hi: 'AI-संचालित स्वचालित वर्गीकरण' },
  { en: 'Intelligent priority assignment', hi: 'बुद्धिमान प्राथमिकता असाइनमेंट' },
  { en: 'Duplicate complaint detection', hi: 'डुप्लिकेट शिकायत पहचान' },
  { en: 'Image evidence support', hi: 'छवि साक्ष्य समर्थन' },
  { en: 'Real-time status tracking', hi: 'वास्तविक समय स्थिति ट्रैकिंग' },
  { en: 'Multi-language support (English & Hindi)', hi: 'बहु-भाषा समर्थन (अंग्रेजी और हिंदी)' },
];

const howItWorks = [
  { en: 'Submit your complaint with details and optional images', hi: 'विवरण और वैकल्पिक छवियों के साथ अपनी शिकायत दर्ज करें' },
  { en: 'AI analyzes and categorizes your complaint automatically', hi: 'AI स्वचालित रूप से आपकी शिकायत का विश्लेषण और वर्गीकरण करता है' },
  { en: 'System assigns priority and routes to the right department', hi: 'सिस्टम प्राथमिकता निर्धारित करता है और सही विभाग में रूट करता है' },
  { en: 'Track your complaint status in real-time', hi: 'वास्तविक समय में अपनी शिकायत की स्थिति को ट्रैक करें' },
  { en: 'Receive updates as your complaint is processed', hi: 'जैसे ही आपकी शिकायत संसाधित होती है, अपडेट प्राप्त करें' },
];

// FAQ Data
const faqs = [
  {
    question: {
      en: 'How do I submit a complaint?',
      hi: 'मैं शिकायत कैसे दर्ज करूं?',
    },
    answer: {
      en: 'You can submit a complaint by clicking on "Submit Complaint" in the navigation menu. Fill out the form with your details, describe your complaint, and optionally upload images as evidence.',
      hi: 'आप नेविगेशन मेनू में "शिकायत दर्ज करें" पर क्लिक करके शिकायत दर्ज कर सकते हैं। अपने विवरण के साथ फॉर्म भरें, अपनी शिकायत का वर्णन करें, और वैकल्पिक रूप से साक्ष्य के रूप में छवियां अपलोड करें।',
    },
  },
  {
    question: {
      en: 'How long does it take to resolve a complaint?',
      hi: 'शिकायत को हल करने में कितना समय लगता है?',
    },
    answer: {
      en: 'The resolution time depends on the priority and complexity of your complaint. High-priority complaints are typically addressed within 24-48 hours, while others may take 3-5 business days.',
      hi: 'समाधान समय आपकी शिकायत की प्राथमिकता और जटिलता पर निर्भर करता है। उच्च-प्राथमिकता वाली शिकायतों को आमतौर पर 24-48 घंटों के भीतर संबोधित किया जाता है, जबकि अन्य में 3-5 व्यावसायिक दिन लग सकते हैं।',
    },
  },
  {
    question: {
      en: 'Can I track the status of my complaint?',
      hi: 'क्या मैं अपनी शिकायत की स्थिति को ट्रैक कर सकता हूं?',
    },
    answer: {
      en: 'Yes, you can track your complaint status by visiting the "Track Status" page and entering your complaint ID or email address.',
      hi: 'हां, आप "स्थिति ट्रैक करें" पृष्ठ पर जाकर और अपनी शिकायत ID या ईमेल पता दर्ज करके अपनी शिकायत की स्थिति को ट्रैक कर सकते हैं।',
    },
  },
  {
    question: {
      en: 'What types of complaints can I submit?',
      hi: 'मैं किस प्रकार की शिकायतें दर्ज कर सकता हूं?',
    },
    answer: {
      en: 'You can submit complaints related to public services, infrastructure issues, administrative problems, and other governance-related concerns. Our AI system automatically categorizes your complaint.',
      hi: 'आप सार्वजनिक सेवाओं, बुनियादी ढांचे की समस्याओं, प्रशासनिक समस्याओं और अन्य शासन-संबंधी चिंताओं से संबंधित शिकायतें दर्ज कर सकते हैं। हमारी AI प्रणाली स्वचालित रूप से आपकी शिकायत को वर्गीकृत करती है।',
    },
  },
  {
    question: {
      en: 'How does the AI system prioritize complaints?',
      hi: 'AI प्रणाली शिकायतों को कैसे प्राथमिकता देती है?',
    },
    answer: {
      en: 'Our AI system analyzes the urgency, sentiment, and content of your complaint to assign priority levels. Factors like safety concerns, time-sensitive issues, and emotional tone are considered.',
      hi: 'हमारी AI प्रणाली आपकी शिकायत की तात्कालिकता, भावना और सामग्री का विश्लेषण करके प्राथमिकता स्तर निर्धारित करती है। सुरक्षा चिंताओं, समय-संवेदनशील मुद्दों और भावनात्मक स्वर जैसे कारकों पर विचार किया जाता है।',
    },
  },
  {
    question: {
      en: 'Can I upload images with my complaint?',
      hi: 'क्या मैं अपनी शिकायत के साथ छवियां अपलोड कर सकता हूं?',
    },
    answer: {
      en: 'Yes, you can upload images (JPG, PNG, JPEG) up to 5MB as evidence to support your complaint. Images help provide visual context and can speed up the resolution process.',
      hi: 'हां, आप अपनी शिकायत का समर्थन करने के लिए साक्ष्य के रूप में 5MB तक की छवियां (JPG, PNG, JPEG) अपलोड कर सकते हैं। छवियां दृश्य संदर्भ प्रदान करने में मदद करती हैं और समाधान प्रक्रिया को तेज कर सकती हैं।',
    },
  },
];

export default function Home() {
  const { t, language } = useLanguage();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 transition-colors">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            {t('home.title')}
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            {t('home.subtitle')}
          </p>
        </div>

        {/* Workflow Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mt-12 md:mt-16 mb-8 md:mb-12">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-all">
            <div className="text-4xl mb-4">📝</div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{t('home.step1.title')}</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm md:text-base">
              {t('home.step1.desc')}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-all">
            <div className="text-4xl mb-4">🤖</div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{t('home.step2.title')}</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm md:text-base">
              {t('home.step2.desc')}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-all">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">{t('home.step3.title')}</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm md:text-base">
              {t('home.step3.desc')}
            </p>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 md:mb-16">
          <Link
            href="/submit"
            className="w-full sm:w-auto bg-gov-blue dark:bg-blue-600 text-white px-6 md:px-8 py-3 rounded-lg font-semibold hover:bg-gov-dark dark:hover:bg-blue-700 transition-colors shadow-lg text-center"
          >
            {t('home.cta.submit')}
          </Link>
          <Link
            href="/track"
            className="w-full sm:w-auto bg-white dark:bg-gray-800 text-gov-blue dark:text-blue-400 px-6 md:px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-lg border-2 border-gov-blue dark:border-blue-500 text-center"
          >
            {t('home.cta.track')}
          </Link>
        </div>

        {/* Features Section */}
        <div className="mt-12 md:mt-20 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors">
            <h3 className="text-xl md:text-2xl font-semibold mb-4 text-gray-900 dark:text-white">{t('home.features.title')}</h3>
            <ul className="space-y-2 text-gray-700 dark:text-gray-300 text-sm md:text-base">
              {features.map((feature, index) => (
                <li key={index}>✓ {feature[language]}</li>
              ))}
            </ul>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors">
            <h3 className="text-xl md:text-2xl font-semibold mb-4 text-gray-900 dark:text-white">{t('home.howitworks.title')}</h3>
            <ol className="space-y-3 text-gray-700 dark:text-gray-300 list-decimal list-inside text-sm md:text-base">
              {howItWorks.map((step, index) => (
                <li key={index}>{step[language]}</li>
              ))}
            </ol>
          </div>
        </div>

        {/* Trust Section */}
        <div className="mt-12 md:mt-20">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 dark:text-white mb-8 md:mb-12">
            {t('trust.title')}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-12">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center transition-all hover:shadow-xl hover:scale-105">
              <div className="text-4xl mb-4">🔒</div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{t('trust.secure')}</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm md:text-base">{t('trust.secure.desc')}</p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center transition-all hover:shadow-xl hover:scale-105">
              <div className="text-4xl mb-4">🤖</div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{t('trust.ai')}</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm md:text-base">{t('trust.ai.desc')}</p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center transition-all hover:shadow-xl hover:scale-105">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{t('trust.transparent')}</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm md:text-base">{t('trust.transparent.desc')}</p>
            </div>
          </div>

          {/* Metrics - Minimal Professional Style */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md p-8 md:p-10 text-center transition-all duration-300 hover:-translate-y-1 border border-gray-100 dark:border-gray-700">
              <div className="text-3xl md:text-4xl font-bold mb-3 text-gray-900 dark:text-white tracking-tight">10K+</div>
              <div className="text-base md:text-lg font-medium text-gray-600 dark:text-gray-400 leading-relaxed">{t('trust.resolved')}</div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md p-8 md:p-10 text-center transition-all duration-300 hover:-translate-y-1 border border-gray-100 dark:border-gray-700">
              <div className="text-3xl md:text-4xl font-bold mb-3 text-gray-900 dark:text-white tracking-tight">2.5</div>
              <div className="text-base md:text-lg font-medium text-gray-600 dark:text-gray-400 leading-relaxed">{t('trust.avgTime')}</div>
              <div className="text-sm mt-2 text-gray-500 dark:text-gray-500 font-normal">{language === 'hi' ? 'दिन' : 'Days'}</div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md p-8 md:p-10 text-center transition-all duration-300 hover:-translate-y-1 border border-gray-100 dark:border-gray-700">
              <div className="text-3xl md:text-4xl font-bold mb-3 text-gray-900 dark:text-white tracking-tight">25+</div>
              <div className="text-base md:text-lg font-medium text-gray-600 dark:text-gray-400 leading-relaxed">{t('trust.departments')}</div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div id="faq" className="mt-12 md:mt-20 scroll-mt-20">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 dark:text-white mb-8 md:mb-12">
            {t('help.faq.title')}
          </h2>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 md:p-8 space-y-4 transition-colors">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="border-b border-gray-200 dark:border-gray-700 last:border-b-0 pb-4 last:pb-0"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full text-left flex justify-between items-center py-2 group"
                >
                  <h3 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white pr-4 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {faq.question[language]}
                  </h3>
                  <span className="text-2xl text-gray-500 dark:text-gray-400 flex-shrink-0 transition-transform duration-200 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                    {openFaq === index ? '−' : '+'}
                  </span>
                </button>
                {openFaq === index && (
                  <p className="text-gray-600 dark:text-gray-300 text-sm md:text-base mt-2 pl-2 animate-in fade-in duration-200">
                    {faq.answer[language]}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

