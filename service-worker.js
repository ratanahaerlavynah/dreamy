/* Dreamy’s ultra-light Service Worker — v1 */
const CACHE      = "dreamy-cache-v1";
const OFFLINE_URL = "/offline.html";        // crée une petite page HTML de secours

const PRECACHE = [
    "/",
    "/assets/style.v1.css",
    "/assets/fonts/italianoregular.woff2",
    "/assets/img/banner-home.v1.webp",
    "/manifest.webmanifest",          // ← chemin mis à jour
    OFFLINE_URL
  ];
  

/* INSTALL — pré-cache les fichiers essentiels */
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(PRECACHE))
  );
  self.skipWaiting();
});

/* ACTIVATE — nettoie les vieux caches */
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

/* FETCH — Cache → Network → Offline fallback */
self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then(cached =>
      cached ||
      fetch(event.request)
        .then(res => {
          /** Clone & store en tâche de fond */
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(event.request, copy));
          return res;
        })
        .catch(() => {
          /* Si offline et demande d’un document → page de secours */
          if (event.request.destination === "document") {
            return caches.match(OFFLINE_URL);
          }
        })
    )
  );
});
