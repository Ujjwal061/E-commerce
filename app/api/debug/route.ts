import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

export async function GET() {
  try {
    // Test MongoDB connection
    const client = await clientPromise
    const isConnected = !!client && !!client.topology && client.topology.isConnected()

    return NextResponse.json({
      status: "ok",
      mongodb: isConnected ? "connected" : "disconnected",
      env: {
        NODE_ENV: process.env.NODE_ENV,
        MONGODB_URI_SET: !!process.env.MONGODB_URI,
      },
    })
  } catch (error) {
    console.error("Debug API error:", error)
    return NextResponse.json(
      {
        status: "error",
        message: error instanceof Error ? error.message : String(error),
        stack: process.env.NODE_ENV === "development" ? (error instanceof Error ? error.stack : null) : null,
      },
      { status: 500 },
    )
  }
}
