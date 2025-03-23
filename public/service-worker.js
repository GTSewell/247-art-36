// Cache name version - increased to force refresh
const CACHE_NAME = '247-art-v7'; // Bumped version to force cache refresh

// Files to cache - include essential app files and assets
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/lovable-uploads/15e8cb31-73b1-4d72-9d9b-0dac8bf0baed.png',
  '/lovable-uploads/c54f87f7-7b02-4bc8-999b-f5a580ad369e.png',
  '/lovable-uploads/76b5d6f8-fc72-47b1-91da-29d7af2c0e97.png',
  '/favicon.ico'
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

// Special handling for navigation requests in standalone mode
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;

  // For PWA critical resources (manifest and icons), use network-first approach
  if (url.pathname.includes('/lovable-uploads/') || 
      url.pathname.includes('favicon.ico') || 
      url.pathname.includes('manifest.json')) {
    event.respondWith(
      fetch(event.request, { cache: 'no-cache' })
        .then(response => {
          // Clone the response
          const responseToCache = response.clone();
          
          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseToCache);
            });
            
          return response;
        })
        .catch(() => {
          return caches.match(event.request);
        })
    );
    return;
  }
  
  // For navigation requests, always try network first with no cache
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request, { cache: 'no-cache' })
        .catch(() => {
          return caches.match('/index.html');
        })
    );
    return;
  }
  
  // For other requests, use network-first strategy with cache fallback
  event.respondWith(
    fetch(event.request, { cache: 'no-cache' })
      .then(response => {
        // Check if we received a valid response
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }
        
        // Clone the response
        const responseToCache = response.clone();
        
        caches.open(CACHE_NAME)
          .then(cache => {
            cache.put(event.request, responseToCache);
          });
          
        return response;
      })
      .catch(() => {
        // If network fetch fails, try the cache
        return caches.match(event.request)
          .then(cachedResponse => {
            if (cachedResponse) {
              return cachedResponse;
            }
            
            // Handle fallbacks for images
            if (event.request.destination === 'image') {
              return caches.match('/placeholder.svg');
            }
            
            return new Response('Network is unavailable', {
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

// Handle messages from clients
self.addEventListener('message', event => {
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
  } else if (event.data === 'clearCache') {
    // New handler for manually clearing the cache
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => caches.delete(cacheName))
      );
    }).then(() => {
      console.log('All caches cleared');
      // Notify the client that caches have been cleared
      if (event.source) {
        event.source.postMessage('cacheCleared');
      }
    });
  }
});
