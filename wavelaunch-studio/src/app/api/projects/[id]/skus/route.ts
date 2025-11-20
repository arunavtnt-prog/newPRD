/**
 * SKU API Routes
 *
 * Handles product SKU creation and listing
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

const skuSchema = z.object({
  skuCode: z.string().min(1).max(100),
  productName: z.string().min(1).max(200),
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
    const validatedData = skuSchema.parse(body);

    // Create SKU
    const sku = await prisma.productSKU.create({
      data: {
        projectId: projectId,
        ...validatedData,
      },
      include: {
        prototypes: true,
      },
    });

    // Create activity log
    await prisma.activity.create({
      data: {
        projectId: projectId,
        userId: session.user.id,
        actionType: "PRODUCT_SKU_CREATED",
        actionDescription: `Created SKU "${validatedData.skuCode}" - ${validatedData.productName}`,
        metadata: JSON.stringify({
          skuId: sku.id,
          skuCode: validatedData.skuCode,
        }),
      },
    });

    return NextResponse.json(sku, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Error creating SKU:", error);
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

    // Fetch SKUs
    const skus = await prisma.productSKU.findMany({
      where: { projectId: projectId },
      include: {
        prototypes: {
          orderBy: { createdAt: "desc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ skus }, { status: 200 });
  } catch (error) {
    console.error("Error fetching SKUs:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
