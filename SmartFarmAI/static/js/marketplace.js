/**
 * AgriTech Platform - Marketplace JavaScript
 * Handles marketplace-specific functionality
 */

document.addEventListener('DOMContentLoaded', function() {
  // Initialize marketplace filters
  initializeFilters();
  
  // Setup Add Listing form
  setupAddListingForm();
  
  // Setup Update Listing forms
  setupUpdateListingForms();
  
  // Setup contact seller buttons
  setupContactSellerButtons();
});

/**
 * Initialize marketplace filters
 */
function initializeFilters() {
  const filterForm = document.getElementById('marketplace-filter-form');
  if (!filterForm) return;
  
  // Handle filter form submission
  filterForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const cropType = document.getElementById('filter-crop-type').value;
    const location = document.getElementById('filter-location').value;
    const minPrice = document.getElementById('filter-min-price').value;
    const maxPrice = document.getElementById('filter-max-price').value;
    
    // Apply filters to the listings
    filterListings(cropType, location, minPrice, maxPrice);
  });
  
  // Handle reset filters button
  const resetButton = document.getElementById('reset-filters');
  if (resetButton) {
    resetButton.addEventListener('click', function() {
      filterForm.reset();
      // Show all listings
      document.querySelectorAll('.product-card').forEach(card => {
        card.style.display = 'block';
      });
    });
  }
}

/**
 * Filter marketplace listings based on selected criteria
 */
function filterListings(cropType, location, minPrice, maxPrice) {
  const listings = document.querySelectorAll('.product-card');
  
  listings.forEach(listing => {
    const listingCropType = listing.getAttribute('data-crop-type').toLowerCase();
    const listingLocation = listing.getAttribute('data-location').toLowerCase();
    const listingPrice = parseFloat(listing.getAttribute('data-price'));
    
    let shouldShow = true;
    
    // Filter by crop type
    if (cropType && cropType !== 'all') {
      shouldShow = shouldShow && listingCropType.includes(cropType.toLowerCase());
    }
    
    // Filter by location
    if (location && location.trim() !== '') {
      shouldShow = shouldShow && listingLocation.includes(location.toLowerCase());
    }
    
    // Filter by minimum price
    if (minPrice && !isNaN(minPrice)) {
      shouldShow = shouldShow && listingPrice >= parseFloat(minPrice);
    }
    
    // Filter by maximum price
    if (maxPrice && !isNaN(maxPrice)) {
      shouldShow = shouldShow && listingPrice <= parseFloat(maxPrice);
    }
    
    // Show or hide the listing
    listing.style.display = shouldShow ? 'block' : 'none';
  });
  
  // Show message if no results
  const noResults = document.getElementById('no-results-message');
  if (noResults) {
    const visibleListings = document.querySelectorAll('.product-card[style="display: block"]');
    noResults.style.display = visibleListings.length === 0 ? 'block' : 'none';
  }
}

/**
 * Setup the add listing form
 */
function setupAddListingForm() {
  const addListingForm = document.getElementById('add-listing-form');
  if (!addListingForm) return;
  
  // Handle form submission
  addListingForm.addEventListener('submit', function(e) {
    if (!this.checkValidity()) {
      e.preventDefault();
      e.stopPropagation();
      this.classList.add('was-validated');
      return;
    }
    
    if (!navigator.onLine) {
      e.preventDefault();
      
      // Save the form data locally to submit later
      const formData = new FormData(this);
      const listingData = {
        cropName: formData.get('crop_name'),
        quantity: formData.get('quantity'),
        unit: formData.get('unit'),
        pricePerUnit: formData.get('price_per_unit'),
        description: formData.get('description'),
        location: formData.get('location'),
        timestamp: new Date().toISOString()
      };
      
      addToOfflineStorage('pendingListings', listingData);
      
      // Close the modal
      const modal = document.getElementById('add-listing-modal');
      const modalInstance = bootstrap.Modal.getInstance(modal);
      modalInstance.hide();
      
      // Show notification
      showNotification('Listing saved locally. It will be submitted when you\'re back online.', 'warning');
    }
  });
  
  // Handle quantity and price input validation
  const quantityInput = document.getElementById('quantity');
  const priceInput = document.getElementById('price-per-unit');
  
  if (quantityInput) {
    quantityInput.addEventListener('input', function() {
      this.value = this.value.replace(/[^0-9.]/g, '');
    });
  }
  
  if (priceInput) {
    priceInput.addEventListener('input', function() {
      this.value = this.value.replace(/[^0-9.]/g, '');
    });
  }
}

/**
 * Setup the update listing forms
 */
function setupUpdateListingForms() {
  const updateForms = document.querySelectorAll('.update-listing-form');
  
  updateForms.forEach(form => {
    // Get the listing ID
    const listingId = form.getAttribute('data-listing-id');
    
    // Handle form submission
    form.addEventListener('submit', function(e) {
      if (!this.checkValidity()) {
        e.preventDefault();
        e.stopPropagation();
        this.classList.add('was-validated');
        return;
      }
      
      if (!navigator.onLine) {
        e.preventDefault();
        
        // Save the form data locally to submit later
        const formData = new FormData(this);
        const listingData = {
          listingId: listingId,
          quantity: formData.get('quantity'),
          pricePerUnit: formData.get('price_per_unit'),
          description: formData.get('description'),
          isActive: formData.has('is_active'),
          timestamp: new Date().toISOString()
        };
        
        addToOfflineStorage('pendingListingUpdates', listingData);
        
        // Close the modal
        const modal = document.querySelector(`.update-listing-modal[data-listing-id="${listingId}"]`);
        const modalInstance = bootstrap.Modal.getInstance(modal);
        modalInstance.hide();
        
        // Show notification
        showNotification('Listing update saved locally. It will be submitted when you\'re back online.', 'warning');
      }
    });
  });
}

/**
 * Setup contact seller buttons
 */
function setupContactSellerButtons() {
  const contactButtons = document.querySelectorAll('.contact-seller-btn');
  
  contactButtons.forEach(button => {
    button.addEventListener('click', function() {
      const sellerId = this.getAttribute('data-seller-id');
      const listingId = this.getAttribute('data-listing-id');
      const cropName = this.getAttribute('data-crop-name');
      
      // Save interest in the listing if offline
      if (!navigator.onLine) {
        addToOfflineStorage('marketplaceInterests', {
          listingId: listingId,
          timestamp: new Date().toISOString()
        });
        showNotification('Your interest has been saved locally. The seller will be notified when you\'re back online.', 'warning');
        return;
      }
      
      // Otherwise, send interest to the server
      fetch(`/express_interest/${listingId}`, {
        method: 'POST'
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        if (data.success) {
          showNotification(data.message || 'Interest sent successfully! The seller will contact you soon.', 'success');
          
          // Update button state
          this.disabled = true;
          this.textContent = 'Interest Sent';
          this.classList.remove('btn-primary');
          this.classList.add('btn-success');
        } else {
          showNotification(data.message || 'Failed to send interest.', 'danger');
        }
      })
      .catch(error => {
        console.error('Error expressing interest:', error);
        showNotification('Error sending interest. Please try again.', 'danger');
      });
    });
  });
}

/**
 * Sort marketplace listings
 */
function sortListings(sortBy) {
  const listingsContainer = document.getElementById('marketplace-listings');
  if (!listingsContainer) return;
  
  const listings = Array.from(document.querySelectorAll('.product-card'));
  
  listings.sort((a, b) => {
    if (sortBy === 'price-asc') {
      return parseFloat(a.getAttribute('data-price')) - parseFloat(b.getAttribute('data-price'));
    } else if (sortBy === 'price-desc') {
      return parseFloat(b.getAttribute('data-price')) - parseFloat(a.getAttribute('data-price'));
    } else if (sortBy === 'date-newest') {
      return new Date(b.getAttribute('data-date')) - new Date(a.getAttribute('data-date'));
    } else if (sortBy === 'date-oldest') {
      return new Date(a.getAttribute('data-date')) - new Date(b.getAttribute('data-date'));
    }
  });
  
  // Clear container
  listingsContainer.innerHTML = '';
  
  // Add sorted listings back
  listings.forEach(listing => {
    listingsContainer.appendChild(listing);
  });
}

// Handle sort dropdown
document.addEventListener('DOMContentLoaded', function() {
  const sortOptions = document.querySelectorAll('.sort-option');
  
  sortOptions.forEach(option => {
    option.addEventListener('click', function() {
      const sortBy = this.getAttribute('data-sort');
      sortListings(sortBy);
      
      // Update dropdown button text
      const sortButton = document.getElementById('sort-dropdown-btn');
      if (sortButton) {
        sortButton.textContent = this.textContent;
      }
    });
  });
});
