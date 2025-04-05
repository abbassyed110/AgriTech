/**
 * AgriTech Platform - Main JavaScript File
 * Handles common functionality across all pages
 */

// Check if the browser supports service workers for offline functionality
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/static/js/offline.js').then(registration => {
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
    }, err => {
      console.log('ServiceWorker registration failed: ', err);
    });
  });
}

// DOM ready function
document.addEventListener('DOMContentLoaded', function() {
  // Initialize tooltips
  const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
  tooltipTriggerList.map(function(tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
  });

  // Check network status and display offline notification
  function updateOnlineStatus() {
    const notification = document.getElementById('offline-notification');
    if (!notification) return;

    if (navigator.onLine) {
      notification.classList.remove('show');
      // Sync data with server if we came back online
      if (notification.classList.contains('was-offline')) {
        syncOfflineData();
        notification.classList.remove('was-offline');
      }
    } else {
      notification.classList.add('show');
      notification.classList.add('was-offline');
    }
  }

  window.addEventListener('online', updateOnlineStatus);
  window.addEventListener('offline', updateOnlineStatus);
  updateOnlineStatus(); // Initial check

  // Handle language selection
  const languageSelector = document.getElementById('language-selector');
  if (languageSelector) {
    languageSelector.addEventListener('change', function() {
      window.location.href = `/set_language/${this.value}`;
    });
  }

  // Flash message auto-dismiss
  const flashMessages = document.querySelectorAll('.alert');
  flashMessages.forEach(message => {
    if (!message.classList.contains('alert-persistent')) {
      setTimeout(() => {
        message.classList.add('fade-out');
        setTimeout(() => {
          message.remove();
        }, 500);
      }, 5000);
    }
  });

  // Add animation to cards
  const animatedCards = document.querySelectorAll('.card.animate-on-scroll');
  if (animatedCards.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    animatedCards.forEach(card => {
      observer.observe(card);
    });
  }

  // Handle form validation
  const forms = document.querySelectorAll('.needs-validation');
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
      }
      form.classList.add('was-validated');
    }, false);
  });
});

/**
 * Synchronizes data stored locally while offline
 */
function syncOfflineData() {
  if (typeof localStorage !== 'undefined') {
    // Check if we have offline data to sync
    const offlineData = localStorage.getItem('offlineData');
    if (offlineData) {
      try {
        const data = JSON.parse(offlineData);
        // Process each type of offline data
        if (data.cropNotes && data.cropNotes.length > 0) {
          syncCropNotes(data.cropNotes);
        }
        
        if (data.marketplaceInterests && data.marketplaceInterests.length > 0) {
          syncMarketplaceInterests(data.marketplaceInterests);
        }
        
        // Clear the offline data after syncing
        localStorage.removeItem('offlineData');
      } catch (error) {
        console.error('Error syncing offline data:', error);
      }
    }
  }
}

/**
 * Syncs offline crop notes with the server
 */
function syncCropNotes(notes) {
  notes.forEach(note => {
    fetch('/update_crop/' + note.cropId, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        'notes': note.notes,
        'status': note.status
      })
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      console.log('Synced crop note for crop ID:', note.cropId);
    })
    .catch(error => {
      console.error('Error syncing crop note:', error);
    });
  });
}

/**
 * Syncs offline marketplace interests with the server
 */
function syncMarketplaceInterests(interests) {
  interests.forEach(interest => {
    fetch('/express_interest/' + interest.listingId, {
      method: 'POST'
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      console.log('Synced interest for listing ID:', interest.listingId);
    })
    .catch(error => {
      console.error('Error syncing marketplace interest:', error);
    });
  });
}

/**
 * Shows a notification to the user
 */
function showNotification(message, type = 'info') {
  const notificationContainer = document.getElementById('notification-container');
  if (!notificationContainer) return;
  
  const notification = document.createElement('div');
  notification.className = `alert alert-${type} alert-dismissible fade show`;
  notification.innerHTML = `
    ${message}
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  `;
  
  notificationContainer.appendChild(notification);
  
  // Auto dismiss after 5 seconds
  setTimeout(() => {
    notification.classList.add('fade-out');
    setTimeout(() => {
      notification.remove();
    }, 500);
  }, 5000);
}

/**
 * Format a date for display
 */
function formatDate(dateString) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

/**
 * Create a loading spinner
 */
function createLoadingSpinner() {
  const spinner = document.createElement('div');
  spinner.className = 'spinner-border text-primary';
  spinner.setAttribute('role', 'status');
  spinner.innerHTML = '<span class="visually-hidden">Loading...</span>';
  return spinner;
}

/**
 * Add to offline storage
 */
function addToOfflineStorage(key, data) {
  if (typeof localStorage !== 'undefined') {
    let offlineData = localStorage.getItem('offlineData');
    let dataObj = {};
    
    if (offlineData) {
      try {
        dataObj = JSON.parse(offlineData);
      } catch (error) {
        console.error('Error parsing offline data:', error);
        dataObj = {};
      }
    }
    
    if (!dataObj[key]) {
      dataObj[key] = [];
    }
    
    dataObj[key].push(data);
    localStorage.setItem('offlineData', JSON.stringify(dataObj));
    
    // Show offline storage notification
    showNotification('Data saved locally. Will sync when you\'re back online.', 'warning');
  }
}
