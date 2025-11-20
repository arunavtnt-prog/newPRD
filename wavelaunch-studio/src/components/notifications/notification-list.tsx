"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  CheckCircle, ThumbsUp, MessageCircle, AtSign, Reply, RefreshCw,
  UserPlus, Award, Upload, Clock, Users, Bell, Trash2, CheckCheck
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { EmptyNotifications } from "@/components/empty-states/empty-states";

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  actionUrl: string | null;
  isRead: boolean;
  createdAt: Date;
  triggeredBy: {
    id: string;
    fullName: string;
    avatarUrl: string | null;
  } | null;
}

interface NotificationListProps {
  notifications: Notification[];
  unreadCount: number;
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onDelete: (id: string) => void;
  isLoading: boolean;
  compact?: boolean;
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  APPROVAL_REQUEST: CheckCircle,
  APPROVAL_APPROVED: ThumbsUp,
  APPROVAL_CHANGES_REQUESTED: MessageCircle,
  COMMENT_MENTION: AtSign,
  COMMENT_REPLY: Reply,
  PROJECT_STATUS_CHANGED: RefreshCw,
  PROJECT_ASSIGNED: UserPlus,
  PHASE_COMPLETED: Award,
  FILE_UPLOADED: Upload,
  DEADLINE_APPROACHING: Clock,
  TEAM_MEMBER_ADDED: Users,
};

const colorMap: Record<string, string> = {
  APPROVAL_REQUEST: "text-amber-600 bg-amber-100 dark:bg-amber-950",
  APPROVAL_APPROVED: "text-green-600 bg-green-100 dark:bg-green-950",
  APPROVAL_CHANGES_REQUESTED: "text-red-600 bg-red-100 dark:bg-red-950",
  COMMENT_MENTION: "text-blue-600 bg-blue-100 dark:bg-blue-950",
  COMMENT_REPLY: "text-blue-600 bg-blue-100 dark:bg-blue-950",
  PROJECT_STATUS_CHANGED: "text-purple-600 bg-purple-100 dark:bg-purple-950",
  PROJECT_ASSIGNED: "text-indigo-600 bg-indigo-100 dark:bg-indigo-950",
  PHASE_COMPLETED: "text-green-600 bg-green-100 dark:bg-green-950",
  FILE_UPLOADED: "text-cyan-600 bg-cyan-100 dark:bg-cyan-950",
  DEADLINE_APPROACHING: "text-orange-600 bg-orange-100 dark:bg-orange-950",
  TEAM_MEMBER_ADDED: "text-teal-600 bg-teal-100 dark:bg-teal-950",
};

export function NotificationList({
  notifications,
  unreadCount,
  onMarkAsRead,
  onMarkAllAsRead,
  onDelete,
  isLoading,
  compact = false,
}: NotificationListProps) {
  if (isLoading) {
    return (
      <div className="p-4">
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex gap-3 animate-pulse">
              <div className="h-10 w-10 rounded-full bg-muted" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-3/4 bg-muted rounded" />
                <div className="h-3 w-1/2 bg-muted rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <div className={compact ? "p-8" : ""}>
        <EmptyNotifications />
      </div>
    );
  }

  const content = (
    <>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          <h3 className="font-semibold">Notifications</h3>
          {unreadCount > 0 && (
            <span className="text-xs text-muted-foreground">
              ({unreadCount} unread)
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onMarkAllAsRead}
            className="text-xs"
          >
            <CheckCheck className="h-4 w-4 mr-1" />
            Mark all read
          </Button>
        )}
      </div>

      {/* Notifications List */}
      <ScrollArea className={compact ? "h-[400px]" : "h-full"}>
        <div className="divide-y">
          {notifications.map((notification) => {
            const Icon = iconMap[notification.type] || Bell;
            const colorClass = colorMap[notification.type] || "text-gray-600 bg-gray-100 dark:bg-gray-950";

            const content = (
              <div
                className={cn(
                  "flex gap-3 p-4 hover:bg-accent/50 transition-colors group",
                  !notification.isRead && "bg-accent/30"
                )}
              >
                {/* Icon */}
                <div className={cn("p-2 rounded-full h-fit", colorClass)}>
                  <Icon className="h-4 w-4" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <p className={cn("text-sm font-medium", !notification.isRead && "font-semibold")}>
                    {notification.title}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {notification.message}
                  </p>
                  <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                    {notification.triggeredBy && (
                      <div className="flex items-center gap-1">
                        <Avatar className="h-4 w-4">
                          <AvatarImage src={notification.triggeredBy.avatarUrl || undefined} />
                          <AvatarFallback className="text-[8px]">
                            {notification.triggeredBy.fullName.split(" ").map(n => n[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        <span>{notification.triggeredBy.fullName}</span>
                      </div>
                    )}
                    <span>•</span>
                    <span>{formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-start gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {!notification.isRead && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={(e) => {
                        e.preventDefault();
                        onMarkAsRead(notification.id);
                      }}
                    >
                      <CheckCircle className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive"
                    onClick={(e) => {
                      e.preventDefault();
                      onDelete(notification.id);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            );

            if (notification.actionUrl) {
              return (
                <Link
                  key={notification.id}
                  href={notification.actionUrl}
                  onClick={() => {
                    if (!notification.isRead) {
                      onMarkAsRead(notification.id);
                    }
                  }}
                >
                  {content}
                </Link>
              );
            }

            return <div key={notification.id}>{content}</div>;
          })}
        </div>
      </ScrollArea>

      {/* Footer */}
      {compact && notifications.length > 0 && (
        <div className="p-3 border-t">
          <Button variant="ghost" size="sm" className="w-full" asChild>
            <Link href="/dashboard/notifications">View All Notifications</Link>
          </Button>
        </div>
      )}
    </>
  );

  return compact ? (
    content
  ) : (
    <div className="border rounded-lg bg-card">{content}</div>
  );
}
