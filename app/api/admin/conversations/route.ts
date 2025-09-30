import { type NextRequest, NextResponse } from "next/server"
import { mockConversations } from "@/lib/mock-data"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")

    // Filter conversations by status if provided
    let conversations = mockConversations
    if (status && (status === "pending" || status === "resolved")) {
      conversations = mockConversations.filter((conv) => conv.status === status)
    }

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 300))

    return NextResponse.json({
      conversations,
      total: conversations.length,
    })
  } catch (error) {
    console.error("Conversations API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { conversationId, status } = body

    if (!conversationId || !status) {
      return NextResponse.json({ error: "conversationId and status are required" }, { status: 400 })
    }

    // TODO: Update conversation status in database
    console.log(`Updating conversation ${conversationId} to status: ${status}`)

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("Update conversation API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
