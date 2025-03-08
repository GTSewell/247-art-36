
// Cache name version
const CACHE_NAME = 'zap-underground-v2';

// Files to cache - include essential app files and assets
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/icons/apple-touch-icon.png',
  '/assets/index.css', // Main CSS
  '/assets/index.js',  // Main JS
  '/artists'           // Artists route
];

// Install service worker
self.addEventListener('install', event => {
  console.log('[ServiceWorker] Install');
  // Force waiting ServiceWorker to become active
  self.skipWaiting();
  
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[ServiceWorker] Caching app shell');
        return cache.addAll(urlsToCache);
      })
      .catch(error => {
        console.error('[ServiceWorker] Cache install error:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('[ServiceWorker] Activate');
  
  // Take control of all clients immediately
  event.waitUntil(self.clients.claim());
  
  // Remove old caches
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('[ServiceWorker] Clearing old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch event - use network first, fall back to cache
self.addEventListener('fetch', event => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }
  
  // Network first strategy with cache fallback
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Check if we received a valid response
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }
        
        // Clone the response
        const responseToCache = response.clone();
        
        // Open cache and store response
        caches.open(CACHE_NAME)
          .then(cache => {
            cache.put(event.request, responseToCache);
          })
          .catch(err => {
            console.error('[ServiceWorker] Cache update error:', err);
          });
        
        return response;
      })
      .catch(() => {
        // Try to get the resource from cache if network fails
        return caches.match(event.request)
          .then(cachedResponse => {
            if (cachedResponse) {
              console.log('[ServiceWorker] Serving from cache:', event.request.url);
              return cachedResponse;
            }
            
            // For navigation requests, return the cached index.html
            if (event.request.mode === 'navigate') {
              return caches.match('/index.html');
            }
            
            return new Response('Network error', { status: 408, headers: { 'Content-Type': 'text/plain' } });
          });
      })
  );
});

// Handle messages from clients
self.addEventListener('message', event => {
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
  }
});
