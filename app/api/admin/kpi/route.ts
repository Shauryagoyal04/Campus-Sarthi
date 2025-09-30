import { NextResponse } from "next/server"
import { mockKPIData, mockChartData } from "@/lib/mock-data"

export async function GET() {
  try {
    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 300))

    return NextResponse.json({
      kpi: mockKPIData,
      chartData: mockChartData,
    })
  } catch (error) {
    console.error("KPI API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
