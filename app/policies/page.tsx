// "use client"

// import { useState } from "react"
// import { Shield, FileText, RefreshCw, Truck, Scale, ChevronRight, Clock, CheckCircle } from "lucide-react"
// import {
//   Sidebar,
//   SidebarContent,
//   SidebarGroup,
//   SidebarGroupContent,
//   SidebarGroupLabel,
//   SidebarHeader,
//   SidebarInset,
//   SidebarMenu,
//   SidebarMenuButton,
//   SidebarMenuItem,
//   SidebarProvider,
//   SidebarTrigger,
// } from "@/components/ui/sidebar"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Separator } from "@/components/ui/separator"
// import { PrivacyPolicyContent } from "../policies/components/privacy-policy"
// import { TermsConditionsContent } from "../policies/components/terms-conditions"
// import { CancellationRefundContent } from "../policies/components/cancellation-refund"
// import { ShippingDeliveryContent } from "../policies/components/shipping-delivery"

// const legalPages = [
//   {
//     id: "overview",
//     title: "Legal Overview",
//     icon: Scale,
//     description: "Overview of our legal policies and guidelines",
//   },
//   {
//     id: "privacy-policy",
//     title: "Privacy Policy",
//     icon: Shield,
//     description: "How we collect, use, and protect your personal information",
//   },
//   {
//     id: "terms-conditions",
//     title: "Terms & Conditions",
//     icon: FileText,
//     description: "Rules and guidelines for using our services",
//   },
//   {
//     id: "cancellation-refund",
//     title: "Cancellation & Refund",
//     icon: RefreshCw,
//     description: "Our policies for order cancellations and refunds",
//   },
//   {
//     id: "shipping-delivery",
//     title: "Shipping & Delivery",
//     icon: Truck,
//     description: "Information about shipping options and delivery",
//   },
// ]

// // ✅ This must be the default page export
// export default function PoliciesPage() {
//   const [activePage, setActivePage] = useState("overview")

//   const renderContent = () => {
//     switch (activePage) {
//       case "privacy-policy":
//         return <PrivacyPolicyContent />
//       case "terms-conditions":
//         return <TermsConditionsContent />
//       case "cancellation-refund":
//         return <CancellationRefundContent />
//       case "shipping-delivery":
//         return <ShippingDeliveryContent />
//       default:
//         return <LegalOverview onPageChange={setActivePage} />
//     }
//   }

//   return (
//     <SidebarProvider>
//       <Sidebar className="border-r-0">
//         <SidebarHeader className="border-b border-sidebar-border/50">
//           <div className="flex items-center gap-3 px-3 py-4">
//             <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10">
//               <Scale className="h-5 w-5 text-white" />
//             </div>
//             <div>
//               <h2 className="text-lg font-semibold text-white">Legal Center</h2>
//               <p className="text-sm text-white/70">Policies & Guidelines</p>
//             </div>
//           </div>
//         </SidebarHeader>
//         <SidebarContent>
//           <SidebarGroup>
//             <SidebarGroupLabel className="text-white/70 text-xs uppercase tracking-wider">
//               Legal Documents
//             </SidebarGroupLabel>
//             <SidebarGroupContent>
//               <SidebarMenu>
//                 {legalPages.map((page) => {
//                   const Icon = page.icon
//                   return (
//                     <SidebarMenuItem key={page.id}>
//                       <SidebarMenuButton
//                         onClick={() => setActivePage(page.id)}
//                         isActive={activePage === page.id}
//                         className="group relative"
//                       >
//                         <Icon className="h-4 w-4" />
//                         <span className="flex-1">{page.title}</span>
//                         {activePage === page.id && <ChevronRight className="h-4 w-4 opacity-70" />}
//                       </SidebarMenuButton>
//                     </SidebarMenuItem>
//                   )
//                 })}
//               </SidebarMenu>
//             </SidebarGroupContent>
//           </SidebarGroup>
//         </SidebarContent>
//       </Sidebar>
//       <SidebarInset>
//         <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-white px-4">
//           <SidebarTrigger className="-ml-1 text-primary" />
//           <Separator orientation="vertical" className="mr-2 h-4" />
//           <div className="flex items-center gap-2">
//             <Scale className="h-5 w-5 text-primary" />
//             <h1 className="text-lg font-semibold text-primary">Legal Center</h1>
//           </div>
//         </header>
//         <main className="flex-1 overflow-auto">{renderContent()}</main>
//       </SidebarInset>
//     </SidebarProvider>
//   )
// }

// // ⬇️ Keep this helper component inside same file
// function LegalOverview({ onPageChange }: { onPageChange: (pageId: string) => void }) {
//   return (
//     <div className="p-6 space-y-8">
//       <div className="space-y-4">
//         <div className="flex items-center gap-3">
//           <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
//             <Scale className="h-6 w-6 text-primary" />
//           </div>
//           <div>
//             <h1 className="text-3xl font-bold text-gray-900">Legal Center</h1>
//             <p className="text-gray-600">Your comprehensive guide to our policies and terms</p>
//           </div>
//         </div>

//         <div className="flex items-center gap-2 text-sm text-gray-500">
//           <Clock className="h-4 w-4" />
//           <span>Last updated: June 5, 2025</span>
//           <Badge variant="secondary" className="ml-2">
//             <CheckCircle className="h-3 w-3 mr-1" />
//             Up to date
//           </Badge>
//         </div>
//       </div>

//       <div className="grid gap-6 md:grid-cols-2">
//         {legalPages.slice(1).map((page) => {
//           const Icon = page.icon
//           return (
//             <Card
//               key={page.id}
//               className="group cursor-pointer transition-all hover:shadow-lg hover:border-primary/20 hover:scale-[1.02]"
//               onClick={() => onPageChange(page.id)}
//             >
//               <CardHeader className="pb-3">
//                 <div className="flex items-center gap-3">
//                   <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
//                     <Icon className="h-5 w-5 text-primary" />
//                   </div>
//                   <div className="flex-1">
//                     <CardTitle className="text-lg group-hover:text-primary transition-colors">{page.title}</CardTitle>
//                   </div>
//                   <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-primary transition-colors" />
//                 </div>
//               </CardHeader>
//               <CardContent>
//                 <CardDescription className="text-sm leading-relaxed">{page.description}</CardDescription>
//                 <div className="mt-3 text-xs text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">
//                   Click to view details →
//                 </div>
//               </CardContent>
//             </Card>
//           )
//         })}
//       </div>

//       <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
//         <CardHeader>
//           <CardTitle className="text-primary">Important Notice</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <p className="text-gray-700 leading-relaxed">
//             These legal documents outline the terms of service, privacy practices, and policies that govern your use of
//             our services. Please review them carefully. If you have any questions or concerns about these policies,
//             please don't hesitate to contact our legal team.
//           </p>
//           <div className="mt-4 flex items-center gap-4 text-sm text-gray-600">
//             <span className="flex items-center gap-1">
//               <CheckCircle className="h-4 w-4 text-green-600" />
//               Regularly updated
//             </span>
//             <span className="flex items-center gap-1">
//               <Shield className="h-4 w-4 text-primary" />
//               GDPR compliant
//             </span>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }
