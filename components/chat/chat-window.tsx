"use client"

import { useEffect, useRef, useState } from "react"
import type { Message } from "@/lib/types"
import { MessageBubble } from "./message-bubble"
import { formatDate } from "@/lib/utils"
import { Loader2 } from "lucide-react"

interface ChatWindowProps {
  messages: Message[]
  isLoading?: boolean
  translations: {
    today: string
    yesterday: string
    noMessages: string
    confidence: string
    sources: string
  }
}

export function ChatWindow({ messages, isLoading, translations }: ChatWindowProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (shouldAutoScroll && containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight
    }
  }, [messages, isLoading, shouldAutoScroll])

  const handleScroll = () => {
    if (!containerRef.current) return
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 100
    setShouldAutoScroll(isNearBottom)
  }

  // Group messages by date
  const groupedMessages = messages.reduce(
    (groups, message) => {
      const date = new Date(message.timestamp)
      const today = new Date()
      const yesterday = new Date(today)
      yesterday.setDate(yesterday.getDate() - 1)

      let dateLabel: string
      if (date.toDateString() === today.toDateString()) {
        dateLabel = translations.today
      } else if (date.toDateString() === yesterday.toDateString()) {
        dateLabel = translations.yesterday
      } else {
        dateLabel = formatDate(date)
      }

      if (!groups[dateLabel]) {
        groups[dateLabel] = []
      }
      groups[dateLabel].push(message)
      return groups
    },
    {} as Record<string, Message[]>,
  )

  return (
    <div ref={containerRef} onScroll={handleScroll} className="flex-1 overflow-y-auto p-4 space-y-6">
      {messages.length === 0 && !isLoading ? (
        <div className="flex items-center justify-center h-full text-center">
          <p className="text-muted-foreground text-sm">{translations.noMessages}</p>
        </div>
      ) : (
        Object.entries(groupedMessages).map(([date, msgs]) => (
          <div key={date}>
            <div className="flex items-center justify-center mb-4">
              <span className="text-xs text-muted-foreground bg-muted px-3 py-1 rounded-full">{date}</span>
            </div>
            {msgs.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
                confidenceLabel={translations.confidence}
                sourcesLabel={translations.sources}
              />
            ))}
          </div>
        ))
      )}

      {isLoading && (
        <div className="flex justify-start mb-4">
          <div className="bg-muted rounded-2xl px-4 py-3 flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm text-muted-foreground">Thinking...</span>
          </div>
        </div>
      )}
    </div>
  )
}
