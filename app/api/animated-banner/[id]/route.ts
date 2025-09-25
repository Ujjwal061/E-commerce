import { type NextRequest, NextResponse } from "next/server"
import { getById, update, remove, COLLECTIONS } from "@/lib/db-service"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const banner = await getById(COLLECTIONS.ANIMATED_BANNERS, params.id)

    if (!banner) {
      return NextResponse.json({ error: "Banner not found" }, { status: 404 })
    }

    return NextResponse.json(banner)
  } catch (error) {
    console.error(`Error fetching animated banner ${params.id}:`, error)
    return NextResponse.json({ error: "Failed to fetch animated banner" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const data = await request.json()

    // Validate required fields
    if (!data.title || !data.description || !data.buttonText) {
      return NextResponse.json(
        { error: "Missing required fields: title, description, and buttonText are required" },
        { status: 400 },
      )
    }

    const result = await update(COLLECTIONS.ANIMATED_BANNERS, params.id, data)
    return NextResponse.json(result)
  } catch (error) {
    console.error(`Error updating animated banner ${params.id}:`, error)
    return NextResponse.json({ error: "Failed to update animated banner" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await remove(COLLECTIONS.ANIMATED_BANNERS, params.id)
    return NextResponse.json({ success: true, id: params.id })
  } catch (error) {
    console.error(`Error deleting animated banner ${params.id}:`, error)
    return NextResponse.json({ error: "Failed to delete animated banner" }, { status: 500 })
  }
}
