"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { isAuthenticated } from "@/lib/admin-auth"
import { AdminLayout } from "@/components/admin/admin-layout"
import { mockKPIData, mockChartData } from "@/lib/mock-data"
import { pythonAPI } from "@/lib/python-api"
import { APIDebugger } from "@/components/admin/api-debugger"
import { TrendingUp, MessageSquare, AlertCircle, Users, FileText, Database, Building, Calendar } from "lucide-react"

export default function AdminDashboardPage() {
  const router = useRouter()
  const [pythonStats, setPythonStats] = useState<any>(null)
  const [isLoadingStats, setIsLoadingStats] = useState(true)
  const [apiHealth, setApiHealth] = useState<boolean | null>(null)

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/admin/login")
    } else {
      loadPythonStats()
    }
  }, [router])

  const loadPythonStats = async () => {
    try {
      // Check API health
      const health = await pythonAPI.healthCheck()
      setApiHealth(health)
      
      if (health) {
        // Load document statistics
        const stats = await pythonAPI.getDocumentStats()
        setPythonStats(stats)
      }
    } catch (error) {
      console.error("Failed to load Python API stats:", error)
      setApiHealth(false)
    } finally {
      setIsLoadingStats(false)
    }
  }

  if (!isAuthenticated()) return null

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Overview of Campus SARTHI performance</p>
        </div>

        {/* API Health Status */}
        {apiHealth !== null && (
          <div className={`p-4 rounded-lg border ${apiHealth ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${apiHealth ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="font-medium">
                Python API Status: {apiHealth ? 'Online' : 'Offline'}
              </span>
            </div>
          </div>
        )}

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Python API Stats */}
          {pythonStats && apiHealth ? (
            <>
              <KPICard
                title="Total Documents"
                value={pythonStats.total_documents?.toString() || "0"}
                icon={<FileText className="w-5 h-5" />}
                trend=""
              />
              <KPICard
                title="Total Chunks"
                value={pythonStats.total_chunks?.toString() || "0"}
                icon={<Database className="w-5 h-5" />}
                trend=""
              />
              <KPICard
                title="Branches"
                value={Object.keys(pythonStats.documents_by_branch || {}).length.toString()}
                icon={<Building className="w-5 h-5" />}
                trend=""
              />
              <KPICard
                title="Years Covered"
                value={Object.keys(pythonStats.documents_by_year || {}).length.toString()}
                icon={<Calendar className="w-5 h-5" />}
                trend=""
              />
            </>
          ) : (
            <>
              <KPICard
                title="Total Queries"
                value={mockKPIData.totalQueries.toLocaleString()}
                icon={<MessageSquare className="w-5 h-5" />}
                trend="+12%"
              />
              <KPICard
                title="Avg Confidence"
                value={`${mockKPIData.avgConfidence}%`}
                icon={<TrendingUp className="w-5 h-5" />}
                trend="+5%"
              />
              <KPICard
                title="Escalations"
                value={mockKPIData.escalations.toString()}
                icon={<AlertCircle className="w-5 h-5" />}
                trend="-8%"
              />
              <KPICard
                title="Active Users"
                value={mockKPIData.activeUsers.toString()}
                icon={<Users className="w-5 h-5" />}
                trend="+23%"
              />
            </>
          )}
        </div>

        {/* Python API Statistics */}
        {pythonStats && apiHealth && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4">Documents by Branch</h2>
              <div className="space-y-2">
                {Object.entries(pythonStats.documents_by_branch || {}).map(([branch, count]) => {
                  const numCount = Number(count) || 0;
                  const maxCount = Math.max(...Object.values(pythonStats.documents_by_branch || {}).map(v => Number(v) || 0));
                  return (
                    <div key={branch} className="flex items-center gap-3">
                      <span className="text-sm text-muted-foreground w-20 capitalize">{branch}</span>
                      <div className="flex-1 bg-muted rounded-full h-6 overflow-hidden">
                        <div
                          className="bg-primary h-full flex items-center justify-end pr-2"
                          style={{ 
                            width: `${Math.max(10, (numCount / maxCount * 100))}%` 
                          }}
                        >
                          <span className="text-xs text-primary-foreground font-medium">{numCount}</span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4">Documents by Year</h2>
              <div className="space-y-2">
                {Object.entries(pythonStats.documents_by_year || {}).map(([year, count]) => {
                  const numCount = Number(count) || 0;
                  const maxCount = Math.max(...Object.values(pythonStats.documents_by_year || {}).map(v => Number(v) || 0));
                  return (
                    <div key={year} className="flex items-center gap-3">
                      <span className="text-sm text-muted-foreground w-20">{year}</span>
                      <div className="flex-1 bg-muted rounded-full h-6 overflow-hidden">
                        <div
                          className="bg-chart-2 h-full flex items-center justify-end pr-2"
                          style={{ 
                            width: `${Math.max(10, (numCount / maxCount * 100))}%` 
                          }}
                        >
                          <span className="text-xs text-white font-medium">{numCount}</span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Query Volume</h2>
            <div className="space-y-2">
              {mockChartData.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground w-16">{item.date}</span>
                  <div className="flex-1 bg-muted rounded-full h-8 overflow-hidden">
                    <div
                      className="bg-primary h-full flex items-center justify-end pr-2"
                      style={{ width: `${(item.queries / 70) * 100}%` }}
                    >
                      <span className="text-xs text-primary-foreground font-medium">{item.queries}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Confidence Trend</h2>
            <div className="space-y-2">
              {mockChartData.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground w-16">{item.date}</span>
                  <div className="flex-1 bg-muted rounded-full h-8 overflow-hidden">
                    <div
                      className="bg-chart-2 h-full flex items-center justify-end pr-2"
                      style={{ width: `${item.confidence}%` }}
                    >
                      <span className="text-xs text-white font-medium">{item.confidence}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* API Debug Panel - Remove in production */}
        <APIDebugger />

        {/* Recent Activity */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-3">
            <ActivityItem
              title="New conversation escalated"
              description="User requested human support for course registration"
              time="5 minutes ago"
            />
            <ActivityItem
              title="Document uploaded"
              description="Academic Calendar 2024-2025 added to knowledge base"
              time="1 hour ago"
            />
            <ActivityItem
              title="High confidence response"
              description="Library hours query answered with 95% confidence"
              time="2 hours ago"
            />
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

function KPICard({
  title,
  value,
  icon,
  trend,
}: {
  title: string
  value: string
  icon: React.ReactNode
  trend: string
}) {
  const isPositive = trend.startsWith("+")
  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-muted-foreground">{title}</span>
        <div className="text-muted-foreground">{icon}</div>
      </div>
      <div className="flex items-end justify-between">
        <span className="text-3xl font-bold">{value}</span>
        <span className={`text-sm font-medium ${isPositive ? "text-green-600" : "text-red-600"}`}>{trend}</span>
      </div>
    </div>
  )
}

function ActivityItem({ title, description, time }: { title: string; description: string; time: string }) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent transition-colors">
      <div className="w-2 h-2 bg-primary rounded-full mt-2" />
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm">{title}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <span className="text-xs text-muted-foreground whitespace-nowrap">{time}</span>
    </div>
  )
}
