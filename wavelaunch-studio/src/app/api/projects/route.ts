/**
 * Projects API Route
 *
 * Handles project creation
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

// Validation schema
const createProjectSchema = z.object({
  projectName: z.string().min(3).max(100),
  creatorName: z.string().min(2).max(100),
  category: z.enum(["FASHION", "BEAUTY", "FITNESS", "LIFESTYLE", "OTHER"]),
  startDate: z.string().transform((val) => new Date(val)),
  expectedLaunchDate: z.string().transform((val) => new Date(val)),
  budget: z.number().optional(),
  description: z.string().optional(),
  leadStrategistId: z.string(),
});

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only admins and team members can create projects
    if (!["ADMIN", "TEAM_MEMBER"].includes(session.user.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Parse and validate request body
    const body = await request.json();
    const validatedData = createProjectSchema.parse(body);

    // Verify lead strategist exists
    const leadStrategist = await prisma.user.findUnique({
      where: { id: validatedData.leadStrategistId },
    });

    if (!leadStrategist) {
      return NextResponse.json(
        { error: "Lead strategist not found" },
        { status: 400 }
      );
    }

    // Create project with initial phase (M0: Onboarding)
    const project = await prisma.project.create({
      data: {
        projectName: validatedData.projectName,
        creatorName: validatedData.creatorName,
        category: validatedData.category,
        startDate: validatedData.startDate,
        expectedLaunchDate: validatedData.expectedLaunchDate,
        budget: validatedData.budget,
        description: validatedData.description,
        leadStrategistId: validatedData.leadStrategistId,
        status: "ONBOARDING",
        phases: {
          create: {
            phaseName: "M0: Onboarding",
            phaseOrder: 0,
            status: "IN_PROGRESS",
            startDate: new Date(),
            checklistItems: JSON.stringify([
              {
                id: "1",
                title: "Initial creator meeting scheduled",
                required: true,
                completed: false,
              },
              {
                id: "2",
                title: "NDA signed",
                required: true,
                completed: false,
              },
              {
                id: "3",
                title: "Project timeline shared",
                required: true,
                completed: false,
              },
              {
                id: "4",
                title: "Brand questionnaire sent",
                required: true,
                completed: false,
              },
            ]),
          },
        },
      },
      include: {
        leadStrategist: {
          select: {
            id: true,
            fullName: true,
            email: true,
          },
        },
        phases: true,
      },
    });

    // Create activity log
    await prisma.activity.create({
      data: {
        projectId: project.id,
        userId: session.user.id,
        actionType: "PROJECT_CREATED",
        actionDescription: `Created project "${project.projectName}"`,
        metadata: JSON.stringify({
          category: project.category,
          creatorName: project.creatorName,
        }),
      },
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error("Error creating project:", error);

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
