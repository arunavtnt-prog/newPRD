/**
 * Project Approvals Component
 *
 * Displays and manages approval requests for a project
 */

"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  CheckCircle,
  XCircle,
  Clock,
  MessageSquare,
  Plus,
  AlertCircle,
} from "lucide-react";
import { formatDistanceToNow, isPast } from "date-fns";
import { RequestApprovalDialog } from "./request-approval-dialog";
import { ReviewApprovalDialog } from "./review-approval-dialog";

interface Approval {
  id: string;
  message: string | null;
  dueDate: Date | null;
  status: string;
  createdAt: Date;
  reviewers: Array<{
    id: string;
    status: string;
    feedbackText: string | null;
    reviewedAt: Date | null;
    reviewerId: string;
    reviewer: {
      fullName: string;
      avatarUrl: string | null;
    };
  }>;
}

interface ProjectApprovalsProps {
  projectId: string;
  approvals: Approval[];
  availableReviewers: Array<{
    id: string;
    fullName: string;
    email: string;
  }>;
  currentUserId: string;
}

export function ProjectApprovals({
  projectId,
  approvals,
  availableReviewers,
  currentUserId,
}: ProjectApprovalsProps) {
  const pendingApprovals = approvals.filter((a) => a.status === "PENDING");
  const completedApprovals = approvals.filter(
    (a) => a.status === "APPROVED" || a.status === "CHANGES_REQUESTED"
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "CHANGES_REQUESTED":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200";
      case "OVERDUE":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "PENDING":
      default:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "APPROVED":
        return <CheckCircle className="h-4 w-4" />;
      case "CHANGES_REQUESTED":
        return <XCircle className="h-4 w-4" />;
      case "OVERDUE":
        return <AlertCircle className="h-4 w-4" />;
      case "PENDING":
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const isOverdue = (approval: Approval) => {
    return (
      approval.status === "PENDING" &&
      approval.dueDate &&
      isPast(new Date(approval.dueDate))
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Approvals</h2>
          <p className="text-muted-foreground">
            {pendingApprovals.length} pending approval
            {pendingApprovals.length !== 1 ? "s" : ""}
          </p>
        </div>
        <RequestApprovalDialog
          projectId={projectId}
          availableReviewers={availableReviewers}
        >
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Request Approval
          </Button>
        </RequestApprovalDialog>
      </div>

      {/* Pending Approvals */}
      {pendingApprovals.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Pending Approvals</h3>
          {pendingApprovals.map((approval) => {
            const overdueStatus = isOverdue(approval);
            const displayStatus = overdueStatus ? "OVERDUE" : approval.status;

            return (
              <Card key={approval.id}>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={getStatusColor(displayStatus)}>
                            <span className="flex items-center gap-1">
                              {getStatusIcon(displayStatus)}
                              {displayStatus.replace("_", " ")}
                            </span>
                          </Badge>
                          {approval.dueDate && (
                            <span className="text-sm text-muted-foreground">
                              Due{" "}
                              {formatDistanceToNow(new Date(approval.dueDate), {
                                addSuffix: true,
                              })}
                            </span>
                          )}
                        </div>
                        {approval.message && (
                          <p className="text-sm">{approval.message}</p>
                        )}
                      </div>
                    </div>

                    {/* Reviewers */}
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Reviewers:</p>
                      <div className="space-y-2">
                        {approval.reviewers.map((reviewer) => {
                          const isCurrentUser =
                            reviewer.reviewerId === currentUserId;
                          const canReview =
                            isCurrentUser && reviewer.status === "PENDING";

                          return (
                            <div key={reviewer.id} className="space-y-2">
                              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                                <div className="flex items-center gap-3 flex-1">
                                  <Avatar className="h-8 w-8">
                                    <AvatarImage
                                      src={
                                        reviewer.reviewer.avatarUrl || undefined
                                      }
                                    />
                                    <AvatarFallback>
                                      {reviewer.reviewer.fullName
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                      <p className="text-sm font-medium">
                                        {reviewer.reviewer.fullName}
                                      </p>
                                      {isCurrentUser && (
                                        <Badge
                                          variant="secondary"
                                          className="h-4 px-1 text-[10px]"
                                        >
                                          You
                                        </Badge>
                                      )}
                                    </div>
                                    {reviewer.reviewedAt && (
                                      <p className="text-xs text-muted-foreground">
                                        Reviewed{" "}
                                        {formatDistanceToNow(
                                          new Date(reviewer.reviewedAt),
                                          { addSuffix: true }
                                        )}
                                      </p>
                                    )}
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Badge variant="outline">
                                    {reviewer.status.replace("_", " ")}
                                  </Badge>
                                  {canReview && (
                                    <ReviewApprovalDialog
                                      approvalId={approval.id}
                                      reviewerId={reviewer.reviewerId}
                                      currentStatus={reviewer.status}
                                    >
                                      <Button size="sm" variant="default">
                                        Review
                                      </Button>
                                    </ReviewApprovalDialog>
                                  )}
                                </div>
                              </div>
                              {/* Show feedback if provided */}
                              {reviewer.feedbackText && (
                                <div className="ml-11 p-3 bg-muted/30 rounded-lg border-l-2 border-amber-500">
                                  <p className="text-xs font-medium text-muted-foreground mb-1">
                                    Feedback:
                                  </p>
                                  <p className="text-sm">
                                    {reviewer.feedbackText}
                                  </p>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 pt-2">
                      <Button size="sm" disabled>
                        <MessageSquare className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Completed Approvals */}
      {completedApprovals.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Recent Completed</h3>
          {completedApprovals.slice(0, 5).map((approval) => (
            <Card key={approval.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Badge className={getStatusColor(approval.status)}>
                      <span className="flex items-center gap-1">
                        {getStatusIcon(approval.status)}
                        {approval.status.replace("_", " ")}
                      </span>
                    </Badge>
                    {approval.message && (
                      <p className="text-sm">{approval.message}</p>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(approval.createdAt), {
                      addSuffix: true,
                    })}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Empty State */}
      {approvals.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="mb-4 rounded-full bg-muted p-4">
              <CheckCircle className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No approvals yet</h3>
            <p className="text-sm text-muted-foreground text-center max-w-md mb-6">
              Request approval for brand assets, designs, or deliverables to
              get feedback from your team. Track reviews and keep everyone aligned.
            </p>
            <RequestApprovalDialog
              projectId={projectId}
              availableReviewers={availableReviewers}
            >
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Request First Approval
              </Button>
            </RequestApprovalDialog>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
