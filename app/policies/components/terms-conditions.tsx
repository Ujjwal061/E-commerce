import { FileText, AlertTriangle, Scale, Users, Shield, Gavel } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function TermsConditionsContent() {
  return (
    <div className="p-6 space-y-8">
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
            <FileText className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Terms and Conditions</h1>
            <p className="text-gray-600">Rules and guidelines for using our services</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="secondary">Last updated: June 5, 2025</Badge>
          <Badge className="bg-blue-100 text-blue-800">Version 2.1</Badge>
        </div>
      </div>

      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          By accessing or using our services, you agree to be bound by these Terms and Conditions. Please read them
          carefully before using our platform.
        </AlertDescription>
      </Alert>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Acceptance of Terms
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700 leading-relaxed">
              By accessing or using our services, you agree to be bound by these Terms and Conditions and all applicable
              laws and regulations.
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">What this means:</h4>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• You must be 18 years or older to use our services</li>
                <li>• You agree to follow all applicable laws</li>
                <li>• You accept responsibility for your account</li>
                <li>• You understand these terms may change</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Use License
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-700 leading-relaxed">
              We grant you a limited, non-exclusive license to use our services for personal, non-commercial purposes.
            </p>
            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
              <h4 className="font-semibold text-red-900 mb-2">You may NOT:</h4>
              <ul className="space-y-1 text-sm text-red-700">
                <li>• Modify or copy our materials</li>
                <li>• Use materials for commercial purposes</li>
                <li>• Reverse engineer our software</li>
                <li>• Remove copyright notices</li>
                <li>• Transfer materials to others</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-primary" />
            User Responsibilities
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Account Security</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  Keep your login credentials secure and confidential
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  Notify us immediately of any unauthorized access
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  Use strong passwords and enable two-factor authentication
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Prohibited Activities</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                  Violating any applicable laws or regulations
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                  Transmitting harmful or malicious content
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                  Interfering with our services or systems
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scale className="h-5 w-5 text-primary" />
              Disclaimers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">
              Our services are provided on an "as is" basis. We make no warranties, expressed or implied.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span className="text-gray-600">No guarantee of uninterrupted service</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span className="text-gray-600">Content accuracy not guaranteed</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span className="text-gray-600">Third-party content not endorsed</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gavel className="h-5 w-5 text-primary" />
              Limitation of Liability
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4">
              We shall not be liable for any damages arising from the use of our services.
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h5 className="font-medium text-gray-900 mb-2">This includes:</h5>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• Direct, indirect, or consequential damages</li>
                <li>• Loss of profits or business interruption</li>
                <li>• Data loss or corruption</li>
                <li>• Personal injury or property damage</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle className="text-primary">Governing Law</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 leading-relaxed">
            These terms and conditions are governed by and construed in accordance with the laws of [Your Jurisdiction].
            Any disputes arising from these terms will be subject to the exclusive jurisdiction of the courts in [Your
            Location].
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
