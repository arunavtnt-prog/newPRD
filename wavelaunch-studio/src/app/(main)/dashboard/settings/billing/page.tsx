/**
 * Billing Settings Page
 *
 * Manage billing and subscription (placeholder for free tier)
 */

"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { CreditCard, CheckCircle2, TrendingUp, Database, HardDrive, Mail, AlertTriangle } from "lucide-react";

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

      {/* Usage Tracking */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Current Usage
          </CardTitle>
          <CardDescription>
            Monitor your resource consumption against free tier limits
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Bandwidth Usage */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-blue-600" />
                <Label>Bandwidth (Vercel)</Label>
              </div>
              <span className="text-sm font-mono">28.4 GB / 100 GB</span>
            </div>
            <Progress value={28.4} className="h-2" />
            <p className="text-xs text-muted-foreground">
              71.6 GB remaining this month • Resets on Dec 1
            </p>
          </div>

          {/* Database Storage */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Database className="h-4 w-4 text-green-600" />
                <Label>Database Storage (Supabase)</Label>
              </div>
              <span className="text-sm font-mono">142 MB / 500 MB</span>
            </div>
            <Progress value={28.4} className="h-2" />
            <p className="text-xs text-muted-foreground">
              358 MB available
            </p>
          </div>

          {/* File Storage */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HardDrive className="h-4 w-4 text-purple-600" />
                <Label>File Storage (Google Drive)</Label>
              </div>
              <span className="text-sm font-mono">3.8 GB / 15 GB</span>
            </div>
            <Progress value={25.3} className="h-2" />
            <p className="text-xs text-muted-foreground">
              11.2 GB available
            </p>
          </div>

          {/* Email Usage */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-amber-600" />
                <Label>Emails Sent (Resend)</Label>
              </div>
              <span className="text-sm font-mono">2,456 / 3,000</span>
            </div>
            <Progress value={81.9} className="h-2" />
            <p className="text-xs text-muted-foreground">
              544 emails remaining this month • Resets on Dec 1
            </p>
          </div>

          {/* Warning for high usage */}
          <Alert className="border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/20">
            <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            <AlertDescription className="text-amber-700 dark:text-amber-300">
              <strong>Email usage at 82%.</strong> Consider optimizing email
              notifications or upgrading if you need more capacity.
            </AlertDescription>
          </Alert>

          <div className="pt-4 border-t">
            <p className="text-xs text-muted-foreground">
              Usage metrics are updated hourly. Exceeding free tier limits may
              require upgrading your infrastructure providers.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
