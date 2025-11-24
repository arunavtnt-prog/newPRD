/**
 * Campaign Detail API Routes
 *
 * Handles individual campaign operations
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

const campaignUpdateSchema = z.object({
  campaignName: z.string().min(1).max(200).optional(),
  campaignType: z.enum(["PRODUCT_LAUNCH", "BRAND_AWARENESS", "LEAD_GENERATION", "SALES_PROMOTION", "ENGAGEMENT", "RETARGETING"]).optional(),
  objective: z.string().nullable().optional(),
  budget: z.number().nullable().optional(),
  startDate: z.string().nullable().optional(),
  endDate: z.string().nullable().optional(),
  status: z.enum(["PLANNING", "READY", "ACTIVE", "PAUSED", "COMPLETED", "CANCELLED"]).optional(),
  impressions: z.number().nullable().optional(),
  clicks: z.number().nullable().optional(),
  conversions: z.number().nullable().optional(),
  spend: z.number().nullable().optional(),
  notes: z.string().nullable().optional(),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{  id: string; campaignId: string  }> }
) {
  const { id, campaignId } = await params;
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const projectId = id;
    const campaignId = campaignId;

    const existingCampaign = await prisma.campaign.findFirst({
      where: {
        id: campaignId,
        projectId: projectId,
      },
    });

    if (!existingCampaign) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
    }

    const body = await request.json();
    const validatedData = campaignUpdateSchema.parse(body);

    const campaign = await prisma.campaign.update({
      where: { id: campaignId },
      data: {
        ...validatedData,
        budget: validatedData.budget !== undefined ? (validatedData.budget ? String(validatedData.budget) : null) : undefined,
        spend: validatedData.spend !== undefined ? (validatedData.spend ? String(validatedData.spend) : null) : undefined,
        startDate: validatedData.startDate ? new Date(validatedData.startDate) : undefined,
        endDate: validatedData.endDate ? new Date(validatedData.endDate) : undefined,
      },
    });

    await prisma.activity.create({
      data: {
        projectId: projectId,
        userId: session.user.id,
        actionType: "CAMPAIGN_UPDATED",
        actionDescription: `Updated campaign "${campaign.campaignName}"`,
        metadata: JSON.stringify({
          campaignId: campaign.id,
        }),
      },
    });

    return NextResponse.json(campaign, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Error updating campaign:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{  id: string; campaignId: string  }> }
) {
  const { id, campaignId } = await params;
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const projectId = id;
    const campaignId = campaignId;

    const campaign = await prisma.campaign.findFirst({
      where: {
        id: campaignId,
        projectId: projectId,
      },
      include: {
        contentPosts: true,
        adCreatives: true,
      },
    });

    if (!campaign) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
    }

    if (campaign.contentPosts.length > 0 || campaign.adCreatives.length > 0) {
      return NextResponse.json(
        { error: "Cannot delete campaign with associated content or ads. Please unlink them first." },
        { status: 400 }
      );
    }

    await prisma.campaign.delete({
      where: { id: campaignId },
    });

    await prisma.activity.create({
      data: {
        projectId: projectId,
        userId: session.user.id,
        actionType: "CAMPAIGN_UPDATED",
        actionDescription: `Deleted campaign "${campaign.campaignName}"`,
        metadata: JSON.stringify({
          campaignId: campaign.id,
        }),
      },
    });

    return NextResponse.json({ message: "Campaign deleted" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting campaign:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
