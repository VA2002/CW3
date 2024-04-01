const cacheName = "strawgoh-cw3";

const cacheFiles = [
  "index.html", 
  "thelogo.png", 
  "applogo.png",
  "main.js",
  "strawgoh.webmanifest",
  "../server.js", // Specify the correct path to server.js
  // "../src/App.vue",
  // "../src/components/Cart.vue",
  // "../src/components/Checkout.vue",
  // "../src/components/Lesson.vue",
];

self.addEventListener("install", e => {
  console.log("Service Worker installed");

  e.waitUntil(
    caches.open(cacheName).then(cache => {
      console.log("Caching files");
      cache.addAll(cacheFiles);
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", e => {
  console.log("Service Worker activated");
  e.waitUntil(
    caches.keys().then(cacheNames => {
        return Promise.all(cache => {
          if(cache !== cacheName) {
              console.log("Clearing old cache")
              return caches.delete(cache);
          }
        })
    })
  );
});

self.addEventListener('fetch', e => {
    console.log('Service Worker fetching');
    e.respondWith(
        fetch(e.request).catch(() => caches.match(e.request))
    )
})