/**
 * Project Approvals API Route
 *
 * Handles approval request creation for projects
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

// Validation schema
const createApprovalSchema = z.object({
  message: z.string().min(10).max(500),
  dueDate: z
    .string()
    .optional()
    .transform((val) => (val ? new Date(val) : undefined)),
  reviewerIds: z.array(z.string()).min(1),
});

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{  id: string  }> }
) {
  const { id } = await params;
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const projectId = id;

    // Verify project exists and user has access
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: { id: true, projectName: true },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Parse and validate request body
    const body = await request.json();
    const validatedData = createApprovalSchema.parse(body);

    // Verify all reviewers exist
    const reviewers = await prisma.user.findMany({
      where: {
        id: { in: validatedData.reviewerIds },
        isActive: true,
      },
      select: { id: true, fullName: true, email: true },
    });

    if (reviewers.length !== validatedData.reviewerIds.length) {
      return NextResponse.json(
        { error: "One or more reviewers not found" },
        { status: 400 }
      );
    }

    // Create approval request with reviewers
    const approval = await prisma.approval.create({
      data: {
        projectId: projectId,
        requestedById: session.user.id,
        message: validatedData.message,
        dueDate: validatedData.dueDate,
        status: "PENDING",
        reviewers: {
          create: validatedData.reviewerIds.map((reviewerId) => ({
            reviewerId: reviewerId,
            status: "PENDING",
          })),
        },
      },
      include: {
        reviewers: {
          include: {
            reviewer: {
              select: {
                id: true,
                fullName: true,
                email: true,
              },
            },
          },
        },
      },
    });

    // Create activity log
    await prisma.activity.create({
      data: {
        projectId: projectId,
        userId: session.user.id,
        actionType: "APPROVAL_SUBMITTED",
        actionDescription: `Requested approval from ${reviewers.length} reviewer(s)`,
        metadata: JSON.stringify({
          approvalId: approval.id,
          reviewerCount: reviewers.length,
          reviewers: reviewers.map((r) => r.fullName),
        }),
      },
    });

    // Create notifications for each reviewer
    await Promise.all(
      reviewers.map((reviewer) =>
        prisma.notification.create({
          data: {
            userId: reviewer.id,
            eventType: "APPROVAL_REQUESTED",
            message: `New approval request for ${project.projectName}`,
            linkUrl: `/dashboard/projects/${projectId}?tab=approvals`,
            projectId: projectId,
          },
        })
      )
    );

    return NextResponse.json(approval, { status: 201 });
  } catch (error) {
    console.error("Error creating approval:", error);

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
