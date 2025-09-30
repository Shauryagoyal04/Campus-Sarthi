"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { setAdminToken, validateToken } from "@/lib/admin-auth"
import { Lock } from "lucide-react"

export default function AdminLoginPage() {
  const [token, setToken] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const isValid = await validateToken(token)
      if (isValid) {
        setAdminToken(token)
        router.push("/admin/dashboard")
      } else {
        setError("Invalid admin token")
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-card border border-border rounded-lg shadow-lg p-8">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <Lock className="w-8 h-8 text-primary" />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-center mb-2">Admin Login</h1>
          <p className="text-center text-muted-foreground mb-6">Enter your admin token to continue</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="token" className="block text-sm font-medium mb-2">
                Admin Token
              </label>
              <input
                id="token"
                type="password"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Enter admin token"
                required
                className="w-full px-4 py-2.5 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            {error && <div className="p-3 bg-destructive/10 text-destructive rounded-lg text-sm">{error}</div>}

            <button
              type="submit"
              disabled={isLoading || !token}
              className="w-full px-4 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </form>

          <div className="mt-6 p-4 bg-muted rounded-lg">
            <p className="text-xs text-muted-foreground">
              <strong>Demo:</strong> Use any non-empty token to login (e.g., "admin-demo-token")
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
