/**
 * Copy Snippet Favorite API Route
 *
 * Handles snippet favorite toggle
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

const favoriteSchema = z.object({
  isFavorite: z.boolean(),
});

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

    // Parse and validate request body
    const body = await request.json();
    const { isFavorite } = favoriteSchema.parse(body);

    // Update snippet
    const snippet = await prisma.copySnippet.update({
      where: { id: snippetId },
      data: { isFavorite },
    });

    return NextResponse.json(snippet, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Error updating copy snippet favorite:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
