"use client"

import { useState } from "react"

export default function TestPage() {
  const [result, setResult] = useState("")
  const [loading, setLoading] = useState(false)

  const testQuery = async () => {
    setLoading(true)
    try {
      console.log('Testing Next.js API route...')
      
      const response = await fetch("/api/query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: "What are the library hours?",
          language: "en",
          modality: "text",
          sessionId: "test-session"
        }),
      })

      console.log('Response status:', response.status)
      
      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`)
      }

      const data = await response.json()
      console.log('Response data:', data)
      setResult(JSON.stringify(data, null, 2))
    } catch (error) {
      console.error('Test error:', error)
      setResult(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  const testPythonAPI = async () => {
    setLoading(true)
    try {
      const response = await fetch("http://localhost:8000/query/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: "What are the library hours?",
          branch: "all",
          year: "all"
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      setResult(JSON.stringify(data, null, 2))
    } catch (error) {
      setResult(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">API Test Page</h1>
      
      <div className="space-y-4 mb-6">
        <button 
          onClick={testQuery}
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          Test Next.js API Route
        </button>
        
        <button 
          onClick={testPythonAPI}
          disabled={loading}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
        >
          Test Python API Directly
        </button>
      </div>
      
      {loading && <p>Loading...</p>}
      
      {result && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">Result:</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm">
            {result}
          </pre>
        </div>
      )}
    </div>
  )
}