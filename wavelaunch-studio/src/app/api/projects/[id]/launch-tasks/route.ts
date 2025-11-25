/**
 * Launch Tasks API Routes
 *
 * Handles launch checklist task creation and listing
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

const launchTaskSchema = z.object({
  taskName: z.string().min(1).max(200),
  description: z.string().nullable().optional(),
  category: z.enum(["WEBSITE", "INVENTORY", "MARKETING", "LEGAL", "LOGISTICS", "CUSTOMER_SERVICE", "PAYMENT_SETUP", "ANALYTICS", "OTHER"]),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]).optional(),
  dueDate: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
});

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{  id: string  }> }
) {
  const { id } = await params;
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const projectId = id;

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: { id: true, projectName: true },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const body = await request.json();
    const validatedData = launchTaskSchema.parse(body);

    const launchTask = await prisma.launchTask.create({
      data: {
        projectId: projectId,
        ...validatedData,
        dueDate: validatedData.dueDate ? new Date(validatedData.dueDate) : null,
      },
    });

    await prisma.activity.create({
      data: {
        projectId: projectId,
        userId: session.user.id,
        actionType: "LAUNCH_TASK_CREATED",
        actionDescription: `Created launch task "${validatedData.taskName}"`,
        metadata: JSON.stringify({
          taskId: launchTask.id,
          category: validatedData.category,
        }),
      },
    });

    return NextResponse.json(launchTask, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Error creating launch task:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{  id: string  }> }
) {
  const { id } = await params;
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const projectId = id;

    const launchTasks = await prisma.launchTask.findMany({
      where: { projectId: projectId },
      orderBy: [{ priority: "desc" }, { dueDate: "asc" }],
    });

    return NextResponse.json({ launchTasks }, { status: 200 });
  } catch (error) {
    console.error("Error fetching launch tasks:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
