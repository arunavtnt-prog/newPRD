"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField } from "@/components/ui/form-field";
import { Button } from "@/components/ui/button";
import { ValidationRules, useFormValidation } from "@/lib/validation";
import { toast } from "sonner";
import { Loader2, Shield, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface SecuritySettingsProps {
  userId: string;
}

export function SecuritySettings({ userId }: SecuritySettingsProps) {
  const [isSaving, setIsSaving] = React.useState(false);

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validate,
    reset,
  } = useFormValidation({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const validationRules = {
    currentPassword: [
      ValidationRules.required("Current password"),
      ValidationRules.minLength(8, "Current password"),
    ],
    newPassword: [
      ValidationRules.required("New password"),
      ValidationRules.passwordStrength(),
    ],
    confirmPassword: [
      ValidationRules.required("Password confirmation"),
      ValidationRules.matches(values.newPassword, "Passwords"),
    ],
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields
    if (!validate(validationRules)) {
      toast.error("Please fix the errors in the form");
      return;
    }

    setIsSaving(true);

    try {
      // API call would go here
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success("Password updated successfully");
      reset();
    } catch (error) {
      toast.error("Failed to update password");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Change Password */}
      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
          <CardDescription>
            Update your password to keep your account secure
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <FormField
              label="Current Password"
              name="currentPassword"
              type="password"
              value={values.currentPassword}
              onChange={(value) => handleChange("currentPassword", value)}
              error={touched.currentPassword ? errors.currentPassword : undefined}
              placeholder="Enter current password"
              required
              autoComplete="current-password"
            />

            <FormField
              label="New Password"
              name="newPassword"
              type="password"
              value={values.newPassword}
              onChange={(value) => handleChange("newPassword", value)}
              error={touched.newPassword ? errors.newPassword : undefined}
              placeholder="Enter new password"
              required
              description="Must be at least 8 characters with uppercase, lowercase, and number"
              autoComplete="new-password"
            />

            <FormField
              label="Confirm New Password"
              name="confirmPassword"
              type="password"
              value={values.confirmPassword}
              onChange={(value) => handleChange("confirmPassword", value)}
              error={touched.confirmPassword ? errors.confirmPassword : undefined}
              placeholder="Confirm new password"
              required
              autoComplete="new-password"
            />

            <div className="flex justify-end">
              <Button type="submit" disabled={isSaving}>
                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Update Password
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Security Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Security Recommendations</CardTitle>
          <CardDescription>
            Keep your account safe with these best practices
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
            <Shield className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium text-green-900 dark:text-green-100">
                Strong Password Enabled
              </p>
              <p className="text-xs text-green-700 dark:text-green-300">
                Your password meets security requirements
              </p>
            </div>
          </div>

          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Tip:</strong> Use a unique password for this account. Consider using a password manager.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Danger Zone</CardTitle>
          <CardDescription>
            Irreversible actions that permanently affect your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-destructive/50 rounded-lg">
            <div>
              <h4 className="font-medium">Deactivate Account</h4>
              <p className="text-sm text-muted-foreground">
                Temporarily disable your account
              </p>
            </div>
            <Button variant="outline" className="text-destructive border-destructive hover:bg-destructive/10">
              Deactivate
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 border border-destructive/50 rounded-lg">
            <div>
              <h4 className="font-medium">Delete Account</h4>
              <p className="text-sm text-muted-foreground">
                Permanently delete your account and all data
              </p>
            </div>
            <Button variant="destructive">
              Delete Account
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
