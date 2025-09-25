import { Shield, Eye, Lock, Database, Users, Mail } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function PrivacyPolicyContent() {
  return (
    <div className="p-6 space-y-8">
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
            <Shield className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Privacy Policy</h1>
            <p className="text-gray-600">How we protect and handle your personal information</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="secondary">Last updated: June 5, 2025</Badge>
          <Badge className="bg-green-100 text-green-800">GDPR Compliant</Badge>
        </div>
      </div>

      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary">
            <Eye className="h-5 w-5" />
            Quick Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 leading-relaxed">
            We are committed to protecting your privacy and ensuring the security of your personal information. This
            policy explains how we collect, use, and safeguard your data when you use our services.
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-primary" />
              Information We Collect
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Personal Information</h4>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• Name and contact details</li>
                <li>• Email address and phone number</li>
                <li>• Billing and shipping addresses</li>
                <li>• Payment information</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Usage Information</h4>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• Website interaction data</li>
                <li>• Device and browser information</li>
                <li>• IP address and location data</li>
                <li>• Cookies and tracking data</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-primary" />
              How We Use Your Data
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Service Provision</h4>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• Process orders and payments</li>
                <li>• Provide customer support</li>
                <li>• Send service notifications</li>
                <li>• Improve our services</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Communication</h4>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• Send promotional emails</li>
                <li>• Provide updates and news</li>
                <li>• Respond to inquiries</li>
                <li>• Send security alerts</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Data Sharing and Disclosure
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 mb-4">
            We do not sell, trade, or rent your personal information to third parties. We may share your information
            only in the following circumstances:
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <h4 className="font-semibold text-gray-900">Service Providers</h4>
              <p className="text-sm text-gray-600">
                With trusted partners who help us operate our business, such as payment processors and shipping
                companies.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-gray-900">Legal Requirements</h4>
              <p className="text-sm text-gray-600">
                When required by law, court order, or to protect our rights and the safety of our users.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your Rights and Choices</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <Eye className="h-8 w-8 text-primary mx-auto mb-2" />
              <h4 className="font-semibold mb-1">Access</h4>
              <p className="text-sm text-gray-600">Request access to your personal data</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <Lock className="h-8 w-8 text-primary mx-auto mb-2" />
              <h4 className="font-semibold mb-1">Correction</h4>
              <p className="text-sm text-gray-600">Update or correct your information</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <Shield className="h-8 w-8 text-primary mx-auto mb-2" />
              <h4 className="font-semibold mb-1">Deletion</h4>
              <p className="text-sm text-gray-600">Request deletion of your data</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary">
            <Mail className="h-5 w-5" />
            Contact Us
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 mb-4">
            If you have any questions about this Privacy Policy or how we handle your personal information, please
            contact us:
          </p>
          <div className="space-y-2 text-sm">
            <p>
              <strong>Email:</strong>{" "}
              <a href="mailto:privacy@example.com" className="text-primary hover:underline">
                privacy@example.com
              </a>
            </p>
            <p>
              <strong>Phone:</strong> +1 (555) 123-4567
            </p>
            <p>
              <strong>Address:</strong> 123 Privacy Street, Data City, DC 12345
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
