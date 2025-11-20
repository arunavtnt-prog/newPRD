/**
 * Influencers API Routes
 *
 * Handles influencer creation and listing
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

const influencerSchema = z.object({
  name: z.string().min(1).max(200),
  platform: z.enum(["INSTAGRAM", "FACEBOOK", "TIKTOK", "TWITTER", "LINKEDIN", "PINTEREST", "YOUTUBE", "SNAPCHAT"]),
  handle: z.string().min(1).max(100),
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
    const validatedData = influencerSchema.parse(body);

    const influencer = await prisma.influencer.create({
      data: {
        projectId: projectId,
        ...validatedData,
        rate: validatedData.rate ? String(validatedData.rate) : null,
        engagementRate: validatedData.engagementRate ? String(validatedData.engagementRate) : null,
        contractDate: validatedData.contractDate ? new Date(validatedData.contractDate) : null,
        postDate: validatedData.postDate ? new Date(validatedData.postDate) : null,
      },
    });

    await prisma.activity.create({
      data: {
        projectId: projectId,
        userId: session.user.id,
        actionType: "INFLUENCER_ADDED",
        actionDescription: `Added influencer "${validatedData.name}"`,
        metadata: JSON.stringify({
          influencerId: influencer.id,
          platform: validatedData.platform,
        }),
      },
    });

    return NextResponse.json(influencer, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Error creating influencer:", error);
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

    const influencers = await prisma.influencer.findMany({
      where: { projectId: projectId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ influencers }, { status: 200 });
  } catch (error) {
    console.error("Error fetching influencers:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
