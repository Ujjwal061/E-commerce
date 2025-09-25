import clientPromise from "@/lib/mongodb"

export async function getCollection(collectionName: string) {
  try {
    const client = await clientPromise
    const db = client.db("ecommerce")
    return db.collection(collectionName)
  } catch (error) {
    console.error(`Error getting collection ${collectionName}:`, error)
    throw error
  }
}
