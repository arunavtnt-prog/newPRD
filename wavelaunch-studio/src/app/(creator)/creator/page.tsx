/**
 * Creator Dashboard
 *
 * Welcome page with project overview, timeline, and pending tasks
 */

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Rocket,
  CheckCircle2,
  Clock,
  AlertCircle,
  TrendingUp,
  Calendar,
  FileText,
  MessageSquare,
} from "lucide-react";
import Link from "next/link";
import { format, formatDistanceToNow } from "date-fns";

export default async function CreatorDashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  // Get creator's projects
  const projects = await prisma.project.findMany({
    where: {
      projectUsers: {
        some: {
          userId: session.user.id,
        },
      },
    },
    include: {
      leadStrategist: {
        select: {
          fullName: true,
          avatarUrl: true,
        },
      },
      approvals: {
        where: {
          status: "PENDING",
        },
      },
      _count: {
        select: {
          files: true,
          assets: true,
        },
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  // Get pending approvals across all projects
  const pendingApprovals = await prisma.approval.findMany({
    where: {
      project: {
        projectUsers: {
          some: {
            userId: session.user.id,
          },
        },
      },
      status: "PENDING",
    },
    include: {
      project: {
        select: {
          projectName: true,
        },
      },
    },
    orderBy: {
      dueDate: "asc",
    },
    take: 5,
  });

  // Calculate stats
  const totalProjects = projects.length;
  const activeProjects = projects.filter((p) =>
    ["DISCOVERY", "BRANDING", "PRODUCT_DEV", "MANUFACTURING", "WEBSITE", "MARKETING"].includes(p.status)
  ).length;
  const completedProjects = projects.filter((p) => p.status === "LAUNCHED").length;
  const totalPendingApprovals = pendingApprovals.length;

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome back!</h1>
        <p className="text-muted-foreground mt-2">
          Here's what's happening with your brand project{projects.length > 1 ? "s" : ""}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                <Rocket className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalProjects}</p>
                <p className="text-xs text-muted-foreground">Total Projects</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-green-100 dark:bg-green-900 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{activeProjects}</p>
                <p className="text-xs text-muted-foreground">In Progress</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{completedProjects}</p>
                <p className="text-xs text-muted-foreground">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-amber-100 dark:bg-amber-900 flex items-center justify-center">
                <AlertCircle className="h-6 w-6 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalPendingApprovals}</p>
                <p className="text-xs text-muted-foreground">Pending Approvals</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Projects List */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Your Projects</CardTitle>
            <CardDescription>
              Track progress and milestones for all your brand projects
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {projects.length === 0 ? (
              <div className="text-center py-12">
                <Rocket className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No projects yet</p>
              </div>
            ) : (
              projects.map((project) => {
                const progress = Math.round(Math.random() * 100); // TODO: Calculate real progress
                return (
                  <div key={project.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{project.projectName}</h3>
                          <Badge variant="outline" className="text-xs">
                            {project.status.replace(/_/g, " ")}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Led by {project.leadStrategist.fullName}
                        </p>
                      </div>
                      <Link href={`/creator/projects/${project.id}`}>
                        <Button size="sm" variant="outline">
                          View Project
                        </Button>
                      </Link>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">{progress}%</span>
                      </div>
                      <Progress value={progress} className="h-2" />
                    </div>

                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        Launch: {format(new Date(project.expectedLaunchDate), "MMM d, yyyy")}
                      </div>
                      <div className="flex items-center gap-1">
                        <FileText className="h-3 w-3" />
                        {project._count.files} files
                      </div>
                      {project.approvals.length > 0 && (
                        <div className="flex items-center gap-1 text-amber-600">
                          <AlertCircle className="h-3 w-3" />
                          {project.approvals.length} pending
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>

        {/* Pending Approvals Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Pending Approvals</CardTitle>
              <CardDescription className="text-xs">
                Review and approve assets
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {pendingApprovals.length === 0 ? (
                <div className="text-center py-6">
                  <CheckCircle2 className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">All caught up!</p>
                </div>
              ) : (
                <>
                  {pendingApprovals.map((approval) => (
                    <div key={approval.id} className="border rounded-lg p-3 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {approval.project.projectName}
                          </p>
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {approval.message || "Review pending assets"}
                          </p>
                        </div>
                      </div>
                      {approval.dueDate && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          Due {formatDistanceToNow(new Date(approval.dueDate), { addSuffix: true })}
                        </div>
                      )}
                    </div>
                  ))}
                  <Link href="/creator/approvals">
                    <Button variant="outline" size="sm" className="w-full">
                      View All Approvals
                    </Button>
                  </Link>
                </>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href="/creator/upload">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-2" />
                  Upload Files
                </Button>
              </Link>
              <Link href="/creator/assets">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Rocket className="h-4 w-4 mr-2" />
                  View Brand Assets
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
