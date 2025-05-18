import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Eye } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"

export function StoresList() {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre de Tienda</TableHead>
            <TableHead>Persona de Contacto</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Teléfono</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="w-[100px]">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {stores.map((store) => (
            <TableRow key={store.id}>
              <TableCell className="font-medium">{store.name}</TableCell>
              <TableCell>{store.contactPerson}</TableCell>
              <TableCell>{store.email}</TableCell>
              <TableCell>{store.phone}</TableCell>
              <TableCell>
                <div
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                    store.status === "Activa" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {store.status}
                </div>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <Link href={`/users/stores/${store.id}`} passHref>
                      <DropdownMenuItem>
                        <Eye className="mr-2 h-4 w-4" />
                        Ver Detalles
                      </DropdownMenuItem>
                    </Link>
                    <DropdownMenuItem>Editar</DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">Desactivar</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

const stores = [
  {
    id: 1,
    name: "MediCorp Farmacia Central",
    contactPerson: "Sarah Johnson",
    email: "sarah@medicorp.com",
    phone: "(555) 123-4567",
    status: "Activa",
  },
  {
    id: 2,
    name: "HealthPlus Farmacia",
    contactPerson: "David Miller",
    email: "david@healthplus.com",
    phone: "(555) 234-5678",
    status: "Activa",
  },
  {
    id: 3,
    name: "Wellness Botica",
    contactPerson: "Lisa Brown",
    email: "lisa@wellness.com",
    phone: "(555) 345-6789",
    status: "Inactiva",
  },
  {
    id: 4,
    name: "PharmaTech Tienda",
    contactPerson: "James Wilson",
    email: "james@pharmatech.com",
    phone: "(555) 456-7890",
    status: "Activa",
  },
  {
    id: 5,
    name: "MediSupply Farmacia",
    contactPerson: "Jennifer Lee",
    email: "jennifer@medisupply.com",
    phone: "(555) 567-8901",
    status: "Activa",
  },
]
