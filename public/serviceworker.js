const CACHE_NAME = 'version-1';
const URLsToCache = ['index.html', 'offline.html'];

const self = this;

// Install SW
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Caches opened');
      return cache.addAll(URLsToCache);
    })
  );
});

// Listen for requests
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches
      .match(e.request)
      .then(() => fetch(e.request).catch(() => caches.match('offline.html')))
  );
});

// Activate SW
self.addEventListener('activate', (e) => {
  const cacheWhitelist = [];
  cacheWhitelist.push(CACHE_NAME);

  e.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      )
    )
  );
});
