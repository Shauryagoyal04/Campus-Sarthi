import type { Message } from "@/lib/types"
import { formatTime } from "@/lib/utils"
import { ConfidenceBadge } from "./confidence-badge"
import { SourceCard } from "./source-card"
import { Volume2 } from "lucide-react"

interface MessageBubbleProps {
  message: Message
  confidenceLabel?: string
  sourcesLabel?: string
}

export function MessageBubble({ message, confidenceLabel, sourcesLabel }: MessageBubbleProps) {
  const isUser = message.role === "user"

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>
      <div className={`max-w-[80%] ${isUser ? "items-end" : "items-start"} flex flex-col gap-1`}>
        <div
          className={`rounded-2xl px-4 py-2.5 ${
            isUser ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
          }`}
        >
          {message.audioUrl && (
            <div className="flex items-center gap-2 mb-2">
              <Volume2 className="w-4 h-4" />
              <audio src={message.audioUrl} controls className="max-w-full" />
            </div>
          )}
          <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
        </div>

        <div className="flex items-center gap-2 px-2">
          <span className="text-xs text-muted-foreground">{formatTime(message.timestamp)}</span>
          {message.confidence !== undefined && (
            <ConfidenceBadge confidence={message.confidence} label={confidenceLabel} />
          )}
        </div>

        {message.sources && message.sources.length > 0 && (
          <div className="w-full mt-2 space-y-2">
            <p className="text-xs font-medium text-muted-foreground px-2">{sourcesLabel || "Sources"}:</p>
            {message.sources.map((source) => (
              <SourceCard key={source.id} source={source} />
            ))}
          </div>
        )}

        {message.suggestions && message.suggestions.length > 0 && (
          <div className="w-full mt-2 flex flex-wrap gap-2">
            {message.suggestions.map((suggestion, idx) => (
              <button
                key={idx}
                className="text-xs px-3 py-1.5 bg-secondary text-secondary-foreground rounded-full hover:bg-accent transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
