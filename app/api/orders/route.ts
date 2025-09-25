import { type NextRequest, NextResponse } from "next/server"
import { getCollection, normalizeId } from "@/lib/db-service"

// Get all orders or orders for a specific user
export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get("userId")
    const limit = request.nextUrl.searchParams.get("limit")

    const collection = await getCollection("orders")

    let query = {}

    // If userId is provided, filter orders by user
    if (userId) {
      query = { userId }
    }

    let ordersQuery = collection.find(query).sort({ createdAt: -1 })

    // Apply limit if provided
    if (limit) {
      const limitNum = Number.parseInt(limit, 10)
      if (!isNaN(limitNum) && limitNum > 0) {
        ordersQuery = ordersQuery.limit(limitNum)
      }
    }

    const orders = await ordersQuery.toArray()

    // Normalize the orders data and ensure proper structure
    const normalizedOrders = normalizeId(orders).map((order: { items: any; customer: any; status: any; total: any; subtotal: any; tax: any; shipping: any; createdAt: any }) => ({
      ...order,
      items: order.items || [],
      customer: order.customer || {},
      status: order.status || "pending",
      total: order.total || 0,
      subtotal: order.subtotal || 0,
      tax: order.tax || 0,
      shipping: order.shipping || 0,
      createdAt: order.createdAt || new Date().toISOString(),
    }))

    return NextResponse.json(normalizedOrders)
  } catch (error) {
    console.error("Error getting orders:", error)
    return NextResponse.json({ error: "Failed to get orders" }, { status: 500 })
  }
}

// Create a new order
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, items, customer, paymentMethod, paymentDetails, subtotal, tax, shipping, total, status } = body

    if (!userId || !items || !total || !customer) {
      return NextResponse.json({ error: "Required fields missing" }, { status: 400 })
    }

    // Validate items structure
    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Order must contain at least one item" }, { status: 400 })
    }

    // Ensure each item has required fields
    const validatedItems = items.map((item) => ({
      id: item.id || item.productId,
      name: item.name || item.title,
      price: Number.parseFloat(item.price) || 0,
      quantity: Number.parseInt(item.quantity) || 1,
      image: item.image || item.imageUrl || null,
      category: item.category || null,
    }))

    const collection = await getCollection("orders")

    const newOrder = {
      userId,
      items: validatedItems,
      customer: {
        name: customer.name || customer.fullName,
        email: customer.email,
        phone: customer.phone || null,
        address:
          customer.address ||
          `${customer.addressLine1 || ""} ${customer.addressLine2 || ""} ${customer.city || ""} ${customer.state || ""} ${customer.postalCode || ""}`.trim(),
      },
      paymentMethod: paymentMethod || "cash",
      paymentDetails: paymentDetails || {},
      subtotal: Number.parseFloat(subtotal) || 0,
      tax: Number.parseFloat(tax) || 0,
      shipping: Number.parseFloat(shipping) || 0,
      total: Number.parseFloat(total),
      status: status || "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await collection.insertOne(newOrder)
    const orderId = result.insertedId.toString()

    // Create order object for response
    const orderForResponse = {
      id: orderId,
      ...newOrder,
    }

    // Send emails (with error handling to prevent build failures)
    try {
      const { sendEmail, getOrderConfirmationEmailTemplate, getVendorOrderNotificationTemplate } = await import(
        "@/lib/email"
      )

      // Send confirmation email to customer
      if (customer.email) {
        await sendEmail({
          to: customer.email,
          subject: `Order Confirmation - ${orderId}`,
          html: getOrderConfirmationEmailTemplate(orderForResponse),
        })
      }

      // Send notification email to vendor
      const vendorEmail = process.env.VENDOR_EMAIL
      if (vendorEmail) {
        await sendEmail({
          to: vendorEmail,
          subject: `New Order Received - ${orderId}`,
          html: getVendorOrderNotificationTemplate(orderForResponse),
        })
      }
    } catch (emailError) {
      console.error("Email sending failed:", emailError)
      // Don't fail the order creation if email fails
    }

    // Clear the user's cart after successful order (with error handling)
    try {
      if (result.insertedId && userId) {
        const cartCollection = await getCollection("cart")
        await cartCollection.updateOne({ userId }, { $set: { items: [] } }, { upsert: false })
      }
    } catch (cartError) {
      console.error("Cart clearing failed:", cartError)
      // Don't fail the order creation if cart clearing fails
    }

    return NextResponse.json({
      success: true,
      orderId: orderId,
      order: normalizeId(orderForResponse),
    })
  } catch (error) {
    console.error("Error creating order:", error)
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
  }
}
