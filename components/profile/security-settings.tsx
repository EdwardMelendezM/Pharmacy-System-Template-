/**
 * Security Settings Component
 *
 * This component allows users to manage their security settings.
 */

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { toast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"

export function SecuritySettings() {
  const [isLoading, setIsLoading] = useState(false)
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const [emailNotificationsEnabled, setEmailNotificationsEnabled] = useState(true)
  const [sessionTimeout, setSessionTimeout] = useState(30)

  // Handle two-factor authentication toggle
  const handleTwoFactorToggle = async (checked: boolean) => {
    setIsLoading(true)

    try {
      // In a real app, this would make an API call to update the setting
      // For demo purposes, we'll just simulate a delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setTwoFactorEnabled(checked)
      toast({
        title: checked ? "Two-factor authentication enabled" : "Two-factor authentication disabled",
        description: checked ? "Your account is now more secure." : "Two-factor authentication has been disabled.",
      })
    } catch (error) {
      console.error("Two-factor toggle error:", error)
      toast({
        title: "Update failed",
        description: "There was a problem updating your security settings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Handle email notifications toggle
  const handleEmailNotificationsToggle = async (checked: boolean) => {
    setIsLoading(true)

    try {
      // In a real app, this would make an API call to update the setting
      // For demo purposes, we'll just simulate a delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setEmailNotificationsEnabled(checked)
      toast({
        title: checked ? "Email notifications enabled" : "Email notifications disabled",
        description: checked
          ? "You will now receive security-related email notifications."
          : "You will no longer receive security-related email notifications.",
      })
    } catch (error) {
      console.error("Email notifications toggle error:", error)
      toast({
        title: "Update failed",
        description: "There was a problem updating your notification settings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Handle session history clear
  const handleClearSessionHistory = async () => {
    setIsLoading(true)

    try {
      // In a real app, this would make an API call to clear session history
      // For demo purposes, we'll just simulate a delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Session history cleared",
        description: "All your previous login sessions have been terminated.",
      })
    } catch (error) {
      console.error("Clear session history error:", error)
      toast({
        title: "Operation failed",
        description: "There was a problem clearing your session history. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium">Two-Factor Authentication</h3>
            <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
          </div>
          <Switch
            checked={twoFactorEnabled}
            onCheckedChange={handleTwoFactorToggle}
            disabled={isLoading}
            aria-label="Toggle two-factor authentication"
          />
        </div>
        {twoFactorEnabled && (
          <div className="mt-2 rounded-md bg-muted p-3 text-sm">
            <p>Two-factor authentication is enabled for your account.</p>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium">Security Email Notifications</h3>
            <p className="text-sm text-muted-foreground">
              Receive emails about security events related to your account
            </p>
          </div>
          <Switch
            checked={emailNotificationsEnabled}
            onCheckedChange={handleEmailNotificationsToggle}
            disabled={isLoading}
            aria-label="Toggle security email notifications"
          />
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="font-medium">Session Management</h3>
        <p className="text-sm text-muted-foreground">Manage your active sessions and login history</p>
        <Button variant="outline" onClick={handleClearSessionHistory} disabled={isLoading} className="mt-2">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            "Clear All Other Sessions"
          )}
        </Button>
      </div>
    </div>
  )
}
