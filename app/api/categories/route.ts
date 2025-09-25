import { type NextRequest, NextResponse } from "next/server"
import { getAll, create, COLLECTIONS } from "@/lib/db-service"

// Get all categories
export async function GET() {
  try {
    console.log("Fetching categories from MongoDB...")
    const categories = await getAll(COLLECTIONS.CATEGORIES)
    console.log(`Found ${categories.length} categories`)
    return NextResponse.json(categories)
  } catch (error) {
    console.error("Error getting categories:", error)
    return NextResponse.json(
      {
        error: "Failed to get categories",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

// Create a new category
export async function POST(request: NextRequest) {
  try {
    console.log("Creating new category...")
    const body = await request.json()
    const { name, description, image } = body

    if (!name || name.trim() === "") {
      return NextResponse.json({ error: "Category name is required" }, { status: 400 })
    }

    const newCategory = {
      name: name.trim(),
      description: description?.trim() || "",
      image: image || "/placeholder.svg?height=200&width=200",
    }

    console.log("Creating category with data:", newCategory)
    const category = await create(COLLECTIONS.CATEGORIES, newCategory)
    console.log("Category created successfully:", category.id)

    return NextResponse.json({
      success: true,
      category,
      message: "Category created successfully",
    })
  } catch (error) {
    console.error("Error creating category:", error)
    return NextResponse.json(
      {
        error: "Failed to create category",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
