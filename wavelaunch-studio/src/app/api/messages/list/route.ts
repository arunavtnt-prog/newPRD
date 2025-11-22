/**
 * List Messages API Route
 * Retrieves message history for the authenticated user
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let whereClause: any;

    if (session.user.role === "CLIENT") {
      // Get messages from projects the client is involved in
      whereClause = {
        action: "MESSAGE_SENT",
        entity: "PROJECT",
        OR: [
          { userId: session.user.id }, // Messages sent by client
          {
            // Messages in client's projects
            entityId: {
              in: (
                await prisma.project.findMany({
                  where: { creatorEmail: session.user.email },
                  select: { id: true },
                })
              ).map((p) => p.id),
            },
          },
        ],
      };
    } else {
      // For team members, get messages from projects they're assigned to
      whereClause = {
        action: "MESSAGE_SENT",
        entity: "PROJECT",
        OR: [
          { userId: session.user.id }, // Messages sent by user
          {
            // Messages in projects user leads
            entityId: {
              in: (
                await prisma.project.findMany({
                  where: { leadStrategistId: session.user.id },
                  select: { id: true },
                })
              ).map((p) => p.id),
            },
          },
        ],
      };
    }

    const messages = await prisma.activityLog.findMany({
      where: whereClause,
      orderBy: { createdAt: "asc" },
      take: 100,
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            avatarUrl: true,
          },
        },
      },
    });

    // Format messages
    const formattedMessages = messages.map((msg) => ({
      id: msg.id,
      message: (msg.details as any)?.message || "",
      createdAt: msg.createdAt.toISOString(),
      sender: msg.user,
      project: {
        id: msg.entityId,
        projectName: (msg.details as any)?.projectName || "Unknown Project",
      },
      isFromClient: msg.userId === session.user.id,
    }));

    return NextResponse.json(
      { messages: formattedMessages },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("List messages error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
