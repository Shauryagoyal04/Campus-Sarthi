"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { isAuthenticated } from "@/lib/admin-auth"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Save } from "lucide-react"

export default function AdminSettingsPage() {
  const router = useRouter()
  const [settings, setSettings] = useState({
    confidenceThreshold: 70,
    enabledLanguages: ["en", "pa", "te", "bn"],
    apiEndpoint: process.env.NEXT_PUBLIC_API_HOST || "",
    webhookUrl: "",
  })

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/admin/login")
    }
  }, [router])

  if (!isAuthenticated()) return null

  const handleSave = () => {
    // TODO: Save settings to backend
    alert("Settings saved successfully!")
  }

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-3xl">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Configure Campus SARTHI system settings</p>
        </div>

        <div className="bg-card border border-border rounded-lg p-6 space-y-6">
          {/* Confidence Threshold */}
          <div>
            <label className="block text-sm font-medium mb-2">Confidence Threshold (%)</label>
            <input
              type="number"
              min="0"
              max="100"
              value={settings.confidenceThreshold}
              onChange={(e) => setSettings({ ...settings, confidenceThreshold: Number.parseInt(e.target.value) })}
              className="w-full px-4 py-2.5 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <p className="text-sm text-muted-foreground mt-1">
              Minimum confidence score required before suggesting human escalation
            </p>
          </div>

          {/* Enabled Languages */}
          <div>
            <label className="block text-sm font-medium mb-2">Enabled Languages</label>
            <div className="space-y-2">
              {[
                { code: "en", name: "English" },
                { code: "pa", name: "Punjabi (ਪੰਜਾਬੀ)" },
                { code: "te", name: "Telugu (తెలుగు)" },
                { code: "bn", name: "Bengali (বাংলা)" },
              ].map((lang) => (
                <label key={lang.code} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={settings.enabledLanguages.includes(lang.code)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSettings({
                          ...settings,
                          enabledLanguages: [...settings.enabledLanguages, lang.code],
                        })
                      } else {
                        setSettings({
                          ...settings,
                          enabledLanguages: settings.enabledLanguages.filter((l) => l !== lang.code),
                        })
                      }
                    }}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">{lang.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* API Endpoint */}
          <div>
            <label className="block text-sm font-medium mb-2">API Endpoint</label>
            <input
              type="url"
              value={settings.apiEndpoint}
              onChange={(e) => setSettings({ ...settings, apiEndpoint: e.target.value })}
              placeholder="https://api.campus-sarthi.com"
              className="w-full px-4 py-2.5 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <p className="text-sm text-muted-foreground mt-1">Backend API endpoint URL</p>
          </div>

          {/* Webhook URL */}
          <div>
            <label className="block text-sm font-medium mb-2">Webhook URL (Optional)</label>
            <input
              type="url"
              value={settings.webhookUrl}
              onChange={(e) => setSettings({ ...settings, webhookUrl: e.target.value })}
              placeholder="https://your-domain.com/webhook"
              className="w-full px-4 py-2.5 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <p className="text-sm text-muted-foreground mt-1">
              Receive notifications for escalations and important events
            </p>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
          >
            <Save className="w-4 h-4" />
            Save Settings
          </button>
        </div>
      </div>
    </AdminLayout>
  )
}
