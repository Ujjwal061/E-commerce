import { Truck, Clock, MapPin, Package, Globe, AlertTriangle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function ShippingDeliveryContent() {
  return (
    <div className="p-6 space-y-8">
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
            <Truck className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Shipping & Delivery Policy</h1>
            <p className="text-gray-600">Everything you need to know about our shipping options</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="secondary">Last updated: June 5, 2025</Badge>
          <Badge className="bg-blue-100 text-blue-800">Free Shipping Available</Badge>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Processing Time
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700">
              All orders are processed within 1-2 business days after receiving your order confirmation.
            </p>
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">Processing Schedule:</h4>
              <div className="space-y-2 text-sm text-blue-700">
                <div className="flex justify-between">
                  <span>Order placed before 2 PM:</span>
                  <span className="font-medium">Same day processing</span>
                </div>
                <div className="flex justify-between">
                  <span>Order placed after 2 PM:</span>
                  <span className="font-medium">Next business day</span>
                </div>
                <div className="flex justify-between">
                  <span>Weekend orders:</span>
                  <span className="font-medium">Monday processing</span>
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              You'll receive a shipping confirmation email with tracking information once your order ships.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              Free Shipping
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <h4 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
                <Package className="h-4 w-4" />
                Free Standard Shipping
              </h4>
              <p className="text-green-700 text-sm mb-2">On all orders over $50 within the continental United States</p>
              <div className="text-xs text-green-600">Automatically applied at checkout • No code required</div>
            </div>
            <div className="space-y-2">
              <h5 className="font-medium text-gray-900">Eligibility:</h5>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• Order total must exceed $50</li>
                <li>• Shipping address in continental US</li>
                <li>• Standard shipping method selected</li>
                <li>• Excludes Alaska, Hawaii, and territories</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Shipping Options & Rates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold">Shipping Method</th>
                  <th className="text-left py-3 px-4 font-semibold">Delivery Time</th>
                  <th className="text-left py-3 px-4 font-semibold">Cost</th>
                  <th className="text-left py-3 px-4 font-semibold">Tracking</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <tr className="hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <Truck className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">Standard Shipping</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-gray-600">5-7 business days</td>
                  <td className="py-4 px-4">
                    <span className="font-medium">$5.99</span>
                    <div className="text-xs text-green-600">Free over $50</div>
                  </td>
                  <td className="py-4 px-4">
                    <Badge variant="secondary">Included</Badge>
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-blue-500" />
                      <span className="font-medium">Express Shipping</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-gray-600">2-3 business days</td>
                  <td className="py-4 px-4 font-medium">$12.99</td>
                  <td className="py-4 px-4">
                    <Badge variant="secondary">Included</Badge>
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-orange-500" />
                      <span className="font-medium">Next Day Delivery</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-gray-600">1 business day</td>
                  <td className="py-4 px-4 font-medium">$24.99</td>
                  <td className="py-4 px-4">
                    <Badge className="bg-green-100 text-green-800">Premium</Badge>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-sm text-gray-600 mt-4">
            * Business days are Monday through Friday, excluding holidays. Delivery times are estimates and may vary.
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary" />
              International Shipping
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700">We ship to most countries worldwide with competitive international rates.</p>
            <div className="space-y-3">
              <div className="bg-blue-50 p-3 rounded-lg">
                <h5 className="font-medium text-blue-900 mb-1">Delivery Time:</h5>
                <p className="text-sm text-blue-700">7-21 business days depending on destination</p>
              </div>
              <div className="bg-yellow-50 p-3 rounded-lg">
                <h5 className="font-medium text-yellow-900 mb-1">Customs & Duties:</h5>
                <p className="text-sm text-yellow-700">
                  International orders may be subject to import duties and taxes (buyer's responsibility)
                </p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <h5 className="font-medium text-green-900 mb-1">Tracking:</h5>
                <p className="text-sm text-green-700">Full tracking provided for all international shipments</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              Delivery Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h5 className="font-medium text-gray-900 mb-2">Tracking Your Order:</h5>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  Tracking number sent via email after shipping
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  Real-time updates on package location
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  Delivery confirmation when package arrives
                </li>
              </ul>
            </div>
            <div>
              <h5 className="font-medium text-gray-900 mb-2">Delivery Requirements:</h5>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                  Someone must be available to receive package
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                  Valid ID may be required for signature
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                  Packages left at carrier facility if undeliverable
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-red-50 border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-900">
            <AlertTriangle className="h-5 w-5" />
            Delivery Issues
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-800 mb-4">
            If you experience any problems with your delivery, we're here to help resolve them quickly.
          </p>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <h5 className="font-medium text-red-900 mb-2">Lost Package:</h5>
              <p className="text-sm text-red-700">
                We'll investigate with the carrier and provide a replacement or full refund.
              </p>
            </div>
            <div>
              <h5 className="font-medium text-red-900 mb-2">Damaged Package:</h5>
              <p className="text-sm text-red-700">
                Take photos and contact us immediately for a replacement or refund.
              </p>
            </div>
            <div>
              <h5 className="font-medium text-red-900 mb-2">Wrong Address:</h5>
              <p className="text-sm text-red-700">Contact us ASAP to redirect the package or arrange reshipment.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle className="text-primary">Contact Shipping Support</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 mb-4">
            Have questions about shipping or need help with your delivery? Our shipping team is ready to assist.
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h5 className="font-medium text-gray-900 mb-2">Email Support:</h5>
              <p className="text-sm">
                <a href="mailto:shipping@example.com" className="text-primary hover:underline">
                  shipping@example.com
                </a>
              </p>
              <p className="text-xs text-gray-600 mt-1">Response within 4 hours</p>
            </div>
            <div>
              <h5 className="font-medium text-gray-900 mb-2">Phone Support:</h5>
              <p className="text-sm">+1 (555) 123-SHIP</p>
              <p className="text-xs text-gray-600 mt-1">Mon-Fri 9AM-6PM EST</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
