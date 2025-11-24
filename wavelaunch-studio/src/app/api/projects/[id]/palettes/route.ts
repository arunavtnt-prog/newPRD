/**
 * Color Palettes API Route
 *
 * Handles color palette creation and fetching for projects
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

// Validation schema
const createPaletteSchema = z.object({
  name: z.string().min(3).max(100),
  primaryColor: z.string().regex(/^#[0-9A-F]{6}$/i),
  secondaryColor: z.string().regex(/^#[0-9A-F]{6}$/i).optional().nullable(),
  accentColor: z.string().regex(/^#[0-9A-F]{6}$/i).optional().nullable(),
  neutralLight: z.string().regex(/^#[0-9A-F]{6}$/i).optional().nullable(),
  neutralDark: z.string().regex(/^#[0-9A-F]{6}$/i).optional().nullable(),
  backgroundColor: z.string().regex(/^#[0-9A-F]{6}$/i).optional().nullable(),
  textColor: z.string().regex(/^#[0-9A-F]{6}$/i).optional().nullable(),
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
    const validatedData = createPaletteSchema.parse(body);

    // Create color palette
    const palette = await prisma.colorPalette.create({
      data: {
        projectId: projectId,
        ...validatedData,
      },
    });

    // Create activity log
    await prisma.activity.create({
      data: {
        projectId: projectId,
        userId: session.user.id,
        actionType: "ASSET_GENERATED",
        actionDescription: `Created color palette "${validatedData.name}"`,
        metadata: JSON.stringify({
          paletteId: palette.id,
          paletteName: validatedData.name,
        }),
      },
    });

    return NextResponse.json(palette, { status: 201 });
  } catch (error) {
    console.error("Error creating palette:", error);

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
