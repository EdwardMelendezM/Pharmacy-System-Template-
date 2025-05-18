"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { StoresList } from "@/modules/users/components/stores-list"
import { MapPin } from "lucide-react"

export default function StoresPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Gestión de sucursales</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MapPin className="h-5 w-5 mr-2" />
            Sucursales
          </CardTitle>
          <CardDescription>Ver y gestionar los sucursales</CardDescription>
        </CardHeader>
        <CardContent>
          <StoresList />
        </CardContent>
      </Card>
    </div>
  )
}
