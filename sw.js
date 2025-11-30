const CACHE_NAME = 'bozo-adventure-v3';

// Only pre-cache the absolute essentials (Shell)
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS);
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((names) => {
      return Promise.all(
        names.map((name) => {
          if (name !== CACHE_NAME) {
            return caches.delete(name);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;

  // Strategy: Network First, Fallback to Cache
  // This ensures fresh code/assets are loaded when online, but app works offline.
  // It also dynamically caches everything (including CDNs like Tailwind/Fonts).

  // 1. Navigation Requests (HTML)
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, response.clone());
            return response;
          });
        })
        .catch(() => {
          return caches.match(event.request).then((response) => {
             // If the specific page isn't cached, return the main index.html
             return response || caches.match('/index.html');
          });
        })
    );
    return;
  }

  // 2. All other requests (JS, CSS, Images, Fonts)
  event.respondWith(
    fetch(event.request)
      .then((response) => {
         // Ensure we got a valid response
         if (!response || response.status !== 200 || response.type === 'error') {
            return response;
         }
         
         const responseToCache = response.clone();
         caches.open(CACHE_NAME).then((cache) => {
           cache.put(event.request, responseToCache);
         });
         return response;
      })
      .catch(() => {
        // If network fails, try to return from cache
        return caches.match(event.request);
      })
  );
});