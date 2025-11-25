/**
 * Save Favorite Brand Names API
 *
 * Saves user's favorite name suggestions to the project
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
    const { projectId, favorites } = body;

    if (!projectId || !favorites || !Array.isArray(favorites)) {
      return NextResponse.json(
        { error: "Project ID and favorites array are required" },
        { status: 400 }
      );
    }

    // Check if user has access to this project
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
    });

    if (!project) {
      return NextResponse.json(
        { error: "Project not found or access denied" },
        { status: 404 }
      );
    }

    // Get or create Discovery record
    let discovery = await prisma.discovery.findUnique({
      where: { projectId },
    });

    if (!discovery) {
      discovery = await prisma.discovery.create({
        data: {
          projectId,
          brandNameIdeas: JSON.stringify(favorites),
        },
      });
    } else {
      // Update existing discovery with new favorites
      // Merge with existing favorites if any
      const existingFavorites = discovery.brandNameIdeas
        ? JSON.parse(discovery.brandNameIdeas as string)
        : [];

      const mergedFavorites = [
        ...new Set([...existingFavorites, ...favorites]),
      ];

      discovery = await prisma.discovery.update({
        where: { projectId },
        data: {
          brandNameIdeas: JSON.stringify(mergedFavorites),
        },
      });
    }

    // Create activity log
    await prisma.activity.create({
      data: {
        projectId,
        userId: session.user.id,
        activityType: "DISCOVERY_UPDATE",
        description: `Saved ${favorites.length} favorite brand name(s): ${favorites.join(", ")}`,
      },
    });

    return NextResponse.json({
      success: true,
      favorites: JSON.parse(discovery.brandNameIdeas as string),
    });
  } catch (error) {
    console.error("Error saving favorite names:", error);
    return NextResponse.json(
      { error: "Failed to save favorites" },
      { status: 500 }
    );
  }
}
