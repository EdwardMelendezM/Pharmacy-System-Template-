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
import { User, Mail, Building, Calendar, Shield, Activity, Key } from "lucide-react"

// Mock user data
const userData = {
  id: 1,
  firstName: "John",
  lastName: "Doe",
  username: "john.doe",
  email: "john.doe@example.com",
  role: "Administrator",
  company: "MediCorp Pharmaceuticals",
  status: "Active",
  lastLogin: "2023-05-01T14:30:00Z",
  createdAt: "2022-01-15T10:00:00Z",
  permissions: [
    "Users: View, Create, Edit, Delete",
    "Companies: View, Create, Edit",
    "Inventory: View, Create, Edit",
    "Billing: View, Create",
    "Accounting: View",
    "Settings: View, Edit",
  ],
  recentActivity: [
    { action: "Logged in", timestamp: "2023-05-01T14:30:00Z" },
    { action: "Updated product inventory", timestamp: "2023-04-30T11:45:00Z" },
    { action: "Created new user", timestamp: "2023-04-28T09:15:00Z" },
    { action: "Generated monthly report", timestamp: "2023-04-25T16:20:00Z" },
  ],
}

export function UserDetailView() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("overview")
  const [isDeactivating, setIsDeactivating] = useState(false)

  const handleDeactivate = () => {
    setIsDeactivating(true)

    // Simulate API call
    setTimeout(() => {
      toast({
        title: "User deactivated",
        description: `${userData.firstName} ${userData.lastName} has been deactivated.`,
      })
      setIsDeactivating(false)
      router.push("/users")
    }, 1000)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold tracking-tight">User Details</h2>
          <p className="text-muted-foreground">View and manage user information.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => router.push(`/users/edit/${userData.id}`)}>Edit User</Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">Deactivate</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will deactivate the user account. The user will no longer be able to log in to the system.
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
            <CardTitle>User Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                <User className="h-10 w-10 text-primary" />
              </div>
            </div>
            <div className="space-y-1 text-center">
              <h3 className="font-medium text-lg">
                {userData.firstName} {userData.lastName}
              </h3>
              <p className="text-sm text-muted-foreground">{userData.username}</p>
              <Badge variant="outline" className="bg-green-100 text-green-800">
                {userData.status}
              </Badge>
            </div>
            <div className="space-y-3 pt-4">
              <div className="flex items-center">
                <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{userData.email}</span>
              </div>
              <div className="flex items-center">
                <Building className="mr-2 h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{userData.company}</span>
              </div>
              <div className="flex items-center">
                <Shield className="mr-2 h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{userData.role}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Created: {new Date(userData.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center">
                <Activity className="mr-2 h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Last login: {new Date(userData.lastLogin).toLocaleDateString()}</span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" onClick={() => router.push("/users")}>
              Back to Users
            </Button>
          </CardFooter>
        </Card>

        <div className="md:col-span-3">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="permissions">Permissions</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-4 pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Account Summary</CardTitle>
                  <CardDescription>Overview of the user account and status.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Full Name</h4>
                      <p>
                        {userData.firstName} {userData.lastName}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Username</h4>
                      <p>{userData.username}</p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Email</h4>
                      <p>{userData.email}</p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Role</h4>
                      <p>{userData.role}</p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Company</h4>
                      <p>{userData.company}</p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Status</h4>
                      <Badge variant="outline" className="bg-green-100 text-green-800">
                        {userData.status}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Security</CardTitle>
                  <CardDescription>Manage user security settings.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <h4 className="text-sm font-medium">Password</h4>
                      <p className="text-sm text-muted-foreground">Last changed 30 days ago</p>
                    </div>
                    <Button variant="outline" size="sm">
                      <Key className="mr-2 h-4 w-4" />
                      Reset Password
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <h4 className="text-sm font-medium">Two-Factor Authentication</h4>
                      <p className="text-sm text-muted-foreground">Not enabled</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Enable
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="permissions" className="pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>User Permissions</CardTitle>
                  <CardDescription>Permissions assigned to this user based on their role.</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {userData.permissions.map((permission, index) => (
                      <li key={index} className="flex items-center">
                        <Shield className="mr-2 h-4 w-4 text-primary" />
                        <span>{permission}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    Manage Permissions
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            <TabsContent value="activity" className="pt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Recent actions performed by this user.</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    {userData.recentActivity.map((activity, index) => (
                      <li key={index} className="flex items-start">
                        <Activity className="mr-2 h-4 w-4 mt-0.5 text-primary" />
                        <div>
                          <p className="font-medium">{activity.action}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(activity.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    View All Activity
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
