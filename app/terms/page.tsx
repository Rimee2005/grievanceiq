'use client';

import { useLanguage } from '@/contexts/LanguageContext';

export default function TermsConditions() {
  const { t, language } = useLanguage();

  const content = {
    en: {
      title: 'Terms & Conditions',
      lastUpdated: 'Last Updated: January 2026',
      sections: [
        {
          title: '1. Acceptance of Terms',
          content: [
            'By accessing and using GrievanceAI, you accept and agree to be bound by these Terms & Conditions.',
            'If you do not agree with any part of these terms, you must not use our services.',
            'We reserve the right to modify these terms at any time, and your continued use constitutes acceptance of changes.',
          ],
        },
        {
          title: '2. Use of Service',
          content: [
            'You agree to use GrievanceAI only for lawful purposes and in accordance with these Terms.',
            'You must provide accurate, complete, and truthful information when submitting complaints.',
            'You are responsible for maintaining the confidentiality of your complaint ID and tracking information.',
          ],
        },
        {
          title: '3. User Responsibilities',
          content: [
            'You are responsible for all activities that occur under your account or using your complaint ID.',
            'You must not submit false, misleading, or fraudulent complaints.',
            'You agree not to upload malicious content, viruses, or any material that violates applicable laws.',
          ],
        },
        {
          title: '4. Intellectual Property',
          content: [
            'All content, features, and functionality of GrievanceAI are owned by us and protected by copyright laws.',
            'You may not reproduce, distribute, or create derivative works without our written permission.',
            'The GrievanceAI name, logo, and branding are trademarks and may not be used without authorization.',
          ],
        },
        {
          title: '5. Complaint Processing',
          content: [
            'We strive to process complaints efficiently, but resolution times may vary based on complexity and priority.',
            'We reserve the right to reject, suspend, or remove complaints that violate these terms or applicable laws.',
            'Complaint status updates are provided for informational purposes and may be subject to delays.',
          ],
        },
        {
          title: '6. Limitation of Liability',
          content: [
            'GrievanceAI is provided "as is" without warranties of any kind, express or implied.',
            'We are not liable for any indirect, incidental, or consequential damages arising from use of our service.',
            'Our total liability shall not exceed the amount you paid (if any) for using our services.',
          ],
        },
        {
          title: '7. Indemnification',
          content: [
            'You agree to indemnify and hold us harmless from any claims arising from your use of GrievanceAI.',
            'This includes claims related to false information, violation of laws, or infringement of third-party rights.',
          ],
        },
        {
          title: '8. Termination',
          content: [
            'We reserve the right to suspend or terminate your access to GrievanceAI at any time for violation of these terms.',
            'You may discontinue use of our services at any time.',
            'Upon termination, your right to access and use the service will immediately cease.',
          ],
        },
        {
          title: '9. Governing Law',
          content: [
            'These Terms & Conditions are governed by the laws of India.',
            'Any disputes shall be subject to the exclusive jurisdiction of courts in India.',
          ],
        },
        {
          title: '10. Contact Information',
          content: [
            'For questions about these Terms & Conditions, please contact us at support@grievanceiq.gov.in',
            'You can also visit our Contact Support page for assistance with terms-related inquiries.',
          ],
        },
      ],
    },
    hi: {
      title: 'नियम और शर्तें',
      lastUpdated: 'अंतिम अपडेट: जनवरी 2026',
      sections: [
        {
          title: '1. नियमों की स्वीकृति',
          content: [
            'GrievanceAI तक पहुंचने और उपयोग करके, आप इन नियमों और शर्तों से बाध्य होने के लिए स्वीकार करते हैं और सहमत होते हैं।',
            'यदि आप इन नियमों के किसी भी भाग से सहमत नहीं हैं, तो आपको हमारी सेवाओं का उपयोग नहीं करना चाहिए।',
            'हम किसी भी समय इन नियमों को संशोधित करने का अधिकार सुरक्षित रखते हैं, और आपका निरंतर उपयोग परिवर्तनों की स्वीकृति का गठन करता है।',
          ],
        },
        {
          title: '2. सेवा का उपयोग',
          content: [
            'आप GrievanceAI का उपयोग केवल कानूनी उद्देश्यों के लिए और इन नियमों के अनुसार करने के लिए सहमत हैं।',
            'शिकायतें दर्ज करते समय आपको सटीक, पूर्ण और सत्य जानकारी प्रदान करनी होगी।',
            'आप अपनी शिकायत ID और ट्रैकिंग जानकारी की गोपनीयता बनाए रखने के लिए जिम्मेदार हैं।',
          ],
        },
        {
          title: '3. उपयोगकर्ता जिम्मेदारियां',
          content: [
            'आप अपने खाते के तहत या अपनी शिकायत ID का उपयोग करके होने वाली सभी गतिविधियों के लिए जिम्मेदार हैं।',
            'आपको झूठी, भ्रामक, या धोखाधड़ी की शिकायतें दर्ज नहीं करनी चाहिए।',
            'आप दुर्भावनापूर्ण सामग्री, वायरस, या किसी भी सामग्री को अपलोड नहीं करने के लिए सहमत हैं जो लागू कानूनों का उल्लंघन करती है।',
          ],
        },
        {
          title: '4. बौद्धिक संपदा',
          content: [
            'GrievanceAI की सभी सामग्री, सुविधाएं और कार्यक्षमता हमारी स्वामित्व में हैं और कॉपीराइट कानूनों द्वारा संरक्षित हैं।',
            'आप हमारी लिखित अनुमति के बिना प्रजनन, वितरण, या व्युत्पन्न कार्य नहीं बना सकते।',
            'GrievanceAI नाम, लोगो, और ब्रांडिंग ट्रेडमार्क हैं और बिना अधिकार के उपयोग नहीं किए जा सकते।',
          ],
        },
        {
          title: '5. शिकायत प्रसंस्करण',
          content: [
            'हम शिकायतों को कुशलतापूर्वक संसाधित करने का प्रयास करते हैं, लेकिन समाधान समय जटिलता और प्राथमिकता के आधार पर भिन्न हो सकता है।',
            'हम इन नियमों या लागू कानूनों का उल्लंघन करने वाली शिकायतों को अस्वीकार, निलंबित या हटाने का अधिकार सुरक्षित रखते हैं।',
            'शिकायत स्थिति अपडेट सूचनात्मक उद्देश्यों के लिए प्रदान किए जाते हैं और देरी के अधीन हो सकते हैं।',
          ],
        },
        {
          title: '6. दायित्व की सीमा',
          content: [
            'GrievanceAI "जैसा है" के आधार पर किसी भी प्रकार की वारंटी के बिना प्रदान किया जाता है, स्पष्ट या निहित।',
            'हमारी सेवा के उपयोग से उत्पन्न होने वाले किसी भी अप्रत्यक्ष, आकस्मिक, या परिणामी नुकसान के लिए हम जिम्मेदार नहीं हैं।',
            'हमारी कुल दायित्व उस राशि से अधिक नहीं होगी जो आपने हमारी सेवाओं का उपयोग करने के लिए भुगतान की (यदि कोई हो)।',
          ],
        },
        {
          title: '7. क्षतिपूर्ति',
          content: [
            'आप GrievanceAI के अपने उपयोग से उत्पन्न होने वाले किसी भी दावे से हमें हानिरहित रखने और क्षतिपूर्ति करने के लिए सहमत हैं।',
            'इसमें झूठी जानकारी, कानूनों का उल्लंघन, या तीसरे पक्ष के अधिकारों के उल्लंघन से संबंधित दावे शामिल हैं।',
          ],
        },
        {
          title: '8. समाप्ति',
          content: [
            'हम इन नियमों के उल्लंघन के लिए किसी भी समय GrievanceAI तक आपकी पहुंच को निलंबित या समाप्त करने का अधिकार सुरक्षित रखते हैं।',
            'आप किसी भी समय हमारी सेवाओं का उपयोग बंद कर सकते हैं।',
            'समाप्ति पर, सेवा तक पहुंचने और उपयोग करने का आपका अधिकार तुरंत समाप्त हो जाएगा।',
          ],
        },
        {
          title: '9. शासी कानून',
          content: [
            'ये नियम और शर्तें भारत के कानूनों द्वारा शासित हैं।',
            'किसी भी विवाद भारत की अदालतों के विशेष अधिकार क्षेत्र के अधीन होंगे।',
          ],
        },
        {
          title: '10. संपर्क जानकारी',
          content: [
            'इन नियमों और शर्तों के बारे में प्रश्नों के लिए, कृपया हमसे support@grievanceiq.gov.in पर संपर्क करें',
            'आप नियम-संबंधी पूछताछ के लिए सहायता के लिए हमारे संपर्क सहायता पृष्ठ पर भी जा सकते हैं।',
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
              ? 'For questions about these Terms & Conditions, please contact us at '
              : 'इन नियमों और शर्तों के बारे में प्रश्नों के लिए, कृपया हमसे संपर्क करें '}
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

