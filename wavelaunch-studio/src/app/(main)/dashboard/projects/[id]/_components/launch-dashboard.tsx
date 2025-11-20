/**
 * Launch Dashboard Component
 *
 * Final overview and launch readiness dashboard
 */

"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Rocket,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  TrendingUp,
  Package,
  Globe,
  Megaphone,
  Palette,
  ShoppingBag,
  Factory,
  Clock,
} from "lucide-react";
import { format, differenceInDays, isPast } from "date-fns";

interface LaunchDashboardProps {
  project: any;
}

export function LaunchDashboard({ project }: LaunchDashboardProps) {
  // Calculate phase completion
  const phases = project.phases || [];
  const totalPhases = phases.length;
  const completedPhases = phases.filter((p: any) => p.status === "COMPLETED").length;
  const phaseProgress = totalPhases > 0 ? Math.round((completedPhases / totalPhases) * 100) : 0;

  // Calculate launch readiness score
  const hasDiscovery = !!project.discovery;
  const hasApprovedColors = project.colorPalettes?.some((p: any) => p.isApproved) || false;
  const hasLogos = (project.files?.filter((f: any) => f.folder === "GENERATED_LOGOS" && !f.isDeleted) || []).length > 0;
  const hasApprovedTypography = project.typography?.isApproved || false;
  const hasProducts = (project.productSKUs || []).length > 0;
  const hasApprovedPrototypes = project.productSKUs?.some((s: any) =>
    s.prototypes?.some((p: any) => p.status === "APPROVED")
  ) || false;
  const hasVendors = (project.vendors || []).length > 0;
  const hasPOs = (project.purchaseOrders || []).length > 0;
  const hasWebsite = !!project.websiteConfig;
  const hasPublishedPages = project.websitePages?.some((p: any) => p.isPublished) || false;
  const hasScheduledContent = project.contentPosts?.some((p: any) => p.status === "SCHEDULED") || false;
  const hasActiveAds = project.adCreatives?.some((a: any) => a.status === "ACTIVE") || false;

  const readinessChecks = [
    { label: "Brand Discovery", complete: hasDiscovery, phase: "M1" },
    { label: "Brand Colors", complete: hasApprovedColors, phase: "M2" },
    { label: "Logo Design", complete: hasLogos, phase: "M2" },
    { label: "Typography", complete: hasApprovedTypography, phase: "M3" },
    { label: "Product SKUs", complete: hasProducts, phase: "M4" },
    { label: "Approved Prototypes", complete: hasApprovedPrototypes, phase: "M5" },
    { label: "Vendors Setup", complete: hasVendors, phase: "M6" },
    { label: "Purchase Orders", complete: hasPOs, phase: "M6" },
    { label: "Website Config", complete: hasWebsite, phase: "M7" },
    { label: "Published Pages", complete: hasPublishedPages, phase: "M7" },
    { label: "Content Scheduled", complete: hasScheduledContent, phase: "M8" },
    { label: "Ads Active", complete: hasActiveAds, phase: "M8" },
  ];

  const completedChecks = readinessChecks.filter((c) => c.complete).length;
  const readinessScore = Math.round((completedChecks / readinessChecks.length) * 100);

  // Launch date calculations
  const expectedLaunchDate = project.expectedLaunchDate ? new Date(project.expectedLaunchDate) : null;
  const actualLaunchDate = project.actualLaunchDate ? new Date(project.actualLaunchDate) : null;
  const isLaunched = !!actualLaunchDate || project.status === "COMPLETED";

  let daysUntilLaunch = 0;
  let isOverdue = false;
  if (expectedLaunchDate && !isLaunched) {
    daysUntilLaunch = differenceInDays(expectedLaunchDate, new Date());
    isOverdue = daysUntilLaunch < 0;
  }

  // Launch tasks
  const launchTasks = project.launchTasks || [];
  const totalTasks = launchTasks.length;
  const completedTasks = launchTasks.filter((t: any) => t.status === "COMPLETED").length;
  const criticalTasks = launchTasks.filter((t: any) =>
    t.priority === "CRITICAL" && t.status !== "COMPLETED"
  );
  const blockedTasks = launchTasks.filter((t: any) => t.status === "BLOCKED");

  // Key metrics
  const totalSKUs = (project.productSKUs || []).length;
  const totalPages = (project.websitePages || []).length;
  const scheduledPosts = project.contentPosts?.filter((p: any) => p.status === "SCHEDULED").length || 0;
  const activeCampaigns = project.campaigns?.filter((c: any) => c.status === "ACTIVE").length || 0;

  // Phase icons
  const phaseIcons: Record<string, any> = {
    DISCOVERY: Palette,
    BRANDING: Palette,
    PRODUCT_DEV: Package,
    MANUFACTURING: Factory,
    WEBSITE: Globe,
    MARKETING: Megaphone,
    LAUNCH: Rocket,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-2">Launch Dashboard</h2>
          <p className="text-muted-foreground">
            Final overview and launch readiness
          </p>
        </div>
        {isLaunched ? (
          <Badge className="h-10 px-4 text-base" variant="default">
            <CheckCircle2 className="h-5 w-5 mr-2" />
            Launched!
          </Badge>
        ) : (
          <Badge className="h-10 px-4 text-base" variant="secondary">
            <Rocket className="h-5 w-5 mr-2" />
            Pre-Launch
          </Badge>
        )}
      </div>

      {/* Launch Date Countdown */}
      {!isLaunched && expectedLaunchDate && (
        <Card className={isOverdue ? "border-destructive bg-destructive/5" : "border-primary bg-primary/5"}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  {isOverdue ? "Launch Date Passed" : "Days Until Launch"}
                </p>
                <p className="text-4xl font-bold">
                  {isOverdue ? `${Math.abs(daysUntilLaunch)} days overdue` : `${daysUntilLaunch} days`}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Expected: {format(expectedLaunchDate, "MMMM d, yyyy")}
                </p>
              </div>
              <Calendar className={`h-16 w-16 ${isOverdue ? "text-destructive" : "text-primary"}`} />
            </div>
          </CardContent>
        </Card>
      )}

      {isLaunched && actualLaunchDate && (
        <Card className="border-green-500 bg-green-500/5">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Launched On</p>
                <p className="text-3xl font-bold">{format(actualLaunchDate, "MMMM d, yyyy")}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {differenceInDays(new Date(), actualLaunchDate)} days live
                </p>
              </div>
              <Rocket className="h-16 w-16 text-green-500" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Readiness Score */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Launch Readiness Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Overall Readiness</span>
                  <span className="text-3xl font-bold">{readinessScore}%</span>
                </div>
                <div className="w-full bg-secondary h-3 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all ${
                      readinessScore >= 80
                        ? "bg-green-500"
                        : readinessScore >= 50
                        ? "bg-yellow-500"
                        : "bg-destructive"
                    }`}
                    style={{ width: `${readinessScore}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {completedChecks} of {readinessChecks.length} checks completed
                </p>
              </div>

              {readinessScore < 100 && (
                <div className="pt-2 border-t">
                  <p className="text-sm font-medium mb-2">Missing Items:</p>
                  <div className="space-y-1">
                    {readinessChecks
                      .filter((c) => !c.complete)
                      .map((check) => (
                        <div key={check.label} className="flex items-center gap-2 text-sm">
                          <AlertTriangle className="h-4 w-4 text-yellow-500" />
                          <span>{check.label}</span>
                          <Badge variant="outline" className="text-xs">
                            {check.phase}
                          </Badge>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5" />
              Phase Completion
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Phases Complete</span>
                  <span className="text-3xl font-bold">{phaseProgress}%</span>
                </div>
                <div className="w-full bg-secondary h-3 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all"
                    style={{ width: `${phaseProgress}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {completedPhases} of {totalPhases} phases
                </p>
              </div>

              <div className="pt-2 border-t space-y-2">
                {phases.map((phase: any) => {
                  const PhaseIcon = phaseIcons[phase.phaseName.toUpperCase().replace(/\s+/g, "_")] || CheckCircle2;
                  const isComplete = phase.status === "COMPLETED";
                  const isActive = phase.status === "IN_PROGRESS";

                  return (
                    <div key={phase.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <PhaseIcon className={`h-4 w-4 ${isComplete ? "text-green-500" : "text-muted-foreground"}`} />
                        <span className="text-sm">{phase.phaseName}</span>
                      </div>
                      {isComplete ? (
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                      ) : isActive ? (
                        <Badge variant="default" className="text-xs">Active</Badge>
                      ) : (
                        <Clock className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Launch Tasks Summary */}
      {totalTasks > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Launch Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <div className="text-center">
                <p className="text-3xl font-bold">{completedTasks}/{totalTasks}</p>
                <p className="text-sm text-muted-foreground">Completed</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-destructive">{criticalTasks.length}</p>
                <p className="text-sm text-muted-foreground">Critical Pending</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-yellow-500">{blockedTasks.length}</p>
                <p className="text-sm text-muted-foreground">Blocked</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold">{Math.round((completedTasks / totalTasks) * 100)}%</p>
                <p className="text-sm text-muted-foreground">Progress</p>
              </div>
            </div>

            {criticalTasks.length > 0 && (
              <div className="mt-4 pt-4 border-t">
                <p className="text-sm font-medium mb-2">Critical Tasks Pending:</p>
                <div className="space-y-1">
                  {criticalTasks.slice(0, 5).map((task: any) => (
                    <div key={task.id} className="flex items-center gap-2 text-sm">
                      <AlertTriangle className="h-4 w-4 text-destructive" />
                      <span>{task.taskName}</span>
                      <Badge variant="outline" className="text-xs">{task.category}</Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-500/10 rounded-lg">
                <Package className="h-6 w-6 text-purple-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Product SKUs</p>
                <p className="text-2xl font-bold">{totalSKUs}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-500/10 rounded-lg">
                <Globe className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Website Pages</p>
                <p className="text-2xl font-bold">{totalPages}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-500/10 rounded-lg">
                <Calendar className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Scheduled Posts</p>
                <p className="text-2xl font-bold">{scheduledPosts}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-500/10 rounded-lg">
                <Megaphone className="h-6 w-6 text-orange-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Campaigns</p>
                <p className="text-2xl font-bold">{activeCampaigns}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Launch Readiness Checklist */}
      <Card>
        <CardHeader>
          <CardTitle>Launch Readiness Checklist</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2">
            {readinessChecks.map((check) => (
              <div
                key={check.label}
                className={`flex items-center justify-between p-3 rounded-lg border ${
                  check.complete ? "bg-green-500/5 border-green-500/20" : "bg-muted/50"
                }`}
              >
                <div className="flex items-center gap-2">
                  {check.complete ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  ) : (
                    <AlertTriangle className="h-5 w-5 text-yellow-500" />
                  )}
                  <span className="font-medium">{check.label}</span>
                </div>
                <Badge variant="outline" className="text-xs">
                  {check.phase}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      {!isLaunched && readinessScore >= 80 && (
        <Card className="border-primary bg-primary/5">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-1">Ready to Launch?</h3>
                <p className="text-sm text-muted-foreground">
                  Your launch readiness score is {readinessScore}%. You're ready to go live!
                </p>
              </div>
              <Button size="lg" className="gap-2">
                <Rocket className="h-5 w-5" />
                Mark as Launched
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {!isLaunched && readinessScore < 80 && (
        <Card className="border-yellow-500 bg-yellow-500/5">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <AlertTriangle className="h-10 w-10 text-yellow-500" />
              <div>
                <h3 className="text-lg font-semibold mb-1">Not Ready Yet</h3>
                <p className="text-sm text-muted-foreground">
                  Complete the missing items above to reach launch readiness (currently at {readinessScore}%)
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
