/**
 * Website Configuration API Routes
 *
 * Handles website config creation and retrieval
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

const websiteConfigSchema = z.object({
  themeName: z.string().nullable().optional(),
  themePreview: z.string().nullable().optional(),
  primaryColor: z.string().nullable().optional(),
  fontPrimary: z.string().nullable().optional(),
  fontSecondary: z.string().nullable().optional(),
  domain: z.string().nullable().optional(),
  metaTitle: z.string().nullable().optional(),
  metaDescription: z.string().nullable().optional(),
  platform: z.enum(["SHOPIFY", "WEBFLOW", "WORDPRESS", "CUSTOM"]).nullable().optional(),
  platformUrl: z.string().nullable().optional(),
  status: z.enum(["PLANNING", "IN_DESIGN", "IN_DEVELOPMENT", "STAGING", "LIVE"]).nullable().optional(),
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
    const validatedData = websiteConfigSchema.parse(body);

    // Upsert website config
    const websiteConfig = await prisma.websiteConfig.upsert({
      where: { projectId: projectId },
      update: validatedData,
      create: {
        projectId: projectId,
        ...validatedData,
      },
    });

    // Create activity log
    await prisma.activity.create({
      data: {
        projectId: projectId,
        userId: session.user.id,
        actionType: "WEBSITE_CONFIG_UPDATED",
        actionDescription: `Updated website configuration`,
        metadata: JSON.stringify({
          themeName: validatedData.themeName,
          platform: validatedData.platform,
        }),
      },
    });

    return NextResponse.json(websiteConfig, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Error saving website config:", error);
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

    // Fetch website config
    const websiteConfig = await prisma.websiteConfig.findUnique({
      where: { projectId: projectId },
    });

    return NextResponse.json({ websiteConfig }, { status: 200 });
  } catch (error) {
    console.error("Error fetching website config:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
