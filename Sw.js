const staticCacheName = 'my-pwa-v1';

// Cache necessary resources upon installation
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(staticCacheName)
      .then(cache => {
        return cache.addAll([ 
            'styles.css',
            'script.js',
            'business.html',
            'BUSINESS/page/data/data/1/media/business.png',
            'BUSINESS/page/data/data/1/media/ls.jpg',
            'BUSINESS/page/data/data/1/media/New Yerk.jpg',
            'BUSINESS/page/data/data/1/media/sf.jpg',
            'icon.png',
            'https://fonts.googleapis.com/icon?family=Material+Icons',
            'https://fonts.googleapis.com/css2?family=Ubuntu&display=swap'
        ]);
      })
  );
});

// Intercept network requests and serve cached content if available
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
  );
});
