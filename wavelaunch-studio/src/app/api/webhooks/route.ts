/**
 * Webhooks API Route
 *
 * Manage webhook endpoints
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { webhookService } from "@/lib/webhooks/webhook-service";
import { WebhookEvent } from "@/lib/webhooks/webhook-types";

/**
 * GET /api/webhooks
 * List all webhook endpoints
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // In a real implementation, fetch from database
    // const webhooks = await prisma.webhookEndpoint.findMany({
    //   where: { createdBy: session.user.id },
    //   orderBy: { createdAt: 'desc' },
    // });

    const webhooks: any[] = [];

    return NextResponse.json({ webhooks });
  } catch (error: any) {
    console.error("Failed to fetch webhooks:", error);
    return NextResponse.json(
      { error: "Failed to fetch webhooks" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/webhooks
 * Create a new webhook endpoint
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { url, events, description } = body;

    // Validate input
    if (!url || !events || !Array.isArray(events) || events.length === 0) {
      return NextResponse.json(
        { error: "URL and events are required" },
        { status: 400 }
      );
    }

    // Generate secret for webhook
    const secret = webhookService.generateSecret();

    // Validate endpoint (optional - can be slow)
    // const isValid = await webhookService.validateEndpoint(url, secret);
    // if (!isValid) {
    //   return NextResponse.json(
    //     { error: "Failed to validate webhook endpoint" },
    //     { status: 400 }
    //   );
    // }

    // In a real implementation, save to database
    // const webhook = await prisma.webhookEndpoint.create({
    //   data: {
    //     url,
    //     events: events as WebhookEvent[],
    //     secret,
    //     description,
    //     enabled: true,
    //     createdBy: session.user.id,
    //     failureCount: 0,
    //   },
    // });

    const webhook = {
      id: crypto.randomUUID(),
      url,
      events,
      secret,
      description,
      enabled: true,
      createdBy: session.user.id,
      createdAt: new Date(),
      updatedAt: new Date(),
      failureCount: 0,
    };

    return NextResponse.json({ webhook, message: "Webhook created successfully" });
  } catch (error: any) {
    console.error("Failed to create webhook:", error);
    return NextResponse.json(
      { error: "Failed to create webhook" },
      { status: 500 }
    );
  }
}
