/**
 * Copy Generation API Route
 *
 * Handles AI-powered copy generation
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

const generateSchema = z.object({
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
  context: z.string().min(1),
  targetLength: z.number().int().nullable().optional(),
  projectName: z.string(),
});

/**
 * Simple copy generation function
 * In production, this would integrate with an AI service like OpenAI
 */
function generateCopyVariations(
  purpose: string,
  context: string,
  projectName: string,
  targetLength: number
): string[] {
  // This is a placeholder implementation
  // In production, you would call an AI API here
  const purposeLabel = purpose.replace(/_/g, " ").toLowerCase();

  return [
    `${projectName}: Elevate Your Experience - ${context.slice(0, 50)}...`,
    `Discover ${projectName} - Where Innovation Meets Excellence`,
    `Transform Your World with ${projectName} - ${context.slice(0, 40)}...`,
  ];
}

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
    const validatedData = generateSchema.parse(body);

    // Generate copy variations
    const variations = generateCopyVariations(
      validatedData.purpose,
      validatedData.context,
      validatedData.projectName,
      validatedData.targetLength || 100
    );

    // Create copy snippets for each variation
    const snippets = await Promise.all(
      variations.map((content, index) =>
        prisma.copySnippet.create({
          data: {
            projectId: projectId,
            purpose: validatedData.purpose,
            content: content,
            context: validatedData.context,
            targetLength: validatedData.targetLength,
            generatedBy: "AI",
            prompt: `Generate ${validatedData.purpose} copy: ${validatedData.context}`,
            variation: index + 1,
          },
        })
      )
    );

    // Create activity log
    await prisma.activity.create({
      data: {
        projectId: projectId,
        userId: session.user.id,
        actionType: "COPY_GENERATED",
        actionDescription: `Generated ${variations.length} ${validatedData.purpose.replace(/_/g, " ").toLowerCase()} variations`,
        metadata: JSON.stringify({
          purpose: validatedData.purpose,
          variationCount: variations.length,
        }),
      },
    });

    return NextResponse.json({ snippets }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Error generating copy:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
