/**
 * Activity Feed API Routes
 *
 * GET /api/activity - Get activity feed with filters
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "50");
    const projectId = searchParams.get("projectId");
    const entityType = searchParams.get("entityType");
    const actionType = searchParams.get("actionType");

    const activities = await prisma.activityLog.findMany({
      where: {
        ...(projectId && { projectId }),
        ...(entityType && { entityType }),
        ...(actionType && { actionType }),
      },
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            avatarUrl: true,
          },
        },
        project: {
          select: {
            id: true,
            projectName: true,
          },
        },
      },
    });

    return NextResponse.json({ activities });
  } catch (error) {
    console.error("Error fetching activity:", error);
    return NextResponse.json(
      { error: "Failed to fetch activity" },
      { status: 500 }
    );
  }
}
