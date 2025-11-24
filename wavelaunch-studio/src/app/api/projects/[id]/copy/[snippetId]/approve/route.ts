/**
 * Copy Snippet Approve API Route
 *
 * Handles snippet approval
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{  id: string; snippetId: string  }> }
) {
  const { id, snippetId } = await params;
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const projectId = id;
    const snippetId = snippetId;

    // Verify snippet exists and belongs to project
    const existingSnippet = await prisma.copySnippet.findFirst({
      where: {
        id: snippetId,
        projectId: projectId,
      },
    });

    if (!existingSnippet) {
      return NextResponse.json({ error: "Snippet not found" }, { status: 404 });
    }

    // Update snippet
    const snippet = await prisma.copySnippet.update({
      where: { id: snippetId },
      data: { isApproved: true },
    });

    // Create activity log
    await prisma.activity.create({
      data: {
        projectId: projectId,
        userId: session.user.id,
        actionType: "COPY_APPROVED",
        actionDescription: `Approved ${snippet.purpose.replace(/_/g, " ").toLowerCase()} copy`,
        metadata: JSON.stringify({
          snippetId: snippet.id,
          purpose: snippet.purpose,
        }),
      },
    });

    return NextResponse.json(snippet, { status: 200 });
  } catch (error) {
    console.error("Error approving copy snippet:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
