import { type NextRequest, NextResponse } from "next/server"
import * as dbService from "@/lib/db-service"
import { COLLECTIONS } from "@/lib/db-service"
import { ObjectId } from "mongodb"
import clientPromise from "@/lib/mongodb"
import { handleApiError } from "@/lib/api-error"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const product = await dbService.getById(COLLECTIONS.PRODUCTS, params.id)

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error("Error fetching product:", error)
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    console.log("PUT request received for product ID:", params.id)

    // Parse the request body
    const data = await request.json()
    console.log("Request data:", data)

    // Try direct MongoDB update as a fallback
    try {
      const client = await clientPromise
      const db = client.db("ecommerce")
      const collection = db.collection(COLLECTIONS.PRODUCTS)

      let docId
      try {
        docId = new ObjectId(params.id)
      } catch (error) {
        docId = params.id
      }

      console.log("Using MongoDB ID:", docId)

      // Perform the update directly
      const updateResult = await collection.updateOne({ _id: docId }, { $set: data })

      console.log("Direct MongoDB update result:", updateResult)

      if (updateResult.matchedCount === 0) {
        return NextResponse.json({ error: "Product not found" }, { status: 404 })
      }

      if (updateResult.modifiedCount === 0) {
        console.log("No changes were made to the document")
      }

      // Get the updated product
      const updatedProduct = await collection.findOne({ _id: docId })

      if (!updatedProduct) {
        return NextResponse.json({ error: "Failed to retrieve updated product" }, { status: 500 })
      }

      // Convert _id to id for the response
      const { _id, ...rest } = updatedProduct
      const normalizedProduct = { id: _id.toString(), ...rest }

      return NextResponse.json(normalizedProduct)
    } catch (mongoError) {
      console.error("Direct MongoDB update failed:", mongoError)

      // Fall back to the dbService
      console.log("Falling back to dbService.update")
      const product = await dbService.update(COLLECTIONS.PRODUCTS, params.id, data)
      return NextResponse.json(product)
    }
  } catch (error) {
    console.error("Error updating product:", error)
    return handleApiError(error, "Failed to update product")
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbService.remove(COLLECTIONS.PRODUCTS, params.id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting product:", error)
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 })
  }
}
