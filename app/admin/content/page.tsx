"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, RefreshCw, Database } from "lucide-react"

export default function ContentManagementPage() {
  const [activeTab, setActiveTab] = useState("hero")
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [heroSlides, setHeroSlides] = useState([])
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [offerProducts, setOfferProducts] = useState([])
  const [testimonials, setTestimonials] = useState([])
  const [categories, setCategories] = useState([])

  const fetchContent = async (contentType) => {
    setIsLoading(true)
    setMessage("")
    try {
      const response = await fetch(`/api/${contentType}`)
      const data = await response.json()

      switch (contentType) {
        case "hero-slides":
          setHeroSlides(data.slides || [])
          break
        case "featured-products":
          setFeaturedProducts(data.products || [])
          break
        case "offer-products":
          setOfferProducts(data.offers || [])
          break
        case "testimonials":
          setTestimonials(data.testimonials || [])
          break
        case "categories":
          setCategories(data.categories || [])
          break
      }

      setMessage(`${contentType} loaded successfully`)
    } catch (error) {
      console.error(`Error fetching ${contentType}:`, error)
      setMessage(`Error loading ${contentType}. Please try again.`)
    } finally {
      setIsLoading(false)
    }
  }

  const seedDatabase = async () => {
    setIsLoading(true)
    setMessage("")
    try {
      const response = await fetch("/api/seed-data")
      const data = await response.json()
      setMessage(data.message || "Database seeded successfully")
      // Refresh the current tab data
      fetchContent(
        activeTab === "hero"
          ? "hero-slides"
          : activeTab === "featured"
            ? "featured-products"
            : activeTab === "offers"
              ? "offer-products"
              : activeTab === "testimonials"
                ? "testimonials"
                : "categories",
      )
    } catch (error) {
      console.error("Error seeding database:", error)
      setMessage("Error seeding database. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    // Load initial data based on active tab
    const contentType =
      activeTab === "hero"
        ? "hero-slides"
        : activeTab === "featured"
          ? "featured-products"
          : activeTab === "offers"
            ? "offer-products"
            : activeTab === "testimonials"
              ? "testimonials"
              : "categories"
    fetchContent(contentType)
  }, [activeTab])

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Content Management</h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => {
              const contentType =
                activeTab === "hero"
                  ? "hero-slides"
                  : activeTab === "featured"
                    ? "featured-products"
                    : activeTab === "offers"
                      ? "offer-products"
                      : activeTab === "testimonials"
                        ? "testimonials"
                        : "categories"
              fetchContent(contentType)
            }}
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <RefreshCw className="h-4 w-4 mr-2" />}
            Refresh
          </Button>
          <Button onClick={seedDatabase} disabled={isLoading}>
            {isLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Database className="h-4 w-4 mr-2" />}
            Seed Database
          </Button>
        </div>
      </div>

      {message && (
        <div
          className={`p-4 mb-4 rounded-md ${message.includes("Error") ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}
        >
          {message}
        </div>
      )}

      <Tabs defaultValue="hero" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="hero">Hero Slides</TabsTrigger>
          <TabsTrigger value="featured">Featured Products</TabsTrigger>
          <TabsTrigger value="offers">Special Offers</TabsTrigger>
          <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>

        <TabsContent value="hero">
          <Card>
            <CardHeader>
              <CardTitle>Hero Slides</CardTitle>
              <CardDescription>Manage the slides that appear in the hero section of your homepage.</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center p-8">
                  <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
                </div>
              ) : heroSlides.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {heroSlides.map((slide, index) => (
                    <div key={index} className="border rounded-md p-4">
                      <div className="aspect-video bg-gray-100 rounded-md mb-2 overflow-hidden">
                        {slide.imageUrl && (
                          <img
                            src={slide.imageUrl || "/placeholder.svg"}
                            alt={slide.title}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <h3 className="font-medium">{slide.title}</h3>
                      <p className="text-sm text-gray-500">{slide.subtitle}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center p-8 text-gray-500">
                  No hero slides found. Click "Seed Database" to add sample content.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="featured">
          <Card>
            <CardHeader>
              <CardTitle>Featured Products</CardTitle>
              <CardDescription>Manage the featured products that appear on your homepage.</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center p-8">
                  <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
                </div>
              ) : featuredProducts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {featuredProducts.map((product, index) => (
                    <div key={index} className="border rounded-md p-4">
                      <div className="aspect-square bg-gray-100 rounded-md mb-2 overflow-hidden">
                        {product.imageUrl && (
                          <img
                            src={product.imageUrl || "/placeholder.svg"}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <h3 className="font-medium">{product.name}</h3>
                      <p className="text-sm text-gray-500">${product.price}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center p-8 text-gray-500">
                  No featured products found. Click "Seed Database" to add sample content.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="offers">
          <Card>
            <CardHeader>
              <CardTitle>Special Offers</CardTitle>
              <CardDescription>Manage the special offers that appear on your homepage.</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center p-8">
                  <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
                </div>
              ) : offerProducts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {offerProducts.map((offer, index) => (
                    <div key={index} className="border rounded-md p-4">
                      <div className="aspect-video bg-gray-100 rounded-md mb-2 overflow-hidden">
                        {offer.imageUrl && (
                          <img
                            src={offer.imageUrl || "/placeholder.svg"}
                            alt={offer.title}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <h3 className="font-medium">{offer.title}</h3>
                      <p className="text-sm text-gray-500">{offer.description}</p>
                      <div className="mt-2">
                        <span className="inline-block bg-red-100 text-red-800 text-xs px-2 py-1 rounded">
                          {offer.discount}% OFF
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center p-8 text-gray-500">
                  No special offers found. Click "Seed Database" to add sample content.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="testimonials">
          <Card>
            <CardHeader>
              <CardTitle>Testimonials</CardTitle>
              <CardDescription>Manage customer testimonials that appear on your homepage.</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center p-8">
                  <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
                </div>
              ) : testimonials.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {testimonials.map((testimonial, index) => (
                    <div key={index} className="border rounded-md p-4">
                      <div className="flex items-center mb-3">
                        <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden mr-3">
                          {testimonial.avatar && (
                            <img
                              src={testimonial.avatar || "/placeholder.svg"}
                              alt={testimonial.name}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                        <div>
                          <h3 className="font-medium">{testimonial.name}</h3>
                          <p className="text-xs text-gray-500">{testimonial.title}</p>
                        </div>
                      </div>
                      <p className="text-sm">{testimonial.content}</p>
                      <div className="mt-2 flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span key={star} className={`text-${star <= testimonial.rating ? "yellow" : "gray"}-400`}>
                            ★
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center p-8 text-gray-500">
                  No testimonials found. Click "Seed Database" to add sample content.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories">
          <Card>
            <CardHeader>
              <CardTitle>Categories</CardTitle>
              <CardDescription>Manage product categories that appear on your homepage.</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center p-8">
                  <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
                </div>
              ) : categories.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {categories.map((category, index) => (
                    <div key={index} className="border rounded-md p-4">
                      <div className="aspect-square bg-gray-100 rounded-md mb-2 overflow-hidden">
                        {category.imageUrl && (
                          <img
                            src={category.imageUrl || "/placeholder.svg"}
                            alt={category.name}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <h3 className="font-medium">{category.name}</h3>
                      <p className="text-sm text-gray-500">{category.productCount || 0} products</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center p-8 text-gray-500">
                  No categories found. Click "Seed Database" to add sample content.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
