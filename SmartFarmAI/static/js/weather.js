/**
 * AgriTech Platform - Weather JavaScript
 * Handles functionality for the weather page
 */

document.addEventListener('DOMContentLoaded', function() {
  // Initialize current weather display
  initializeCurrentWeather();
  
  // Initialize forecast chart
  initializeForecastChart();
  
  // Setup weather alerts
  setupWeatherAlerts();
});

/**
 * Initialize current weather display with animations
 */
function initializeCurrentWeather() {
  const weatherWidget = document.getElementById('current-weather-widget');
  if (!weatherWidget) return;
  
  // Get weather data
  const weatherData = JSON.parse(weatherWidget.getAttribute('data-weather') || '{}');
  
  if (!weatherData || weatherData.error) {
    const errorMessage = weatherData?.error || 'Weather data unavailable';
    weatherWidget.innerHTML = `
      <div class="alert alert-warning">
        <i class="fas fa-exclamation-triangle me-2"></i> ${errorMessage}
      </div>
      <p class="text-center">Please set your farm location in your profile to get weather data.</p>
    `;
    return;
  }
  
  // Set appropriate weather icon based on weather code or description
  let weatherIcon = 'fa-cloud';
  const description = weatherData.description.toLowerCase();
  
  if (description.includes('clear') || description.includes('sun')) {
    weatherIcon = 'fa-sun';
  } else if (description.includes('rain') || description.includes('drizzle')) {
    weatherIcon = 'fa-cloud-rain';
  } else if (description.includes('thunder') || description.includes('storm')) {
    weatherIcon = 'fa-bolt';
  } else if (description.includes('snow')) {
    weatherIcon = 'fa-snowflake';
  } else if (description.includes('fog') || description.includes('mist')) {
    weatherIcon = 'fa-smog';
  } else if (description.includes('cloud')) {
    if (description.includes('broken') || description.includes('scattered')) {
      weatherIcon = 'fa-cloud-sun';
    } else {
      weatherIcon = 'fa-cloud';
    }
  }
  
  // Set weather conditions classes
  weatherWidget.classList.remove('sunny', 'cloudy', 'rainy', 'stormy');
  if (description.includes('clear') || description.includes('sun')) {
    weatherWidget.classList.add('sunny');
  } else if (description.includes('rain') || description.includes('drizzle')) {
    weatherWidget.classList.add('rainy');
  } else if (description.includes('thunder') || description.includes('storm')) {
    weatherWidget.classList.add('stormy');
  } else {
    weatherWidget.classList.add('cloudy');
  }
  
  // Determine if it's day or night (simplified approach)
  const hours = new Date().getHours();
  const isNight = hours < 6 || hours > 18;
  
  if (isNight) {
    if (weatherIcon === 'fa-sun') {
      weatherIcon = 'fa-moon';
    } else if (weatherIcon === 'fa-cloud-sun') {
      weatherIcon = 'fa-cloud-moon';
    }
    weatherWidget.classList.add('night');
  }
  
  // Update weather UI
  weatherWidget.innerHTML = `
    <div class="weather-icon">
      <i class="fas ${weatherIcon} fa-3x"></i>
    </div>
    <div class="weather-temp">${Math.round(weatherData.temperature)}°C</div>
    <div class="weather-desc text-capitalize">${weatherData.description}</div>
    <div class="weather-details mt-3">
      <div class="row">
        <div class="col-6">
          <div class="weather-detail-item">
            <i class="fas fa-tint me-2"></i> Humidity: ${weatherData.humidity}%
          </div>
        </div>
        <div class="col-6">
          <div class="weather-detail-item">
            <i class="fas fa-wind me-2"></i> Wind: ${weatherData.wind_speed} m/s
          </div>
        </div>
      </div>
      <div class="row mt-2">
        <div class="col-12">
          <div class="weather-detail-item">
            <i class="fas fa-cloud-rain me-2"></i> Rainfall: ${weatherData.rainfall} mm
          </div>
        </div>
      </div>
    </div>
  `;
}

/**
 * Initialize weather forecast chart
 */
function initializeForecastChart() {
  const forecastChart = document.getElementById('forecast-chart');
  if (!forecastChart) return;
  
  // Get forecast data
  const forecastData = JSON.parse(forecastChart.getAttribute('data-forecast') || '[]');
  
  if (!forecastData || forecastData.length === 0) {
    forecastChart.innerHTML = '<div class="alert alert-warning">Forecast data unavailable</div>';
    return;
  }
  
  // Extract data for chart
  const dates = forecastData.map(day => day.date);
  const maxTemps = forecastData.map(day => day.max_temp);
  const minTemps = forecastData.map(day => day.min_temp);
  const rainfall = forecastData.map(day => day.rainfall);
  
  // Create chart
  const ctx = forecastChart.getContext('2d');
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: dates,
      datasets: [
        {
          label: 'Max Temperature (°C)',
          data: maxTemps,
          borderColor: '#ff7043',
          backgroundColor: 'rgba(255, 112, 67, 0.1)',
          borderWidth: 2,
          pointRadius: 4,
          tension: 0.3,
          yAxisID: 'y'
        },
        {
          label: 'Min Temperature (°C)',
          data: minTemps,
          borderColor: '#5c6bc0',
          backgroundColor: 'rgba(92, 107, 192, 0.1)',
          borderWidth: 2,
          pointRadius: 4,
          tension: 0.3,
          yAxisID: 'y'
        },
        {
          label: 'Rainfall (mm)',
          data: rainfall,
          borderColor: '#29b6f6',
          backgroundColor: 'rgba(41, 182, 246, 0.1)',
          borderWidth: 2,
          pointRadius: 4,
          tension: 0.3,
          yAxisID: 'y1'
        }
      ]
    },
    options: {
      responsive: true,
      interaction: {
        mode: 'index',
        intersect: false,
      },
      scales: {
        x: {
          title: {
            display: true,
            text: 'Date'
          }
        },
        y: {
          type: 'linear',
          display: true,
          position: 'left',
          title: {
            display: true,
            text: 'Temperature (°C)'
          }
        },
        y1: {
          type: 'linear',
          display: true,
          position: 'right',
          title: {
            display: true,
            text: 'Rainfall (mm)'
          },
          grid: {
            drawOnChartArea: false,
          }
        }
      },
      plugins: {
        title: {
          display: true,
          text: '7-Day Weather Forecast'
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              let label = context.dataset.label || '';
              if (label) {
                label += ': ';
              }
              if (context.parsed.y !== null) {
                label += context.parsed.y;
                if (context.dataset.label.includes('Temperature')) {
                  label += ' °C';
                } else if (context.dataset.label.includes('Rainfall')) {
                  label += ' mm';
                }
              }
              return label;
            }
          }
        }
      }
    }
  });
}

/**
 * Setup weather alerts handling
 */
function setupWeatherAlerts() {
  // Mark alerts as read when opened
  const alertItems = document.querySelectorAll('.weather-alert-item');
  
  alertItems.forEach(item => {
    item.addEventListener('click', function() {
      const alertId = this.getAttribute('data-alert-id');
      this.classList.remove('unread');
      
      if (navigator.onLine) {
        fetch(`/mark_alert_read/${alertId}`, {
          method: 'POST'
        })
        .catch(error => {
          console.error('Error marking alert as read:', error);
        });
      } else {
        // Store locally to mark as read when online
        addToOfflineStorage('alertsToMarkRead', {
          alertId: alertId,
          timestamp: new Date().toISOString()
        });
      }
    });
  });
  
  // Generate weather alerts button
  const generateAlertsBtn = document.getElementById('generate-weather-alerts');
  if (generateAlertsBtn) {
    generateAlertsBtn.addEventListener('click', function() {
      if (!navigator.onLine) {
        showNotification('Cannot generate weather alerts while offline', 'warning');
        return;
      }
      
      this.disabled = true;
      this.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Generating...';
      
      fetch('/generate_weather_alerts')
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.text();
        })
        .then(() => {
          window.location.reload();
        })
        .catch(error => {
          console.error('Error generating weather alerts:', error);
          showNotification('Error generating weather alerts. Please try again.', 'danger');
          this.disabled = false;
          this.textContent = 'Generate Weather Alerts';
        });
    });
  }
}

/**
 * Handle customizing farm location
 */
document.addEventListener('DOMContentLoaded', function() {
  const locationForm = document.getElementById('update-location-form');
  
  if (locationForm) {
    locationForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const latitude = document.getElementById('farm-latitude').value;
      const longitude = document.getElementById('farm-longitude').value;
      const location = document.getElementById('farm-location').value;
      
      if (!latitude || !longitude || !location) {
        showNotification('Please fill in all location fields', 'warning');
        return;
      }
      
      if (!navigator.onLine) {
        addToOfflineStorage('farmLocation', {
          latitude: latitude,
          longitude: longitude,
          location: location,
          timestamp: new Date().toISOString()
        });
        
        showNotification('Location saved locally. It will be updated when you\'re back online.', 'warning');
        
        // Close the modal
        const modal = document.getElementById('update-location-modal');
        const modalInstance = bootstrap.Modal.getInstance(modal);
        modalInstance.hide();
        
        return;
      }
      
      // Submit form data
      fetch('/update_farm_location', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          'farm_latitude': latitude,
          'farm_longitude': longitude,
          'farm_location': location
        })
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.text();
      })
      .then(() => {
        showNotification('Farm location updated successfully', 'success');
        
        // Close the modal
        const modal = document.getElementById('update-location-modal');
        const modalInstance = bootstrap.Modal.getInstance(modal);
        modalInstance.hide();
        
        // Reload to get new weather data
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      })
      .catch(error => {
        console.error('Error updating farm location:', error);
        showNotification('Error updating farm location. Please try again.', 'danger');
      });
    });
  }
});
