/**
 * Page Section Detail API Routes
 *
 * Handles individual section operations
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

const sectionUpdateSchema = z.object({
  sectionName: z.string().min(1).max(200).optional(),
  sectionType: z.enum([
    "HERO",
    "FEATURES",
    "PRODUCT_GRID",
    "TESTIMONIALS",
    "CTA",
    "FAQ",
    "ABOUT_STORY",
    "GALLERY",
    "CONTACT_FORM",
    "CUSTOM_HTML",
  ]).optional(),
  orderIndex: z.number().int().min(0).optional(),
  content: z.string().nullable().optional(),
  isVisible: z.boolean().optional(),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string; pageId: string; sectionId: string } }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const projectId = params.id;
    const pageId = params.pageId;
    const sectionId = params.sectionId;

    // Verify section exists
    const existingSection = await prisma.pageSection.findFirst({
      where: {
        id: sectionId,
        pageId: pageId,
        page: {
          projectId: projectId,
        },
      },
      include: {
        page: true,
      },
    });

    if (!existingSection) {
      return NextResponse.json({ error: "Section not found" }, { status: 404 });
    }

    const body = await request.json();
    const validatedData = sectionUpdateSchema.parse(body);

    const section = await prisma.pageSection.update({
      where: { id: sectionId },
      data: validatedData,
    });

    await prisma.activity.create({
      data: {
        projectId: projectId,
        userId: session.user.id,
        actionType: "SECTION_UPDATED",
        actionDescription: `Updated section "${section.sectionName}" on page "${existingSection.page.pageName}"`,
        metadata: JSON.stringify({
          pageId: pageId,
          sectionId: section.id,
        }),
      },
    });

    return NextResponse.json(section, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Error updating section:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; pageId: string; sectionId: string } }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const projectId = params.id;
    const pageId = params.pageId;
    const sectionId = params.sectionId;

    const existingSection = await prisma.pageSection.findFirst({
      where: {
        id: sectionId,
        pageId: pageId,
        page: {
          projectId: projectId,
        },
      },
      include: {
        page: true,
      },
    });

    if (!existingSection) {
      return NextResponse.json({ error: "Section not found" }, { status: 404 });
    }

    await prisma.pageSection.delete({
      where: { id: sectionId },
    });

    await prisma.activity.create({
      data: {
        projectId: projectId,
        userId: session.user.id,
        actionType: "SECTION_DELETED",
        actionDescription: `Deleted section "${existingSection.sectionName}" from page "${existingSection.page.pageName}"`,
        metadata: JSON.stringify({
          pageId: pageId,
          sectionId: sectionId,
        }),
      },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error deleting section:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
