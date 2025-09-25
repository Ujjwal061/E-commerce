import nodemailer from "nodemailer"

const transporter = nodemailer.createTransporter({
  host: process.env.SMTP_HOST,
  port: Number.parseInt(process.env.SMTP_PORT || "587"),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string
  subject: string
  html: string
}) {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html,
    })
    return { success: true }
  } catch (error) {
    console.error("Email sending failed:", error)
    return { success: false, error }
  }
}

export function getRegistrationEmailTemplate(name: string) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Welcome to ShopEase</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4;">
      <div style="max-width: 600px; margin: 0 auto; background-color: white; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
        <div style="background: linear-gradient(135deg, #1e40af, #3b82f6); color: white; padding: 40px 30px; text-align: center;">
          <h1 style="margin: 0; font-size: 32px; font-weight: bold;">🎉 Welcome to ShopEase!</h1>
          <p style="margin: 15px 0 0 0; font-size: 18px; opacity: 0.9;">Your shopping journey begins here</p>
        </div>
        
        <div style="padding: 40px 30px;">
          <h2 style="color: #1e40af; margin-top: 0; font-size: 24px;">Hello ${name}! 👋</h2>
          
          <p style="font-size: 16px; margin-bottom: 20px;">
            Thank you for joining the ShopEase family! Your account has been successfully created and you're now ready to explore our amazing collection of products.
          </p>
          
          <div style="background: #f8fafc; padding: 25px; border-radius: 8px; margin: 25px 0;">
            <h3 style="color: #1e40af; margin-top: 0; font-size: 18px;">🚀 What you can do now:</h3>
            <ul style="margin: 15px 0; padding-left: 20px;">
              <li style="margin-bottom: 8px;">🛍️ Browse our wide selection of premium products</li>
              <li style="margin-bottom: 8px;">❤️ Add your favorite items to wishlist</li>
              <li style="margin-bottom: 8px;">🛒 Add products to cart and checkout securely</li>
              <li style="margin-bottom: 8px;">📦 Track your orders in real-time</li>
              <li style="margin-bottom: 8px;">🎁 Enjoy exclusive offers and discounts</li>
              <li style="margin-bottom: 8px;">⭐ Rate and review products</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin: 35px 0;">
            <a href="${process.env.NEXTAUTH_URL || "http://localhost:3000"}" 
               style="background: linear-gradient(135deg, #1e40af, #3b82f6); 
                      color: white; 
                      padding: 15px 35px; 
                      text-decoration: none; 
                      border-radius: 8px; 
                      display: inline-block; 
                      font-weight: bold; 
                      font-size: 16px;
                      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                      transition: all 0.3s ease;">
              🛍️ Start Shopping Now
            </a>
          </div>
          
          <div style="background: #e0f2fe; padding: 20px; border-radius: 8px; margin: 25px 0;">
            <h4 style="color: #0277bd; margin-top: 0;">💡 Pro Tips:</h4>
            <p style="margin: 10px 0; font-size: 14px;">
              • Sign in before adding items to cart for a seamless experience<br>
              • Check out our daily deals and special offers<br>
              • Follow us on social media for the latest updates
            </p>
          </div>
          
          <p style="font-size: 16px; margin: 25px 0;">
            If you have any questions or need assistance, our friendly support team is here to help. Just reply to this email or contact us through our website.
          </p>
          
          <p style="font-size: 16px; margin: 25px 0 0 0;">
            Happy Shopping! 🛒<br>
            <strong>The ShopEase Team</strong>
          </p>
        </div>
        
        <div style="background: #f8fafc; padding: 20px 30px; text-align: center; border-top: 1px solid #e5e7eb;">
          <p style="margin: 0; font-size: 12px; color: #6b7280;">
            This email was sent to ${name} because you created an account on ShopEase.<br>
            If you didn't create this account, please ignore this email.
          </p>
        </div>
      </div>
    </body>
    </html>
  `
}

export function getOrderConfirmationEmailTemplate(order: any) {
  const itemsHtml = order.items
    .map(
      (item: any) => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">
        <img src="${item.image}" alt="${item.name}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 5px;">
      </td>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">₹${item.price.toLocaleString("en-IN")}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">₹${(item.price * item.quantity).toLocaleString("en-IN")}</td>
    </tr>
  `,
    )
    .join("")

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Order Confirmation - ${order.id}</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #059669, #10b981); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="margin: 0; font-size: 28px;">Order Confirmed!</h1>
          <p style="margin: 10px 0 0 0; font-size: 18px;">Order #${order.id}</p>
        </div>
        <div style="background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px;">
          <h2 style="color: #059669;">Thank you for your order, ${order.customer.firstName}!</h2>
          <p>Your order has been confirmed and will be processed shortly.</p>
          
          <h3>Order Details:</h3>
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <thead>
              <tr style="background: #e5e7eb;">
                <th style="padding: 10px; text-align: left;">Image</th>
                <th style="padding: 10px; text-align: left;">Product</th>
                <th style="padding: 10px; text-align: center;">Qty</th>
                <th style="padding: 10px; text-align: right;">Price</th>
                <th style="padding: 10px; text-align: right;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>
          
          <div style="background: white; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h3>Order Summary:</h3>
            <div style="display: flex; justify-content: space-between; margin: 10px 0;">
              <span>Subtotal:</span>
              <span>₹${order.subtotal.toLocaleString("en-IN")}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin: 10px 0;">
              <span>Tax (18% GST):</span>
              <span>₹${order.tax.toLocaleString("en-IN")}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin: 10px 0;">
              <span>Shipping:</span>
              <span>₹${order.shipping.toLocaleString("en-IN")}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin: 10px 0; font-weight: bold; font-size: 18px; border-top: 2px solid #059669; padding-top: 10px;">
              <span>Total:</span>
              <span>₹${order.total.toLocaleString("en-IN")}</span>
            </div>
          </div>
          
          <h3>Shipping Address:</h3>
          <div style="background: white; padding: 15px; border-radius: 5px;">
            <p>${order.customer.firstName} ${order.customer.lastName}<br>
            ${order.customer.address}<br>
            ${order.customer.city}, ${order.customer.state} ${order.customer.zipCode}<br>
            ${order.customer.country}</p>
          </div>
          
          <p style="margin-top: 30px;">We'll send you another email when your order ships.</p>
          <p>Thank you for shopping with ShopEase!</p>
        </div>
      </div>
    </body>
    </html>
  `
}

export function getVendorOrderNotificationTemplate(order: any) {
  const itemsHtml = order.items
    .map(
      (item: any) => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">₹${item.price.toLocaleString("en-IN")}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">₹${(item.price * item.quantity).toLocaleString("en-IN")}</td>
    </tr>
  `,
    )
    .join("")

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>New Order Received - ${order.id}</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #dc2626, #ef4444); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="margin: 0; font-size: 28px;">New Order Received!</h1>
          <p style="margin: 10px 0 0 0; font-size: 18px;">Order #${order.id}</p>
        </div>
        <div style="background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px;">
          <h2 style="color: #dc2626;">Order Details:</h2>
          
          <div style="background: white; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h3>Customer Information:</h3>
            <p><strong>Name:</strong> ${order.customer.firstName} ${order.customer.lastName}<br>
            <strong>Email:</strong> ${order.customer.email}<br>
            <strong>Phone:</strong> ${order.customer.phone || "Not provided"}</p>
            
            <h3>Shipping Address:</h3>
            <p>${order.customer.address}<br>
            ${order.customer.city}, ${order.customer.state} ${order.customer.zipCode}<br>
            ${order.customer.country}</p>
          </div>
          
          <h3>Items Ordered:</h3>
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <thead>
              <tr style="background: #e5e7eb;">
                <th style="padding: 10px; text-align: left;">Product</th>
                <th style="padding: 10px; text-align: center;">Qty</th>
                <th style="padding: 10px; text-align: right;">Price</th>
                <th style="padding: 10px; text-align: right;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>
          
          <div style="background: white; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <h3>Order Summary:</h3>
            <div style="display: flex; justify-content: space-between; margin: 10px 0; font-weight: bold; font-size: 18px;">
              <span>Total Amount:</span>
              <span>₹${order.total.toLocaleString("en-IN")}</span>
            </div>
            <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>
            <p><strong>Payment Status:</strong> ${order.paymentDetails?.status || "Completed"}</p>
          </div>
          
          <p style="color: #dc2626; font-weight: bold;">Please process this order as soon as possible.</p>
        </div>
      </div>
    </body>
    </html>
  `
}
