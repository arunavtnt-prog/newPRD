/**
 * Database Query Optimization Utilities
 */

import { Prisma } from "@prisma/client";

/**
 * Standard select fields for user queries to reduce payload size
 */
export const userSelectMinimal = {
  id: true,
  fullName: true,
  email: true,
  avatarUrl: true,
  role: true,
} satisfies Prisma.UserSelect;

export const userSelectBasic = {
  ...userSelectMinimal,
  department: true,
  jobTitle: true,
  isActive: true,
} satisfies Prisma.UserSelect;

/**
 * Standard select fields for project queries
 */
export const projectSelectMinimal = {
  id: true,
  projectName: true,
  status: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.ProjectSelect;

export const projectSelectBasic = {
  ...projectSelectMinimal,
  creatorName: true,
  category: true,
  startDate: true,
  expectedLaunchDate: true,
  leadStrategist: {
    select: userSelectMinimal,
  },
} satisfies Prisma.ProjectSelect;

export const projectSelectFull = {
  ...projectSelectBasic,
  description: true,
  brandVision: true,
  phases: {
    select: {
      id: true,
      phaseName: true,
      status: true,
      phaseOrder: true,
      dueDate: true,
    },
    orderBy: {
      phaseOrder: "asc" as const,
    },
  },
  _count: {
    select: {
      approvals: true,
      comments: true,
      files: true,
    },
  },
} satisfies Prisma.ProjectSelect;

/**
 * Pagination helper
 */
export interface PaginationOptions {
  page?: number;
  pageSize?: number;
  cursor?: string;
}

export interface PaginationResult<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
    hasMore: boolean;
    nextCursor?: string;
  };
}

export function buildPaginationQuery(options: PaginationOptions) {
  const page = Math.max(1, options.page || 1);
  const pageSize = Math.min(100, Math.max(1, options.pageSize || 20));
  const skip = (page - 1) * pageSize;

  if (options.cursor) {
    return {
      take: pageSize + 1,
      skip: 1,
      cursor: { id: options.cursor },
    };
  }

  return {
    take: pageSize,
    skip,
  };
}

export function buildPaginationResult<T extends { id: string }>(
  data: T[],
  total: number,
  options: PaginationOptions
): PaginationResult<T> {
  const page = options.page || 1;
  const pageSize = options.pageSize || 20;
  const totalPages = Math.ceil(total / pageSize);

  if (options.cursor) {
    const hasMore = data.length > pageSize;
    const results = hasMore ? data.slice(0, -1) : data;
    const nextCursor = hasMore ? results[results.length - 1].id : undefined;

    return {
      data: results,
      pagination: {
        total,
        page,
        pageSize,
        totalPages,
        hasMore,
        nextCursor,
      },
    };
  }

  return {
    data,
    pagination: {
      total,
      page,
      pageSize,
      totalPages,
      hasMore: page < totalPages,
    },
  };
}

/**
 * Search query builder
 */
export function buildSearchQuery(
  searchTerm: string,
  fields: string[]
): Prisma.InputJsonValue {
  const term = searchTerm.trim();
  if (!term) return {};

  return {
    OR: fields.map((field) => ({
      [field]: {
        contains: term,
        mode: "insensitive" as const,
      },
    })),
  };
}

/**
 * Date range filter builder
 */
export interface DateRangeOptions {
  from?: Date | string;
  to?: Date | string;
}

export function buildDateRangeQuery(
  field: string,
  options: DateRangeOptions
): Prisma.InputJsonValue {
  const query: any = {};

  if (options.from) {
    query.gte = new Date(options.from);
  }

  if (options.to) {
    query.lte = new Date(options.to);
  }

  return Object.keys(query).length > 0 ? { [field]: query } : {};
}

/**
 * Batch query helper
 */
export async function batchQuery<T>(
  items: string[],
  batchSize: number,
  queryFn: (batch: string[]) => Promise<T[]>
): Promise<T[]> {
  const results: T[] = [];

  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const batchResults = await queryFn(batch);
    results.push(...batchResults);
  }

  return results;
}

/**
 * Query with retry logic
 */
export async function queryWithRetry<T>(
  queryFn: () => Promise<T>,
  maxRetries = 3,
  delay = 1000
): Promise<T> {
  let lastError: Error | undefined;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await queryFn();
    } catch (error) {
      lastError = error as Error;

      if (attempt < maxRetries) {
        await new Promise((resolve) => setTimeout(resolve, delay * Math.pow(2, attempt)));
      }
    }
  }

  throw lastError;
}

/**
 * Query timeout wrapper
 */
export async function queryWithTimeout<T>(
  queryFn: () => Promise<T>,
  timeoutMs = 10000
): Promise<T> {
  return Promise.race([
    queryFn(),
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error("Query timeout")), timeoutMs)
    ),
  ]);
}
