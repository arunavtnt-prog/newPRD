/**
 * Webhook Service
 *
 * Handles sending and receiving webhooks
 */

import crypto from "crypto";
import {
  WebhookEndpoint,
  WebhookEvent,
  WebhookPayload,
  WebhookDelivery,
  WebhookSignature,
} from "./webhook-types";

/**
 * Generate HMAC signature for webhook payload
 */
export function generateWebhookSignature(
  payload: string,
  secret: string
): string {
  return crypto.createHmac("sha256", secret).update(payload).digest("hex");
}

/**
 * Verify webhook signature
 */
export function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  const expectedSignature = generateWebhookSignature(payload, secret);
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}

/**
 * Create webhook payload
 */
export function createWebhookPayload(
  event: WebhookEvent,
  data: Record<string, any>,
  previousData?: Record<string, any>
): WebhookPayload {
  return {
    id: crypto.randomUUID(),
    event,
    timestamp: new Date().toISOString(),
    data,
    previousData,
  };
}

/**
 * Webhook Service Class
 */
export class WebhookService {
  private maxRetries = 3;
  private retryDelays = [60000, 300000, 900000]; // 1min, 5min, 15min

  /**
   * Send webhook to endpoint
   */
  async sendWebhook(
    endpoint: WebhookEndpoint,
    payload: WebhookPayload
  ): Promise<WebhookDelivery> {
    const delivery: WebhookDelivery = {
      id: crypto.randomUUID(),
      webhookEndpointId: endpoint.id,
      event: payload.event,
      payload,
      status: "PENDING",
      attemptCount: 0,
      createdAt: new Date(),
    };

    try {
      // Prepare payload and signature
      const payloadString = JSON.stringify(payload);
      const signature = generateWebhookSignature(payloadString, endpoint.secret);
      const timestamp = new Date().toISOString();

      // Send webhook
      const response = await fetch(endpoint.url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Webhook-Signature": signature,
          "X-Webhook-Timestamp": timestamp,
          "X-Webhook-Event": payload.event,
          "User-Agent": "WaveLaunch-Webhooks/1.0",
        },
        body: payloadString,
      });

      delivery.attemptCount = 1;
      delivery.statusCode = response.status;
      delivery.responseBody = await response.text().catch(() => "");

      if (response.ok) {
        delivery.status = "SUCCESS";
        delivery.deliveredAt = new Date();
      } else {
        delivery.status = "FAILED";
        delivery.error = `HTTP ${response.status}: ${delivery.responseBody}`;

        // Schedule retry if under max retries
        if (delivery.attemptCount < this.maxRetries) {
          delivery.nextRetryAt = new Date(
            Date.now() + this.retryDelays[delivery.attemptCount - 1]
          );
        }
      }
    } catch (error: any) {
      delivery.status = "FAILED";
      delivery.error = error.message;
      delivery.attemptCount = 1;

      // Schedule retry
      if (delivery.attemptCount < this.maxRetries) {
        delivery.nextRetryAt = new Date(
          Date.now() + this.retryDelays[delivery.attemptCount - 1]
        );
      }
    }

    return delivery;
  }

  /**
   * Send webhook to multiple endpoints
   */
  async sendWebhookToEndpoints(
    endpoints: WebhookEndpoint[],
    event: WebhookEvent,
    data: Record<string, any>,
    previousData?: Record<string, any>
  ): Promise<WebhookDelivery[]> {
    // Filter endpoints that are enabled and subscribed to this event
    const relevantEndpoints = endpoints.filter(
      (endpoint) => endpoint.enabled && endpoint.events.includes(event)
    );

    if (relevantEndpoints.length === 0) {
      return [];
    }

    // Create payload
    const payload = createWebhookPayload(event, data, previousData);

    // Send to all relevant endpoints
    const deliveries = await Promise.all(
      relevantEndpoints.map((endpoint) => this.sendWebhook(endpoint, payload))
    );

    return deliveries;
  }

  /**
   * Retry failed webhook delivery
   */
  async retryWebhookDelivery(
    endpoint: WebhookEndpoint,
    delivery: WebhookDelivery
  ): Promise<WebhookDelivery> {
    const updatedDelivery = { ...delivery };

    try {
      const payloadString = JSON.stringify(delivery.payload);
      const signature = generateWebhookSignature(payloadString, endpoint.secret);
      const timestamp = new Date().toISOString();

      const response = await fetch(endpoint.url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Webhook-Signature": signature,
          "X-Webhook-Timestamp": timestamp,
          "X-Webhook-Event": delivery.event,
          "User-Agent": "WaveLaunch-Webhooks/1.0",
        },
        body: payloadString,
      });

      updatedDelivery.attemptCount += 1;
      updatedDelivery.statusCode = response.status;
      updatedDelivery.responseBody = await response.text().catch(() => "");

      if (response.ok) {
        updatedDelivery.status = "SUCCESS";
        updatedDelivery.deliveredAt = new Date();
        updatedDelivery.nextRetryAt = undefined;
      } else {
        updatedDelivery.status = "FAILED";
        updatedDelivery.error = `HTTP ${response.status}: ${updatedDelivery.responseBody}`;

        // Schedule next retry if under max retries
        if (updatedDelivery.attemptCount < this.maxRetries) {
          updatedDelivery.nextRetryAt = new Date(
            Date.now() + this.retryDelays[updatedDelivery.attemptCount - 1]
          );
        }
      }
    } catch (error: any) {
      updatedDelivery.attemptCount += 1;
      updatedDelivery.error = error.message;

      // Schedule next retry if under max retries
      if (updatedDelivery.attemptCount < this.maxRetries) {
        updatedDelivery.nextRetryAt = new Date(
          Date.now() + this.retryDelays[updatedDelivery.attemptCount - 1]
        );
      }
    }

    return updatedDelivery;
  }

  /**
   * Generate webhook secret
   */
  generateSecret(): string {
    return crypto.randomBytes(32).toString("hex");
  }

  /**
   * Validate webhook endpoint URL
   */
  async validateEndpoint(url: string, secret: string): Promise<boolean> {
    try {
      const testPayload = createWebhookPayload("project.created", {
        test: true,
      });
      const payloadString = JSON.stringify(testPayload);
      const signature = generateWebhookSignature(payloadString, secret);

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Webhook-Signature": signature,
          "X-Webhook-Timestamp": new Date().toISOString(),
          "X-Webhook-Event": "test",
          "User-Agent": "WaveLaunch-Webhooks/1.0",
        },
        body: payloadString,
      });

      return response.ok;
    } catch (error) {
      return false;
    }
  }
}

// Export singleton instance
export const webhookService = new WebhookService();

/**
 * Helper function to trigger webhooks from anywhere in the app
 */
export async function triggerWebhook(
  event: WebhookEvent,
  data: Record<string, any>,
  previousData?: Record<string, any>
): Promise<void> {
  try {
    // In a real implementation, fetch webhook endpoints from database
    const endpoints: WebhookEndpoint[] = [];

    await webhookService.sendWebhookToEndpoints(
      endpoints,
      event,
      data,
      previousData
    );
  } catch (error) {
    console.error("Failed to trigger webhook:", error);
    // Don't throw error - webhooks shouldn't break main application flow
  }
}
