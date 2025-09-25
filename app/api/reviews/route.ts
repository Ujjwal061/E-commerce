import { type NextRequest, NextResponse } from "next/server"
import * as dbService from "@/lib/db-service"
import { COLLECTIONS } from "@/lib/db-service"
import { handleApiError } from "@/lib/api-error"

export async function GET(request: NextRequest) {
  try {
    console.log("Fetching reviews from database...")
    const searchParams = request.nextUrl.searchParams
    const productId = searchParams.get("productId")

    let reviews
    if (productId) {
      console.log(`Filtering reviews by product ID: ${productId}`)
      const collection = await dbService.getCollection(COLLECTIONS.REVIEWS)
      reviews = await collection.find({ "product.id": productId }).toArray()
      reviews = dbService.normalizeId(reviews)
    } else {
      reviews = await dbService.getAll(COLLECTIONS.REVIEWS)
    }

    console.log(`Found ${reviews?.length || 0} reviews`)
    return NextResponse.json(reviews || [])
  } catch (error) {
    console.error("Error fetching reviews:", error)
    return handleApiError(error, "Failed to fetch reviews")
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    console.log("Creating new review:", data)
    const review = await dbService.create(COLLECTIONS.REVIEWS, data)
    return NextResponse.json(review)
  } catch (error) {
    console.error("Error creating review:", error)
    return handleApiError(error, "Failed to create review")
  }
}
