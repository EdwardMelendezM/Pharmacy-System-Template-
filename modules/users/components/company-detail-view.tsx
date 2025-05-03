"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { toast } from "@/components/ui/use-toast"
import { Building, Mail, Phone, MapPin, Calendar, Users, FileText } from "lucide-react"

// Mock company data
const companyData = {
  id: 1,
  name: "MediCorp Pharmaceuticals",
  ruc: "20123456789",
  address: "123 Main St, Suite 100",
  city: "Lima",
  phone: "(01) 123-4567",
  email: "contact@medicorp.com",
  contactPerson: "Sarah Johnson",
  status: "Active",
  registrationDate: "2020-01-15T00:00:00Z",
  totalUsers: 15,
  notes: "Main pharmaceutical distributor for the northern region.",
  users: [
    { id: 101, name: "Sarah Johnson", role: "Administrator" },
    { id: 102, name: "Mark Wilson", role: "Pharmacist" },
    { id: 103, name: "Emily Davis", role: "Inventory Manager" },
    { id: 104, name: "Robert Brown", role: "Finance Manager" },
    { id: 105, name: "Jennifer Lee", role: "Cashier" },
  ],
  documents: [
    { name: "Business Registration", date: "2020-01-15T00:00:00Z", status: "Valid" },
    { name: "Tax Certificate", date: "2023-01-10T00:00:00Z", status: "Valid" },
    { name: "Pharmaceutical License", date: "2023-03-22T00:00:00Z", status: "Valid" },
    { name: "Insurance Policy", date: "2023-02-15T00:00:00Z", status: "Valid" },
  ],
}

export function CompanyDetailView() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("overview")
  const [isDeactivating, setIsDeactivating] = useState(false)

  const handleDeactivate = () => {
    setIsDeactivating(true)

    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Company deactivated",
        description: `${companyData.name} has been deactivated.`,
      })
      setIsDeactivating(false)
      router.push("/users?tab=companies")
    }, 1000)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold tracking-tight">Company Details</h2>
          <p className="text-muted-foreground">View and manage company information.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => router.push(`/users/edit-company/${companyData.id}`)}>Edit Company</Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">Deactivate</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will deactivate the company. All associated users will remain but may need to be reassigned.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeactivate}
                  disabled={isDeactivating}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {isDeactivating ? "Deactivating..." : "Deactivate"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Company Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                <Building className="h-10 w-10 text-primary" />
              </div>
            </div>
            <div className="space-y-1 text-center">
              <h3 className="font-medium text-lg">{companyData.name}</h3>
              <p className="text-sm text-muted-foreground">RUC: {companyData.ruc}</p>
              <Badge variant="outline" className="bg-green-100 text-green-800">
                {companyData.status}
              </Badge>
            </div>
            <div className="space-y-3 pt-4">
              <div className="flex items-center">
                <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  {companyData.address}, {companyData.city}
                </span>
              </div>
              <div className="flex items-center">
                <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{companyData.phone}</span>
              </div>
              <div className="flex items-center">
                <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{companyData.email}</span>
              </div>
              <div className="flex items-center">
                <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Contact: {companyData.contactPerson}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  Registered: {new Date(companyData.registrationDate).toLocaleDateString()}
                </span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" onClick={() => router.push("/users?tab=companies")}>
              Back to Companies
            </Button>
          </CardFooter>
        </Card>

        <div className="md:col-span-3">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-4 pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Company Summary</CardTitle>
                  <CardDescription>Overview of the company details and status.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Company Name</h4>
                      <p>{companyData.name}</p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">RUC</h4>
                      <p>{companyData.ruc}</p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Address</h4>
                      <p>
                        {companyData.address}, {companyData.city}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Contact Information</h4>
                      <p>
                        {companyData.phone}, {companyData.email}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Contact Person</h4>
                      <p>{companyData.contactPerson}</p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Status</h4>
                      <Badge variant="outline" className="bg-green-100 text-green-800">
                        {companyData.status}
                      </Badge>
                    </div>
                  </div>
                  {companyData.notes && (
                    <div className="mt-6 space-y-2">
                      <h4 className="text-sm font-medium">Notes</h4>
                      <p className="text-sm">{companyData.notes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Statistics</CardTitle>
                  <CardDescription>Key metrics for this company.</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="flex flex-col items-center justify-center rounded-md border p-4">
                    <Users className="h-8 w-8 text-primary mb-2" />
                    <h4 className="text-lg font-bold">{companyData.totalUsers}</h4>
                    <p className="text-sm text-muted-foreground">Total Users</p>
                  </div>
                  <div className="flex flex-col items-center justify-center rounded-md border p-4">
                    <FileText className="h-8 w-8 text-primary mb-2" />
                    <h4 className="text-lg font-bold">{companyData.documents.length}</h4>
                    <p className="text-sm text-muted-foreground">Documents</p>
                  </div>
                  <div className="flex flex-col items-center justify-center rounded-md border p-4">
                    <Calendar className="h-8 w-8 text-primary mb-2" />
                    <h4 className="text-lg font-bold">
                      {Math.floor(
                        (new Date().getTime() - new Date(companyData.registrationDate).getTime()) /
                          (1000 * 60 * 60 * 24 * 30),
                      )}
                    </h4>
                    <p className="text-sm text-muted-foreground">Months Active</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="users" className="pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Company Users</CardTitle>
                  <CardDescription>Users associated with this company.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b bg-muted/50">
                          <th className="py-3 px-4 text-left text-sm font-medium">Name</th>
                          <th className="py-3 px-4 text-left text-sm font-medium">Role</th>
                          <th className="py-3 px-4 text-right text-sm font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {companyData.users.map((user) => (
                          <tr key={user.id} className="border-b">
                            <td className="py-3 px-4 text-sm">{user.name}</td>
                            <td className="py-3 px-4 text-sm">{user.role}</td>
                            <td className="py-3 px-4 text-right">
                              <Button variant="ghost" size="sm" onClick={() => router.push(`/users/detail/${user.id}`)}>
                                View
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline">View All Users</Button>
                  <Button onClick={() => router.push("/users/add")}>Add User</Button>
                </CardFooter>
              </Card>
            </TabsContent>
            <TabsContent value="documents" className="pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Company Documents</CardTitle>
                  <CardDescription>Legal and administrative documents for this company.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b bg-muted/50">
                          <th className="py-3 px-4 text-left text-sm font-medium">Document</th>
                          <th className="py-3 px-4 text-left text-sm font-medium">Date</th>
                          <th className="py-3 px-4 text-left text-sm font-medium">Status</th>
                          <th className="py-3 px-4 text-right text-sm font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {companyData.documents.map((doc, index) => (
                          <tr key={index} className="border-b">
                            <td className="py-3 px-4 text-sm">{doc.name}</td>
                            <td className="py-3 px-4 text-sm">{new Date(doc.date).toLocaleDateString()}</td>
                            <td className="py-3 px-4 text-sm">
                              <Badge variant="outline" className="bg-green-100 text-green-800">
                                {doc.status}
                              </Badge>
                            </td>
                            <td className="py-3 px-4 text-right">
                              <Button variant="ghost" size="sm">
                                View
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline">View All Documents</Button>
                  <Button>Upload Document</Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
