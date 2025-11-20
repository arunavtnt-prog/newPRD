/**
 * Bulk Operations API
 *
 * POST /api/bulk/projects - Bulk update projects
 * POST /api/bulk/approvals - Bulk update approvals
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { logActivity } from "@/lib/activity";
import { createBulkNotifications } from "@/lib/notifications";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { operation, projectIds, data } = body;

    if (!operation || !projectIds || !Array.isArray(projectIds) || projectIds.length === 0) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    let updatedCount = 0;

    switch (operation) {
      case "updateStatus": {
        if (!data?.status) {
          return NextResponse.json({ error: "Status required" }, { status: 400 });
        }

        await prisma.project.updateMany({
          where: { id: { in: projectIds } },
          data: { status: data.status },
        });

        // Log activity for each project
        const projects = await prisma.project.findMany({
          where: { id: { in: projectIds } },
          select: { id: true, projectName: true, leadStrategistId: true },
        });

        for (const project of projects) {
          await logActivity({
            userId: session.user.id,
            actionType: "STATUS_CHANGED",
            entityType: "PROJECT",
            entityId: project.id,
            description: `changed status of "${project.projectName}" to ${data.status}`,
            projectId: project.id,
            metadata: { newStatus: data.status },
          });

          // Notify lead strategist
          if (project.leadStrategistId && project.leadStrategistId !== session.user.id) {
            await createBulkNotifications([project.leadStrategistId], {
              type: "PROJECT_STATUS_CHANGED",
              title: "Project Status Updated",
              message: `${project.projectName} status changed to ${data.status}`,
              actionUrl: `/dashboard/projects/${project.id}`,
              triggeredById: session.user.id,
              relatedProjectId: project.id,
            });
          }
        }

        updatedCount = projectIds.length;
        break;
      }

      case "assignLead": {
        if (!data?.leadStrategistId) {
          return NextResponse.json({ error: "Lead strategist required" }, { status: 400 });
        }

        await prisma.project.updateMany({
          where: { id: { in: projectIds } },
          data: { leadStrategistId: data.leadStrategistId },
        });

        // Get lead strategist info
        const leadStrategist = await prisma.user.findUnique({
          where: { id: data.leadStrategistId },
          select: { fullName: true },
        });

        // Log activity and notify
        const projects = await prisma.project.findMany({
          where: { id: { in: projectIds } },
          select: { id: true, projectName: true },
        });

        for (const project of projects) {
          await logActivity({
            userId: session.user.id,
            actionType: "ASSIGNED",
            entityType: "PROJECT",
            entityId: project.id,
            description: `assigned "${project.projectName}" to ${leadStrategist?.fullName}`,
            projectId: project.id,
            metadata: { assignedTo: leadStrategist?.fullName },
          });
        }

        // Notify the assigned lead
        if (data.leadStrategistId !== session.user.id) {
          await createBulkNotifications([data.leadStrategistId], {
            type: "PROJECT_ASSIGNED",
            title: `${projectIds.length} Projects Assigned`,
            message: `You have been assigned ${projectIds.length} new project${projectIds.length > 1 ? 's' : ''}`,
            actionUrl: "/dashboard/projects",
            triggeredById: session.user.id,
          });
        }

        updatedCount = projectIds.length;
        break;
      }

      case "delete": {
        // Soft delete by archiving
        await prisma.project.updateMany({
          where: { id: { in: projectIds } },
          data: { status: "ARCHIVED" },
        });

        updatedCount = projectIds.length;
        break;
      }

      default:
        return NextResponse.json({ error: "Invalid operation" }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      updatedCount,
      message: `Successfully updated ${updatedCount} project${updatedCount !== 1 ? 's' : ''}`,
    });
  } catch (error) {
    console.error("Bulk operation error:", error);
    return NextResponse.json(
      { error: "Bulk operation failed" },
      { status: 500 }
    );
  }
}
