export const storage = {
  getItem: (key: string): string | null => {
    if (typeof window === "undefined") return null
    try {
      return localStorage.getItem(key)
    } catch {
      return null
    }
  },

  setItem: (key: string, value: string): void => {
    if (typeof window === "undefined") return
    try {
      localStorage.setItem(key, value)
    } catch (error) {
      console.error("Storage error:", error)
    }
  },

  removeItem: (key: string): void => {
    if (typeof window === "undefined") return
    try {
      localStorage.removeItem(key)
    } catch (error) {
      console.error("Storage error:", error)
    }
  },
}

export function getSessionId(): string {
  let sessionId = storage.getItem("campus-sarthi-session")
  if (!sessionId) {
    sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    storage.setItem("campus-sarthi-session", sessionId)
  }
  return sessionId
}

export function getPreferredLanguage(): string {
  const stored = storage.getItem("campus-sarthi-language")
  if (stored) return stored

  // Auto-detect from browser
  if (typeof navigator !== "undefined") {
    const browserLang = navigator.language.split("-")[0]
    if (["en", "pa", "te", "bn"].includes(browserLang)) {
      return browserLang
    }
  }

  return process.env.NEXT_PUBLIC_DEFAULT_LANGUAGE || "en"
}

export function setPreferredLanguage(lang: string): void {
  storage.setItem("campus-sarthi-language", lang)
}
