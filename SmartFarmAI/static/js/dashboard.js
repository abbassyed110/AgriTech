/**
 * AgriTech Platform - Dashboard JavaScript
 * Handles dashboard-specific functionality
 */

document.addEventListener('DOMContentLoaded', function() {
  // Initialize charts if they exist on the page
  initializeWeatherChart();
  initializeCropStatusChart();
  
  // Setup the crop modal form
  setupCropForm();
  
  // Setup weather alert handlers
  setupWeatherAlerts();
});

/**
 * Initialize the weather chart
 */
function initializeWeatherChart() {
  const weatherChartElement = document.getElementById('weather-chart');
  if (!weatherChartElement) return;
  
  // Get weather data from the data attribute
  const weatherData = JSON.parse(weatherChartElement.getAttribute('data-weather') || '{}');
  
  if (!weatherData || !weatherData.forecast) {
    console.error('Weather forecast data is not available');
    return;
  }
  
  const ctx = weatherChartElement.getContext('2d');
  
  // Extract data for the chart
  const labels = weatherData.forecast.map(item => item.date);
  const temperatures = weatherData.forecast.map(item => item.temperature);
  const rainfall = weatherData.forecast.map(item => item.rainfall);
  
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Temperature (°C)',
          data: temperatures,
          borderColor: '#ff6b6b',
          backgroundColor: 'rgba(255, 107, 107, 0.1)',
          borderWidth: 2,
          tension: 0.4,
          yAxisID: 'y'
        },
        {
          label: 'Rainfall (mm)',
          data: rainfall,
          borderColor: '#339af0',
          backgroundColor: 'rgba(51, 154, 240, 0.1)',
          borderWidth: 2,
          tension: 0.4,
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
      }
    }
  });
}

/**
 * Initialize the crop status chart
 */
function initializeCropStatusChart() {
  const cropChartElement = document.getElementById('crop-status-chart');
  if (!cropChartElement) return;
  
  // Get crop data from the data attribute
  const cropData = JSON.parse(cropChartElement.getAttribute('data-crops') || '{}');
  
  if (!cropData || !cropData.crops) {
    console.error('Crop data is not available');
    return;
  }
  
  const ctx = cropChartElement.getContext('2d');
  
  // Count crops by status
  const statusCounts = {};
  cropData.crops.forEach(crop => {
    statusCounts[crop.status] = (statusCounts[crop.status] || 0) + 1;
  });
  
  // Prepare data for the chart
  const statuses = Object.keys(statusCounts);
  const counts = Object.values(statusCounts);
  
  // Define colors for different statuses
  const statusColors = {
    'growing': '#4caf50',
    'harvested': '#ffc107',
    'planned': '#2196f3',
    'failed': '#f44336'
  };
  
  const colors = statuses.map(status => statusColors[status] || '#9e9e9e');
  
  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: statuses,
      datasets: [{
        data: counts,
        backgroundColor: colors,
        hoverOffset: 4
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'bottom'
        },
        title: {
          display: true,
          text: 'Crop Status Distribution'
        }
      }
    }
  });
}

/**
 * Set up crop form modal
 */
function setupCropForm() {
  const addCropModal = document.getElementById('add-crop-modal');
  const updateCropModals = document.querySelectorAll('.update-crop-modal');
  
  if (addCropModal) {
    // Initialize date pickers in the add crop form
    const plantingDatePicker = addCropModal.querySelector('#planting-date');
    const harvestDatePicker = addCropModal.querySelector('#expected-harvest-date');
    
    if (plantingDatePicker && harvestDatePicker) {
      // Set minimum date for planting date to today
      const today = new Date().toISOString().split('T')[0];
      plantingDatePicker.setAttribute('min', today);
      
      // Update harvest date min value when planting date changes
      plantingDatePicker.addEventListener('change', function() {
        harvestDatePicker.setAttribute('min', this.value);
      });
    }
  }
  
  // Handle update crop modals
  updateCropModals.forEach(modal => {
    const cropId = modal.getAttribute('data-crop-id');
    const noteField = modal.querySelector('.crop-notes');
    const statusField = modal.querySelector('.crop-status');
    
    if (noteField && statusField) {
      // Save changes button
      const saveBtn = modal.querySelector('.save-crop-changes');
      if (saveBtn) {
        saveBtn.addEventListener('click', function() {
          updateCropStatus(cropId, statusField.value, noteField.value);
        });
      }
      
      // Save offline if we're not connected
      if (!navigator.onLine) {
        const offlineForm = modal.querySelector('form');
        if (offlineForm) {
          offlineForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            addToOfflineStorage('cropNotes', {
              cropId: cropId,
              status: statusField.value,
              notes: noteField.value,
              timestamp: new Date().toISOString()
            });
            
            // Close the modal
            const modalInstance = bootstrap.Modal.getInstance(modal);
            modalInstance.hide();
          });
        }
      }
    }
  });
}

/**
 * Update a crop's status and notes
 */
function updateCropStatus(cropId, status, notes) {
  if (!navigator.onLine) {
    addToOfflineStorage('cropNotes', {
      cropId: cropId,
      status: status,
      notes: notes,
      timestamp: new Date().toISOString()
    });
    return;
  }
  
  fetch(`/update_crop/${cropId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      'status': status,
      'notes': notes
    })
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.text();
  })
  .then(() => {
    showNotification('Crop updated successfully', 'success');
    
    // Update UI to reflect changes
    const statusBadge = document.querySelector(`.crop-item[data-crop-id="${cropId}"] .status-badge`);
    if (statusBadge) {
      statusBadge.textContent = status;
      
      // Update badge class based on status
      statusBadge.className = 'badge status-badge';
      if (status === 'growing') {
        statusBadge.classList.add('bg-success');
      } else if (status === 'harvested') {
        statusBadge.classList.add('bg-warning', 'text-dark');
      } else if (status === 'planned') {
        statusBadge.classList.add('bg-primary');
      } else if (status === 'failed') {
        statusBadge.classList.add('bg-danger');
      } else {
        statusBadge.classList.add('bg-secondary');
      }
    }
    
    // Update notes preview if it exists
    const notesPreview = document.querySelector(`.crop-item[data-crop-id="${cropId}"] .notes-preview`);
    if (notesPreview) {
      notesPreview.textContent = notes.length > 50 ? notes.substring(0, 50) + '...' : notes;
    }
    
    // Close the modal
    const modal = document.querySelector(`.update-crop-modal[data-crop-id="${cropId}"]`);
    if (modal) {
      const modalInstance = bootstrap.Modal.getInstance(modal);
      modalInstance.hide();
    }
    
    // Refresh crop status chart if it exists
    initializeCropStatusChart();
  })
  .catch(error => {
    console.error('Error updating crop:', error);
    showNotification('Error updating crop. Please try again.', 'danger');
  });
}

/**
 * Setup weather alert handling
 */
function setupWeatherAlerts() {
  const generateAlertsBtn = document.getElementById('generate-weather-alerts');
  if (generateAlertsBtn) {
    generateAlertsBtn.addEventListener('click', function() {
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
          window.location.href = '/weather';
        })
        .catch(error => {
          console.error('Error generating weather alerts:', error);
          showNotification('Error generating weather alerts. Please try again.', 'danger');
          this.disabled = false;
          this.textContent = 'Generate Weather Alerts';
        });
    });
  }
  
  // Mark alerts as read when clicked
  const alertItems = document.querySelectorAll('.weather-alert-item');
  alertItems.forEach(item => {
    item.addEventListener('click', function() {
      const alertId = this.getAttribute('data-alert-id');
      this.classList.remove('unread');
      
      fetch(`/mark_alert_read/${alertId}`, {
        method: 'POST'
      })
      .catch(error => {
        console.error('Error marking alert as read:', error);
      });
    });
  });
}
