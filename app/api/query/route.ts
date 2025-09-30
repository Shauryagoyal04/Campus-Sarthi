import { type NextRequest, NextResponse } from "next/server"
import type { QueryRequest, QueryResponse } from "@/lib/types"

// Mock responses for different queries
const mockResponses: Record<string, any> = {
  library: {
    answer: "The library is open Monday-Friday from 8 AM to 10 PM, and Saturday-Sunday from 10 AM to 6 PM.",
    confidence: 95,
    sources: [
      {
        id: "src-1",
        title: "Library Guidelines",
        page: 2,
        excerpt: "Operating hours: Mon-Fri 8:00-22:00, Sat-Sun 10:00-18:00",
      },
    ],
    suggestions: ["What services does the library offer?", "How do I reserve a study room?"],
  },
  cafeteria: {
    answer:
      "The main cafeteria is located in Building A, first floor. It serves breakfast from 7-10 AM, lunch from 11:30 AM-2 PM, and dinner from 5-8 PM.",
    confidence: 92,
    sources: [
      {
        id: "src-2",
        title: "Campus Map",
        page: 1,
        excerpt: "Main Cafeteria - Building A, Ground Floor",
      },
    ],
    suggestions: ["What food options are available?", "Are there vegetarian options?"],
  },
  registration: {
    answer:
      "Course registration opens two weeks before the semester starts. You can register through the student portal using your student ID and password.",
    confidence: 88,
    sources: [
      {
        id: "src-3",
        title: "Academic Calendar",
        page: 3,
        excerpt: "Registration period: Two weeks prior to semester start",
      },
    ],
    suggestions: ["How do I add or drop a course?", "What is the registration deadline?"],
  },
  default: {
    answer:
      "I understand you're asking about campus information. Could you please provide more specific details so I can help you better?",
    confidence: 65,
    sources: [],
    suggestions: ["Library hours", "Cafeteria location", "Course registration"],
  },
}

function getResponseForQuery(text: string): any {
  const lowerText = text.toLowerCase()

  if (lowerText.includes("library") || lowerText.includes("hours")) {
    return mockResponses.library
  }
  if (lowerText.includes("cafeteria") || lowerText.includes("food") || lowerText.includes("eat")) {
    return mockResponses.cafeteria
  }
  if (lowerText.includes("register") || lowerText.includes("course") || lowerText.includes("enroll")) {
    return mockResponses.registration
  }

  return mockResponses.default
}

export async function POST(request: NextRequest) {
  try {
    const body: QueryRequest = await request.json()

    // Validate request
    if (!body.text && !body.audioUrl) {
      return NextResponse.json({ error: "Either text or audioUrl is required" }, { status: 400 })
    }

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Generate session ID if not provided
    const sessionId = body.sessionId || `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    // Get mock response based on query
    const mockData = getResponseForQuery(body.text || "default")

    const response: QueryResponse = {
      sessionId,
      answer: mockData.answer,
      confidence: mockData.confidence,
      sources: mockData.sources,
      suggestions: mockData.suggestions,
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("Query API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
