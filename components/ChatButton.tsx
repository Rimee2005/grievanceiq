'use client';

import { useState, useEffect, useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { containsHindi } from '@/lib/translator';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

// Comprehensive Knowledge Base
const knowledgeBase = {
  faqs: [
    {
      keywords: { en: ['submit', 'file', 'lodge', 'register', 'complaint', 'how to submit', 'how do i submit'], hi: ['दर्ज', 'जमा', 'शिकायत', 'कैसे दर्ज', 'कैसे जमा', 'शिकायत कैसे'] },
      answer: {
        en: "To submit a complaint, click on 'Submit Complaint' in the navigation menu or visit /submit. Fill out the form with your details, describe your complaint clearly, and optionally upload images (JPG, PNG, JPEG up to 5MB) as evidence. Our AI will automatically categorize and prioritize your complaint.",
        hi: 'शिकायत दर्ज करने के लिए, नेविगेशन मेनू में "शिकायत दर्ज करें" पर क्लिक करें या /submit पर जाएं। अपने विवरण के साथ फॉर्म भरें, अपनी शिकायत का स्पष्ट वर्णन करें, और वैकल्पिक रूप से साक्ष्य के रूप में छवियां (JPG, PNG, JPEG 5MB तक) अपलोड करें। हमारी AI स्वचालित रूप से आपकी शिकायत को वर्गीकृत और प्राथमिकता देगी।',
      },
    },
    {
      keywords: { en: ['time', 'long', 'resolve', 'resolution', 'how long', 'duration', 'days', 'hours'], hi: ['समय', 'कितना', 'हल', 'समाधान', 'कितने दिन', 'अवधि', 'घंटे'] },
      answer: {
        en: 'Resolution time depends on priority and complexity. High-priority complaints (safety, urgent issues) are typically addressed within 24-48 hours. Standard complaints usually take 3-5 business days. You can track your complaint status in real-time on the Track Status page.',
        hi: 'समाधान समय प्राथमिकता और जटिलता पर निर्भर करता है। उच्च-प्राथमिकता वाली शिकायतें (सुरक्षा, तत्काल मुद्दे) आमतौर पर 24-48 घंटों के भीतर संबोधित की जाती हैं। मानक शिकायतें आमतौर पर 3-5 व्यावसायिक दिन लेती हैं। आप स्थिति ट्रैक करें पृष्ठ पर अपनी शिकायत की स्थिति को वास्तविक समय में ट्रैक कर सकते हैं।',
      },
    },
    {
      keywords: { en: ['track', 'status', 'check', 'update', 'progress', 'where is', 'how is', 'complaint status', 'complaint id'], hi: ['ट्रैक', 'स्थिति', 'जांच', 'अपडेट', 'प्रगति', 'कहां है', 'कैसी है', 'शिकायत की स्थिति', 'शिकायत आईडी'] },
      answer: {
        en: "To track your complaint, go to 'Track Status' in the navigation menu or visit /track. Enter your complaint ID (received after submission) or your email address to see the current status, updates, and resolution progress in real-time.",
        hi: 'अपनी शिकायत को ट्रैक करने के लिए, नेविगेशन मेनू में "स्थिति ट्रैक करें" पर जाएं या /track पर जाएं। वर्तमान स्थिति, अपडेट और समाधान प्रगति देखने के लिए अपना शिकायत ID (सबमिशन के बाद प्राप्त) या अपना ईमेल पता दर्ज करें।',
      },
    },
    {
      keywords: { en: ['type', 'types', 'kind', 'kinds', 'what complaints', 'which complaints', 'categories'], hi: ['प्रकार', 'किस प्रकार', 'कैसी', 'कौन सी', 'क्या शिकायतें', 'श्रेणियां'] },
      answer: {
        en: 'You can submit complaints related to: public services, infrastructure issues (roads, water, electricity), administrative problems, governance concerns, civic amenities, and other government-related issues. Our AI automatically categorizes your complaint into the appropriate department.',
        hi: 'आप निम्नलिखित से संबंधित शिकायतें दर्ज कर सकते हैं: सार्वजनिक सेवाएं, बुनियादी ढांचे की समस्याएं (सड़कें, पानी, बिजली), प्रशासनिक समस्याएं, शासन संबंधी चिंताएं, नागरिक सुविधाएं, और अन्य सरकार-संबंधी मुद्दे। हमारी AI स्वचालित रूप से आपकी शिकायत को उपयुक्त विभाग में वर्गीकृत करती है।',
      },
    },
    {
      keywords: { en: ['priority', 'prioritize', 'urgent', 'important', 'high priority', 'how priority'], hi: ['प्राथमिकता', 'कैसे प्राथमिकता', 'जरूरी', 'महत्वपूर्ण', 'उच्च प्राथमिकता'] },
      answer: {
        en: 'Our AI analyzes urgency, sentiment, and content to assign priority. Factors include: safety concerns, time-sensitive issues, emotional tone, and complaint severity. High-priority complaints (safety, emergencies) are addressed within 24-48 hours.',
        hi: 'हमारी AI तात्कालिकता, भावना और सामग्री का विश्लेषण करके प्राथमिकता निर्धारित करती है। कारकों में शामिल हैं: सुरक्षा चिंताएं, समय-संवेदनशील मुद्दे, भावनात्मक स्वर, और शिकायत की गंभीरता। उच्च-प्राथमिकता वाली शिकायतें (सुरक्षा, आपातकाल) 24-48 घंटों के भीतर संबोधित की जाती हैं।',
      },
    },
    {
      keywords: { en: ['image', 'images', 'photo', 'photos', 'upload', 'picture', 'evidence', 'file'], hi: ['छवि', 'छवियां', 'फोटो', 'अपलोड', 'तस्वीर', 'साक्ष्य', 'फाइल'] },
      answer: {
        en: 'Yes! You can upload images (JPG, PNG, JPEG) up to 5MB as evidence. Images help provide visual context, support your complaint, and can significantly speed up the resolution process. Multiple images can be uploaded with a single complaint.',
        hi: 'हां! आप साक्ष्य के रूप में 5MB तक की छवियां (JPG, PNG, JPEG) अपलोड कर सकते हैं। छवियां दृश्य संदर्भ प्रदान करने, आपकी शिकायत का समर्थन करने में मदद करती हैं और समाधान प्रक्रिया को काफी तेज कर सकती हैं। एक शिकायत के साथ कई छवियां अपलोड की जा सकती हैं।',
      },
    },
  ],
  policies: [
    {
      keywords: { en: ['privacy', 'data', 'information', 'personal', 'security', 'confidential'], hi: ['गोपनीयता', 'डेटा', 'जानकारी', 'व्यक्तिगत', 'सुरक्षा', 'गोपनीय'] },
      answer: {
        en: 'We collect your name, email, contact details, and complaint information. Your data is encrypted, stored securely, and only shared with relevant departments for resolution. We never sell your information. You can access, update, or request deletion of your data. For details, visit /privacy.',
        hi: 'हम आपका नाम, ईमेल, संपर्क विवरण और शिकायत जानकारी एकत्र करते हैं। आपका डेटा एन्क्रिप्टेड है, सुरक्षित रूप से संग्रहीत है, और केवल समाधान के लिए प्रासंगिक विभागों के साथ साझा किया जाता है। हम कभी भी आपकी जानकारी नहीं बेचते। आप अपने डेटा तक पहुंच, अपडेट या हटाने का अनुरोध कर सकते हैं। विवरण के लिए, /privacy पर जाएं।',
      },
    },
    {
      keywords: { en: ['terms', 'conditions', 'rules', 'guidelines', 'agreement', 'policy'], hi: ['नियम', 'शर्तें', 'दिशानिर्देश', 'समझौता', 'नीति'] },
      answer: {
        en: 'You must provide accurate, truthful information when submitting complaints. False or fraudulent complaints are not allowed. You are responsible for maintaining confidentiality of your complaint ID. We may reject complaints violating terms. For full terms, visit /terms.',
        hi: 'शिकायत दर्ज करते समय आपको सटीक, सत्य जानकारी प्रदान करनी चाहिए। झूठी या धोखाधड़ी वाली शिकायतें अनुमत नहीं हैं। आप अपने शिकायत ID की गोपनीयता बनाए रखने के लिए जिम्मेदार हैं। हम शर्तों का उल्लंघन करने वाली शिकायतों को अस्वीकार कर सकते हैं। पूर्ण शर्तों के लिए, /terms पर जाएं।',
      },
    },
  ],
  guidance: [
    {
      keywords: { en: ['help', 'support', 'assistance', 'guide', 'stuck', 'problem'], hi: ['सहायता', 'मदद', 'गाइड', 'अटका', 'समस्या'] },
      answer: {
        en: "I'm here to help! You can: 1) Submit complaints at /submit, 2) Track status at /track, 3) Get detailed help at /help, 4) Contact us at /contact. What specific issue are you facing?",
        hi: 'मैं यहां मदद के लिए हूं! आप कर सकते हैं: 1) /submit पर शिकायतें दर्ज करें, 2) /track पर स्थिति ट्रैक करें, 3) /help पर विस्तृत सहायता प्राप्त करें, 4) /contact पर हमसे संपर्क करें। आपको कौन सी विशिष्ट समस्या आ रही है?',
      },
    },
    {
      keywords: { en: ['contact', 'reach', 'email', 'phone', 'call', 'speak', 'talk', 'get in touch'], hi: ['संपर्क', 'ईमेल', 'फोन', 'कॉल', 'बात', 'बोल', 'संपर्क करें'] },
      answer: {
        en: 'You can contact us through the Contact page at /contact. Fill out the contact form with your query, and our support team will respond as soon as possible. You can also track your complaint status or visit the Help & Support page for common issues.',
        hi: 'आप /contact पर संपर्क पृष्ठ के माध्यम से हमसे संपर्क कर सकते हैं। अपने प्रश्न के साथ संपर्क फॉर्म भरें, और हमारी सहायता टीम जल्द से जल्द जवाब देगी। आप अपनी शिकायत की स्थिति भी ट्रैक कर सकते हैं या सामान्य मुद्दों के लिए सहायता और समर्थन पृष्ठ पर जा सकते हैं।',
      },
    },
    {
      keywords: { en: ['update', 'modify', 'change', 'edit', 'complaint update'], hi: ['अपडेट', 'संशोधन', 'बदलें', 'संपादित', 'शिकायत अपडेट'] },
      answer: {
        en: 'To update your complaint, visit the Track Status page at /track. Enter your complaint ID to view current status and any updates. If you need to add information, contact us through /contact with your complaint ID.',
        hi: 'अपनी शिकायत को अपडेट करने के लिए, /track पर स्थिति ट्रैक करें पृष्ठ पर जाएं। वर्तमान स्थिति और किसी भी अपडेट को देखने के लिए अपना शिकायत ID दर्ज करें। यदि आपको जानकारी जोड़नी है, तो अपने शिकायत ID के साथ /contact के माध्यम से हमसे संपर्क करें।',
      },
    },
  ],
  platform: [
    {
      keywords: { en: ['about', 'what is', 'platform', 'system', 'grievanceai', 'ai', 'how does it work', 'what does'], hi: ['के बारे में', 'क्या है', 'प्लेटफॉर्म', 'सिस्टम', 'कैसे काम करता है', 'क्या करता है'] },
      answer: {
        en: 'GrievanceAI is an AI-powered grievance redressal platform that automatically classifies, prioritizes, and routes complaints to appropriate departments. It uses AI to analyze urgency, sentiment, and content for faster, more efficient resolution. You can submit complaints, track status in real-time, and get automated updates.',
        hi: 'GrievanceAI एक AI-संचालित शिकायत निवारण प्लेटफॉर्म है जो स्वचालित रूप से शिकायतों को वर्गीकृत, प्राथमिकता देता है और उपयुक्त विभागों में रूट करता है। यह तेज, अधिक कुशल समाधान के लिए तात्कालिकता, भावना और सामग्री का विश्लेषण करने के लिए AI का उपयोग करता है। आप शिकायतें दर्ज कर सकते हैं, वास्तविक समय में स्थिति ट्रैक कर सकते हैं, और स्वचालित अपडेट प्राप्त कर सकते हैं।',
      },
    },
  ],
};

export default function ChatButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const { t, language } = useLanguage();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Send welcome message when chat opens for the first time
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessages = [
        { en: "Hi! 👋 I'm your AI assistant for GrievanceAI. I can help you with complaints, tracking, policies, FAQs, and any questions about our platform. How can I assist you today?", hi: 'नमस्ते! 👋 मैं GrievanceAI के लिए आपकी AI सहायक हूं। मैं शिकायतों, ट्रैकिंग, नीतियों, FAQs, और हमारे प्लेटफॉर्म के बारे में किसी भी प्रश्न में आपकी मदद कर सकती हूं। आज मैं आपकी कैसे सहायता कर सकती हूं?' },
        { en: "Hello! Welcome to GrievanceAI. I'm here to answer your questions about submitting complaints, tracking status, our policies, rules, and how our platform works. What would you like to know?", hi: 'नमस्ते! GrievanceAI में आपका स्वागत है। मैं शिकायतें दर्ज करने, स्थिति ट्रैक करने, हमारी नीतियों, नियमों, और हमारे प्लेटफॉर्म के काम करने के तरीके के बारे में आपके प्रश्नों का उत्तर देने के लिए यहां हूं। आप क्या जानना चाहेंगे?' },
        { en: "Welcome! I'm your AI assistant. I can help you understand how to submit complaints, track their status, learn about our privacy policy and terms, get answers to FAQs, and guide you through our platform. How can I help?", hi: 'स्वागत है! मैं आपकी AI सहायक हूं। मैं आपको समझने में मदद कर सकती हूं कि शिकायतें कैसे दर्ज करें, उनकी स्थिति कैसे ट्रैक करें, हमारी गोपनीयता नीति और शर्तों के बारे में जानें, FAQs के उत्तर प्राप्त करें, और हमारे प्लेटफॉर्म के माध्यम से आपका मार्गदर्शन करें। मैं कैसे मदद कर सकती हूं?' },
      ];
      const randomWelcome = welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)];
      const welcomeText = language === 'hi' ? randomWelcome.hi : randomWelcome.en;
      
      setTimeout(() => {
        addMessage(welcomeText, 'assistant');
      }, 300);
    }
  }, [isOpen, messages.length, language]);

  const addMessage = (text: string, sender: 'user' | 'assistant') => {
    const newMessage: Message = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      text,
      sender,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  const detectLanguage = (text: string): 'en' | 'hi' => {
    return containsHindi(text) ? 'hi' : 'en';
  };

  const normalizeText = (text: string): string => {
    return text.toLowerCase().trim().replace(/[^\w\s\u0900-\u097F]/g, '');
  };

  const findBestMatch = (userInput: string, detectedLang: 'en' | 'hi'): string | null => {
    const normalizedInput = normalizeText(userInput);

    // Search through all knowledge base categories
    const allCategories = [
      ...knowledgeBase.faqs,
      ...knowledgeBase.policies,
      ...knowledgeBase.guidance,
      ...knowledgeBase.platform,
    ];

    // Score matches based on keyword presence
    let bestMatch: { answer: { en: string; hi: string }; score: number } | null = null;
    let highestScore = 0;

    for (const item of allCategories) {
      const keywords = item.keywords[detectedLang] || [];
      let score = 0;

      for (const keyword of keywords) {
        if (normalizedInput.includes(keyword.toLowerCase())) {
          score += keyword.length; // Longer keywords get more weight
        }
      }

      if (score > highestScore) {
        highestScore = score;
        bestMatch = { answer: item.answer, score };
      }
    }

    // Return answer if score is significant (at least 3 points)
    if (bestMatch && highestScore >= 3) {
      return detectedLang === 'hi' ? bestMatch.answer.hi : bestMatch.answer.en;
    }

    return null;
  };

  const generateResponse = async (userInput: string): Promise<string> => {
    const detectedLang = detectLanguage(userInput);
    const normalizedInput = normalizeText(userInput);

    // Try to find a match in knowledge base first
    const knowledgeMatch = findBestMatch(userInput, detectedLang);
    if (knowledgeMatch) {
      return knowledgeMatch;
    }

    // Greetings
    const greetingPatterns = {
      en: ['hi', 'hello', 'hey', 'good morning', 'good afternoon', 'good evening', 'greetings', 'namaste'],
      hi: ['नमस्ते', 'नमस्कार', 'हैलो', 'हाय', 'सुप्रभात', 'शुभ संध्या', 'अभिवादन'],
    };

    const greetings = greetingPatterns[detectedLang];
    if (greetings.some((g) => normalizedInput.includes(g))) {
      const responses = {
        en: [
          "Hello! How can I assist you today? I can help with complaints, tracking, policies, FAQs, or any questions about GrievanceAI.",
          "Hi there! What can I help you with? Feel free to ask about submitting complaints, tracking status, our policies, or how our platform works.",
          "Greetings! I'm here to help. You can ask me about complaints, tracking, privacy policy, terms & conditions, FAQs, or general platform questions.",
        ],
        hi: [
          'नमस्ते! आज मैं आपकी कैसे सहायता कर सकती हूं? मैं शिकायतों, ट्रैकिंग, नीतियों, FAQs, या GrievanceAI के बारे में किसी भी प्रश्न में मदद कर सकती हूं।',
          'हैलो! मैं आपकी किस तरह से मदद कर सकती हूं? शिकायतें दर्ज करने, स्थिति ट्रैक करने, हमारी नीतियों, या हमारे प्लेटफॉर्म के काम करने के तरीके के बारे में पूछने में संकोच न करें।',
          'अभिवादन! मैं यहां मदद के लिए हूं। आप मुझसे शिकायतों, ट्रैकिंग, गोपनीयता नीति, नियम और शर्तें, FAQs, या सामान्य प्लेटफॉर्म प्रश्नों के बारे में पूछ सकते हैं।',
        ],
      };
      return responses[detectedLang][Math.floor(Math.random() * responses[detectedLang].length)];
    }

    // Thank you / Appreciation
    const thanksPatterns = {
      en: ['thank', 'thanks', 'appreciate', 'grateful', 'helpful'],
      hi: ['धन्यवाद', 'शुक्रिया', 'आभार', 'मददगार'],
    };

    const thanksKeywords = thanksPatterns[detectedLang];
    if (thanksKeywords.some((keyword) => normalizedInput.includes(keyword))) {
      const responses = {
        en: [
          "You're welcome! Is there anything else I can help you with? Feel free to ask about complaints, tracking, policies, or FAQs.",
          "Happy to help! If you have more questions about submitting complaints, tracking status, our policies, or how the platform works, just ask!",
          "My pleasure! Let me know if you need help with anything else related to GrievanceAI.",
        ],
        hi: [
          'आपका स्वागत है! क्या मैं आपकी और किसी चीज में मदद कर सकती हूं? शिकायतों, ट्रैकिंग, नीतियों, या FAQs के बारे में पूछने में संकोच न करें।',
          'मदद करके खुशी हुई! यदि आपके पास शिकायतें दर्ज करने, स्थिति ट्रैक करने, हमारी नीतियों, या प्लेटफॉर्म के काम करने के तरीके के बारे में और प्रश्न हैं, तो बस पूछें!',
          'खुशी की बात है! यदि आपको GrievanceAI से संबंधित किसी और चीज में मदद की आवश्यकता है तो मुझे बताएं।',
        ],
      };
      return responses[detectedLang][Math.floor(Math.random() * responses[detectedLang].length)];
    }

    // Goodbye
    const goodbyePatterns = {
      en: ['bye', 'goodbye', 'see you', 'later', 'farewell', 'exit'],
      hi: ['अलविदा', 'बाय', 'फिर मिलेंगे', 'बाद में', 'विदाई'],
    };

    const goodbyeKeywords = goodbyePatterns[detectedLang];
    if (goodbyeKeywords.some((keyword) => normalizedInput.includes(keyword))) {
      const responses = {
        en: "Goodbye! Have a great day. Feel free to come back if you need help with complaints, tracking, policies, or any questions about GrievanceAI!",
        hi: 'अलविदा! आपका दिन शुभ हो। यदि आपको शिकायतों, ट्रैकिंग, नीतियों, या GrievanceAI के बारे में किसी भी प्रश्न में मदद की आवश्यकता है तो वापस आने में संकोच न करें!',
      };
      return responses[detectedLang];
    }

    // Default response with helpful suggestions
    const defaultResponses = {
      en: [
        "I understand you're asking something. To help you better, I can assist with:\n\n• Submitting complaints\n• Tracking complaint status\n• Privacy policy and data security\n• Terms & conditions and rules\n• FAQs about our platform\n• General guidance\n\nCould you be more specific about what you need?",
        "I'm not entirely sure what you're asking. I can help you with:\n\n• How to submit complaints\n• How to track your complaint status\n• Information about our policies (Privacy, Terms)\n• Frequently asked questions\n• Platform features and how it works\n• Getting help and support\n\nWhat would you like to know?",
        "Let me help you better! I can answer questions about:\n\n• Complaint submission process\n• Tracking and status updates\n• Privacy and data protection\n• Terms, conditions, and guidelines\n• Platform features and AI system\n• Help and support options\n\nWhat specific information do you need?",
      ],
      hi: [
        'मैं समझ गई हूं कि आप कुछ पूछ रहे हैं। आपकी बेहतर मदद करने के लिए, मैं सहायता कर सकती हूं:\n\n• शिकायतें दर्ज करना\n• शिकायत की स्थिति ट्रैक करना\n• गोपनीयता नीति और डेटा सुरक्षा\n• नियम और शर्तें\n• हमारे प्लेटफॉर्म के बारे में FAQs\n• सामान्य मार्गदर्शन\n\nक्या आप अधिक विशिष्ट हो सकते हैं कि आपको क्या चाहिए?',
        'मुझे पूरी तरह से यकीन नहीं है कि आप क्या पूछ रहे हैं। मैं आपकी मदद कर सकती हूं:\n\n• शिकायतें कैसे दर्ज करें\n• अपनी शिकायत की स्थिति कैसे ट्रैक करें\n• हमारी नीतियों के बारे में जानकारी (गोपनीयता, नियम)\n• अक्सर पूछे जाने वाले प्रश्न\n• प्लेटफॉर्म सुविधाएं और यह कैसे काम करता है\n• सहायता और समर्थन प्राप्त करना\n\nआप क्या जानना चाहेंगे?',
        'मुझे आपकी बेहतर मदद करने दें! मैं निम्नलिखित के बारे में प्रश्नों का उत्तर दे सकती हूं:\n\n• शिकायत सबमिशन प्रक्रिया\n• ट्रैकिंग और स्थिति अपडेट\n• गोपनीयता और डेटा सुरक्षा\n• नियम, शर्तें और दिशानिर्देश\n• प्लेटफॉर्म सुविधाएं और AI सिस्टम\n• सहायता और समर्थन विकल्प\n\nआपको कौन सी विशिष्ट जानकारी चाहिए?',
      ],
    };

    return defaultResponses[detectedLang][Math.floor(Math.random() * defaultResponses[detectedLang].length)];
  };

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMessage = inputValue.trim();
    setInputValue('');
    addMessage(userMessage, 'user');

    setIsTyping(true);
    
    // Simulate thinking time for more natural conversation
    await new Promise((resolve) => setTimeout(resolve, 500 + Math.random() * 500));

    const response = await generateResponse(userMessage);
    setIsTyping(false);
    addMessage(response, 'assistant');
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gov-blue dark:bg-blue-600 text-white rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all flex items-center justify-center group"
        aria-label="Chat Assistant"
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
        <div className="fixed bottom-24 right-6 z-50 w-80 md:w-96 bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col max-h-[600px]">
          {/* Header */}
          <div className="bg-gov-blue dark:bg-blue-600 text-white p-4 rounded-t-lg flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <h3 className="font-semibold">
                {language === 'hi' ? 'AI सहायक' : 'AI Assistant'}
              </h3>
            </div>
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

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900/50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    message.sender === 'user'
                      ? 'bg-gov-blue dark:bg-blue-600 text-white'
                      : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-600'
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-600 rounded-lg px-4 py-2">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={language === 'hi' ? 'अपना संदेश टाइप करें...' : 'Type your message...'}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gov-blue dark:focus:ring-blue-500 focus:border-transparent text-sm"
                disabled={isTyping}
              />
              <button
                onClick={handleSend}
                disabled={!inputValue.trim() || isTyping}
                className="px-4 py-2 bg-gov-blue dark:bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                aria-label="Send message"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
              </button>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
              {language === 'hi' 
                ? '💡 आप हिंदी या अंग्रेजी में बात कर सकते हैं' 
                : '💡 You can chat in Hindi or English'}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
