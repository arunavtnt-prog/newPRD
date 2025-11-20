/**
 * Workflow Automation Types
 *
 * Defines types for automated workflows and their triggers/actions
 */

// Workflow Trigger Types
export type WorkflowTriggerType =
  | "PROJECT_CREATED"
  | "PROJECT_STATUS_CHANGED"
  | "PROJECT_ASSIGNED"
  | "APPROVAL_REQUESTED"
  | "APPROVAL_APPROVED"
  | "APPROVAL_REJECTED"
  | "PHASE_COMPLETED"
  | "COMMENT_ADDED"
  | "FILE_UPLOADED"
  | "DUE_DATE_APPROACHING"
  | "SCHEDULE"
  | "WEBHOOK";

// Workflow Action Types
export type WorkflowActionType =
  | "SEND_EMAIL"
  | "SEND_NOTIFICATION"
  | "UPDATE_STATUS"
  | "ASSIGN_USER"
  | "CREATE_TASK"
  | "SEND_WEBHOOK"
  | "UPDATE_FIELD"
  | "ADD_COMMENT";

// Workflow Condition Operators
export type ConditionOperator =
  | "EQUALS"
  | "NOT_EQUALS"
  | "CONTAINS"
  | "NOT_CONTAINS"
  | "GREATER_THAN"
  | "LESS_THAN"
  | "IN"
  | "NOT_IN";

// Workflow Condition
export interface WorkflowCondition {
  field: string;
  operator: ConditionOperator;
  value: any;
}

// Workflow Trigger
export interface WorkflowTrigger {
  type: WorkflowTriggerType;
  conditions?: WorkflowCondition[];
  // For SCHEDULE type
  schedule?: {
    type: "DAILY" | "WEEKLY" | "MONTHLY";
    time?: string; // HH:MM format
    dayOfWeek?: number; // 0-6 for weekly
    dayOfMonth?: number; // 1-31 for monthly
  };
}

// Workflow Action
export interface WorkflowAction {
  type: WorkflowActionType;
  config: Record<string, any>;
  delay?: number; // Delay in minutes before executing
}

// Workflow Definition
export interface WorkflowDefinition {
  id: string;
  name: string;
  description?: string;
  enabled: boolean;
  trigger: WorkflowTrigger;
  actions: WorkflowAction[];
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

// Workflow Execution Log
export interface WorkflowExecutionLog {
  id: string;
  workflowId: string;
  triggeredBy: string;
  triggerData: Record<string, any>;
  status: "SUCCESS" | "FAILED" | "PENDING";
  error?: string;
  executedActions: {
    action: WorkflowActionType;
    status: "SUCCESS" | "FAILED";
    error?: string;
    executedAt: Date;
  }[];
  startedAt: Date;
  completedAt?: Date;
}

// Pre-defined workflow templates
export const workflowTemplates: Partial<WorkflowDefinition>[] = [
  {
    name: "Welcome New Project",
    description: "Send welcome email when a new project is created",
    trigger: {
      type: "PROJECT_CREATED",
    },
    actions: [
      {
        type: "SEND_EMAIL",
        config: {
          template: "projectAssigned",
          to: "{{leadStrategist.email}}",
        },
      },
      {
        type: "SEND_NOTIFICATION",
        config: {
          type: "PROJECT_ASSIGNED",
          userId: "{{leadStrategist.id}}",
        },
      },
    ],
  },
  {
    name: "Approval Due Date Reminder",
    description: "Remind reviewers when approval due date is approaching",
    trigger: {
      type: "DUE_DATE_APPROACHING",
      conditions: [
        {
          field: "type",
          operator: "EQUALS",
          value: "APPROVAL",
        },
        {
          field: "daysUntilDue",
          operator: "EQUALS",
          value: 2,
        },
      ],
    },
    actions: [
      {
        type: "SEND_EMAIL",
        config: {
          template: "approvalRequested",
          to: "{{reviewers[].email}}",
        },
      },
      {
        type: "SEND_NOTIFICATION",
        config: {
          type: "APPROVAL_DUE_SOON",
          userId: "{{reviewers[].id}}",
        },
      },
    ],
  },
  {
    name: "Phase Completion Celebration",
    description: "Celebrate when a major phase is completed",
    trigger: {
      type: "PHASE_COMPLETED",
      conditions: [
        {
          field: "phaseName",
          operator: "IN",
          value: ["LAUNCH", "PRODUCT_DEV", "BRANDING"],
        },
      ],
    },
    actions: [
      {
        type: "SEND_EMAIL",
        config: {
          template: "phaseCompleted",
          to: "{{project.leadStrategist.email}}",
        },
      },
      {
        type: "ADD_COMMENT",
        config: {
          text: "🎉 Congratulations on completing the {{phaseName}} phase!",
        },
      },
    ],
  },
  {
    name: "Status Change Notification",
    description: "Notify team when project status changes",
    trigger: {
      type: "PROJECT_STATUS_CHANGED",
    },
    actions: [
      {
        type: "SEND_NOTIFICATION",
        config: {
          type: "PROJECT_STATUS_CHANGED",
          userId: "{{project.leadStrategist.id}}",
        },
      },
      {
        type: "SEND_EMAIL",
        config: {
          template: "projectStatusChanged",
          to: "{{project.leadStrategist.email}}",
        },
      },
    ],
  },
  {
    name: "Weekly Project Digest",
    description: "Send weekly summary of active projects",
    trigger: {
      type: "SCHEDULE",
      schedule: {
        type: "WEEKLY",
        dayOfWeek: 1, // Monday
        time: "09:00",
      },
    },
    actions: [
      {
        type: "SEND_EMAIL",
        config: {
          template: "weeklyDigest",
          to: "{{user.email}}",
        },
      },
    ],
  },
  {
    name: "Auto-assign to Admin on Create",
    description: "Automatically assign new projects to admin if no lead specified",
    trigger: {
      type: "PROJECT_CREATED",
      conditions: [
        {
          field: "leadStrategistId",
          operator: "EQUALS",
          value: null,
        },
      ],
    },
    actions: [
      {
        type: "ASSIGN_USER",
        config: {
          role: "ADMIN",
          field: "leadStrategist",
        },
      },
      {
        type: "SEND_NOTIFICATION",
        config: {
          type: "PROJECT_ASSIGNED",
          userId: "{{assignedUser.id}}",
        },
      },
    ],
  },
];
