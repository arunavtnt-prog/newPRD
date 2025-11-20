/**
 * Vendor API Routes
 *
 * Handles vendor creation and listing
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

const vendorSchema = z.object({
  name: z.string().min(1).max(200),
  contactPerson: z.string().nullable().optional(),
  email: z.string().email().nullable().optional(),
  phone: z.string().nullable().optional(),
  address: z.string().nullable().optional(),
  country: z.string().nullable().optional(),
  moqRange: z.string().nullable().optional(),
  leadTimeRange: z.string().nullable().optional(),
  rating: z.number().min(1).max(5).nullable().optional(),
  notes: z.string().nullable().optional(),
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
    const validatedData = vendorSchema.parse(body);

    // Create vendor
    const vendor = await prisma.vendor.create({
      data: {
        projectId: projectId,
        ...validatedData,
      },
      include: {
        purchaseOrders: true,
      },
    });

    // Create activity log
    await prisma.activity.create({
      data: {
        projectId: projectId,
        userId: session.user.id,
        actionType: "VENDOR_CREATED",
        actionDescription: `Created vendor "${validatedData.name}"`,
        metadata: JSON.stringify({
          vendorId: vendor.id,
          vendorName: validatedData.name,
        }),
      },
    });

    return NextResponse.json(vendor, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Error creating vendor:", error);
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

    // Fetch vendors
    const vendors = await prisma.vendor.findMany({
      where: { projectId: projectId },
      include: {
        purchaseOrders: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ vendors }, { status: 200 });
  } catch (error) {
    console.error("Error fetching vendors:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
