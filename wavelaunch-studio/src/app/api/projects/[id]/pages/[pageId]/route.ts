/**
 * Website Page Detail API Routes
 *
 * Handles individual page operations
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

const pageUpdateSchema = z.object({
  pageName: z.string().min(1).max(200).optional(),
  slug: z.string().min(1).max(200).optional(),
  pageType: z.enum(["HOME", "ABOUT", "PRODUCT", "COLLECTION", "CONTACT", "BLOG", "CUSTOM"]).optional(),
  metaTitle: z.string().nullable().optional(),
  metaDescription: z.string().nullable().optional(),
  isPublished: z.boolean().optional(),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{  id: string; pageId: string  }> }
) {
  const { id, pageId } = await params;
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const projectId = id;
    const pageId = pageId;

    // Verify page exists and belongs to project
    const existingPage = await prisma.websitePage.findFirst({
      where: {
        id: pageId,
        projectId: projectId,
      },
    });

    if (!existingPage) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 });
    }

    // Parse and validate request body
    const body = await request.json();
    const validatedData = pageUpdateSchema.parse(body);

    // If updating slug, check for conflicts
    if (validatedData.slug && validatedData.slug !== existingPage.slug) {
      const conflictingPage = await prisma.websitePage.findFirst({
        where: {
          projectId: projectId,
          slug: validatedData.slug,
          id: { not: pageId },
        },
      });

      if (conflictingPage) {
        return NextResponse.json(
          { error: "A page with this slug already exists" },
          { status: 400 }
        );
      }
    }

    // Update page
    const page = await prisma.websitePage.update({
      where: { id: pageId },
      data: validatedData,
      include: {
        sections: {
          orderBy: { orderIndex: "asc" },
        },
      },
    });

    // Create activity log
    await prisma.activity.create({
      data: {
        projectId: projectId,
        userId: session.user.id,
        actionType: "PAGE_UPDATED",
        actionDescription: `Updated page "${page.pageName}"`,
        metadata: JSON.stringify({
          pageId: page.id,
          updates: validatedData,
        }),
      },
    });

    return NextResponse.json(page, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Error updating page:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{  id: string; pageId: string  }> }
) {
  const { id, pageId } = await params;
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const projectId = id;
    const pageId = pageId;

    // Verify page exists and belongs to project
    const page = await prisma.websitePage.findFirst({
      where: {
        id: pageId,
        projectId: projectId,
      },
      include: {
        sections: true,
      },
    });

    if (!page) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 });
    }

    // Delete page (sections will be cascade deleted)
    await prisma.websitePage.delete({
      where: { id: pageId },
    });

    // Create activity log
    await prisma.activity.create({
      data: {
        projectId: projectId,
        userId: session.user.id,
        actionType: "PAGE_DELETED",
        actionDescription: `Deleted page "${page.pageName}"`,
        metadata: JSON.stringify({
          pageId: page.id,
          pageName: page.pageName,
        }),
      },
    });

    return NextResponse.json({ message: "Page deleted" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting page:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
