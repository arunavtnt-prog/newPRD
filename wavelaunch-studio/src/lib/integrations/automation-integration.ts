/**
 * Automation Integration
 *
 * Integration examples for using email, workflows, and webhooks in the application
 */

import { emailService, sendNotificationEmail } from "../email/email-service";
import { triggerWorkflow } from "../automation/workflow-engine";
import { triggerWebhook } from "../webhooks/webhook-service";
import { logActivity } from "../activity";
import { createNotification } from "../notifications";

/**
 * Example: Send email when project is assigned
 */
export async function onProjectAssigned(
  projectId: string,
  projectName: string,
  leadStrategistId: string,
  leadStrategistEmail: string,
  leadStrategistName: string,
  assignedById: string,
  assignedByName: string
) {
  try {
    // 1. Send email notification
    await emailService.sendTemplateEmail({
      to: leadStrategistEmail,
      template: "projectAssigned",
      data: {
        recipientName: leadStrategistName,
        projectName,
        assignedBy: assignedByName,
        actionUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/projects/${projectId}`,
      },
      subject: `You've been assigned to ${projectName}`,
    });

    // 2. Create in-app notification
    await createNotification({
      userId: leadStrategistId,
      type: "PROJECT_ASSIGNED",
      message: `You've been assigned as lead strategist for ${projectName}`,
      projectId,
      triggeredById: assignedById,
    });

    // 3. Log activity
    await logActivity({
      userId: assignedById,
      projectId,
      entityType: "PROJECT",
      entityId: projectId,
      actionType: "ASSIGNED",
      metadata: {
        leadStrategistId,
        leadStrategistName,
      },
    });

    // 4. Trigger workflows
    await triggerWorkflow(
      "PROJECT_ASSIGNED",
      {
        projectId,
        projectName,
        leadStrategist: {
          id: leadStrategistId,
          email: leadStrategistEmail,
          name: leadStrategistName,
        },
        assignedBy: {
          id: assignedById,
          name: assignedByName,
        },
      },
      assignedById
    );

    // 5. Send webhooks
    await triggerWebhook("project.updated", {
      id: projectId,
      name: projectName,
      leadStrategistId,
      updatedBy: assignedById,
    });
  } catch (error) {
    console.error("Error in onProjectAssigned:", error);
  }
}

/**
 * Example: Send email when approval is requested
 */
export async function onApprovalRequested(
  approvalId: string,
  projectId: string,
  projectName: string,
  requestedById: string,
  requestedByName: string,
  reviewers: Array<{
    id: string;
    email: string;
    name: string;
  }>,
  message?: string,
  dueDate?: Date
) {
  try {
    // Send email to each reviewer
    for (const reviewer of reviewers) {
      // 1. Send email
      await emailService.sendTemplateEmail({
        to: reviewer.email,
        template: "approvalRequested",
        data: {
          recipientName: reviewer.name,
          projectName,
          requestedBy: requestedByName,
          message,
          dueDate,
          actionUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/projects/${projectId}?tab=approvals`,
        },
        subject: `Approval requested for ${projectName}`,
      });

      // 2. Create in-app notification
      await createNotification({
        userId: reviewer.id,
        type: "APPROVAL_REQUESTED",
        message: `${requestedByName} requested your approval for ${projectName}`,
        projectId,
        triggeredById: requestedById,
        relatedEntityId: approvalId,
        relatedEntityType: "APPROVAL",
      });
    }

    // 3. Log activity
    await logActivity({
      userId: requestedById,
      projectId,
      entityType: "APPROVAL",
      entityId: approvalId,
      actionType: "CREATED",
      metadata: {
        reviewerCount: reviewers.length,
        dueDate,
      },
    });

    // 4. Trigger workflows
    await triggerWorkflow(
      "APPROVAL_REQUESTED",
      {
        approvalId,
        projectId,
        projectName,
        requestedBy: {
          id: requestedById,
          name: requestedByName,
        },
        reviewers,
        message,
        dueDate,
      },
      requestedById
    );

    // 5. Send webhooks
    await triggerWebhook("approval.created", {
      id: approvalId,
      projectId,
      projectName,
      requestedBy: requestedById,
      reviewerIds: reviewers.map((r) => r.id),
      dueDate,
    });
  } catch (error) {
    console.error("Error in onApprovalRequested:", error);
  }
}

/**
 * Example: Send email when approval is approved
 */
export async function onApprovalApproved(
  approvalId: string,
  projectId: string,
  projectName: string,
  requesterId: string,
  requesterEmail: string,
  requesterName: string,
  reviewerId: string,
  reviewerName: string,
  feedback?: string
) {
  try {
    // 1. Send email to requester
    await emailService.sendTemplateEmail({
      to: requesterEmail,
      template: "approvalApproved",
      data: {
        recipientName: requesterName,
        projectName,
        approvedBy: reviewerName,
        feedback,
        actionUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/projects/${projectId}?tab=approvals`,
      },
      subject: `Your approval for ${projectName} was approved`,
    });

    // 2. Create in-app notification
    await createNotification({
      userId: requesterId,
      type: "APPROVAL_APPROVED",
      message: `${reviewerName} approved your request for ${projectName}`,
      projectId,
      triggeredById: reviewerId,
      relatedEntityId: approvalId,
      relatedEntityType: "APPROVAL",
    });

    // 3. Log activity
    await logActivity({
      userId: reviewerId,
      projectId,
      entityType: "APPROVAL",
      entityId: approvalId,
      actionType: "APPROVED",
      metadata: {
        feedback,
      },
    });

    // 4. Trigger workflows
    await triggerWorkflow(
      "APPROVAL_APPROVED",
      {
        approvalId,
        projectId,
        projectName,
        requester: {
          id: requesterId,
          email: requesterEmail,
          name: requesterName,
        },
        reviewer: {
          id: reviewerId,
          name: reviewerName,
        },
        feedback,
      },
      reviewerId
    );

    // 5. Send webhooks
    await triggerWebhook("approval.approved", {
      id: approvalId,
      projectId,
      projectName,
      approvedBy: reviewerId,
      requesterId,
    });
  } catch (error) {
    console.error("Error in onApprovalApproved:", error);
  }
}

/**
 * Example: Send email when project status changes
 */
export async function onProjectStatusChanged(
  projectId: string,
  projectName: string,
  oldStatus: string,
  newStatus: string,
  leadStrategistId: string,
  leadStrategistEmail: string,
  leadStrategistName: string,
  changedById: string,
  changedByName: string
) {
  try {
    // 1. Send email
    await emailService.sendTemplateEmail({
      to: leadStrategistEmail,
      template: "projectStatusChanged",
      data: {
        recipientName: leadStrategistName,
        projectName,
        oldStatus,
        newStatus,
        changedBy: changedByName,
        actionUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/projects/${projectId}`,
      },
      subject: `${projectName} status changed to ${newStatus}`,
    });

    // 2. Create in-app notification
    await createNotification({
      userId: leadStrategistId,
      type: "PROJECT_STATUS_CHANGED",
      message: `${projectName} status changed to ${newStatus}`,
      projectId,
      triggeredById: changedById,
    });

    // 3. Log activity
    await logActivity({
      userId: changedById,
      projectId,
      entityType: "PROJECT",
      entityId: projectId,
      actionType: "STATUS_CHANGED",
      metadata: {
        oldStatus,
        newStatus,
      },
    });

    // 4. Trigger workflows
    await triggerWorkflow(
      "PROJECT_STATUS_CHANGED",
      {
        projectId,
        projectName,
        oldStatus,
        newStatus,
        project: {
          leadStrategist: {
            id: leadStrategistId,
            email: leadStrategistEmail,
            name: leadStrategistName,
          },
        },
        changedBy: {
          id: changedById,
          name: changedByName,
        },
      },
      changedById
    );

    // 5. Send webhooks
    await triggerWebhook(
      "project.status_changed",
      {
        id: projectId,
        name: projectName,
        status: newStatus,
        updatedBy: changedById,
      },
      {
        id: projectId,
        name: projectName,
        status: oldStatus,
      }
    );
  } catch (error) {
    console.error("Error in onProjectStatusChanged:", error);
  }
}

/**
 * Example: Send email when phase is completed
 */
export async function onPhaseCompleted(
  phaseId: string,
  phaseName: string,
  projectId: string,
  projectName: string,
  nextPhase: string | null,
  leadStrategistId: string,
  leadStrategistEmail: string,
  leadStrategistName: string,
  completedById: string
) {
  try {
    // 1. Send email
    await emailService.sendTemplateEmail({
      to: leadStrategistEmail,
      template: "phaseCompleted",
      data: {
        recipientName: leadStrategistName,
        projectName,
        phaseName,
        nextPhase,
        actionUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/projects/${projectId}`,
      },
      subject: `${phaseName} completed for ${projectName}`,
    });

    // 2. Create in-app notification
    await createNotification({
      userId: leadStrategistId,
      type: "PHASE_COMPLETED",
      message: `${phaseName} completed for ${projectName}`,
      projectId,
      triggeredById: completedById,
    });

    // 3. Log activity
    await logActivity({
      userId: completedById,
      projectId,
      entityType: "PHASE",
      entityId: phaseId,
      actionType: "COMPLETED",
      metadata: {
        phaseName,
        nextPhase,
      },
    });

    // 4. Trigger workflows
    await triggerWorkflow(
      "PHASE_COMPLETED",
      {
        phaseId,
        phaseName,
        projectId,
        projectName,
        nextPhase,
        project: {
          leadStrategist: {
            id: leadStrategistId,
            email: leadStrategistEmail,
            name: leadStrategistName,
          },
        },
      },
      completedById
    );

    // 5. Send webhooks
    await triggerWebhook("phase.completed", {
      id: phaseId,
      name: phaseName,
      projectId,
      projectName,
      completedBy: completedById,
    });
  } catch (error) {
    console.error("Error in onPhaseCompleted:", error);
  }
}
