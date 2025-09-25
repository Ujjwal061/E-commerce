"use client"

import { useState, useEffect } from "react"
import { Search, ArrowUpDown, Eye, Mail, Phone } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/contexts/AuthContext"

interface Customer {
  id: string
  name: string
  email: string
  phone?: string
  address?: string
  orders?: number
  totalSpent?: number
  createdAt: string
}

export default function AdminCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortField, setSortField] = useState<keyof Customer>("name")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const { user } = useAuth()

  useEffect(() => {
    const fetchCustomers = async () => {
      setIsLoading(true)
      setError(null)

      try {
        // Fetch customers from API
        const response = await fetch("/api/users?role=user")
        if (!response.ok) {
          throw new Error("Failed to fetch customers")
        }
        const data = await response.json()

        // Fetch orders to get customer stats
        const ordersResponse = await fetch("/api/orders")
        if (!ordersResponse.ok) {
          throw new Error("Failed to fetch orders")
        }
        const ordersData = await ordersResponse.json()

        // Calculate orders and total spent for each customer
        const customersWithStats = data.map((customer: Customer) => {
          const customerOrders = ordersData.filter((order: any) => order.userId === customer.id)
          const totalSpent = customerOrders.reduce((total: number, order: any) => total + order.total, 0)

          return {
            ...customer,
            orders: customerOrders.length,
            totalSpent,
          }
        })

        setCustomers(customersWithStats)
      } catch (err) {
        console.error("Error fetching customers:", err)
        setError(err instanceof Error ? err.message : "An unknown error occurred")

        // Fallback to mock data if API fails
        setCustomers([
          {
            id: "1",
            name: "John Doe",
            email: "john@example.com",
            phone: "+91 9876543210",
            address: "123 Main St, Mumbai",
            orders: 5,
            totalSpent: 15000,
            createdAt: "2023-01-15T10:30:00Z",
          },
          {
            id: "2",
            name: "Jane Smith",
            email: "jane@example.com",
            phone: "+91 9876543211",
            address: "456 Park Ave, Delhi",
            orders: 3,
            totalSpent: 8500,
            createdAt: "2023-02-20T14:45:00Z",
          },
          {
            id: "3",
            name: "Raj Patel",
            email: "raj@example.com",
            phone: "+91 9876543212",
            address: "789 Circle Dr, Bangalore",
            orders: 8,
            totalSpent: 24000,
            createdAt: "2022-11-05T09:15:00Z",
          },
        ])
      } finally {
        setIsLoading(false)
      }
    }

    fetchCustomers()
  }, [])

  const handleSort = (field: keyof Customer) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (customer.phone && customer.phone.includes(searchTerm)),
  )

  const sortedCustomers = [...filteredCustomers].sort((a, b) => {
    const field = sortField
    if (field === "createdAt") {
      const dateA = new Date(a[sortField] as string).getTime()
      const dateB = new Date(b[sortField] as string).getTime()
      return sortDirection === "asc" ? dateA - dateB : dateB - dateA
    }

    if (field === "orders" || field === "totalSpent") {
      const numA = (a[sortField] as number) || 0
      const numB = (b[sortField] as number) || 0
      return sortDirection === "asc" ? numA - numB : numB - numA
    }

    const valueA = a[sortField]
    const valueB = b[sortField]

    if (valueA < valueB) {
      return sortDirection === "asc" ? -1 : 1
    }
    if (valueA > valueB) {
      return sortDirection === "asc" ? 1 : -1
    }
    return 0
  })

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date)
  }

  if (!user || user.role !== "admin") {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>You do not have permission to access this page.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Customers</h1>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="relative w-64">
            <input
              type="text"
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md pl-10"
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          </div>
          <div>
            <span className="text-sm text-gray-500">
              {filteredCustomers.length} {filteredCustomers.length === 1 ? "customer" : "customers"} found
            </span>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p>{error}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("name")}
                  >
                    <div className="flex items-center">
                      Customer
                      <ArrowUpDown className="h-4 w-4 ml-1" />
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("email")}
                  >
                    <div className="flex items-center">
                      Contact
                      <ArrowUpDown className="h-4 w-4 ml-1" />
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("orders")}
                  >
                    <div className="flex items-center">
                      Orders
                      <ArrowUpDown className="h-4 w-4 ml-1" />
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("totalSpent")}
                  >
                    <div className="flex items-center">
                      Total Spent
                      <ArrowUpDown className="h-4 w-4 ml-1" />
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort("createdAt")}
                  >
                    <div className="flex items-center">
                      Joined
                      <ArrowUpDown className="h-4 w-4 ml-1" />
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedCustomers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                      No customers found
                    </td>
                  </tr>
                ) : (
                  sortedCustomers.map((customer) => (
                    <tr key={customer.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-semibold text-lg">
                              {customer.name.charAt(0)}
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                            <div className="text-sm text-gray-500">{customer.address || "No address"}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col space-y-1">
                          <div className="flex items-center text-sm text-gray-900">
                            <Mail className="h-4 w-4 mr-1 text-gray-500" />
                            {customer.email}
                          </div>
                          {customer.phone && (
                            <div className="flex items-center text-sm text-gray-500">
                              <Phone className="h-4 w-4 mr-1 text-gray-500" />
                              {customer.phone}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{customer.orders || 0}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">₹{(customer.totalSpent || 0).toFixed(2)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{formatDate(customer.createdAt)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link href={`/admin/customers/${customer.id}`}>
                          <button className="text-indigo-600 hover:text-indigo-900">
                            <Eye className="h-4 w-4" />
                          </button>
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
