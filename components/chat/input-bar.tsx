"use client"

import type React from "react"

import { useState, useRef, type KeyboardEvent } from "react"
import { Send, Paperclip } from "lucide-react"
import { VoiceRecorder } from "./voice-recorder"
import { useSpeechRecognition } from "@/hooks/use-speech-recognition"

interface InputBarProps {
  onSendMessage: (text?: string, audioUrl?: string) => void
  disabled?: boolean
  placeholder?: string
  language: string
  enableVoice?: boolean
  enableFileUpload?: boolean
}

export function InputBar({
  onSendMessage,
  disabled,
  placeholder,
  language,
  enableVoice = true,
  enableFileUpload = false,
}: InputBarProps) {
  const [input, setInput] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { transcript, isListening, startListening, stopListening, isSupported } = useSpeechRecognition(language)

  const handleSend = () => {
    if (input.trim() && !disabled) {
      onSendMessage(input.trim())
      setInput("")
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleRecordingComplete = (audioBlob: Blob, audioUrl: string) => {
    // TODO: Upload audio to backend and get URL
    // For now, we'll use the local blob URL
    onSendMessage(undefined, audioUrl)
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // TODO: Upload file to backend
      console.log("File selected:", file.name)
    }
  }

  // Auto-fill input when speech recognition completes
  if (transcript && !isListening && !input) {
    setInput(transcript)
  }

  return (
    <div className="border-t border-border bg-background p-4">
      <div className="flex items-end gap-2">
        <div className="flex-1 relative">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled || isRecording}
            rows={1}
            className="w-full resize-none rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 max-h-32"
            style={{
              minHeight: "42px",
              height: "auto",
            }}
          />
        </div>

        <div className="flex items-center gap-1">
          {enableFileUpload && (
            <>
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileSelect}
                className="hidden"
                accept=".pdf,.doc,.docx,.txt"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={disabled}
                className="p-2 rounded-full hover:bg-accent text-muted-foreground hover:text-accent-foreground transition-colors disabled:opacity-50"
              >
                <Paperclip className="w-5 h-5" />
              </button>
            </>
          )}

          {enableVoice && isSupported && (
            <VoiceRecorder
              onRecordingComplete={handleRecordingComplete}
              isRecording={isRecording}
              onRecordingStart={() => setIsRecording(true)}
              onRecordingStop={() => setIsRecording(false)}
            />
          )}

          <button
            type="button"
            onClick={handleSend}
            disabled={disabled || !input.trim()}
            className="p-2 rounded-full bg-primary text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
