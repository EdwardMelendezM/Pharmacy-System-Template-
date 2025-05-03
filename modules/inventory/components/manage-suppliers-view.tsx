"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, MoreHorizontal, Plus, Check, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"

// Mock data for suppliers
const mockSuppliers = [
  {
    id: "1",
    code: "SUP001",
    name: "PharmaCorp Inc.",
    contactPerson: "John Smith",
    phone: "+1 (555) 123-4567",
    email: "contact@pharmacorp.com",
    status: "active",
    paymentTerms: "Net 30",
    address: "123 Pharma St, Medical District, NY 10001",
  },
  {
    id: "2",
    code: "SUP002",
    name: "MediSupply Co.",
    contactPerson: "Jane Doe",
    phone: "+1 (555) 987-6543",
    email: "info@medisupply.com",
    status: "active",
    paymentTerms: "Net 45",
    address: "456 Health Ave, Care City, CA 90210",
  },
  {
    id: "3",
    code: "SUP003",
    name: "Global Pharmaceuticals",
    contactPerson: "Robert Johnson",
    phone: "+1 (555) 456-7890",
    email: "sales@globalpharm.com",
    status: "inactive",
    paymentTerms: "Net 15",
    address: "789 Medicine Blvd, Wellness Town, TX 75001",
  },
  {
    id: "4",
    code: "SUP004",
    name: "Healthcare Solutions",
    contactPerson: "Sarah Williams",
    phone: "+1 (555) 234-5678",
    email: "info@healthcaresol.com",
    status: "active",
    paymentTerms: "Net 30",
    address: "101 Remedy Road, Cure Village, FL 33101",
  },
  {
    id: "5",
    code: "SUP005",
    name: "Pharma Distributors Ltd.",
    contactPerson: "Michael Brown",
    phone: "+1 (555) 876-5432",
    email: "sales@pharmadist.com",
    status: "active",
    paymentTerms: "Net 60",
    address: "202 Treatment Lane, Health Harbor, WA 98101",
  },
]

export function ManageSuppliersView() {
  const [suppliers, setSuppliers] = useState(mockSuppliers)
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [currentSupplier, setCurrentSupplier] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Filter suppliers based on search term
  const filteredSuppliers = suppliers.filter(
    (supplier) =>
      supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddSupplier = (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      setIsAddDialogOpen(false)
      // In a real app, we would add the new supplier to the list
    }, 1000)
  }

  const handleEditSupplier = (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      setIsEditDialogOpen(false)
      // In a real app, we would update the supplier in the list
    }, 1000)
  }

  const handleToggleStatus = (id) => {
    setSuppliers(
      suppliers.map((supplier) =>
        supplier.id === id
          ? {
              ...supplier,
              status: supplier.status === "active" ? "inactive" : "active",
            }
          : supplier,
      ),
    )
  }

  const openEditDialog = (supplier) => {
    setCurrentSupplier(supplier)
    setIsEditDialogOpen(true)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search suppliers..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add New Supplier
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Supplier</DialogTitle>
              <DialogDescription>Enter the details of the new supplier below.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddSupplier}>
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="basic">Basic Information</TabsTrigger>
                  <TabsTrigger value="contact">Contact Details</TabsTrigger>
                  <TabsTrigger value="payment">Payment & Tax</TabsTrigger>
                </TabsList>
                <TabsContent value="basic" className="space-y-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="supplierCode">Supplier Code *</Label>
                      <Input id="supplierCode" placeholder="e.g., SUP001" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="supplierName">Supplier Name *</Label>
                      <Input id="supplierName" placeholder="e.g., PharmaCorp Inc." required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contactPerson">Contact Person *</Label>
                    <Input id="contactPerson" placeholder="e.g., John Smith" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" placeholder="Enter a brief description of the supplier" rows={3} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select defaultValue="active">
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </TabsContent>
                <TabsContent value="contact" className="space-y-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input id="phone" placeholder="e.g., +1 (555) 123-4567" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input id="email" type="email" placeholder="e.g., contact@supplier.com" required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input id="website" placeholder="e.g., https://www.supplier.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Address *</Label>
                    <Textarea id="address" placeholder="Enter the supplier's address" rows={3} required />
                  </div>
                </TabsContent>
                <TabsContent value="payment" className="space-y-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="paymentTerms">Payment Terms *</Label>
                      <Select defaultValue="net30">
                        <SelectTrigger>
                          <SelectValue placeholder="Select payment terms" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="net15">Net 15</SelectItem>
                          <SelectItem value="net30">Net 30</SelectItem>
                          <SelectItem value="net45">Net 45</SelectItem>
                          <SelectItem value="net60">Net 60</SelectItem>
                          <SelectItem value="cod">Cash on Delivery</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="currency">Currency</Label>
                      <Select defaultValue="usd">
                        <SelectTrigger>
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="usd">USD ($)</SelectItem>
                          <SelectItem value="eur">EUR (€)</SelectItem>
                          <SelectItem value="gbp">GBP (£)</SelectItem>
                          <SelectItem value="cad">CAD ($)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="taxId">Tax ID / VAT Number</Label>
                    <Input id="taxId" placeholder="e.g., 123456789" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bankDetails">Bank Details</Label>
                    <Textarea id="bankDetails" placeholder="Enter bank account details" rows={3} />
                  </div>
                </TabsContent>
              </Tabs>
              <DialogFooter className="mt-6">
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : "Save Supplier"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Suppliers List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Contact Person</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSuppliers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    No suppliers found. Try adjusting your search or add a new supplier.
                  </TableCell>
                </TableRow>
              ) : (
                filteredSuppliers.map((supplier) => (
                  <TableRow key={supplier.id}>
                    <TableCell className="font-medium">{supplier.code}</TableCell>
                    <TableCell>{supplier.name}</TableCell>
                    <TableCell>{supplier.contactPerson}</TableCell>
                    <TableCell>{supplier.phone}</TableCell>
                    <TableCell>{supplier.email}</TableCell>
                    <TableCell>
                      <Badge variant={supplier.status === "active" ? "default" : "secondary"}>
                        {supplier.status === "active" ? (
                          <Check className="mr-1 h-3 w-3" />
                        ) : (
                          <X className="mr-1 h-3 w-3" />
                        )}
                        {supplier.status.charAt(0).toUpperCase() + supplier.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => openEditDialog(supplier)}>Edit</DropdownMenuItem>
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleToggleStatus(supplier.id)}>
                            {supplier.status === "active" ? "Deactivate" : "Activate"}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Supplier Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Supplier</DialogTitle>
            <DialogDescription>Update the supplier information below.</DialogDescription>
          </DialogHeader>
          {currentSupplier && (
            <form onSubmit={handleEditSupplier}>
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="basic">Basic Information</TabsTrigger>
                  <TabsTrigger value="contact">Contact Details</TabsTrigger>
                  <TabsTrigger value="payment">Payment & Tax</TabsTrigger>
                </TabsList>
                <TabsContent value="basic" className="space-y-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-supplierCode">Supplier Code *</Label>
                      <Input id="edit-supplierCode" defaultValue={currentSupplier.code} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-supplierName">Supplier Name *</Label>
                      <Input id="edit-supplierName" defaultValue={currentSupplier.name} required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-contactPerson">Contact Person *</Label>
                    <Input id="edit-contactPerson" defaultValue={currentSupplier.contactPerson} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-status">Status</Label>
                    <Select defaultValue={currentSupplier.status}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </TabsContent>
                <TabsContent value="contact" className="space-y-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-phone">Phone Number *</Label>
                      <Input id="edit-phone" defaultValue={currentSupplier.phone} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-email">Email Address *</Label>
                      <Input id="edit-email" type="email" defaultValue={currentSupplier.email} required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-address">Address *</Label>
                    <Textarea id="edit-address" defaultValue={currentSupplier.address} rows={3} required />
                  </div>
                </TabsContent>
                <TabsContent value="payment" className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-paymentTerms">Payment Terms *</Label>
                    <Select defaultValue={currentSupplier.paymentTerms === "Net 30" ? "net30" : "net15"}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select payment terms" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="net15">Net 15</SelectItem>
                        <SelectItem value="net30">Net 30</SelectItem>
                        <SelectItem value="net45">Net 45</SelectItem>
                        <SelectItem value="net60">Net 60</SelectItem>
                        <SelectItem value="cod">Cash on Delivery</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </TabsContent>
              </Tabs>
              <DialogFooter className="mt-6">
                <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : "Update Supplier"}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
