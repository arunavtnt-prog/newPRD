/**
 * Workflow Engine
 *
 * Executes automated workflows based on triggers and conditions
 */

import {
  WorkflowDefinition,
  WorkflowTriggerType,
  WorkflowAction,
  WorkflowCondition,
  ConditionOperator,
  WorkflowExecutionLog,
} from "./workflow-types";
import { emailService } from "../email/email-service";
import { createNotification } from "../notifications";
import { prisma } from "../db";

/**
 * Evaluate a condition against data
 */
function evaluateCondition(
  condition: WorkflowCondition,
  data: Record<string, any>
): boolean {
  const fieldValue = getNestedValue(data, condition.field);
  const { operator, value } = condition;

  switch (operator) {
    case "EQUALS":
      return fieldValue === value;
    case "NOT_EQUALS":
      return fieldValue !== value;
    case "CONTAINS":
      return String(fieldValue).includes(String(value));
    case "NOT_CONTAINS":
      return !String(fieldValue).includes(String(value));
    case "GREATER_THAN":
      return Number(fieldValue) > Number(value);
    case "LESS_THAN":
      return Number(fieldValue) < Number(value);
    case "IN":
      return Array.isArray(value) && value.includes(fieldValue);
    case "NOT_IN":
      return Array.isArray(value) && !value.includes(fieldValue);
    default:
      return false;
  }
}

/**
 * Get nested value from object using dot notation
 */
function getNestedValue(obj: any, path: string): any {
  return path.split(".").reduce((current, key) => current?.[key], obj);
}

/**
 * Replace template variables in string with actual values
 */
function replaceTemplateVariables(
  template: string,
  data: Record<string, any>
): string {
  return template.replace(/\{\{([\w.[\]]+)\}\}/g, (match, path) => {
    // Handle array notation like {{reviewers[].email}}
    if (path.includes("[]")) {
      const [arrayPath, prop] = path.split("[].");
      const array = getNestedValue(data, arrayPath);
      if (Array.isArray(array)) {
        return array.map((item) => item[prop]).join(", ");
      }
    }
    return getNestedValue(data, path) || match;
  });
}

/**
 * Replace template variables in object recursively
 */
function replaceTemplateVariablesInObject(
  obj: any,
  data: Record<string, any>
): any {
  if (typeof obj === "string") {
    return replaceTemplateVariables(obj, data);
  }
  if (Array.isArray(obj)) {
    return obj.map((item) => replaceTemplateVariablesInObject(item, data));
  }
  if (typeof obj === "object" && obj !== null) {
    const result: any = {};
    for (const [key, value] of Object.entries(obj)) {
      result[key] = replaceTemplateVariablesInObject(value, data);
    }
    return result;
  }
  return obj;
}

/**
 * Execute a workflow action
 */
async function executeAction(
  action: WorkflowAction,
  data: Record<string, any>,
  userId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Replace template variables in action config
    const config = replaceTemplateVariablesInObject(action.config, data);

    switch (action.type) {
      case "SEND_EMAIL":
        const emailSent = await emailService.sendTemplateEmail({
          to: config.to,
          template: config.template,
          data: { ...data, ...config },
          subject: config.subject || "Notification from WaveLaunch Studio",
        });
        return { success: emailSent };

      case "SEND_NOTIFICATION":
        await createNotification({
          userId: config.userId,
          type: config.type,
          message: config.message,
          projectId: data.projectId,
          triggeredById: userId,
        });
        return { success: true };

      case "UPDATE_STATUS":
        if (data.projectId) {
          await prisma.project.update({
            where: { id: data.projectId },
            data: { status: config.status },
          });
        }
        return { success: true };

      case "ASSIGN_USER":
        if (data.projectId && config.userId) {
          await prisma.project.update({
            where: { id: data.projectId },
            data: { leadStrategistId: config.userId },
          });
        }
        return { success: true };

      case "ADD_COMMENT":
        if (data.projectId) {
          await prisma.comment.create({
            data: {
              text: config.text,
              projectId: data.projectId,
              authorId: userId,
              isSystemGenerated: true,
            },
          });
        }
        return { success: true };

      case "SEND_WEBHOOK":
        // Send webhook to external URL
        if (config.url) {
          const response = await fetch(config.url, {
            method: config.method || "POST",
            headers: {
              "Content-Type": "application/json",
              ...(config.headers || {}),
            },
            body: JSON.stringify({
              event: data.eventType,
              data: data,
              timestamp: new Date().toISOString(),
            }),
          });
          return { success: response.ok };
        }
        return { success: false, error: "Webhook URL not configured" };

      case "UPDATE_FIELD":
        if (data.projectId && config.field && config.value) {
          await prisma.project.update({
            where: { id: data.projectId },
            data: { [config.field]: config.value },
          });
        }
        return { success: true };

      case "CREATE_TASK":
        // Future: Create task in project management system
        console.log("CREATE_TASK action:", config);
        return { success: true };

      default:
        return { success: false, error: "Unknown action type" };
    }
  } catch (error: any) {
    console.error("Error executing workflow action:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Workflow Engine Class
 */
export class WorkflowEngine {
  /**
   * Execute a workflow
   */
  async executeWorkflow(
    workflow: WorkflowDefinition,
    triggerData: Record<string, any>,
    userId: string
  ): Promise<WorkflowExecutionLog> {
    const executionLog: WorkflowExecutionLog = {
      id: crypto.randomUUID(),
      workflowId: workflow.id,
      triggeredBy: userId,
      triggerData,
      status: "PENDING",
      executedActions: [],
      startedAt: new Date(),
    };

    try {
      // Check if conditions are met
      if (workflow.trigger.conditions) {
        const conditionsMet = workflow.trigger.conditions.every((condition) =>
          evaluateCondition(condition, triggerData)
        );

        if (!conditionsMet) {
          executionLog.status = "FAILED";
          executionLog.error = "Workflow conditions not met";
          executionLog.completedAt = new Date();
          return executionLog;
        }
      }

      // Execute actions
      for (const action of workflow.actions) {
        // Handle delay if specified
        if (action.delay && action.delay > 0) {
          await new Promise((resolve) =>
            setTimeout(resolve, action.delay * 60 * 1000)
          );
        }

        const result = await executeAction(action, triggerData, userId);

        executionLog.executedActions.push({
          action: action.type,
          status: result.success ? "SUCCESS" : "FAILED",
          error: result.error,
          executedAt: new Date(),
        });

        // If action failed and is critical, stop execution
        if (!result.success) {
          console.warn(`Action ${action.type} failed:`, result.error);
        }
      }

      // Determine overall status
      const allSuccess = executionLog.executedActions.every(
        (a) => a.status === "SUCCESS"
      );
      executionLog.status = allSuccess ? "SUCCESS" : "FAILED";
      executionLog.completedAt = new Date();

      return executionLog;
    } catch (error: any) {
      executionLog.status = "FAILED";
      executionLog.error = error.message;
      executionLog.completedAt = new Date();
      return executionLog;
    }
  }

  /**
   * Trigger workflows based on event type
   */
  async triggerWorkflows(
    eventType: WorkflowTriggerType,
    eventData: Record<string, any>,
    userId: string
  ): Promise<WorkflowExecutionLog[]> {
    try {
      // In a real implementation, fetch active workflows from database
      // For now, we'll use a placeholder
      const workflows: WorkflowDefinition[] = [];

      // Filter workflows that match the trigger type
      const matchingWorkflows = workflows.filter(
        (w) => w.enabled && w.trigger.type === eventType
      );

      // Execute each matching workflow
      const executionLogs = await Promise.all(
        matchingWorkflows.map((workflow) =>
          this.executeWorkflow(workflow, eventData, userId)
        )
      );

      return executionLogs;
    } catch (error) {
      console.error("Error triggering workflows:", error);
      return [];
    }
  }
}

// Export singleton instance
export const workflowEngine = new WorkflowEngine();

/**
 * Helper function to trigger workflows from anywhere in the app
 */
export async function triggerWorkflow(
  eventType: WorkflowTriggerType,
  eventData: Record<string, any>,
  userId: string
): Promise<void> {
  try {
    await workflowEngine.triggerWorkflows(eventType, eventData, userId);
  } catch (error) {
    console.error("Failed to trigger workflow:", error);
    // Don't throw error - workflows shouldn't break main application flow
  }
}
