"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { DownloadIcon, Search, Store } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

// Mock data for store overview
const storeOverview = [
  {
    store_id: 1,
    name: "MediCorp Farmacia Central",
    ruc: "20123456789",
    total_users: 15,
    registration_date: "2020-01-15T00:00:00Z",
  },
  {
    store_id: 2,
    name: "HealthPlus Farmacia",
    ruc: "20234567890",
    total_users: 8,
    registration_date: "2020-03-22T00:00:00Z",
  },
  {
    store_id: 3,
    name: "Wellness Botica",
    ruc: "20345678901",
    total_users: 5,
    registration_date: "2021-05-10T00:00:00Z",
  },
  {
    store_id: 4,
    name: "PharmaTech Tienda",
    ruc: "20456789012",
    total_users: 12,
    registration_date: "2019-11-05T00:00:00Z",
  },
  {
    store_id: 5,
    name: "MediSupply Farmacia",
    ruc: "20567890123",
    total_users: 7,
    registration_date: "2022-02-18T00:00:00Z",
  },
]

export function StoreOverviewView() {
  const [searchTerm, setSearchTerm] = useState("")

  // Filter stores based on search term
  const filteredStores = storeOverview.filter(
    (store) => store.name.toLowerCase().includes(searchTerm.toLowerCase()) || store.ruc.includes(searchTerm),
  )

  // Calculate total stores and users
  const totalStores = storeOverview.length
  const totalUsers = storeOverview.reduce((sum, store) => sum + store.total_users, 0)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-primary/10 rounded-full">
                <Store className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Tiendas</p>
                <h3 className="text-2xl font-bold">{totalStores}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-primary/10 rounded-full">
                <Store className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Usuarios</p>
                <h3 className="text-2xl font-bold">{totalUsers}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar por nombre de tienda o RUC..."
            className="pl-8 max-w-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
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
              <TableHead>Nombre de Tienda</TableHead>
              <TableHead>RUC</TableHead>
              <TableHead>Total Usuarios</TableHead>
              <TableHead>Fecha de Registro</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStores.length > 0 ? (
              filteredStores.map((store) => (
                <TableRow key={store.store_id}>
                  <TableCell className="font-medium">{store.name}</TableCell>
                  <TableCell>{store.ruc}</TableCell>
                  <TableCell>{store.total_users}</TableCell>
                  <TableCell>{new Date(store.registration_date).toLocaleDateString()}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                  No se encontraron tiendas
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
