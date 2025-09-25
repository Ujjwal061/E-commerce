import { type NextRequest, NextResponse } from "next/server"
import * as dbService from "@/lib/db-service"
import { COLLECTIONS } from "@/lib/db-service"
import { getCollection } from "@/lib/db"
import { ObjectId } from "mongodb"
import { handleApiError } from "@/lib/api-error"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const advertisement = await dbService.getById(COLLECTIONS.ADVERTISEMENTS, params.id)

    if (!advertisement) {
      return NextResponse.json({ error: "Advertisement not found" }, { status: 404 })
    }

    return NextResponse.json(advertisement)
  } catch (error) {
    console.error("Error fetching advertisement:", error)
    return NextResponse.json({ error: "Failed to fetch advertisement" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const body = await request.json()

    console.log("Updating advertisement:", id, body)

    const collection = await getCollection("advertisements")

    // Convert string ID to ObjectId, return error if invalid
    let objectId: ObjectId
    try {
      objectId = new ObjectId(id)
    } catch (error) {
      return new Response(JSON.stringify({ error: "Invalid advertisement id" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    }

    // Remove _id from body to avoid MongoDB error
    const { _id, ...updateData } = body

    console.log("Update data:", updateData)

    // Ensure we're only updating valid fields
    const validUpdateData = { ...updateData }

    const result = await collection.updateOne({ _id: objectId }, { $set: validUpdateData })
    console.log("Update result:", result)

    if (result.matchedCount === 0) {
      console.error("Advertisement not found:", id)
      return new Response(JSON.stringify({ error: "Advertisement not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      })
    }

    // Fetch the updated document to return
    const updatedAd = await collection.findOne({ _id: objectId })
    console.log("Updated advertisement:", updatedAd)

    return new Response(JSON.stringify(updatedAd), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error("Error updating advertisement:", error)
    return new Response(
      JSON.stringify({
        error: "Failed to update advertisement",
        details: error instanceof Error ? error.message : String(error),
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    )
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const result = await dbService.remove(COLLECTIONS.ADVERTISEMENTS, params.id)

    if (!result) {
      return NextResponse.json({ error: "Advertisement not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: "Advertisement deleted successfully" })
  } catch (error) {
    console.error("Error deleting advertisement:", error)
    return handleApiError(error)
  }
}
