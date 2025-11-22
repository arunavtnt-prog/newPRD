"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { Activity } from "lucide-react";

interface ActivityLog {
  id: string;
  action: string;
  entity: string;
  createdAt: Date;
  user: {
    id: string;
    fullName: string;
    avatarUrl: string | null;
  };
}

interface ClientRecentActivityProps {
  activity: ActivityLog[];
}

const actionLabels: Record<string, string> = {
  PROJECT_CREATED: "created a project",
  PROJECT_UPDATED: "updated a project",
  PROJECT_STATUS_CHANGED: "changed project status",
  APPROVAL_REQUESTED: "requested approval",
  APPROVAL_APPROVED: "approved",
  APPROVAL_REJECTED: "rejected",
  FILE_UPLOADED: "uploaded a file",
  FILE_DELETED: "deleted a file",
  COMMENT_ADDED: "added a comment",
};

export function ClientRecentActivity({ activity }: ClientRecentActivityProps) {
  if (activity.length === 0) {
    return (
      <Card className="border-purple-100">
        <CardHeader>
          <CardTitle className="text-lg">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Activity className="h-8 w-8 mx-auto mb-2" />
            <p className="text-sm">No recent activity</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-purple-100">
      <CardHeader>
        <CardTitle className="text-lg">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activity.slice(0, 5).map((item) => {
            const userInitials = item.user.fullName
              ?.split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase();

            return (
              <div key={item.id} className="flex gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={item.user.avatarUrl || undefined} />
                  <AvatarFallback className="text-xs">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 space-y-1">
                  <p className="text-sm">
                    <span className="font-medium">{item.user.fullName}</span>{" "}
                    <span className="text-muted-foreground">
                      {actionLabels[item.action] || item.action.toLowerCase()}
                    </span>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(item.createdAt))} ago
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
