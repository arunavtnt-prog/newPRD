"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  XCircle,
  Clock,
  MessageSquare,
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";

interface Approval {
  id: string;
  status: string;
  requestDate: Date;
  reviewDate: Date | null;
  comments: string | null;
  requestedBy: {
    id: string;
    fullName: string;
    avatarUrl: string | null;
  };
  reviewedBy: {
    id: string;
    fullName: string;
    avatarUrl: string | null;
  } | null;
}

interface ClientProjectTimelineProps {
  approvals: Approval[];
}

const statusIcons: Record<string, React.ElementType> = {
  PENDING: Clock,
  APPROVED: CheckCircle2,
  REJECTED: XCircle,
  CHANGES_REQUESTED: MessageSquare,
};

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700 border-yellow-200",
  APPROVED: "bg-green-100 text-green-700 border-green-200",
  REJECTED: "bg-red-100 text-red-700 border-red-200",
  CHANGES_REQUESTED: "bg-orange-100 text-orange-700 border-orange-200",
};

export function ClientProjectTimeline({ approvals }: ClientProjectTimelineProps) {
  if (approvals.length === 0) {
    return (
      <Card className="border-purple-100">
        <CardContent className="p-12 text-center text-muted-foreground">
          <Clock className="h-12 w-12 mx-auto mb-4" />
          <p>No approval requests yet</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-purple-100">
      <CardHeader>
        <CardTitle>Approval History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {approvals.map((approval, index) => {
            const Icon = statusIcons[approval.status] || Clock;
            const requesterInitials = approval.requestedBy.fullName
              ?.split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase();
            const reviewerInitials = approval.reviewedBy?.fullName
              ?.split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase();

            return (
              <div
                key={approval.id}
                className="flex gap-4 p-4 rounded-lg border border-purple-100 hover:bg-purple-50/50 transition-colors"
              >
                {/* Timeline */}
                <div className="flex flex-col items-center">
                  <div className={`p-2 rounded-full ${
                    approval.status === "APPROVED"
                      ? "bg-green-100"
                      : approval.status === "REJECTED"
                      ? "bg-red-100"
                      : approval.status === "CHANGES_REQUESTED"
                      ? "bg-orange-100"
                      : "bg-yellow-100"
                  }`}>
                    <Icon className={`h-5 w-5 ${
                      approval.status === "APPROVED"
                        ? "text-green-600"
                        : approval.status === "REJECTED"
                        ? "text-red-600"
                        : approval.status === "CHANGES_REQUESTED"
                        ? "text-orange-600"
                        : "text-yellow-600"
                    }`} />
                  </div>
                  {index < approvals.length - 1 && (
                    <div className="w-px h-full bg-purple-200 mt-2" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      <Badge variant="outline" className={statusColors[approval.status]}>
                        {approval.status.replace("_", " ")}
                      </Badge>
                      <p className="text-sm text-muted-foreground">
                        Requested {formatDistanceToNow(new Date(approval.requestDate))} ago
                      </p>
                    </div>
                  </div>

                  {/* Requester */}
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage
                        src={approval.requestedBy.avatarUrl || undefined}
                      />
                      <AvatarFallback className="text-xs">
                        {requesterInitials}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm">
                      <span className="font-medium">
                        {approval.requestedBy.fullName}
                      </span>{" "}
                      <span className="text-muted-foreground">
                        requested approval
                      </span>
                    </span>
                  </div>

                  {/* Reviewer */}
                  {approval.reviewedBy && approval.reviewDate && (
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage
                          src={approval.reviewedBy.avatarUrl || undefined}
                        />
                        <AvatarFallback className="text-xs">
                          {reviewerInitials}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm">
                        <span className="font-medium">
                          {approval.reviewedBy.fullName}
                        </span>{" "}
                        <span className="text-muted-foreground">
                          {approval.status === "APPROVED"
                            ? "approved"
                            : approval.status === "REJECTED"
                            ? "rejected"
                            : "requested changes"}
                        </span>
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(approval.reviewDate))} ago
                      </span>
                    </div>
                  )}

                  {/* Comments */}
                  {approval.comments && (
                    <div className="p-3 rounded-lg bg-muted">
                      <p className="text-sm">{approval.comments}</p>
                    </div>
                  )}

                  {/* Action Button for Pending */}
                  {approval.status === "PENDING" && (
                    <Button size="sm" asChild>
                      <a href={`/client/approvals/${approval.id}`}>
                        Review Request
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
