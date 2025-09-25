import { type NextRequest, NextResponse } from "next/server"
import { getAll, create, COLLECTIONS } from "@/lib/db-service"
import { connectToDatabase } from "@/lib/mongodb"

// Get all products
export async function GET(request: NextRequest) {
  try {
    console.log("Products API: Starting to fetch products")

    // Test database connection first
    try {
      await connectToDatabase()
      console.log("Products API: Database connection successful")
    } catch (dbError) {
      console.error("Products API: Database connection failed:", dbError)
      return NextResponse.json(
        {
          error: "Database connection failed",
          details: dbError instanceof Error ? dbError.message : "Unknown error",
        },
        { status: 500 },
      )
    }

    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const search = searchParams.get("search")
    const featured = searchParams.get("featured")
    const limit = searchParams.get("limit")

    // Build query filter
    const filter: any = {}

    if (category && category !== "") {
      filter.category = category
    }

    if (featured === "true") {
      filter.featured = true
    }

    console.log("Products API: Fetching with filter:", filter)

    // Get products from MongoDB
    const products = await getAll(COLLECTIONS.PRODUCTS, filter)

    console.log(`Products API: Found ${products.length} products`)

    // Apply text search if provided
    let filteredProducts = products
    if (search) {
      const searchLower = search.toLowerCase()
      filteredProducts = products.filter(
        (product: any) =>
          product.name.toLowerCase().includes(searchLower) ||
          (product.description && product.description.toLowerCase().includes(searchLower)),
      )
    }

    // Apply limit if provided
    if (limit) {
      filteredProducts = filteredProducts.slice(0, Number.parseInt(limit))
    }

    return NextResponse.json(filteredProducts)
  } catch (error) {
    console.error("Products API: Error getting products:", error)
    return NextResponse.json(
      {
        error: "Failed to get products from database",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

// Create a new product
export async function POST(request: NextRequest) {
  try {
    console.log("Products API: Creating new product")

    // Test database connection first
    try {
      await connectToDatabase()
      console.log("Products API: Database connection successful for creation")
    } catch (dbError) {
      console.error("Products API: Database connection failed for creation:", dbError)
      return NextResponse.json(
        {
          error: "Database connection failed",
          details: dbError instanceof Error ? dbError.message : "Unknown error",
        },
        { status: 500 },
      )
    }

    const body = await request.json()
    const { name, description, price, image, stock, category, featured } = body

    if (!name || !description || price === undefined || stock === undefined) {
      return NextResponse.json({ error: "Required fields missing" }, { status: 400 })
    }

    const newProduct = {
      name,
      description,
      price: Number.parseFloat(price),
      image: image || "/placeholder.svg?height=300&width=300",
      stock: Number.parseInt(stock),
      category: category || "uncategorized",
      featured: featured || false,
    }

    console.log("Products API: Creating product:", newProduct)

    const product = await create(COLLECTIONS.PRODUCTS, newProduct)

    console.log("Products API: Product created successfully:", product)

    return NextResponse.json({
      success: true,
      product,
    })
  } catch (error) {
    console.error("Products API: Error creating product:", error)
    return NextResponse.json(
      {
        error: "Failed to create product in database",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
