/**
 * Ad Creatives API Routes
 *
 * Handles ad creative creation and listing
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

const adCreativeSchema = z.object({
  adName: z.string().min(1).max(200),
  platform: z.enum(["FACEBOOK_ADS", "INSTAGRAM_ADS", "GOOGLE_ADS", "TIKTOK_ADS", "PINTEREST_ADS", "LINKEDIN_ADS", "SNAPCHAT_ADS", "TWITTER_ADS"]),
  adFormat: z.enum(["SINGLE_IMAGE", "CAROUSEL", "VIDEO", "COLLECTION", "STORIES", "REELS", "SHOPPING"]),
  campaignId: z.string().nullable().optional(),
  headline: z.string().nullable().optional(),
  primaryText: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  callToAction: z.string().nullable().optional(),
  variant: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
});

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const projectId = params.id;

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: { id: true, projectName: true },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const body = await request.json();
    const validatedData = adCreativeSchema.parse(body);

    const adCreative = await prisma.adCreative.create({
      data: {
        projectId: projectId,
        ...validatedData,
      },
    });

    await prisma.activity.create({
      data: {
        projectId: projectId,
        userId: session.user.id,
        actionType: "AD_CREATIVE_CREATED",
        actionDescription: `Created ad creative "${validatedData.adName}"`,
        metadata: JSON.stringify({
          adId: adCreative.id,
          platform: validatedData.platform,
        }),
      },
    });

    return NextResponse.json(adCreative, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Error creating ad creative:", error);
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
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const projectId = params.id;

    const adCreatives = await prisma.adCreative.findMany({
      where: { projectId: projectId },
      include: {
        campaign: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ adCreatives }, { status: 200 });
  } catch (error) {
    console.error("Error fetching ad creatives:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
