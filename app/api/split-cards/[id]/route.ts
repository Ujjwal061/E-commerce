import { type NextRequest, NextResponse } from "next/server"
import { getById, update, remove, COLLECTIONS } from "@/lib/db-service"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const card = await getById(COLLECTIONS.SPLIT_CARDS, params.id)

    if (!card) {
      return NextResponse.json({ error: "Card not found" }, { status: 404 })
    }

    return NextResponse.json(card)
  } catch (error) {
    console.error(`Error fetching split card ${params.id}:`, error)
    return NextResponse.json({ error: "Failed to fetch split card" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const data = await request.json()

    // Validate required fields
    if (!data.title || !data.description || !data.icon) {
      return NextResponse.json(
        { error: "Missing required fields: title, description, and icon are required" },
        { status: 400 },
      )
    }

    const result = await update(COLLECTIONS.SPLIT_CARDS, params.id, data)
    return NextResponse.json(result)
  } catch (error) {
    console.error(`Error updating split card ${params.id}:`, error)
    return NextResponse.json({ error: "Failed to update split card" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await remove(COLLECTIONS.SPLIT_CARDS, params.id)
    return NextResponse.json({ success: true, id: params.id })
  } catch (error) {
    console.error(`Error deleting split card ${params.id}:`, error)
    return NextResponse.json({ error: "Failed to delete split card" }, { status: 500 })
  }
}
