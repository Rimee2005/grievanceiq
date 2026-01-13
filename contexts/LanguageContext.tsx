'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'hi';

interface Translations {
  [key: string]: {
    en: string;
    hi: string;
  };
}

const translations: Translations = {
  // Navigation
  'nav.home': { en: 'Home', hi: 'होम' },
  'nav.submit': { en: 'Submit Complaint', hi: 'शिकायत दर्ज करें' },
  'nav.track': { en: 'Track Status', hi: 'स्थिति ट्रैक करें' },
  'nav.admin': { en: 'Admin', hi: 'एडमिन' },
  'nav.help': { en: 'Help & Support', hi: 'सहायता और समर्थन' },
  'nav.contact': { en: 'Contact', hi: 'संपर्क करें' },
  
  // Common
  'common.submit': { en: 'Submit', hi: 'जमा करें' },
  'common.cancel': { en: 'Cancel', hi: 'रद्द करें' },
  'common.loading': { en: 'Loading...', hi: 'लोड हो रहा है...' },
  'common.search': { en: 'Search', hi: 'खोजें' },
  'common.close': { en: 'Close', hi: 'बंद करें' },
  
  // Home Page
  'home.title': { en: 'AI-Powered Grievance Redressal System', hi: 'AI-संचालित शिकायत निवारण प्रणाली' },
  'home.subtitle': { en: 'Submit your complaints and track their resolution status. Our AI system automatically classifies, prioritizes, and routes your grievances to the appropriate department for faster resolution.', hi: 'अपनी शिकायतें दर्ज करें और उनकी समाधान स्थिति को ट्रैक करें। हमारी AI प्रणाली स्वचालित रूप से आपकी शिकायतों को वर्गीकृत, प्राथमिकता देती है और तेजी से समाधान के लिए उपयुक्त विभाग में रूट करती है।' },
  'home.step1.title': { en: '1. Submit Complaint', hi: '1. शिकायत दर्ज करें' },
  'home.step1.desc': { en: 'Fill out a simple form with your complaint details. You can also upload images as evidence.', hi: 'अपनी शिकायत विवरण के साथ एक सरल फॉर्म भरें। आप साक्ष्य के रूप में छवियां भी अपलोड कर सकते हैं।' },
  'home.step2.title': { en: 'AI Analysis & Prioritization', hi: 'AI विश्लेषण और प्राथमिकता' },
  'home.step2.desc': { en: 'Our AI system automatically analyzes your complaint, classifies it into categories, and assigns priority based on urgency and sentiment.', hi: 'हमारी AI प्रणाली स्वचालित रूप से आपकी शिकायत का विश्लेषण करती है, इसे श्रेणियों में वर्गीकृत करती है, और तात्कालिकता और भावना के आधार पर प्राथमिकता निर्धारित करती है।' },
  'home.step3.title': { en: 'Fast Resolution', hi: 'तेज समाधान' },
  'home.step3.desc': { en: 'Your complaint is routed to the appropriate department and tracked until resolution.', hi: 'आपकी शिकायत को उपयुक्त विभाग में रूट किया जाता है और समाधान तक ट्रैक किया जाता है।' },
  'home.cta.submit': { en: 'Submit a Complaint', hi: 'शिकायत दर्ज करें' },
  'home.cta.track': { en: 'Track Complaint Status', hi: 'शिकायत स्थिति ट्रैक करें' },
  'home.features.title': { en: 'Key Features', hi: 'मुख्य विशेषताएं' },
  'home.howitworks.title': { en: 'How It Works', hi: 'यह कैसे काम करता है' },
  
  // Help & Support
  'help.title': { en: 'Help & Support', hi: 'सहायता और समर्थन' },
  'help.subtitle': { en: 'Get guided help to resolve your issues quickly', hi: 'अपनी समस्याओं को जल्दी हल करने के लिए मार्गदर्शित सहायता प्राप्त करें' },
  'help.guided.title': { en: 'What do you need help with?', hi: 'आपको किस बात में सहायता चाहिए?' },
  'help.issue.submit': { en: "Can't submit complaint", hi: 'शिकायत दर्ज नहीं कर सकते' },
  'help.issue.submit.desc': { en: 'Having trouble submitting your complaint? Get step-by-step guidance.', hi: 'शिकायत दर्ज करने में परेशानी हो रही है? चरण-दर-चरण मार्गदर्शन प्राप्त करें।' },
  'help.issue.delayed': { en: 'Complaint delayed', hi: 'शिकायत में देरी' },
  'help.issue.delayed.desc': { en: 'Check the status of your complaint and understand why it might be delayed.', hi: 'अपनी शिकायत की स्थिति जांचें और समझें कि इसमें देरी क्यों हो सकती है।' },
  'help.issue.login': { en: 'Login problem', hi: 'लॉगिन समस्या' },
  'help.issue.login.desc': { en: 'Having trouble accessing the admin panel? Get help with login issues.', hi: 'एडमिन पैनल तक पहुंचने में परेशानी हो रही है? लॉगिन समस्याओं के लिए सहायता प्राप्त करें।' },
  'help.issue.update': { en: 'Update my complaint', hi: 'अपनी शिकायत अपडेट करें' },
  'help.issue.update.desc': { en: 'Track and update the status of your existing complaint.', hi: 'अपनी मौजूदा शिकायत की स्थिति को ट्रैक और अपडेट करें।' },
  'help.action.submit': { en: 'Go to Submit', hi: 'दर्ज करने पर जाएं' },
  'help.action.track': { en: 'Track Status', hi: 'स्थिति ट्रैक करें' },
  'help.action.login': { en: 'Admin Login', hi: 'एडमिन लॉगिन' },
  'help.faq.title': { en: 'Frequently Asked Questions', hi: 'अक्सर पूछे जाने वाले प्रश्न' },
  
  // Contact Page
  'contact.title': { en: 'Contact Us', hi: 'हमसे संपर्क करें' },
  'contact.subtitle': { en: 'Get in touch with us', hi: 'हमसे संपर्क करें' },
  'contact.address.title': { en: 'Address', hi: 'पता' },
  'contact.phone.title': { en: 'Phone', hi: 'फोन' },
  'contact.email.title': { en: 'Email', hi: 'ईमेल' },
  'contact.hours.title': { en: 'Working Hours', hi: 'कार्य समय' },
  'contact.form.title': { en: 'Send us a Message', hi: 'हमें एक संदेश भेजें' },
  'contact.form.name': { en: 'Your Name', hi: 'आपका नाम' },
  'contact.form.email': { en: 'Your Email', hi: 'आपका ईमेल' },
  'contact.form.message': { en: 'Your Message', hi: 'आपका संदेश' },
  'contact.form.message.placeholder': { en: 'Type your message here...', hi: 'अपना संदेश यहाँ लिखें...' },
  'contact.form.send': { en: 'Send Message', hi: 'संदेश भेजें' },
  
  // Footer
  'footer.about': { en: 'About', hi: 'के बारे में' },
  'footer.quicklinks': { en: 'Quick Links', hi: 'त्वरित लिंक' },
  'footer.support': { en: 'Support', hi: 'सहायता' },
  'footer.follow': { en: 'Follow Us', hi: 'हमें फॉलो करें' },
  'footer.rights': { en: 'All rights reserved.', hi: 'सभी अधिकार सुरक्षित।' },
  'footer.description': { en: 'AI-powered grievance redressal system for efficient public governance.', hi: 'कुशल सार्वजनिक शासन के लिए AI-संचालित शिकायत निवारण प्रणाली।' },
  
  // Submit Page
  'submit.title': { en: 'Submit a Complaint', hi: 'शिकायत दर्ज करें' },
  'submit.name': { en: 'Full Name', hi: 'पूरा नाम' },
  'submit.email': { en: 'Email', hi: 'ईमेल' },
  'submit.complaint': { en: 'Complaint Details', hi: 'शिकायत विवरण' },
  'submit.location': { en: 'Location (Optional)', hi: 'स्थान (वैकल्पिक)' },
  'submit.image': { en: 'Upload Image (Optional)', hi: 'छवि अपलोड करें (वैकल्पिक)' },
  'submit.image.accepted': { en: 'Accepted formats: JPG, PNG, JPEG (Max 5MB)', hi: 'स्वीकृत प्रारूप: JPG, PNG, JPEG (अधिकतम 5MB)' },
  'submit.image.remove': { en: 'Remove', hi: 'हटाएं' },
  'submit.submit': { en: 'Submit Complaint', hi: 'शिकायत दर्ज करें' },
  'submit.submitting': { en: 'Submitting...', hi: 'जमा हो रहा है...' },
  'submit.voice.speak': { en: 'Speak', hi: 'बोलें' },
  'submit.voice.stop': { en: 'Stop', hi: 'रोकें' },
  'submit.voice.listening': { en: 'Listening...', hi: 'सुन रहे हैं...' },
  'submit.voice.notSupported': { en: 'Speech recognition not supported in your browser', hi: 'आपके ब्राउज़र में आवाज़ पहचान समर्थित नहीं है' },
  'submit.voice.noSpeech': { en: 'No speech detected', hi: 'कोई आवाज़ नहीं सुनाई दी' },
  'submit.voice.permissionRequired': { en: 'Microphone permission required', hi: 'माइक्रोफोन की अनुमति आवश्यक है' },
  'submit.voice.error': { en: 'Speech recognition error', hi: 'आवाज़ पहचान में त्रुटि' },
  'submit.voice.stopped': { en: 'Recording stopped', hi: 'रिकॉर्डिंग रोक दी गई' },
  'submit.voice.startError': { en: 'Error starting recording', hi: 'रिकॉर्डिंग शुरू करने में त्रुटि' },
  'submit.suggestions.title': { en: '💡 Suggestions:', hi: '💡 सुझाव:' },
  'submit.suggestions.category': { en: 'Category:', hi: 'श्रेणी:' },
  'submit.suggestions.priority': { en: 'Priority:', hi: 'प्राथमिकता:' },
  'submit.suggestions.description': { en: 'These suggestions are automatically generated based on your complaint.', hi: 'ये सुझाव आपकी शिकायत के आधार पर स्वचालित रूप से उत्पन्न किए गए हैं।' },
  'submit.translating': { en: 'Translating...', hi: 'अनुवाद हो रहा है...' },
  'submit.required': { en: 'Please fill in all required fields', hi: 'कृपया सभी आवश्यक फ़ील्ड भरें' },
  'submit.email.invalid': { en: 'Please enter a valid email address', hi: 'कृपया एक वैध ईमेल पता दर्ज करें' },
  'submit.image.invalid': { en: 'Please upload a JPG, PNG, or JPEG image', hi: 'कृपया JPG, PNG, या JPEG छवि अपलोड करें' },
  'submit.image.size': { en: 'Image size should be less than 5MB', hi: 'छवि का आकार 5MB से कम होना चाहिए' },
  'submit.success': { en: 'Complaint submitted successfully!', hi: 'शिकायत सफलतापूर्वक दर्ज की गई!' },
  'submit.duplicate': { en: 'This complaint appears to be a duplicate', hi: 'यह शिकायत डुप्लिकेट प्रतीत होती है' },
  'submit.error': { en: 'Failed to submit complaint', hi: 'शिकायत दर्ज करने में विफल' },
  'submit.error.generic': { en: 'An error occurred. Please try again.', hi: 'एक त्रुटि हुई। कृपया पुनः प्रयास करें।' },
  'submit.placeholder.name': { en: 'Enter your full name', hi: 'अपना पूरा नाम दर्ज करें' },
  'submit.placeholder.email': { en: 'your.email@example.com', hi: 'आपका.ईमेल@उदाहरण.com' },
  'submit.placeholder.complaint': { en: 'Describe your complaint in detail. You can write in English or Hindi...', hi: 'अपनी शिकायत का विस्तार से वर्णन करें। आप अंग्रेजी या हिंदी में लिख सकते हैं...' },
  'submit.placeholder.location': { en: 'e.g., Street name, Area, City', hi: 'उदाहरण: सड़क का नाम, क्षेत्र, शहर' },
  
  // Track Page
  'track.title': { en: 'Track Complaint Status', hi: 'शिकायत स्थिति ट्रैक करें' },
  'track.search.id': { en: 'By Complaint ID', hi: 'शिकायत ID से' },
  'track.search.email': { en: 'By Email', hi: 'ईमेल से' },
  'track.placeholder.id': { en: 'Enter Complaint ID', hi: 'शिकायत ID दर्ज करें' },
  'track.placeholder.email': { en: 'Enter your email address', hi: 'अपना ईमेल पता दर्ज करें' },
  'track.search': { en: 'Search', hi: 'खोजें' },
  'track.searching': { en: 'Searching...', hi: 'खोज रहे हैं...' },
  'track.details': { en: 'Complaint Details', hi: 'शिकायत विवरण' },
  'track.id': { en: 'ID', hi: 'आईडी' },
  'track.name': { en: 'Name', hi: 'नाम' },
  'track.email': { en: 'Email', hi: 'ईमेल' },
  'track.complaint': { en: 'Complaint', hi: 'शिकायत' },
  'track.location': { en: 'Location', hi: 'स्थान' },
  'track.category': { en: 'Category', hi: 'श्रेणी' },
  'track.department': { en: 'Department', hi: 'विभाग' },
  'track.image': { en: 'Image Evidence', hi: 'छवि साक्ष्य' },
  'track.image.click': { en: 'Click image to view full size', hi: 'पूर्ण आकार देखने के लिए छवि पर क्लिक करें' },
  'track.duplicate': { en: '⚠️ This complaint has been marked as a duplicate', hi: '⚠️ इस शिकायत को डुप्लिकेट के रूप में चिह्नित किया गया है' },
  'track.submitted': { en: 'Submitted Date', hi: 'दर्ज करने की तारीख' },
  'track.notfound': { en: 'No complaints found for this email', hi: 'इस ईमेल के लिए कोई शिकायत नहीं मिली' },
  'track.error': { en: 'Failed to fetch complaint', hi: 'शिकायत प्राप्त करने में विफल' },
  'track.error.generic': { en: 'An error occurred. Please try again.', hi: 'एक त्रुटि हुई। कृपया पुनः प्रयास करें।' },
  'track.found.multiple': { en: 'Found {count} complaints. Showing the most recent.', hi: '{count} शिकायतें मिलीं। सबसे हाल की दिखाई जा रही है।' },
  
  // Admin
  'admin.panel': { en: 'Admin Panel', hi: 'एडमिन पैनल' },
  'admin.role': { en: 'Admin', hi: 'एडमिन' },
  'admin.logout': { en: 'Logout', hi: 'लॉगआउट' },
  'admin.dashboard': { en: 'Dashboard', hi: 'डैशबोर्ड' },
  'admin.complaints': { en: 'All Complaints', hi: 'सभी शिकायतें' },
  'admin.priority': { en: 'High Priority', hi: 'उच्च प्राथमिकता' },
  'admin.duplicates': { en: 'Duplicate Complaints', hi: 'डुप्लिकेट शिकायतें' },
  'admin.analytics': { en: 'Analytics', hi: 'विश्लेषण' },
  
  // Trust Section
  'trust.title': { en: 'Why Trust GrievanceIQ?', hi: 'GrievanceIQ पर क्यों भरोसा करें?' },
  'trust.secure': { en: 'Secure', hi: 'सुरक्षित' },
  'trust.secure.desc': { en: 'Your data is protected with enterprise-grade security', hi: 'आपका डेटा उद्यम-ग्रेड सुरक्षा के साथ संरक्षित है' },
  'trust.ai': { en: 'AI-driven', hi: 'AI-संचालित' },
  'trust.ai.desc': { en: 'Intelligent automation for faster resolution', hi: 'तेजी से समाधान के लिए बुद्धिमान स्वचालन' },
  'trust.transparent': { en: 'Transparent Tracking', hi: 'पारदर्शी ट्रैकिंग' },
  'trust.transparent.desc': { en: 'Real-time updates on your complaint status', hi: 'आपकी शिकायत की स्थिति पर वास्तविक समय अपडेट' },
  'trust.resolved': { en: 'Complaints Resolved', hi: 'शिकायतें हल' },
  'trust.avgTime': { en: 'Avg Resolution Time', hi: 'औसत समाधान समय' },
  'trust.departments': { en: 'Departments Connected', hi: 'जुड़े विभाग' },
  
  // Admin Dashboard
  'admin.dashboard.overview': { en: 'Dashboard Overview', hi: 'डैशबोर्ड अवलोकन' },
  'admin.dashboard.total': { en: 'Total Complaints', hi: 'कुल शिकायतें' },
  'admin.dashboard.highPriority': { en: 'High Priority', hi: 'उच्च प्राथमिकता' },
  'admin.dashboard.withImages': { en: 'With Images', hi: 'छवियों के साथ' },
  'admin.dashboard.duplicates': { en: 'Duplicate Complaints', hi: 'डुप्लिकेट शिकायतें' },
  'admin.dashboard.pending': { en: 'Pending', hi: 'लंबित' },
  'admin.dashboard.resolved': { en: 'Resolved', hi: 'हल' },
  'admin.dashboard.loading': { en: 'Loading...', hi: 'लोड हो रहा है...' },
  
  // Track Page
  'track.complaints.title': { en: 'Your Complaints', hi: 'आपकी शिकायतें' },
  'track.complaints.desc': { en: 'All complaints submitted from this email address', hi: 'इस ईमेल पते से दर्ज की गई सभी शिकायतें' },
  'track.complaint.id': { en: 'Complaint ID', hi: 'शिकायत ID' },
  'track.complaint.text': { en: 'Complaint', hi: 'शिकायत' },
  'track.complaint.department': { en: 'Department', hi: 'विभाग' },
  'track.complaint.location': { en: 'Location', hi: 'स्थान' },
  'track.complaint.submitted': { en: 'Submitted', hi: 'दर्ज किया गया' },
  'track.complaint.duplicate': { en: '⚠️ This complaint has been marked as a duplicate', hi: '⚠️ इस शिकायत को डुप्लिकेट के रूप में चिह्नित किया गया है' },
  'track.complaint.viewImage': { en: '📷 View Full Image', hi: '📷 पूर्ण छवि देखें' },
  
  // Admin Pages - Common
  'admin.complaints.title': { en: 'All Complaints', hi: 'सभी शिकायतें' },
  'admin.priority.title': { en: 'High Priority Complaints', hi: 'उच्च प्राथमिकता शिकायतें' },
  'admin.duplicates.title': { en: 'Duplicate Complaints', hi: 'डुप्लिकेट शिकायतें' },
  'admin.analytics.title': { en: 'Analytics Dashboard', hi: 'विश्लेषण डैशबोर्ड' },
  'admin.loading': { en: 'Loading...', hi: 'लोड हो रहा है...' },
  'admin.filters': { en: 'Filters', hi: 'फ़िल्टर' },
  'admin.filter.all': { en: 'All', hi: 'सभी' },
  'admin.filter.yes': { en: 'Yes', hi: 'हाँ' },
  'admin.filter.no': { en: 'No', hi: 'नहीं' },
  'admin.filter.category': { en: 'Category', hi: 'श्रेणी' },
  'admin.filter.priority': { en: 'Priority', hi: 'प्राथमिकता' },
  'admin.filter.status': { en: 'Status', hi: 'स्थिति' },
  'admin.filter.image': { en: 'Image', hi: 'छवि' },
  'admin.filter.duplicate': { en: 'Duplicate', hi: 'डुप्लिकेट' },
  'admin.table.id': { en: 'ID', hi: 'आईडी' },
  'admin.table.category': { en: 'Category', hi: 'श्रेणी' },
  'admin.table.priority': { en: 'Priority', hi: 'प्राथमिकता' },
  'admin.table.image': { en: 'Image', hi: 'छवि' },
  'admin.table.duplicate': { en: 'Duplicate', hi: 'डुप्लिकेट' },
  'admin.table.duplicateOf': { en: 'Duplicate Of', hi: 'डुप्लिकेट का' },
  'admin.table.department': { en: 'Department', hi: 'विभाग' },
  'admin.table.status': { en: 'Status', hi: 'स्थिति' },
  'admin.table.created': { en: 'Created', hi: 'बनाया गया' },
  'admin.table.complaint': { en: 'Complaint', hi: 'शिकायत' },
  'admin.table.action': { en: 'Action', hi: 'कार्रवाई' },
  'admin.view': { en: 'View', hi: 'देखें' },
  'admin.noImage': { en: 'No Image', hi: 'कोई छवि नहीं' },
  'admin.status.updated': { en: 'Status updated successfully', hi: 'स्थिति सफलतापूर्वक अपडेट की गई' },
  'admin.status.pending': { en: 'Pending', hi: 'लंबित' },
  'admin.status.inProgress': { en: 'In Progress', hi: 'प्रगति में' },
  'admin.status.resolved': { en: 'Resolved', hi: 'हल' },
  'admin.priority.high': { en: 'High', hi: 'उच्च' },
  'admin.priority.medium': { en: 'Medium', hi: 'मध्यम' },
  'admin.priority.low': { en: 'Low', hi: 'निम्न' },
  
  // Analytics
  'admin.analytics.category': { en: 'Complaints by Category', hi: 'श्रेणी के अनुसार शिकायतें' },
  'admin.analytics.priority': { en: 'Priority Distribution', hi: 'प्राथमिकता वितरण' },
  'admin.analytics.resolution': { en: 'Resolution Status', hi: 'समाधान स्थिति' },
  'admin.analytics.image': { en: 'Complaints with Image vs Without', hi: 'छवि के साथ बनाम बिना छवि शिकायतें' },
  'admin.analytics.duplicate': { en: 'Duplicate vs Unique Complaints', hi: 'डुप्लिकेट बनाम अद्वितीय शिकायतें' },
  'admin.analytics.withImage': { en: 'With Image', hi: 'छवि के साथ' },
  'admin.analytics.withoutImage': { en: 'Without Image', hi: 'बिना छवि' },
  'admin.analytics.duplicates': { en: 'Duplicates', hi: 'डुप्लिकेट' },
  'admin.analytics.unique': { en: 'Unique', hi: 'अद्वितीय' },
  'admin.analytics.noData': { en: 'No data available', hi: 'कोई डेटा उपलब्ध नहीं' },
  
  // Categories
  'category.infrastructure': { en: 'Infrastructure', hi: 'अवसंरचना' },
  'category.sanitation': { en: 'Sanitation', hi: 'सफाई' },
  'category.healthcare': { en: 'Healthcare', hi: 'स्वास्थ्य सेवा' },
  'category.education': { en: 'Education', hi: 'शिक्षा' },
  'category.publicSafety': { en: 'Public Safety', hi: 'सार्वजनिक सुरक्षा' },
  'category.utilities': { en: 'Utilities', hi: 'उपयोगिताएं' },
  'category.administrativeDelay': { en: 'Administrative Delay', hi: 'प्रशासनिक देरी' },
  
  // Departments
  'department.municipal': { en: 'Municipal Department', hi: 'नगर निगम विभाग' },
  'department.health': { en: 'Health Department', hi: 'स्वास्थ्य विभाग' },
  'department.education': { en: 'Education Department', hi: 'शिक्षा विभाग' },
  'department.police': { en: 'Police Department', hi: 'पुलिस विभाग' },
  'department.utilities': { en: 'Utilities Department', hi: 'उपयोगिता विभाग' },
  'department.administrative': { en: 'Administrative Department', hi: 'प्रशासनिक विभाग' },
  
  // Common Locations (add more as needed)
  'location.madhubani': { en: 'Madhubani', hi: 'मधुबनी' },
  'location.darbhanga': { en: 'Darbhanga', hi: 'दरभंगा' },
  'location.patna': { en: 'Patna', hi: 'पटना' },
  'location.bhagalpur': { en: 'Bhagalpur', hi: 'भागलपुर' },
  'location.muzaffarpur': { en: 'Muzaffarpur', hi: 'मुजफ्फरपुर' },
  
  // Admin Login
  'admin.login.title': { en: 'Admin Login', hi: 'एडमिन लॉगिन' },
  'admin.register.title': { en: 'Admin Register', hi: 'एडमिन पंजीकरण' },
  'admin.login.name': { en: 'Full Name', hi: 'पूरा नाम' },
  'admin.login.email': { en: 'Email', hi: 'ईमेल' },
  'admin.login.password': { en: 'Password', hi: 'पासवर्ड' },
  'admin.login.submit': { en: 'Login', hi: 'लॉगिन' },
  'admin.register.submit': { en: 'Register', hi: 'पंजीकरण' },
  'admin.login.switch': { en: "Don't have an account? Register", hi: 'खाता नहीं है? पंजीकरण करें' },
  'admin.register.switch': { en: 'Already have an account? Login', hi: 'पहले से खाता है? लॉगिन करें' },
  'admin.login.success': { en: 'Login successful', hi: 'लॉगिन सफल' },
  'admin.register.success': { en: 'Registration successful', hi: 'पंजीकरण सफल' },
  'admin.login.failed': { en: 'Login failed', hi: 'लॉगिन विफल' },
  'admin.register.failed': { en: 'Registration failed', hi: 'पंजीकरण विफल' },
  'admin.login.accessRequired': { en: 'Admin access required', hi: 'एडमिन पहुंच आवश्यक' },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    // Load language preference from localStorage
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage === 'en' || savedLanguage === 'hi') {
      setLanguageState(savedLanguage);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string): string => {
    return translations[key]?.[language] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

