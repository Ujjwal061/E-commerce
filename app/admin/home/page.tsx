"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Edit,
  Plus,
  Save,
  Trash2,
  ImageIcon,
  MoveUp,
  MoveDown,
  Home,
  Layout,
  Grid,
  Layers,
  Monitor,
  ShoppingBag,
  Tag,
  Users,
  Star,
  Eye,
  EyeOff,
  RefreshCw,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "react-hot-toast"
import { StarIcon } from "lucide-react" // Declare the variable before using it

// Define comprehensive types for all homepage sections
interface HeroSlide {
  id: string
  title: string
  subtitle: string
  image: string
  cta: string
  link: string
  active: boolean
}

interface SplitCard {
  id: string
  title: string
  description: string
  icon: string
  link: string
  linkText: string
  active: boolean
}

interface AnimatedBanner {
  id: string
  title: string
  subtitle: string
  description: string
  buttonText: string
  buttonLink: string
  backgroundImage: string
  backgroundColor: string
  active: boolean
}

interface Advertisement {
  id: string
  title: string
  description: string
  image: string
  buttonText: string
  buttonLink: string
  bgColor: string
  textColor: string
  active: boolean
  featured: boolean
  order: number
}

interface Category {
  id: string
  name: string
  image: string
  count: number
  description: string
  active: boolean
}

interface OfferProduct {
  _id?: string
  id?: string
  name: string
  description: string
  originalPrice: number
  offerPrice: number
  discount: number
  image: string
  badge: string
  stock: number
  active: boolean
  createdAt?: string
  updatedAt?: string
}

interface PopularProduct {
  id: string
  name: string
  description: string
  price: number
  image: string
  sales: number
  active: boolean
}

interface FeaturedProduct {
  id: string
  name: string
  description: string
  price: number
  image: string
  active: boolean
}

interface Testimonial {
  id: string
  name: string
  role: string
  image: string
  quote: string
  rating: number
  active: boolean
}

interface Brand {
  id: string
  name: string
  logo: string
  url: string
  active: boolean
}

export default function AdminHomePage() {
  const router = useRouter()

  // State for all homepage sections
  const [activeTab, setActiveTab] = useState("hero")
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([])
  const [splitCards, setSplitCards] = useState<SplitCard[]>([])
  const [animatedBanners, setAnimatedBanners] = useState<AnimatedBanner[]>([])
  const [advertisements, setAdvertisements] = useState<Advertisement[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [offerProducts, setOfferProducts] = useState<OfferProduct[]>([])
  const [popularProducts, setPopularProducts] = useState<PopularProduct[]>([])
  const [featuredProducts, setFeaturedProducts] = useState<FeaturedProduct[]>([])
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [brands, setBrands] = useState<Brand[]>([])

  // State for editing items
  const [editingHeroSlide, setEditingHeroSlide] = useState<HeroSlide | null>(null)
  const [editingSplitCard, setEditingSplitCard] = useState<SplitCard | null>(null)
  const [editingAnimatedBanner, setEditingAnimatedBanner] = useState<AnimatedBanner | null>(null)
  const [editingAdvertisement, setEditingAdvertisement] = useState<Advertisement | null>(null)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [editingOfferProduct, setEditingOfferProduct] = useState<OfferProduct | null>(null)
  const [editingPopularProduct, setEditingPopularProduct] = useState<PopularProduct | null>(null)
  const [editingFeaturedProduct, setEditingFeaturedProduct] = useState<FeaturedProduct | null>(null)
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null)
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null)

  // Loading and success states
  const [loading, setLoading] = useState(false)
  const [offersLoading, setOffersLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")

  // Load initial data
  useEffect(() => {
    loadInitialData()
    loadOfferProducts()
  }, [])

  const loadOfferProducts = async () => {
    try {
      setOffersLoading(true)
      const response = await fetch("/api/offers")

      if (response.ok) {
        const data = await response.json()
        if (data.success && Array.isArray(data.offers)) {
          setOfferProducts(data.offers)
        } else {
          console.error("Invalid offers data:", data)
          setOfferProducts([])
        }
      } else {
        console.error("Failed to fetch offers:", response.status)
        setOfferProducts([])
      }
    } catch (error) {
      console.error("Error loading offer products:", error)
      toast.error("Failed to load special offers")
      setOfferProducts([])
    } finally {
      setOffersLoading(false)
    }
  }

  const loadInitialData = () => {
    // Load from localStorage or set default data
    const loadFromStorage = (key: string, defaultData: any[]) => {
      try {
        const stored = localStorage.getItem(key)
        return stored ? JSON.parse(stored) : defaultData
      } catch (error) {
        console.error(`Error loading ${key}:`, error)
        return defaultData
      }
    }

    // Hero Slides
    setHeroSlides(
      loadFromStorage("heroSlides", [
        {
          id: "slide1",
          title: "Shop the Latest Trends",
          subtitle:
            "Discover amazing products at unbeatable prices. From electronics to fashion, we've got everything you need.",
          image: "https://placehold.co/800x600/003087/FFFFFF?text=Premium+Electronics",
          cta: "Shop Now",
          link: "/products",
          active: true,
        },
        {
          id: "slide2",
          title: "Summer Collection 2023",
          subtitle: "Beat the heat with our coolest summer essentials. Limited time offers available now!",
          image: "https://placehold.co/800x600/003087/FFFFFF?text=Summer+Collection",
          cta: "View Collection",
          link: "/products?category=clothing",
          active: true,
        },
      ]),
    )

    // Split Cards
    setSplitCards(
      loadFromStorage("splitCards", [
        {
          id: "card1",
          title: "Fast Shipping",
          description: "Free delivery for all orders over ₹500",
          icon: "truck",
          link: "/shipping",
          linkText: "Learn More",
          active: true,
        },
        {
          id: "card2",
          title: "Easy Returns",
          description: "Hassle-free returns within 30 days",
          icon: "refresh-ccw",
          link: "/returns",
          linkText: "Return Policy",
          active: true,
        },
        {
          id: "card3",
          title: "Secure Payment",
          description: "Multiple secure payment options",
          icon: "shield",
          link: "/payment",
          linkText: "Payment Options",
          active: true,
        },
        {
          id: "card4",
          title: "24/7 Support",
          description: "Get help whenever you need it",
          icon: "headphones",
          link: "/support",
          linkText: "Contact Us",
          active: true,
        },
      ]),
    )

    // Animated Banners
    setAnimatedBanners(
      loadFromStorage("animatedBanners", [
        {
          id: "banner1",
          title: "Special Offers Just For You",
          subtitle: "Limited Time Deals",
          description:
            "Discover amazing discounts on our premium products. Take advantage of these exclusive offers before they're gone!",
          buttonText: "Shop Now",
          buttonLink: "/products",
          backgroundImage: "/placeholder.svg?height=600&width=600",
          backgroundColor: "#003087",
          active: true,
        },
      ]),
    )

    // Advertisements
    setAdvertisements(
      loadFromStorage("advertisements", [
        {
          id: "ad1",
          title: "New iPhone 15 Pro",
          description: "Experience the latest technology with our newest smartphone collection",
          image: "https://placehold.co/600x400/003087/FFFFFF?text=iPhone+15+Pro",
          buttonText: "Shop Now",
          buttonLink: "/products/iphone-15-pro",
          bgColor: "from-blue-900 to-blue-800",
          textColor: "text-white",
          active: true,
          featured: true,
          order: 1,
        },
        {
          id: "ad2",
          title: "Gaming Laptops",
          description: "Powerful gaming laptops for the ultimate gaming experience",
          image: "https://placehold.co/600x400/333333/FFFFFF?text=Gaming+Laptop",
          buttonText: "Explore",
          buttonLink: "/products/gaming-laptops",
          bgColor: "from-gray-900 to-gray-800",
          textColor: "text-white",
          active: true,
          featured: false,
          order: 2,
        },
      ]),
    )

    // Categories
    setCategories(
      loadFromStorage("categories", [
        {
          id: "smartphones",
          name: "Smartphones",
          image: "https://placehold.co/400x400/222222/FFFFFF?text=Smartphones",
          count: 24,
          description: "Latest smartphones with cutting-edge features",
          active: true,
        },
        {
          id: "laptops",
          name: "Laptops",
          image: "https://placehold.co/400x400/333333/FFFFFF?text=Laptops",
          count: 18,
          description: "Powerful laptops for work and entertainment",
          active: true,
        },
        {
          id: "headphones",
          name: "Headphones",
          image: "https://placehold.co/400x400/444444/FFFFFF?text=Headphones",
          count: 32,
          description: "Premium audio equipment for music lovers",
          active: true,
        },
      ]),
    )

    // Popular Products
    setPopularProducts(
      loadFromStorage("popularProducts", [
        {
          id: "pop1",
          name: "Wireless Headphones",
          description: "Premium wireless headphones with noise cancellation technology.",
          price: 9749,
          image: "https://placehold.co/300x300/222222/FFFFFF?text=Wireless+Headphones",
          sales: 1250,
          active: true,
        },
        {
          id: "pop2",
          name: "Smartphone",
          description: "Latest model smartphone with high-resolution camera and fast processor.",
          price: 52499,
          image: "https://placehold.co/300x300/333333/FFFFFF?text=Smartphone",
          sales: 980,
          active: true,
        },
      ]),
    )

    // Featured Products
    setFeaturedProducts(
      loadFromStorage("featuredProducts", [
        {
          id: "feat1",
          name: "Wireless Headphones",
          description: "Premium wireless headphones with noise cancellation technology.",
          price: 9749,
          image: "https://placehold.co/300x300/222222/FFFFFF?text=Wireless+Headphones",
          active: true,
        },
        {
          id: "feat2",
          name: "Smartphone",
          description: "Latest model smartphone with high-resolution camera and fast processor.",
          price: 52499,
          image: "https://placehold.co/300x300/333333/FFFFFF?text=Smartphone",
          active: true,
        },
      ]),
    )

    // Testimonials
    setTestimonials(
      loadFromStorage("testimonials", [
        {
          id: "test1",
          name: "Sarah Johnson",
          role: "Regular Customer",
          image: "https://placehold.co/200x200/222222/FFFFFF?text=Sarah+J",
          quote:
            "ShopEase has become my go-to online store. The quality of products and customer service is exceptional. I highly recommend them to everyone!",
          rating: 5,
          active: true,
        },
        {
          id: "test2",
          name: "Michael Chen",
          role: "Tech Enthusiast",
          image: "https://placehold.co/200x200/333333/FFFFFF?text=Michael+C",
          quote:
            "I've purchased several electronics from ShopEase and have always been impressed with the fast shipping and product quality. Their prices are unbeatable!",
          rating: 5,
          active: true,
        },
      ]),
    )

    // Brands
    setBrands(
      loadFromStorage("brands", [
        {
          id: "brand1",
          name: "Realme",
          logo: "realme",
          url: "/products?brand=realme",
          active: true,
        },
        {
          id: "brand2",
          name: "Apple",
          logo: "apple",
          url: "/products?brand=apple",
          active: true,
        },
        {
          id: "brand3",
          name: "Samsung",
          logo: "samsung",
          url: "/products?brand=samsung",
          active: true,
        },
      ]),
    )
  }

  // Save data to localStorage (for non-offers sections)
  const saveData = (key: string, data: any) => {
    try {
      localStorage.setItem(key, JSON.stringify(data))
      setSuccessMessage(`${key} updated successfully!`)
      setTimeout(() => setSuccessMessage(""), 3000)
    } catch (error) {
      console.error(`Error saving ${key}:`, error)
      toast.error(`Failed to save ${key}. Please try again.`)
    }
  }

  // Save offer product to database
  const saveOfferProduct = async (offerData: OfferProduct) => {
    try {
      setLoading(true)

      const isEditing = offerData._id || offerData.id
      const url = isEditing ? `/api/offers/${offerData._id || offerData.id}` : "/api/offers"
      const method = isEditing ? "PUT" : "POST"

      const payload = {
        name: offerData.name.trim(),
        description: offerData.description.trim(),
        originalPrice: Number(offerData.originalPrice),
        offerPrice: Number(offerData.offerPrice),
        discount: Number(offerData.discount),
        image: offerData.image.trim(),
        badge: offerData.badge,
        stock: Number(offerData.stock),
        active: Boolean(offerData.active),
      }

      console.log("Saving offer with payload:", payload)

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      const result = await response.json()
      console.log("Save offer response:", result)

      if (result.success) {
        toast.success(result.message || "Offer saved successfully!")
        await loadOfferProducts() // Reload offers
        setEditingOfferProduct(null)
      } else {
        console.error("Save offer error:", result)
        toast.error(result.error || "Failed to save offer")
      }
    } catch (error) {
      console.error("Error saving offer:", error)
      toast.error("Failed to save offer. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // Delete offer product from database
  const deleteOfferProduct = async (offerId: string) => {
    if (!confirm("Are you sure you want to delete this offer?")) return

    try {
      setLoading(true)

      const response = await fetch(`/api/offers/${offerId}`, {
        method: "DELETE",
      })

      const result = await response.json()

      if (result.success) {
        toast.success("Offer deleted successfully!")
        await loadOfferProducts() // Reload offers
      } else {
        toast.error(result.error || "Failed to delete offer")
      }
    } catch (error) {
      console.error("Error deleting offer:", error)
      toast.error("Failed to delete offer. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // Toggle offer active status
  const toggleOfferActive = async (offer: OfferProduct) => {
    try {
      setLoading(true)

      const response = await fetch(`/api/offers/${offer._id || offer.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: offer.name,
          description: offer.description,
          originalPrice: offer.originalPrice,
          offerPrice: offer.offerPrice,
          discount: offer.discount,
          image: offer.image,
          badge: offer.badge,
          stock: offer.stock,
          active: !offer.active,
        }),
      })

      const result = await response.json()

      if (result.success) {
        toast.success(`Offer ${!offer.active ? "activated" : "deactivated"} successfully!`)
        await loadOfferProducts() // Reload offers
      } else {
        toast.error(result.error || "Failed to update offer")
      }
    } catch (error) {
      console.error("Error updating offer:", error)
      toast.error("Failed to update offer. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // Helper function to create a new ID
  const createId = (prefix: string) => `${prefix}_${Date.now()}`

  // Move item functions (for localStorage sections)
  const moveItemUp = (array: any[], index: number, setFunction: Function, key: string) => {
    if (index <= 0) return
    const newArray = [...array]
    const temp = newArray[index]
    newArray[index] = newArray[index - 1]
    newArray[index - 1] = temp
    setFunction(newArray)
    saveData(key, newArray)
  }

  const moveItemDown = (array: any[], index: number, setFunction: Function, key: string) => {
    if (index >= array.length - 1) return
    const newArray = [...array]
    const temp = newArray[index]
    newArray[index] = newArray[index + 1]
    newArray[index + 1] = temp
    setFunction(newArray)
    saveData(key, newArray)
  }

  // Toggle active status (for localStorage sections)
  const toggleActive = (item: any, array: any[], setFunction: Function, key: string) => {
    const newArray = array.map((i) => (i.id === item.id ? { ...i, active: !i.active } : i))
    setFunction(newArray)
    saveData(key, newArray)
  }

  // Delete item (for localStorage sections)
  const deleteItem = (id: string, array: any[], setFunction: Function, key: string, itemName: string) => {
    if (confirm(`Are you sure you want to delete this ${itemName}?`)) {
      const newArray = array.filter((item) => item.id !== id)
      setFunction(newArray)
      saveData(key, newArray)
    }
  }

  // Icon renderer
  const renderIcon = (iconName: string) => {
    const iconMap: Record<string, JSX.Element> = {
      truck: <div className="w-5 h-5">🚚</div>,
      shield: <div className="w-5 h-5">🛡️</div>,
      star: <StarIcon className="w-5 h-5" />,
      tag: <Tag className="w-5 h-5" />,
      "credit-card": <div className="w-5 h-5">💳</div>,
      headphones: <div className="w-5 h-5">🎧</div>,
      gift: <div className="w-5 h-5">🎁</div>,
      "refresh-ccw": <div className="w-5 h-5">🔄</div>,
    }
    return iconMap[iconName] || <div className="w-5 h-5">⭐</div>
  }

  // Tab navigation
  const tabs = [
    { id: "hero", label: "Hero Slides", icon: Layout },
    { id: "splitCards", label: "Banner Cards", icon: Grid },
    { id: "animatedBanner", label: "Animated Banner", icon: Layers },
    { id: "advertisements", label: "Advertisements", icon: Monitor },
    { id: "categories", label: "Categories", icon: ShoppingBag },
    { id: "offers", label: "Special Offers", icon: Tag },
    { id: "popular", label: "Popular Products", icon: Star },
    { id: "featured", label: "Featured Products", icon: ShoppingBag },
    { id: "testimonials", label: "Testimonials", icon: Users },
    { id: "brands", label: "Featured Brands", icon: Star },
  ]

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Home className="h-6 w-6 mr-2" />
          <h1 className="text-2xl font-semibold">Homepage Management</h1>
        </div>
        <Button onClick={() => router.push("/admin")}>Back to Dashboard</Button>
      </div>

      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {successMessage}
        </div>
      )}

      {/* Tab Navigation */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2 border-b overflow-x-auto">
          {tabs.map((tab) => {
            const IconComponent = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 font-medium flex items-center whitespace-nowrap ${
                  activeTab === tab.id
                    ? "border-b-2 border-blue-800 text-blue-800"
                    : "text-gray-600 hover:text-blue-800"
                }`}
              >
                <IconComponent className="h-4 w-4 mr-2" />
                {tab.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Special Offers Tab - Updated to use database */}
      {activeTab === "offers" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>Special Offers</span>
              <div className="flex space-x-2">
                <Button variant="outline" onClick={loadOfferProducts} disabled={offersLoading}>
                  <RefreshCw className={`mr-2 h-4 w-4 ${offersLoading ? "animate-spin" : ""}`} />
                  Refresh
                </Button>
                <Button
                  onClick={() => {
                    setEditingOfferProduct({
                      name: "",
                      description: "",
                      originalPrice: 0,
                      offerPrice: 0,
                      discount: 0,
                      image: "",
                      badge: "Hot Deal",
                      stock: 0,
                      active: true,
                    })
                  }}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Offer
                </Button>
              </div>
            </CardTitle>
            <CardDescription>
              Manage special offer products displayed on the homepage. Changes will be reflected immediately on the
              website.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {offersLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-800"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {offerProducts.length === 0 ? (
                  <div className="col-span-full text-center py-8 bg-gray-50 rounded-lg">
                    <Tag className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600">No special offers found</p>
                    <p className="text-sm text-gray-500">Create your first offer to get started</p>
                  </div>
                ) : (
                  offerProducts.map((offer, index) => (
                    <div
                      key={offer._id || offer.id}
                      className={`border rounded-lg p-4 ${!offer.active ? "opacity-50" : ""}`}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center">
                          <div className="w-16 h-16 bg-gray-200 rounded overflow-hidden mr-4">
                            <img
                              src={offer.image || "/placeholder.svg"}
                              alt={offer.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement
                                target.src = "/placeholder.svg?height=64&width=64"
                              }}
                            />
                          </div>
                          <div>
                            <h3 className="font-semibold">{offer.name}</h3>
                            <p className="text-sm text-gray-500">{offer.discount}% OFF</p>
                            <span
                              className={`px-2 py-1 text-xs rounded ${offer.active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                            >
                              {offer.active ? "Active" : "Inactive"}
                            </span>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleOfferActive(offer)}
                            disabled={loading}
                          >
                            {offer.active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingOfferProduct(offer)}
                            disabled={loading}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => deleteOfferProduct(offer._id || offer.id || "")}
                            disabled={loading}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="text-sm space-y-1">
                        <div>
                          <span className="font-medium">Original:</span> ₹{offer.originalPrice.toLocaleString("en-IN")}
                        </div>
                        <div>
                          <span className="font-medium">Offer:</span> ₹{offer.offerPrice.toLocaleString("en-IN")}
                        </div>
                        <div>
                          <span className="font-medium">Stock:</span> {offer.stock}
                        </div>
                        <div>
                          <span className="font-medium">Badge:</span> {offer.badge}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Edit Offer Product Modal */}
            {editingOfferProduct && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                  <div className="p-6">
                    <h2 className="text-xl font-semibold mb-4">
                      {editingOfferProduct._id || editingOfferProduct.id ? "Edit Offer" : "Add New Offer"}
                    </h2>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="name">Product Name</Label>
                        <Input
                          id="name"
                          value={editingOfferProduct.name}
                          onChange={(e) => setEditingOfferProduct({ ...editingOfferProduct, name: e.target.value })}
                          placeholder="Enter product name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          value={editingOfferProduct.description}
                          onChange={(e) =>
                            setEditingOfferProduct({ ...editingOfferProduct, description: e.target.value })
                          }
                          rows={3}
                          placeholder="Enter product description"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="originalPrice">Original Price (₹)</Label>
                          <Input
                            id="originalPrice"
                            type="number"
                            value={editingOfferProduct.originalPrice}
                            onChange={(e) => {
                              const originalPrice = Number.parseFloat(e.target.value) || 0
                              const discount =
                                originalPrice > 0
                                  ? Math.round(((originalPrice - editingOfferProduct.offerPrice) / originalPrice) * 100)
                                  : 0
                              setEditingOfferProduct({ ...editingOfferProduct, originalPrice, discount })
                            }}
                            placeholder="0"
                          />
                        </div>
                        <div>
                          <Label htmlFor="offerPrice">Offer Price (₹)</Label>
                          <Input
                            id="offerPrice"
                            type="number"
                            value={editingOfferProduct.offerPrice}
                            onChange={(e) => {
                              const offerPrice = Number.parseFloat(e.target.value) || 0
                              const discount =
                                editingOfferProduct.originalPrice > 0
                                  ? Math.round(
                                      ((editingOfferProduct.originalPrice - offerPrice) /
                                        editingOfferProduct.originalPrice) *
                                        100,
                                    )
                                  : 0
                              setEditingOfferProduct({ ...editingOfferProduct, offerPrice, discount })
                            }}
                            placeholder="0"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="discount">Discount (%)</Label>
                          <Input
                            id="discount"
                            type="number"
                            value={editingOfferProduct.discount}
                            onChange={(e) => {
                              const discount = Number.parseFloat(e.target.value) || 0
                              const offerPrice = editingOfferProduct.originalPrice * (1 - discount / 100)
                              setEditingOfferProduct({
                                ...editingOfferProduct,
                                discount,
                                offerPrice: Math.round(offerPrice),
                              })
                            }}
                            placeholder="0"
                          />
                        </div>
                        <div>
                          <Label htmlFor="stock">Stock</Label>
                          <Input
                            id="stock"
                            type="number"
                            value={editingOfferProduct.stock}
                            onChange={(e) =>
                              setEditingOfferProduct({
                                ...editingOfferProduct,
                                stock: Number.parseInt(e.target.value) || 0,
                              })
                            }
                            placeholder="0"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="badge">Badge</Label>
                        <select
                          id="badge"
                          value={editingOfferProduct.badge}
                          onChange={(e) => setEditingOfferProduct({ ...editingOfferProduct, badge: e.target.value })}
                          className="w-full px-3 py-2 border rounded-md"
                        >
                          <option value="Hot Deal">Hot Deal</option>
                          <option value="Best Seller">Best Seller</option>
                          <option value="Limited Time">Limited Time</option>
                          <option value="New Arrival">New Arrival</option>
                          <option value="Flash Sale">Flash Sale</option>
                        </select>
                      </div>
                      <div>
                        <Label htmlFor="image">Image URL</Label>
                        <div className="flex">
                          <Input
                            id="image"
                            value={editingOfferProduct.image}
                            onChange={(e) => setEditingOfferProduct({ ...editingOfferProduct, image: e.target.value })}
                            className="flex-1"
                            placeholder="https://example.com/image.jpg"
                          />
                          <Button variant="outline" className="ml-2 bg-transparent">
                            <ImageIcon className="h-4 w-4" />
                          </Button>
                        </div>
                        {editingOfferProduct.image && (
                          <div className="mt-2 border rounded p-2">
                            <img
                              src={editingOfferProduct.image || "/placeholder.svg"}
                              alt="Preview"
                              className="h-40 object-cover mx-auto"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement
                                target.src = "/placeholder.svg?height=160&width=160"
                              }}
                            />
                          </div>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="active"
                          checked={editingOfferProduct.active}
                          onChange={(e) => setEditingOfferProduct({ ...editingOfferProduct, active: e.target.checked })}
                        />
                        <Label htmlFor="active">Active</Label>
                      </div>
                    </div>
                    <div className="flex justify-end space-x-3 mt-6">
                      <Button variant="outline" onClick={() => setEditingOfferProduct(null)} disabled={loading}>
                        Cancel
                      </Button>
                      <Button onClick={() => saveOfferProduct(editingOfferProduct)} disabled={loading}>
                        {loading ? (
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <Save className="h-4 w-4 mr-2" />
                        )}
                        {loading ? "Saving..." : "Save"}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Hero Slides Tab */}
      {activeTab === "hero" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>Hero Slides</span>
              <Button
                onClick={() => {
                  setEditingHeroSlide({
                    id: createId("slide"),
                    title: "",
                    subtitle: "",
                    image: "",
                    cta: "Shop Now",
                    link: "/products",
                    active: true,
                  })
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Slide
              </Button>
            </CardTitle>
            <CardDescription>Manage the hero slides that appear at the top of your homepage</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {heroSlides.map((slide, index) => (
                <div key={slide.id} className={`border rounded-lg p-4 ${!slide.active ? "opacity-50" : ""}`}>
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center">
                      <div className="w-16 h-16 bg-gray-200 rounded overflow-hidden mr-4">
                        <img
                          src={slide.image || "/placeholder.svg"}
                          alt={slide.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold">{slide.title}</h3>
                        <p className="text-sm text-gray-500 line-clamp-1">{slide.subtitle}</p>
                        <div className="flex items-center mt-1">
                          <span
                            className={`px-2 py-1 text-xs rounded ${slide.active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                          >
                            {slide.active ? "Active" : "Inactive"}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleActive(slide, heroSlides, setHeroSlides, "heroSlides")}
                      >
                        {slide.active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => moveItemUp(heroSlides, index, setHeroSlides, "heroSlides")}
                        disabled={index === 0}
                      >
                        <MoveUp className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => moveItemDown(heroSlides, index, setHeroSlides, "heroSlides")}
                        disabled={index === heroSlides.length - 1}
                      >
                        <MoveDown className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => setEditingHeroSlide(slide)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteItem(slide.id, heroSlides, setHeroSlides, "heroSlides", "slide")}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">CTA:</span> {slide.cta}
                    </div>
                    <div>
                      <span className="font-medium">Link:</span> {slide.link}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Edit Hero Slide Modal */}
            {editingHeroSlide && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                  <div className="p-6">
                    <h2 className="text-xl font-semibold mb-4">
                      {editingHeroSlide.id.startsWith("slide") && !heroSlides.find((s) => s.id === editingHeroSlide.id)
                        ? "Add New Slide"
                        : "Edit Slide"}
                    </h2>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="title">Title</Label>
                        <Input
                          id="title"
                          value={editingHeroSlide.title}
                          onChange={(e) => setEditingHeroSlide({ ...editingHeroSlide, title: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="subtitle">Subtitle</Label>
                        <Textarea
                          id="subtitle"
                          value={editingHeroSlide.subtitle}
                          onChange={(e) => setEditingHeroSlide({ ...editingHeroSlide, subtitle: e.target.value })}
                          rows={3}
                        />
                      </div>
                      <div>
                        <Label htmlFor="image">Image URL</Label>
                        <div className="flex">
                          <Input
                            id="image"
                            value={editingHeroSlide.image}
                            onChange={(e) => setEditingHeroSlide({ ...editingHeroSlide, image: e.target.value })}
                            className="flex-1"
                          />
                          <Button variant="outline" className="ml-2 bg-transparent">
                            <ImageIcon className="h-4 w-4" />
                          </Button>
                        </div>
                        {editingHeroSlide.image && (
                          <div className="mt-2 border rounded p-2">
                            <img
                              src={editingHeroSlide.image || "/placeholder.svg"}
                              alt="Preview"
                              className="h-40 object-cover mx-auto"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement
                                target.src = "/placeholder.svg"
                              }}
                            />
                          </div>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="cta">CTA Text</Label>
                        <Input
                          id="cta"
                          value={editingHeroSlide.cta}
                          onChange={(e) => setEditingHeroSlide({ ...editingHeroSlide, cta: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="link">Link</Label>
                        <Input
                          id="link"
                          value={editingHeroSlide.link}
                          onChange={(e) => setEditingHeroSlide({ ...editingHeroSlide, link: e.target.value })}
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="active"
                          checked={editingHeroSlide.active}
                          onChange={(e) => setEditingHeroSlide({ ...editingHeroSlide, active: e.target.checked })}
                        />
                        <Label htmlFor="active">Active</Label>
                      </div>
                    </div>
                    <div className="flex justify-end space-x-3 mt-6">
                      <Button variant="outline" onClick={() => setEditingHeroSlide(null)}>
                        Cancel
                      </Button>
                      <Button
                        onClick={() => {
                          const isNewSlide = !heroSlides.find((s) => s.id === editingHeroSlide.id)
                          let newSlides

                          if (isNewSlide) {
                            newSlides = [...heroSlides, editingHeroSlide]
                          } else {
                            newSlides = heroSlides.map((s) => (s.id === editingHeroSlide.id ? editingHeroSlide : s))
                          }

                          setHeroSlides(newSlides)
                          saveData("heroSlides", newSlides)
                          setEditingHeroSlide(null)
                        }}
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Save
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Split Cards Tab */}
      {activeTab === "splitCards" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>Banner Cards</span>
              <Button
                onClick={() => {
                  setEditingSplitCard({
                    id: createId("card"),
                    title: "",
                    description: "",
                    icon: "star",
                    link: "/",
                    linkText: "Learn More",
                    active: true,
                  })
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Card
              </Button>
            </CardTitle>
            <CardDescription>Manage the banner cards section displayed below the hero</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {splitCards.map((card, index) => (
                <div key={card.id} className={`border rounded-lg p-4 ${!card.active ? "opacity-50" : ""}`}>
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center mr-4">
                        {renderIcon(card.icon)}
                      </div>
                      <div>
                        <h3 className="font-semibold">{card.title}</h3>
                        <p className="text-sm text-gray-500 line-clamp-1">{card.description}</p>
                        <div className="flex items-center mt-1">
                          <span
                            className={`px-2 py-1 text-xs rounded ${card.active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                          >
                            {card.active ? "Active" : "Inactive"}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleActive(card, splitCards, setSplitCards, "splitCards")}
                      >
                        {card.active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => setEditingSplitCard(card)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteItem(card.id, splitCards, setSplitCards, "splitCards", "card")}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Link Text:</span> {card.linkText}
                    </div>
                    <div>
                      <span className="font-medium">Link:</span> {card.link}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Edit Split Card Modal */}
            {editingSplitCard && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                  <div className="p-6">
                    <h2 className="text-xl font-semibold mb-4">
                      {editingSplitCard.id.startsWith("card") && !splitCards.find((c) => c.id === editingSplitCard.id)
                        ? "Add New Card"
                        : "Edit Card"}
                    </h2>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="title">Title</Label>
                        <Input
                          id="title"
                          value={editingSplitCard.title}
                          onChange={(e) => setEditingSplitCard({ ...editingSplitCard, title: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          value={editingSplitCard.description}
                          onChange={(e) => setEditingSplitCard({ ...editingSplitCard, description: e.target.value })}
                          rows={3}
                        />
                      </div>
                      <div>
                        <Label htmlFor="icon">Icon</Label>
                        <select
                          id="icon"
                          value={editingSplitCard.icon}
                          onChange={(e) => setEditingSplitCard({ ...editingSplitCard, icon: e.target.value })}
                          className="w-full px-3 py-2 border rounded-md"
                        >
                          <option value="star">Star</option>
                          <option value="truck">Truck</option>
                          <option value="shield">Shield</option>
                          <option value="headphones">Headphones</option>
                          <option value="credit-card">Credit Card</option>
                          <option value="gift">Gift</option>
                          <option value="tag">Tag</option>
                          <option value="refresh-ccw">Refresh</option>
                        </select>
                        <div className="mt-2 p-2 border rounded flex items-center">
                          <div className="w-10 h-10 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center">
                            {renderIcon(editingSplitCard.icon)}
                          </div>
                          <span className="ml-2 text-sm text-gray-500">Icon Preview</span>
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="linkText">Link Text</Label>
                        <Input
                          id="linkText"
                          value={editingSplitCard.linkText}
                          onChange={(e) => setEditingSplitCard({ ...editingSplitCard, linkText: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="link">Link URL</Label>
                        <Input
                          id="link"
                          value={editingSplitCard.link}
                          onChange={(e) => setEditingSplitCard({ ...editingSplitCard, link: e.target.value })}
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="active"
                          checked={editingSplitCard.active}
                          onChange={(e) => setEditingSplitCard({ ...editingSplitCard, active: e.target.checked })}
                        />
                        <Label htmlFor="active">Active</Label>
                      </div>
                    </div>
                    <div className="flex justify-end space-x-3 mt-6">
                      <Button variant="outline" onClick={() => setEditingSplitCard(null)}>
                        Cancel
                      </Button>
                      <Button
                        onClick={() => {
                          const isNewCard = !splitCards.find((c) => c.id === editingSplitCard.id)
                          let newCards

                          if (isNewCard) {
                            newCards = [...splitCards, editingSplitCard]
                          } else {
                            newCards = splitCards.map((c) => (c.id === editingSplitCard.id ? editingSplitCard : c))
                          }

                          setSplitCards(newCards)
                          saveData("splitCards", newCards)
                          setEditingSplitCard(null)
                        }}
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Save
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Animated Banner Tab */}
      {activeTab === "animatedBanner" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>Animated Banner</span>
              <Button
                onClick={() => {
                  setEditingAnimatedBanner({
                    id: createId("banner"),
                    title: "",
                    subtitle: "",
                    description: "",
                    buttonText: "Shop Now",
                    buttonLink: "/products",
                    backgroundImage: "",
                    backgroundColor: "#003087",
                    active: true,
                  })
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Banner
              </Button>
            </CardTitle>
            <CardDescription>Manage the animated banner displayed on the homepage</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {animatedBanners.map((banner, index) => (
                <div
                  key={banner.id}
                  className={`border rounded-lg overflow-hidden ${!banner.active ? "opacity-50" : ""}`}
                >
                  <div className="relative h-40" style={{ backgroundColor: banner.backgroundColor || "#003087" }}>
                    <div
                      className="absolute inset-0 z-10"
                      style={{ backgroundColor: banner.backgroundColor || "#003087", opacity: 0.8 }}
                    ></div>
                    {banner.backgroundImage && (
                      <img
                        src={banner.backgroundImage || "/placeholder.svg"}
                        alt={banner.title}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    )}
                    <div className="relative z-20 p-4 text-white h-full flex flex-col justify-center">
                      <div className="text-sm opacity-80">{banner.subtitle}</div>
                      <h3 className="text-xl font-bold">{banner.title}</h3>
                      <p className="text-sm opacity-90 line-clamp-2 mt-1">{banner.description}</p>
                    </div>
                  </div>
                  <div className="p-4 bg-white flex justify-between items-center">
                    <div className="text-sm">
                      <span className="font-medium">Button:</span> {banner.buttonText} → {banner.buttonLink}
                      <br />
                      <span
                        className={`px-2 py-1 text-xs rounded ${banner.active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                      >
                        {banner.active ? "Active" : "Inactive"}
                      </span>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleActive(banner, animatedBanners, setAnimatedBanners, "animatedBanners")}
                      >
                        {banner.active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => setEditingAnimatedBanner(banner)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() =>
                          deleteItem(banner.id, animatedBanners, setAnimatedBanners, "animatedBanners", "banner")
                        }
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Edit Animated Banner Modal */}
            {editingAnimatedBanner && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                  <div className="p-6">
                    <h2 className="text-xl font-semibold mb-4">
                      {editingAnimatedBanner.id.startsWith("banner") &&
                      !animatedBanners.find((b) => b.id === editingAnimatedBanner.id)
                        ? "Add New Banner"
                        : "Edit Banner"}
                    </h2>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="title">Title</Label>
                        <Input
                          id="title"
                          value={editingAnimatedBanner.title}
                          onChange={(e) =>
                            setEditingAnimatedBanner({ ...editingAnimatedBanner, title: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="subtitle">Subtitle</Label>
                        <Input
                          id="subtitle"
                          value={editingAnimatedBanner.subtitle}
                          onChange={(e) =>
                            setEditingAnimatedBanner({ ...editingAnimatedBanner, subtitle: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          value={editingAnimatedBanner.description}
                          onChange={(e) =>
                            setEditingAnimatedBanner({ ...editingAnimatedBanner, description: e.target.value })
                          }
                          rows={3}
                        />
                      </div>
                      <div>
                        <Label htmlFor="buttonText">Button Text</Label>
                        <Input
                          id="buttonText"
                          value={editingAnimatedBanner.buttonText}
                          onChange={(e) =>
                            setEditingAnimatedBanner({ ...editingAnimatedBanner, buttonText: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="buttonLink">Button Link</Label>
                        <Input
                          id="buttonLink"
                          value={editingAnimatedBanner.buttonLink}
                          onChange={(e) =>
                            setEditingAnimatedBanner({ ...editingAnimatedBanner, buttonLink: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="backgroundColor">Background Color</Label>
                        <div className="flex">
                          <Input
                            id="backgroundColor"
                            value={editingAnimatedBanner.backgroundColor}
                            onChange={(e) =>
                              setEditingAnimatedBanner({ ...editingAnimatedBanner, backgroundColor: e.target.value })
                            }
                            className="flex-1"
                          />
                          <div
                            className="w-10 h-10 border border-l-0 rounded-r-md"
                            style={{ backgroundColor: editingAnimatedBanner.backgroundColor || "#003087" }}
                          ></div>
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="backgroundImage">Background Image URL</Label>
                        <div className="flex">
                          <Input
                            id="backgroundImage"
                            value={editingAnimatedBanner.backgroundImage}
                            onChange={(e) =>
                              setEditingAnimatedBanner({ ...editingAnimatedBanner, backgroundImage: e.target.value })
                            }
                            className="flex-1"
                          />
                          <Button variant="outline" className="ml-2">
                            <ImageIcon className="h-4 w-4" />
                          </Button>
                        </div>
                        {editingAnimatedBanner.backgroundImage && (
                          <div className="mt-2 border rounded p-2">
                            <img
                              src={editingAnimatedBanner.backgroundImage || "/placeholder.svg"}
                              alt="Preview"
                              className="h-40 object-cover mx-auto"
                              onError={(e) => {
                                ;(e.target as HTMLImageElement).src = "/placeholder.svg"
                              }}
                            />
                          </div>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="active"
                          checked={editingAnimatedBanner.active}
                          onChange={(e) =>
                            setEditingAnimatedBanner({ ...editingAnimatedBanner, active: e.target.checked })
                          }
                        />
                        <Label htmlFor="active">Active</Label>
                      </div>
                    </div>
                    <div className="flex justify-end space-x-3 mt-6">
                      <Button variant="outline" onClick={() => setEditingAnimatedBanner(null)}>
                        Cancel
                      </Button>
                      <Button
                        onClick={() => {
                          const isNewBanner = !animatedBanners.find((b) => b.id === editingAnimatedBanner.id)
                          let newBanners

                          if (isNewBanner) {
                            newBanners = [...animatedBanners, editingAnimatedBanner]
                          } else {
                            newBanners = animatedBanners.map((b) =>
                              b.id === editingAnimatedBanner.id ? editingAnimatedBanner : b,
                            )
                          }

                          setAnimatedBanners(newBanners)
                          saveData("animatedBanners", newBanners)
                          setEditingAnimatedBanner(null)
                        }}
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Save
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Advertisements Tab */}
      {activeTab === "advertisements" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>Advertisements</span>
              <Button
                onClick={() => {
                  setEditingAdvertisement({
                    id: createId("ad"),
                    title: "",
                    description: "",
                    image: "",
                    buttonText: "Learn More",
                    buttonLink: "/products",
                    bgColor: "from-blue-900 to-blue-800",
                    textColor: "text-white",
                    active: true,
                    featured: false,
                    order: advertisements.length + 1,
                  })
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Advertisement
              </Button>
            </CardTitle>
            <CardDescription>Manage product advertisements displayed below the animated banner</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {advertisements.map((ad, index) => (
                <div key={ad.id} className={`border rounded-lg overflow-hidden ${!ad.active ? "opacity-50" : ""}`}>
                  <div className={`bg-gradient-to-r ${ad.bgColor} p-4 ${ad.textColor}`}>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-lg font-bold">{ad.title}</h3>
                        <p className="text-sm opacity-90">{ad.description}</p>
                      </div>
                      <div className="flex space-x-1">
                        {ad.featured && (
                          <span className="px-2 py-1 text-xs bg-yellow-500 text-black rounded-full">Featured</span>
                        )}
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${ad.active ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}
                        >
                          {ad.active ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </div>
                    {ad.image && (
                      <div className="mt-2">
                        <img
                          src={ad.image || "/placeholder.svg"}
                          alt={ad.title}
                          className="w-full h-32 object-cover rounded"
                        />
                      </div>
                    )}
                  </div>
                  <div className="p-4 bg-white flex justify-between items-center">
                    <div className="text-sm">
                      <span className="font-medium">Button:</span> {ad.buttonText} → {ad.buttonLink}
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => moveItemUp(advertisements, index, setAdvertisements, "advertisements")}
                        disabled={index === 0}
                      >
                        <MoveUp className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => moveItemDown(advertisements, index, setAdvertisements, "advertisements")}
                        disabled={index === advertisements.length - 1}
                      >
                        <MoveDown className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleActive(ad, advertisements, setAdvertisements, "advertisements")}
                      >
                        {ad.active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => setEditingAdvertisement(ad)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() =>
                          deleteItem(ad.id, advertisements, setAdvertisements, "advertisements", "advertisement")
                        }
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Edit Advertisement Modal */}
            {editingAdvertisement && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                  <div className="p-6">
                    <h2 className="text-xl font-semibold mb-4">
                      {editingAdvertisement.id.startsWith("ad") &&
                      !advertisements.find((a) => a.id === editingAdvertisement.id)
                        ? "Add New Advertisement"
                        : "Edit Advertisement"}
                    </h2>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="title">Title</Label>
                        <Input
                          id="title"
                          value={editingAdvertisement.title}
                          onChange={(e) => setEditingAdvertisement({ ...editingAdvertisement, title: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          value={editingAdvertisement.description}
                          onChange={(e) =>
                            setEditingAdvertisement({ ...editingAdvertisement, description: e.target.value })
                          }
                          rows={3}
                        />
                      </div>
                      <div>
                        <Label htmlFor="image">Image URL</Label>
                        <div className="flex">
                          <Input
                            id="image"
                            value={editingAdvertisement.image}
                            onChange={(e) =>
                              setEditingAdvertisement({ ...editingAdvertisement, image: e.target.value })
                            }
                            className="flex-1"
                          />
                          <Button variant="outline" className="ml-2">
                            <ImageIcon className="h-4 w-4" />
                          </Button>
                        </div>
                        {editingAdvertisement.image && (
                          <div className="mt-2 border rounded p-2">
                            <img
                              src={editingAdvertisement.image || "/placeholder.svg"}
                              alt="Preview"
                              className="h-40 object-cover mx-auto"
                              onError={(e) => {
                                ;(e.target as HTMLImageElement).src = "/placeholder.svg"
                              }}
                            />
                          </div>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="buttonText">Button Text</Label>
                          <Input
                            id="buttonText"
                            value={editingAdvertisement.buttonText}
                            onChange={(e) =>
                              setEditingAdvertisement({ ...editingAdvertisement, buttonText: e.target.value })
                            }
                          />
                        </div>
                        <div>
                          <Label htmlFor="buttonLink">Button Link</Label>
                          <Input
                            id="buttonLink"
                            value={editingAdvertisement.buttonLink}
                            onChange={(e) =>
                              setEditingAdvertisement({ ...editingAdvertisement, buttonLink: e.target.value })
                            }
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="bgColor">Background Color</Label>
                        <select
                          id="bgColor"
                          value={editingAdvertisement.bgColor}
                          onChange={(e) =>
                            setEditingAdvertisement({ ...editingAdvertisement, bgColor: e.target.value })
                          }
                          className="w-full px-3 py-2 border rounded-md"
                        >
                          <option value="from-blue-900 to-blue-800">Blue Gradient</option>
                          <option value="from-gray-900 to-gray-800">Gray Gradient</option>
                          <option value="from-green-900 to-green-800">Green Gradient</option>
                          <option value="from-purple-900 to-purple-800">Purple Gradient</option>
                          <option value="from-red-900 to-red-800">Red Gradient</option>
                          <option value="from-yellow-900 to-yellow-800">Yellow Gradient</option>
                        </select>
                      </div>
                      <div>
                        <Label htmlFor="textColor">Text Color</Label>
                        <select
                          id="textColor"
                          value={editingAdvertisement.textColor}
                          onChange={(e) =>
                            setEditingAdvertisement({ ...editingAdvertisement, textColor: e.target.value })
                          }
                          className="w-full px-3 py-2 border rounded-md"
                        >
                          <option value="text-white">White</option>
                          <option value="text-black">Black</option>
                          <option value="text-gray-800">Dark Gray</option>
                        </select>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="active"
                            checked={editingAdvertisement.active}
                            onChange={(e) =>
                              setEditingAdvertisement({ ...editingAdvertisement, active: e.target.checked })
                            }
                          />
                          <Label htmlFor="active">Active</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="featured"
                            checked={editingAdvertisement.featured}
                            onChange={(e) =>
                              setEditingAdvertisement({ ...editingAdvertisement, featured: e.target.checked })
                            }
                          />
                          <Label htmlFor="featured">Featured</Label>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end space-x-3 mt-6">
                      <Button variant="outline" onClick={() => setEditingAdvertisement(null)}>
                        Cancel
                      </Button>
                      <Button
                        onClick={() => {
                          const isNewAd = !advertisements.find((a) => a.id === editingAdvertisement.id)
                          let newAds

                          if (isNewAd) {
                            newAds = [...advertisements, editingAdvertisement]
                          } else {
                            newAds = advertisements.map((a) =>
                              a.id === editingAdvertisement.id ? editingAdvertisement : a,
                            )
                          }

                          setAdvertisements(newAds)
                          saveData("advertisements", newAds)
                          setEditingAdvertisement(null)
                        }}
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Save
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Categories Tab */}
      {activeTab === "categories" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>Categories</span>
              <Button
                onClick={() => {
                  setEditingCategory({
                    id: createId("cat"),
                    name: "",
                    image: "",
                    count: 0,
                    description: "",
                    active: true,
                  })
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Category
              </Button>
            </CardTitle>
            <CardDescription>Manage product categories displayed on the homepage</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((category, index) => (
                <div key={category.id} className={`border rounded-lg p-4 ${!category.active ? "opacity-50" : ""}`}>
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center">
                      <div className="w-16 h-16 bg-gray-200 rounded overflow-hidden mr-4">
                        <img
                          src={category.image || "/placeholder.svg"}
                          alt={category.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold">{category.name}</h3>
                        <p className="text-sm text-gray-500">{category.count} products</p>
                        <span
                          className={`px-2 py-1 text-xs rounded ${category.active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                        >
                          {category.active ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleActive(category, categories, setCategories, "categories")}
                      >
                        {category.active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => setEditingCategory(category)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteItem(category.id, categories, setCategories, "categories", "category")}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2">{category.description}</p>
                </div>
              ))}
            </div>

            {/* Edit Category Modal */}
            {editingCategory && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                  <div className="p-6">
                    <h2 className="text-xl font-semibold mb-4">
                      {editingCategory.id.startsWith("cat") && !categories.find((c) => c.id === editingCategory.id)
                        ? "Add New Category"
                        : "Edit Category"}
                    </h2>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="name">Category Name</Label>
                        <Input
                          id="name"
                          value={editingCategory.name}
                          onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          value={editingCategory.description}
                          onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })}
                          rows={3}
                        />
                      </div>
                      <div>
                        <Label htmlFor="image">Image URL</Label>
                        <div className="flex">
                          <Input
                            id="image"
                            value={editingCategory.image}
                            onChange={(e) => setEditingCategory({ ...editingCategory, image: e.target.value })}
                            className="flex-1"
                          />
                          <Button variant="outline" className="ml-2">
                            <ImageIcon className="h-4 w-4" />
                          </Button>
                        </div>
                        {editingCategory.image && (
                          <div className="mt-2 border rounded p-2">
                            <img
                              src={editingCategory.image || "/placeholder.svg"}
                              alt="Preview"
                              className="h-40 object-cover mx-auto"
                              onError={(e) => {
                                ;(e.target as HTMLImageElement).src = "/placeholder.svg"
                              }}
                            />
                          </div>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="count">Product Count</Label>
                        <Input
                          id="count"
                          type="number"
                          value={editingCategory.count}
                          onChange={(e) =>
                            setEditingCategory({ ...editingCategory, count: Number.parseInt(e.target.value) || 0 })
                          }
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="active"
                          checked={editingCategory.active}
                          onChange={(e) => setEditingCategory({ ...editingCategory, active: e.target.checked })}
                        />
                        <Label htmlFor="active">Active</Label>
                      </div>
                    </div>
                    <div className="flex justify-end space-x-3 mt-6">
                      <Button variant="outline" onClick={() => setEditingCategory(null)}>
                        Cancel
                      </Button>
                      <Button
                        onClick={() => {
                          const isNewCategory = !categories.find((c) => c.id === editingCategory.id)
                          let newCategories

                          if (isNewCategory) {
                            newCategories = [...categories, editingCategory]
                          } else {
                            newCategories = categories.map((c) => (c.id === editingCategory.id ? editingCategory : c))
                          }

                          setCategories(newCategories)
                          saveData("categories", newCategories)
                          setEditingCategory(null)
                        }}
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Save
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

       {/* Popular Products Tab */}
      {activeTab === "popular" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>Popular Products</span>
              <Button
                onClick={() => {
                  setEditingPopularProduct({
                    id: createId("pop"),
                    name: "",
                    description: "",
                    price: 0,
                    image: "",
                    sales: 0,
                    active: true,
                  })
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Product
              </Button>
            </CardTitle>
            <CardDescription>Manage popular products displayed on the homepage</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {popularProducts.map((product, index) => (
                <div key={product.id} className={`border rounded-lg p-4 ${!product.active ? "opacity-50" : ""}`}>
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center">
                      <div className="w-16 h-16 bg-gray-200 rounded overflow-hidden mr-4">
                        <img
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold">{product.name}</h3>
                        <p className="text-sm text-gray-500">{product.sales} sales</p>
                        <span
                          className={`px-2 py-1 text-xs rounded ${product.active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                        >
                          {product.active ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleActive(product, popularProducts, setPopularProducts, "popularProducts")}
                      >
                        {product.active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => setEditingPopularProduct(product)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() =>
                          deleteItem(product.id, popularProducts, setPopularProducts, "popularProducts", "product")
                        }
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="text-sm">
                    <div>
                      <span className="font-medium">Price:</span> ₹{product.price.toLocaleString("en-IN")}
                    </div>
                    <p className="text-gray-600 mt-2 line-clamp-2">{product.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Edit Popular Product Modal */}
            {editingPopularProduct && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                  <div className="p-6">
                    <h2 className="text-xl font-semibold mb-4">
                      {editingPopularProduct.id.startsWith("pop") &&
                      !popularProducts.find((p) => p.id === editingPopularProduct.id)
                        ? "Add New Popular Product"
                        : "Edit Popular Product"}
                    </h2>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="name">Product Name</Label>
                        <Input
                          id="name"
                          value={editingPopularProduct.name}
                          onChange={(e) => setEditingPopularProduct({ ...editingPopularProduct, name: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          value={editingPopularProduct.description}
                          onChange={(e) =>
                            setEditingPopularProduct({ ...editingPopularProduct, description: e.target.value })
                          }
                          rows={3}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="price">Price (₹)</Label>
                          <Input
                            id="price"
                            type="number"
                            value={editingPopularProduct.price}
                            onChange={(e) =>
                              setEditingPopularProduct({
                                ...editingPopularProduct,
                                price: Number.parseFloat(e.target.value) || 0,
                              })
                            }
                          />
                        </div>
                        <div>
                          <Label htmlFor="sales">Sales Count</Label>
                          <Input
                            id="sales"
                            type="number"
                            value={editingPopularProduct.sales}
                            onChange={(e) =>
                              setEditingPopularProduct({
                                ...editingPopularProduct,
                                sales: Number.parseInt(e.target.value) || 0,
                              })
                            }
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="image">Image URL</Label>
                        <div className="flex">
                          <Input
                            id="image"
                            value={editingPopularProduct.image}
                            onChange={(e) =>
                              setEditingPopularProduct({ ...editingPopularProduct, image: e.target.value })
                            }
                            className="flex-1"
                          />
                          <Button variant="outline" className="ml-2">
                            <ImageIcon className="h-4 w-4" />
                          </Button>
                        </div>
                        {editingPopularProduct.image && (
                          <div className="mt-2 border rounded p-2">
                            <img
                              src={editingPopularProduct.image || "/placeholder.svg"}
                              alt="Preview"
                              className="h-40 object-cover mx-auto"
                              onError={(e) => {
                                ;(e.target as HTMLImageElement).src = "/placeholder.svg"
                              }}
                            />
                          </div>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="active"
                          checked={editingPopularProduct.active}
                          onChange={(e) =>
                            setEditingPopularProduct({ ...editingPopularProduct, active: e.target.checked })
                          }
                        />
                        <Label htmlFor="active">Active</Label>
                      </div>
                    </div>
                    <div className="flex justify-end space-x-3 mt-6">
                      <Button variant="outline" onClick={() => setEditingPopularProduct(null)}>
                        Cancel
                      </Button>
                      <Button
                        onClick={() => {
                          const isNewProduct = !popularProducts.find((p) => p.id === editingPopularProduct.id)
                          let newProducts

                          if (isNewProduct) {
                            newProducts = [...popularProducts, editingPopularProduct]
                          } else {
                            newProducts = popularProducts.map((p) =>
                              p.id === editingPopularProduct.id ? editingPopularProduct : p,
                            )
                          }

                          setPopularProducts(newProducts)
                          saveData("popularProducts", newProducts)
                          setEditingPopularProduct(null)
                        }}
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Save
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Featured Products Tab */}
      {activeTab === "featured" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>Featured Products</span>
              <Button
                onClick={() => {
                  setEditingFeaturedProduct({
                    id: createId("feat"),
                    name: "",
                    description: "",
                    price: 0,
                    image: "",
                    active: true,
                  })
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Product
              </Button>
            </CardTitle>
            <CardDescription>Manage featured products displayed on the homepage</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {featuredProducts.map((product, index) => (
                <div key={product.id} className={`border rounded-lg p-4 ${!product.active ? "opacity-50" : ""}`}>
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center">
                      <div className="w-16 h-16 bg-gray-200 rounded overflow-hidden mr-4">
                        <img
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold">{product.name}</h3>
                        <p className="text-sm text-blue-600 font-medium">₹{product.price.toLocaleString("en-IN")}</p>
                        <span
                          className={`px-2 py-1 text-xs rounded ${product.active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                        >
                          {product.active ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleActive(product, featuredProducts, setFeaturedProducts, "featuredProducts")}
                      >
                        {product.active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => setEditingFeaturedProduct(product)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() =>
                          deleteItem(product.id, featuredProducts, setFeaturedProducts, "featuredProducts", "product")
                        }
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
                </div>
              ))}
            </div>

            {/* Edit Featured Product Modal */}
            {editingFeaturedProduct && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                  <div className="p-6">
                    <h2 className="text-xl font-semibold mb-4">
                      {editingFeaturedProduct.id.startsWith("feat") &&
                      !featuredProducts.find((p) => p.id === editingFeaturedProduct.id)
                        ? "Add New Featured Product"
                        : "Edit Featured Product"}
                    </h2>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="name">Product Name</Label>
                        <Input
                          id="name"
                          value={editingFeaturedProduct.name}
                          onChange={(e) =>
                            setEditingFeaturedProduct({ ...editingFeaturedProduct, name: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          value={editingFeaturedProduct.description}
                          onChange={(e) =>
                            setEditingFeaturedProduct({ ...editingFeaturedProduct, description: e.target.value })
                          }
                          rows={3}
                        />
                      </div>
                      <div>
                        <Label htmlFor="price">Price (₹)</Label>
                        <Input
                          id="price"
                          type="number"
                          value={editingFeaturedProduct.price}
                          onChange={(e) =>
                            setEditingFeaturedProduct({
                              ...editingFeaturedProduct,
                              price: Number.parseFloat(e.target.value) || 0,
                            })
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="image">Image URL</Label>
                        <div className="flex">
                          <Input
                            id="image"
                            value={editingFeaturedProduct.image}
                            onChange={(e) =>
                              setEditingFeaturedProduct({ ...editingFeaturedProduct, image: e.target.value })
                            }
                            className="flex-1"
                          />
                          <Button variant="outline" className="ml-2">
                            <ImageIcon className="h-4 w-4" />
                          </Button>
                        </div>
                        {editingFeaturedProduct.image && (
                          <div className="mt-2 border rounded p-2">
                            <img
                              src={editingFeaturedProduct.image || "/placeholder.svg"}
                              alt="Preview"
                              className="h-40 object-cover mx-auto"
                              onError={(e) => {
                                ;(e.target as HTMLImageElement).src = "/placeholder.svg"
                              }}
                            />
                          </div>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="active"
                          checked={editingFeaturedProduct.active}
                          onChange={(e) =>
                            setEditingFeaturedProduct({ ...editingFeaturedProduct, active: e.target.checked })
                          }
                        />
                        <Label htmlFor="active">Active</Label>
                      </div>
                    </div>
                    <div className="flex justify-end space-x-3 mt-6">
                      <Button variant="outline" onClick={() => setEditingFeaturedProduct(null)}>
                        Cancel
                      </Button>
                      <Button
                        onClick={() => {
                          const isNewProduct = !featuredProducts.find((p) => p.id === editingFeaturedProduct.id)
                          let newProducts

                          if (isNewProduct) {
                            newProducts = [...featuredProducts, editingFeaturedProduct]
                          } else {
                            newProducts = featuredProducts.map((p) =>
                              p.id === editingFeaturedProduct.id ? editingFeaturedProduct : p,
                            )
                          }

                          setFeaturedProducts(newProducts)
                          saveData("featuredProducts", newProducts)
                          setEditingFeaturedProduct(null)
                        }}
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Save
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Testimonials Tab */}
      {activeTab === "testimonials" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>Testimonials</span>
              <Button
                onClick={() => {
                  setEditingTestimonial({
                    id: createId("test"),
                    name: "",
                    role: "",
                    image: "",
                    quote: "",
                    rating: 5,
                    active: true,
                  })
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Testimonial
              </Button>
            </CardTitle>
            <CardDescription>Manage customer testimonials displayed on the homepage</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {testimonials.map((testimonial, index) => (
                <div
                  key={testimonial.id}
                  className={`border rounded-lg p-4 ${!testimonial.active ? "opacity-50" : ""}`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden mr-4">
                        <img
                          src={testimonial.image || "/placeholder.svg"}
                          alt={testimonial.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold">{testimonial.name}</h3>
                        <p className="text-sm text-gray-500">{testimonial.role}</p>
                        <div className="flex items-center mt-1">
                          {[...Array(5)].map((_, i) => (
                            <span
                              key={i}
                              className={`text-sm ${i < testimonial.rating ? "text-yellow-500" : "text-gray-300"}`}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                        <span
                          className={`px-2 py-1 text-xs rounded ${testimonial.active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                        >
                          {testimonial.active ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleActive(testimonial, testimonials, setTestimonials, "testimonials")}
                      >
                        {testimonial.active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => setEditingTestimonial(testimonial)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() =>
                          deleteItem(testimonial.id, testimonials, setTestimonials, "testimonials", "testimonial")
                        }
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 italic">"{testimonial.quote}"</p>
                </div>
              ))}
            </div>

            {/* Edit Testimonial Modal */}
            {editingTestimonial && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                  <div className="p-6">
                    <h2 className="text-xl font-semibold mb-4">
                      {editingTestimonial.id.startsWith("test") &&
                      !testimonials.find((t) => t.id === editingTestimonial.id)
                        ? "Add New Testimonial"
                        : "Edit Testimonial"}
                    </h2>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="name">Customer Name</Label>
                        <Input
                          id="name"
                          value={editingTestimonial.name}
                          onChange={(e) => setEditingTestimonial({ ...editingTestimonial, name: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="role">Role/Title</Label>
                        <Input
                          id="role"
                          value={editingTestimonial.role}
                          onChange={(e) => setEditingTestimonial({ ...editingTestimonial, role: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="quote">Quote</Label>
                        <Textarea
                          id="quote"
                          value={editingTestimonial.quote}
                          onChange={(e) => setEditingTestimonial({ ...editingTestimonial, quote: e.target.value })}
                          rows={4}
                        />
                      </div>
                      <div>
                        <Label htmlFor="rating">Rating</Label>
                        <select
                          id="rating"
                          value={editingTestimonial.rating}
                          onChange={(e) =>
                            setEditingTestimonial({ ...editingTestimonial, rating: Number.parseInt(e.target.value) })
                          }
                          className="w-full px-3 py-2 border rounded-md"
                        >
                          <option value={1}>1 Star</option>
                          <option value={2}>2 Stars</option>
                          <option value={3}>3 Stars</option>
                          <option value={4}>4 Stars</option>
                          <option value={5}>5 Stars</option>
                        </select>
                      </div>
                      <div>
                        <Label htmlFor="image">Image URL</Label>
                        <div className="flex">
                          <Input
                            id="image"
                            value={editingTestimonial.image}
                            onChange={(e) => setEditingTestimonial({ ...editingTestimonial, image: e.target.value })}
                            className="flex-1"
                          />
                          <Button variant="outline" className="ml-2">
                            <ImageIcon className="h-4 w-4" />
                          </Button>
                        </div>
                        {editingTestimonial.image && (
                          <div className="mt-2 border rounded p-2">
                            <img
                              src={editingTestimonial.image || "/placeholder.svg"}
                              alt="Preview"
                              className="h-40 w-40 object-cover mx-auto rounded-full"
                              onError={(e) => {
                                ;(e.target as HTMLImageElement).src = "/placeholder.svg"
                              }}
                            />
                          </div>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="active"
                          checked={editingTestimonial.active}
                          onChange={(e) => setEditingTestimonial({ ...editingTestimonial, active: e.target.checked })}
                        />
                        <Label htmlFor="active">Active</Label>
                      </div>
                    </div>
                    <div className="flex justify-end space-x-3 mt-6">
                      <Button variant="outline" onClick={() => setEditingTestimonial(null)}>
                        Cancel
                      </Button>
                      <Button
                        onClick={() => {
                          const isNewTestimonial = !testimonials.find((t) => t.id === editingTestimonial.id)
                          let newTestimonials

                          if (isNewTestimonial) {
                            newTestimonials = [...testimonials, editingTestimonial]
                          } else {
                            newTestimonials = testimonials.map((t) =>
                              t.id === editingTestimonial.id ? editingTestimonial : t,
                            )
                          }

                          setTestimonials(newTestimonials)
                          saveData("testimonials", newTestimonials)
                          setEditingTestimonial(null)
                        }}
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Save
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Featured Brands Tab */}
      {activeTab === "brands" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>Featured Brands</span>
              <Button
                onClick={() => {
                  setEditingBrand({
                    id: createId("brand"),
                    name: "",
                    logo: "",
                    url: "/products",
                    active: true,
                  })
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Brand
              </Button>
            </CardTitle>
            <CardDescription>Manage featured brands displayed on the homepage</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {brands.map((brand, index) => (
                <div key={brand.id} className={`border rounded-lg p-4 ${!brand.active ? "opacity-50" : ""}`}>
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center">
                      <div className="w-16 h-16 bg-gray-200 rounded overflow-hidden mr-4 flex items-center justify-center">
                        <span className="text-lg font-bold">{brand.name.charAt(0)}</span>
                      </div>
                      <div>
                        <h3 className="font-semibold">{brand.name}</h3>
                        <p className="text-sm text-gray-500">{brand.url}</p>
                        <span
                          className={`px-2 py-1 text-xs rounded ${brand.active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                        >
                          {brand.active ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleActive(brand, brands, setBrands, "brands")}
                      >
                        {brand.active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => setEditingBrand(brand)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteItem(brand.id, brands, setBrands, "brands", "brand")}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Edit Brand Modal */}
            {editingBrand && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                  <div className="p-6">
                    <h2 className="text-xl font-semibold mb-4">
                      {editingBrand.id.startsWith("brand") && !brands.find((b) => b.id === editingBrand.id)
                        ? "Add New Brand"
                        : "Edit Brand"}
                    </h2>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="name">Brand Name</Label>
                        <Input
                          id="name"
                          value={editingBrand.name}
                          onChange={(e) => setEditingBrand({ ...editingBrand, name: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="logo">Logo</Label>
                        <Input
                          id="logo"
                          value={editingBrand.logo}
                          onChange={(e) => setEditingBrand({ ...editingBrand, logo: e.target.value })}
                          placeholder="Logo identifier or URL"
                        />
                      </div>
                      <div>
                        <Label htmlFor="url">Brand URL</Label>
                        <Input
                          id="url"
                          value={editingBrand.url}
                          onChange={(e) => setEditingBrand({ ...editingBrand, url: e.target.value })}
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="active"
                          checked={editingBrand.active}
                          onChange={(e) => setEditingBrand({ ...editingBrand, active: e.target.checked })}
                        />
                        <Label htmlFor="active">Active</Label>
                      </div>
                    </div>
                    <div className="flex justify-end space-x-3 mt-6">
                      <Button variant="outline" onClick={() => setEditingBrand(null)}>
                        Cancel
                      </Button>
                      <Button
                        onClick={() => {
                          const isNewBrand = !brands.find((b) => b.id === editingBrand.id)
                          let newBrands

                          if (isNewBrand) {
                            newBrands = [...brands, editingBrand]
                          } else {
                            newBrands = brands.map((b) => (b.id === editingBrand.id ? editingBrand : b))
                          }

                          setBrands(newBrands)
                          saveData("brands", newBrands)
                          setEditingBrand(null)
                        }}
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Save
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Note: Other tabs remain unchanged and use localStorage */}
    </div>
  )
}
