import { RefreshCw, Clock, CreditCard, AlertCircle, CheckCircle, XCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function CancellationRefundContent() {
  return (
    <div className="p-6 space-y-8">
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
            <RefreshCw className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Cancellation & Refund Policy</h1>
            <p className="text-gray-600">Our policies for order cancellations and refunds</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="secondary">Last updated: June 5, 2025</Badge>
          <Badge className="bg-green-100 text-green-800">Customer Friendly</Badge>
        </div>
      </div>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          We want you to be completely satisfied with your purchase. If you're not happy, we're here to help with our
          flexible cancellation and refund policies.
        </AlertDescription>
      </Alert>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-primary" />
              Cancellation Policy
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <h4 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Before Shipping
              </h4>
              <p className="text-sm text-green-700 mb-2">
                You can cancel your order free of charge before it has been shipped.
              </p>
              <ul className="space-y-1 text-sm text-green-700">
                <li>• No cancellation fees</li>
                <li>• Full refund processed</li>
                <li>• Instant confirmation</li>
              </ul>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <h4 className="font-semibold text-yellow-900 mb-2 flex items-center gap-2">
                <Clock className="h-4 w-4" />
                After Shipping
              </h4>
              <p className="text-sm text-yellow-700">
                Once shipped, orders cannot be cancelled but may be returned according to our Return Policy.
              </p>
            </div>

            <div className="mt-4">
              <h5 className="font-medium text-gray-900 mb-2">How to Cancel:</h5>
              <ol className="space-y-2 text-sm text-gray-600">
                <li className="flex gap-2">
                  <span className="flex-shrink-0 w-5 h-5 bg-primary text-white rounded-full text-xs flex items-center justify-center">
                    1
                  </span>
                  Contact our support team
                </li>
                <li className="flex gap-2">
                  <span className="flex-shrink-0 w-5 h-5 bg-primary text-white rounded-full text-xs flex items-center justify-center">
                    2
                  </span>
                  Provide your order number
                </li>
                <li className="flex gap-2">
                  <span className="flex-shrink-0 w-5 h-5 bg-primary text-white rounded-full text-xs flex items-center justify-center">
                    3
                  </span>
                  Receive confirmation
                </li>
              </ol>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" />
              Refund Policy
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Eligible for Refund:</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Damaged or defective items</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Items not as described</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Wrong item shipped</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Change of mind (within 30 days)</span>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h5 className="font-medium text-blue-900 mb-2">Refund Timeline:</h5>
              <div className="space-y-2 text-sm text-blue-700">
                <div className="flex justify-between">
                  <span>Processing:</span>
                  <span className="font-medium">1-2 business days</span>
                </div>
                <div className="flex justify-between">
                  <span>Bank processing:</span>
                  <span className="font-medium">3-5 business days</span>
                </div>
                <div className="flex justify-between border-t border-blue-200 pt-2">
                  <span className="font-medium">Total time:</span>
                  <span className="font-bold">5-10 business days</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Refund Process</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-primary font-bold">1</span>
              </div>
              <h4 className="font-semibold mb-1">Contact Us</h4>
              <p className="text-sm text-gray-600">Email us with your order details</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-primary font-bold">2</span>
              </div>
              <h4 className="font-semibold mb-1">Get RMA</h4>
              <p className="text-sm text-gray-600">Receive return authorization</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-primary font-bold">3</span>
              </div>
              <h4 className="font-semibold mb-1">Ship Item</h4>
              <p className="text-sm text-gray-600">Return item with RMA number</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-primary font-bold">4</span>
              </div>
              <h4 className="font-semibold mb-1">Get Refund</h4>
              <p className="text-sm text-gray-600">Receive your money back</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-orange-600" />
              Restocking Fees
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-gray-700">A 15% restocking fee may apply for returns due to change of mind.</p>
              <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                <h5 className="font-medium text-orange-900 mb-2">When restocking fees apply:</h5>
                <ul className="space-y-1 text-sm text-orange-700">
                  <li>• Change of mind returns</li>
                  <li>• Non-defective returns</li>
                  <li>• Returns after 30 days</li>
                </ul>
              </div>
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h5 className="font-medium text-green-900 mb-2">No restocking fee for:</h5>
                <ul className="space-y-1 text-sm text-green-700">
                  <li>• Damaged items</li>
                  <li>• Defective products</li>
                  <li>• Wrong items shipped</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-600" />
              Non-Refundable Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">The following items cannot be returned or refunded:</p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <XCircle className="h-4 w-4 text-red-600" />
                <span>Gift cards and vouchers</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <XCircle className="h-4 w-4 text-red-600" />
                <span>Digital downloads</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <XCircle className="h-4 w-4 text-red-600" />
                <span>Personalized items</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <XCircle className="h-4 w-4 text-red-600" />
                <span>Perishable goods</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <XCircle className="h-4 w-4 text-red-600" />
                <span>Items marked "Final Sale"</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle className="text-primary">Need Help?</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 mb-4">
            Our customer service team is here to help with any questions about cancellations or refunds.
          </p>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                <RefreshCw className="h-5 w-5 text-primary" />
              </div>
              <p className="text-sm font-medium">Email Support</p>
              <p className="text-sm text-gray-600">support@example.com</p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <p className="text-sm font-medium">Response Time</p>
              <p className="text-sm text-gray-600">Within 24 hours</p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
                <CheckCircle className="h-5 w-5 text-primary" />
              </div>
              <p className="text-sm font-medium">Resolution</p>
              <p className="text-sm text-gray-600">Fast & Fair</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
