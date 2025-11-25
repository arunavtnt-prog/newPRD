/**
 * Page Sections API Routes
 *
 * Handles section creation for pages
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

const sectionSchema = z.object({
  sectionName: z.string().min(1).max(200),
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
  ]),
  orderIndex: z.number().int().min(0),
  content: z.string().optional(),
  isVisible: z.boolean().optional(),
});

export async function POST(
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
    });

    if (!page) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 });
    }

    // Parse and validate request body
    const body = await request.json();
    const validatedData = sectionSchema.parse(body);

    // Create section
    const section = await prisma.pageSection.create({
      data: {
        pageId: pageId,
        ...validatedData,
      },
    });

    // Create activity log
    await prisma.activity.create({
      data: {
        projectId: projectId,
        userId: session.user.id,
        actionType: "SECTION_CREATED",
        actionDescription: `Added section "${validatedData.sectionName}" to page "${page.pageName}"`,
        metadata: JSON.stringify({
          pageId: page.id,
          sectionId: section.id,
          sectionName: validatedData.sectionName,
        }),
      },
    });

    return NextResponse.json(section, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Error creating section:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
