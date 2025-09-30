"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { isAuthenticated } from "@/lib/admin-auth"
import { AdminLayout } from "@/components/admin/admin-layout"
import { mockConversations } from "@/lib/mock-data"
import { formatDate, formatTime } from "@/lib/utils"
import { MessageSquare, Clock, Globe } from "lucide-react"
import type { Conversation } from "@/lib/types"

export default function AdminConversationsPage() {
  const router = useRouter()
  const [selectedConv, setSelectedConv] = useState<Conversation | null>(null)
  const [filter, setFilter] = useState<"all" | "pending" | "resolved">("all")

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/admin/login")
    }
  }, [router])

  if (!isAuthenticated()) return null

  const filteredConvs = filter === "all" ? mockConversations : mockConversations.filter((c) => c.status === filter)

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Conversations</h1>
          <p className="text-muted-foreground">Monitor and manage user conversations</p>
        </div>

        {/* Filters */}
        <div className="flex gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === "all" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter("pending")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === "pending" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setFilter("resolved")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === "resolved" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
            }`}
          >
            Resolved
          </button>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Conversations List */}
          <div className="space-y-3">
            {filteredConvs.map((conv) => (
              <button
                key={conv.id}
                onClick={() => setSelectedConv(conv)}
                className={`w-full text-left p-4 rounded-lg border transition-colors ${
                  selectedConv?.id === conv.id ? "border-primary bg-primary/5" : "border-border bg-card hover:bg-accent"
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium text-sm">{conv.sessionId}</span>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      conv.status === "pending" ? "bg-yellow-500/10 text-yellow-600" : "bg-green-500/10 text-green-600"
                    }`}
                  >
                    {conv.status}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                  {conv.messages[conv.messages.length - 1]?.content}
                </p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatTime(conv.lastActivity)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Globe className="w-3 h-3" />
                    {conv.language.toUpperCase()}
                  </span>
                  <span>{conv.messages.length} messages</span>
                </div>
              </button>
            ))}
          </div>

          {/* Conversation Details */}
          <div className="bg-card border border-border rounded-lg p-6">
            {selectedConv ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-4 border-b border-border">
                  <div>
                    <h2 className="font-semibold">{selectedConv.sessionId}</h2>
                    <p className="text-sm text-muted-foreground">{formatDate(selectedConv.lastActivity)}</p>
                  </div>
                  <button
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                      selectedConv.status === "pending"
                        ? "bg-green-500 text-white hover:bg-green-600"
                        : "bg-secondary text-secondary-foreground"
                    }`}
                  >
                    {selectedConv.status === "pending" ? "Mark Resolved" : "Resolved"}
                  </button>
                </div>

                <div className="space-y-3 max-h-[500px] overflow-y-auto">
                  {selectedConv.messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`p-3 rounded-lg ${msg.role === "user" ? "bg-primary/10 ml-8" : "bg-muted mr-8"}`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium">{msg.role === "user" ? "User" : "Assistant"}</span>
                        <span className="text-xs text-muted-foreground">{formatTime(msg.timestamp)}</span>
                      </div>
                      <p className="text-sm">{msg.content}</p>
                      {msg.confidence && (
                        <div className="mt-2">
                          <span className="text-xs text-muted-foreground">Confidence: {msg.confidence}%</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                Select a conversation to view details
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
