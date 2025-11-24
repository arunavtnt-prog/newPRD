/**
 * Prototype API Routes
 *
 * Handles prototype creation for SKUs
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

const prototypeSchema = z.object({
  version: z.string().min(1).max(50),
  sampleType: z.enum([
    "FIRST_SAMPLE",
    "REVISED_SAMPLE",
    "PRE_PRODUCTION",
    "PRODUCTION_RUN",
  ]),
  description: z.string().nullable().optional(),
  feedback: z.string().nullable().optional(),
  status: z.enum([
    "ORDERED",
    "IN_TRANSIT",
    "RECEIVED",
    "UNDER_REVIEW",
    "APPROVED",
    "REJECTED",
  ]).optional(),
  orderedDate: z.string().nullable().optional(),
  receivedDate: z.string().nullable().optional(),
});

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{  id: string; skuId: string  }> }
) {
  const { id, skuId } = await params;
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: projectId, skuId } = params;

    // Verify SKU exists and belongs to project
    const sku = await prisma.productSKU.findUnique({
      where: { id: skuId },
    });

    if (!sku || sku.projectId !== projectId) {
      return NextResponse.json({ error: "SKU not found" }, { status: 404 });
    }

    // Parse and validate request body
    const body = await request.json();
    const validatedData = prototypeSchema.parse(body);

    // Create prototype
    const prototype = await prisma.prototype.create({
      data: {
        productSKUId: skuId,
        ...validatedData,
        orderedDate: validatedData.orderedDate
          ? new Date(validatedData.orderedDate)
          : null,
        receivedDate: validatedData.receivedDate
          ? new Date(validatedData.receivedDate)
          : null,
      },
    });

    // Create activity log
    await prisma.activity.create({
      data: {
        projectId: projectId,
        userId: session.user.id,
        actionType: "PROTOTYPE_CREATED",
        actionDescription: `Created prototype ${validatedData.version} for SKU "${sku.skuCode}"`,
        metadata: JSON.stringify({
          prototypeId: prototype.id,
          skuId: sku.id,
          version: validatedData.version,
        }),
      },
    });

    return NextResponse.json(prototype, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Error creating prototype:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
