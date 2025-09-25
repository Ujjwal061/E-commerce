import { type NextRequest, NextResponse } from "next/server"
import { getCollection, normalizeId, createObjectId } from "@/lib/db-service"

// Get a specific order
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    if (!id) {
      return NextResponse.json({ error: "Order ID is required" }, { status: 400 })
    }

    const collection = await getCollection("orders")

    // Try to convert to ObjectId, but if it fails, return an error
    let orderId
    try {
      orderId = createObjectId(id)
    } catch (error) {
      return NextResponse.json({ error: "Invalid Order ID format" }, { status: 400 })
    }

    const order = await collection.findOne({ _id: orderId })

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    return NextResponse.json(normalizeId(order))
  } catch (error) {
    console.error("Error getting order:", error)
    return NextResponse.json({ error: "Failed to get order" }, { status: 500 })
  }
}

// Update an order
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const body = await request.json()

    if (!id) {
      return NextResponse.json({ error: "Order ID is required" }, { status: 400 })
    }

    const collection = await getCollection("orders")

    // Try to convert to ObjectId, but if it fails, return an error
    let orderId
    try {
      orderId = createObjectId(id)
    } catch (error) {
      return NextResponse.json({ error: "Invalid Order ID format" }, { status: 400 })
    }

    // Remove id from update data if present
    const { id: _, _id, ...updateData } = body

    // Add updatedAt timestamp
    updateData.updatedAt = new Date()

    const result = await collection.updateOne({ _id: orderId }, { $set: updateData })

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    // Get the updated order
    const updatedOrder = await collection.findOne({ _id: orderId })

    return NextResponse.json(normalizeId(updatedOrder))
  } catch (error) {
    console.error("Error updating order:", error)
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 })
  }
}

// Delete an order
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = params.id

    if (!id) {
      return NextResponse.json({ error: "Order ID is required" }, { status: 400 })
    }

    const collection = await getCollection("orders")

    // Try to convert to ObjectId, but if it fails, return an error
    let orderId
    try {
      orderId = createObjectId(id)
    } catch (error) {
      return NextResponse.json({ error: "Invalid Order ID format" }, { status: 400 })
    }

    const result = await collection.deleteOne({ _id: orderId })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: "Order deleted successfully" })
  } catch (error) {
    console.error("Error deleting order:", error)
    return NextResponse.json({ error: "Failed to delete order" }, { status: 500 })
  }
}
