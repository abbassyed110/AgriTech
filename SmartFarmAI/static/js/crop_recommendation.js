/**
 * AgriTech Platform - Crop Recommendation JavaScript
 * Handles functionality for the crop recommendation page
 */

document.addEventListener('DOMContentLoaded', function() {
  // Initialize the recommendation form
  initializeRecommendationForm();
  
  // Initialize results visualization
  initializeResultsVisualization();
  
  // Setup previous recommendations accordion
  setupPreviousRecommendations();
});

/**
 * Initialize the crop recommendation form
 */
function initializeRecommendationForm() {
  const recommendationForm = document.getElementById('recommendation-form');
  if (!recommendationForm) return;
  
  // Range sliders for soil parameters
  const rangeInputs = document.querySelectorAll('.range-input');
  
  rangeInputs.forEach(input => {
    const rangeValue = input.nextElementSibling;
    if (rangeValue) {
      // Set initial value
      rangeValue.textContent = input.value;
      
      // Update value when slider is moved
      input.addEventListener('input', function() {
        rangeValue.textContent = this.value;
      });
    }
  });
  
  // Soil type selection
  const soilTypeSelect = document.getElementById('soil-type');
  if (soilTypeSelect) {
    // Populate with common soil types if empty
    if (soilTypeSelect.options.length <= 1) {
      const soilTypes = [
        'clay', 'sandy', 'loamy', 'silty', 'peaty', 'chalky', 'black'
      ];
      
      soilTypes.forEach(type => {
        const option = document.createElement('option');
        option.value = type;
        option.textContent = type.charAt(0).toUpperCase() + type.slice(1);
        soilTypeSelect.appendChild(option);
      });
    }
  }
  
  // Form submission
  recommendationForm.addEventListener('submit', function(e) {
    if (!this.checkValidity()) {
      e.preventDefault();
      e.stopPropagation();
      this.classList.add('was-validated');
      return;
    }
    
    // If offline, show message
    if (!navigator.onLine) {
      e.preventDefault();
      showNotification('Crop recommendation is not available offline. Please try again when you have an internet connection.', 'warning');
      return;
    }
    
    // Show loading state
    const submitButton = this.querySelector('button[type="submit"]');
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Analyzing...';
    }
  });
}

/**
 * Initialize the visualization of recommendation results
 */
function initializeResultsVisualization() {
  const resultsContainer = document.getElementById('recommendation-results');
  if (!resultsContainer) return;
  
  // Check if we have results to display
  const recommendedCrops = resultsContainer.getAttribute('data-recommended-crops');
  if (!recommendedCrops) return;
  
  try {
    const crops = JSON.parse(recommendedCrops);
    
    // Create a bar chart for crop confidence scores
    const chartContainer = document.getElementById('recommendation-chart');
    if (chartContainer && crops && crops.length > 0) {
      const cropNames = crops.map(crop => crop.crop);
      const confidenceScores = crops.map(crop => crop.confidence * 100);
      
      const ctx = chartContainer.getContext('2d');
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: cropNames,
          datasets: [{
            label: 'Confidence Score (%)',
            data: confidenceScores,
            backgroundColor: [
              'rgba(76, 175, 80, 0.7)',
              'rgba(139, 195, 74, 0.7)',
              'rgba(205, 220, 57, 0.7)',
              'rgba(255, 235, 59, 0.7)',
              'rgba(255, 193, 7, 0.7)'
            ],
            borderColor: [
              'rgba(76, 175, 80, 1)',
              'rgba(139, 195, 74, 1)',
              'rgba(205, 220, 57, 1)',
              'rgba(255, 235, 59, 1)',
              'rgba(255, 193, 7, 1)'
            ],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
              max: 100,
              title: {
                display: true,
                text: 'Confidence Score (%)'
              }
            },
            x: {
              title: {
                display: true,
                text: 'Recommended Crops'
              }
            }
          },
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  return `Confidence: ${context.raw.toFixed(1)}%`;
                }
              }
            }
          }
        }
      });
    }
    
    // Add detailed information for each crop
    const detailsContainer = document.getElementById('crop-details-container');
    if (detailsContainer && crops && crops.length > 0) {
      let detailsHTML = '';
      
      crops.forEach((crop, index) => {
        detailsHTML += `
          <div class="card recommendation-card mb-3">
            <div class="card-body">
              <h4 class="card-title">${index + 1}. ${crop.crop.charAt(0).toUpperCase() + crop.crop.slice(1)}</h4>
              <div class="confidence-container mb-3">
                <div class="d-flex justify-content-between">
                  <span>Confidence Score:</span>
                  <span class="confidence-text">${(crop.confidence * 100).toFixed(1)}%</span>
                </div>
                <div class="confidence-meter">
                  <div class="confidence-value" style="width: ${crop.confidence * 100}%;"></div>
                </div>
              </div>
              <div class="crop-suitability">
                <p>
                  <i class="fas fa-check-circle text-${crop.suitable_for_soil ? 'success' : 'danger'}"></i>
                  Suitable for your soil type: <strong>${crop.suitable_for_soil ? 'Yes' : 'No'}</strong>
                </p>
                <p>
                  <i class="fas fa-check-circle text-${crop.suitable_for_ph ? 'success' : 'danger'}"></i>
                  Suitable for your soil pH: <strong>${crop.suitable_for_ph ? 'Yes' : 'No'}</strong>
                </p>
              </div>
            </div>
          </div>
        `;
      });
      
      detailsContainer.innerHTML = detailsHTML;
    }
  } catch (error) {
    console.error('Error parsing crop recommendations:', error);
  }
}

/**
 * Setup the previous recommendations accordion
 */
function setupPreviousRecommendations() {
  const accordionItems = document.querySelectorAll('.previous-recommendation-item');
  
  accordionItems.forEach(item => {
    // Show details when clicked
    const header = item.querySelector('.recommendation-header');
    const body = item.querySelector('.recommendation-body');
    
    if (header && body) {
      header.addEventListener('click', function() {
        // Toggle the active class
        this.classList.toggle('active');
        
        // Toggle the body display
        if (body.style.maxHeight) {
          body.style.maxHeight = null;
        } else {
          body.style.maxHeight = body.scrollHeight + 'px';
        }
      });
    }
    
    // Visualize the recommendation if it has crop data
    const cropData = item.getAttribute('data-crops');
    if (cropData) {
      try {
        const crops = JSON.parse(cropData);
        const chartContainer = item.querySelector('.recommendation-chart');
        
        if (chartContainer && crops && crops.length > 0) {
          const cropNames = crops.map(crop => crop.crop);
          const confidenceScores = crops.map(crop => crop.confidence * 100);
          
          const ctx = chartContainer.getContext('2d');
          new Chart(ctx, {
            type: 'bar',
            data: {
              labels: cropNames,
              datasets: [{
                label: 'Confidence Score (%)',
                data: confidenceScores,
                backgroundColor: 'rgba(76, 175, 80, 0.7)',
                borderColor: 'rgba(76, 175, 80, 1)',
                borderWidth: 1
              }]
            },
            options: {
              responsive: true,
              scales: {
                y: {
                  beginAtZero: true,
                  max: 100
                }
              },
              plugins: {
                legend: {
                  display: false
                }
              }
            }
          });
        }
      } catch (error) {
        console.error('Error parsing previous crop recommendations:', error);
      }
    }
  });
}

/**
 * Handle saving recommendations to farm plan
 */
function saveRecommendationToFarmPlan(cropName) {
  if (!navigator.onLine) {
    addToOfflineStorage('cropToAdd', {
      cropName: cropName,
      timestamp: new Date().toISOString()
    });
    showNotification('Crop saved locally. It will be added to your farm plan when you\'re back online.', 'warning');
    return;
  }
  
  fetch('/add_to_farm_plan', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      'crop_name': cropName
    })
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.text();
  })
  .then(() => {
    showNotification(`${cropName} added to your farm plan successfully`, 'success');
  })
  .catch(error => {
    console.error('Error adding crop to farm plan:', error);
    showNotification('Error adding crop to farm plan. Please try again.', 'danger');
  });
}

// Add event listeners to "Add to Farm Plan" buttons
document.addEventListener('DOMContentLoaded', function() {
  const addToPlanButtons = document.querySelectorAll('.add-to-plan-btn');
  
  addToPlanButtons.forEach(button => {
    button.addEventListener('click', function() {
      const cropName = this.getAttribute('data-crop-name');
      saveRecommendationToFarmPlan(cropName);
    });
  });
});
