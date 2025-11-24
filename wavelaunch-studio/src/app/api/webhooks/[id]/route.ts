/**
 * Webhook Detail API Route
 *
 * Manage individual webhook endpoint
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

/**
 * GET /api/webhooks/[id]
 * Get webhook endpoint details
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{  id: string  }> }
) {
  const { id } = await params;
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // In a real implementation, fetch from database
    // const webhook = await prisma.webhookEndpoint.findUnique({
    //   where: { id: id, createdBy: session.user.id },
    //   include: {
    //     deliveries: {
    //       orderBy: { createdAt: 'desc' },
    //       take: 20,
    //     },
    //   },
    // });

    return NextResponse.json({
      webhook: null,
      message: "Webhook not found",
    });
  } catch (error: any) {
    console.error("Failed to fetch webhook:", error);
    return NextResponse.json(
      { error: "Failed to fetch webhook" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/webhooks/[id]
 * Update webhook endpoint
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{  id: string  }> }
) {
  const { id } = await params;
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { url, events, description, enabled } = body;

    // In a real implementation, update in database
    // const webhook = await prisma.webhookEndpoint.update({
    //   where: { id: id, createdBy: session.user.id },
    //   data: {
    //     ...(url && { url }),
    //     ...(events && { events }),
    //     ...(description !== undefined && { description }),
    //     ...(enabled !== undefined && { enabled }),
    //     updatedAt: new Date(),
    //   },
    // });

    return NextResponse.json({
      message: "Webhook updated successfully",
    });
  } catch (error: any) {
    console.error("Failed to update webhook:", error);
    return NextResponse.json(
      { error: "Failed to update webhook" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/webhooks/[id]
 * Delete webhook endpoint
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{  id: string  }> }
) {
  const { id } = await params;
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // In a real implementation, delete from database
    // await prisma.webhookEndpoint.delete({
    //   where: { id: id, createdBy: session.user.id },
    // });

    return NextResponse.json({
      message: "Webhook deleted successfully",
    });
  } catch (error: any) {
    console.error("Failed to delete webhook:", error);
    return NextResponse.json(
      { error: "Failed to delete webhook" },
      { status: 500 }
    );
  }
}
