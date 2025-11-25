/**
 * Individual Vendor API Routes
 *
 * Handles vendor update and deletion
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

const updateVendorSchema = z.object({
  name: z.string().min(1).max(200).optional(),
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

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{  id: string; vendorId: string  }> }
) {
  const { id, vendorId } = await params;
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: projectId, vendorId } = params;

    // Fetch vendor
    const vendor = await prisma.vendor.findUnique({
      where: { id: vendorId },
    });

    if (!vendor) {
      return NextResponse.json({ error: "Vendor not found" }, { status: 404 });
    }

    // Verify vendor belongs to this project
    if (vendor.projectId !== projectId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Parse and validate request body
    const body = await request.json();
    const validatedData = updateVendorSchema.parse(body);

    // Update vendor
    const updatedVendor = await prisma.vendor.update({
      where: { id: vendorId },
      data: validatedData,
      include: {
        purchaseOrders: true,
      },
    });

    // Create activity log
    await prisma.activity.create({
      data: {
        projectId: projectId,
        userId: session.user.id,
        actionType: "VENDOR_UPDATED",
        actionDescription: `Updated vendor "${updatedVendor.name}"`,
        metadata: JSON.stringify({
          vendorId: updatedVendor.id,
          vendorName: updatedVendor.name,
        }),
      },
    });

    return NextResponse.json(updatedVendor, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Error updating vendor:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{  id: string; vendorId: string  }> }
) {
  const { id, vendorId } = await params;
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: projectId, vendorId } = params;

    // Fetch vendor
    const vendor = await prisma.vendor.findUnique({
      where: { id: vendorId },
      include: {
        purchaseOrders: true,
      },
    });

    if (!vendor) {
      return NextResponse.json({ error: "Vendor not found" }, { status: 404 });
    }

    // Verify vendor belongs to this project
    if (vendor.projectId !== projectId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Check if vendor has purchase orders
    if (vendor.purchaseOrders.length > 0) {
      return NextResponse.json(
        {
          error: "Cannot delete vendor with existing purchase orders",
        },
        { status: 400 }
      );
    }

    // Delete vendor
    await prisma.vendor.delete({
      where: { id: vendorId },
    });

    // Create activity log
    await prisma.activity.create({
      data: {
        projectId: projectId,
        userId: session.user.id,
        actionType: "VENDOR_UPDATED",
        actionDescription: `Deleted vendor "${vendor.name}"`,
        metadata: JSON.stringify({
          vendorId: vendor.id,
          vendorName: vendor.name,
        }),
      },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error deleting vendor:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
