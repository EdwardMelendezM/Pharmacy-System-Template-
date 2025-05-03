"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Save } from "lucide-react"

export function AddProductForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setIsSubmitting(false)
    router.push("/inventory")
  }

  return (
    <form onSubmit={handleSubmit}>
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="basic">Basic Information</TabsTrigger>
          <TabsTrigger value="pricing">Pricing & Taxes</TabsTrigger>
          <TabsTrigger value="inventory">Inventory Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="basic">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Enter the basic details of the product.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="productCode">Product Code *</Label>
                  <Input id="productCode" placeholder="e.g., MED-001" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="barcode">Barcode (UPC/EAN)</Label>
                  <Input id="barcode" placeholder="e.g., 9781234567897" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="productName">Product Name *</Label>
                <Input id="productName" placeholder="e.g., Paracetamol 500mg" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" placeholder="Enter product description..." className="min-h-[100px]" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select>
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="analgesics">Analgesics</SelectItem>
                      <SelectItem value="antibiotics">Antibiotics</SelectItem>
                      <SelectItem value="antiviral">Antiviral</SelectItem>
                      <SelectItem value="otc">Over the Counter</SelectItem>
                      <SelectItem value="prescription">Prescription Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="brand">Brand/Manufacturer</Label>
                  <Select>
                    <SelectTrigger id="brand">
                      <SelectValue placeholder="Select brand" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pharma1">Pharma One</SelectItem>
                      <SelectItem value="medico">Medico Labs</SelectItem>
                      <SelectItem value="healthcorp">Health Corporation</SelectItem>
                      <SelectItem value="lifescience">Life Science Ltd</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="active" defaultChecked />
                <Label htmlFor="active">Active (available for sale)</Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pricing">
          <Card>
            <CardHeader>
              <CardTitle>Pricing & Taxes</CardTitle>
              <CardDescription>Set the pricing details and tax information.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="costPrice">Cost Price *</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5">$</span>
                    <Input
                      id="costPrice"
                      type="number"
                      step="0.01"
                      min="0"
                      className="pl-7"
                      placeholder="0.00"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sellingPrice">Selling Price *</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5">$</span>
                    <Input
                      id="sellingPrice"
                      type="number"
                      step="0.01"
                      min="0"
                      className="pl-7"
                      placeholder="0.00"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="taxRate">Tax Rate (%)</Label>
                  <Input id="taxRate" type="number" step="0.01" min="0" placeholder="e.g., 10" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="taxCode">Tax Code</Label>
                  <Select>
                    <SelectTrigger id="taxCode">
                      <SelectValue placeholder="Select tax code" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="std">Standard Rate</SelectItem>
                      <SelectItem value="red">Reduced Rate</SelectItem>
                      <SelectItem value="zero">Zero Rated</SelectItem>
                      <SelectItem value="exempt">Tax Exempt</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="discountAllowed">Discount Allowed</Label>
                <Select>
                  <SelectTrigger id="discountAllowed">
                    <SelectValue placeholder="Select discount policy" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Yes - Allow Discounts</SelectItem>
                    <SelectItem value="no">No - Fixed Price</SelectItem>
                    <SelectItem value="limited">Limited - Up to 10%</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="prescription" />
                <Label htmlFor="prescription">Prescription Required</Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inventory">
          <Card>
            <CardHeader>
              <CardTitle>Inventory Settings</CardTitle>
              <CardDescription>Configure inventory tracking and stock levels.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sku">SKU (Stock Keeping Unit)</Label>
                  <Input id="sku" placeholder="e.g., PCM-500-TAB" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Storage Location</Label>
                  <Input id="location" placeholder="e.g., Shelf A-12" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="initialStock">Initial Stock *</Label>
                  <Input id="initialStock" type="number" min="0" placeholder="0" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="minStock">Minimum Stock Level</Label>
                  <Input id="minStock" type="number" min="0" placeholder="10" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reorderPoint">Reorder Point</Label>
                  <Input id="reorderPoint" type="number" min="0" placeholder="20" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="unitOfMeasure">Unit of Measure</Label>
                  <Select>
                    <SelectTrigger id="unitOfMeasure">
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tablet">Tablet</SelectItem>
                      <SelectItem value="capsule">Capsule</SelectItem>
                      <SelectItem value="bottle">Bottle</SelectItem>
                      <SelectItem value="box">Box</SelectItem>
                      <SelectItem value="vial">Vial</SelectItem>
                      <SelectItem value="ampule">Ampule</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="packSize">Pack Size</Label>
                  <Input id="packSize" placeholder="e.g., 10 tablets per strip" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiryDate">Expiry Date</Label>
                  <Input id="expiryDate" type="date" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="batchNumber">Batch Number</Label>
                  <Input id="batchNumber" placeholder="e.g., LOT12345" />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="trackInventory" defaultChecked />
                <Label htmlFor="trackInventory">Track Inventory</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="allowNegativeStock" />
                <Label htmlFor="allowNegativeStock">Allow Negative Stock</Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-6 flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={() => router.push("/inventory")}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Product
            </>
          )}
        </Button>
      </div>
    </form>
  )
}
