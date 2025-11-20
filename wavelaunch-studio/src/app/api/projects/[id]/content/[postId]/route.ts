/**
 * Content Post Detail API Routes
 *
 * Handles individual post operations
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

const contentPostUpdateSchema = z.object({
  postTitle: z.string().min(1).max(200).optional(),
  postContent: z.string().min(1).optional(),
  platform: z.enum(["INSTAGRAM", "FACEBOOK", "TIKTOK", "TWITTER", "LINKEDIN", "PINTEREST", "YOUTUBE", "SNAPCHAT"]).optional(),
  postType: z.enum(["PHOTO", "VIDEO", "CAROUSEL", "STORY", "REEL", "THREAD", "LIVE", "ARTICLE"]).optional(),
  scheduledDate: z.string().nullable().optional(),
  status: z.enum(["DRAFT", "SCHEDULED", "PUBLISHED", "FAILED", "ARCHIVED"]).optional(),
  hashtags: z.string().nullable().optional(),
  taggedAccounts: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string; postId: string } }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const projectId = params.id;
    const postId = params.postId;

    const existingPost = await prisma.contentPost.findFirst({
      where: {
        id: postId,
        projectId: projectId,
      },
    });

    if (!existingPost) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const body = await request.json();
    const validatedData = contentPostUpdateSchema.parse(body);

    const post = await prisma.contentPost.update({
      where: { id: postId },
      data: {
        ...validatedData,
        scheduledDate: validatedData.scheduledDate ? new Date(validatedData.scheduledDate) : undefined,
      },
    });

    await prisma.activity.create({
      data: {
        projectId: projectId,
        userId: session.user.id,
        actionType: "CONTENT_POST_UPDATED",
        actionDescription: `Updated content post "${post.postTitle}"`,
        metadata: JSON.stringify({
          postId: post.id,
        }),
      },
    });

    return NextResponse.json(post, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Error updating content post:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; postId: string } }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const projectId = params.id;
    const postId = params.postId;

    const post = await prisma.contentPost.findFirst({
      where: {
        id: postId,
        projectId: projectId,
      },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    await prisma.contentPost.delete({
      where: { id: postId },
    });

    await prisma.activity.create({
      data: {
        projectId: projectId,
        userId: session.user.id,
        actionType: "CONTENT_POST_UPDATED",
        actionDescription: `Deleted content post "${post.postTitle}"`,
        metadata: JSON.stringify({
          postId: post.id,
        }),
      },
    });

    return NextResponse.json({ message: "Post deleted" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting content post:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
