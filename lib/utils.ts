import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

export function formatTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date
  return d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  })
}

export function getConfidenceColor(confidence: number): string {
  if (confidence >= 80) return "text-green-600 dark:text-green-400"
  if (confidence >= 60) return "text-yellow-600 dark:text-yellow-400"
  return "text-destructive"
}

export function getConfidenceBgColor(confidence: number): string {
  if (confidence >= 80) return "bg-green-500/10"
  if (confidence >= 60) return "bg-yellow-500/10"
  return "bg-destructive/10"
}
