/**
 * Service Worker for WaveLaunch Studio PWA
 */

const CACHE_VERSION = "v1.0.0";
const CACHE_NAME = `wavelaunch-${CACHE_VERSION}`;

// Assets to cache on install
const STATIC_ASSETS = [
  "/",
  "/dashboard",
  "/offline",
  "/manifest.json",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png",
];

// API endpoints to cache (with network-first strategy)
const API_CACHE_PATTERNS = [
  "/api/projects",
  "/api/user",
  "/api/notifications",
];

// Install event - cache static assets
self.addEventListener("install", (event) => {
  console.log("[SW] Installing service worker");

  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log("[SW] Caching static assets");
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  console.log("[SW] Activating service worker");

  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => name !== CACHE_NAME)
            .map((name) => {
              console.log("[SW] Deleting old cache:", name);
              return caches.delete(name);
            })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache or network
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== "GET") {
    return;
  }

  // Handle API requests (network-first)
  if (url.pathname.startsWith("/api/")) {
    event.respondWith(networkFirst(request));
    return;
  }

  // Handle navigation requests (network-first with offline fallback)
  if (request.mode === "navigate") {
    event.respondWith(networkFirstWithOffline(request));
    return;
  }

  // Handle static assets (cache-first)
  event.respondWith(cacheFirst(request));
});

/**
 * Cache-first strategy (for static assets)
 */
async function cacheFirst(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);

  if (cached) {
    return cached;
  }

  try {
    const response = await fetch(request);

    // Cache successful responses
    if (response.ok) {
      cache.put(request, response.clone());
    }

    return response;
  } catch (error) {
    console.error("[SW] Fetch failed:", error);
    return new Response("Network error", { status: 503 });
  }
}

/**
 * Network-first strategy (for API calls)
 */
async function networkFirst(request) {
  const cache = await caches.open(CACHE_NAME);

  try {
    const response = await fetch(request);

    // Cache successful responses
    if (response.ok) {
      cache.put(request, response.clone());
    }

    return response;
  } catch (error) {
    console.log("[SW] Network failed, trying cache");

    const cached = await cache.match(request);

    if (cached) {
      return cached;
    }

    return new Response(JSON.stringify({ error: "Offline" }), {
      status: 503,
      headers: { "Content-Type": "application/json" },
    });
  }
}

/**
 * Network-first with offline fallback (for navigation)
 */
async function networkFirstWithOffline(request) {
  try {
    const response = await fetch(request);
    return response;
  } catch (error) {
    console.log("[SW] Navigation failed, showing offline page");

    const cache = await caches.open(CACHE_NAME);
    const offline = await cache.match("/offline");

    if (offline) {
      return offline;
    }

    return new Response("Offline", { status: 503 });
  }
}

// Background sync for failed requests
self.addEventListener("sync", (event) => {
  if (event.tag === "sync-requests") {
    event.waitUntil(syncRequests());
  }
});

async function syncRequests() {
  console.log("[SW] Syncing failed requests");

  // Get failed requests from IndexedDB
  // Retry sending them
  // This would require IndexedDB implementation
}

// Push notifications
self.addEventListener("push", (event) => {
  const data = event.data?.json() || {};

  const title = data.title || "WaveLaunch Studio";
  const options = {
    body: data.body || "You have a new notification",
    icon: "/icons/icon-192x192.png",
    badge: "/icons/badge-72x72.png",
    vibrate: [200, 100, 200],
    data: data.url || "/dashboard",
    actions: [
      {
        action: "open",
        title: "Open",
      },
      {
        action: "close",
        title: "Close",
      },
    ],
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// Notification click
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  if (event.action === "open" || !event.action) {
    const url = event.notification.data || "/dashboard";

    event.waitUntil(
      clients.openWindow(url)
    );
  }
});

// Message handler (for cache invalidation, etc.)
self.addEventListener("message", (event) => {
  if (event.data?.type === "SKIP_WAITING") {
    self.skipWaiting();
  }

  if (event.data?.type === "CLEAR_CACHE") {
    event.waitUntil(
      caches.delete(CACHE_NAME).then(() => {
        return self.clients.matchAll();
      }).then((clients) => {
        clients.forEach((client) => {
          client.postMessage({ type: "CACHE_CLEARED" });
        });
      })
    );
  }
});
