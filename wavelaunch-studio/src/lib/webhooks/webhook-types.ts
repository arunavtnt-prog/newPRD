/**
 * Webhook Types
 *
 * Defines types for webhook integrations
 */

export type WebhookEvent =
  | "project.created"
  | "project.updated"
  | "project.deleted"
  | "project.status_changed"
  | "approval.created"
  | "approval.approved"
  | "approval.rejected"
  | "comment.created"
  | "file.uploaded"
  | "phase.completed"
  | "user.created"
  | "user.updated";

export interface WebhookEndpoint {
  id: string;
  url: string;
  events: WebhookEvent[];
  secret: string;
  enabled: boolean;
  description?: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  lastTriggeredAt?: Date;
  failureCount: number;
}

export interface WebhookPayload {
  id: string;
  event: WebhookEvent;
  timestamp: string;
  data: Record<string, any>;
  previousData?: Record<string, any>; // For update events
}

export interface WebhookDelivery {
  id: string;
  webhookEndpointId: string;
  event: WebhookEvent;
  payload: WebhookPayload;
  status: "SUCCESS" | "FAILED" | "PENDING";
  statusCode?: number;
  responseBody?: string;
  error?: string;
  attemptCount: number;
  createdAt: Date;
  deliveredAt?: Date;
  nextRetryAt?: Date;
}

export interface WebhookSignature {
  timestamp: string;
  signature: string;
}
