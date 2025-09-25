import { type NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import { COLLECTIONS } from "@/lib/db-service"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    console.log("Direct update request for product ID:", params.id)

    // Parse the request body
    const data = await request.json()
    console.log("Request data:", data)

    const client = await clientPromise
    const db = client.db("ecommerce")
    const collection = db.collection(COLLECTIONS.PRODUCTS)

    // Try both ObjectId and string ID
    const results = []

    // Try with ObjectId
    try {
      const objectId = new ObjectId(params.id)
      console.log("Trying update with ObjectId:", objectId)

      const result1 = await collection.updateOne({ _id: objectId }, { $set: data })

      results.push({
        method: "ObjectId",
        result: result1,
      })
    } catch (error) {
      console.log("ObjectId update failed:", error)
    }

    // Try with string ID
    try {
      console.log("Trying update with string ID:", params.id)

      const result2 = await collection.updateOne({ _id: params.id }, { $set: data })

      results.push({
        method: "String ID",
        result: result2,
      })
    } catch (error) {
      console.log("String ID update failed:", error)
    }

    // Try with id field
    try {
      console.log("Trying update with id field:", params.id)

      const result3 = await collection.updateOne({ id: params.id }, { $set: data })

      results.push({
        method: "id field",
        result: result3,
      })
    } catch (error) {
      console.log("id field update failed:", error)
    }

    // Check if any update was successful
    const successful = results.some((r) => r.result.matchedCount > 0)

    if (!successful) {
      return NextResponse.json(
        {
          error: "Failed to update product",
          message: "No matching document found with any ID format",
          results,
        },
        { status: 404 },
      )
    }

    // Get the updated product
    let updatedProduct = null

    // Try to find with ObjectId
    try {
      const objectId = new ObjectId(params.id)
      updatedProduct = await collection.findOne({ _id: objectId })
    } catch (error) {
      // Try with string ID
      updatedProduct = await collection.findOne({ _id: params.id })

      // Try with id field
      if (!updatedProduct) {
        updatedProduct = await collection.findOne({ id: params.id })
      }
    }

    if (!updatedProduct) {
      return NextResponse.json(
        {
          error: "Failed to retrieve updated product",
          results,
        },
        { status: 500 },
      )
    }

    // Convert _id to id for the response
    const { _id, ...rest } = updatedProduct
    const normalizedProduct = { id: _id.toString(), ...rest }

    return NextResponse.json({
      product: normalizedProduct,
      results,
    })
  } catch (error) {
    console.error("Error in direct update:", error)
    return NextResponse.json(
      {
        error: "Failed to update product",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
