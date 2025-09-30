import { getConfidenceColor, getConfidenceBgColor } from "@/lib/utils"

interface ConfidenceBadgeProps {
  confidence: number
  label?: string
}

export function ConfidenceBadge({ confidence, label }: ConfidenceBadgeProps) {
  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${getConfidenceBgColor(confidence)} ${getConfidenceColor(confidence)}`}
    >
      {label && <span>{label}:</span>}
      <span>{confidence}%</span>
    </div>
  )
}
