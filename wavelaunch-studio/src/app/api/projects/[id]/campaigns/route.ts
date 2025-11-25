/**
 * Campaigns API Routes
 *
 * Handles campaign creation and listing
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

const campaignSchema = z.object({
  campaignName: z.string().min(1).max(200),
  campaignType: z.enum(["PRODUCT_LAUNCH", "BRAND_AWARENESS", "LEAD_GENERATION", "SALES_PROMOTION", "ENGAGEMENT", "RETARGETING"]),
  objective: z.string().nullable().optional(),
  budget: z.number().nullable().optional(),
  startDate: z.string().nullable().optional(),
  endDate: z.string().nullable().optional(),
  status: z.enum(["PLANNING", "READY", "ACTIVE", "PAUSED", "COMPLETED", "CANCELLED"]).optional(),
  notes: z.string().nullable().optional(),
});

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{  id: string  }> }
) {
  const { id } = await params;
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const projectId = id;

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: { id: true, projectName: true },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const body = await request.json();
    const validatedData = campaignSchema.parse(body);

    const campaign = await prisma.campaign.create({
      data: {
        projectId: projectId,
        ...validatedData,
        budget: validatedData.budget ? String(validatedData.budget) : null,
        startDate: validatedData.startDate ? new Date(validatedData.startDate) : null,
        endDate: validatedData.endDate ? new Date(validatedData.endDate) : null,
      },
    });

    await prisma.activity.create({
      data: {
        projectId: projectId,
        userId: session.user.id,
        actionType: "CAMPAIGN_CREATED",
        actionDescription: `Created campaign "${validatedData.campaignName}"`,
        metadata: JSON.stringify({
          campaignId: campaign.id,
          campaignType: validatedData.campaignType,
        }),
      },
    });

    return NextResponse.json(campaign, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Error creating campaign:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{  id: string  }> }
) {
  const { id } = await params;
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const projectId = id;

    const campaigns = await prisma.campaign.findMany({
      where: { projectId: projectId },
      include: {
        contentPosts: true,
        adCreatives: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ campaigns }, { status: 200 });
  } catch (error) {
    console.error("Error fetching campaigns:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
