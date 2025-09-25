import { type NextRequest, NextResponse } from "next/server"
import * as dbService from "@/lib/db-service"
import { COLLECTIONS } from "@/lib/db-service"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function POST(request: NextRequest) {
  try {
    const { productId, updateData } = await request.json()

    if (!productId) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 })
    }

    console.log("Testing product update for ID:", productId)
    console.log("Update data:", updateData)

    // First, try to get the product directly from MongoDB
    const client = await clientPromise
    const db = client.db("ecommerce")

    let docId
    try {
      docId = new ObjectId(productId)
    } catch (error) {
      docId = productId
    }

    const product = await db.collection(COLLECTIONS.PRODUCTS).findOne({ _id: docId })

    if (!product) {
      return NextResponse.json({ error: "Product not found in database" }, { status: 404 })
    }

    console.log("Found product:", product)

    // Now try to update it directly with MongoDB
    const updateResult = await db.collection(COLLECTIONS.PRODUCTS).updateOne({ _id: docId }, { $set: updateData })

    console.log("Direct MongoDB update result:", updateResult)

    // Now try with our service
    const serviceResult = await dbService.update(COLLECTIONS.PRODUCTS, productId, updateData)

    return NextResponse.json({
      success: true,
      product,
      directUpdateResult: updateResult,
      serviceUpdateResult: serviceResult,
    })
  } catch (error) {
    console.error("Error in test product update:", error)
    return NextResponse.json(
      {
        error: "Test failed",
        message: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 },
    )
  }
}
