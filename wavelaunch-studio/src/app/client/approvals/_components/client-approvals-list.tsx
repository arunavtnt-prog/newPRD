"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CheckCircle, XCircle, Clock, ArrowRight, FileCheck } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useRouter, useSearchParams } from "next/navigation";

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
  };
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

interface ClientApprovalsListProps {
  approvals: Approval[];
}

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700 border-yellow-200",
  APPROVED: "bg-green-100 text-green-700 border-green-200",
  REJECTED: "bg-red-100 text-red-700 border-red-200",
  CHANGES_REQUESTED: "bg-orange-100 text-orange-700 border-orange-200",
};

const statusIcons: Record<string, React.ElementType> = {
  PENDING: Clock,
  APPROVED: CheckCircle,
  REJECTED: XCircle,
  CHANGES_REQUESTED: Clock,
};

export function ClientApprovalsList({ approvals }: ClientApprovalsListProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentStatus = searchParams.get("status") || "ALL";

  const handleStatusChange = (status: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (status === "ALL") {
      params.delete("status");
    } else {
      params.set("status", status);
    }
    router.push(`/client/approvals?${params.toString()}`);
  };

  if (approvals.length === 0) {
    return (
      <Card className="border-purple-100">
        <CardContent className="p-12">
          <div className="text-center">
            <FileCheck className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Approval Requests</h3>
            <p className="text-muted-foreground">
              {currentStatus === "ALL"
                ? "You don't have any approval requests yet."
                : "No approval requests match your current filter."}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-purple-100">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Approval Requests</CardTitle>
          <Select value={currentStatus} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Statuses</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="APPROVED">Approved</SelectItem>
              <SelectItem value="REJECTED">Rejected</SelectItem>
              <SelectItem value="CHANGES_REQUESTED">Changes Requested</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {approvals.map((approval) => {
            const Icon = statusIcons[approval.status] || Clock;
            const requesterInitials = approval.requestedBy.fullName
              ?.split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase();

            return (
              <div
                key={approval.id}
                className="flex items-center justify-between p-4 rounded-lg border border-purple-100 hover:border-purple-200 hover:bg-purple-50/50 transition-all"
              >
                <div className="flex items-center gap-4 flex-1">
                  {/* Icon */}
                  <div
                    className={`p-2 rounded-lg ${
                      approval.status === "APPROVED"
                        ? "bg-green-100"
                        : approval.status === "REJECTED"
                        ? "bg-red-100"
                        : "bg-yellow-100"
                    }`}
                  >
                    <Icon
                      className={`h-5 w-5 ${
                        approval.status === "APPROVED"
                          ? "text-green-600"
                          : approval.status === "REJECTED"
                          ? "text-red-600"
                          : "text-yellow-600"
                      }`}
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">
                        {approval.project.projectName}
                      </h3>
                      <Badge variant="outline" className={statusColors[approval.status]}>
                        {approval.status.replace("_", " ")}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-2">
                      <Avatar className="h-5 w-5">
                        <AvatarImage
                          src={approval.requestedBy.avatarUrl || undefined}
                        />
                        <AvatarFallback className="text-xs">
                          {requesterInitials}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-muted-foreground">
                        Requested by {approval.requestedBy.fullName}
                      </span>
                      <span className="text-sm text-muted-foreground">•</span>
                      <span className="text-sm text-muted-foreground">
                        {formatDistanceToNow(new Date(approval.requestDate))} ago
                      </span>
                    </div>

                    {approval.comments && (
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {approval.comments}
                      </p>
                    )}
                  </div>
                </div>

                {/* Action Button */}
                <Button
                  variant={approval.status === "PENDING" ? "default" : "ghost"}
                  size="sm"
                  asChild
                >
                  <a href={`/client/approvals/${approval.id}`}>
                    {approval.status === "PENDING" ? "Review" : "View"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
