/**
 * AgriTech Platform - Translations JavaScript
 * Handles multilingual support for the application
 */

// Store supported languages
const SUPPORTED_LANGUAGES = {
  'en': 'English',
  'hi': 'हिन्दी (Hindi)',
  'te': 'తెలుగు (Telugu)',
  'ta': 'தமிழ் (Tamil)',
  'mr': 'मराठी (Marathi)',
  'bn': 'বাংলা (Bengali)'
};

// Translation dictionaries
const TRANSLATIONS = {
  // English translations (default)
  'en': {
    // Common UI elements
    'app_name': 'AgriTech Platform',
    'dashboard': 'Dashboard',
    'crops': 'My Crops',
    'weather': 'Weather',
    'marketplace': 'Marketplace',
    'disease_detection': 'Disease Detection',
    'crop_recommendation': 'Crop Recommendation',
    'knowledge_base': 'Knowledge Base',
    'profile': 'Profile',
    'login': 'Login',
    'register': 'Register',
    'logout': 'Logout',
    'search': 'Search',
    'save': 'Save',
    'cancel': 'Cancel',
    'submit': 'Submit',
    'update': 'Update',
    'delete': 'Delete',
    'add': 'Add',
    'edit': 'Edit',
    'close': 'Close',
    
    // Dashboard
    'welcome_message': 'Welcome to Your Farm Dashboard',
    'farm_overview': 'Farm Overview',
    'current_crops': 'Current Crops',
    'active_listings': 'Active Marketplace Listings',
    'weather_alerts': 'Weather Alerts',
    'crop_status': 'Crop Status',
    'add_crop': 'Add Crop',
    'no_crops': 'No crops added yet. Start by adding a crop.',
    
    // Crop Management
    'crop_name': 'Crop Name',
    'planting_date': 'Planting Date',
    'harvest_date': 'Expected Harvest Date',
    'area_planted': 'Area Planted',
    'crop_status': 'Status',
    'crop_notes': 'Notes',
    'growing': 'Growing',
    'harvested': 'Harvested',
    'planned': 'Planned',
    'failed': 'Failed',
    
    // Weather
    'current_weather': 'Current Weather',
    'forecast': 'Forecast',
    'temperature': 'Temperature',
    'humidity': 'Humidity',
    'wind_speed': 'Wind Speed',
    'rainfall': 'Rainfall',
    'generate_alerts': 'Generate Weather Alerts',
    'no_weather_data': 'Weather data unavailable',
    'update_location': 'Update Farm Location',
    
    // Disease Detection
    'upload_image': 'Upload Plant Image',
    'drag_drop': 'Drag and drop image here or click to upload',
    'analyze_image': 'Analyze Image',
    'diagnosis_result': 'Diagnosis Result',
    'treatment': 'Treatment Recommendation',
    'confidence': 'Confidence',
    'previous_diagnoses': 'Previous Diagnoses',
    
    // Crop Recommendation
    'soil_parameters': 'Soil Parameters',
    'soil_type': 'Soil Type',
    'ph_value': 'pH Value',
    'get_recommendations': 'Get Recommendations',
    'recommended_crops': 'Recommended Crops',
    'previous_recommendations': 'Previous Recommendations',
    'add_to_farm': 'Add to Farm Plan',
    
    // Marketplace
    'product_listings': 'Product Listings',
    'add_listing': 'Add Listing',
    'quantity': 'Quantity',
    'price': 'Price',
    'unit': 'Unit',
    'location': 'Location',
    'seller': 'Seller',
    'contact_seller': 'Contact Seller',
    'no_listings': 'No listings available',
    'filter_results': 'Filter Results',
    
    // Knowledge Base
    'all_categories': 'All Categories',
    'search_articles': 'Search Articles',
    'read_more': 'Read More',
    'save_offline': 'Save Offline',
    'no_articles': 'No articles found',
    
    // Authentication
    'username': 'Username',
    'email': 'Email',
    'password': 'Password',
    'confirm_password': 'Confirm Password',
    'remember_me': 'Remember Me',
    'forgot_password': 'Forgot Password?',
    'create_account': 'Create Account',
    'already_have_account': 'Already have an account?',
    'dont_have_account': 'Don\'t have an account?',
    
    // Profile
    'personal_info': 'Personal Information',
    'farm_info': 'Farm Information',
    'full_name': 'Full Name',
    'phone': 'Phone Number',
    'farm_size': 'Farm Size',
    'farm_location': 'Farm Location',
    'language_preference': 'Language Preference',
    
    // Errors and notifications
    'error_occurred': 'An error occurred',
    'try_again': 'Please try again',
    'saved_successfully': 'Saved successfully',
    'updated_successfully': 'Updated successfully',
    'deleted_successfully': 'Deleted successfully',
    'offline_mode': 'You are currently offline',
    'online_mode': 'You are back online'
  },
  
  // Hindi translations
  'hi': {
    'app_name': 'कृषि-तकनीक मंच',
    'dashboard': 'डैशबोर्ड',
    'crops': 'मेरी फसलें',
    'weather': 'मौसम',
    'marketplace': 'बाज़ार',
    'disease_detection': 'रोग पहचान',
    'crop_recommendation': 'फसल सिफारिश',
    'knowledge_base': 'ज्ञान भंडार',
    'profile': 'प्रोफाइल',
    'login': 'लॉगिन',
    'register': 'पंजीकरण',
    'logout': 'लॉगआउट',
    'search': 'खोज',
    'save': 'सहेजें',
    'cancel': 'रद्द करें',
    'submit': 'जमा करें',
    'update': 'अपडेट करें',
    'delete': 'हटाएं',
    'add': 'जोड़ें',
    'edit': 'संपादित करें',
    'close': 'बंद करें',
    
    // Dashboard
    'welcome_message': 'आपके कृषि डैशबोर्ड में आपका स्वागत है',
    'farm_overview': 'खेत का अवलोकन',
    'current_crops': 'वर्तमान फसलें',
    'active_listings': 'सक्रिय बाज़ार लिस्टिंग',
    'weather_alerts': 'मौसम अलर्ट',
    'crop_status': 'फसल की स्थिति',
    'add_crop': 'फसल जोड़ें',
    'no_crops': 'अभी तक कोई फसल नहीं जोड़ी गई है। फसल जोड़कर शुरू करें।',
    
    // Crop Management
    'crop_name': 'फसल का नाम',
    'planting_date': 'रोपण तिथि',
    'harvest_date': 'अपेक्षित कटाई तिथि',
    'area_planted': 'रोपित क्षेत्र',
    'crop_status': 'स्थिति',
    'crop_notes': 'नोट्स',
    'growing': 'बढ़ रही है',
    'harvested': 'कटाई की गई',
    'planned': 'योजनाबद्ध',
    'failed': 'विफल',
    
    // Weather
    'current_weather': 'वर्तमान मौसम',
    'forecast': 'पूर्वानुमान',
    'temperature': 'तापमान',
    'humidity': 'आर्द्रता',
    'wind_speed': 'हवा की गति',
    'rainfall': 'वर्षा',
    'generate_alerts': 'मौसम अलर्ट जनरेट करें',
    'no_weather_data': 'मौसम डेटा अनुपलब्ध',
    'update_location': 'खेत का स्थान अपडेट करें',
    
    // Disease Detection
    'upload_image': 'पौधे की छवि अपलोड करें',
    'drag_drop': 'छवि को यहां खींचें और छोड़ें या अपलोड करने के लिए क्लिक करें',
    'analyze_image': 'छवि का विश्लेषण करें',
    'diagnosis_result': 'निदान परिणाम',
    'treatment': 'उपचार की सिफारिश',
    'confidence': 'विश्वास स्तर',
    'previous_diagnoses': 'पिछले निदान',
    
    // Crop Recommendation
    'soil_parameters': 'मिट्टी के मापदंड',
    'soil_type': 'मिट्टी का प्रकार',
    'ph_value': 'पीएच मान',
    'get_recommendations': 'सिफारिशें प्राप्त करें',
    'recommended_crops': 'अनुशंसित फसलें',
    'previous_recommendations': 'पिछली सिफारिशें',
    'add_to_farm': 'खेत की योजना में जोड़ें',
    
    // Marketplace
    'product_listings': 'उत्पाद लिस्टिंग',
    'add_listing': 'लिस्टिंग जोड़ें',
    'quantity': 'मात्रा',
    'price': 'कीमत',
    'unit': 'इकाई',
    'location': 'स्थान',
    'seller': 'विक्रेता',
    'contact_seller': 'विक्रेता से संपर्क करें',
    'no_listings': 'कोई लिस्टिंग उपलब्ध नहीं',
    'filter_results': 'परिणाम फ़िल्टर करें',
    
    // Knowledge Base
    'all_categories': 'सभी श्रेणियां',
    'search_articles': 'लेख खोजें',
    'read_more': 'और पढ़ें',
    'save_offline': 'ऑफलाइन सहेजें',
    'no_articles': 'कोई लेख नहीं मिला',
    
    // Authentication
    'username': 'उपयोगकर्ता नाम',
    'email': 'ईमेल',
    'password': 'पासवर्ड',
    'confirm_password': 'पासवर्ड की पुष्टि करें',
    'remember_me': 'मुझे याद रखें',
    'forgot_password': 'पासवर्ड भूल गए?',
    'create_account': 'खाता बनाएं',
    'already_have_account': 'पहले से ही एक खाता है?',
    'dont_have_account': 'खाता नहीं है?',
    
    // Profile
    'personal_info': 'व्यक्तिगत जानकारी',
    'farm_info': 'खेत की जानकारी',
    'full_name': 'पूरा नाम',
    'phone': 'फोन नंबर',
    'farm_size': 'खेत का आकार',
    'farm_location': 'खेत का स्थान',
    'language_preference': 'भाषा प्राथमिकता',
    
    // Errors and notifications
    'error_occurred': 'एक त्रुटि हुई',
    'try_again': 'कृपया पुनः प्रयास करें',
    'saved_successfully': 'सफलतापूर्वक सहेजा गया',
    'updated_successfully': 'सफलतापूर्वक अपडेट किया गया',
    'deleted_successfully': 'सफलतापूर्वक हटाया गया',
    'offline_mode': 'आप वर्तमान में ऑफ़लाइन हैं',
    'online_mode': 'आप वापस ऑनलाइन हैं'
  },
  
  // Add more languages as needed
  'te': {
    'app_name': 'అగ్రిటెక్ ప్లాట్‌ఫామ్',
    'dashboard': 'డాష్‌బోర్డ్',
    'crops': 'నా పంటలు',
    'weather': 'వాతావరణం',
    // Add more Telugu translations as needed
  },
  
  'ta': {
    'app_name': 'அக்ரிடெக் பிளாட்ஃபார்ம்',
    'dashboard': 'டாஷ்போர்டு',
    'crops': 'எனது பயிர்கள்',
    'weather': 'வானிலை',
    // Add more Tamil translations as needed
  }
};

/**
 * Get translation for a key in the specified language
 * 
 * @param {string} key - The translation key
 * @param {string} lang - Language code (defaults to 'en')
 * @returns {string} - Translated text or original key if translation not found
 */
function getTranslation(key, lang = 'en') {
  // Get the user's preferred language from session storage or default to English
  const userLang = lang || sessionStorage.getItem('userLanguage') || 'en';
  
  // Check if the language is supported, otherwise default to English
  const language = SUPPORTED_LANGUAGES[userLang] ? userLang : 'en';
  
  // Return the translation or the key itself if not found
  return TRANSLATIONS[language][key] || TRANSLATIONS['en'][key] || key;
}

/**
 * Initialize language selector
 */
function initializeLanguageSelector() {
  const selector = document.getElementById('language-selector');
  if (!selector) return;
  
  // Get current language
  const currentLang = sessionStorage.getItem('userLanguage') || 'en';
  
  // Set the selector value
  selector.value = currentLang;
  
  // Add event listener to change language
  selector.addEventListener('change', function() {
    const newLang = this.value;
    sessionStorage.setItem('userLanguage', newLang);
    
    // Redirect to set the language on the server side
    window.location.href = `/set_language/${newLang}`;
  });
}

/**
 * Apply translations to elements with 'data-i18n' attribute
 */
function applyTranslations() {
  const currentLang = sessionStorage.getItem('userLanguage') || 'en';
  const elements = document.querySelectorAll('[data-i18n]');
  
  elements.forEach(element => {
    const key = element.getAttribute('data-i18n');
    const translation = getTranslation(key, currentLang);
    
    // For input elements, set the placeholder or value
    if (element.tagName === 'INPUT') {
      if (element.type === 'submit' || element.type === 'button') {
        element.value = translation;
      } else {
        element.placeholder = translation;
      }
    } 
    // For elements like buttons and others, set the text content
    else {
      element.textContent = translation;
    }
  });
}

// Initialize translations when the DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  initializeLanguageSelector();
  applyTranslations();
});

// Export functions for use in other modules
window.getTranslation = getTranslation;
window.applyTranslations = applyTranslations;
