/**
 * Color Palette Approve API Route
 *
 * Handles approving color palettes
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function PATCH(
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

    const paletteId = id;

    // Fetch palette
    const palette = await prisma.colorPalette.findUnique({
      where: { id: paletteId },
      include: {
        project: {
          select: {
            id: true,
            projectName: true,
          },
        },
      },
    });

    if (!palette) {
      return NextResponse.json({ error: "Palette not found" }, { status: 404 });
    }

    // Update palette to approved
    const updatedPalette = await prisma.colorPalette.update({
      where: { id: paletteId },
      data: { isApproved: true },
    });

    // Create activity log
    await prisma.activity.create({
      data: {
        projectId: palette.projectId,
        userId: session.user.id,
        actionType: "ASSET_GENERATED",
        actionDescription: `Approved color palette "${palette.name}"`,
        metadata: JSON.stringify({
          paletteId: palette.id,
          paletteName: palette.name,
        }),
      },
    });

    return NextResponse.json(updatedPalette, { status: 200 });
  } catch (error) {
    console.error("Error approving palette:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
