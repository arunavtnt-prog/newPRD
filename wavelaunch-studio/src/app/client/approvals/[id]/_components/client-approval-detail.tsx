"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Calendar, Mail } from "lucide-react";
import { format } from "date-fns";

interface Approval {
  id: string;
  status: string;
  requestDate: Date;
  reviewDate: Date | null;
  comments: string | null;
  project: {
    id: string;
    projectName: string;
    status: string;
    leadStrategist: {
      id: string;
      fullName: string;
      avatarUrl: string | null;
      email: string;
    } | null;
  };
  requestedBy: {
    id: string;
    fullName: string;
    avatarUrl: string | null;
    email: string;
  };
  reviewedBy: {
    id: string;
    fullName: string;
    avatarUrl: string | null;
  } | null;
}

interface ClientApprovalDetailProps {
  approval: Approval;
}

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700 border-yellow-200",
  APPROVED: "bg-green-100 text-green-700 border-green-200",
  REJECTED: "bg-red-100 text-red-700 border-red-200",
  CHANGES_REQUESTED: "bg-orange-100 text-orange-700 border-orange-200",
};

export function ClientApprovalDetail({ approval }: ClientApprovalDetailProps) {
  const requesterInitials = approval.requestedBy.fullName
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div className="space-y-4">
      {/* Back Button */}
      <Button variant="ghost" asChild>
        <a href="/client/approvals">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Approvals
        </a>
      </Button>

      {/* Approval Details */}
      <Card className="border-purple-100">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl">Approval Request</CardTitle>
              <p className="text-muted-foreground mt-1">
                {approval.project.projectName}
              </p>
            </div>
            <Badge variant="outline" className={statusColors[approval.status]}>
              {approval.status.replace("_", " ")}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Request Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Requested By */}
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-2">
                Requested By
              </p>
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage
                    src={approval.requestedBy.avatarUrl || undefined}
                  />
                  <AvatarFallback>{requesterInitials}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{approval.requestedBy.fullName}</p>
                  <a
                    href={`mailto:${approval.requestedBy.email}`}
                    className="text-sm text-muted-foreground hover:text-purple-600 flex items-center gap-1"
                  >
                    <Mail className="h-3 w-3" />
                    {approval.requestedBy.email}
                  </a>
                </div>
              </div>
            </div>

            {/* Request Date */}
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-2">
                Request Date
              </p>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>{format(new Date(approval.requestDate), "PPP")}</span>
              </div>
            </div>
          </div>

          {/* Review Info (if reviewed) */}
          {approval.reviewedBy && approval.reviewDate && (
            <div className="p-4 rounded-lg bg-muted">
              <p className="text-sm font-medium mb-2">Review Details</p>
              <div className="space-y-2">
                <p className="text-sm">
                  Reviewed by{" "}
                  <span className="font-medium">
                    {approval.reviewedBy.fullName}
                  </span>{" "}
                  on {format(new Date(approval.reviewDate), "PPP")}
                </p>
                {approval.comments && (
                  <div className="mt-3 p-3 rounded bg-background">
                    <p className="text-sm font-medium mb-1">Comments:</p>
                    <p className="text-sm text-muted-foreground">
                      {approval.comments}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Project Link */}
          <Button variant="outline" asChild>
            <a href={`/client/projects/${approval.project.id}`}>
              View Full Project
            </a>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
