import { NextResponse } from "next/server"
import { getCollection } from "@/lib/db-service"
import { normalizeId } from "@/lib/db-service"
import { ObjectId } from "mongodb"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const usersCollection = await getCollection("users")

    const user = await usersCollection.findOne({ _id: new ObjectId(id) })

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    // Don't send the password back to the client
    const { password, ...userWithoutPassword } = user

    return NextResponse.json(normalizeId(userWithoutPassword))
  } catch (error) {
    console.error("Error fetching user:", error)
    return NextResponse.json({ message: "An error occurred while fetching user" }, { status: 500 })
  }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    const data = await request.json()
    const usersCollection = await getCollection("users")

    // Don't allow updating email or password through this endpoint
    const { email, password, ...updateData } = data

    const result = await usersCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { ...updateData, updatedAt: new Date() } },
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    const updatedUser = await usersCollection.findOne({ _id: new ObjectId(id) })

    // Don't send the password back to the client
    const { password: _, ...userWithoutPassword } = updatedUser!

    return NextResponse.json(normalizeId(userWithoutPassword))
  } catch (error) {
    console.error("Error updating user:", error)
    return NextResponse.json({ message: "An error occurred while updating user" }, { status: 500 })
  }
}
