/**
 * Prototype Status Update API Route
 *
 * Handles prototype status updates
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

const statusSchema = z.object({
  status: z.enum([
    "ORDERED",
    "IN_TRANSIT",
    "RECEIVED",
    "UNDER_REVIEW",
    "APPROVED",
    "REJECTED",
  ]),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{  id: string; prototypeId: string  }> }
) {
  const { id, prototypeId } = await params;
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: projectId, prototypeId } = params;

    // Fetch prototype with SKU
    const prototype = await prisma.prototype.findUnique({
      where: { id: prototypeId },
      include: {
        productSKU: true,
      },
    });

    if (!prototype) {
      return NextResponse.json(
        { error: "Prototype not found" },
        { status: 404 }
      );
    }

    // Verify prototype belongs to this project
    if (prototype.productSKU.projectId !== projectId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Parse and validate request body
    const body = await request.json();
    const validatedData = statusSchema.parse(body);

    // Update prototype with appropriate date fields
    const updateData: any = {
      status: validatedData.status,
    };

    // Set appropriate date fields based on status
    if (validatedData.status === "RECEIVED" && !prototype.receivedDate) {
      updateData.receivedDate = new Date();
    }

    if (validatedData.status === "APPROVED" && !prototype.approvedDate) {
      updateData.approvedDate = new Date();
    }

    const updatedPrototype = await prisma.prototype.update({
      where: { id: prototypeId },
      data: updateData,
    });

    // Create activity log
    let actionType = "PROTOTYPE_UPDATED";
    if (validatedData.status === "APPROVED") {
      actionType = "PROTOTYPE_APPROVED";
    }

    await prisma.activity.create({
      data: {
        projectId: projectId,
        userId: session.user.id,
        actionType: actionType as any,
        actionDescription: `Updated prototype ${prototype.version} status to ${validatedData.status}`,
        metadata: JSON.stringify({
          prototypeId: prototype.id,
          skuId: prototype.productSKUId,
          version: prototype.version,
          status: validatedData.status,
        }),
      },
    });

    return NextResponse.json(updatedPrototype, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Error updating prototype status:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
