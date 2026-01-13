'use client';

import { useLanguage } from '@/contexts/LanguageContext';

export default function PrivacyPolicy() {
  const { t, language } = useLanguage();

  const content = {
    en: {
      title: 'Privacy Policy',
      lastUpdated: 'Last Updated: January 2026',
      sections: [
        {
          title: '1. Information We Collect',
          content: [
            'We collect information that you provide directly to us when you submit a complaint, including your name, email address, contact details, and the details of your complaint.',
            'We may also collect images and documents that you upload as evidence to support your complaint.',
            'Our system automatically collects certain information such as complaint ID, submission date, and status updates.',
          ],
        },
        {
          title: '2. How We Use Your Information',
          content: [
            'We use your information to process and manage your complaints effectively.',
            'Your information helps us route your complaint to the appropriate department for resolution.',
            'We use collected data to improve our services and analyze complaint patterns.',
          ],
        },
        {
          title: '3. Data Security',
          content: [
            'We implement appropriate technical and organizational measures to protect your personal information.',
            'All data is stored securely and access is restricted to authorized personnel only.',
            'We use encryption and secure protocols to safeguard your information during transmission.',
          ],
        },
        {
          title: '4. Data Sharing',
          content: [
            'We may share your complaint information with relevant government departments for resolution purposes.',
            'We do not sell, trade, or rent your personal information to third parties.',
            'Information may be disclosed if required by law or to protect our rights and safety.',
          ],
        },
        {
          title: '5. Your Rights',
          content: [
            'You have the right to access, update, or correct your personal information.',
            'You can request deletion of your data, subject to legal and operational requirements.',
            'You may opt-out of certain communications, though essential service updates will continue.',
          ],
        },
        {
          title: '6. Cookies and Tracking',
          content: [
            'We use cookies to enhance your experience and maintain your session.',
            'You can control cookie preferences through your browser settings.',
            'Some features may not function properly if cookies are disabled.',
          ],
        },
        {
          title: '7. Changes to This Policy',
          content: [
            'We may update this Privacy Policy from time to time.',
            'We will notify you of any significant changes by posting the new policy on this page.',
            'Your continued use of our services constitutes acceptance of the updated policy.',
          ],
        },
        {
          title: '8. Contact Us',
          content: [
            'If you have questions about this Privacy Policy, please contact us at support@grievanceiq.gov.in',
            'You can also reach us through our Contact Support page for privacy-related inquiries.',
          ],
        },
      ],
    },
    hi: {
      title: 'गोपनीयता नीति',
      lastUpdated: 'अंतिम अपडेट: जनवरी 2026',
      sections: [
        {
          title: '1. हम जो जानकारी एकत्र करते हैं',
          content: [
            'जब आप शिकायत दर्ज करते हैं, तो हम आपसे सीधे प्राप्त जानकारी एकत्र करते हैं, जिसमें आपका नाम, ईमेल पता, संपर्क विवरण और आपकी शिकायत का विवरण शामिल है।',
            'हम आपके द्वारा अपलोड की गई छवियां और दस्तावेज भी एकत्र कर सकते हैं जो आपकी शिकायत का समर्थन करने के लिए साक्ष्य के रूप में हैं।',
            'हमारी प्रणाली स्वचालित रूप से कुछ जानकारी एकत्र करती है जैसे शिकायत ID, प्रस्तुत करने की तारीख, और स्थिति अपडेट।',
          ],
        },
        {
          title: '2. हम आपकी जानकारी का उपयोग कैसे करते हैं',
          content: [
            'हम आपकी जानकारी का उपयोग आपकी शिकायतों को प्रभावी ढंग से संसाधित और प्रबंधित करने के लिए करते हैं।',
            'आपकी जानकारी हमें समाधान के लिए आपकी शिकायत को उपयुक्त विभाग में रूट करने में मदद करती है।',
            'हम अपनी सेवाओं में सुधार और शिकायत पैटर्न का विश्लेषण करने के लिए एकत्रित डेटा का उपयोग करते हैं।',
          ],
        },
        {
          title: '3. डेटा सुरक्षा',
          content: [
            'हम आपकी व्यक्तिगत जानकारी की सुरक्षा के लिए उपयुक्त तकनीकी और संगठनात्मक उपाय लागू करते हैं।',
            'सभी डेटा सुरक्षित रूप से संग्रहीत किया जाता है और पहुंच केवल अधिकृत कर्मियों तक सीमित है।',
            'हम प्रसारण के दौरान आपकी जानकारी की सुरक्षा के लिए एन्क्रिप्शन और सुरक्षित प्रोटोकॉल का उपयोग करते हैं।',
          ],
        },
        {
          title: '4. डेटा साझाकरण',
          content: [
            'हम समाधान उद्देश्यों के लिए प्रासंगिक सरकारी विभागों के साथ आपकी शिकायत जानकारी साझा कर सकते हैं।',
            'हम तीसरे पक्षों को आपकी व्यक्तिगत जानकारी बेचते, व्यापार या किराए पर नहीं देते हैं।',
            'कानून द्वारा आवश्यक होने पर या हमारे अधिकारों और सुरक्षा की रक्षा के लिए जानकारी का खुलासा किया जा सकता है।',
          ],
        },
        {
          title: '5. आपके अधिकार',
          content: [
            'आपको अपनी व्यक्तिगत जानकारी तक पहुंचने, अपडेट करने या सही करने का अधिकार है।',
            'आप कानूनी और परिचालन आवश्यकताओं के अधीन, अपने डेटा के विलोपन का अनुरोध कर सकते हैं।',
            'आप कुछ संचारों से बाहर निकल सकते हैं, हालांकि आवश्यक सेवा अपडेट जारी रहेगा।',
          ],
        },
        {
          title: '6. कुकीज़ और ट्रैकिंग',
          content: [
            'हम आपके अनुभव को बेहतर बनाने और आपके सत्र को बनाए रखने के लिए कुकीज़ का उपयोग करते हैं।',
            'आप अपने ब्राउज़र सेटिंग्स के माध्यम से कुकी प्राथमिकताओं को नियंत्रित कर सकते हैं।',
            'यदि कुकीज़ अक्षम हैं तो कुछ सुविधाएं ठीक से काम नहीं कर सकती हैं।',
          ],
        },
        {
          title: '7. इस नीति में परिवर्तन',
          content: [
            'हम समय-समय पर इस गोपनीयता नीति को अपडेट कर सकते हैं।',
            'हम इस पृष्ठ पर नई नीति पोस्ट करके किसी भी महत्वपूर्ण परिवर्तन के बारे में आपको सूचित करेंगे।',
            'हमारी सेवाओं का आपका निरंतर उपयोग अपडेट की गई नीति की स्वीकृति का गठन करता है।',
          ],
        },
        {
          title: '8. हमसे संपर्क करें',
          content: [
            'यदि इस गोपनीयता नीति के बारे में आपके कोई प्रश्न हैं, तो कृपया हमसे support@grievanceiq.gov.in पर संपर्क करें',
            'गोपनीयता-संबंधी पूछताछ के लिए आप हमारे संपर्क सहायता पृष्ठ के माध्यम से भी हमसे संपर्क कर सकते हैं।',
          ],
        },
      ],
    },
  };

  const pageContent = content[language];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            {pageContent.title}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            {pageContent.lastUpdated}
          </p>
        </div>

        {/* Content */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:p-8 lg:p-10 transition-colors">
          <div className="prose prose-lg dark:prose-invert max-w-none">
            {pageContent.sections.map((section, index) => (
              <div key={index} className="mb-8 last:mb-0">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  {section.title}
                </h2>
                <ul className="space-y-3 text-gray-700 dark:text-gray-300 text-base md:text-lg leading-relaxed">
                  {section.content.map((paragraph, pIndex) => (
                    <li key={pIndex} className="flex items-start gap-3">
                      <span className="text-blue-600 dark:text-blue-400 mt-1.5 flex-shrink-0">•</span>
                      <span>{paragraph}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Section */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 dark:text-gray-400 text-base md:text-lg">
            {language === 'en' 
              ? 'For questions about this Privacy Policy, please contact us at '
              : 'इस गोपनीयता नीति के बारे में प्रश्नों के लिए, कृपया हमसे संपर्क करें '}
            <a 
              href="mailto:support@grievanceiq.gov.in" 
              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold underline"
            >
              support@grievanceiq.gov.in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

