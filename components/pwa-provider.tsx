"use client"

import type React from "react"

import { useEffect } from "react"
import { registerServiceWorker } from "@/lib/pwa"

export function PWAProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Register service worker
    registerServiceWorker()

    // Handle install prompt
    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault()
      ;(window as any).deferredPrompt = e
    })
  }, [])

  return <>{children}</>
}
