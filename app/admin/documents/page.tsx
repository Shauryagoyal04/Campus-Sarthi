"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { isAuthenticated } from "@/lib/admin-auth"
import { AdminLayout } from "@/components/admin/admin-layout"
import { pythonAPI, uploadDocumentToPython } from "@/lib/python-api"
import { Upload, Eye, Trash2, Download, Search, FileText, Calendar, Building, GraduationCap, AlertCircle } from "lucide-react"
import { formatDate } from "@/lib/utils"
import type { DocumentUploadResponse } from "@/lib/types"

export default function AdminDocumentsPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDoc, setSelectedDoc] = useState<any>(null)
  const [documents, setDocuments] = useState<any[]>([])
  const [stats, setStats] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [uploadForm, setUploadForm] = useState({
    doc_name: "",
    branch: "all",
    year: "all",
    valid_from: "",
    valid_to: ""
  })

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/admin/login")
    } else {
      loadDocuments()
      loadStats()
    }
  }, [router])

  const loadDocuments = async () => {
    try {
      const data = await pythonAPI.listDocuments()
      setDocuments(data.documents || [])
    } catch (error) {
      console.error("Failed to load documents:", error)
      setDocuments([])
    }
  }

  const loadStats = async () => {
    try {
      const data = await pythonAPI.getDocumentStats()
      setStats(data)
    } catch (error) {
      console.error("Failed to load stats:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileUpload = async (file: File) => {
    if (!uploadForm.doc_name.trim()) {
      setUploadError("Please enter a document name")
      return
    }

    setIsUploading(true)
    setUploadError(null)

    try {
      const result = await uploadDocumentToPython(
        file,
        uploadForm.doc_name,
        uploadForm.branch,
        uploadForm.year
      )
      
      // Refresh documents list
      await loadDocuments()
      await loadStats()
      
      // Reset form and close modal
      setUploadForm({
        doc_name: "",
        branch: "all",
        year: "all",
        valid_from: "",
        valid_to: ""
      })
      setShowUploadModal(false)
      
      alert(`Document uploaded successfully! Processed ${result.chunks_processed} chunks.`)
    } catch (error) {
      console.error("Upload failed:", error)
      setUploadError(error instanceof Error ? error.message : "Upload failed")
    } finally {
      setIsUploading(false)
    }
  }

  if (!isAuthenticated()) return null

  const filteredDocs = documents.filter((doc) => 
    doc.doc_name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Documents</h1>
            <p className="text-muted-foreground">Manage knowledge base documents</p>
          </div>
          <button 
            onClick={() => setShowUploadModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
          >
            <Upload className="w-4 h-4" />
            Upload Document
          </button>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Documents</p>
                  <p className="text-2xl font-bold">{stats.total_documents}</p>
                </div>
              </div>
            </div>
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center gap-2">
                <Building className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Chunks</p>
                  <p className="text-2xl font-bold">{stats.total_chunks}</p>
                </div>
              </div>
            </div>
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Branches</p>
                  <p className="text-2xl font-bold">{Object.keys(stats.documents_by_branch || {}).length}</p>
                </div>
              </div>
            </div>
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Years</p>
                  <p className="text-2xl font-bold">{Object.keys(stats.documents_by_year || {}).length}</p>
                </div>
              </div>
            </div>
          </div>
        )}

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
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-muted-foreground">Loading documents...</div>
            </div>
          ) : filteredDocs.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <FileText className="w-12 h-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No documents found</h3>
              <p className="text-muted-foreground mb-4">
                {documents.length === 0 
                  ? "Upload your first document to get started"
                  : "No documents match your search query"}
              </p>
              {documents.length === 0 && (
                <button 
                  onClick={() => setShowUploadModal(true)}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90"
                >
                  Upload Document
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium">Document Name</th>
                    <th className="px-6 py-3 text-left text-sm font-medium">Branch</th>
                    <th className="px-6 py-3 text-left text-sm font-medium">Year</th>
                    <th className="px-6 py-3 text-left text-sm font-medium">Chunks</th>
                    <th className="px-6 py-3 text-left text-sm font-medium">Valid From</th>
                    <th className="px-6 py-3 text-left text-sm font-medium">Valid To</th>
                    <th className="px-6 py-3 text-left text-sm font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredDocs.map((doc, index) => (
                    <tr key={`${doc.doc_name}-${index}`} className="hover:bg-accent/50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium">{doc.doc_name}</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-secondary">
                          {doc.branch}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-accent">
                          {doc.year}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{doc.chunk_count}</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {doc.valid_from || "-"}
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {doc.valid_to || "-"}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSelectedDoc(doc)}
                            className="p-2 hover:bg-accent rounded-lg transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button 
                            className="p-2 hover:bg-destructive/10 text-destructive rounded-lg transition-colors"
                            title="Delete (Not implemented)"
                            disabled
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
          )}
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg shadow-lg max-w-2xl w-full">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="text-lg font-semibold">Upload Document</h2>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                ✕
              </button>
            </div>
            <div className="p-6">
              <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Document Name *</label>
                  <input
                    type="text"
                    value={uploadForm.doc_name}
                    onChange={(e) => setUploadForm(prev => ({ ...prev, doc_name: e.target.value }))}
                    placeholder="Enter document name"
                    className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Branch</label>
                    <select
                      value={uploadForm.branch}
                      onChange={(e) => setUploadForm(prev => ({ ...prev, branch: e.target.value }))}
                      className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value="all">All Branches</option>
                      <option value="CSE">Computer Science</option>
                      <option value="ECE">Electronics</option>
                      <option value="ME">Mechanical</option>
                      <option value="CE">Civil</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Year</label>
                    <select
                      value={uploadForm.year}
                      onChange={(e) => setUploadForm(prev => ({ ...prev, year: e.target.value }))}
                      className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value="all">All Years</option>
                      <option value="1">First Year</option>
                      <option value="2">Second Year</option>
                      <option value="3">Third Year</option>
                      <option value="4">Fourth Year</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Valid From (Optional)</label>
                    <input
                      type="date"
                      value={uploadForm.valid_from}
                      onChange={(e) => setUploadForm(prev => ({ ...prev, valid_from: e.target.value }))}
                      className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Valid To (Optional)</label>
                    <input
                      type="date"
                      value={uploadForm.valid_to}
                      onChange={(e) => setUploadForm(prev => ({ ...prev, valid_to: e.target.value }))}
                      className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">PDF File *</label>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        handleFileUpload(file)
                      }
                    }}
                    className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                    disabled={isUploading}
                  />
                  <p className="text-sm text-muted-foreground mt-1">Only PDF files are supported</p>
                </div>

                {uploadError && (
                  <div className="flex items-center gap-2 p-3 bg-destructive/10 text-destructive rounded-lg">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-sm">{uploadError}</span>
                  </div>
                )}

                {isUploading && (
                  <div className="flex items-center gap-2 p-3 bg-secondary rounded-lg">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent"></div>
                    <span className="text-sm">Uploading and processing document...</span>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Document Details Modal */}
      {selectedDoc && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg shadow-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="text-lg font-semibold">{selectedDoc.doc_name}</h2>
              <button
                onClick={() => setSelectedDoc(null)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                ✕
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div className="space-y-3">
                  <div>
                    <strong className="text-sm text-muted-foreground">Document Name:</strong>
                    <p className="text-sm">{selectedDoc.doc_name}</p>
                  </div>
                  <div>
                    <strong className="text-sm text-muted-foreground">Branch:</strong>
                    <p className="text-sm">{selectedDoc.branch}</p>
                  </div>
                  <div>
                    <strong className="text-sm text-muted-foreground">Year:</strong>
                    <p className="text-sm">{selectedDoc.year}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <strong className="text-sm text-muted-foreground">Chunks:</strong>
                    <p className="text-sm">{selectedDoc.chunk_count}</p>
                  </div>
                  <div>
                    <strong className="text-sm text-muted-foreground">Valid From:</strong>
                    <p className="text-sm">{selectedDoc.valid_from || "Not specified"}</p>
                  </div>
                  <div>
                    <strong className="text-sm text-muted-foreground">Valid To:</strong>
                    <p className="text-sm">{selectedDoc.valid_to || "Not specified"}</p>
                  </div>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <p className="text-sm text-muted-foreground">
                  This document has been processed into {selectedDoc.chunk_count} chunks for efficient retrieval and search.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
