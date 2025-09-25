"use client"

import type React from "react"

import { useState } from "react"
import { Save } from "lucide-react"

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    storeName: "E-Commerce Store",
    storeEmail: "contact@ecommerce.com",
    storePhone: "+91 9876543210",
    storeAddress: "123 Main Street, New Delhi, India",
    currency: "INR",
    taxRate: 18,
    shippingFee: 99,
    freeShippingThreshold: 999,
  })
  const [successMessage, setSuccessMessage] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Save settings to localStorage
    localStorage.setItem("storeSettings", JSON.stringify(settings))

    // Show success message
    setSuccessMessage("Settings saved successfully!")
    setTimeout(() => {
      setSuccessMessage("")
    }, 3000)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-6">Store Settings</h1>

      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {successMessage}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="storeName" className="block text-sm font-medium text-gray-700 mb-1">
                Store Name
              </label>
              <input
                type="text"
                id="storeName"
                value={settings.storeName}
                onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>

            <div>
              <label htmlFor="storeEmail" className="block text-sm font-medium text-gray-700 mb-1">
                Store Email
              </label>
              <input
                type="email"
                id="storeEmail"
                value={settings.storeEmail}
                onChange={(e) => setSettings({ ...settings, storeEmail: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>

            <div>
              <label htmlFor="storePhone" className="block text-sm font-medium text-gray-700 mb-1">
                Store Phone
              </label>
              <input
                type="text"
                id="storePhone"
                value={settings.storePhone}
                onChange={(e) => setSettings({ ...settings, storePhone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>

            <div>
              <label htmlFor="storeAddress" className="block text-sm font-medium text-gray-700 mb-1">
                Store Address
              </label>
              <input
                type="text"
                id="storeAddress"
                value={settings.storeAddress}
                onChange={(e) => setSettings({ ...settings, storeAddress: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>

            <div>
              <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-1">
                Currency
              </label>
              <select
                id="currency"
                value={settings.currency}
                onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="INR">Indian Rupee (₹)</option>
                <option value="USD">US Dollar ($)</option>
                <option value="EUR">Euro (€)</option>
                <option value="GBP">British Pound (£)</option>
              </select>
            </div>

            <div>
              <label htmlFor="taxRate" className="block text-sm font-medium text-gray-700 mb-1">
                Tax Rate (%)
              </label>
              <input
                type="number"
                id="taxRate"
                value={settings.taxRate}
                onChange={(e) => setSettings({ ...settings, taxRate: Number.parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                min="0"
                max="100"
                step="0.01"
                required
              />
            </div>

            <div>
              <label htmlFor="shippingFee" className="block text-sm font-medium text-gray-700 mb-1">
                Shipping Fee (₹)
              </label>
              <input
                type="number"
                id="shippingFee"
                value={settings.shippingFee}
                onChange={(e) => setSettings({ ...settings, shippingFee: Number.parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                min="0"
                step="0.01"
                required
              />
            </div>

            <div>
              <label htmlFor="freeShippingThreshold" className="block text-sm font-medium text-gray-700 mb-1">
                Free Shipping Threshold (₹)
              </label>
              <input
                type="number"
                id="freeShippingThreshold"
                value={settings.freeShippingThreshold}
                onChange={(e) =>
                  setSettings({ ...settings, freeShippingThreshold: Number.parseFloat(e.target.value) || 0 })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                min="0"
                step="0.01"
                required
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
