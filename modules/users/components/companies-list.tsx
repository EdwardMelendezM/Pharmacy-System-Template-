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

export function CompaniesList() {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Company Name</TableHead>
            <TableHead>Contact Person</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {companies.map((company) => (
            <TableRow key={company.id}>
              <TableCell className="font-medium">{company.name}</TableCell>
              <TableCell>{company.contactPerson}</TableCell>
              <TableCell>{company.email}</TableCell>
              <TableCell>{company.phone}</TableCell>
              <TableCell>
                <div
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                    company.status === "Active" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {company.status}
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
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <Link href={`/users/companies/${company.id}`} passHref>
                      <DropdownMenuItem>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                    </Link>
                    <DropdownMenuItem>Edit</DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">Deactivate</DropdownMenuItem>
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

const companies = [
  {
    id: 1,
    name: "MediCorp Pharmaceuticals",
    contactPerson: "Sarah Johnson",
    email: "sarah@medicorp.com",
    phone: "(555) 123-4567",
    status: "Active",
  },
  {
    id: 2,
    name: "HealthPlus Supplies",
    contactPerson: "David Miller",
    email: "david@healthplus.com",
    phone: "(555) 234-5678",
    status: "Active",
  },
  {
    id: 3,
    name: "Wellness Distributors",
    contactPerson: "Lisa Brown",
    email: "lisa@wellness.com",
    phone: "(555) 345-6789",
    status: "Inactive",
  },
  {
    id: 4,
    name: "PharmaTech Solutions",
    contactPerson: "James Wilson",
    email: "james@pharmatech.com",
    phone: "(555) 456-7890",
    status: "Active",
  },
  {
    id: 5,
    name: "MediSupply Co.",
    contactPerson: "Jennifer Lee",
    email: "jennifer@medisupply.com",
    phone: "(555) 567-8901",
    status: "Active",
  },
]
