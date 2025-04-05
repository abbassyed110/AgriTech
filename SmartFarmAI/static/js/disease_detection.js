/**
 * AgriTech Platform - Disease Detection JavaScript
 * Handles functionality for the disease detection page
 */

document.addEventListener('DOMContentLoaded', function() {
  // Initialize the file upload area
  initializeFileUpload();
  
  // Setup the crop type selection
  setupCropTypeSelection();
  
  // Initialize previous diagnoses accordion
  initializePreviousDiagnoses();
});

/**
 * Initialize the file upload area with drag and drop functionality
 */
function initializeFileUpload() {
  const uploadArea = document.getElementById('upload-area');
  const fileInput = document.getElementById('plant-image');
  const previewContainer = document.getElementById('image-preview-container');
  const previewImage = document.getElementById('image-preview');
  
  if (!uploadArea || !fileInput) return;
  
  // Handle click on upload area
  uploadArea.addEventListener('click', function() {
    fileInput.click();
  });
  
  // Handle drag and drop events
  uploadArea.addEventListener('dragover', function(e) {
    e.preventDefault();
    uploadArea.classList.add('drag-over');
  });
  
  uploadArea.addEventListener('dragleave', function() {
    uploadArea.classList.remove('drag-over');
  });
  
  uploadArea.addEventListener('drop', function(e) {
    e.preventDefault();
    uploadArea.classList.remove('drag-over');
    
    if (e.dataTransfer.files.length) {
      fileInput.files = e.dataTransfer.files;
      displayImagePreview(e.dataTransfer.files[0]);
    }
  });
  
  // Handle file selection via the file input
  fileInput.addEventListener('change', function() {
    if (this.files.length) {
      displayImagePreview(this.files[0]);
    }
  });
  
  // Display image preview when a file is selected
  function displayImagePreview(file) {
    if (!file.type.match('image.*')) {
      showNotification('Please select an image file (PNG, JPG, JPEG)', 'danger');
      return;
    }
    
    const reader = new FileReader();
    
    reader.onload = function(e) {
      previewImage.src = e.target.result;
      previewContainer.style.display = 'block';
      uploadArea.classList.add('has-image');
    };
    
    reader.readAsDataURL(file);
  }
}

/**
 * Setup the crop type selection
 */
function setupCropTypeSelection() {
  const cropSelect = document.getElementById('crop-name');
  if (!cropSelect) return;
  
  // Add common crop types if the select is empty
  if (cropSelect.options.length <= 1) {
    const commonCrops = [
      'Rice', 'Wheat', 'Maize', 'Potato', 'Tomato', 'Cotton', 
      'Soybean', 'Chickpea', 'Cucumber', 'Pepper', 'Eggplant'
    ];
    
    commonCrops.forEach(crop => {
      const option = document.createElement('option');
      option.value = crop.toLowerCase();
      option.textContent = crop;
      cropSelect.appendChild(option);
    });
  }
  
  // Handle custom crop input
  const otherOption = document.getElementById('other-crop-option');
  const customCropInput = document.getElementById('custom-crop-input');
  
  if (otherOption && customCropInput) {
    cropSelect.addEventListener('change', function() {
      if (this.value === 'other') {
        customCropInput.style.display = 'block';
        customCropInput.required = true;
      } else {
        customCropInput.style.display = 'none';
        customCropInput.required = false;
      }
    });
  }
}

/**
 * Initialize the previous diagnoses accordion
 */
function initializePreviousDiagnoses() {
  const accordionItems = document.querySelectorAll('.previous-diagnosis-item');
  
  accordionItems.forEach(item => {
    // Show treatment details when clicked
    const header = item.querySelector('.diagnosis-header');
    const body = item.querySelector('.diagnosis-body');
    
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
  });
}

/**
 * Handle form submission
 */
document.addEventListener('DOMContentLoaded', function() {
  const diagnosisForm = document.getElementById('disease-detection-form');
  
  if (diagnosisForm) {
    diagnosisForm.addEventListener('submit', function(e) {
      const fileInput = document.getElementById('plant-image');
      const cropSelect = document.getElementById('crop-name');
      const customCropInput = document.getElementById('custom-crop-input');
      
      // Validate file input
      if (!fileInput.files.length) {
        e.preventDefault();
        showNotification('Please select an image to analyze', 'danger');
        return;
      }
      
      // Validate crop type
      if (cropSelect.value === '') {
        e.preventDefault();
        showNotification('Please select a crop type', 'danger');
        return;
      }
      
      // Validate custom crop input if "Other" is selected
      if (cropSelect.value === 'other' && (!customCropInput.value || customCropInput.value.trim() === '')) {
        e.preventDefault();
        showNotification('Please enter the crop type', 'danger');
        return;
      }
      
      // If we're offline, prevent form submission and show notification
      if (!navigator.onLine) {
        e.preventDefault();
        showNotification('Cannot perform disease detection while offline. Please try again when you have an internet connection.', 'warning');
        return;
      }
      
      // If all validations pass, show loading state
      const submitButton = this.querySelector('button[type="submit"]');
      if (submitButton) {
        submitButton.disabled = true;
        submitButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Analyzing...';
      }
    });
  }
});

/**
 * Render confidence meter
 */
function renderConfidenceMeter(confidenceValue) {
  const confidenceMeters = document.querySelectorAll('.confidence-meter');
  
  confidenceMeters.forEach(meter => {
    const valueBar = meter.querySelector('.confidence-value');
    const confidenceText = meter.parentElement.querySelector('.confidence-text');
    
    if (valueBar && confidenceText) {
      // Set the width of the confidence bar
      valueBar.style.width = (confidenceValue * 100) + '%';
      
      // Update the text
      confidenceText.textContent = 'Confidence: ' + (confidenceValue * 100).toFixed(1) + '%';
      
      // Set color based on confidence value
      if (confidenceValue >= 0.8) {
        valueBar.style.backgroundColor = '#4caf50'; // Green for high confidence
      } else if (confidenceValue >= 0.6) {
        valueBar.style.backgroundColor = '#ff9800'; // Orange for medium confidence
      } else {
        valueBar.style.backgroundColor = '#f44336'; // Red for low confidence
      }
    }
  });
}

// Initialize confidence meters if they exist on the page
document.addEventListener('DOMContentLoaded', function() {
  const diagnosisResult = document.getElementById('diagnosis-result');
  
  if (diagnosisResult) {
    const confidenceValue = parseFloat(diagnosisResult.getAttribute('data-confidence') || 0);
    if (!isNaN(confidenceValue)) {
      renderConfidenceMeter(confidenceValue);
    }
  }
});
