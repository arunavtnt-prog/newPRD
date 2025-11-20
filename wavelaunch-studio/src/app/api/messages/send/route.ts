/**
 * Send Message API Route
 * Handles sending messages from client to team
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { projectId, message } = body;

    if (!projectId || !message?.trim()) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Get project and verify access
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        leadStrategist: true,
      },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Verify client has access to this project
    if (
      session.user.role === "CLIENT" &&
      project.creatorEmail !== session.user.email
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Create message (stored as activity log for simplicity)
    const messageRecord = await prisma.activityLog.create({
      data: {
        userId: session.user.id,
        action: "MESSAGE_SENT",
        entity: "PROJECT",
        entityId: projectId,
        details: {
          message: message.trim(),
          projectName: project.projectName,
          senderRole: session.user.role,
        },
      },
    });

    // Create notification for lead strategist
    if (project.leadStrategist) {
      await prisma.notification.create({
        data: {
          userId: project.leadStrategist.id,
          type: "MESSAGE_RECEIVED",
          title: "New Message",
          message: `${session.user.fullName} sent you a message about ${project.projectName}`,
          link: `/dashboard/projects/${projectId}`,
          triggeredById: session.user.id,
        },
      });
    }

    return NextResponse.json(
      { success: true, message: messageRecord },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Send message error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
