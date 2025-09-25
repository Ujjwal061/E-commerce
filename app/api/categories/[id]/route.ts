import { type NextRequest, NextResponse } from "next/server"
import * as dbService from "@/lib/db-service"
import { COLLECTIONS } from "@/lib/db-service"
import { handleApiError } from "@/lib/api-error"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const category = await dbService.getById(COLLECTIONS.CATEGORIES, params.id)

    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 })
    }

    return NextResponse.json(category)
  } catch (error) {
    console.error("Error fetching category:", error)
    return handleApiError(error)
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const data = await request.json()
    const category = await dbService.update(COLLECTIONS.CATEGORIES, params.id, data)
    return NextResponse.json(category)
  } catch (error) {
    console.error("Error updating category:", error)
    return handleApiError(error)
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbService.remove(COLLECTIONS.CATEGORIES, params.id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting category:", error)
    return handleApiError(error)
  }
}
