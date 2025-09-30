"use client"

import type { 
  PythonQueryRequest, 
  PythonQueryResponse, 
  DocumentUploadRequest, 
  DocumentUploadResponse, 
  SearchResponse,
  SimilarDocument
} from './types'

const PYTHON_API_URL = process.env.NEXT_PUBLIC_PYTHON_API_URL || 'http://localhost:8000'

class PythonAPIService {
  private baseURL: string

  constructor() {
    this.baseURL = PYTHON_API_URL
  }

  async healthCheck(): Promise<boolean> {
    try {
      console.log('Checking Python API health at:', `${this.baseURL}/health`)
      const response = await fetch(`${this.baseURL}/health`, {
        method: 'GET',
        mode: 'cors',
      })
      console.log('Health check response status:', response.status)
      return response.ok
    } catch (error) {
      console.error('Health check failed:', error)
      return false
    }
  }

  async queryDocuments(request: PythonQueryRequest): Promise<PythonQueryResponse> {
    try {
      console.log('Sending request to Python API:', request)
      const response = await fetch(`${this.baseURL}/query/`, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Python API error response:', errorText)
        throw new Error(`Query failed: ${response.status} ${response.statusText} - ${errorText}`)
      }

      const result = await response.json()
      console.log('Python API response:', result)
      return result
    } catch (error) {
      console.error('Query error:', error)
      throw error
    }
  }

  async uploadDocument(request: DocumentUploadRequest): Promise<DocumentUploadResponse> {
    try {
      const formData = new FormData()
      formData.append('file', request.file)
      formData.append('doc_name', request.doc_name)
      formData.append('branch', request.branch || 'all')
      formData.append('year', request.year || 'all')
      
      if (request.valid_from) {
        formData.append('valid_from', request.valid_from)
      }
      if (request.valid_to) {
        formData.append('valid_to', request.valid_to)
      }

      const response = await fetch(`${this.baseURL}/upload-document/`, {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.status} ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Upload error:', error)
      throw error
    }
  }

  async searchSimilarDocuments(request: PythonQueryRequest): Promise<SearchResponse> {
    try {
      const response = await fetch(`${this.baseURL}/search-similar/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      })

      if (!response.ok) {
        throw new Error(`Search failed: ${response.status} ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Search error:', error)
      throw error
    }
  }

  async getDocumentStats(): Promise<any> {
    try {
      const response = await fetch(`${this.baseURL}/documents/stats/`)
      
      if (!response.ok) {
        throw new Error(`Stats failed: ${response.status} ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Stats error:', error)
      throw error
    }
  }

  async listDocuments(branch?: string, year?: string, limit?: number): Promise<any> {
    try {
      const params = new URLSearchParams()
      if (branch) params.append('branch', branch)
      if (year) params.append('year', year)
      if (limit) params.append('limit', limit.toString())

      const url = `${this.baseURL}/documents/list/${params.toString() ? `?${params.toString()}` : ''}`
      const response = await fetch(url)
      
      if (!response.ok) {
        throw new Error(`List documents failed: ${response.status} ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error('List documents error:', error)
      throw error
    }
  }
}

// Create and export singleton instance
let _pythonAPIInstance: PythonAPIService | null = null

export const pythonAPI = (() => {
  if (!_pythonAPIInstance) {
    _pythonAPIInstance = new PythonAPIService()
  }
  return _pythonAPIInstance
})()

// Alternative export for debugging
export class PythonAPI extends PythonAPIService {}

// Export helper functions
export async function queryPython(query: string, branch?: string, year?: string): Promise<string> {
  try {
    const apiInstance = pythonAPI
    if (!apiInstance || typeof apiInstance.queryDocuments !== 'function') {
      throw new Error('Python API service not properly initialized')
    }
    
    const response = await apiInstance.queryDocuments({
      query,
      branch: branch || 'all',
      year: year || 'all',
      top_k: 5
    })
    return response.answer
  } catch (error) {
    console.error('Query Python error:', error)
    throw new Error('Failed to get response from Python API')
  }
}

export async function uploadDocumentToPython(file: File, docName: string, branch?: string, year?: string): Promise<DocumentUploadResponse> {
  const apiInstance = pythonAPI
  if (!apiInstance || typeof apiInstance.uploadDocument !== 'function') {
    throw new Error('Python API service not properly initialized')
  }
  
  return await apiInstance.uploadDocument({
    file,
    doc_name: docName,
    branch: branch || 'all',
    year: year || 'all'
  })
}