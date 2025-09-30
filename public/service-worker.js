// Campus SARTHI Service Worker
const CACHE_NAME = "campus-sarthi-v1"
const STATIC_CACHE = "campus-sarthi-static-v1"
const DYNAMIC_CACHE = "campus-sarthi-dynamic-v1"

// Assets to cache on install
const STATIC_ASSETS = ["/", "/chat", "/manifest.json", "/icon-192.jpg", "/icon-512.jpg"]

// Install event - cache static assets
self.addEventListener("install", (event) => {
  console.log("[Service Worker] Installing...")
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      console.log("[Service Worker] Caching static assets")
      return cache.addAll(STATIC_ASSETS).catch((error) => {
        console.error("[Service Worker] Failed to cache:", error)
      })
    }),
  )
  self.skipWaiting()
})

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  console.log("[Service Worker] Activating...")
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
            console.log("[Service Worker] Deleting old cache:", cacheName)
            return caches.delete(cacheName)
          }
        }),
      )
    }),
  )
  self.clients.claim()
})

// Fetch event - serve from cache, fallback to network
self.addEventListener("fetch", (event) => {
  const { request } = event

  // Skip non-GET requests
  if (request.method !== "GET") {
    return
  }

  // Skip chrome extensions and other protocols
  if (!request.url.startsWith("http")) {
    return
  }

  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        // Return cached response and update cache in background
        event.waitUntil(updateCache(request))
        return cachedResponse
      }

      // Not in cache, fetch from network
      return fetch(request)
        .then((response) => {
          // Don't cache non-successful responses
          if (!response || response.status !== 200 || response.type === "error") {
            return response
          }

          // Clone the response
          const responseToCache = response.clone()

          // Cache dynamic content
          caches.open(DYNAMIC_CACHE).then((cache) => {
            cache.put(request, responseToCache)
          })

          return response
        })
        .catch((error) => {
          console.error("[Service Worker] Fetch failed:", error)
          // Return offline page if available
          return caches.match("/offline.html")
        })
    }),
  )
})

// Update cache in background
async function updateCache(request) {
  try {
    const response = await fetch(request)
    if (response && response.status === 200) {
      const cache = await caches.open(DYNAMIC_CACHE)
      cache.put(request, response)
    }
  } catch (error) {
    console.error("[Service Worker] Cache update failed:", error)
  }
}

// Handle messages from clients
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting()
  }
})

// Background sync for offline messages
self.addEventListener("sync", (event) => {
  if (event.tag === "sync-messages") {
    event.waitUntil(syncMessages())
  }
})

async function syncMessages() {
  // TODO: Sync offline messages when connection is restored
  console.log("[Service Worker] Syncing messages...")
}

// Push notifications
self.addEventListener("push", (event) => {
  const data = event.data ? event.data.json() : {}
  const title = data.title || "Campus SARTHI"
  const options = {
    body: data.body || "You have a new notification",
    icon: "/icon-192.jpg",
    badge: "/icon-192.jpg",
    data: data.url || "/",
  }

  event.waitUntil(self.registration.showNotification(title, options))
})

// Notification click
self.addEventListener("notificationclick", (event) => {
  event.notification.close()
  event.waitUntil(clients.openWindow(event.notification.data || "/"))
})
