"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { isAuthenticated } from "@/lib/admin-auth"
import { AdminLayout } from "@/components/admin/admin-layout"
import { mockDocuments } from "@/lib/mock-data"
import { Upload, Eye, Trash2, Download, Search } from "lucide-react"
import { formatDate } from "@/lib/utils"

export default function AdminDocumentsPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDoc, setSelectedDoc] = useState<any>(null)

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/admin/login")
    }
  }, [router])

  if (!isAuthenticated()) return null

  const filteredDocs = mockDocuments.filter((doc) => doc.name.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Documents</h1>
            <p className="text-muted-foreground">Manage knowledge base documents</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity">
            <Upload className="w-4 h-4" />
            Upload Document
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search documents..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        {/* Documents Table */}
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium">Document Name</th>
                  <th className="px-6 py-3 text-left text-sm font-medium">Type</th>
                  <th className="px-6 py-3 text-left text-sm font-medium">Size</th>
                  <th className="px-6 py-3 text-left text-sm font-medium">Uploaded</th>
                  <th className="px-6 py-3 text-left text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredDocs.map((doc) => (
                  <tr key={doc.id} className="hover:bg-accent/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium">{doc.name}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{doc.type}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {(doc.size / 1024 / 1024).toFixed(2)} MB
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{formatDate(doc.uploadedAt)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedDoc(doc)}
                          className="p-2 hover:bg-accent rounded-lg transition-colors"
                          title="Preview"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-2 hover:bg-accent rounded-lg transition-colors" title="Download">
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          className="p-2 hover:bg-destructive/10 text-destructive rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {selectedDoc && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="text-lg font-semibold">{selectedDoc.name}</h2>
              <button
                onClick={() => setSelectedDoc(null)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                ✕
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
              <p className="text-muted-foreground">Document preview would appear here...</p>
              <div className="mt-4 space-y-2 text-sm">
                <p>
                  <strong>Type:</strong> {selectedDoc.type}
                </p>
                <p>
                  <strong>Size:</strong> {(selectedDoc.size / 1024 / 1024).toFixed(2)} MB
                </p>
                <p>
                  <strong>Uploaded:</strong> {formatDate(selectedDoc.uploadedAt)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
