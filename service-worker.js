const CACHE_NAME = "campusmart-cache-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/style.css",
  "/index.js",
  "/manifest.json",
  "/ekd-logo.png"
];

// Install service worker and cache files
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

// Intercept fetch requests
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request).catch(() => {
        return new Response("⚠️ Offline or resource not found", {
          status: 404,
          headers: { "Content-Type": "text/plain" }
        });
      });
    })
  );
});

// Optionally log cache errors
caches.open(CACHE_NAME)
  .then(cache => cache.addAll(urlsToCache))
  .catch(err => console.error("❌ Caching failed:", err));
