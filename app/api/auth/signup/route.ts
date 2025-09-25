import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import bcrypt from "bcryptjs"

// Use dynamic import for email functions to prevent build-time issues
const getEmailFunctions = async () => {
  const emailModule = await import("@/lib/email")
  return {
    sendEmail: emailModule.sendEmail,
    getRegistrationEmailTemplate: emailModule.getRegistrationEmailTemplate,
  }
}

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json()

    if (!name || !email || !password) {
      return NextResponse.json({ message: "Name, email, and password are required" }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ message: "Invalid email format" }, { status: 400 })
    }

    // Validate password strength
    if (password.length < 6) {
      return NextResponse.json({ message: "Password must be at least 6 characters long" }, { status: 400 })
    }

    const { db } = await connectToDatabase()
    const usersCollection = db.collection("users")

    // Check if user already exists
    const existingUser = await usersCollection.findOne({ email: email.toLowerCase() })
    if (existingUser) {
      return NextResponse.json({ message: "User with this email already exists" }, { status: 409 })
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create new user
    const newUser = {
      name: name.trim(),
      email: email.toLowerCase(),
      password: hashedPassword,
      role: "user",
      emailVerified: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      cart: [],
      wishlist: [],
      orders: [],
    }

    const result = await usersCollection.insertOne(newUser)

    // Send welcome email - wrapped in try/catch to prevent build errors
    try {
      const { sendEmail, getRegistrationEmailTemplate } = await getEmailFunctions()
      await sendEmail({
        to: email,
        subject: "Welcome to ShopEase - Registration Successful!",
        html: getRegistrationEmailTemplate(name),
      })
      console.log("Welcome email sent successfully to:", email)
    } catch (emailError) {
      console.error("Failed to send welcome email:", emailError)
      // Don't fail the registration if email fails
    }

    // Create user object without password
    const userResponse = {
      id: result.insertedId.toString(),
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      emailVerified: newUser.emailVerified,
      createdAt: newUser.createdAt,
    }

    return NextResponse.json({
      message: "User created successfully",
      user: userResponse,
    })
  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json({ message: "An error occurred during signup. Please try again." }, { status: 500 })
  }
}
