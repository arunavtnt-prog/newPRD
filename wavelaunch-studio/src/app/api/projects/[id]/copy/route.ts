/**
 * Copy Snippets API Routes
 *
 * Handles copy snippet creation and listing
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

const copySnippetSchema = z.object({
  purpose: z.enum([
    "HOMEPAGE_HERO",
    "HOMEPAGE_SUBTITLE",
    "ABOUT_STORY",
    "PRODUCT_HEADLINE",
    "PRODUCT_DESCRIPTION",
    "PRODUCT_FEATURES",
    "CTA_BUTTON",
    "EMAIL_SUBJECT",
    "EMAIL_PREVIEW",
    "SOCIAL_CAPTION",
    "AD_HEADLINE",
    "AD_DESCRIPTION",
    "SEO_TITLE",
    "META_DESCRIPTION",
  ]),
  content: z.string().min(1),
  context: z.string().nullable().optional(),
  targetLength: z.number().int().nullable().optional(),
  generatedBy: z.string().nullable().optional(),
  prompt: z.string().nullable().optional(),
  variation: z.number().int().optional(),
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
    const validatedData = copySnippetSchema.parse(body);

    // Create copy snippet
    const snippet = await prisma.copySnippet.create({
      data: {
        projectId: projectId,
        ...validatedData,
      },
    });

    // Create activity log
    await prisma.activity.create({
      data: {
        projectId: projectId,
        userId: session.user.id,
        actionType: "COPY_CREATED",
        actionDescription: `Created ${validatedData.purpose.replace(/_/g, " ").toLowerCase()} copy`,
        metadata: JSON.stringify({
          snippetId: snippet.id,
          purpose: validatedData.purpose,
          generatedBy: validatedData.generatedBy,
        }),
      },
    });

    return NextResponse.json(snippet, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Error creating copy snippet:", error);
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

    // Fetch copy snippets
    const snippets = await prisma.copySnippet.findMany({
      where: { projectId: projectId },
      orderBy: [{ purpose: "asc" }, { createdAt: "desc" }],
    });

    return NextResponse.json({ snippets }, { status: 200 });
  } catch (error) {
    console.error("Error fetching copy snippets:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
