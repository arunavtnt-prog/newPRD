"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField } from "@/components/ui/form-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { ValidationRules, useFormValidation } from "@/lib/validation";
import { toast } from "sonner";
import { Loader2, Shield, AlertTriangle, Smartphone, Copy, CheckCircle2, Key } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface SecuritySettingsProps {
  userId: string;
}

export function SecuritySettings({ userId }: SecuritySettingsProps) {
  const [isSaving, setIsSaving] = React.useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = React.useState(false);
  const [showSetup, setShowSetup] = React.useState(false);
  const [verificationCode, setVerificationCode] = React.useState("");
  const [backupCodes, setBackupCodes] = React.useState<string[]>([]);
  const [copiedCode, setCopiedCode] = React.useState(false);

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

  const handleEnable2FA = () => {
    setShowSetup(true);
    // Generate backup codes
    const codes = Array.from({ length: 8 }, () =>
      Math.random().toString(36).substring(2, 10).toUpperCase()
    );
    setBackupCodes(codes);
  };

  const handleVerify2FA = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      toast.error("Please enter a 6-digit verification code");
      return;
    }

    setIsSaving(true);
    try {
      // API call to verify and enable 2FA would go here
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setTwoFactorEnabled(true);
      setShowSetup(false);
      setVerificationCode("");
      toast.success("Two-factor authentication enabled successfully!");
    } catch (error) {
      toast.error("Invalid verification code");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDisable2FA = async () => {
    setIsSaving(true);
    try {
      // API call to disable 2FA would go here
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setTwoFactorEnabled(false);
      setBackupCodes([]);
      toast.success("Two-factor authentication disabled");
    } catch (error) {
      toast.error("Failed to disable 2FA");
    } finally {
      setIsSaving(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const copyAllBackupCodes = () => {
    navigator.clipboard.writeText(backupCodes.join('\n'));
    toast.success("All backup codes copied to clipboard");
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

      {/* Two-Factor Authentication */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Smartphone className="h-5 w-5" />
              <CardTitle>Two-Factor Authentication</CardTitle>
            </div>
            {twoFactorEnabled && (
              <Badge variant="default" className="bg-green-600">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                Enabled
              </Badge>
            )}
          </div>
          <CardDescription>
            Add an extra layer of security to your account with 2FA
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!twoFactorEnabled && !showSetup && (
            <div className="space-y-4">
              <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  Two-factor authentication adds an extra layer of security by requiring a code from your phone in addition to your password.
                </AlertDescription>
              </Alert>
              <Button onClick={handleEnable2FA}>
                <Smartphone className="h-4 w-4 mr-2" />
                Enable Two-Factor Authentication
              </Button>
            </div>
          )}

          {showSetup && !twoFactorEnabled && (
            <div className="space-y-6">
              {/* QR Code Section */}
              <div className="space-y-3">
                <h4 className="font-medium">1. Scan QR Code</h4>
                <p className="text-sm text-muted-foreground">
                  Use an authenticator app (Google Authenticator, Authy, 1Password, etc.) to scan this QR code:
                </p>
                <div className="flex justify-center p-6 bg-muted rounded-lg">
                  {/* Mock QR Code */}
                  <div className="w-48 h-48 bg-white p-4 rounded-lg border-2 border-border">
                    <div className="w-full h-full bg-gradient-to-br from-gray-900 via-gray-700 to-gray-900 rounded flex items-center justify-center">
                      <div className="text-white text-xs text-center">
                        <Smartphone className="h-8 w-8 mx-auto mb-2" />
                        <p>Scan with</p>
                        <p>Authenticator App</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-muted p-3 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-2">Or enter this code manually:</p>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 text-sm font-mono bg-background px-3 py-2 rounded border">
                      JBSWY3DPEHPK3PXP
                    </code>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard("JBSWY3DPEHPK3PXP")}
                    >
                      {copiedCode ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Verification Code Section */}
              <div className="space-y-3">
                <h4 className="font-medium">2. Enter Verification Code</h4>
                <p className="text-sm text-muted-foreground">
                  Enter the 6-digit code from your authenticator app:
                </p>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="000000"
                    maxLength={6}
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                    className="max-w-32 text-center text-lg font-mono"
                  />
                  <Button onClick={handleVerify2FA} disabled={isSaving || verificationCode.length !== 6}>
                    {isSaving ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                    )}
                    Verify & Enable
                  </Button>
                </div>
              </div>

              {/* Backup Codes Section */}
              <div className="space-y-3">
                <h4 className="font-medium">3. Save Backup Codes</h4>
                <Alert>
                  <Key className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Important:</strong> Save these backup codes in a secure place. Each code can only be used once if you lose access to your authenticator app.
                  </AlertDescription>
                </Alert>
                <div className="bg-muted p-4 rounded-lg space-y-2">
                  <div className="grid grid-cols-2 gap-2 font-mono text-sm">
                    {backupCodes.map((code, index) => (
                      <div key={index} className="bg-background px-3 py-2 rounded border">
                        {code}
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" size="sm" className="w-full" onClick={copyAllBackupCodes}>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy All Codes
                  </Button>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" onClick={() => {
                  setShowSetup(false);
                  setVerificationCode("");
                  setBackupCodes([]);
                }}>
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {twoFactorEnabled && (
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
                <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium text-green-900 dark:text-green-100">
                    Two-Factor Authentication Active
                  </p>
                  <p className="text-xs text-green-700 dark:text-green-300">
                    Your account is protected with an additional security layer
                  </p>
                </div>
              </div>

              {backupCodes.length > 0 && (
                <div className="space-y-2">
                  <Label>Backup Codes</Label>
                  <p className="text-sm text-muted-foreground">
                    You have {backupCodes.length} unused backup codes
                  </p>
                </div>
              )}

              <Button variant="destructive" onClick={handleDisable2FA} disabled={isSaving}>
                {isSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Disable Two-Factor Authentication
              </Button>
            </div>
          )}
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
