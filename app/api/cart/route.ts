import { type NextRequest, NextResponse } from "next/server"
import { getCollection, normalizeId } from "@/lib/db-service"

// Get cart for a user
export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    const collection = await getCollection("carts")
    const cart = await collection.findOne({ userId })

    return NextResponse.json(cart ? normalizeId(cart) : { userId, items: [] })
  } catch (error) {
    console.error("Error getting cart:", error)
    return NextResponse.json({ error: "Failed to get cart" }, { status: 500 })
  }
}

// Update cart for a user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, items } = body

    if (!userId || !items) {
      return NextResponse.json({ error: "User ID and items are required" }, { status: 400 })
    }

    const collection = await getCollection("carts")

    // Check if cart exists
    const existingCart = await collection.findOne({ userId })

    if (existingCart) {
      // Update existing cart
      await collection.updateOne({ userId }, { $set: { items, updatedAt: new Date() } })
    } else {
      // Create new cart
      await collection.insertOne({
        userId,
        items,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating cart:", error)
    return NextResponse.json({ error: "Failed to update cart" }, { status: 500 })
  }
}
