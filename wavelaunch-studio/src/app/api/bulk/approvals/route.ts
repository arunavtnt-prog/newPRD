/**
 * Bulk Approvals API
 *
 * POST /api/bulk/approvals - Bulk approve or reject approvals
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { logActivity } from "@/lib/activity";
import { createNotification } from "@/lib/notifications";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { operation, approvalIds, data } = body;

    if (!operation || !approvalIds || !Array.isArray(approvalIds) || approvalIds.length === 0) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    let updatedCount = 0;

    switch (operation) {
      case "approve": {
        // Get all approvals with their reviewers
        const approvals = await prisma.approval.findMany({
          where: {
            id: { in: approvalIds },
          },
          include: {
            reviewers: true,
            project: {
              select: {
                id: true,
                projectName: true,
              },
            },
          },
        });

        for (const approval of approvals) {
          // Find the current user's reviewer record
          const userReviewer = approval.reviewers.find(
            (r) => r.reviewerId === session.user.id
          );

          if (!userReviewer) continue;

          // Update the reviewer status
          await prisma.approvalReviewer.update({
            where: { id: userReviewer.id },
            data: {
              status: "APPROVED",
              reviewedAt: new Date(),
              feedbackText: data?.feedback || null,
            },
          });

          // Check if all reviewers have responded
          const allReviewers = await prisma.approvalReviewer.findMany({
            where: { approvalId: approval.id },
          });

          const allApproved = allReviewers.every((r) => r.status === "APPROVED");
          const anyRejected = allReviewers.some((r) => r.status === "CHANGES_REQUESTED");

          // Update approval status if all reviewers responded
          if (allApproved) {
            await prisma.approval.update({
              where: { id: approval.id },
              data: { status: "APPROVED" },
            });

            // Notify project lead
            if (approval.requestedById !== session.user.id) {
              await createNotification({
                userId: approval.requestedById,
                type: "APPROVAL_APPROVED",
                title: "Approval Request Approved",
                message: `Your approval request for "${approval.project.projectName}" has been approved`,
                actionUrl: `/dashboard/projects/${approval.project.id}?tab=approvals`,
                triggeredById: session.user.id,
                relatedProjectId: approval.project.id,
                relatedApprovalId: approval.id,
              });
            }
          } else if (anyRejected) {
            await prisma.approval.update({
              where: { id: approval.id },
              data: { status: "CHANGES_REQUESTED" },
            });
          }

          // Log activity
          await logActivity({
            userId: session.user.id,
            actionType: "APPROVED",
            entityType: "APPROVAL",
            entityId: approval.id,
            description: `approved "${approval.message || 'approval request'}"`,
            projectId: approval.projectId,
          });

          updatedCount++;
        }

        break;
      }

      case "reject": {
        if (!data?.feedback) {
          return NextResponse.json(
            { error: "Feedback required for rejection" },
            { status: 400 }
          );
        }

        const approvals = await prisma.approval.findMany({
          where: {
            id: { in: approvalIds },
          },
          include: {
            reviewers: true,
            project: {
              select: {
                id: true,
                projectName: true,
              },
            },
          },
        });

        for (const approval of approvals) {
          const userReviewer = approval.reviewers.find(
            (r) => r.reviewerId === session.user.id
          );

          if (!userReviewer) continue;

          await prisma.approvalReviewer.update({
            where: { id: userReviewer.id },
            data: {
              status: "CHANGES_REQUESTED",
              reviewedAt: new Date(),
              feedbackText: data.feedback,
            },
          });

          // Update approval status
          await prisma.approval.update({
            where: { id: approval.id },
            data: { status: "CHANGES_REQUESTED" },
          });

          // Notify requester
          if (approval.requestedById !== session.user.id) {
            await createNotification({
              userId: approval.requestedById,
              type: "APPROVAL_CHANGES_REQUESTED",
              title: "Changes Requested",
              message: `Changes requested for "${approval.project.projectName}": ${data.feedback}`,
              actionUrl: `/dashboard/projects/${approval.project.id}?tab=approvals`,
              triggeredById: session.user.id,
              relatedProjectId: approval.project.id,
              relatedApprovalId: approval.id,
            });
          }

          // Log activity
          await logActivity({
            userId: session.user.id,
            actionType: "REJECTED",
            entityType: "APPROVAL",
            entityId: approval.id,
            description: `requested changes for "${approval.message || 'approval request'}"`,
            projectId: approval.projectId,
            metadata: { feedback: data.feedback },
          });

          updatedCount++;
        }

        break;
      }

      default:
        return NextResponse.json({ error: "Invalid operation" }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      updatedCount,
      message: `Successfully processed ${updatedCount} approval${updatedCount !== 1 ? 's' : ''}`,
    });
  } catch (error) {
    console.error("Bulk approval operation error:", error);
    return NextResponse.json(
      { error: "Bulk operation failed" },
      { status: 500 }
    );
  }
}
