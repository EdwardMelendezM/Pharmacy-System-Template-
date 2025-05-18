import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

// Mock data for tenants
const tenants = [
  {
    id: "1",
    name: "MediCorp Pharmaceuticals",
    slug: "medicorp",
    plan: "professional",
    status: "active",
    users: 12,
    createdAt: "2023-01-15",
  },
  {
    id: "2",
    name: "HealthPlus Supplies",
    slug: "healthplus",
    plan: "basic",
    status: "active",
    users: 5,
    createdAt: "2023-02-20",
  },
  {
    id: "3",
    name: "Wellness Distributors",
    slug: "wellness",
    plan: "enterprise",
    status: "active",
    users: 28,
    createdAt: "2023-03-10",
  },
  {
    id: "4",
    name: "PharmaTech Solutions",
    slug: "pharmatech",
    plan: "free",
    status: "trial",
    users: 2,
    createdAt: "2023-04-05",
  },
  {
    id: "5",
    name: "MediSupply Co.",
    slug: "medisupply",
    plan: "professional",
    status: "suspended",
    users: 8,
    createdAt: "2023-05-12",
  },
]

export default function TenantsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Tenants</h1>
        <Button>Add Tenant</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Tenants</CardTitle>
          <CardDescription>Manage all tenant organizations in the system</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Users</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tenants.map((tenant) => (
                <TableRow key={tenant.id}>
                  <TableCell className="font-medium">{tenant.name}</TableCell>
                  <TableCell>{tenant.slug}</TableCell>
                  <TableCell className="capitalize">{tenant.plan}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        tenant.status === "active" ? "default" : tenant.status === "trial" ? "outline" : "destructive"
                      }
                    >
                      {tenant.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{tenant.users}</TableCell>
                  <TableCell>{tenant.createdAt}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
