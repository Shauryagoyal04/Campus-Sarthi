"use client"

import { useState, useEffect, useCallback } from "react"

interface SpeechRecognitionHook {
  isListening: boolean
  transcript: string
  startListening: () => void
  stopListening: () => void
  isSupported: boolean
}

export function useSpeechRecognition(language: string): SpeechRecognitionHook {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [recognition, setRecognition] = useState<any>(null)
  const [isSupported, setIsSupported] = useState(false)

  useEffect(() => {
    if (typeof window === "undefined") return

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition

    if (SpeechRecognition) {
      setIsSupported(true)
      const recognitionInstance = new SpeechRecognition()
      recognitionInstance.continuous = false
      recognitionInstance.interimResults = false
      recognitionInstance.lang = language === "en" ? "en-US" : language

      recognitionInstance.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        setTranscript(transcript)
      }

      recognitionInstance.onend = () => {
        setIsListening(false)
      }

      recognitionInstance.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error)
        setIsListening(false)
      }

      setRecognition(recognitionInstance)
    }
  }, [language])

  const startListening = useCallback(() => {
    if (recognition) {
      setTranscript("")
      recognition.start()
      setIsListening(true)
    }
  }, [recognition])

  const stopListening = useCallback(() => {
    if (recognition) {
      recognition.stop()
      setIsListening(false)
    }
  }, [recognition])

  return {
    isListening,
    transcript,
    startListening,
    stopListening,
    isSupported,
  }
}
