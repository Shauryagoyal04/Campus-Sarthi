import { type NextRequest, NextResponse } from "next/server"
import type { QueryRequest, QueryResponse, PythonQueryRequest } from "@/lib/types"

// Direct API call function to avoid import issues
async function callPythonAPI(request: PythonQueryRequest) {
  const PYTHON_API_URL = process.env.NEXT_PUBLIC_PYTHON_API_URL || 'http://localhost:8000'
  
  console.log('Making direct call to Python API:', `${PYTHON_API_URL}/query/`)
  console.log('Request payload:', request)
  
  try {
    const response = await fetch(`${PYTHON_API_URL}/query/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    })

    console.log('Response status:', response.status)
    console.log('Response headers:', Object.fromEntries(response.headers.entries()))

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Python API error response:', errorText)
      throw new Error(`Query failed: ${response.status} ${response.statusText} - ${errorText}`)
    }

    const result = await response.json()
    console.log('Python API response:', result)
    return result
  } catch (error) {
    console.error('Fetch error:', error)
    throw error
  }
}

// Handle CORS preflight requests
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    },
  })
}

export async function POST(request: NextRequest) {
  try {
    const body: QueryRequest = await request.json()

    // Validate request
    if (!body.text && !body.audioUrl) {
      return NextResponse.json({ error: "Either text or audioUrl is required" }, { status: 400 })
    }

    // Generate session ID if not provided
    const sessionId = body.sessionId || `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    let answer = ""
    let confidence = 0
    let sources: any[] = []

    try {
      // Always try to use Python API if text is provided
      if (body.text) {
        console.log("Attempting to query Python API with:", body.text)
        
        try {
          const pythonRequest: PythonQueryRequest = {
            query: body.text,
            branch: "all", 
            year: "all",
            top_k: 5
          }

          console.log("Sending request to Python API:", pythonRequest)
          const pythonResponse = await callPythonAPI(pythonRequest)
          console.log("Received Python API response:", pythonResponse)
          
          answer = pythonResponse.answer || "I couldn't find a specific answer to your question."
          confidence = Math.min(95, Math.max(60, pythonResponse.context_used * 15))
          
          // Convert Python response to expected format
          sources = [{
            id: "python-src-1",
            title: "Campus Knowledge Base",
            excerpt: `Response based on ${pythonResponse.context_used} relevant document chunks`
          }]
        } catch (pythonError) {
          console.error("Python API error:", pythonError)
          // Fallback response with specific error info
          answer = `I'm having trouble accessing the campus database right now. Error: ${pythonError instanceof Error ? pythonError.message : 'Unknown error'}. Please try again in a moment.`
          confidence = 30
        }
      } else {
        // Handle voice messages
        answer = "Voice message received, but I need text to process your question. Please try typing your question instead."
        confidence = 50
      }
    } catch (pythonError) {
      console.error("Python API error:", pythonError)
      
      // Fallback response with helpful suggestions
      answer = `I'm currently unable to access the campus database, but here are some general suggestions: 
      
      - For library information, check the main library website
      - For course registration, visit the student portal
      - For campus facilities, refer to the campus map
      - For urgent matters, contact the help desk
      
      Please try again later when the system is available.`
      confidence = 40
    }

    const response: QueryResponse = {
      sessionId,
      answer,
      confidence,
      sources,
      suggestions: [
        "What are the library hours?",
        "Where is the cafeteria located?",
        "How do I register for courses?",
        "What facilities are available on campus?"
      ],
    }

    return NextResponse.json(response, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    })
  } catch (error) {
    console.error("Query API error:", error)
    return NextResponse.json(
      { 
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error"
      }, 
      { 
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      }
    )
  }
}
