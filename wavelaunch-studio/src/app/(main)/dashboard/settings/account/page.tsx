/**
 * Account Settings Page
 *
 * Account security, privacy, and preferences
 */

"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Loader2,
  Shield,
  Mail,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Trash2,
} from "lucide-react";
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
} from "@/components/ui/alert-dialog";

interface NotificationPreferences {
  notifyEmailApprovals: boolean;
  notifyEmailMentions: boolean;
  notifyEmailUpdates: boolean;
}

export default function AccountSettingsPage() {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);

  // Notification preferences
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    notifyEmailApprovals: true,
    notifyEmailMentions: true,
    notifyEmailUpdates: true,
  });

  // Fetch account settings
  useEffect(() => {
    fetchAccountSettings();
  }, []);

  const fetchAccountSettings = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/user/profile");

      if (!response.ok) {
        throw new Error("Failed to fetch account settings");
      }

      const data = await response.json();
      setEmailVerified(data.user.emailVerified);

      // Set notification preferences from user data
      setPreferences({
        notifyEmailApprovals: data.user.notifyEmailApprovals ?? true,
        notifyEmailMentions: data.user.notifyEmailMentions ?? true,
        notifyEmailUpdates: data.user.notifyEmailUpdates ?? true,
      });
    } catch (error) {
      console.error("Error fetching account settings:", error);
      toast.error("Failed to load account settings");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSavePreferences = async () => {
    setIsSaving(true);

    try {
      const response = await fetch("/api/user/preferences", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(preferences),
      });

      if (!response.ok) {
        throw new Error("Failed to update preferences");
      }

      toast.success("Preferences updated successfully");
    } catch (error) {
      console.error("Error updating preferences:", error);
      toast.error("Failed to update preferences");
    } finally {
      setIsSaving(false);
    }
  };

  const handleResendVerification = async () => {
    try {
      const response = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: session?.user?.email }),
      });

      if (!response.ok) {
        throw new Error("Failed to resend verification email");
      }

      toast.success("Verification email sent! Please check your inbox.");
    } catch (error) {
      console.error("Error resending verification:", error);
      toast.error("Failed to resend verification email");
    }
  };

  const handleDeactivateAccount = async () => {
    try {
      const response = await fetch("/api/user/deactivate", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to deactivate account");
      }

      toast.success("Account deactivated. Logging out...");
      // Sign out after 2 seconds
      setTimeout(() => {
        window.location.href = "/auth/v2/login";
      }, 2000);
    } catch (error) {
      console.error("Error deactivating account:", error);
      toast.error("Failed to deactivate account");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="container max-w-4xl py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Account Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your account security and notification preferences
        </p>
      </div>

      {/* Email Verification Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Email Verification
          </CardTitle>
          <CardDescription>
            Verify your email to access all features
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {emailVerified ? (
                <>
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium">Email Verified</p>
                    <p className="text-sm text-muted-foreground">
                      {session?.user?.email}
                    </p>
                  </div>
                  <Badge variant="default" className="ml-2">
                    Verified
                  </Badge>
                </>
              ) : (
                <>
                  <XCircle className="h-5 w-5 text-yellow-600" />
                  <div>
                    <p className="font-medium">Email Not Verified</p>
                    <p className="text-sm text-muted-foreground">
                      {session?.user?.email}
                    </p>
                  </div>
                  <Badge variant="secondary" className="ml-2">
                    Unverified
                  </Badge>
                </>
              )}
            </div>
            {!emailVerified && (
              <Button onClick={handleResendVerification} variant="outline">
                Resend Verification Email
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Notification Preferences */}
      <Card>
        <CardHeader>
          <CardTitle>Email Notifications</CardTitle>
          <CardDescription>
            Choose what email notifications you want to receive
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="approvals" className="text-base">
                Approval Requests
              </Label>
              <p className="text-sm text-muted-foreground">
                Get notified when someone requests your approval
              </p>
            </div>
            <Switch
              id="approvals"
              checked={preferences.notifyEmailApprovals}
              onCheckedChange={(checked) =>
                setPreferences((prev) => ({
                  ...prev,
                  notifyEmailApprovals: checked,
                }))
              }
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="mentions" className="text-base">
                Mentions
              </Label>
              <p className="text-sm text-muted-foreground">
                Get notified when someone mentions you in a comment
              </p>
            </div>
            <Switch
              id="mentions"
              checked={preferences.notifyEmailMentions}
              onCheckedChange={(checked) =>
                setPreferences((prev) => ({
                  ...prev,
                  notifyEmailMentions: checked,
                }))
              }
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="updates" className="text-base">
                Project Updates
              </Label>
              <p className="text-sm text-muted-foreground">
                Get notified about project status changes and updates
              </p>
            </div>
            <Switch
              id="updates"
              checked={preferences.notifyEmailUpdates}
              onCheckedChange={(checked) =>
                setPreferences((prev) => ({
                  ...prev,
                  notifyEmailUpdates: checked,
                }))
              }
            />
          </div>

          <div className="flex justify-end pt-4">
            <Button onClick={handleSavePreferences} disabled={isSaving}>
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Preferences
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Security Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security
          </CardTitle>
          <CardDescription>
            Manage your account security settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Password</p>
                <p className="text-sm text-muted-foreground">
                  Last changed: Never
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => (window.location.href = "/dashboard/settings/profile")}
              >
                Change Password
              </Button>
            </div>
          </div>

          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              Use a strong, unique password and change it regularly to keep your
              account secure.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Danger Zone</CardTitle>
          <CardDescription>
            Irreversible actions that affect your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-destructive/50 p-4">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p className="font-medium text-destructive">
                  Deactivate Account
                </p>
                <p className="text-sm text-muted-foreground">
                  Temporarily deactivate your account. You can reactivate it by
                  contacting an administrator.
                </p>
              </div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Deactivate
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action will deactivate your account. You will need to
                      contact an administrator to reactivate it.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDeactivateAccount}
                      className="bg-destructive hover:bg-destructive/90"
                    >
                      Deactivate Account
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
