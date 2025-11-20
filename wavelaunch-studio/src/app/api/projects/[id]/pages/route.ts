/**
 * Website Pages API Routes
 *
 * Handles page creation and listing
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

const pageSchema = z.object({
  pageName: z.string().min(1).max(200),
  slug: z.string().min(1).max(200),
  pageType: z.enum(["HOME", "ABOUT", "PRODUCT", "COLLECTION", "CONTACT", "BLOG", "CUSTOM"]),
  metaTitle: z.string().nullable().optional(),
  metaDescription: z.string().nullable().optional(),
  isPublished: z.boolean().optional(),
});

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const projectId = params.id;

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
    const validatedData = pageSchema.parse(body);

    // Check if slug already exists
    const existingPage = await prisma.websitePage.findFirst({
      where: {
        projectId: projectId,
        slug: validatedData.slug,
      },
    });

    if (existingPage) {
      return NextResponse.json(
        { error: "A page with this slug already exists" },
        { status: 400 }
      );
    }

    // Create page
    const page = await prisma.websitePage.create({
      data: {
        projectId: projectId,
        ...validatedData,
      },
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
        actionType: "PAGE_CREATED",
        actionDescription: `Created page "${validatedData.pageName}"`,
        metadata: JSON.stringify({
          pageId: page.id,
          pageName: validatedData.pageName,
          slug: validatedData.slug,
        }),
      },
    });

    return NextResponse.json(page, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Error creating page:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const projectId = params.id;

    // Fetch pages
    const pages = await prisma.websitePage.findMany({
      where: { projectId: projectId },
      include: {
        sections: {
          orderBy: { orderIndex: "asc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ pages }, { status: 200 });
  } catch (error) {
    console.error("Error fetching pages:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
