/**
 * Section Reorder API Route
 *
 * Handles reordering of sections within a page
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

const reorderSchema = z.object({
  sectionId: z.string(),
  newOrderIndex: z.number().int().min(0),
});

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string; pageId: string } }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const projectId = params.id;
    const pageId = params.pageId;

    // Verify page exists
    const page = await prisma.websitePage.findFirst({
      where: {
        id: pageId,
        projectId: projectId,
      },
      include: {
        sections: {
          orderBy: { orderIndex: "asc" },
        },
      },
    });

    if (!page) {
      return NextResponse.json({ error: "Page not found" }, { status: 404 });
    }

    const body = await request.json();
    const validatedData = reorderSchema.parse(body);

    // Find the section to move
    const sectionToMove = page.sections.find(
      (s) => s.id === validatedData.sectionId
    );

    if (!sectionToMove) {
      return NextResponse.json({ error: "Section not found" }, { status: 404 });
    }

    const oldIndex = sectionToMove.orderIndex;
    const newIndex = validatedData.newOrderIndex;

    // Update order indices in a transaction
    await prisma.$transaction(async (tx) => {
      if (newIndex > oldIndex) {
        // Moving down: decrease indices of sections in between
        await tx.pageSection.updateMany({
          where: {
            pageId: pageId,
            orderIndex: {
              gt: oldIndex,
              lte: newIndex,
            },
          },
          data: {
            orderIndex: {
              decrement: 1,
            },
          },
        });
      } else if (newIndex < oldIndex) {
        // Moving up: increase indices of sections in between
        await tx.pageSection.updateMany({
          where: {
            pageId: pageId,
            orderIndex: {
              gte: newIndex,
              lt: oldIndex,
            },
          },
          data: {
            orderIndex: {
              increment: 1,
            },
          },
        });
      }

      // Update the target section
      await tx.pageSection.update({
        where: { id: validatedData.sectionId },
        data: { orderIndex: newIndex },
      });
    });

    await prisma.activity.create({
      data: {
        projectId: projectId,
        userId: session.user.id,
        actionType: "SECTION_REORDERED",
        actionDescription: `Reordered section "${sectionToMove.sectionName}" on page "${page.pageName}"`,
        metadata: JSON.stringify({
          pageId: pageId,
          sectionId: validatedData.sectionId,
          oldIndex: oldIndex,
          newIndex: newIndex,
        }),
      },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Error reordering section:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
