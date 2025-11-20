/**
 * Content Posts API Routes
 *
 * Handles content post creation and listing
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

const contentPostSchema = z.object({
  postTitle: z.string().min(1).max(200),
  postContent: z.string().min(1),
  platform: z.enum(["INSTAGRAM", "FACEBOOK", "TIKTOK", "TWITTER", "LINKEDIN", "PINTEREST", "YOUTUBE", "SNAPCHAT"]),
  postType: z.enum(["PHOTO", "VIDEO", "CAROUSEL", "STORY", "REEL", "THREAD", "LIVE", "ARTICLE"]),
  campaignId: z.string().nullable().optional(),
  scheduledDate: z.string().nullable().optional(),
  status: z.enum(["DRAFT", "SCHEDULED", "PUBLISHED", "FAILED", "ARCHIVED"]).optional(),
  hashtags: z.string().nullable().optional(),
  taggedAccounts: z.string().nullable().optional(),
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
    const validatedData = contentPostSchema.parse(body);

    const contentPost = await prisma.contentPost.create({
      data: {
        projectId: projectId,
        ...validatedData,
        scheduledDate: validatedData.scheduledDate ? new Date(validatedData.scheduledDate) : null,
      },
    });

    await prisma.activity.create({
      data: {
        projectId: projectId,
        userId: session.user.id,
        actionType: validatedData.scheduledDate ? "CONTENT_POST_SCHEDULED" : "CONTENT_POST_CREATED",
        actionDescription: `${validatedData.scheduledDate ? "Scheduled" : "Created"} content post "${validatedData.postTitle}"`,
        metadata: JSON.stringify({
          postId: contentPost.id,
          platform: validatedData.platform,
        }),
      },
    });

    return NextResponse.json(contentPost, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Error creating content post:", error);
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

    const contentPosts = await prisma.contentPost.findMany({
      where: { projectId: projectId },
      include: {
        campaign: true,
      },
      orderBy: { scheduledDate: "desc" },
    });

    return NextResponse.json({ contentPosts }, { status: 200 });
  } catch (error) {
    console.error("Error fetching content posts:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
