import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { PWAProvider } from "@/components/pwa-provider"

export const metadata: Metadata = {
  title: "Campus SARTHI - Your Campus Assistant",
  description: "Multilingual campus chatbot for student support",
  manifest: "/manifest.json",
  themeColor: "#2563eb",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Campus SARTHI",
  },
    generator: 'v0.app'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <PWAProvider>{children}</PWAProvider>
      </body>
    </html>
  )
}
