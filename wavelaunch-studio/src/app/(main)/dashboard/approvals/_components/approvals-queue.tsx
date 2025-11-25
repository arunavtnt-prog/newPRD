/**
 * Approvals Queue Component
 *
 * Displays and manages approval requests
 */

"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { format } from "date-fns";

interface Approval {
  id: string;
  message: string | null;
  dueDate: Date | null;
  status: string;
  createdAt: Date;
  project: {
    id: string;
    projectName: string;
    creatorName: string;
    category: string;
    status: string;
  };
  reviewers: Array<{
    id: string;
    status: string;
    feedbackText: string | null;
    reviewedAt: Date | null;
    reviewer: {
      id: string;
      fullName: string;
      avatarUrl: string | null;
    };
  }>;
}

interface ApprovalsQueueProps {
  userApprovals: Approval[];
  allApprovals: Approval[];
  userId: string;
  isAdmin: boolean;
}

export function ApprovalsQueue({
  userApprovals,
  allApprovals,
  userId,
  isAdmin,
}: ApprovalsQueueProps) {
  const router = useRouter();
  const [processingId, setProcessingId] = useState<string | null>(null);

  const statusColors: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-800 border-yellow-300",
    APPROVED: "bg-green-100 text-green-800 border-green-300",
    CHANGES_REQUESTED: "bg-red-100 text-red-800 border-red-300",
    OVERDUE: "bg-orange-100 text-orange-800 border-orange-300",
  };

  const handleApprove = async (approvalId: string) => {
    setProcessingId(approvalId);
    try {
      const response = await fetch(`/api/approvals/${approvalId}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "APPROVED",
          feedbackText: null,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to approve");
      }

      toast.success("Approval submitted successfully!");
      router.refresh();
    } catch (error) {
      console.error("Error approving:", error);
      toast.error("Failed to submit approval");
    } finally {
      setProcessingId(null);
    }
  };

  const handleRequestChanges = async (approvalId: string) => {
    setProcessingId(approvalId);
    try {
      const response = await fetch(`/api/approvals/${approvalId}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "CHANGES_REQUESTED",
          feedbackText: "Please review and make necessary changes",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to request changes");
      }

      toast.success("Changes requested successfully!");
      router.refresh();
    } catch (error) {
      console.error("Error requesting changes:", error);
      toast.error("Failed to request changes");
    } finally {
      setProcessingId(null);
    }
  };

  const renderApprovalCard = (approval: Approval) => {
    const userReview = approval.reviewers.find((r) => r.reviewer.id === userId);
    const isPending = userReview?.status === "PENDING";
    const isOverdue =
      approval.dueDate && new Date(approval.dueDate) < new Date();

    return (
      <Card key={approval.id} className="hover:shadow-md transition-shadow">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <CardTitle className="text-lg">
                  {approval.project.projectName}
                </CardTitle>
                <Badge
                  className={statusColors[approval.status]}
                  variant="outline"
                >
                  {approval.status.replace("_", " ")}
                </Badge>
                {isOverdue && (
                  <Badge className="bg-orange-100 text-orange-800 border-orange-300" variant="outline">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    Overdue
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                {approval.project.creatorName} • {approval.project.category}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                router.push(`/dashboard/projects/${approval.project.id}`)
              }
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {approval.message && (
              <div className="text-sm">
                <span className="font-medium">Message:</span>{" "}
                {approval.message}
              </div>
            )}

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {approval.dueDate
                  ? `Due ${format(new Date(approval.dueDate), "MMM d, yyyy")}`
                  : "No due date"}
              </div>
              <div>
                Created {format(new Date(approval.createdAt), "MMM d, yyyy")}
              </div>
            </div>

            {userReview && (
              <div className="pt-4 border-t">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={userReview.reviewer.avatarUrl || undefined} />
                      <AvatarFallback>
                        {userReview.reviewer.fullName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">
                        {userReview.reviewer.fullName} (You)
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {userReview.status === "PENDING"
                          ? "Pending your review"
                          : userReview.status === "APPROVED"
                            ? "Approved"
                            : "Changes requested"}
                      </p>
                    </div>
                  </div>

                  {isPending && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleRequestChanges(approval.id)}
                        disabled={processingId === approval.id}
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Request Changes
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleApprove(approval.id)}
                        disabled={processingId === approval.id}
                      >
                        <CheckCircle2 className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                    </div>
                  )}
                </div>

                {userReview.feedbackText && (
                  <div className="mt-2 p-2 bg-muted rounded text-sm">
                    {userReview.feedbackText}
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  const pendingApprovals = userApprovals.filter((a) =>
    a.reviewers.some((r) => r.status === "PENDING")
  );
  const completedApprovals = userApprovals.filter((a) =>
    a.reviewers.every((r) => r.status !== "PENDING")
  );

  return (
    <Tabs defaultValue="pending" className="space-y-4">
      <TabsList>
        <TabsTrigger value="pending">
          Pending ({pendingApprovals.length})
        </TabsTrigger>
        <TabsTrigger value="completed">
          Completed ({completedApprovals.length})
        </TabsTrigger>
        {isAdmin && (
          <TabsTrigger value="all">All ({allApprovals.length})</TabsTrigger>
        )}
      </TabsList>

      <TabsContent value="pending" className="space-y-4">
        {pendingApprovals.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center text-muted-foreground">
              <CheckCircle2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No pending approvals</p>
            </CardContent>
          </Card>
        ) : (
          pendingApprovals.map(renderApprovalCard)
        )}
      </TabsContent>

      <TabsContent value="completed" className="space-y-4">
        {completedApprovals.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center text-muted-foreground">
              <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No completed approvals</p>
            </CardContent>
          </Card>
        ) : (
          completedApprovals.map(renderApprovalCard)
        )}
      </TabsContent>

      {isAdmin && (
        <TabsContent value="all" className="space-y-4">
          {allApprovals.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center text-muted-foreground">
                <p>No approvals found</p>
              </CardContent>
            </Card>
          ) : (
            allApprovals.map((approval) => {
              const allReviewed = approval.reviewers.every(
                (r) => r.status !== "PENDING"
              );
              return (
                <Card key={approval.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <CardTitle className="text-lg">
                            {approval.project.projectName}
                          </CardTitle>
                          <Badge
                            className={statusColors[approval.status]}
                            variant="outline"
                          >
                            {approval.status.replace("_", " ")}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {approval.project.creatorName} •{" "}
                          {approval.project.category}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          router.push(`/dashboard/projects/${approval.project.id}`)
                        }
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Reviewers:</p>
                      <div className="flex flex-wrap gap-2">
                        {approval.reviewers.map((reviewer) => (
                          <div
                            key={reviewer.id}
                            className="flex items-center gap-2 p-2 border rounded"
                          >
                            <Avatar className="h-6 w-6">
                              <AvatarImage
                                src={reviewer.reviewer.avatarUrl || undefined}
                              />
                              <AvatarFallback>
                                {reviewer.reviewer.fullName
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm">
                              {reviewer.reviewer.fullName}
                            </span>
                            <Badge
                              variant={
                                reviewer.status === "APPROVED"
                                  ? "default"
                                  : "secondary"
                              }
                              className="text-xs"
                            >
                              {reviewer.status}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </TabsContent>
      )}
    </Tabs>
  );
}
