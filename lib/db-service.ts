import { connectToDatabase } from "./mongodb"
import { type Collection, ObjectId } from "mongodb"

// Collection names constant
export const COLLECTIONS = {
  PRODUCTS: "products",
  USERS: "users",
  ORDERS: "orders",
  CATEGORIES: "categories",
  REVIEWS: "reviews",
  ADVERTISEMENTS: "advertisements",
  HERO_SLIDES: "hero_slides",
  TESTIMONIALS: "testimonials",
  OFFERS: "offers",
  SPLIT_CARDS: "split_cards",
  ANIMATED_BANNERS: "animated_banners",
  CART: "cart",
  WISHLIST: "wishlist",
} as const

export async function getCollection(collectionName: string): Promise<Collection> {
  try {
    const { db } = await connectToDatabase()
    return db.collection(collectionName)
  } catch (error) {
    console.error(`Error getting collection ${collectionName}:`, error)
    throw error
  }
}

export function normalizeId(doc: any): any {
  if (!doc) return doc

  if (Array.isArray(doc)) {
    return doc.map((item) => normalizeId(item))
  }

  if (doc._id) {
    const { _id, ...rest } = doc
    return {
      id: _id.toString(),
      ...rest,
    }
  }

  return doc
}

export function createObjectId(id?: string): ObjectId {
  return id ? new ObjectId(id) : new ObjectId()
}

// Generic CRUD operations with better error handling
export async function getAll(collectionName: string, filter: any = {}, options: any = {}) {
  try {
    console.log(`Fetching all documents from ${collectionName} with filter:`, filter)
    const collection = await getCollection(collectionName)
    const documents = await collection.find(filter, options).toArray()
    console.log(`Found ${documents.length} documents in ${collectionName}`)
    return normalizeId(documents)
  } catch (error) {
    console.error(`Error getting all from ${collectionName}:`, error)
    // Return empty array instead of throwing to prevent UI crashes
    return []
  }
}

export async function getById(collectionName: string, id: string) {
  try {
    console.log(`Fetching document by id ${id} from ${collectionName}`)
    const collection = await getCollection(collectionName)
    const document = await collection.findOne({ _id: createObjectId(id) })
    console.log(`Document found:`, document ? "Yes" : "No")
    return normalizeId(document)
  } catch (error) {
    console.error(`Error getting document by id from ${collectionName}:`, error)
    return null
  }
}

export async function create(collectionName: string, data: any) {
  try {
    console.log(`Creating new document in ${collectionName}:`, data)
    const collection = await getCollection(collectionName)
    const result = await collection.insertOne({
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    const document = await collection.findOne({ _id: result.insertedId })
    console.log(`Document created successfully with id: ${result.insertedId}`)
    return normalizeId(document)
  } catch (error) {
    console.error(`Error creating document in ${collectionName}:`, error)
    throw error
  }
}

export async function update(collectionName: string, id: string, data: any) {
  try {
    console.log(`Updating document ${id} in ${collectionName}:`, data)
    const collection = await getCollection(collectionName)
    const { id: _, ...updateData } = data

    const result = await collection.updateOne(
      { _id: createObjectId(id) },
      {
        $set: {
          ...updateData,
          updatedAt: new Date(),
        },
      },
    )

    if (result.matchedCount === 0) {
      throw new Error("Document not found")
    }

    const document = await collection.findOne({ _id: createObjectId(id) })
    console.log(`Document updated successfully`)
    return normalizeId(document)
  } catch (error) {
    console.error(`Error updating document in ${collectionName}:`, error)
    throw error
  }
}

export async function remove(collectionName: string, id: string) {
  try {
    console.log(`Removing document ${id} from ${collectionName}`)
    const collection = await getCollection(collectionName)
    const result = await collection.deleteOne({ _id: createObjectId(id) })

    if (result.deletedCount === 0) {
      throw new Error("Document not found")
    }

    console.log(`Document removed successfully`)
    return { success: true, deletedCount: result.deletedCount }
  } catch (error) {
    console.error(`Error removing document from ${collectionName}:`, error)
    throw error
  }
}

export async function migrateFromLocalStorage(collectionName: string, localStorageKey: string) {
  try {
    console.log(`Migration from localStorage not applicable on server side for ${collectionName}`)
    return { success: true, message: "Migration not applicable on server side" }
  } catch (error) {
    console.error(`Error migrating from localStorage for ${collectionName}:`, error)
    throw error
  }
}

// Additional utility functions
export async function findOne(collectionName: string, filter: any) {
  try {
    const collection = await getCollection(collectionName)
    const document = await collection.findOne(filter)
    return normalizeId(document)
  } catch (error) {
    console.error(`Error finding document in ${collectionName}:`, error)
    return null
  }
}

export async function findMany(collectionName: string, filter: any = {}, options: any = {}) {
  try {
    const collection = await getCollection(collectionName)
    const documents = await collection.find(filter, options).toArray()
    return normalizeId(documents)
  } catch (error) {
    console.error(`Error finding documents in ${collectionName}:`, error)
    return []
  }
}

export async function count(collectionName: string, filter: any = {}) {
  try {
    const collection = await getCollection(collectionName)
    return await collection.countDocuments(filter)
  } catch (error) {
    console.error(`Error counting documents in ${collectionName}:`, error)
    return 0
  }
}

export async function aggregate(collectionName: string, pipeline: any[]) {
  try {
    const collection = await getCollection(collectionName)
    const result = await collection.aggregate(pipeline).toArray()
    return normalizeId(result)
  } catch (error) {
    console.error(`Error aggregating documents in ${collectionName}:`, error)
    return []
  }
}

// Bulk operations - MISSING EXPORTS ADDED HERE
export async function insertMany(collectionName: string, documents: any[]) {
  try {
    console.log(`Inserting ${documents.length} documents into ${collectionName}`)
    const collection = await getCollection(collectionName)
    const documentsWithTimestamps = documents.map((doc) => ({
      ...doc,
      createdAt: new Date(),
      updatedAt: new Date(),
    }))

    const result = await collection.insertMany(documentsWithTimestamps)
    console.log(`Successfully inserted ${result.insertedCount} documents`)
    return {
      success: true,
      insertedCount: result.insertedCount,
      insertedIds: Object.values(result.insertedIds).map((id) => id.toString()),
    }
  } catch (error) {
    console.error(`Error inserting many documents in ${collectionName}:`, error)
    throw error
  }
}

export async function updateMany(collectionName: string, filter: any, update: any) {
  try {
    console.log(`Updating multiple documents in ${collectionName}`)
    const collection = await getCollection(collectionName)
    const result = await collection.updateMany(filter, {
      $set: {
        ...update,
        updatedAt: new Date(),
      },
    })

    console.log(`Updated ${result.modifiedCount} documents`)
    return {
      success: true,
      matchedCount: result.matchedCount,
      modifiedCount: result.modifiedCount,
    }
  } catch (error) {
    console.error(`Error updating many documents in ${collectionName}:`, error)
    throw error
  }
}

export async function deleteMany(collectionName: string, filter: any) {
  try {
    console.log(`Deleting multiple documents from ${collectionName} with filter:`, filter)
    const collection = await getCollection(collectionName)
    const result = await collection.deleteMany(filter)

    console.log(`Successfully deleted ${result.deletedCount} documents`)
    return {
      success: true,
      deletedCount: result.deletedCount,
    }
  } catch (error) {
    console.error(`Error deleting many documents in ${collectionName}:`, error)
    throw error
  }
}

// Additional utility functions for better database management
export async function dropCollection(collectionName: string) {
  try {
    console.log(`Dropping collection ${collectionName}`)
    const collection = await getCollection(collectionName)
    await collection.drop()
    console.log(`Collection ${collectionName} dropped successfully`)
    return { success: true, message: `Collection ${collectionName} dropped` }
  } catch (error) {
    console.error(`Error dropping collection ${collectionName}:`, error)
    throw error
  }
}

export async function createIndex(collectionName: string, indexSpec: any, options: any = {}) {
  try {
    console.log(`Creating index on ${collectionName}:`, indexSpec)
    const collection = await getCollection(collectionName)
    const result = await collection.createIndex(indexSpec, options)
    console.log(`Index created successfully: ${result}`)
    return { success: true, indexName: result }
  } catch (error) {
    console.error(`Error creating index on ${collectionName}:`, error)
    throw error
  }
}

export async function listIndexes(collectionName: string) {
  try {
    const collection = await getCollection(collectionName)
    const indexes = await collection.listIndexes().toArray()
    return indexes
  } catch (error) {
    console.error(`Error listing indexes for ${collectionName}:`, error)
    return []
  }
}
