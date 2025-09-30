export function registerServiceWorker() {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
    return
  }

  window.addEventListener("load", async () => {
    try {
      const registration = await navigator.serviceWorker.register("/service-worker.js")
      console.log("Service Worker registered:", registration.scope)

      // Check for updates
      registration.addEventListener("updatefound", () => {
        const newWorker = registration.installing
        if (newWorker) {
          newWorker.addEventListener("statechange", () => {
            if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
              // New service worker available
              if (confirm("New version available! Reload to update?")) {
                newWorker.postMessage({ type: "SKIP_WAITING" })
                window.location.reload()
              }
            }
          })
        }
      })
    } catch (error) {
      console.error("Service Worker registration failed:", error)
    }
  })

  // Handle controller change
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    window.location.reload()
  })
}

export function unregisterServiceWorker() {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
    return
  }

  navigator.serviceWorker.getRegistrations().then((registrations) => {
    for (const registration of registrations) {
      registration.unregister()
    }
  })
}

export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!("Notification" in window)) {
    return "denied"
  }

  if (Notification.permission === "granted") {
    return "granted"
  }

  if (Notification.permission !== "denied") {
    const permission = await Notification.requestPermission()
    return permission
  }

  return Notification.permission
}

export function isStandalone(): boolean {
  if (typeof window === "undefined") return false

  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as any).standalone ||
    document.referrer.includes("android-app://")
  )
}

export function getInstallPrompt() {
  if (typeof window === "undefined") return null

  return (window as any).deferredPrompt
}

export function setInstallPrompt(prompt: any) {
  if (typeof window === "undefined") return
  ;(window as any).deferredPrompt = prompt
}
