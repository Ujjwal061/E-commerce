import { type NextRequest, NextResponse } from "next/server"
import { migrateFromLocalStorage } from "@/lib/db-service"

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const result = await migrateFromLocalStorage(data)
    return NextResponse.json(result)
  } catch (error) {
    console.error("Error migrating data:", error)
    return NextResponse.json({ error: "Failed to migrate data" }, { status: 500 })
  }
}
