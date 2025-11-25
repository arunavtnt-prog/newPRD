/**
 * Creator Approvals Page
 *
 * Creator-facing approvals interface for reviewing and approving assets
 */

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, XCircle, Clock, Image as ImageIcon, Calendar } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";

export default async function CreatorApprovalsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  // Get all approvals for creator's projects
  const approvals = await prisma.approval.findMany({
    where: {
      project: {
        projectUsers: {
          some: {
            userId: session.user.id,
          },
        },
      },
    },
    include: {
      project: {
        select: {
          id: true,
          projectName: true,
        },
      },
      reviewers: {
        include: {
          reviewer: {
            select: {
              fullName: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const pendingApprovals = approvals.filter((a) => a.status === "PENDING");
  const completedApprovals = approvals.filter((a) =>
    a.status === "APPROVED" || a.status === "CHANGES_REQUESTED"
  );

  const statusColors: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    APPROVED: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    CHANGES_REQUESTED: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    OVERDUE: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Approvals</h1>
        <p className="text-muted-foreground mt-2">
          Review and approve assets from your brand projects
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center">
                <Clock className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{pendingApprovals.length}</p>
                <p className="text-xs text-muted-foreground">Pending Review</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-green-100 dark:bg-green-900 flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {approvals.filter((a) => a.status === "APPROVED").length}
                </p>
                <p className="text-xs text-muted-foreground">Approved</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-red-100 dark:bg-red-900 flex items-center justify-center">
                <XCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {approvals.filter((a) => a.status === "CHANGES_REQUESTED").length}
                </p>
                <p className="text-xs text-muted-foreground">Changes Requested</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Approvals List */}
      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pending">
            Pending ({pendingApprovals.length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed ({completedApprovals.length})
          </TabsTrigger>
          <TabsTrigger value="all">
            All ({approvals.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {pendingApprovals.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <CheckCircle2 className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">All caught up!</h3>
                <p className="text-sm text-muted-foreground">
                  No pending approvals at the moment
                </p>
              </CardContent>
            </Card>
          ) : (
            pendingApprovals.map((approval) => (
              <Card key={approval.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">
                        {approval.project.projectName}
                      </CardTitle>
                      <CardDescription>
                        {approval.message || "Review pending assets"}
                      </CardDescription>
                    </div>
                    <Badge className={statusColors[approval.status]}>
                      {approval.status.replace(/_/g, " ")}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {approval.dueDate && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      Due: {format(new Date(approval.dueDate), "MMM d, yyyy")}
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <Link href={`/creator/projects/${approval.project.id}?approval=${approval.id}`}>
                      <Button>Review Assets</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {completedApprovals.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Clock className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-sm text-muted-foreground">
                  No completed approvals yet
                </p>
              </CardContent>
            </Card>
          ) : (
            completedApprovals.map((approval) => (
              <Card key={approval.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">
                        {approval.project.projectName}
                      </CardTitle>
                      <CardDescription>
                        {approval.message || "Review completed"}
                      </CardDescription>
                    </div>
                    <Badge className={statusColors[approval.status]}>
                      {approval.status.replace(/_/g, " ")}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground">
                    Reviewed on {format(new Date(approval.updatedAt), "MMM d, yyyy 'at' h:mm a")}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="all" className="space-y-4">
          {approvals.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <ImageIcon className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-sm text-muted-foreground">
                  No approvals yet
                </p>
              </CardContent>
            </Card>
          ) : (
            approvals.map((approval) => (
              <Card key={approval.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">
                        {approval.project.projectName}
                      </CardTitle>
                      <CardDescription>
                        {approval.message || "Review"}
                      </CardDescription>
                    </div>
                    <Badge className={statusColors[approval.status]}>
                      {approval.status.replace(/_/g, " ")}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground">
                    Created on {format(new Date(approval.createdAt), "MMM d, yyyy")}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
