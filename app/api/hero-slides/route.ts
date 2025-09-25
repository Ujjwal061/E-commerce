import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { handleApiError } from "@/lib/api-error"

export async function GET() {
  try {
    const { db } = await connectToDatabase()

    const slides = await db.collection("hero_slides").find({}).toArray()

    return NextResponse.json({
      success: true,
      slides,
    })
  } catch (error) {
    return handleApiError(error, "Error fetching hero slides")
  }
}
