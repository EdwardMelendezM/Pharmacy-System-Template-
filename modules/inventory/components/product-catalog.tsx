/**
 * Catálogo de Productos
 *
 * Este componente muestra una lista de productos con opciones
 * de filtrado, búsqueda y gestión.
 */

"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertTriangle, ArrowUpDown, Download, Edit, Eye, Filter, MoreHorizontal, Plus, Search } from "lucide-react"
import { ProductService, CategoryService } from "@/lib/services/inventory-service"
import { type Product, type Category, ProductStatus } from "@/lib/models/inventory"

export function ProductCatalog() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Filtros
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [stockFilter, setStockFilter] = useState("all")

  // Paginación
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [total, setTotal] = useState(0)

  // Ordenamiento
  const [sortField, setSortField] = useState("name")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)

        // Obtener categorías
        const categoriesResponse = await CategoryService.getCategories()
        setCategories(categoriesResponse)

        // Obtener productos con filtros
        const filters: any = {
          page,
          limit,
          search: searchTerm || undefined,
        }

        if (categoryFilter !== "all") {
          filters.categoryId = categoryFilter
        }

        if (statusFilter !== "all") {
          filters.status = statusFilter
        }

        if (stockFilter === "low") {
          filters.minStock = true
        }

        const productsResponse = await ProductService.getProducts(filters)
        setProducts(productsResponse.data)
        setTotal(productsResponse.total)
      } catch (error) {
        console.error("Error fetching products:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [page, limit, searchTerm, categoryFilter, statusFilter, stockFilter])

  // Función para cambiar el ordenamiento
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  // Función para navegar a la página de detalle de producto
  const handleViewProduct = (productId: string) => {
    router.push(`/inventory/products/${productId}`)
  }

  // Función para navegar a la página de edición de producto
  const handleEditProduct = (productId: string) => {
    router.push(`/inventory/products/${productId}/edit`)
  }

  // Función para crear un nuevo producto
  const handleCreateProduct = () => {
    router.push("/inventory/products/new")
  }

  // Renderizar el estado del producto
  const renderStatus = (status: ProductStatus) => {
    switch (status) {
      case ProductStatus.ACTIVE:
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800">
            Activo
          </Badge>
        )
      case ProductStatus.INACTIVE:
        return (
          <Badge variant="outline" className="bg-gray-100 text-gray-800">
            Inactivo
          </Badge>
        )
      case ProductStatus.DISCONTINUED:
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800">
            Descontinuado
          </Badge>
        )
      default:
        return null
    }
  }

  // Renderizar el estado del stock
  const renderStockStatus = (product: Product) => {
    if (!product.trackInventory) {
      return (
        <Badge variant="outline" className="bg-blue-100 text-blue-800">
          No Rastreado
        </Badge>
      )
    }

    // Simulación: comparar con el nivel mínimo
    const stockLevel = product.minStockLevel || 0
    const reorderPoint = product.reorderPoint || 0

    if (stockLevel === 0) {
      return (
        <Badge variant="outline" className="bg-red-100 text-red-800">
          Agotado
        </Badge>
      )
    } else if (stockLevel < reorderPoint) {
      return (
        <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
          Bajo
        </Badge>
      )
    } else {
      return (
        <Badge variant="outline" className="bg-green-100 text-green-800">
          Normal
        </Badge>
      )
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end w-full">
        <Button onClick={handleCreateProduct}>
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Producto
        </Button>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-md font-medium flex items-center">
            <Filter className="mr-2 h-4 w-4" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar por nombre, SKU o código de barras..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las categorías</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="active">Activo</SelectItem>
                <SelectItem value="inactive">Inactivo</SelectItem>
                <SelectItem value="discontinued">Descontinuado</SelectItem>
              </SelectContent>
            </Select>

            <Select value={stockFilter} onValueChange={setStockFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Stock" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todo el stock</SelectItem>
                <SelectItem value="low">Stock bajo</SelectItem>
                <SelectItem value="out">Agotado</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" size="icon" className="h-9 w-9">
              <Download className="h-4 w-4" />
              <span className="sr-only">Exportar</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabla de productos */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">SKU</TableHead>
              <TableHead className="min-w-[200px]">
                <div className="flex items-center cursor-pointer" onClick={() => handleSort("name")}>
                  Nombre
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>Categoría</TableHead>
              <TableHead className="text-right">
                <div className="flex items-center justify-end cursor-pointer" onClick={() => handleSort("salesPrice")}>
                  Precio
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  Cargando productos...
                </TableCell>
              </TableRow>
            ) : products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No se encontraron productos con los filtros seleccionados.
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.sku}</TableCell>
                  <TableCell>
                    <div className="font-medium">{product.name}</div>
                    <div className="text-xs text-muted-foreground truncate max-w-[300px]">{product.description}</div>
                  </TableCell>
                  <TableCell>{product.categoryName}</TableCell>
                  <TableCell className="text-right">${product.salesPrice.toFixed(2)}</TableCell>
                  <TableCell>{renderStockStatus(product)}</TableCell>
                  <TableCell>{renderStatus(product.status)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Abrir menú</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleViewProduct(product.id)}>
                          <Eye className="mr-2 h-4 w-4" />
                          Ver detalles
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEditProduct(product.id)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <AlertTriangle className="mr-2 h-4 w-4" />
                          Ajustar stock
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Paginación */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Mostrando {products.length} de {total} productos
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={() => setPage(page - 1)} disabled={page === 1}>
            Anterior
          </Button>
          <Button variant="outline" size="sm" onClick={() => setPage(page + 1)} disabled={page * limit >= total}>
            Siguiente
          </Button>
        </div>
      </div>
    </div>
  )
}
