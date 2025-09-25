import { NextResponse } from "next/server"
import { getCollection, normalizeId } from "@/lib/db-service"

export async function GET() {
  try {
    const collection = await getCollection("offers")
    const offers = await collection.find({}).sort({ createdAt: -1 }).toArray()

    const normalizedOffers = normalizeId(offers)

    return NextResponse.json({
      success: true,
      offers: normalizedOffers || [],
    })
  } catch (error) {
    console.error("Error fetching offers:", error)

    // Return empty array as fallback
    return NextResponse.json({
      success: true,
      offers: [],
    })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, description, originalPrice, offerPrice, discount, image, badge, stock, active } = body

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

    const offerData = {
      name: name.trim(),
      description: description?.trim() || "",
      originalPrice: numOriginalPrice,
      offerPrice: numOfferPrice,
      discount: Number(discount) || Math.round(((numOriginalPrice - numOfferPrice) / numOriginalPrice) * 100),
      image: image.trim(),
      badge: badge || "Hot Deal",
      stock: numStock,
      active: Boolean(active),
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await collection.insertOne(offerData)
    const insertedOffer = await collection.findOne({ _id: result.insertedId })

    return NextResponse.json({
      success: true,
      offer: normalizeId(insertedOffer),
      message: "Offer created successfully",
    })
  } catch (error) {
    console.error("Error creating offer:", error)
    return NextResponse.json({ success: false, error: "Failed to create offer" }, { status: 500 })
  }
}
