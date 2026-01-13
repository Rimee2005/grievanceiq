'use client';

import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import toast from 'react-hot-toast';

export default function Contact() {
  const { t, language } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const contactInfo = {
    address: {
      en: 'WIT Darbhanga, Pincode 846004',
      hi: 'WIT दरभंगा, पिनकोड 846004',
    },
    phone: {
      en: '+91-11-2345-6789',
      hi: '+91-11-2345-6789',
    },
    email: {
      en: 'support@grievanceiq.gov.in',
      hi: 'support@grievanceiq.gov.in',
    },
    hours: {
      en: 'Monday - Friday: 9:00 AM - 6:00 PM\nSaturday: 10:00 AM - 2:00 PM\nSunday: Closed',
      hi: 'सोमवार - शुक्रवार: सुबह 9:00 - शाम 6:00\nशनिवार: सुबह 10:00 - दोपहर 2:00\nरविवार: बंद',
    },
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    // Basic validation
    if (!formData.name || !formData.email || !formData.message) {
      toast.error(
        language === 'hi'
          ? 'कृपया सभी आवश्यक फ़ील्ड भरें'
          : 'Please fill in all required fields'
      );
      setSubmitting(false);
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error(
        language === 'hi'
          ? 'कृपया एक वैध ईमेल पता दर्ज करें'
          : 'Please enter a valid email address'
      );
      setSubmitting(false);
      return;
    }

    // Simulate form submission
    setTimeout(() => {
      toast.success(
        language === 'hi'
          ? 'संदेश सफलतापूर्वक भेजा गया!'
          : 'Message sent successfully!'
      );
      setFormData({ name: '', email: '', message: '' });
      setSubmitting(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            {t('contact.title')}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            {t('contact.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Information */}
          <div className="space-y-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 transition-colors">
              <div className="flex items-start mb-4">
                <div className="text-3xl mr-4">📍</div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {t('contact.address.title')}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 whitespace-pre-line">
                    {contactInfo.address[language]}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 transition-colors">
              <div className="flex items-start mb-4">
                <div className="text-3xl mr-4">📞</div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {t('contact.phone.title')}
                  </h3>
                  <a
                    href={`tel:${contactInfo.phone.en}`}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                  >
                    {contactInfo.phone[language]}
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 transition-colors">
              <div className="flex items-start mb-4">
                <div className="text-3xl mr-4">✉️</div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {t('contact.email.title')}
                  </h3>
                  <a
                    href={`mailto:${contactInfo.email.en}`}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                  >
                    {contactInfo.email[language]}
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 transition-colors">
              <div className="flex items-start mb-4">
                <div className="text-3xl mr-4">🕒</div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {t('contact.hours.title')}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 whitespace-pre-line">
                    {contactInfo.hours[language]}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 md:p-8 transition-colors">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              {t('contact.form.title')}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('contact.form.name')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                  placeholder={language === 'hi' ? 'आपका नाम' : 'Your name'}
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('contact.form.email')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                  placeholder={language === 'hi' ? 'आपका ईमेल' : 'your.email@example.com'}
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('contact.form.message')} <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  rows={6}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                  placeholder={t('contact.form.message.placeholder')}
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-gov-blue dark:bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-gov-dark dark:hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? t('common.loading') : t('contact.form.send')}
              </button>
            </form>
          </div>
        </div>

        {/* Map Section */}
        <div className="mt-12 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 text-center">
            {language === 'hi' ? 'हमारा स्थान' : 'Our Location'}
          </h3>
          <div className="rounded-lg overflow-hidden h-64 md:h-96">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3578.5!2d85.9!3d26.2!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39edb8c8c8c8c8c8%3A0x8c8c8c8c8c8c8c8c!2sWIT%20Campus%2C%20Darbhanga%2C%20Bihar%20846004!5e0!3m2!1sen!2sin!4v1234567890123!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full"
              title="WIT Campus, Darbhanga"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
}

