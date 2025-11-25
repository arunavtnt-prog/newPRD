/**
 * Launch Task Detail API Routes
 *
 * Handles individual task operations
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

const launchTaskUpdateSchema = z.object({
  taskName: z.string().min(1).max(200).optional(),
  description: z.string().nullable().optional(),
  status: z.enum(["PENDING", "IN_PROGRESS", "COMPLETED", "BLOCKED", "CANCELLED"]).optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]).optional(),
  dueDate: z.string().nullable().optional(),
  completedDate: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{  id: string; taskId: string  }> }
) {
  const { id, taskId } = await params;
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const projectId = id;
    const taskId = taskId;

    const existingTask = await prisma.launchTask.findFirst({
      where: {
        id: taskId,
        projectId: projectId,
      },
    });

    if (!existingTask) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    const body = await request.json();
    const validatedData = launchTaskUpdateSchema.parse(body);

    const task = await prisma.launchTask.update({
      where: { id: taskId },
      data: {
        ...validatedData,
        dueDate: validatedData.dueDate ? new Date(validatedData.dueDate) : undefined,
        completedDate: validatedData.completedDate ? new Date(validatedData.completedDate) : null,
      },
    });

    if (validatedData.status === "COMPLETED") {
      await prisma.activity.create({
        data: {
          projectId: projectId,
          userId: session.user.id,
          actionType: "LAUNCH_TASK_COMPLETED",
          actionDescription: `Completed launch task "${task.taskName}"`,
          metadata: JSON.stringify({
            taskId: task.id,
          }),
        },
      });
    }

    return NextResponse.json(task, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Error updating launch task:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
