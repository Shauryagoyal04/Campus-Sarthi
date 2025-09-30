import { NextResponse } from "next/server"
import { mockVolunteerQueue } from "@/lib/mock-data"

export async function GET() {
  try {
    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 300))

    return NextResponse.json({
      queue: mockVolunteerQueue,
      total: mockVolunteerQueue.length,
    })
  } catch (error) {
    console.error("Volunteers API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST() {
  try {
    // TODO: Handle volunteer submission approval/rejection
    // In production, this would:
    // 1. Update the volunteer submission status
    // 2. Add approved answers to the knowledge base
    // 3. Notify the volunteer of the decision

    console.log("Volunteer submission processed")

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("Process volunteer API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
