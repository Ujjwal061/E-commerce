import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { COLLECTIONS } from "@/lib/db-service"

// Sample data
const sampleCategories = [
  {
    name: "Electronics",
    description: "Electronic devices and gadgets",
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    name: "Clothing",
    description: "Fashion and apparel",
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    name: "Home & Kitchen",
    description: "Home appliances and kitchen essentials",
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    name: "Books",
    description: "Books and educational materials",
    image: "/placeholder.svg?height=200&width=200",
  },
]

const sampleProducts = [
  {
    name: "Smartphone X",
    description: "Latest smartphone with advanced features",
    price: 999.99,
    stock: 50,
    category: "Electronics",
    image: "/placeholder.svg?height=300&width=300",
    featured: true,
  },
  {
    name: "Laptop Pro",
    description: "High-performance laptop for professionals",
    price: 1499.99,
    stock: 25,
    category: "Electronics",
    image: "/placeholder.svg?height=300&width=300",
    featured: true,
  },
  {
    name: "Cotton T-Shirt",
    description: "Comfortable cotton t-shirt for everyday wear",
    price: 19.99,
    stock: 100,
    category: "Clothing",
    image: "/placeholder.svg?height=300&width=300",
    featured: false,
  },
  {
    name: "Coffee Maker",
    description: "Automatic coffee maker for your kitchen",
    price: 89.99,
    stock: 30,
    category: "Home & Kitchen",
    image: "/placeholder.svg?height=300&width=300",
    featured: true,
  },
  {
    name: "Novel Collection",
    description: "Collection of bestselling novels",
    price: 49.99,
    stock: 20,
    category: "Books",
    image: "/placeholder.svg?height=300&width=300",
    featured: false,
  },
]

export async function POST() {
  try {
    const { db } = await connectToDatabase()

    // Create collections if they don't exist
    const collections = await db.listCollections().toArray()
    const collectionNames = collections.map((col) => col.name)

    if (!collectionNames.includes(COLLECTIONS.CATEGORIES)) {
      await db.createCollection(COLLECTIONS.CATEGORIES)
    }

    if (!collectionNames.includes(COLLECTIONS.PRODUCTS)) {
      await db.createCollection(COLLECTIONS.PRODUCTS)
    }

    // Seed categories
    const categoriesCollection = db.collection(COLLECTIONS.CATEGORIES)
    const categoriesResult = await categoriesCollection.insertMany(
      sampleCategories.map((category) => ({
        ...category,
        createdAt: new Date(),
        updatedAt: new Date(),
      })),
    )

    // Get the inserted categories to reference in products
    const insertedCategories = await categoriesCollection.find({}).toArray()

    // Seed products with proper category references
    const productsCollection = db.collection(COLLECTIONS.PRODUCTS)
    const productsWithCategoryIds = sampleProducts.map((product) => {
      const categoryDoc = insertedCategories.find((cat) => cat.name === product.category)
      return {
        ...product,
        category: categoryDoc ? categoryDoc._id.toString() : null,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    })

    const productsResult = await productsCollection.insertMany(productsWithCategoryIds)

    return NextResponse.json({
      success: true,
      message: "Database seeded successfully",
      categories: {
        inserted: categoriesResult.insertedCount,
      },
      products: {
        inserted: productsResult.insertedCount,
      },
    })
  } catch (error) {
    console.error("Error seeding database:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to seed database",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
