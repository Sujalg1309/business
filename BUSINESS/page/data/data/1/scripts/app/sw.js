const CACHE_NAME = 'business-tycoon-cache-v1';
const urlsToCache = [
  '/business.html',
  '/style.css',
  '/styles.css',
  '/manifest.json',
  '/BUSINESS/page/data/data/1/media/business.png',
  '/BUSINESS/page/data/data/1/media/ls.png',
  '/BUSINESS/page/data/data/1/media/sf.png',
  '/BUSINESS/page/data/data/1/media/New York.jpg',
  '/BUSINESS/page/data/data/1/media/ls.png',
  'BUSINESS/page/data/data/1/scripts/script.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return the response from the cached version
        if (response) {
          return response;
        }

        // Not in cache - fetch and cache the response from the network
        return fetch(event.request)
          .then((response) => {
            // Check if we received a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response and cache it
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return response;
          });
      })
  );
});

self.addEventListener('activate', (event) => {
  // Clean up old caches
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
