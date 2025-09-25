import { type NextRequest, NextResponse } from "next/server"
import { ObjectId } from "mongodb"
import { getCollection, normalizeId } from "@/lib/db-service"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, error: "Invalid offer ID" }, { status: 400 })
    }

    const collection = await getCollection("offers")
    const offer = await collection.findOne({ _id: new ObjectId(id) })

    if (!offer) {
      return NextResponse.json({ success: false, error: "Offer not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      offer: normalizeId(offer),
    })
  } catch (error) {
    console.error("Error fetching offer:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch offer" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const body = await request.json()
    const { name, description, originalPrice, offerPrice, discount, image, badge, stock, active } = body

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, error: "Invalid offer ID" }, { status: 400 })
    }

    // Validate required fields
    if (!name || !originalPrice || !offerPrice || !image) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    // Validate numeric fields
    const numOriginalPrice = Number(originalPrice)
    const numOfferPrice = Number(offerPrice)
    const numStock = Number(stock)

    if (isNaN(numOriginalPrice) || isNaN(numOfferPrice) || isNaN(numStock)) {
      return NextResponse.json({ success: false, error: "Invalid numeric values" }, { status: 400 })
    }

    if (numOriginalPrice <= 0 || numOfferPrice <= 0) {
      return NextResponse.json({ success: false, error: "Prices must be greater than 0" }, { status: 400 })
    }

    if (numOfferPrice >= numOriginalPrice) {
      return NextResponse.json(
        { success: false, error: "Offer price must be less than original price" },
        { status: 400 },
      )
    }

    const collection = await getCollection("offers")

    const updateData = {
      name: name.trim(),
      description: description?.trim() || "",
      originalPrice: numOriginalPrice,
      offerPrice: numOfferPrice,
      discount: Number(discount) || Math.round(((numOriginalPrice - numOfferPrice) / numOriginalPrice) * 100),
      image: image.trim(),
      badge: badge || "Hot Deal",
      stock: numStock,
      active: Boolean(active),
      updatedAt: new Date(),
    }

    const result = await collection.updateOne({ _id: new ObjectId(id) }, { $set: updateData })

    if (result.matchedCount === 0) {
      return NextResponse.json({ success: false, error: "Offer not found" }, { status: 404 })
    }

    const updatedOffer = await collection.findOne({ _id: new ObjectId(id) })

    return NextResponse.json({
      success: true,
      offer: normalizeId(updatedOffer),
      message: "Offer updated successfully",
    })
  } catch (error) {
    console.error("Error updating offer:", error)
    return NextResponse.json({ success: false, error: "Failed to update offer" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, error: "Invalid offer ID" }, { status: 400 })
    }

    const collection = await getCollection("offers")
    const result = await collection.deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount === 0) {
      return NextResponse.json({ success: false, error: "Offer not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "Offer deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting offer:", error)
    return NextResponse.json({ success: false, error: "Failed to delete offer" }, { status: 500 })
  }
}
