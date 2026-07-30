const CACHE = "corse2026-v21";
const ASSETS = [
  "./",
  "./index.html",
  "./alt.html",
  "./assets/styles.css",
  "./assets/app.js",
  "./assets/alt-boot.js",
  "./assets/vendor/leaflet.js",
  "./assets/vendor/leaflet.css",
  "./assets/images/hero-desktop.jpg",
  "./assets/images/hero-mobile.jpg",
  "./data/trip.js",
  "./data/alt-programme.js",
  "./data/budget.js",
  "./manifest.webmanifest",
  "./icons/icon.svg",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  event.respondWith(
    caches.match(request).then((cached) => {
      const fetched = fetch(request)
        .then((response) => {
          if (response && response.status === 200 && (response.type === "basic" || response.type === "cors")) {
            const clone = response.clone();
            caches.open(CACHE).then((cache) => cache.put(request, clone));
          }
          return response;
        })
        .catch(() => cached);
      return cached || fetched;
    })
  );
});
