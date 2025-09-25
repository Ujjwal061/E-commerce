import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Log all requests in development
  if (process.env.NODE_ENV === "development") {
    console.log(`[Middleware] ${request.method} ${request.nextUrl.pathname}`)
  }

  // Get user from cookies
  const userCookie = request.cookies.get("user")?.value
  let user = null

  if (userCookie) {
    try {
      user = JSON.parse(userCookie)
    } catch (error) {
      console.error("Error parsing user cookie:", error)
    }
  }

  // Admin route protection
  if (request.nextUrl.pathname.startsWith("/admin")) {
    // Skip middleware for static files
    if (
      request.nextUrl.pathname.includes("/_next") ||
      request.nextUrl.pathname.includes("/api/") ||
      request.nextUrl.pathname.includes("/images/") ||
      request.nextUrl.pathname.includes("/fonts/")
    ) {
      return NextResponse.next()
    }

    if (!user || user.role !== "admin") {
      return NextResponse.redirect(new URL("/login", request.url))
    }
  }

  // User dashboard protection
  if (request.nextUrl.pathname.startsWith("/dashboard")) {
    if (!user) {
      return NextResponse.redirect(new URL("/login", request.url))
    }
  }

  // Continue to the requested resource
  return NextResponse.next()
}

// Configure middleware to run on specific paths
export const config = {
  matcher: [
    // Apply to all admin routes
    "/admin/:path*",
    // Apply to all dashboard routes
    "/dashboard/:path*",
  ],
}
