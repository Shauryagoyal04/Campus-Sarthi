"use client"

import { useRef, useCallback } from "react"
import { Mic, Square } from "lucide-react"

interface VoiceRecorderProps {
  onRecordingComplete: (audioBlob: Blob, audioUrl: string) => void
  isRecording: boolean
  onRecordingStart: () => void
  onRecordingStop: () => void
  recordingLabel?: string
  stopLabel?: string
}

export function VoiceRecorder({
  onRecordingComplete,
  isRecording,
  onRecordingStart,
  onRecordingStop,
  recordingLabel,
  stopLabel,
}: VoiceRecorderProps) {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(chunksRef.current, { type: "audio/webm" })
        const audioUrl = URL.createObjectURL(audioBlob)
        onRecordingComplete(audioBlob, audioUrl)
        stream.getTracks().forEach((track) => track.stop())
      }

      mediaRecorder.start()
      onRecordingStart()
    } catch (error) {
      console.error("Error starting recording:", error)
      alert("Could not access microphone. Please check permissions.")
    }
  }, [onRecordingComplete, onRecordingStart])

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      onRecordingStop()
    }
  }, [isRecording, onRecordingStop])

  return (
    <button
      type="button"
      onClick={isRecording ? stopRecording : startRecording}
      className={`p-2 rounded-full transition-colors ${
        isRecording
          ? "bg-destructive text-destructive-foreground animate-pulse"
          : "hover:bg-accent text-muted-foreground hover:text-accent-foreground"
      }`}
      title={isRecording ? stopLabel : recordingLabel}
    >
      {isRecording ? <Square className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
    </button>
  )
}
