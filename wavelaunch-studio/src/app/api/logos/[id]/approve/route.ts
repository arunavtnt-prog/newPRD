/**
 * Logo Approve API Route
 *
 * Handles approving logo files
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const logoId = params.id;

    // Fetch logo file
    const logo = await prisma.file.findUnique({
      where: { id: logoId },
      include: {
        project: {
          select: {
            id: true,
            projectName: true,
          },
        },
      },
    });

    if (!logo) {
      return NextResponse.json({ error: "Logo not found" }, { status: 404 });
    }

    // Note: We'd need to add an isApproved field to File model
    // For now, we'll just create an activity log

    // Create activity log
    await prisma.activity.create({
      data: {
        projectId: logo.projectId,
        userId: session.user.id,
        actionType: "ASSET_GENERATED",
        actionDescription: `Approved logo "${logo.originalFilename}"`,
        metadata: JSON.stringify({
          logoId: logo.id,
          filename: logo.originalFilename,
          variation: logo.category,
        }),
      },
    });

    return NextResponse.json({ success: true, logo }, { status: 200 });
  } catch (error) {
    console.error("Error approving logo:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
