/* ============================================================
   SkyCast PWA — Service Worker (sw.js)
   ============================================================
   WHAT THIS FILE DOES:
   ┌──────────────────────────────────────────────────────┐
   │ 1. INSTALL   → Caches the app shell (HTML, fonts)    │
   │ 2. ACTIVATE  → Cleans up old caches                  │
   │ 3. FETCH     → Network-first for API, cache for app  │
   └──────────────────────────────────────────────────────┘
   CACHING STRATEGY:
   • App shell (HTML, fonts)  → Cache-first (fast loads)
   • Weather API requests     → Network-first (fresh data)
                                fallback to cache if offline
   ============================================================ */

const CACHE_NAME    = 'skycast-v1';
const API_CACHE     = 'skycast-api-v1';

/* Files to cache immediately on install (app shell) */
const SHELL_FILES = [
  '/index.html',
  '/manifest.json',
  'https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700&family=DM+Sans:wght@300;400;500&display=swap',
];

/* ============================================================
   INSTALL — pre-cache the app shell
   ============================================================ */
self.addEventListener('install', event => {
  console.log('[SW] Installing SkyCast service worker…');

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[SW] Caching app shell');
        return cache.addAll(SHELL_FILES);
      })
      .then(() => self.skipWaiting()) // activate immediately
  );
});

/* ============================================================
   ACTIVATE — clean up old caches
   ============================================================ */
self.addEventListener('activate', event => {
  console.log('[SW] Activating SkyCast service worker…');

  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(name => name !== CACHE_NAME && name !== API_CACHE)
          .map(name => {
            console.log('[SW] Deleting old cache:', name);
            return caches.delete(name);
          })
      );
    }).then(() => self.clients.claim()) // take control of all tabs
  );
});

/* ============================================================
   FETCH — intercept all network requests
   ============================================================ */
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  /* --- OpenWeatherMap API: Network-first, fallback to cache --- */
  if (url.hostname === 'api.openweathermap.org') {
    event.respondWith(networkFirstWithCache(event.request, API_CACHE));
    return;
  }

  /* --- Google Fonts: Cache-first (they rarely change) --- */
  if (url.hostname.includes('fonts.googleapis.com') ||
      url.hostname.includes('fonts.gstatic.com')) {
    event.respondWith(cacheFirstWithNetwork(event.request, CACHE_NAME));
    return;
  }

  /* --- App shell (HTML, manifest): Cache-first --- */
  if (url.pathname === '/' ||
      url.pathname.endsWith('.html') ||
      url.pathname.endsWith('.json') ||
      url.pathname.endsWith('.png')) {
    event.respondWith(cacheFirstWithNetwork(event.request, CACHE_NAME));
    return;
  }

  /* --- Everything else: normal network --- */
  event.respondWith(fetch(event.request));
});

/* ============================================================
   STRATEGY: Network-first, fallback to cache
   Best for: API data — always try fresh, use cache if offline
   ============================================================ */
async function networkFirstWithCache(request, cacheName) {
  const cache = await caches.open(cacheName);

  try {
    const networkResponse = await fetch(request);

    /* Cache a clone of the response for offline fallback */
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;

  } catch (err) {
    /* Network failed (offline) — try the cache */
    console.log('[SW] Network failed, trying cache for:', request.url);
    const cachedResponse = await cache.match(request);

    if (cachedResponse) {
      console.log('[SW] Serving from cache:', request.url);
      return cachedResponse;
    }

    /* Nothing in cache either — return an offline JSON response */
    return new Response(
      JSON.stringify({ error: 'offline', message: 'No cached data available' }),
      { status: 503, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

/* ============================================================
   STRATEGY: Cache-first, fallback to network
   Best for: app shell, fonts — load instantly, update in bg
   ============================================================ */
async function cacheFirstWithNetwork(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);

  if (cachedResponse) {
    /* Return cached version, but refresh in background */
    fetch(request).then(networkResponse => {
      if (networkResponse.ok) cache.put(request, networkResponse.clone());
    }).catch(() => {});

    return cachedResponse;
  }

  /* Not in cache — fetch from network and cache it */
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) cache.put(request, networkResponse.clone());
    return networkResponse;
  } catch (err) {
    console.warn('[SW] Cache and network both failed for:', request.url);
    throw err;
  }
}

/* ============================================================
   MESSAGE HANDLER — allow app to communicate with SW
   ============================================================
   Usage from app: navigator.serviceWorker.controller.postMessage({ type: 'SKIP_WAITING' })
*/
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
