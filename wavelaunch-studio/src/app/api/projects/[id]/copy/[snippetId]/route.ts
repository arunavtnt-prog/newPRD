/**
 * Copy Snippet Detail API Routes
 *
 * Handles individual snippet operations
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function DELETE(
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
    const snippet = await prisma.copySnippet.findFirst({
      where: {
        id: snippetId,
        projectId: projectId,
      },
    });

    if (!snippet) {
      return NextResponse.json({ error: "Snippet not found" }, { status: 404 });
    }

    // Delete snippet
    await prisma.copySnippet.delete({
      where: { id: snippetId },
    });

    // Create activity log
    await prisma.activity.create({
      data: {
        projectId: projectId,
        userId: session.user.id,
        actionType: "COPY_DELETED",
        actionDescription: `Deleted ${snippet.purpose.replace(/_/g, " ").toLowerCase()} copy`,
        metadata: JSON.stringify({
          snippetId: snippet.id,
          purpose: snippet.purpose,
        }),
      },
    });

    return NextResponse.json({ message: "Snippet deleted" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting copy snippet:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
