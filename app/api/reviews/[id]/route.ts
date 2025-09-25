import { type NextRequest, NextResponse } from "next/server"
import * as dbService from "@/lib/db-service"
import { COLLECTIONS } from "@/lib/db-service"
import { handleApiError } from "@/lib/api-error"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const review = await dbService.getById(COLLECTIONS.REVIEWS, params.id)

    if (!review) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 })
    }

    return NextResponse.json(review)
  } catch (error) {
    console.error("Error fetching review:", error)
    return handleApiError(error)
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const data = await request.json()
    console.log("Updating review:", params.id, data)

    const review = await dbService.update(COLLECTIONS.REVIEWS, params.id, data)
    return NextResponse.json(review)
  } catch (error) {
    console.error("Error updating review:", error)
    return handleApiError(error)
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbService.remove(COLLECTIONS.REVIEWS, params.id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting review:", error)
    return handleApiError(error)
  }
}
