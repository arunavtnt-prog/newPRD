"use client";

import * as React from "react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Plus, Edit, Trash2, CheckCircle, XCircle, MessageSquare,
  Upload, Download, Share2, UserPlus, UserMinus, RefreshCw, Award, Activity as ActivityIcon
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

interface Activity {
  id: string;
  actionType: string;
  entityType: string;
  entityId: string;
  description: string;
  createdAt: Date;
  user: {
    id: string;
    fullName: string;
    avatarUrl: string | null;
  };
  project: {
    id: string;
    projectName: string;
  } | null;
}

interface ActivityFeedProps {
  activities: Activity[];
  limit?: number;
  showViewAll?: boolean;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  CREATED: Plus,
  UPDATED: Edit,
  DELETED: Trash2,
  APPROVED: CheckCircle,
  REJECTED: XCircle,
  COMMENTED: MessageSquare,
  UPLOADED: Upload,
  DOWNLOADED: Download,
  SHARED: Share2,
  ASSIGNED: UserPlus,
  UNASSIGNED: UserMinus,
  STATUS_CHANGED: RefreshCw,
  COMPLETED: Award,
};

const colorMap: Record<string, string> = {
  CREATED: "text-green-600 bg-green-100 dark:bg-green-950",
  UPDATED: "text-blue-600 bg-blue-100 dark:bg-blue-950",
  DELETED: "text-red-600 bg-red-100 dark:bg-red-950",
  APPROVED: "text-green-600 bg-green-100 dark:bg-green-950",
  REJECTED: "text-red-600 bg-red-100 dark:bg-red-950",
  COMMENTED: "text-purple-600 bg-purple-100 dark:bg-purple-950",
  UPLOADED: "text-cyan-600 bg-cyan-100 dark:bg-cyan-950",
  DOWNLOADED: "text-indigo-600 bg-indigo-100 dark:bg-indigo-950",
  SHARED: "text-teal-600 bg-teal-100 dark:bg-teal-950",
  ASSIGNED: "text-amber-600 bg-amber-100 dark:bg-amber-950",
  UNASSIGNED: "text-orange-600 bg-orange-100 dark:bg-orange-950",
  STATUS_CHANGED: "text-violet-600 bg-violet-100 dark:bg-violet-950",
  COMPLETED: "text-emerald-600 bg-emerald-100 dark:bg-emerald-950",
};

export function ActivityFeed({ activities, limit, showViewAll = false }: ActivityFeedProps) {
  const displayActivities = limit ? activities.slice(0, limit) : activities;

  if (activities.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Track all project activities</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-8">
          <ActivityIcon className="h-12 w-12 text-muted-foreground mb-3" />
          <p className="text-sm text-muted-foreground">No recent activity</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>
          Latest updates across all projects ({activities.length} total)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {displayActivities.map((activity) => {
              const Icon = iconMap[activity.actionType] || ActivityIcon;
              const colorClass = colorMap[activity.actionType] || "text-gray-600 bg-gray-100 dark:bg-gray-950";

              return (
                <div key={activity.id} className="flex gap-3">
                  {/* Icon */}
                  <div className={cn("p-2 rounded-full h-fit mt-0.5", colorClass)}>
                    <Icon className="h-3 w-3" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-start gap-2">
                      <Avatar className="h-6 w-6 flex-shrink-0">
                        <AvatarImage src={activity.user.avatarUrl || undefined} />
                        <AvatarFallback className="text-[10px]">
                          {activity.user.fullName.split(" ").map(n => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm">
                          <span className="font-medium">{activity.user.fullName}</span>{" "}
                          {activity.description}
                        </p>
                        {activity.project && (
                          <Link
                            href={`/dashboard/projects/${activity.project.id}`}
                            className="text-xs text-primary hover:underline"
                          >
                            {activity.project.projectName}
                          </Link>
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
        {showViewAll && activities.length > (limit || 0) && (
          <div className="mt-4 pt-4 border-t">
            <Button variant="ghost" size="sm" className="w-full" asChild>
              <Link href="/dashboard/activity">View All Activity</Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
