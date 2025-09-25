"use client"

import { useState, useEffect } from "react"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import AboutSection from "@/components/AboutSection"
import { Users, Award, Globe, Heart } from "lucide-react"

export default function AboutPage() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const stats = [
    { icon: Users, label: "Happy Customers", value: "10,000+" },
    { icon: Award, label: "Years of Excellence", value: "15+" },
    { icon: Globe, label: "Countries Served", value: "25+" },
    { icon: Heart, label: "Products Sold", value: "1M+" },
  ]

  const team = [
    {
      name: "John Smith",
      role: "CEO & Founder",
      image: "/placeholder.svg?height=300&width=300",
      description: "Visionary leader with 20+ years in e-commerce",
    },
    {
      name: "Sarah Johnson",
      role: "CTO",
      image: "/placeholder.svg?height=300&width=300",
      description: "Tech expert driving our digital innovation",
    },
    {
      name: "Mike Chen",
      role: "Head of Operations",
      image: "/placeholder.svg?height=300&width=300",
      description: "Operations specialist ensuring smooth delivery",
    },
  ]

  return (
    <div
      className={`flex flex-col min-h-screen transition-opacity duration-500 ${isLoaded ? "opacity-100" : "opacity-0"} relative overflow-hidden`}
      style={{ backgroundColor: "#003087" }}
    >
      {/* Animated Background Elements */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[300px] -right-[300px] w-[600px] h-[600px] rounded-full bg-blue-400/10 animate-float-slow"></div>
        <div className="absolute top-[20%] -left-[200px] w-[400px] h-[400px] rounded-full bg-blue-300/10 animate-float-medium"></div>
        <div className="absolute bottom-[10%] right-[5%] w-[300px] h-[300px] rounded-full bg-blue-200/10 animate-float-fast"></div>
        <div className="absolute top-[40%] left-[10%] w-[150px] h-[150px] rounded-full bg-blue-100/20 animate-pulse"></div>
        <div className="absolute top-[70%] left-[30%] w-[100px] h-[100px] rounded-full bg-blue-400/10 animate-float-medium"></div>
        <div className="absolute top-[30%] right-[20%] w-[200px] h-[200px] rounded-full bg-blue-300/15 animate-float-slow"></div>
      </div>

      <Header />
      <main className="flex-grow relative z-10">
        {/* Hero Section */}
        <section className="py-20 text-white">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">About ShopEase</h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
              Your trusted partner in online shopping, delivering quality products and exceptional service since 2008.
            </p>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-white/10 backdrop-blur-sm">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center text-white">
                  <div className="bg-white/20 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <stat.icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold mb-2">{stat.value}</h3>
                  <p className="text-blue-100">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* About Content */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <AboutSection />
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="bg-white p-8 rounded-lg shadow-lg">
                <h2 className="text-3xl font-bold text-blue-800 mb-6">Our Mission</h2>
                <p className="text-gray-600 leading-relaxed">
                  To provide customers with an exceptional online shopping experience by offering high-quality products,
                  competitive prices, and outstanding customer service. We strive to make online shopping convenient,
                  secure, and enjoyable for everyone.
                </p>
              </div>
              <div className="bg-white p-8 rounded-lg shadow-lg">
                <h2 className="text-3xl font-bold text-blue-800 mb-6">Our Vision</h2>
                <p className="text-gray-600 leading-relaxed">
                  To become the world's most trusted and preferred e-commerce platform, where customers can find
                  everything they need with confidence. We envision a future where shopping is seamless, sustainable,
                  and accessible to all.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                The passionate individuals behind ShopEase, working tirelessly to bring you the best shopping
                experience.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {team.map((member, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-6 text-center hover:shadow-lg transition-shadow">
                  <img
                    src={member.image || "/placeholder.svg"}
                    alt={member.name}
                    className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                  />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{member.name}</h3>
                  <p className="text-blue-800 font-medium mb-3">{member.role}</p>
                  <p className="text-gray-600">{member.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 bg-blue-800 text-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">Our Values</h2>
              <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                The principles that guide everything we do at ShopEase.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  title: "Quality First",
                  description: "We never compromise on the quality of products we offer to our customers.",
                },
                {
                  title: "Customer Focus",
                  description: "Every decision we make is centered around providing value to our customers.",
                },
                {
                  title: "Innovation",
                  description: "We continuously innovate to improve the shopping experience and stay ahead.",
                },
                {
                  title: "Integrity",
                  description: "We conduct business with honesty, transparency, and ethical practices.",
                },
              ].map((value, index) => (
                <div key={index} className="text-center">
                  <div className="bg-blue-700 rounded-lg p-6 mb-4">
                    <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                    <p className="text-blue-100">{value.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
