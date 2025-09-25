import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

// Default offer products if none are found in the database
const defaultOfferProducts = [
  {
    id: "offer1",
    name: "Premium Wireless Headphones",
    description: "Noise cancellation technology with 30-hour battery life",
    originalPrice: 14999,
    offerPrice: 11249,
    discount: 25,
    image: "https://placehold.co/400x400/222222/FFFFFF?text=Headphones",
    badge: "Best Seller",
    stock: 15,
  },
  {
    id: "offer2",
    name: "Smart Fitness Watch",
    description: "Track your health metrics and stay connected on the go",
    originalPrice: 18749,
    offerPrice: 13499,
    discount: 28,
    image: "https://placehold.co/400x400/333333/FFFFFF?text=Fitness+Watch",
    badge: "Limited Time",
    stock: 8,
  },
  {
    id: "offer3",
    name: "Ultra HD 4K Camera",
    description: "Capture stunning photos and videos with professional quality",
    originalPrice: 44999,
    offerPrice: 33749,
    discount: 25,
    image: "https://placehold.co/400x400/444444/FFFFFF?text=Camera",
    badge: "Hot Deal",
    stock: 5,
  },
]

export async function GET() {
  try {
    const { db } = await connectToDatabase()

    // Try to get offers from the database
    let offers = await db.collection("offers").find({}).toArray()

    // If no offers found, seed with default data
    if (!offers || offers.length === 0) {
      console.log("No offers found in database, using default offers")

      // Try to insert default offers
      try {
        await db.collection("offers").insertMany(defaultOfferProducts)
        offers = defaultOfferProducts
      } catch (seedError) {
        console.error("Error seeding default offers:", seedError)
        offers = defaultOfferProducts
      }
    }

    return NextResponse.json({
      success: true,
      offers,
    })
  } catch (error) {
    console.error("Error fetching special offers:", error)

    // Return default offers as fallback
    return NextResponse.json({
      success: true,
      offers: defaultOfferProducts,
    })
  }
}
