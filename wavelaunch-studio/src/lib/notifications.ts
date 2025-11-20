/**
 * Notification Utilities
 *
 * Functions for creating and managing notifications
 */

import { prisma } from "@/lib/db";

export type NotificationType =
  | "APPROVAL_REQUEST"
  | "APPROVAL_APPROVED"
  | "APPROVAL_CHANGES_REQUESTED"
  | "COMMENT_MENTION"
  | "COMMENT_REPLY"
  | "PROJECT_STATUS_CHANGED"
  | "PROJECT_ASSIGNED"
  | "PHASE_COMPLETED"
  | "FILE_UPLOADED"
  | "DEADLINE_APPROACHING"
  | "TEAM_MEMBER_ADDED";

interface CreateNotificationParams {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  actionUrl?: string;
  triggeredById?: string;
  relatedProjectId?: string;
  relatedApprovalId?: string;
}

/**
 * Create a notification for a user
 */
export async function createNotification(params: CreateNotificationParams) {
  try {
    const notification = await prisma.notification.create({
      data: {
        userId: params.userId,
        type: params.type,
        title: params.title,
        message: params.message,
        actionUrl: params.actionUrl,
        triggeredById: params.triggeredById,
        relatedProjectId: params.relatedProjectId,
        relatedApprovalId: params.relatedApprovalId,
        isRead: false,
      },
    });

    return notification;
  } catch (error) {
    console.error("Error creating notification:", error);
    throw error;
  }
}

/**
 * Create notifications for multiple users
 */
export async function createBulkNotifications(
  userIds: string[],
  params: Omit<CreateNotificationParams, "userId">
) {
  try {
    const notifications = await prisma.notification.createMany({
      data: userIds.map((userId) => ({
        userId,
        type: params.type,
        title: params.title,
        message: params.message,
        actionUrl: params.actionUrl,
        triggeredById: params.triggeredById,
        relatedProjectId: params.relatedProjectId,
        relatedApprovalId: params.relatedApprovalId,
        isRead: false,
      })),
    });

    return notifications;
  } catch (error) {
    console.error("Error creating bulk notifications:", error);
    throw error;
  }
}

/**
 * Get notification icon based on type
 */
export function getNotificationIcon(type: NotificationType): string {
  const iconMap: Record<NotificationType, string> = {
    APPROVAL_REQUEST: "CheckCircle",
    APPROVAL_APPROVED: "ThumbsUp",
    APPROVAL_CHANGES_REQUESTED: "MessageCircle",
    COMMENT_MENTION: "AtSign",
    COMMENT_REPLY: "Reply",
    PROJECT_STATUS_CHANGED: "RefreshCw",
    PROJECT_ASSIGNED: "UserPlus",
    PHASE_COMPLETED: "Award",
    FILE_UPLOADED: "Upload",
    DEADLINE_APPROACHING: "Clock",
    TEAM_MEMBER_ADDED: "Users",
  };

  return iconMap[type] || "Bell";
}

/**
 * Get notification color based on type
 */
export function getNotificationColor(type: NotificationType): string {
  const colorMap: Record<NotificationType, string> = {
    APPROVAL_REQUEST: "text-amber-600",
    APPROVAL_APPROVED: "text-green-600",
    APPROVAL_CHANGES_REQUESTED: "text-red-600",
    COMMENT_MENTION: "text-blue-600",
    COMMENT_REPLY: "text-blue-600",
    PROJECT_STATUS_CHANGED: "text-purple-600",
    PROJECT_ASSIGNED: "text-indigo-600",
    PHASE_COMPLETED: "text-green-600",
    FILE_UPLOADED: "text-cyan-600",
    DEADLINE_APPROACHING: "text-orange-600",
    TEAM_MEMBER_ADDED: "text-teal-600",
  };

  return colorMap[type] || "text-gray-600";
}
