/**
 * User Detail View Component
 *
 * This component displays detailed information about a user,
 * including their profile, role, permissions, and activity.
 */

"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { UserService } from "@/lib/services/user-services"
import type { User, Company } from "@/lib/models/user"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "@/components/ui/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  UserIcon,
  Shield,
  Building,
  Clock,
  Edit,
  Trash2,
  ArrowLeft,
  CheckCircle,
  XCircle,
  Lock,
  Activity,
} from "lucide-react"

interface UserDetailViewProps {
  userId: string
}

export function UserDetailView({ userId }: UserDetailViewProps) {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [company, setCompany] = useState<Company | null>(null)
  const [userActivity, setUserActivity] = useState<{ action: string; timestamp: Date }[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  // Load user data on component mount
  useEffect(() => {
    loadUserData()
  }, [userId])

  // Load user data from service
  const loadUserData = async () => {
    setIsLoading(true)
    try {
      const userData = await UserService.getUserById(userId)

      if (!userData) {
        toast({
          title: "Error",
          description: "User not found",
          variant: "destructive",
        })
        router.push("/users")
        return
      }

      setUser(userData)

      // Load company data
      if (userData.companyId) {
        const companyData = await UserService.getCompanyById(userData.companyId)
        setCompany(companyData)
      }

      // Load user activity
      const activityData = await UserService.getUserActivity(userId)
      setUserActivity(activityData)
    } catch (error) {
      console.error("Error loading user data:", error)
      toast({
        title: "Error",
        description: "Failed to load user data",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Handle user deletion
  const handleDeleteUser = async () => {
    try {
      await UserService.deleteUser(userId)
      toast({
        title: "Success",
        description: "User deleted successfully",
      })
      router.push("/users")
    } catch (error) {
      console.error("Error deleting user:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete user",
        variant: "destructive",
      })
    } finally {
      setDeleteDialogOpen(false)
    }
  }

  // Render status badge
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            Active
          </Badge>
        )
      case "inactive":
        return (
          <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
            <XCircle className="h-3 w-3 mr-1" />
            Inactive
          </Badge>
        )
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        )
      case "locked":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            <Lock className="h-3 w-3 mr-1" />
            Locked
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  // Format date for display
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Render loading skeleton
  const renderSkeleton = () => (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Skeleton className="h-16 w-16 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Skeleton className="h-[200px] w-full" />
        <Skeleton className="h-[200px] w-full" />
      </div>
      <Skeleton className="h-[300px] w-full" />
    </div>
  )

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">User Details</h2>
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </div>
        {renderSkeleton()}
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-[400px]">
        <UserIcon className="h-16 w-16 text-muted-foreground mb-4" />
        <h3 className="text-xl font-medium mb-2">User Not Found</h3>
        <p className="text-muted-foreground mb-4">The requested user could not be found.</p>
        <Button onClick={() => router.push("/users")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Users
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">User Details</h2>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Button variant="outline" onClick={() => router.push(`/users/${userId}/edit`)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button variant="destructive" onClick={() => setDeleteDialogOpen(true)}>
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      {/* User Profile Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center space-x-4">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-xl font-medium">
                  {user.firstName.charAt(0)}
                  {user.lastName.charAt(0)}
                </span>
              </div>
              <div>
                <h3 className="text-2xl font-bold">
                  {user.firstName} {user.lastName}
                </h3>
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <span>@{user.username}</span>
                  <span>•</span>
                  {renderStatusBadge(user.status)}
                </div>
              </div>
            </div>
            <div className="mt-4 md:mt-0 flex flex-col items-start md:items-end">
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{user.role?.name || "No Role Assigned"}</span>
              </div>
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>Created on {formatDate(user.createdAt)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Information Tabs */}
      <Tabs defaultValue="profile">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile">
            <UserIcon className="h-4 w-4 mr-2" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="permissions">
            <Shield className="h-4 w-4 mr-2" />
            Permissions
          </TabsTrigger>
          <TabsTrigger value="activity">
            <Activity className="h-4 w-4 mr-2" />
            Activity
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <UserIcon className="h-5 w-5 mr-2" />
                  User Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">First Name</p>
                    <p>{user.firstName}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Last Name</p>
                    <p>{user.lastName}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Email</p>
                  <p>{user.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Username</p>
                  <p>{user.username}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Status</p>
                  <div>{renderStatusBadge(user.status)}</div>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Last Login</p>
                  <p>{user.lastLogin ? formatDate(user.lastLogin) : "Never"}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building className="h-5 w-5 mr-2" />
                  Company Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                {company ? (
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Company Name</p>
                      <p>{company.name}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">RUC</p>
                      <p>{company.ruc}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Address</p>
                      <p>{company.address || "—"}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">City</p>
                        <p>{company.city || "—"}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Status</p>
                        <Badge
                          variant={company.status === "active" ? "outline" : "secondary"}
                          className={
                            company.status === "active"
                              ? "bg-green-50 text-green-700 border-green-200"
                              : "bg-gray-50 text-gray-700 border-gray-200"
                          }
                        >
                          {company.status === "active" ? (
                            <CheckCircle className="h-3 w-3 mr-1" />
                          ) : (
                            <XCircle className="h-3 w-3 mr-1" />
                          )}
                          {company.status === "active" ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Contact Person</p>
                      <p>{company.contactPerson || "—"}</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-[200px] text-center">
                    <Building className="h-12 w-12 text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">No company information available</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Permissions Tab */}
        <TabsContent value="permissions">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Role & Permissions
              </CardTitle>
              <CardDescription>Permissions are determined by the user's assigned role</CardDescription>
            </CardHeader>
            <CardContent>
              {user.role ? (
                <div className="space-y-6">
                  <div className="flex items-center space-x-2">
                    <Shield className="h-6 w-6 text-primary" />
                    <div>
                      <h4 className="text-lg font-medium">{user.role.name}</h4>
                      <p className="text-sm text-muted-foreground">{user.role.description}</p>
                    </div>
                    {user.role.isSystem && (
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        <Lock className="h-3 w-3 mr-1" />
                        System Role
                      </Badge>
                    )}
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium">Module Permissions</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {user.role.permissions.map((permission) => (
                        <div
                          key={permission.module}
                          className="flex items-center justify-between p-3 rounded-md border"
                        >
                          <div>
                            <p className="font-medium">{permission.module}</p>
                          </div>
                          <Badge
                            variant={
                              permission.level === "admin"
                                ? "secondary"
                                : permission.level === "staff"
                                  ? "default"
                                  : "destructive"
                            }
                          >
                            {permission.level === "admin" ? (
                              <Shield className="h-3 w-3 mr-1" />
                            ) : permission.level === "staff" ? (
                              <CheckCircle className="h-3 w-3 mr-1" />
                            ) : (
                              <XCircle className="h-3 w-3 mr-1" />
                            )}
                            {permission.level === "admin"
                              ? "Admin"
                              : permission.level === "staff"
                                ? "Staff"
                                : "No Access"}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-[200px] text-center">
                  <Shield className="h-12 w-12 text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">No role assigned to this user</p>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button variant="outline" onClick={() => router.push(`/users/${userId}/edit`)} className="w-full">
                <Edit className="mr-2 h-4 w-4" />
                Change Role
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Activity Tab */}
        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="h-5 w-5 mr-2" />
                User Activity
              </CardTitle>
              <CardDescription>Recent actions performed by this user</CardDescription>
            </CardHeader>
            <CardContent>
              {userActivity.length > 0 ? (
                <div className="space-y-4">
                  {userActivity.map((activity, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 rounded-md border">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mt-1">
                        <Activity className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{activity.action}</p>
                        <p className="text-sm text-muted-foreground">{formatDate(activity.timestamp)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-[200px] text-center">
                  <Activity className="h-12 w-12 text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">No activity recorded for this user</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the user account and remove their data from our
              servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteUser} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
