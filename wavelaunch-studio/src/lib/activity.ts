/**
 * Activity Logging Utilities
 *
 * Functions for logging user activities and system events
 */

import { prisma } from "@/lib/db";

export type EntityType =
  | "PROJECT"
  | "APPROVAL"
  | "COMMENT"
  | "FILE"
  | "PHASE"
  | "USER"
  | "TEAM"
  | "CAMPAIGN"
  | "PURCHASE_ORDER";

export type ActionType =
  | "CREATED"
  | "UPDATED"
  | "DELETED"
  | "APPROVED"
  | "REJECTED"
  | "COMMENTED"
  | "UPLOADED"
  | "DOWNLOADED"
  | "SHARED"
  | "ASSIGNED"
  | "UNASSIGNED"
  | "STATUS_CHANGED"
  | "COMPLETED";

interface LogActivityParams {
  userId: string;
  actionType: ActionType;
  entityType: EntityType;
  entityId: string;
  description: string;
  projectId?: string;
  metadata?: Record<string, any>;
}

/**
 * Log an activity to the audit trail
 */
export async function logActivity(params: LogActivityParams) {
  try {
    const activity = await prisma.activityLog.create({
      data: {
        userId: params.userId,
        actionType: params.actionType,
        entityType: params.entityType,
        entityId: params.entityId,
        description: params.description,
        projectId: params.projectId,
        metadata: params.metadata ? JSON.stringify(params.metadata) : null,
      },
    });

    return activity;
  } catch (error) {
    console.error("Error logging activity:", error);
    // Don't throw - activity logging should not break main functionality
    return null;
  }
}

/**
 * Get activity description template based on type
 */
export function getActivityDescription(
  actionType: ActionType,
  entityType: EntityType,
  entityName: string,
  metadata?: Record<string, any>
): string {
  const templates: Record<string, string> = {
    "CREATED_PROJECT": `created project "${entityName}"`,
    "UPDATED_PROJECT": `updated project "${entityName}"`,
    "DELETED_PROJECT": `deleted project "${entityName}"`,
    "STATUS_CHANGED_PROJECT": `changed status of "${entityName}" to ${metadata?.newStatus || ""}`,

    "CREATED_APPROVAL": `requested approval for "${entityName}"`,
    "APPROVED_APPROVAL": `approved "${entityName}"`,
    "REJECTED_APPROVAL": `requested changes for "${entityName}"`,

    "CREATED_COMMENT": `commented on "${entityName}"`,
    "DELETED_COMMENT": `deleted comment on "${entityName}"`,

    "UPLOADED_FILE": `uploaded file "${entityName}"`,
    "DOWNLOADED_FILE": `downloaded file "${entityName}"`,
    "DELETED_FILE": `deleted file "${entityName}"`,

    "COMPLETED_PHASE": `completed phase "${entityName}"`,
    "UPDATED_PHASE": `updated phase "${entityName}"`,

    "CREATED_USER": `added team member "${entityName}"`,
    "UPDATED_USER": `updated team member "${entityName}"`,
    "DELETED_USER": `removed team member "${entityName}"`,

    "ASSIGNED_PROJECT": `assigned "${entityName}" to ${metadata?.assignedTo || "team member"}`,
    "UNASSIGNED_PROJECT": `unassigned "${entityName}" from ${metadata?.unassignedFrom || "team member"}`,
  };

  const key = `${actionType}_${entityType}`;
  return templates[key] || `${actionType.toLowerCase()} ${entityType.toLowerCase()} "${entityName}"`;
}

/**
 * Get activity icon based on action type
 */
export function getActivityIcon(actionType: ActionType): string {
  const iconMap: Record<ActionType, string> = {
    CREATED: "Plus",
    UPDATED: "Edit",
    DELETED: "Trash2",
    APPROVED: "CheckCircle",
    REJECTED: "XCircle",
    COMMENTED: "MessageSquare",
    UPLOADED: "Upload",
    DOWNLOADED: "Download",
    SHARED: "Share2",
    ASSIGNED: "UserPlus",
    UNASSIGNED: "UserMinus",
    STATUS_CHANGED: "RefreshCw",
    COMPLETED: "Award",
  };

  return iconMap[actionType] || "Activity";
}

/**
 * Get activity color based on action type
 */
export function getActivityColor(actionType: ActionType): string {
  const colorMap: Record<ActionType, string> = {
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

  return colorMap[actionType] || "text-gray-600 bg-gray-100 dark:bg-gray-950";
}
