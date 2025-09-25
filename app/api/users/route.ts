import { type NextRequest, NextResponse } from "next/server"
import { getCollection, normalizeId } from "@/lib/db-service"

export async function GET(request: NextRequest) {
  try {
    const role = request.nextUrl.searchParams.get("role")
    const usersCollection = await getCollection("users")

    let query = {}
    if (role) {
      query = { role }
    }

    const users = await usersCollection.find(query).toArray()

    // Remove passwords from the response
    const usersWithoutPasswords = users.map((user) => {
      const { password, ...userWithoutPassword } = user
      return userWithoutPassword
    })

    return NextResponse.json(normalizeId(usersWithoutPasswords))
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json({ message: "An error occurred while fetching users" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const { email, password, name, role = "user" } = data

    if (!email || !password || !name) {
      return NextResponse.json({ message: "Email, password, and name are required" }, { status: 400 })
    }

    const usersCollection = await getCollection("users")

    // Check if user already exists
    const existingUser = await usersCollection.findOne({ email })
    if (existingUser) {
      return NextResponse.json({ message: "User with this email already exists" }, { status: 409 })
    }

    // Create new user
    const newUser = {
      email,
      password, // In a real app, this should be hashed
      name,
      role,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await usersCollection.insertOne(newUser)

    // Don't return the password
    const { password: _, ...userWithoutPassword } = newUser

    return NextResponse.json({
      ...userWithoutPassword,
      id: result.insertedId.toString(),
    })
  } catch (error) {
    console.error("Error creating user:", error)
    return NextResponse.json({ message: "An error occurred while creating user" }, { status: 500 })
  }
}
