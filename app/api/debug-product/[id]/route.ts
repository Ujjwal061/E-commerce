import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import { COLLECTIONS } from "@/lib/db-service"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const client = await clientPromise
    const db = client.db("ecommerce")

    // Try to convert to ObjectId, but if it fails, use the string id
    let docId
    try {
      docId = new ObjectId(params.id)
      console.log("Successfully converted to ObjectId:", docId)
    } catch (error) {
      docId = params.id
      console.log("Using string ID:", docId)
    }

    // Try to find the product with both the ObjectId and string id
    const productWithObjectId = await db.collection(COLLECTIONS.PRODUCTS).findOne({ _id: docId })

    // Also try with string id for comparison
    const productWithStringId = await db.collection(COLLECTIONS.PRODUCTS).findOne({ _id: params.id })

    // Get all products to check if the product exists with a different id format
    const allProducts = await db.collection(COLLECTIONS.PRODUCTS).find({}).toArray()
    const matchingProducts = allProducts.filter((p) => p._id.toString() === params.id || (p.id && p.id === params.id))

    return NextResponse.json({
      requestedId: params.id,
      objectIdVersion: docId instanceof ObjectId ? docId.toString() : docId,
      productWithObjectId,
      productWithStringId,
      matchingProducts,
      allProductIds: allProducts.map((p) => ({
        _id: p._id.toString(),
        id: p.id,
      })),
    })
  } catch (error) {
    console.error("Error in debug endpoint:", error)
    return NextResponse.json(
      {
        error: "Failed to debug product",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
