/**
 * Individual SKU API Routes
 *
 * Handles SKU update and deletion
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

const updateSkuSchema = z.object({
  skuCode: z.string().min(1).max(100).optional(),
  productName: z.string().min(1).max(200).optional(),
  description: z.string().nullable().optional(),
  size: z.string().nullable().optional(),
  color: z.string().nullable().optional(),
  material: z.string().nullable().optional(),
  style: z.string().nullable().optional(),
  wholesaleCost: z.number().nullable().optional(),
  retailPrice: z.number().nullable().optional(),
  targetMargin: z.number().nullable().optional(),
  dimensions: z.string().nullable().optional(),
  weight: z.string().nullable().optional(),
  materials: z.string().nullable().optional(),
  careInstructions: z.string().nullable().optional(),
  moq: z.number().int().nullable().optional(),
  leadTimeDays: z.number().int().nullable().optional(),
  supplierName: z.string().nullable().optional(),
  supplierContact: z.string().nullable().optional(),
  status: z.enum([
    "PLANNING",
    "SAMPLING",
    "APPROVED",
    "IN_PRODUCTION",
    "READY_TO_SHIP",
    "DISCONTINUED",
  ]).optional(),
});

export async function PATCH(
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

    // Fetch SKU
    const sku = await prisma.productSKU.findUnique({
      where: { id: skuId },
    });

    if (!sku) {
      return NextResponse.json({ error: "SKU not found" }, { status: 404 });
    }

    // Verify SKU belongs to this project
    if (sku.projectId !== projectId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Parse and validate request body
    const body = await request.json();
    const validatedData = updateSkuSchema.parse(body);

    // Update SKU
    const updatedSKU = await prisma.productSKU.update({
      where: { id: skuId },
      data: validatedData,
      include: {
        prototypes: true,
      },
    });

    // Create activity log
    await prisma.activity.create({
      data: {
        projectId: projectId,
        userId: session.user.id,
        actionType: "PRODUCT_SKU_UPDATED",
        actionDescription: `Updated SKU "${updatedSKU.skuCode}" - ${updatedSKU.productName}`,
        metadata: JSON.stringify({
          skuId: updatedSKU.id,
          skuCode: updatedSKU.skuCode,
        }),
      },
    });

    return NextResponse.json(updatedSKU, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Error updating SKU:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
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

    // Fetch SKU
    const sku = await prisma.productSKU.findUnique({
      where: { id: skuId },
    });

    if (!sku) {
      return NextResponse.json({ error: "SKU not found" }, { status: 404 });
    }

    // Verify SKU belongs to this project
    if (sku.projectId !== projectId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Delete SKU (will cascade delete prototypes)
    await prisma.productSKU.delete({
      where: { id: skuId },
    });

    // Create activity log
    await prisma.activity.create({
      data: {
        projectId: projectId,
        userId: session.user.id,
        actionType: "PRODUCT_SKU_UPDATED",
        actionDescription: `Deleted SKU "${sku.skuCode}" - ${sku.productName}`,
        metadata: JSON.stringify({
          skuId: sku.id,
          skuCode: sku.skuCode,
        }),
      },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error deleting SKU:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
