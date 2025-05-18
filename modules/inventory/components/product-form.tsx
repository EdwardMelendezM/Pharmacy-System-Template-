/**
 * Formulario de producto para MVP
 */
"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Save, Loader2 } from "lucide-react"
import Link from "next/link"
import { ProductService, CategoryService } from "@/lib/services/inventory-service"
import type { Product, Category } from "@/lib/models/inventory"

interface ProductFormProps {
  productId?: string // Si se proporciona, es modo edición
}

export function ProductForm({ productId }: ProductFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])

  // Estado del formulario
  const [formData, setFormData] = useState<Partial<Product>>({
    sku: "",
    name: "",
    description: "",
    category: "",
    costPrice: 0,
    sellingPrice: 0,
    stock: 0,
    minStock: 0,
    requiresPrescription: false,
    status: "active",
  })

  // Cargar datos si es modo edición
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)

        // Cargar categorías
        const categoriesData = await CategoryService.getCategories()
        setCategories(categoriesData)

        // Si es modo edición, cargar datos del producto
        if (productId) {
          const productData = await ProductService.getProductById(productId)
          if (productData) {
            setFormData({
              sku: productData.sku,
              name: productData.name,
              description: productData.description,
              category: productData.category,
              costPrice: productData.costPrice,
              sellingPrice: productData.sellingPrice,
              stock: productData.stock,
              minStock: productData.minStock,
              requiresPrescription: productData.requiresPrescription,
              expiryDate: productData.expiryDate,
              status: productData.status,
            })
          }
        }
      } catch (error) {
        console.error("Error al cargar datos:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [productId])

  // Manejar cambios en los campos
  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  // Manejar envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setIsSaving(true)

      if (productId) {
        // Modo edición
        await ProductService.updateProduct(productId, formData)
      } else {
        // Modo creación
        await ProductService.createProduct(formData as any)
      }

      // Redirigir al inventario
      router.push("/inventory")
    } catch (error) {
      console.error("Error al guardar producto:", error)
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return <div className="flex items-center justify-center h-64">Cargando...</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Link href="/inventory">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">{productId ? "Editar Producto" : "Nuevo Producto"}</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Información Básica</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sku">SKU *</Label>
                <Input id="sku" value={formData.sku} onChange={(e) => handleChange("sku", e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Nombre *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                value={formData.description || ""}
                onChange={(e) => handleChange("description", e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Categoría *</Label>
                <Select value={formData.category} onValueChange={(value) => handleChange("category", value)}>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Seleccionar categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.name}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Estado</Label>
                <Select value={formData.status} onValueChange={(value) => handleChange("status", value)}>
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Seleccionar estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Activo</SelectItem>
                    <SelectItem value="inactive">Inactivo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Precios</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="costPrice">Precio de Costo *</Label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5">$</span>
                  <Input
                    id="costPrice"
                    type="number"
                    step="0.01"
                    min="0"
                    className="pl-7"
                    value={formData.costPrice}
                    onChange={(e) => handleChange("costPrice", Number.parseFloat(e.target.value))}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="sellingPrice">Precio de Venta *</Label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5">$</span>
                  <Input
                    id="sellingPrice"
                    type="number"
                    step="0.01"
                    min="0"
                    className="pl-7"
                    value={formData.sellingPrice}
                    onChange={(e) => handleChange("sellingPrice", Number.parseFloat(e.target.value))}
                    required
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Inventario</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="stock">Stock Actual *</Label>
                <Input
                  id="stock"
                  type="number"
                  min="0"
                  value={formData.stock}
                  onChange={(e) => handleChange("stock", Number.parseInt(e.target.value))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="minStock">Stock Mínimo *</Label>
                <Input
                  id="minStock"
                  type="number"
                  min="0"
                  value={formData.minStock}
                  onChange={(e) => handleChange("minStock", Number.parseInt(e.target.value))}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="expiryDate">Fecha de Caducidad</Label>
              <Input
                id="expiryDate"
                type="date"
                value={formData.expiryDate ? new Date(formData.expiryDate).toISOString().split("T")[0] : ""}
                onChange={(e) => handleChange("expiryDate", e.target.value ? new Date(e.target.value) : undefined)}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="requiresPrescription"
                checked={formData.requiresPrescription}
                onCheckedChange={(checked) => handleChange("requiresPrescription", checked)}
              />
              <Label htmlFor="requiresPrescription">Requiere Receta Médica</Label>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 flex justify-end space-x-4">
          <Link href="/inventory">
            <Button type="button" variant="outline">
              Cancelar
            </Button>
          </Link>
          <Button type="submit" disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Guardar Producto
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
