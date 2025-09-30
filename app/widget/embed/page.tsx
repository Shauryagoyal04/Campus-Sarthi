"use client"

import { useEffect, useState } from "react"
import { ChatWidget } from "@/components/chat/chat-widget"
import { useSearchParams } from "next/navigation"
import en from "@/locales/en.json"
import pa from "@/locales/pa.json"
import te from "@/locales/te.json"
import bn from "@/locales/bn.json"

const translations = { en, pa, te, bn }

export default function WidgetEmbedPage() {
  const searchParams = useSearchParams()
  const [config, setConfig] = useState({
    apiKey: searchParams.get("apiKey") || "",
    lang: searchParams.get("lang") || "en",
    theme: searchParams.get("theme") || "light",
  })

  useEffect(() => {
    // Notify parent that widget is ready
    if (window.parent !== window) {
      window.parent.postMessage(
        {
          type: "CAMPUS_SARTHI_READY",
        },
        "*",
      )
    }

    // Listen for config updates from parent
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === "CAMPUS_SARTHI_CONFIG") {
        setConfig((prev) => ({
          ...prev,
          ...event.data.config,
        }))
      } else if (event.data.type === "CAMPUS_SARTHI_CONFIG_UPDATE") {
        setConfig((prev) => ({
          ...prev,
          ...event.data.config,
        }))
      }
    }

    window.addEventListener("message", handleMessage)
    return () => window.removeEventListener("message", handleMessage)
  }, [])

  // Apply theme
  useEffect(() => {
    if (config.theme === "dark") {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [config.theme])

  const currentTranslations = translations[config.lang as keyof typeof translations] || translations.en

  return (
    <div className="w-screen h-screen">
      <ChatWidget translations={currentTranslations} initialLanguage={config.lang} />
    </div>
  )
}
