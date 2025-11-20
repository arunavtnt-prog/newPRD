/**
 * Typography API Routes
 *
 * Handles typography system creation and management
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

const typographySchema = z.object({
  name: z.string().min(3).max(100),
  primaryFontFamily: z.string().min(1).max(100),
  primaryFontWeights: z.string(),
  primaryFontSource: z.string().nullable().optional(),
  secondaryFontFamily: z.string().min(1).max(100),
  secondaryFontWeights: z.string(),
  secondaryFontSource: z.string().nullable().optional(),
  accentFontFamily: z.string().nullable().optional(),
  accentFontWeights: z.string().nullable().optional(),
  accentFontSource: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
});

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const projectId = params.id;

    // Verify project exists
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: { id: true, projectName: true },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Parse and validate request body
    const body = await request.json();
    const validatedData = typographySchema.parse(body);

    // Check if typography already exists
    const existingTypography = await prisma.typography.findUnique({
      where: { projectId: projectId },
    });

    let typography;

    if (existingTypography) {
      // Update existing typography
      typography = await prisma.typography.update({
        where: { projectId: projectId },
        data: {
          ...validatedData,
          isApproved: false, // Reset approval on update
        },
      });
    } else {
      // Create new typography
      typography = await prisma.typography.create({
        data: {
          projectId: projectId,
          ...validatedData,
        },
      });
    }

    // Create activity log
    await prisma.activity.create({
      data: {
        projectId: projectId,
        userId: session.user.id,
        actionType: existingTypography ? "ASSET_GENERATED" : "ASSET_GENERATED",
        actionDescription: existingTypography
          ? `Updated typography system "${validatedData.name}"`
          : `Created typography system "${validatedData.name}"`,
        metadata: JSON.stringify({
          typographyId: typography.id,
          primaryFont: validatedData.primaryFontFamily,
          secondaryFont: validatedData.secondaryFontFamily,
        }),
      },
    });

    return NextResponse.json(typography, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Error saving typography:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const projectId = params.id;

    // Fetch typography
    const typography = await prisma.typography.findUnique({
      where: { projectId: projectId },
    });

    return NextResponse.json({ typography }, { status: 200 });
  } catch (error) {
    console.error("Error fetching typography:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
