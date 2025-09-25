import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import bcrypt from "bcryptjs"

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ message: "Email and password are required" }, { status: 400 })
    }

    // Check for hardcoded admin credentials first
    if (email === "admin@gmail.com" && password === "Admin@12345") {
      const adminUser = {
        id: "admin_hardcoded",
        name: "Administrator",
        email: "admin@gmail.com",
        role: "admin" as const,
        emailVerified: true,
        createdAt: new Date().toISOString(),
        avatar: null,
        phone: null,
        address: null,
      }

      // Create response with user data
      const response = NextResponse.json({
        message: "Login successful",
        user: adminUser,
      })

      // Set cookie that expires in 24 hours
      response.cookies.set("user", JSON.stringify(adminUser), {
        httpOnly: false, // Need to be accessible from client-side JavaScript
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24, // 24 hours
        path: "/",
      })

      return response
    }

    // For demo purposes, let's create a mock regular user
    if (email === "user@example.com" && password === "password") {
      const regularUser = {
        id: "user_123",
        name: "John Doe",
        email: "user@example.com",
        role: "user" as const,
        emailVerified: true,
        createdAt: new Date().toISOString(),
        avatar: null,
        phone: null,
        address: null,
      }

      const response = NextResponse.json({
        message: "Login successful",
        user: regularUser,
      })

      response.cookies.set("user", JSON.stringify(regularUser), {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24,
        path: "/",
      })

      return response
    }

    // Try to authenticate against database
    try {
      const { db } = await connectToDatabase()
      const usersCollection = db.collection("users")

      // Find user by email (case insensitive)
      const user = await usersCollection.findOne({ email: email.toLowerCase() })

      if (user) {
        // Check password
        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (isPasswordValid) {
          // Update last login
          await usersCollection.updateOne(
            { _id: user._id },
            {
              $set: {
                lastLogin: new Date(),
                updatedAt: new Date(),
              },
            },
          )

          // Create user object without password
          const userResponse = {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role || "user",
            emailVerified: user.emailVerified || false,
            createdAt: user.createdAt,
            avatar: user.avatar || null,
            phone: user.phone || null,
            address: user.address || null,
          }

          const response = NextResponse.json({
            message: "Login successful",
            user: userResponse,
          })

          // Set cookie
          response.cookies.set("user", JSON.stringify(userResponse), {
            httpOnly: false,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24, // 24 hours
            path: "/",
          })

          return response
        }
      }
    } catch (dbError) {
      console.error("Database authentication error:", dbError)
      // Continue to fallback authentication if database fails
    }

    // If no matching credentials found
    return NextResponse.json({ message: "Invalid email or password" }, { status: 401 })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ message: "An error occurred during login. Please try again." }, { status: 500 })
  }
}
