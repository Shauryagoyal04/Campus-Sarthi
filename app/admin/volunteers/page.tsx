"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { isAuthenticated } from "@/lib/admin-auth"
import { AdminLayout } from "@/components/admin/admin-layout"
import { mockVolunteerQueue } from "@/lib/mock-data"
import { Check, X, AlertCircle } from "lucide-react"
import { formatDate } from "@/lib/utils"

export default function AdminVolunteersPage() {
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/admin/login")
    }
  }, [router])

  if (!isAuthenticated()) return null

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Volunteer Curation</h1>
          <p className="text-muted-foreground">Review and approve community-contributed answers</p>
        </div>

        <div className="space-y-4">
          {mockVolunteerQueue.map((item) => (
            <div key={item.id} className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-semibold mb-2">{item.question}</h3>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>Submitted by: {item.submittedBy}</span>
                    <span>{formatDate(item.submittedAt)}</span>
                    <span className="flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      Confidence: {item.confidence}%
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-muted rounded-lg p-4 mb-4">
                <p className="text-sm font-medium mb-1">Suggested Answer:</p>
                <p className="text-sm text-muted-foreground">{item.suggestedAnswer}</p>
              </div>

              <div className="flex gap-2">
                <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                  <Check className="w-4 h-4" />
                  Approve
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-destructive text-white rounded-lg hover:opacity-90 transition-opacity">
                  <X className="w-4 h-4" />
                  Reject
                </button>
                <button className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-accent transition-colors">
                  Edit & Approve
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  )
}
