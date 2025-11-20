/**
 * Influencer Detail API Routes
 *
 * Handles individual influencer operations
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

const influencerUpdateSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  platform: z.enum(["INSTAGRAM", "FACEBOOK", "TIKTOK", "TWITTER", "LINKEDIN", "PINTEREST", "YOUTUBE", "SNAPCHAT"]).optional(),
  handle: z.string().min(1).max(100).optional(),
  email: z.string().email().nullable().optional(),
  phone: z.string().nullable().optional(),
  followerCount: z.number().nullable().optional(),
  engagementRate: z.number().nullable().optional(),
  niche: z.string().nullable().optional(),
  status: z.enum(["PROSPECTING", "CONTACTED", "NEGOTIATING", "CONTRACTED", "CONTENT_PENDING", "POSTED", "COMPLETED", "DECLINED"]).optional(),
  partnershipType: z.enum(["GIFTED_PRODUCT", "PAID_POST", "AFFILIATE", "BRAND_AMBASSADOR", "EVENT_COLLABORATION"]).nullable().optional(),
  rate: z.number().nullable().optional(),
  currency: z.string().nullable().optional(),
  contractDate: z.string().nullable().optional(),
  postDate: z.string().nullable().optional(),
  trackingLink: z.string().nullable().optional(),
  impressions: z.number().nullable().optional(),
  clicks: z.number().nullable().optional(),
  conversions: z.number().nullable().optional(),
  notes: z.string().nullable().optional(),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string; influencerId: string } }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const projectId = params.id;
    const influencerId = params.influencerId;

    const existingInfluencer = await prisma.influencer.findFirst({
      where: {
        id: influencerId,
        projectId: projectId,
      },
    });

    if (!existingInfluencer) {
      return NextResponse.json({ error: "Influencer not found" }, { status: 404 });
    }

    const body = await request.json();
    const validatedData = influencerUpdateSchema.parse(body);

    const influencer = await prisma.influencer.update({
      where: { id: influencerId },
      data: {
        ...validatedData,
        rate: validatedData.rate !== undefined ? (validatedData.rate ? String(validatedData.rate) : null) : undefined,
        engagementRate: validatedData.engagementRate !== undefined ? (validatedData.engagementRate ? String(validatedData.engagementRate) : null) : undefined,
        contractDate: validatedData.contractDate ? new Date(validatedData.contractDate) : undefined,
        postDate: validatedData.postDate ? new Date(validatedData.postDate) : undefined,
      },
    });

    // Log status changes
    if (validatedData.status && validatedData.status !== existingInfluencer.status) {
      const actionMap: Record<string, string> = {
        CONTRACTED: "INFLUENCER_CONTRACTED",
        POSTED: "INFLUENCER_POSTED",
      };

      await prisma.activity.create({
        data: {
          projectId: projectId,
          userId: session.user.id,
          actionType: actionMap[validatedData.status] || "INFLUENCER_ADDED",
          actionDescription: `Updated influencer "${influencer.name}" status to ${validatedData.status}`,
          metadata: JSON.stringify({
            influencerId: influencer.id,
            oldStatus: existingInfluencer.status,
            newStatus: validatedData.status,
          }),
        },
      });
    }

    return NextResponse.json(influencer, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Error updating influencer:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; influencerId: string } }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const projectId = params.id;
    const influencerId = params.influencerId;

    const influencer = await prisma.influencer.findFirst({
      where: {
        id: influencerId,
        projectId: projectId,
      },
    });

    if (!influencer) {
      return NextResponse.json({ error: "Influencer not found" }, { status: 404 });
    }

    await prisma.influencer.delete({
      where: { id: influencerId },
    });

    await prisma.activity.create({
      data: {
        projectId: projectId,
        userId: session.user.id,
        actionType: "INFLUENCER_ADDED",
        actionDescription: `Removed influencer "${influencer.name}"`,
        metadata: JSON.stringify({
          influencerId: influencer.id,
        }),
      },
    });

    return NextResponse.json({ message: "Influencer deleted" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting influencer:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
