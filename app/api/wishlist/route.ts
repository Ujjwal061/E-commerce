import { NextResponse } from "next/server"
import { getCollection } from "@/lib/db-service"
import { normalizeId } from "@/lib/db-service"
import { ObjectId } from "mongodb"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ message: "User ID is required" }, { status: 400 })
    }

    const wishlistCollection = await getCollection("wishlists")
    const wishlist = await wishlistCollection.findOne({ userId })

    if (!wishlist) {
      return NextResponse.json({ items: [] })
    }

    // If we have product IDs, fetch the full product details
    if (wishlist.items && wishlist.items.length > 0) {
      const productsCollection = await getCollection("products")
      const productIds = wishlist.items.map((id: string) => {
        try {
          return new ObjectId(id)
        } catch (e) {
          return id // If it's not a valid ObjectId, use the string
        }
      })

      const products = await productsCollection.find({ _id: { $in: productIds } }).toArray()

      return NextResponse.json({
        items: normalizeId(products),
      })
    }

    return NextResponse.json({ items: [] })
  } catch (error) {
    console.error("Error fetching wishlist:", error)
    return NextResponse.json({ message: "An error occurred while fetching wishlist" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { userId, productId } = await request.json()

    if (!userId || !productId) {
      return NextResponse.json({ message: "User ID and Product ID are required" }, { status: 400 })
    }

    const wishlistCollection = await getCollection("wishlists")

    // Check if wishlist exists
    const wishlist = await wishlistCollection.findOne({ userId })

    if (wishlist) {
      // Check if product is already in wishlist
      if (wishlist.items.includes(productId)) {
        return NextResponse.json({
          message: "Product already in wishlist",
          added: false,
        })
      }

      // Add product to existing wishlist
      await wishlistCollection.updateOne({ userId }, { $push: { items: productId }, $set: { updatedAt: new Date() } })
    } else {
      // Create new wishlist
      await wishlistCollection.insertOne({
        userId,
        items: [productId],
        createdAt: new Date(),
        updatedAt: new Date(),
      })
    }

    return NextResponse.json({
      message: "Product added to wishlist",
      added: true,
    })
  } catch (error) {
    console.error("Error adding to wishlist:", error)
    return NextResponse.json({ message: "An error occurred while adding to wishlist" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const productId = searchParams.get("productId")

    if (!userId || !productId) {
      return NextResponse.json({ message: "User ID and Product ID are required" }, { status: 400 })
    }

    const wishlistCollection = await getCollection("wishlists")

    // Remove product from wishlist
    await wishlistCollection.updateOne({ userId }, { $pull: { items: productId }, $set: { updatedAt: new Date() } })

    return NextResponse.json({
      message: "Product removed from wishlist",
      removed: true,
    })
  } catch (error) {
    console.error("Error removing from wishlist:", error)
    return NextResponse.json({ message: "An error occurred while removing from wishlist" }, { status: 500 })
  }
}
