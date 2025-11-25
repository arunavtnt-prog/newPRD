/**
 * Logo Generation API
 *
 * Generates logo concepts using nanobanana API
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { projectId } = body;

    if (!projectId) {
      return NextResponse.json(
        { error: "Project ID is required" },
        { status: 400 }
      );
    }

    // Get project with discovery data
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        OR: [
          { leadStrategistId: session.user.id },
          {
            projectUsers: {
              some: {
                userId: session.user.id,
              },
            },
          },
        ],
      },
      include: {
        discovery: true,
      },
    });

    if (!project) {
      return NextResponse.json(
        { error: "Project not found or access denied" },
        { status: 404 }
      );
    }

    if (!project.discovery) {
      return NextResponse.json(
        { error: "Project must complete Discovery phase first" },
        { status: 400 }
      );
    }

    // Call nanobanana API for logo generation
    const logos = await generateLogosWithNanobanana(project, project.discovery);

    // Save generated logos as assets/files
    const savedLogos = await Promise.all(
      logos.map(async (logo, index) => {
        // Create file record
        const file = await prisma.file.create({
          data: {
            projectId: project.id,
            originalFilename: `logo-concept-${index + 1}.png`,
            fileType: "image/png",
            fileSize: logo.fileSize || 0,
            folder: "GeneratedLogos",
            downloadUrl: logo.url,
            uploadedById: session.user.id,
            isDeleted: false,
          },
        });

        // Create asset record
        const asset = await prisma.asset.create({
          data: {
            projectId: project.id,
            assetName: `Logo Concept ${index + 1}`,
            assetType: "LOGO",
            fileUrl: logo.url,
            status: "PENDING_REVIEW",
          },
        });

        return { file, asset };
      })
    );

    // Create activity log
    await prisma.activity.create({
      data: {
        projectId: project.id,
        userId: session.user.id,
        activityType: "ASSET_GENERATED",
        description: `Generated ${savedLogos.length} logo concept(s) using AI`,
      },
    });

    return NextResponse.json({
      success: true,
      logos: savedLogos.map((l) => ({
        id: l.asset.id,
        name: l.asset.assetName,
        url: l.asset.fileUrl,
        status: l.asset.status,
      })),
      message: `Generated ${savedLogos.length} logo concepts successfully`,
    });
  } catch (error) {
    console.error("Error generating logos:", error);
    return NextResponse.json(
      { error: "Failed to generate logos" },
      { status: 500 }
    );
  }
}

async function generateLogosWithNanobanana(
  project: any,
  discovery: any
): Promise<Array<{ url: string; fileSize?: number }>> {
  try {
    // In production, integrate with nanobanana API:
    // https://nanobanana.com/api/v1/generate

    // Build prompt from discovery data
    const brandName = project.projectName;
    const brandDescription = discovery.brandDescription || "";
    const aestheticKeywords = discovery.aestheticPreferences || "";
    const colorPreferences = discovery.primaryColors || "";

    // For now, return mock data
    // In production, make actual API call to nanobanana:
    /*
    const response = await fetch('https://api.nanobanana.com/v1/generate', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.NANOBANANA_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        brandName,
        brandDescription,
        aestheticKeywords,
        colorPreferences,
        numberOfConcepts: 4,
      }),
    });

    const data = await response.json();
    return data.logos;
    */

    // Mock response for development
    return [
      {
        url: `https://via.placeholder.com/512x512/667eea/ffffff?text=${encodeURIComponent(brandName)}+1`,
        fileSize: 45000,
      },
      {
        url: `https://via.placeholder.com/512x512/764ba2/ffffff?text=${encodeURIComponent(brandName)}+2`,
        fileSize: 42000,
      },
      {
        url: `https://via.placeholder.com/512x512/f093fb/ffffff?text=${encodeURIComponent(brandName)}+3`,
        fileSize: 48000,
      },
      {
        url: `https://via.placeholder.com/512x512/4facfe/ffffff?text=${encodeURIComponent(brandName)}+4`,
        fileSize: 43000,
      },
    ];
  } catch (error) {
    console.error("Error calling nanobanana API:", error);
    throw new Error("Failed to generate logos with nanobanana");
  }
}
