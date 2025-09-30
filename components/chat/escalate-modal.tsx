"use client"

import type React from "react"

import { useState } from "react"
import { X } from "lucide-react"
import type { EscalateRequest } from "@/lib/types"
import { getSessionId } from "@/lib/storage"

interface EscalateModalProps {
  isOpen: boolean
  onClose: () => void
  language: string
  translations: {
    title: string
    description: string
    reason: string
    reasonPlaceholder: string
    contact: string
    contactPlaceholder: string
    submit: string
    cancel: string
    success: string
    error: string
  }
}

export function EscalateModal({ isOpen, onClose, language, translations }: EscalateModalProps) {
  const [reason, setReason] = useState("")
  const [contact, setContact] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle")

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setStatus("idle")

    try {
      const request: EscalateRequest = {
        sessionId: getSessionId(),
        message: reason,
        reason: "user_request",
        language,
        contact: contact || undefined,
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api/escalate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request),
      })

      if (!response.ok) throw new Error("Failed to escalate")

      setStatus("success")
      setTimeout(() => {
        onClose()
        setReason("")
        setContact("")
        setStatus("idle")
      }, 2000)
    } catch (error) {
      setStatus("error")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-lg shadow-lg max-w-md w-full">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-semibold">{translations.title}</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <p className="text-sm text-muted-foreground">{translations.description}</p>

          <div>
            <label className="block text-sm font-medium mb-1.5">{translations.reason}</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder={translations.reasonPlaceholder}
              required
              rows={4}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">{translations.contact}</label>
            <input
              type="text"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              placeholder={translations.contactPlaceholder}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {status === "success" && (
            <div className="p-3 bg-green-500/10 text-green-600 dark:text-green-400 rounded-lg text-sm">
              {translations.success}
            </div>
          )}

          {status === "error" && (
            <div className="p-3 bg-destructive/10 text-destructive rounded-lg text-sm">{translations.error}</div>
          )}

          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-border hover:bg-accent transition-colors text-sm font-medium"
            >
              {translations.cancel}
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !reason.trim()}
              className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50 text-sm font-medium"
            >
              {translations.submit}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
