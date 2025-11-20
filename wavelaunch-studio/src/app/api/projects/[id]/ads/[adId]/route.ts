/**
 * Ad Creative Detail API Routes
 *
 * Handles individual ad creative operations
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

const adCreativeUpdateSchema = z.object({
  adName: z.string().min(1).max(200).optional(),
  platform: z.enum(["FACEBOOK_ADS", "INSTAGRAM_ADS", "GOOGLE_ADS", "TIKTOK_ADS", "PINTEREST_ADS"]).optional(),
  adFormat: z.enum(["SINGLE_IMAGE", "CAROUSEL", "VIDEO", "COLLECTION", "STORIES", "REELS"]).optional(),
  campaignId: z.string().nullable().optional(),
  headline: z.string().nullable().optional(),
  primaryText: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  callToAction: z.string().nullable().optional(),
  variant: z.string().nullable().optional(),
  status: z.enum(["DRAFT", "ACTIVE", "PAUSED", "COMPLETED"]).optional(),
  notes: z.string().nullable().optional(),
  impressions: z.number().nullable().optional(),
  clicks: z.number().nullable().optional(),
  conversions: z.number().nullable().optional(),
  spend: z.number().nullable().optional(),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string; adId: string } }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const projectId = params.id;
    const adId = params.adId;

    const existingAd = await prisma.adCreative.findFirst({
      where: {
        id: adId,
        projectId: projectId,
      },
    });

    if (!existingAd) {
      return NextResponse.json({ error: "Ad creative not found" }, { status: 404 });
    }

    const body = await request.json();
    const validatedData = adCreativeUpdateSchema.parse(body);

    const adCreative = await prisma.adCreative.update({
      where: { id: adId },
      data: {
        ...validatedData,
        spend: validatedData.spend ? String(validatedData.spend) : undefined,
      },
    });

    await prisma.activity.create({
      data: {
        projectId: projectId,
        userId: session.user.id,
        actionType: "AD_CREATIVE_UPDATED",
        actionDescription: `Updated ad creative "${adCreative.adName}"`,
        metadata: JSON.stringify({
          adId: adCreative.id,
        }),
      },
    });

    return NextResponse.json(adCreative, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Error updating ad creative:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; adId: string } }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const projectId = params.id;
    const adId = params.adId;

    const existingAd = await prisma.adCreative.findFirst({
      where: {
        id: adId,
        projectId: projectId,
      },
    });

    if (!existingAd) {
      return NextResponse.json({ error: "Ad creative not found" }, { status: 404 });
    }

    await prisma.adCreative.delete({
      where: { id: adId },
    });

    await prisma.activity.create({
      data: {
        projectId: projectId,
        userId: session.user.id,
        actionType: "AD_CREATIVE_DELETED",
        actionDescription: `Deleted ad creative "${existingAd.adName}"`,
        metadata: JSON.stringify({
          adId: adId,
        }),
      },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error deleting ad creative:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
