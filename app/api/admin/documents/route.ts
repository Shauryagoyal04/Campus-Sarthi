import { type NextRequest, NextResponse } from "next/server"
import { mockDocuments } from "@/lib/mock-data"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search")

    // Filter documents by search query if provided
    let documents = mockDocuments
    if (search) {
      documents = mockDocuments.filter((doc) => doc.name.toLowerCase().includes(search.toLowerCase()))
    }

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 300))

    return NextResponse.json({
      documents,
      total: documents.length,
    })
  } catch (error) {
    console.error("Documents API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    // TODO: Handle file upload
    // In production, this would:
    // 1. Validate the file
    // 2. Upload to storage (e.g., Vercel Blob)
    // 3. Process the document (extract text, create embeddings)
    // 4. Store metadata in database

    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "File is required" }, { status: 400 })
    }

    console.log("Document upload received:", file.name, file.size)

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    return NextResponse.json({
      ok: true,
      document: {
        id: `doc-${Date.now()}`,
        name: file.name,
        type: file.type,
        size: file.size,
        uploadedAt: new Date(),
      },
    })
  } catch (error) {
    console.error("Upload document API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const documentId = searchParams.get("id")

    if (!documentId) {
      return NextResponse.json({ error: "Document ID is required" }, { status: 400 })
    }

    // TODO: Delete document from storage and database
    console.log(`Deleting document: ${documentId}`)

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("Delete document API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
