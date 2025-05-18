"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { DownloadIcon, Search } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Datos simulados para ingresos mensuales
const monthlyRevenue = [
  {
    id: 1,
    company_id: 1,
    company_name: "MediCorp Pharmaceuticals",
    year: 2023,
    month: 1,
    currency: "PEN",
    revenue: 45250.0,
  },
  {
    id: 2,
    company_id: 1,
    company_name: "MediCorp Pharmaceuticals",
    year: 2023,
    month: 2,
    currency: "PEN",
    revenue: 52450.75,
  },
  {
    id: 3,
    company_id: 1,
    company_name: "MediCorp Pharmaceuticals",
    year: 2023,
    month: 3,
    currency: "PEN",
    revenue: 48750.5,
  },
  {
    id: 4,
    company_id: 2,
    company_name: "HealthPlus Supplies",
    year: 2023,
    month: 1,
    currency: "PEN",
    revenue: 32100.0,
  },
  {
    id: 5,
    company_id: 2,
    company_name: "HealthPlus Supplies",
    year: 2023,
    month: 2,
    currency: "PEN",
    revenue: 28750.25,
  },
  {
    id: 6,
    company_id: 2,
    company_name: "HealthPlus Supplies",
    year: 2023,
    month: 3,
    currency: "PEN",
    revenue: 35500.0,
  },
  {
    id: 7,
    company_id: 3,
    company_name: "Wellness Distributors",
    year: 2023,
    month: 1,
    currency: "PEN",
    revenue: 18250.0,
  },
  {
    id: 8,
    company_id: 3,
    company_name: "Wellness Distributors",
    year: 2023,
    month: 2,
    currency: "PEN",
    revenue: 21450.75,
  },
  {
    id: 9,
    company_id: 3,
    company_name: "Wellness Distributors",
    year: 2023,
    month: 3,
    currency: "PEN",
    revenue: 19750.5,
  },
]

// Obtener empresas únicas para el filtro
const uniqueCompanies = [...new Set(monthlyRevenue.map((item) => item.company_name))]

// Obtener años únicos para el filtro
const uniqueYears = [...new Set(monthlyRevenue.map((item) => item.year))]

// Nombres de los meses
const monthNames = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
]

export function MonthlyRevenueView() {
  const [searchTerm, setSearchTerm] = useState("")
  const [companyFilter, setCompanyFilter] = useState("all")
  const [yearFilter, setYearFilter] = useState("all")

  // Filtrar ingresos según búsqueda, empresa y año
  const filteredRevenue = monthlyRevenue.filter((item) => {
    const matchesSearch = item.company_name.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCompany = companyFilter === "all" || item.company_name === companyFilter
    const matchesYear = yearFilter === "all" || item.year.toString() === yearFilter

    return matchesSearch && matchesCompany && matchesYear
  })

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex flex-wrap gap-4 flex-1">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar por empresa..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={companyFilter} onValueChange={setCompanyFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrar por empresa" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las empresas</SelectItem>
              {uniqueCompanies.map((company) => (
                <SelectItem key={company} value={company}>
                  {company}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={yearFilter} onValueChange={setYearFilter}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Filtrar por año" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los años</SelectItem>
              {uniqueYears.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
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
              <TableHead>Empresa</TableHead>
              <TableHead>Año</TableHead>
              <TableHead>Mes</TableHead>
              <TableHead>Moneda</TableHead>
              <TableHead>Ingresos</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRevenue.length > 0 ? (
              filteredRevenue.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.company_name}</TableCell>
                  <TableCell>{item.year}</TableCell>
                  <TableCell>{monthNames[item.month - 1]}</TableCell>
                  <TableCell>{item.currency}</TableCell>
                  <TableCell>S/ {item.revenue.toFixed(2)}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                  No se encontraron datos de ingresos
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
