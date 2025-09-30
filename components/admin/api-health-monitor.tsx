"use client"

import { useState, useEffect } from "react"
import { pythonAPI } from "@/lib/python-api"
import { CheckCircle, XCircle, Clock } from "lucide-react"

interface APIHealthProps {
  className?: string
}

export function APIHealthMonitor({ className = "" }: APIHealthProps) {
  const [isHealthy, setIsHealthy] = useState<boolean | null>(null)
  const [isChecking, setIsChecking] = useState(false)
  const [lastChecked, setLastChecked] = useState<Date | null>(null)

  const checkHealth = async () => {
    setIsChecking(true)
    try {
      const healthy = await pythonAPI.healthCheck()
      setIsHealthy(healthy)
      setLastChecked(new Date())
    } catch (error) {
      setIsHealthy(false)
      setLastChecked(new Date())
    } finally {
      setIsChecking(false)
    }
  }

  useEffect(() => {
    checkHealth()
    // Check health every 30 seconds
    const interval = setInterval(checkHealth, 30000)
    return () => clearInterval(interval)
  }, [])

  const getStatusIcon = () => {
    if (isChecking) return <Clock className="w-4 h-4 animate-spin" />
    if (isHealthy === true) return <CheckCircle className="w-4 h-4 text-green-500" />
    if (isHealthy === false) return <XCircle className="w-4 h-4 text-red-500" />
    return <Clock className="w-4 h-4 text-yellow-500" />
  }

  const getStatusText = () => {
    if (isChecking) return "Checking..."
    if (isHealthy === true) return "Python API Online"
    if (isHealthy === false) return "Python API Offline"
    return "Unknown"
  }

  const getStatusColor = () => {
    if (isHealthy === true) return "text-green-500"
    if (isHealthy === false) return "text-red-500"
    return "text-yellow-500"
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {getStatusIcon()}
      <span className={`text-sm ${getStatusColor()}`}>
        {getStatusText()}
      </span>
      {lastChecked && (
        <span className="text-xs text-muted-foreground">
          Last checked: {lastChecked.toLocaleTimeString()}
        </span>
      )}
    </div>
  )
}