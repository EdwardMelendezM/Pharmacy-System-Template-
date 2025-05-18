/**
 * Enhanced Inventory Adjustment Component
 * Supports multi-product transactions and supplier integration
 */
"use client"

import type React from "react"

import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  ArrowLeft,
  Plus,
  Minus,
  Loader2,
  Package,
  FileText,
  Building,
  Truck,
  AlertTriangle,
  Trash2,
  ChevronRight,
  ChevronLeft,
  Check,
  Search,
} from "lucide-react"
import Link from "next/link"
import { ProductService, MovementService } from "@/lib/services/inventory-service"
import type { Product } from "@/lib/models/inventory"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"

// Mock suppliers data - in a real app, this would come from an API
const SUPPLIERS = [
  {
    id: "sup_1",
    name: "Farmacéutica Nacional",
    code: "FN001",
    contactPerson: "Juan Pérez",
    phone: "+1 (555) 123-4567",
    email: "contacto@farmanacional.com",
    status: "active",
  },
  {
    id: "sup_2",
    name: "Distribuidora Médica",
    code: "DM002",
    contactPerson: "María López",
    phone: "+1 (555) 987-6543",
    email: "info@distribuidoramedica.com",
    status: "active",
  },
  {
    id: "sup_3",
    name: "Laboratorios Unidos",
    code: "LU003",
    contactPerson: "Carlos Rodríguez",
    phone: "+1 (555) 456-7890",
    email: "ventas@labunidos.com",
    status: "active",
  },
  {
    id: "sup_4",
    name: "Importadora Farmacéutica",
    code: "IF004",
    contactPerson: "Ana Martínez",
    phone: "+1 (555) 234-5678",
    email: "info@importadorafarma.com",
    status: "active",
  },
  {
    id: "sup_5",
    name: "Pharma Distributors Ltd.",
    code: "PD005",
    contactPerson: "Michael Brown",
    phone: "+1 (555) 876-5432",
    email: "sales@pharmadist.com",
    status: "active",
  },
]

// Destinations for inventory exits
const DESTINATIONS = [
  { id: "dest_1", name: "Venta al público" },
  { id: "dest_2", name: "Consumo interno" },
  { id: "dest_3", name: "Devolución a proveedor" },
  { id: "dest_4", name: "Caducidad/Deterioro" },
  { id: "dest_5", name: "Transferencia a sucursal" },
]

// Adjustment reasons
const ADJUSTMENT_REASONS = [
  { id: "reason_1", name: "Conteo físico" },
  { id: "reason_2", name: "Producto dañado" },
  { id: "reason_3", name: "Producto caducado" },
  { id: "reason_4", name: "Error de registro" },
  { id: "reason_5", name: "Donación" },
]

// Type definitions for our form data
interface EntryProductItem {
  productId: string
  quantity: number
  cost: number
  lotNumber: string
  expiryDate: string
}

interface ExitProductItem {
  productId: string
  quantity: number
  reason: string
}

interface AdjustmentProductItem {
  productId: string
  quantity: number
  adjustmentType: "add" | "subtract"
}

export function InventoryAdjustment() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState("entrada")
  const [currentStep, setCurrentStep] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSupplier, setSelectedSupplier] = useState<any | null>(null)
  const [supplierSearchTerm, setSupplierSearchTerm] = useState("")
  const [isSupplierDialogOpen, setIsSupplierDialogOpen] = useState(false)
  const [isProductSelectorOpen, setIsProductSelectorOpen] = useState(false)

  // Entry form state
  const [entryForm, setEntryForm] = useState({
    documentNumber: "",
    documentDate: format(new Date(), "yyyy-MM-dd"),
    supplierId: "",
    notes: "",
    responsiblePerson: "",
    products: [] as EntryProductItem[],
  })

  // Exit form state
  const [exitForm, setExitForm] = useState({
    documentNumber: "",
    documentDate: format(new Date(), "yyyy-MM-dd"),
    destinationId: "dest_1", // Default: Venta al público
    notes: "",
    responsiblePerson: "",
    products: [] as ExitProductItem[],
  })

  // Adjustment form state
  const [adjustmentForm, setAdjustmentForm] = useState({
    documentNumber: "",
    documentDate: format(new Date(), "yyyy-MM-dd"),
    reasonId: "",
    notes: "",
    responsiblePerson: "",
    products: [] as AdjustmentProductItem[],
  })

  // Temporary state for product being added
  const [tempProduct, setTempProduct] = useState<EntryProductItem | ExitProductItem | AdjustmentProductItem | null>(
    null,
  )

  // Load products on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true)
        const productsData = await ProductService.getProducts({ status: "active" })
        setProducts(productsData)
      } catch (error) {
        console.error("Error loading products:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [])

  // Filter products based on search term
  const filteredProducts = useMemo(() => {
    if (!searchTerm) return products

    const term = searchTerm.toLowerCase()
    return products.filter(
      (product) => product.name.toLowerCase().includes(term) || product.sku.toLowerCase().includes(term),
    )
  }, [products, searchTerm])

  // Filter suppliers based on search term
  const filteredSuppliers = useMemo(() => {
    if (!supplierSearchTerm) return SUPPLIERS

    const term = supplierSearchTerm.toLowerCase()
    return SUPPLIERS.filter(
      (supplier) => supplier.name.toLowerCase().includes(term) || supplier.code.toLowerCase().includes(term),
    )
  }, [supplierSearchTerm])

  // Get product details by ID
  const getProductById = (productId: string) => {
    return products.find((p) => p.id === productId) || null
  }

  // Get supplier details by ID
  const getSupplierById = (supplierId: string) => {
    return SUPPLIERS.find((s) => s.id === supplierId) || null
  }

  // Initialize temporary product based on active tab
  const initTempProduct = () => {
    if (activeTab === "entrada") {
      setTempProduct({
        productId: "",
        quantity: 1,
        cost: 0,
        lotNumber: "",
        expiryDate: "",
      } as EntryProductItem)
    } else if (activeTab === "salida") {
      setTempProduct({
        productId: "",
        quantity: 1,
        reason: "",
      } as ExitProductItem)
    } else {
      setTempProduct({
        productId: "",
        quantity: 1,
        adjustmentType: "add",
      } as AdjustmentProductItem)
    }
    setIsProductSelectorOpen(true)
  }

  // Add product to the appropriate form
  const addProductToForm = () => {
    if (!tempProduct || !tempProduct.productId) return

    if (activeTab === "entrada") {
      setEntryForm((prev) => ({
        ...prev,
        products: [...prev.products, tempProduct as EntryProductItem],
      }))
    } else if (activeTab === "salida") {
      setExitForm((prev) => ({
        ...prev,
        products: [...prev.products, tempProduct as ExitProductItem],
      }))
    } else {
      setAdjustmentForm((prev) => ({
        ...prev,
        products: [...prev.products, tempProduct as AdjustmentProductItem],
      }))
    }

    setTempProduct(null)
    setIsProductSelectorOpen(false)
  }

  // Remove product from the appropriate form
  const removeProduct = (index: number) => {
    if (activeTab === "entrada") {
      setEntryForm((prev) => ({
        ...prev,
        products: prev.products.filter((_, i) => i !== index),
      }))
    } else if (activeTab === "salida") {
      setExitForm((prev) => ({
        ...prev,
        products: prev.products.filter((_, i) => i !== index),
      }))
    } else {
      setAdjustmentForm((prev) => ({
        ...prev,
        products: prev.products.filter((_, i) => i !== index),
      }))
    }
  }

  // Update temporary product
  const updateTempProduct = (field: string, value: any) => {
    if (!tempProduct) return

    setTempProduct({
      ...tempProduct,
      [field]: value,
    })
  }

  // Handle entry form changes
  const handleEntryFormChange = (field: string, value: any) => {
    setEntryForm((prev) => ({
      ...prev,
      [field]: value,
    }))

    // If supplier changed, update the selected supplier
    if (field === "supplierId") {
      setSelectedSupplier(getSupplierById(value))
    }
  }

  // Handle exit form changes
  const handleExitFormChange = (field: string, value: any) => {
    setExitForm((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  // Handle adjustment form changes
  const handleAdjustmentFormChange = (field: string, value: any) => {
    setAdjustmentForm((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  // Select a supplier from the dialog
  const selectSupplier = (supplier: any) => {
    setSelectedSupplier(supplier)
    handleEntryFormChange("supplierId", supplier.id)
    setIsSupplierDialogOpen(false)
  }

  // Navigate to next step
  const nextStep = () => {
    setCurrentStep((prev) => prev + 1)
  }

  // Navigate to previous step
  const prevStep = () => {
    setCurrentStep((prev) => prev - 1)
  }

  // Reset step when changing tabs
  useEffect(() => {
    setCurrentStep(1)
  }, [activeTab])

  // Submit entry form
  const handleEntrySubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (entryForm.products.length === 0) {
      alert("Por favor, agregue al menos un producto")
      return
    }

    try {
      setIsSaving(true)

      // In a real app, we would create a transaction and then add all products
      // For this MVP, we'll create individual movements for each product
      for (const product of entryForm.products) {
        await MovementService.createMovement({
          productId: product.productId,
          type: "purchase",
          quantity: product.quantity,
          date: new Date(entryForm.documentDate),
          notes: `Documento: ${entryForm.documentNumber || "N/A"}
Proveedor: ${getSupplierById(entryForm.supplierId)?.name || "No especificado"}
Lote: ${product.lotNumber || "N/A"}
Caducidad: ${product.expiryDate || "N/A"}
Responsable: ${entryForm.responsiblePerson || "No especificado"}
Notas: ${entryForm.notes || "N/A"}`,
          createdBy: entryForm.responsiblePerson || "admin",
        })
      }

      // Redirect to inventory
      router.push("/inventory")
    } catch (error) {
      console.error("Error saving entry:", error)
    } finally {
      setIsSaving(false)
    }
  }

  // Submit exit form
  const handleExitSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (exitForm.products.length === 0) {
      alert("Por favor, agregue al menos un producto")
      return
    }

    try {
      setIsSaving(true)

      // In a real app, we would create a transaction and then add all products
      // For this MVP, we'll create individual movements for each product
      for (const product of exitForm.products) {
        await MovementService.createMovement({
          productId: product.productId,
          type: "sale",
          quantity: -product.quantity, // Negative for exits
          date: new Date(exitForm.documentDate),
          notes: `Documento: ${exitForm.documentNumber || "N/A"}
Destino: ${DESTINATIONS.find((d) => d.id === exitForm.destinationId)?.name || "No especificado"}
Motivo: ${product.reason || "N/A"}
Responsable: ${exitForm.responsiblePerson || "No especificado"}
Notas: ${exitForm.notes || "N/A"}`,
          createdBy: exitForm.responsiblePerson || "admin",
        })
      }

      // Redirect to inventory
      router.push("/inventory")
    } catch (error) {
      console.error("Error saving exit:", error)
    } finally {
      setIsSaving(false)
    }
  }

  // Submit adjustment form
  const handleAdjustmentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (adjustmentForm.products.length === 0) {
      alert("Por favor, agregue al menos un producto")
      return
    }

    try {
      setIsSaving(true)

      // In a real app, we would create a transaction and then add all products
      // For this MVP, we'll create individual movements for each product
      for (const product of adjustmentForm.products) {
        const quantity = product.adjustmentType === "add" ? product.quantity : -product.quantity

        await MovementService.createMovement({
          productId: product.productId,
          type: "adjustment",
          quantity: quantity,
          date: new Date(adjustmentForm.documentDate),
          notes: `Documento: ${adjustmentForm.documentNumber || "N/A"}
Motivo: ${ADJUSTMENT_REASONS.find((r) => r.id === adjustmentForm.reasonId)?.name || "No especificado"}
Tipo: ${product.adjustmentType === "add" ? "Incremento" : "Decremento"}
Responsable: ${adjustmentForm.responsiblePerson || "No especificado"}
Notas: ${adjustmentForm.notes || "N/A"}`,
          createdBy: adjustmentForm.responsiblePerson || "admin",
        })
      }

      // Redirect to inventory
      router.push("/inventory")
    } catch (error) {
      console.error("Error saving adjustment:", error)
    } finally {
      setIsSaving(false)
    }
  }

  // Check if a product has insufficient stock
  const hasInsufficientStock = (productId: string, quantity: number) => {
    const product = getProductById(productId)
    return product && product.stock < quantity
  }

  // Render the product selector dialog
  const renderProductSelector = () => {
    return (
      <Dialog open={isProductSelectorOpen} onOpenChange={setIsProductSelectorOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Seleccionar Producto</DialogTitle>
            <DialogDescription>Busque y seleccione el producto que desea agregar</DialogDescription>
          </DialogHeader>

          <div className="relative mb-4">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar por nombre o SKU..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <ScrollArea className="h-[300px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>SKU</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Precio</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-4">
                      No se encontraron productos
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">{product.sku}</TableCell>
                      <TableCell>{product.name}</TableCell>
                      <TableCell>
                        <Badge variant={product.stock <= product.minStock ? "destructive" : "secondary"}>
                          {product.stock}
                        </Badge>
                      </TableCell>
                      <TableCell>${product.sellingPrice.toFixed(2)}</TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          onClick={() => {
                            updateTempProduct("productId", product.id)
                            if (activeTab === "entrada") {
                              updateTempProduct("cost", product.costPrice)
                            }
                          }}
                        >
                          Seleccionar
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </ScrollArea>

          {tempProduct && tempProduct.productId && (
            <div className="mt-4 space-y-4">
              <Separator />
              <h3 className="font-medium">Detalles del producto seleccionado</h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quantity">Cantidad *</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    value={tempProduct.quantity}
                    onChange={(e) => updateTempProduct("quantity", Number.parseInt(e.target.value))}
                    required
                  />
                </div>

                {activeTab === "entrada" && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="cost">Costo unitario</Label>
                      <Input
                        id="cost"
                        type="number"
                        min="0"
                        step="0.01"
                        value={(tempProduct as EntryProductItem).cost}
                        onChange={(e) => updateTempProduct("cost", Number.parseFloat(e.target.value))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lotNumber">Número de lote</Label>
                      <Input
                        id="lotNumber"
                        type="text"
                        value={(tempProduct as EntryProductItem).lotNumber}
                        onChange={(e) => updateTempProduct("lotNumber", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="expiryDate">Fecha de caducidad</Label>
                      <Input
                        id="expiryDate"
                        type="date"
                        value={(tempProduct as EntryProductItem).expiryDate}
                        onChange={(e) => updateTempProduct("expiryDate", e.target.value)}
                      />
                    </div>
                  </>
                )}

                {activeTab === "salida" && (
                  <div className="space-y-2">
                    <Label htmlFor="reason">Motivo específico</Label>
                    <Input
                      id="reason"
                      type="text"
                      placeholder="Detalle del motivo de salida"
                      value={(tempProduct as ExitProductItem).reason}
                      onChange={(e) => updateTempProduct("reason", e.target.value)}
                    />
                  </div>
                )}

                {activeTab === "ajuste" && (
                  <div className="space-y-2">
                    <Label htmlFor="adjustmentType">Tipo de ajuste *</Label>
                    <Select
                      value={(tempProduct as AdjustmentProductItem).adjustmentType}
                      onValueChange={(value) => updateTempProduct("adjustmentType", value)}
                    >
                      <SelectTrigger id="adjustmentType">
                        <SelectValue placeholder="Seleccionar tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="add">Incrementar</SelectItem>
                        <SelectItem value="subtract">Decrementar</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>

              {activeTab === "salida" && hasInsufficientStock(tempProduct.productId, tempProduct.quantity) && (
                <div className="text-red-500 flex items-center mt-2">
                  <AlertTriangle className="h-4 w-4 mr-1" />
                  ¡Stock insuficiente! El producto seleccionado no tiene suficiente stock.
                </div>
              )}
            </div>
          )}

          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setIsProductSelectorOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={addProductToForm}
              disabled={
                !tempProduct ||
                !tempProduct.productId ||
                (activeTab === "salida" && hasInsufficientStock(tempProduct.productId, tempProduct.quantity)) ||
                false
              }
            >
              Agregar Producto
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  // Render the supplier selector dialog
  const renderSupplierSelector = () => {
    return (
      <Dialog open={isSupplierDialogOpen} onOpenChange={setIsSupplierDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Seleccionar Proveedor</DialogTitle>
            <DialogDescription>Busque y seleccione el proveedor para esta nota de entrada</DialogDescription>
          </DialogHeader>

          <div className="relative mb-4">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar por nombre o código..."
              className="pl-8"
              value={supplierSearchTerm}
              onChange={(e) => setSupplierSearchTerm(e.target.value)}
            />
          </div>

          <ScrollArea className="h-[300px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Código</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Contacto</TableHead>
                  <TableHead>Teléfono</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSuppliers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-4">
                      No se encontraron proveedores
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredSuppliers.map((supplier) => (
                    <TableRow key={supplier.id}>
                      <TableCell className="font-medium">{supplier.code}</TableCell>
                      <TableCell>{supplier.name}</TableCell>
                      <TableCell>{supplier.contactPerson}</TableCell>
                      <TableCell>{supplier.phone}</TableCell>
                      <TableCell>
                        <Button size="sm" onClick={() => selectSupplier(supplier)}>
                          Seleccionar
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </ScrollArea>

          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setIsSupplierDialogOpen(false)}>
              Cancelar
            </Button>
            <Link href="/inventory/manage-suppliers">
              <Button variant="outline">
                <Plus className="mr-1 h-4 w-4" />
                Nuevo Proveedor
              </Button>
            </Link>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  // Render the product list for the current form
  const renderProductList = () => {
    let products: any[] = []

    if (activeTab === "entrada") {
      products = entryForm.products
    } else if (activeTab === "salida") {
      products = exitForm.products
    } else {
      products = adjustmentForm.products
    }

    if (products.length === 0) {
      return (
        <div className="text-center py-8 border rounded-md bg-muted/20">
          <Package className="h-12 w-12 mx-auto text-muted-foreground" />
          <p className="mt-2 text-muted-foreground">No hay productos agregados</p>
          <Button className="mt-4" onClick={initTempProduct}>
            <Plus className="mr-2 h-4 w-4" />
            Agregar Producto
          </Button>
        </div>
      )
    }

    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Productos</h3>
          <Button onClick={initTempProduct}>
            <Plus className="mr-2 h-4 w-4" />
            Agregar Producto
          </Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Producto</TableHead>
              <TableHead>Cantidad</TableHead>
              {activeTab === "entrada" && (
                <>
                  <TableHead>Costo</TableHead>
                  <TableHead>Lote</TableHead>
                  <TableHead>Caducidad</TableHead>
                </>
              )}
              {activeTab === "salida" && <TableHead>Motivo</TableHead>}
              {activeTab === "ajuste" && <TableHead>Tipo</TableHead>}
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((item, index) => {
              const product = getProductById(item.productId)

              return (
                <TableRow key={index}>
                  <TableCell>
                    {product ? (
                      <div>
                        <div className="font-medium">{product.name}</div>
                        <div className="text-xs text-muted-foreground">{product.sku}</div>
                      </div>
                    ) : (
                      "Producto no encontrado"
                    )}
                  </TableCell>
                  <TableCell>{item.quantity}</TableCell>

                  {activeTab === "entrada" && (
                    <>
                      <TableCell>${(item as EntryProductItem).cost.toFixed(2)}</TableCell>
                      <TableCell>{(item as EntryProductItem).lotNumber || "-"}</TableCell>
                      <TableCell>{(item as EntryProductItem).expiryDate || "-"}</TableCell>
                    </>
                  )}

                  {activeTab === "salida" && <TableCell>{(item as ExitProductItem).reason || "-"}</TableCell>}

                  {activeTab === "ajuste" && (
                    <TableCell>
                      <Badge
                        variant={(item as AdjustmentProductItem).adjustmentType === "add" ? "default" : "destructive"}
                      >
                        {(item as AdjustmentProductItem).adjustmentType === "add" ? "Incremento" : "Decremento"}
                      </Badge>
                    </TableCell>
                  )}

                  <TableCell>
                    <Button variant="ghost" size="icon" onClick={() => removeProduct(index)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    )
  }

  // Render the entry form steps
  const renderEntrySteps = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="h-5 w-5" />
                  Información del Proveedor
                </CardTitle>
                <CardDescription>Seleccione el proveedor y complete la información del documento</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="entry-supplier">Proveedor *</Label>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <Button
                        variant="outline"
                        className="w-full justify-start h-10 px-3 py-2"
                        onClick={() => setIsSupplierDialogOpen(true)}
                      >
                        {selectedSupplier ? (
                          <span>
                            {selectedSupplier.name} ({selectedSupplier.code})
                          </span>
                        ) : (
                          <span className="text-muted-foreground">Seleccionar proveedor</span>
                        )}
                      </Button>
                    </div>
                    <Link href="/inventory/manage-suppliers">
                      <Button variant="outline" size="icon">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="entry-document">Número de documento</Label>
                    <Input
                      id="entry-document"
                      type="text"
                      placeholder="Factura, remisión, etc."
                      value={entryForm.documentNumber}
                      onChange={(e) => handleEntryFormChange("documentNumber", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="entry-date">Fecha del documento *</Label>
                    <Input
                      id="entry-date"
                      type="date"
                      value={entryForm.documentDate}
                      onChange={(e) => handleEntryFormChange("documentDate", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="entry-responsible">Responsable</Label>
                  <Input
                    id="entry-responsible"
                    type="text"
                    placeholder="Nombre del responsable"
                    value={entryForm.responsiblePerson}
                    onChange={(e) => handleEntryFormChange("responsiblePerson", e.target.value)}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button onClick={nextStep} disabled={!entryForm.supplierId}>
                  Siguiente
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Productos
                </CardTitle>
                <CardDescription>Agregue los productos que ingresan al inventario</CardDescription>
              </CardHeader>
              <CardContent>{renderProductList()}</CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={prevStep}>
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Anterior
                </Button>
                <Button onClick={nextStep} disabled={entryForm.products.length === 0}>
                  Siguiente
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Notas y Confirmación
                </CardTitle>
                <CardDescription>Agregue notas adicionales y confirme la entrada</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="entry-notes">Notas adicionales</Label>
                  <Textarea
                    id="entry-notes"
                    placeholder="Información adicional..."
                    value={entryForm.notes}
                    onChange={(e) => handleEntryFormChange("notes", e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="mt-6 space-y-4">
                  <h3 className="font-medium">Resumen de la entrada</h3>

                  <div className="bg-muted p-4 rounded-md space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Proveedor:</span>
                      <span className="font-medium">{getSupplierById(entryForm.supplierId)?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Documento:</span>
                      <span>{entryForm.documentNumber || "N/A"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Fecha:</span>
                      <span>{entryForm.documentDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Productos:</span>
                      <span>{entryForm.products.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total unidades:</span>
                      <span>{entryForm.products.reduce((sum, item) => sum + item.quantity, 0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Valor total:</span>
                      <span className="font-medium">
                        ${entryForm.products.reduce((sum, item) => sum + item.quantity * item.cost, 0).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={prevStep}>
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Anterior
                </Button>
                <Button onClick={handleEntrySubmit} disabled={isSaving} className="bg-green-600 hover:bg-green-700">
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Guardando...
                    </>
                  ) : (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Confirmar Entrada
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>
        )

      default:
        return null
    }
  }

  // Render the exit form steps
  const renderExitSteps = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Información de Salida
                </CardTitle>
                <CardDescription>Complete la información del documento y destino</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="exit-destination">Destino/Motivo *</Label>
                  <Select
                    value={exitForm.destinationId}
                    onValueChange={(value) => handleExitFormChange("destinationId", value)}
                    required
                  >
                    <SelectTrigger id="exit-destination">
                      <SelectValue placeholder="Seleccionar destino" />
                    </SelectTrigger>
                    <SelectContent>
                      {DESTINATIONS.map((destination) => (
                        <SelectItem key={destination.id} value={destination.id}>
                          {destination.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="exit-document">Número de documento</Label>
                    <Input
                      id="exit-document"
                      type="text"
                      placeholder="Factura, remisión, etc."
                      value={exitForm.documentNumber}
                      onChange={(e) => handleExitFormChange("documentNumber", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="exit-date">Fecha del documento *</Label>
                    <Input
                      id="exit-date"
                      type="date"
                      value={exitForm.documentDate}
                      onChange={(e) => handleExitFormChange("documentDate", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="exit-responsible">Responsable</Label>
                  <Input
                    id="exit-responsible"
                    type="text"
                    placeholder="Nombre del responsable"
                    value={exitForm.responsiblePerson}
                    onChange={(e) => handleExitFormChange("responsiblePerson", e.target.value)}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button onClick={nextStep}>
                  Siguiente
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Productos
                </CardTitle>
                <CardDescription>Agregue los productos que salen del inventario</CardDescription>
              </CardHeader>
              <CardContent>{renderProductList()}</CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={prevStep}>
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Anterior
                </Button>
                <Button onClick={nextStep} disabled={exitForm.products.length === 0}>
                  Siguiente
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Notas y Confirmación
                </CardTitle>
                <CardDescription>Agregue notas adicionales y confirme la salida</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="exit-notes">Notas adicionales</Label>
                  <Textarea
                    id="exit-notes"
                    placeholder="Información adicional..."
                    value={exitForm.notes}
                    onChange={(e) => handleExitFormChange("notes", e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="mt-6 space-y-4">
                  <h3 className="font-medium">Resumen de la salida</h3>

                  <div className="bg-muted p-4 rounded-md space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Destino:</span>
                      <span className="font-medium">
                        {DESTINATIONS.find((d) => d.id === exitForm.destinationId)?.name}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Documento:</span>
                      <span>{exitForm.documentNumber || "N/A"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Fecha:</span>
                      <span>{exitForm.documentDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Productos:</span>
                      <span>{exitForm.products.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total unidades:</span>
                      <span>{exitForm.products.reduce((sum, item) => sum + item.quantity, 0)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={prevStep}>
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Anterior
                </Button>
                <Button onClick={handleExitSubmit} disabled={isSaving} className="bg-red-600 hover:bg-red-700">
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Guardando...
                    </>
                  ) : (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Confirmar Salida
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>
        )

      default:
        return null
    }
  }

  // Render the adjustment form steps
  const renderAdjustmentSteps = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Información del Ajuste
                </CardTitle>
                <CardDescription>Complete la información del ajuste de inventario</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="adjustment-reason">Motivo del ajuste *</Label>
                  <Select
                    value={adjustmentForm.reasonId}
                    onValueChange={(value) => handleAdjustmentFormChange("reasonId", value)}
                    required
                  >
                    <SelectTrigger id="adjustment-reason">
                      <SelectValue placeholder="Seleccionar motivo" />
                    </SelectTrigger>
                    <SelectContent>
                      {ADJUSTMENT_REASONS.map((reason) => (
                        <SelectItem key={reason.id} value={reason.id}>
                          {reason.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="adjustment-document">Número de documento</Label>
                    <Input
                      id="adjustment-document"
                      type="text"
                      placeholder="Número de referencia"
                      value={adjustmentForm.documentNumber}
                      onChange={(e) => handleAdjustmentFormChange("documentNumber", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="adjustment-date">Fecha del ajuste *</Label>
                    <Input
                      id="adjustment-date"
                      type="date"
                      value={adjustmentForm.documentDate}
                      onChange={(e) => handleAdjustmentFormChange("documentDate", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="adjustment-responsible">Responsable</Label>
                  <Input
                    id="adjustment-responsible"
                    type="text"
                    placeholder="Nombre del responsable"
                    value={adjustmentForm.responsiblePerson}
                    onChange={(e) => handleAdjustmentFormChange("responsiblePerson", e.target.value)}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button onClick={nextStep} disabled={!adjustmentForm.reasonId}>
                  Siguiente
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Productos
                </CardTitle>
                <CardDescription>Agregue los productos a ajustar</CardDescription>
              </CardHeader>
              <CardContent>{renderProductList()}</CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={prevStep}>
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Anterior
                </Button>
                <Button onClick={nextStep} disabled={adjustmentForm.products.length === 0}>
                  Siguiente
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Notas y Confirmación
                </CardTitle>
                <CardDescription>Agregue notas adicionales y confirme el ajuste</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="adjustment-notes">Notas adicionales</Label>
                  <Textarea
                    id="adjustment-notes"
                    placeholder="Información adicional..."
                    value={adjustmentForm.notes}
                    onChange={(e) => handleAdjustmentFormChange("notes", e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="mt-6 space-y-4">
                  <h3 className="font-medium">Resumen del ajuste</h3>

                  <div className="bg-muted p-4 rounded-md space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Motivo:</span>
                      <span className="font-medium">
                        {ADJUSTMENT_REASONS.find((r) => r.id === adjustmentForm.reasonId)?.name}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Documento:</span>
                      <span>{adjustmentForm.documentNumber || "N/A"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Fecha:</span>
                      <span>{adjustmentForm.documentDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Productos:</span>
                      <span>{adjustmentForm.products.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Incrementos:</span>
                      <span>{adjustmentForm.products.filter((p) => p.adjustmentType === "add").length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Decrementos:</span>
                      <span>{adjustmentForm.products.filter((p) => p.adjustmentType === "subtract").length}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={prevStep}>
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Anterior
                </Button>
                <Button onClick={handleAdjustmentSubmit} disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Guardando...
                    </>
                  ) : (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Confirmar Ajuste
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>
        )

      default:
        return null
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Cargando productos...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Link href="/inventory">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Movimientos de Inventario</h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="entrada" className="flex items-center gap-2">
            <Plus className="h-4 w-4 text-green-600" />
            Nota de Entrada
          </TabsTrigger>
          <TabsTrigger value="salida" className="flex items-center gap-2">
            <Minus className="h-4 w-4 text-red-600" />
            Nota de Salida
          </TabsTrigger>
          <TabsTrigger value="ajuste" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Ajuste de Inventario
          </TabsTrigger>
        </TabsList>

        <TabsContent value="entrada">{renderEntrySteps()}</TabsContent>

        <TabsContent value="salida">{renderExitSteps()}</TabsContent>

        <TabsContent value="ajuste">{renderAdjustmentSteps()}</TabsContent>
      </Tabs>

      {/* Product Selector Dialog */}
      {renderProductSelector()}

      {/* Supplier Selector Dialog */}
      {renderSupplierSelector()}
    </div>
  )
}
