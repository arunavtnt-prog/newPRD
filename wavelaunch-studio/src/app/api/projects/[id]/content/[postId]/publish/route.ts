/**
 * Content Post Publish API Route
 *
 * Handles post publishing
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{  id: string; postId: string  }> }
) {
  const { id, postId } = await params;
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const projectId = id;
    const postId = postId;

    const existingPost = await prisma.contentPost.findFirst({
      where: {
        id: postId,
        projectId: projectId,
      },
    });

    if (!existingPost) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const post = await prisma.contentPost.update({
      where: { id: postId },
      data: {
        status: "PUBLISHED",
        publishedDate: new Date(),
      },
    });

    await prisma.activity.create({
      data: {
        projectId: projectId,
        userId: session.user.id,
        actionType: "CONTENT_POST_PUBLISHED",
        actionDescription: `Published content post "${post.postTitle}"`,
        metadata: JSON.stringify({
          postId: post.id,
          platform: post.platform,
        }),
      },
    });

    return NextResponse.json(post, { status: 200 });
  } catch (error) {
    console.error("Error publishing content post:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
