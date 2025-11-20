/**
 * Purchase Orders API Routes
 *
 * Handles PO creation with line items
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

const lineItemSchema = z.object({
  productSKUId: z.string().nullable().optional(),
  description: z.string().min(1),
  quantity: z.number().int().positive(),
  unitPrice: z.number().positive(),
  specifications: z.string().nullable().optional(),
});

const purchaseOrderSchema = z.object({
  vendorId: z.string(),
  poNumber: z.string().min(1),
  orderDate: z.string(),
  expectedShipDate: z.string().nullable().optional(),
  expectedDelivery: z.string().nullable().optional(),
  subtotal: z.number(),
  shipping: z.number().nullable().optional(),
  tax: z.number().nullable().optional(),
  totalAmount: z.number(),
  paymentTerms: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
  lineItems: z.array(lineItemSchema).min(1, "At least one line item is required"),
});

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const projectId = params.id;

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: { id: true, projectName: true },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const body = await request.json();
    const validatedData = purchaseOrderSchema.parse(body);

    // Check if PO number already exists
    const existingPO = await prisma.purchaseOrder.findUnique({
      where: { poNumber: validatedData.poNumber },
    });

    if (existingPO) {
      return NextResponse.json(
        { error: "PO number already exists" },
        { status: 400 }
      );
    }

    // Create PO with line items in a transaction
    const purchaseOrder = await prisma.$transaction(async (tx) => {
      const po = await tx.purchaseOrder.create({
        data: {
          projectId: projectId,
          vendorId: validatedData.vendorId,
          poNumber: validatedData.poNumber,
          orderDate: new Date(validatedData.orderDate),
          expectedShipDate: validatedData.expectedShipDate
            ? new Date(validatedData.expectedShipDate)
            : null,
          expectedDelivery: validatedData.expectedDelivery
            ? new Date(validatedData.expectedDelivery)
            : null,
          subtotal: String(validatedData.subtotal),
          shipping: validatedData.shipping ? String(validatedData.shipping) : null,
          tax: validatedData.tax ? String(validatedData.tax) : null,
          totalAmount: String(validatedData.totalAmount),
          paymentTerms: validatedData.paymentTerms,
          notes: validatedData.notes,
          status: "DRAFT",
          paymentStatus: "UNPAID",
        },
        include: {
          vendor: true,
        },
      });

      // Create line items
      await tx.pOLineItem.createMany({
        data: validatedData.lineItems.map((item) => ({
          purchaseOrderId: po.id,
          productSKUId: item.productSKUId,
          description: item.description,
          quantity: item.quantity,
          unitPrice: String(item.unitPrice),
          totalPrice: String(item.quantity * item.unitPrice),
          specifications: item.specifications,
        })),
      });

      return po;
    });

    await prisma.activity.create({
      data: {
        projectId: projectId,
        userId: session.user.id,
        actionType: "PO_CREATED",
        actionDescription: `Created purchase order #${validatedData.poNumber}`,
        metadata: JSON.stringify({
          poId: purchaseOrder.id,
          vendorId: validatedData.vendorId,
          totalAmount: validatedData.totalAmount,
        }),
      },
    });

    return NextResponse.json(purchaseOrder, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Error creating purchase order:", error);
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
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const projectId = params.id;

    const purchaseOrders = await prisma.purchaseOrder.findMany({
      where: { projectId: projectId },
      include: {
        vendor: true,
        lineItems: {
          include: {
            productSKU: true,
          },
        },
      },
      orderBy: { orderDate: "desc" },
    });

    return NextResponse.json({ purchaseOrders }, { status: 200 });
  } catch (error) {
    console.error("Error fetching purchase orders:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
