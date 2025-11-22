/**
 * Schema Validation Utilities
 *
 * Validates that code uses correct field names and relationships
 * from the Prisma schema.
 */

import { Prisma } from '@prisma/client';

/**
 * Valid User fields - prevents typos like creatorEmail
 */
export const USER_FIELDS = [
  'id',
  'email',
  'passwordHash',
  'fullName',
  'role',
  'avatarUrl',
  'companyName',
  'isActive',
  'lastLoginAt',
  'emailVerified',
  'emailVerificationToken',
  'emailVerificationExpires',
  'passwordResetToken',
  'passwordResetExpires',
  'notifyEmailApprovals',
  'notifyEmailMentions',
  'notifyEmailUpdates',
  'createdAt',
  'updatedAt',
] as const;

/**
 * Valid Project fields
 */
export const PROJECT_FIELDS = [
  'id',
  'projectName',
  'creatorName',  // Note: creatorName NOT creatorEmail
  'category',
  'startDate',
  'expectedLaunchDate',
  'actualLaunchDate',
  'status',
  'leadStrategistId',
  'createdAt',
  'updatedAt',
] as const;

/**
 * Valid Activity fields
 */
export const ACTIVITY_FIELDS = [
  'id',
  'projectId',
  'userId',
  'actionType',  // Note: actionType NOT action
  'actionDescription',  // Note: actionDescription NOT description
  'metadata',
  'createdAt',
] as const;

/**
 * Valid User roles
 */
export const USER_ROLES = ['ADMIN', 'TEAM_MEMBER', 'CREATOR'] as const;

/**
 * Valid Project statuses
 */
export const PROJECT_STATUSES = [
  'ONBOARDING',
  'DISCOVERY',
  'BRANDING',
  'PRODUCT_DEV',
  'MANUFACTURING',
  'WEBSITE',
  'MARKETING',
  'LAUNCH',
  'COMPLETED',
  'ARCHIVED',
] as const;

/**
 * Validate field exists in model
 */
export function validateField(
  model: 'User' | 'Project' | 'Activity',
  field: string
): boolean {
  const fieldMap = {
    User: USER_FIELDS,
    Project: PROJECT_FIELDS,
    Activity: ACTIVITY_FIELDS,
  };

  return (fieldMap[model] as readonly string[]).includes(field);
}

/**
 * Get validation error message
 */
export function getFieldValidationError(
  model: string,
  field: string
): string {
  return `Invalid field "${field}" for model "${model}". Check Prisma schema for valid fields.`;
}

/**
 * Validate role
 */
export function isValidRole(role: string): role is typeof USER_ROLES[number] {
  return (USER_ROLES as readonly string[]).includes(role);
}

/**
 * Validate project status
 */
export function isValidProjectStatus(
  status: string
): status is typeof PROJECT_STATUSES[number] {
  return (PROJECT_STATUSES as readonly string[]).includes(status);
}

/**
 * Common query mistakes and their fixes
 */
export const QUERY_FIXES = {
  // Wrong: creatorEmail field doesn't exist
  'where: { creatorEmail: ... }': 'Use: where: { team: { some: { user: { email: ... } } } }',

  // Wrong: lowercase relation name
  'include: { project: ... }': 'Use: include: { Project: ... } (capital P)',

  // Wrong: action field doesn't exist
  'actionType vs action': 'Always use actionType, never action',

  // Wrong: description doesn't exist
  'actionDescription vs description': 'Always use actionDescription',

  // Wrong: CLIENT role doesn't exist
  'role: "CLIENT"': 'Use: role: "CREATOR" (clients are creators)',

  // Wrong: using _count when you need actual data
  '_count vs arrays': 'Use _count for aggregations, include full relations for data access',
} as const;

/**
 * Prisma relation helpers - prevents capitalization errors
 */
export const RELATIONS = {
  // User relations (note: sentMessages and receivedMessages are capitalized in relations)
  User: {
    projectMemberships: 'projectMemberships',
    leadProjects: 'leadProjects',
    uploadedFiles: 'uploadedFiles',
    comments: 'comments',
    notifications: 'notifications',
    activities: 'activities',
    approvalReviews: 'approvalReviews',
    sentMessages: 'sentMessages',
    receivedMessages: 'receivedMessages',
  },

  // Project relations (capital P in some contexts)
  Project: {
    phases: 'phases',  // Use: project.phases.length NOT project._count.projectPhases
    team: 'team',
    files: 'files',
    assets: 'assets',
    approvals: 'approvals',
    comments: 'comments',
    activities: 'activities',
    leadStrategist: 'leadStrategist',
  },

  // Activity relations
  Activity: {
    user: 'user',
    project: 'project',  // Note: lowercase in some contexts, check schema
  },
} as const;

/**
 * Type guard for checking if query uses valid fields
 */
export function assertValidUserQuery(
  query: Partial<Prisma.UserWhereInput>
): void {
  // Add runtime validation here if needed
  // This is mainly for TypeScript type checking
}

/**
 * Type guard for valid project query
 */
export function assertValidProjectQuery(
  query: Partial<Prisma.ProjectWhereInput>
): void {
  // Runtime validation if needed
}

/**
 * Helper to ensure correct include syntax
 */
export type ValidProjectInclude = Prisma.ProjectInclude;
export type ValidUserInclude = Prisma.UserInclude;
export type ValidActivityInclude = Prisma.ActivityInclude;
