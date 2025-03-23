import os
import requests
import json
import logging
from datetime import datetime

logger = logging.getLogger(__name__)

# List of allowed file extensions for image uploads
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}

def allowed_file(filename):
    """Check if the file has an allowed extension"""
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def get_weather_data(latitude, longitude):
    """
    Get current weather data from OpenWeatherMap API
    Returns weather data in a structured format
    """
    try:
        api_key = os.environ.get("OPENWEATHER_API_KEY", "")
        if not api_key:
            logger.warning("OpenWeather API key not set")
            return {
                "error": "Weather API key not configured",
                "temperature": 0,
                "humidity": 0,
                "description": "No data available",
                "icon": "question",
                "wind_speed": 0,
                "rainfall": 0
            }
        
        url = f"https://api.openweathermap.org/data/2.5/weather?lat={latitude}&lon={longitude}&appid={api_key}&units=metric"
        response = requests.get(url)
        data = response.json()
        
        if response.status_code != 200:
            logger.error(f"OpenWeather API error: {data.get('message', 'Unknown error')}")
            return {
                "error": data.get("message", "Weather data unavailable"),
                "temperature": 0,
                "humidity": 0,
                "description": "No data available",
                "icon": "question",
                "wind_speed": 0,
                "rainfall": 0
            }
        
        weather = {
            "temperature": data["main"]["temp"],
            "humidity": data["main"]["humidity"],
            "description": data["weather"][0]["description"],
            "icon": data["weather"][0]["icon"],
            "wind_speed": data["wind"]["speed"],
            "rainfall": data.get("rain", {}).get("1h", 0)
        }
        
        return weather
    
    except Exception as e:
        logger.error(f"Error fetching weather data: {str(e)}")
        return {
            "error": "Error fetching weather data",
            "temperature": 0,
            "humidity": 0,
            "description": "No data available",
            "icon": "question",
            "wind_speed": 0,
            "rainfall": 0
        }

def format_date(date_obj):
    """Format date object to string"""
    if date_obj:
        return date_obj.strftime('%Y-%m-%d')
    return ""

def parse_date(date_str):
    """Parse date string to date object"""
    try:
        return datetime.strptime(date_str, '%Y-%m-%d').date()
    except:
        return None

def get_language_labels(language_code='en'):
    """Get UI labels in the specified language"""
    labels = {
        'en': {
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
            # Add more labels as needed
        },
        'hi': {
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
            # Add more labels as needed
        },
        # Add more languages as needed
    }
    
    return labels.get(language_code, labels['en'])
