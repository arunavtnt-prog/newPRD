/**
 * Typography Approve API Route
 *
 * Handles typography approval
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{  id: string; typographyId: string  }> }
) {
  const { id, typographyId } = await params;
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: projectId, typographyId } = params;

    // Fetch typography
    const typography = await prisma.typography.findUnique({
      where: { id: typographyId },
    });

    if (!typography) {
      return NextResponse.json(
        { error: "Typography not found" },
        { status: 404 }
      );
    }

    // Verify typography belongs to this project
    if (typography.projectId !== projectId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Update approval status
    const updatedTypography = await prisma.typography.update({
      where: { id: typographyId },
      data: { isApproved: true },
    });

    // Create activity log
    await prisma.activity.create({
      data: {
        projectId: projectId,
        userId: session.user.id,
        actionType: "ASSET_GENERATED",
        actionDescription: `Approved typography system "${typography.name}"`,
        metadata: JSON.stringify({
          typographyId: typography.id,
          primaryFont: typography.primaryFontFamily,
          secondaryFont: typography.secondaryFontFamily,
        }),
      },
    });

    return NextResponse.json(
      { success: true, typography: updatedTypography },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error approving typography:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
