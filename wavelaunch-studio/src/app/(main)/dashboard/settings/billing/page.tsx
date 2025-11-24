/**
 * Billing Settings Page
 *
 * Manage billing and subscription (placeholder for free tier)
 */

"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { CreditCard, CheckCircle2 } from "lucide-react";

export default function BillingSettingsPage() {
  return (
    <div className="container max-w-4xl py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Billing & Subscription</h1>
        <p className="text-muted-foreground mt-2">
          Manage your subscription and payment methods
        </p>
      </div>

      {/* Current Plan */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Current Plan
          </CardTitle>
          <CardDescription>
            Your current subscription status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold">Free Tier</h3>
                  <Badge variant="secondary">Active</Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Using free infrastructure (Vercel, Supabase, Google Drive)
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">$0</p>
                <p className="text-sm text-muted-foreground">per month</p>
              </div>
            </div>

            <Alert>
              <CheckCircle2 className="h-4 w-4" />
              <AlertDescription>
                Your current setup uses completely free infrastructure. No payment
                method required!
              </AlertDescription>
            </Alert>

            <div className="space-y-2 text-sm">
              <h4 className="font-medium">Included in Free Tier:</h4>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>100GB bandwidth per month (Vercel)</li>
                <li>500MB database storage (Supabase)</li>
                <li>15GB file storage (Google Drive)</li>
                <li>3,000 emails per month (Resend)</li>
                <li>All core features included</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Usage Information */}
      <Card>
        <CardHeader>
          <CardTitle>Usage Information</CardTitle>
          <CardDescription>
            Monitor your current usage against free tier limits
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Usage tracking will be available in a future update. Contact your
            administrator if you need detailed usage information.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
