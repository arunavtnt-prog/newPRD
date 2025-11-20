/**
 * Purchase Order Status API Routes
 *
 * Handles PO status updates
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

const statusUpdateSchema = z.object({
  status: z.enum(["DRAFT", "SENT", "CONFIRMED", "IN_PRODUCTION", "READY_TO_SHIP", "SHIPPED", "DELIVERED", "CANCELLED"]),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string; poId: string } }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const projectId = params.id;
    const poId = params.poId;

    const existingPO = await prisma.purchaseOrder.findFirst({
      where: {
        id: poId,
        projectId: projectId,
      },
    });

    if (!existingPO) {
      return NextResponse.json({ error: "Purchase order not found" }, { status: 404 });
    }

    const body = await request.json();
    const validatedData = statusUpdateSchema.parse(body);

    const updatedPO = await prisma.purchaseOrder.update({
      where: { id: poId },
      data: {
        status: validatedData.status,
        ...(validatedData.status === "SHIPPED" && !existingPO.shippedDate && {
          shippedDate: new Date(),
        }),
        ...(validatedData.status === "DELIVERED" && !existingPO.deliveredDate && {
          deliveredDate: new Date(),
        }),
      },
    });

    // Activity logging for key status changes
    const statusActivityMap: Record<string, string> = {
      SENT: "PO_SENT",
      CONFIRMED: "PO_CONFIRMED",
      IN_PRODUCTION: "PO_IN_PRODUCTION",
      SHIPPED: "PO_SHIPPED",
      DELIVERED: "PO_DELIVERED",
    };

    if (statusActivityMap[validatedData.status]) {
      await prisma.activity.create({
        data: {
          projectId: projectId,
          userId: session.user.id,
          actionType: statusActivityMap[validatedData.status],
          actionDescription: `Purchase order #${existingPO.poNumber} marked as ${validatedData.status.toLowerCase().replace("_", " ")}`,
          metadata: JSON.stringify({
            poId: poId,
            status: validatedData.status,
          }),
        },
      });
    }

    return NextResponse.json(updatedPO, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Error updating PO status:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
