"use client"

import { useState, useCallback } from "react"
import type { Message, QueryRequest, QueryResponse } from "@/lib/types"
import { getSessionId } from "@/lib/storage"

export function useChat(language: string) {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const sendMessage = useCallback(
    async (text?: string, audioUrl?: string) => {
      setIsLoading(true)
      setError(null)

      // Add user message
      const userMessage: Message = {
        id: `msg-${Date.now()}`,
        role: "user",
        content: text || "Voice message",
        timestamp: new Date(),
        audioUrl,
      }
      setMessages((prev) => [...prev, userMessage])

      try {
        const request: QueryRequest = {
          sessionId: getSessionId(),
          text,
          audioUrl,
          language,
          modality: audioUrl ? "voice" : "text",
        }

        // Get the current origin for API calls
        const apiUrl = process.env.NEXT_PUBLIC_API_HOST || window.location.origin
        const response = await fetch(`${apiUrl}/api/query`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(request),
        })

        if (!response.ok) throw new Error("Failed to send message")

        const data: QueryResponse = await response.json()

        // Add assistant message
        const assistantMessage: Message = {
          id: `msg-${Date.now()}-assistant`,
          role: "assistant",
          content: data.answer,
          timestamp: new Date(),
          confidence: data.confidence,
          sources: data.sources,
          suggestions: data.suggestions,
        }
        setMessages((prev) => [...prev, assistantMessage])
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setIsLoading(false)
      }
    },
    [language],
  )

  const clearMessages = useCallback(() => {
    setMessages([])
  }, [])

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages,
  }
}
