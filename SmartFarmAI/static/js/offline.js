/**
 * AgriTech Platform - Service Worker for Offline Functionality
 */

// Files to cache
const CACHE_NAME = 'agritech-cache-v1';
const OFFLINE_URL = '/offline.html';

const ASSETS_TO_CACHE = [
  '/',
  '/static/css/style.css',
  '/static/js/main.js',
  '/static/js/translations.js',
  '/static/js/offline.js',
  OFFLINE_URL
];

// Install service worker and cache assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Caching app shell and content');
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .then(() => {
        return self.skipWaiting();
      })
  );
});

// Activate service worker and clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.filter((cacheName) => {
          return cacheName !== CACHE_NAME;
        }).map((cacheName) => {
          console.log('Deleting old cache:', cacheName);
          return caches.delete(cacheName);
        })
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

// Fetch resources from cache or network
self.addEventListener('fetch', (event) => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }
  
  // For navigation requests (HTML pages), use network-first strategy
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          return caches.match(OFFLINE_URL);
        })
    );
    return;
  }
  
  // For non-navigation requests (assets), use cache-first strategy
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached response if found
        if (response) {
          return response;
        }
        
        // If not in cache, fetch from network
        return fetch(event.request)
          .then((response) => {
            // Check if we received a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // Clone the response as it can only be consumed once
            const responseToCache = response.clone();
            
            // Cache the new resource
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });
            
            return response;
          })
          .catch(() => {
            // If both cache and network fail, show offline content
            if (event.request.headers.get('accept').includes('text/html')) {
              return caches.match(OFFLINE_URL);
            }
            
            // For other resources, just fail
            return new Response('Not available offline', {
              status: 503,
              statusText: 'Service Unavailable',
              headers: new Headers({
                'Content-Type': 'text/plain'
              })
            });
          });
      })
  );
});

// Sync background data when coming back online
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-offline-data') {
    event.waitUntil(syncOfflineData());
  }
});

// Handle push notifications for weather alerts
self.addEventListener('push', (event) => {
  if (!event.data) {
    return;
  }
  
  const data = event.data.json();
  const options = {
    body: data.message,
    icon: '/static/images/logo-192x192.png',
    badge: '/static/images/badge-72x72.png',
    data: {
      url: data.url || '/'
    }
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  event.waitUntil(
    clients.openWindow(event.notification.data.url)
  );
});

/**
 * Function to sync offline data with the server
 */
async function syncOfflineData() {
  try {
    // Get offline data from IndexedDB or localStorage
    // and send it to the server
    const offlineData = localStorage.getItem('offlineData');
    
    if (offlineData) {
      const data = JSON.parse(offlineData);
      
      // Process each type of offline data
      if (data.cropNotes && data.cropNotes.length > 0) {
        for (const note of data.cropNotes) {
          await fetch('/update_crop/' + note.cropId, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
              'notes': note.notes,
              'status': note.status
            })
          });
        }
      }
      
      if (data.marketplaceInterests && data.marketplaceInterests.length > 0) {
        for (const interest of data.marketplaceInterests) {
          await fetch('/express_interest/' + interest.listingId, {
            method: 'POST'
          });
        }
      }
      
      if (data.pendingListings && data.pendingListings.length > 0) {
        for (const listing of data.pendingListings) {
          await fetch('/add_listing', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
              'crop_name': listing.cropName,
              'quantity': listing.quantity,
              'unit': listing.unit,
              'price_per_unit': listing.pricePerUnit,
              'description': listing.description,
              'location': listing.location
            })
          });
        }
      }
      
      // Clear the offline data after successful sync
      localStorage.removeItem('offlineData');
      
      // Notify the user
      self.registration.showNotification('Sync Complete', {
        body: 'Your offline changes have been synchronized successfully.',
        icon: '/static/images/logo-192x192.png'
      });
    }
  } catch (error) {
    console.error('Sync failed:', error);
    
    // Notify the user of sync failure
    self.registration.showNotification('Sync Failed', {
      body: 'We couldn\'t sync your changes. Will try again later.',
      icon: '/static/images/logo-192x192.png'
    });
  }
}
