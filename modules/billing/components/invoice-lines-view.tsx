"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { DownloadIcon, Search } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Datos simulados para líneas de factura
const lineasFactura = [
  {
    line_id: 1,
    invoice_id: 1001,
    invoice_code: "F001-00001",
    product_code: "MED001",
    description: "Paracetamol 500mg",
    quantity: 100,
    unit_price: 5.0,
    igv_amount: 90.0,
    total_line: 590.0,
  },
  {
    line_id: 2,
    invoice_id: 1001,
    invoice_code: "F001-00001",
    product_code: "MED002",
    description: "Ibuprofeno 400mg",
    quantity: 50,
    unit_price: 8.0,
    igv_amount: 72.0,
    total_line: 472.0,
  },
  {
    line_id: 3,
    invoice_id: 1002,
    invoice_code: "F001-00002",
    product_code: "MED003",
    description: "Amoxicilina 500mg",
    quantity: 200,
    unit_price: 12.0,
    igv_amount: 432.0,
    total_line: 2832.0,
  },
  {
    line_id: 4,
    invoice_id: 1003,
    invoice_code: "F001-00003",
    product_code: "MED004",
    description: "Loratadina 10mg",
    quantity: 75,
    unit_price: 6.5,
    igv_amount: 87.75,
    total_line: 575.25,
  },
  {
    line_id: 5,
    invoice_id: 1004,
    invoice_code: "F001-00004",
    product_code: "MED005",
    description: "Omeprazol 20mg",
    quantity: 120,
    unit_price: 9.75,
    igv_amount: 210.6,
    total_line: 1380.6,
  },
  {
    line_id: 6,
    invoice_id: 1005,
    invoice_code: "F001-00005",
    product_code: "MED001",
    description: "Paracetamol 500mg",
    quantity: 150,
    unit_price: 5.0,
    igv_amount: 135.0,
    total_line: 885.0,
  },
]

// Obtener códigos únicos de facturas para el filtro
const codigosFacturaUnicos = [...new Set(lineasFactura.map((linea) => linea.invoice_code))]

export function InvoiceLinesView() {
  const [terminoBusqueda, setTerminoBusqueda] = useState("")
  const [filtroFactura, setFiltroFactura] = useState("all")

  // Filtrar líneas de factura por término de búsqueda y código de factura
  const lineasFiltradas = lineasFactura.filter((linea) => {
    const coincideBusqueda =
      linea.product_code.toLowerCase().includes(terminoBusqueda.toLowerCase()) ||
      linea.description.toLowerCase().includes(terminoBusqueda.toLowerCase()) ||
      linea.invoice_code.toLowerCase().includes(terminoBusqueda.toLowerCase())

    const coincideFactura = filtroFactura === "all" || linea.invoice_code === filtroFactura

    return coincideBusqueda && coincideFactura
  })

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex gap-4 flex-1">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar por código o descripción del producto..."
              className="pl-8"
              value={terminoBusqueda}
              onChange={(e) => setTerminoBusqueda(e.target.value)}
            />
          </div>
          <Select value={filtroFactura} onValueChange={setFiltroFactura}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrar por factura" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las facturas</SelectItem>
              {codigosFacturaUnicos.map((codigo) => (
                <SelectItem key={codigo} value={codigo}>
                  {codigo}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button variant="outline" size="icon" className="h-9 w-9">
          <DownloadIcon className="h-4 w-4" />
          <span className="sr-only">Descargar datos</span>
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Factura</TableHead>
              <TableHead>Código</TableHead>
              <TableHead>Descripción</TableHead>
              <TableHead>Cantidad</TableHead>
              <TableHead>Precio Unitario</TableHead>
              <TableHead>IGV</TableHead>
              <TableHead>Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {lineasFiltradas.length > 0 ? (
              lineasFiltradas.map((linea) => (
                <TableRow key={linea.line_id}>
                  <TableCell>{linea.invoice_code}</TableCell>
                  <TableCell className="font-medium">{linea.product_code}</TableCell>
                  <TableCell>{linea.description}</TableCell>
                  <TableCell>{linea.quantity}</TableCell>
                  <TableCell>S/ {linea.unit_price.toFixed(2)}</TableCell>
                  <TableCell>S/ {linea.igv_amount.toFixed(2)}</TableCell>
                  <TableCell>S/ {linea.total_line.toFixed(2)}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4 text-muted-foreground">
                  No se encontraron líneas de factura
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
