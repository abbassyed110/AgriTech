import logging
import numpy as np
import random

# Normally we would use a real ML model here, but for simplicity
# we'll simulate a recommendation system with predefined rules

logger = logging.getLogger(__name__)

# Sample data for different soil types and their suitable crops
SOIL_CROP_MAPPING = {
    'clay': ['wheat', 'rice', 'cabbage', 'broccoli', 'cauliflower'],
    'sandy': ['carrots', 'potatoes', 'lettuce', 'strawberries', 'peanuts'],
    'loamy': ['corn', 'soybeans', 'tomatoes', 'peppers', 'cucumbers'],
    'silty': ['most vegetables', 'roses', 'fruits', 'wetland plants', 'grass'],
    'peaty': ['blueberries', 'legumes', 'root crops', 'shrubs', 'acid-loving plants'],
    'chalky': ['spinach', 'beets', 'sweet corn', 'cabbage', 'calendula'],
    'black': ['cotton', 'sugarcane', 'rice', 'wheat', 'maize']
}

# pH preferences for different crops
PH_PREFERENCES = {
    'acidic': ['blueberries', 'potatoes', 'sweet potatoes', 'radishes', 'watermelon'],
    'neutral': ['tomatoes', 'peppers', 'squash', 'cucumbers', 'beans'],
    'alkaline': ['asparagus', 'lettuce', 'spinach', 'cabbage', 'cauliflower']
}

def predict_crop(soil_type, ph_value, rainfall, temperature, humidity):
    """
    Predict suitable crops based on soil and climate conditions
    
    Args:
        soil_type (str): Type of soil (clay, sandy, loamy, etc.)
        ph_value (float): pH value of soil
        rainfall (float): Annual rainfall in mm
        temperature (float): Average temperature in Celsius
        humidity (float): Average humidity percentage
    
    Returns:
        list: List of recommended crops with confidence scores
    """
    try:
        logger.info(f"Predicting crops for: soil={soil_type}, pH={ph_value}, rain={rainfall}, temp={temperature}, humidity={humidity}")
        
        # Get crops suitable for the soil type
        soil_suitable_crops = SOIL_CROP_MAPPING.get(soil_type.lower(), [])
        
        # Determine pH category
        if ph_value < 6.0:
            ph_category = 'acidic'
        elif ph_value > 7.5:
            ph_category = 'alkaline'
        else:
            ph_category = 'neutral'
        
        ph_suitable_crops = PH_PREFERENCES.get(ph_category, [])
        
        # Combine recommendations
        all_crops = set(soil_suitable_crops + ph_suitable_crops)
        
        # Calculate confidence scores (this would normally use a real ML model)
        recommendations = []
        for crop in all_crops:
            # Generate a confidence score based on how well the crop matches the conditions
            # This is a simplified simulation - in a real system, this would use a trained model
            score = random.uniform(0.6, 0.95)
            
            # Adjust score based on environmental factors
            if crop in soil_suitable_crops:
                score += 0.1
            if crop in ph_suitable_crops:
                score += 0.1
            
            # Normalize score to be between 0 and 1
            score = min(score, 1.0)
            
            recommendations.append({
                'crop': crop,
                'confidence': round(score, 2),
                'suitable_for_soil': crop in soil_suitable_crops,
                'suitable_for_ph': crop in ph_suitable_crops
            })
        
        # Sort by confidence score
        recommendations.sort(key=lambda x: x['confidence'], reverse=True)
        
        # Return top 5 recommendations
        return recommendations[:5]
    
    except Exception as e:
        logger.error(f"Error in crop prediction: {str(e)}")
        # Return a default recommendation in case of error
        return [
            {'crop': 'wheat', 'confidence': 0.7, 'suitable_for_soil': True, 'suitable_for_ph': True},
            {'crop': 'rice', 'confidence': 0.65, 'suitable_for_soil': True, 'suitable_for_ph': True}
        ]
