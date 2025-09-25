"use client"

import { useState, useEffect } from "react"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import ContactForm from "@/components/ContactForm"
import { MapPin, Phone, Mail, Clock } from "lucide-react"

export default function ContactPage() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const contactInfo = [
    {
      icon: MapPin,
      title: "Visit Us",
      details: ["123 Commerce Street", "Business District", "New York, NY 10001"],
    },
    {
      icon: Phone,
      title: "Call Us",
      details: ["+1 (555) 123-4567", "+1 (555) 987-6543"],
    },
    {
      icon: Mail,
      title: "Email Us",
      details: ["support@shopease.com", "sales@shopease.com"],
    },
    {
      icon: Clock,
      title: "Business Hours",
      details: ["Mon - Fri: 9:00 AM - 6:00 PM", "Sat - Sun: 10:00 AM - 4:00 PM"],
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
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Contact Us</h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
              We'd love to hear from you. Get in touch with our team for any questions or support.
            </p>
          </div>
        </section>

        {/* Contact Info Cards */}
        <section className="py-16 bg-white/10 backdrop-blur-sm">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {contactInfo.map((info, index) => (
                <div key={index} className="bg-white/20 backdrop-blur-sm rounded-lg p-6 text-white text-center">
                  <div className="bg-white/20 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <info.icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{info.title}</h3>
                  {info.details.map((detail, idx) => (
                    <p key={idx} className="text-blue-100 mb-1">
                      {detail}
                    </p>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">Send Us a Message</h2>
                <p className="text-xl text-gray-600">
                  Fill out the form below and we'll get back to you as soon as possible.
                </p>
              </div>
              <ContactForm />
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
              <p className="text-xl text-gray-600">Quick answers to common questions about our services.</p>
            </div>
            <div className="max-w-3xl mx-auto space-y-6">
              {[
                {
                  question: "What are your shipping options?",
                  answer:
                    "We offer standard shipping (5-7 business days) and express shipping (2-3 business days). Free shipping is available on orders over $50.",
                },
                {
                  question: "What is your return policy?",
                  answer:
                    "We accept returns within 30 days of purchase. Items must be in original condition with tags attached. Return shipping is free for defective items.",
                },
                {
                  question: "How can I track my order?",
                  answer:
                    "Once your order ships, you'll receive a tracking number via email. You can also track your order by logging into your account on our website.",
                },
                {
                  question: "Do you offer customer support?",
                  answer:
                    "Yes! Our customer support team is available Monday-Friday 9AM-6PM EST. You can reach us via phone, email, or live chat.",
                },
                {
                  question: "Are my payment details secure?",
                  answer:
                    "Absolutely. We use industry-standard SSL encryption to protect your payment information. We never store your credit card details on our servers.",
                },
              ].map((faq, index) => (
                <div key={index} className="bg-white rounded-lg p-6 shadow-md">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{faq.question}</h3>
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Find Us</h2>
              <p className="text-xl text-gray-600">Visit our headquarters in the heart of New York City.</p>
            </div>
            <div className="bg-gray-200 rounded-lg h-96 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Interactive map would be displayed here</p>
                <p className="text-sm text-gray-500 mt-2">123 Commerce Street, Business District, New York, NY 10001</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
