/**
 * Approval Review API Route
 *
 * Handles reviewer responses (approve/request changes) for approval requests
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

// Validation schema
const reviewApprovalSchema = z.object({
  reviewerId: z.string(),
  status: z.enum(["APPROVED", "CHANGES_REQUESTED"]),
  feedbackText: z.string().max(500).optional().nullable(),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const approvalId = params.id;

    // Parse and validate request body
    const body = await request.json();
    const validatedData = reviewApprovalSchema.parse(body);

    // Verify the reviewer is the current user (security check)
    if (validatedData.reviewerId !== session.user.id) {
      return NextResponse.json(
        { error: "You can only submit your own review" },
        { status: 403 }
      );
    }

    // Verify approval exists and get project info
    const approval = await prisma.approval.findUnique({
      where: { id: approvalId },
      include: {
        project: {
          select: {
            id: true,
            projectName: true,
          },
        },
        reviewers: true,
        requestedBy: {
          select: {
            id: true,
            fullName: true,
          },
        },
      },
    });

    if (!approval) {
      return NextResponse.json(
        { error: "Approval not found" },
        { status: 404 }
      );
    }

    // Verify user is a reviewer on this approval
    const reviewerRecord = approval.reviewers.find(
      (r) => r.reviewerId === validatedData.reviewerId
    );

    if (!reviewerRecord) {
      return NextResponse.json(
        { error: "You are not a reviewer for this approval" },
        { status: 403 }
      );
    }

    // Check if already reviewed
    if (reviewerRecord.status !== "PENDING") {
      return NextResponse.json(
        { error: "You have already submitted your review" },
        { status: 400 }
      );
    }

    // Update reviewer status
    await prisma.approvalReviewer.update({
      where: { id: reviewerRecord.id },
      data: {
        status: validatedData.status,
        feedbackText: validatedData.feedbackText,
        reviewedAt: new Date(),
      },
    });

    // Get all reviewers to check if all have completed
    const allReviewers = await prisma.approvalReviewer.findMany({
      where: { approvalId: approvalId },
    });

    const allReviewsComplete = allReviewers.every(
      (r) => r.status !== "PENDING"
    );

    // Update overall approval status if all reviews are complete
    let overallStatus = approval.status;
    if (allReviewsComplete) {
      // If any reviewer requested changes, overall status is CHANGES_REQUESTED
      // Otherwise, if all approved, status is APPROVED
      const hasChangesRequested = allReviewers.some(
        (r) => r.status === "CHANGES_REQUESTED"
      );
      overallStatus = hasChangesRequested ? "CHANGES_REQUESTED" : "APPROVED";

      await prisma.approval.update({
        where: { id: approvalId },
        data: { status: overallStatus },
      });
    }

    // Create activity log
    await prisma.activity.create({
      data: {
        projectId: approval.projectId,
        userId: session.user.id,
        actionType:
          validatedData.status === "APPROVED"
            ? "APPROVAL_APPROVED"
            : "APPROVAL_CHANGES_REQUESTED",
        actionDescription:
          validatedData.status === "APPROVED"
            ? "Approved an approval request"
            : "Requested changes on an approval request",
        metadata: JSON.stringify({
          approvalId: approval.id,
          reviewerStatus: validatedData.status,
          overallStatus: overallStatus,
          allReviewsComplete: allReviewsComplete,
        }),
      },
    });

    // Create notification for the requester
    await prisma.notification.create({
      data: {
        userId: approval.requestedById,
        eventType:
          validatedData.status === "APPROVED"
            ? "APPROVAL_APPROVED"
            : "APPROVAL_CHANGES_REQUESTED",
        message:
          validatedData.status === "APPROVED"
            ? `${session.user.name} approved your request for ${approval.project.projectName}`
            : `${session.user.name} requested changes on your approval for ${approval.project.projectName}`,
        linkUrl: `/dashboard/projects/${approval.projectId}?tab=approvals`,
        projectId: approval.projectId,
      },
    });

    return NextResponse.json(
      {
        success: true,
        reviewerStatus: validatedData.status,
        overallStatus: overallStatus,
        allReviewsComplete: allReviewsComplete,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error submitting review:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
