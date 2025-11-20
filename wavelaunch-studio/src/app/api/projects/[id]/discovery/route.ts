/**
 * Project Discovery API Route
 *
 * Handles saving discovery questionnaire data
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

// Validation schema matching the questionnaire
const discoverySchema = z.object({
  // Brand Basics
  brandVision: z.string().min(20).max(500),
  brandMission: z.string().min(20).max(500),
  brandValues: z.string().min(20).max(500),
  brandPersonality: z.string().min(20).max(300),

  // Product & Category
  productCategory: z.enum(["FASHION", "BEAUTY", "FITNESS", "LIFESTYLE", "OTHER"]),
  productDescription: z.string().min(20).max(500),
  productDifferentiators: z.string().min(20).max(500),
  pricePoint: z.enum(["BUDGET", "MID_RANGE", "PREMIUM", "LUXURY"]),

  // Audience
  targetAgeRange: z.string().min(3).max(50),
  targetGender: z.enum(["FEMALE", "MALE", "NON_BINARY", "ALL"]),
  targetIncome: z.enum([
    "UNDER_30K",
    "30K_50K",
    "50K_75K",
    "75K_100K",
    "OVER_100K",
  ]),
  targetLocation: z.string().min(3).max(200),
  audiencePainPoints: z.string().min(20).max(500),
  audienceAspirations: z.string().min(20).max(500),

  // Brand Voice & Aesthetic
  toneOfVoice: z.enum([
    "PLAYFUL",
    "SOPHISTICATED",
    "BOLD",
    "MINIMAL",
    "AUTHENTIC",
    "LUXURIOUS",
    "EDGY",
    "WARM",
  ]),
  aestheticDirection: z.string().min(20).max(500),
  colorPreferences: z.string().optional(),
  avoidColors: z.string().optional(),

  // Inspiration & Competition
  inspirationBrands: z.string().min(10).max(500),
  competitorBrands: z.string().min(10).max(500),
  differentiationStrategy: z.string().min(20).max(500),

  // Content & Marketing
  contentPillars: z.string().min(20).max(500),
  socialMediaFocus: z.string().min(10).max(300),
  launchGoals: z.string().min(20).max(500),

  // Additional
  mustHaveElements: z.string().optional(),
  avoidElements: z.string().optional(),
  additionalNotes: z.string().optional(),
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
    const validatedData = discoverySchema.parse(body);

    // Check if discovery data already exists
    const existingDiscovery = await prisma.discovery.findUnique({
      where: { projectId: projectId },
    });

    let discovery;

    if (existingDiscovery) {
      // Update existing discovery data
      discovery = await prisma.discovery.update({
        where: { projectId: projectId },
        data: {
          ...validatedData,
          updatedAt: new Date(),
        },
      });
    } else {
      // Create new discovery data
      discovery = await prisma.discovery.create({
        data: {
          projectId: projectId,
          ...validatedData,
        },
      });
    }

    // Create activity log
    await prisma.activity.create({
      data: {
        projectId: projectId,
        userId: session.user.id,
        actionType: existingDiscovery
          ? "DISCOVERY_UPDATED"
          : "DISCOVERY_COMPLETED",
        actionDescription: existingDiscovery
          ? "Updated brand discovery questionnaire"
          : "Completed brand discovery questionnaire",
        metadata: JSON.stringify({
          discoveryId: discovery.id,
          completedSections: 6,
        }),
      },
    });

    return NextResponse.json(discovery, { status: existingDiscovery ? 200 : 201 });
  } catch (error) {
    console.error("Error saving discovery data:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request data", details: error.errors },
        { status: 400 }
      );
    }

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

    // Fetch discovery data
    const discovery = await prisma.discovery.findUnique({
      where: { projectId: projectId },
    });

    if (!discovery) {
      return NextResponse.json(
        { error: "Discovery data not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(discovery, { status: 200 });
  } catch (error) {
    console.error("Error fetching discovery data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
