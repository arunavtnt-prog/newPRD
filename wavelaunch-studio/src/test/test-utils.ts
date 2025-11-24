/**
 * Test Utilities
 * Common utilities for testing
 */

import { vi } from 'vitest';
import type { PrismaClient } from '@prisma/client';

/**
 * Mock Prisma Client
 */
export function createMockPrismaClient(): any {
  return {
    user: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      findFirst: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      count: vi.fn(),
    },
    project: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      findFirst: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      count: vi.fn(),
    },
    projectUser: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      findFirst: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      deleteMany: vi.fn(),
    },
    activity: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      createMany: vi.fn(),
    },
    message: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    file: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    phase: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    approval: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
    $transaction: vi.fn((callback) => callback(createMockPrismaClient())),
  };
}

/**
 * Mock User Data
 */
export const mockUsers = {
  admin: {
    id: 'admin-1',
    email: 'admin@test.com',
    fullName: 'Admin User',
    role: 'ADMIN' as const,
    passwordHash: 'hashed',
    emailVerified: true,
    emailVerificationToken: null,
    emailVerificationExpires: null,
    passwordResetToken: null,
    passwordResetExpires: null,
    companyName: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  teamMember: {
    id: 'team-1',
    email: 'team@test.com',
    fullName: 'Team Member',
    role: 'TEAM_MEMBER' as const,
    passwordHash: 'hashed',
    emailVerified: true,
    emailVerificationToken: null,
    emailVerificationExpires: null,
    passwordResetToken: null,
    passwordResetExpires: null,
    companyName: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  creator: {
    id: 'creator-1',
    email: 'creator@test.com',
    fullName: 'Creator User',
    role: 'CREATOR' as const,
    passwordHash: 'hashed',
    emailVerified: true,
    emailVerificationToken: null,
    emailVerificationExpires: null,
    passwordResetToken: null,
    passwordResetExpires: null,
    companyName: 'Test Company',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
};

/**
 * Mock Project Data
 */
export const mockProject = {
  id: 'project-1',
  projectName: 'Test Project',
  creatorName: 'Creator User',
  category: 'Website',
  startDate: new Date(),
  expectedLaunchDate: new Date(),
  actualLaunchDate: null,
  status: 'IN_PROGRESS' as const,
  leadStrategistId: 'admin-1',
  createdAt: new Date(),
  updatedAt: new Date(),
};

/**
 * Mock Activity Data
 */
export const mockActivity = {
  id: 'activity-1',
  projectId: 'project-1',
  userId: 'admin-1',
  actionType: 'PROJECT_CREATED',
  actionDescription: 'Project was created',
  metadata: '{}',
  createdAt: new Date(),
};

/**
 * Mock Message Data
 */
export const mockMessage = {
  id: 'message-1',
  projectId: 'project-1',
  subject: 'Test Subject',
  content: 'Test content',
  senderId: 'admin-1',
  recipientId: 'creator-1',
  attachments: '[]',
  isRead: false,
  readAt: null,
  isDeleted: false,
  threadId: null,
  parentId: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

/**
 * Wait for async operations
 */
export const waitFor = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Mock Next.js Request
 */
export function createMockRequest(options: {
  method?: string;
  body?: any;
  headers?: Record<string, string>;
  url?: string;
}): any {
  return {
    method: options.method || 'GET',
    json: vi.fn().mockResolvedValue(options.body || {}),
    headers: new Map(Object.entries(options.headers || {})),
    url: options.url || 'http://localhost:3000',
  };
}

/**
 * Mock Next.js Response
 */
export function createMockResponse(): any {
  return {
    json: vi.fn((data) => ({ data })),
    status: vi.fn().mockReturnThis(),
  };
}
