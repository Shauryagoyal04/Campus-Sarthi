"use client"

import { useState } from "react"

// Direct API functions to avoid import issues
async function testHealthCheck() {
  const PYTHON_API_URL = process.env.NEXT_PUBLIC_PYTHON_API_URL || 'http://localhost:8000'
  const response = await fetch(`${PYTHON_API_URL}/health`)
  return response.ok
}

async function testQuery() {
  const PYTHON_API_URL = process.env.NEXT_PUBLIC_PYTHON_API_URL || 'http://localhost:8000'
  const response = await fetch(`${PYTHON_API_URL}/query/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: "test query", branch: "all", year: "all" })
  })
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}`)
  return await response.json()
}

async function testStats() {
  const PYTHON_API_URL = process.env.NEXT_PUBLIC_PYTHON_API_URL || 'http://localhost:8000'
  const response = await fetch(`${PYTHON_API_URL}/documents/stats/`)
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}`)
  return await response.json()
}

export function APIDebugger() {
  const [results, setResults] = useState<any>({})
  const [loading, setLoading] = useState(false)

  const testEndpoints = async () => {
    setLoading(true)
    const testResults: any = {}

    // Test health check
    try {
      const health = await testHealthCheck()
      testResults.health = { success: true, data: health }
    } catch (error) {
      testResults.health = { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }

    // Test query endpoint
    try {
      const query = await testQuery()
      testResults.query = { success: true, data: query }
    } catch (error) {
      testResults.query = { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }

    // Test stats endpoint
    try {
      const stats = await testStats()
      testResults.stats = { success: true, data: stats }
    } catch (error) {
      testResults.stats = { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }

    setResults(testResults)
    setLoading(false)
  }

  return (
    <div className="p-6 bg-card border border-border rounded-lg">
      <h3 className="text-lg font-semibold mb-4">API Debug Panel</h3>
      
      <button 
        onClick={testEndpoints}
        disabled={loading}
        className="px-4 py-2 bg-primary text-primary-foreground rounded hover:opacity-90 disabled:opacity-50"
      >
        {loading ? "Testing..." : "Test All Endpoints"}
      </button>

      {Object.keys(results).length > 0 && (
        <div className="mt-4 space-y-4">
          {Object.entries(results).map(([endpoint, result]: [string, any]) => (
            <div key={endpoint} className="border border-border rounded p-3">
              <h4 className="font-medium text-sm mb-2 capitalize">{endpoint} Endpoint</h4>
              <div className={`text-xs p-2 rounded ${result.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                <strong>Status:</strong> {result.success ? 'SUCCESS' : 'FAILED'}
              </div>
              <pre className="text-xs mt-2 p-2 bg-muted rounded overflow-auto">
                {JSON.stringify(result.success ? result.data : result.error, null, 2)}
              </pre>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}