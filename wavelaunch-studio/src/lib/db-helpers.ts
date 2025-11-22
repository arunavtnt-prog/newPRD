/**
 * Type-Safe Database Query Helpers
 *
 * These helpers ensure correct field names, relationships, and query patterns
 * based on the actual Prisma schema.
 */

import { prisma } from '@/lib/db';
import { UserRole } from '@prisma/client';

/**
 * Get projects for a user based on their role
 * Prevents the creatorEmail error by using correct relationships
 */
export async function getProjectsForUser(userId: string, role: UserRole) {
  // CREATORS access projects through ProjectUser relationship
  if (role === 'CREATOR') {
    return await prisma.project.findMany({
      where: {
        team: {
          some: {
            userId: userId,
          },
        },
      },
      include: {
        leadStrategist: {
          select: {
            fullName: true,
            email: true,
          },
        },
        team: {
          include: {
            user: {
              select: {
                id: true,
                fullName: true,
                email: true,
                role: true,
              },
            },
          },
        },
        phases: true,
        _count: {
          select: {
            files: true,
            approvals: true,
            team: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  // ADMIN and TEAM_MEMBER access all projects or assigned projects
  return await prisma.project.findMany({
    where: role === 'ADMIN' ? {} : {
      team: {
        some: {
          userId: userId,
        },
      },
    },
    include: {
      leadStrategist: {
        select: {
          fullName: true,
          email: true,
        },
      },
      team: {
        include: {
          user: {
            select: {
              id: true,
              fullName: true,
              email: true,
              role: true,
            },
          },
        },
      },
      phases: true,
      _count: {
        select: {
          files: true,
          approvals: true,
          team: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
}

/**
 * Get a single project with proper authorization check
 */
export async function getProjectById(projectId: string, userId: string, role: UserRole) {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      leadStrategist: {
        select: {
          id: true,
          fullName: true,
          email: true,
        },
      },
      team: {
        include: {
          user: {
            select: {
              id: true,
              fullName: true,
              email: true,
              role: true,
              avatarUrl: true,
            },
          },
        },
      },
      phases: {
        orderBy: {
          phaseOrder: 'asc',
        },
      },
      files: {
        where: {
          isDeleted: false,
        },
        include: {
          uploadedBy: {
            select: {
              fullName: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 10,
      },
      approvals: {
        include: {
          reviewers: {
            include: {
              reviewer: {
                select: {
                  fullName: true,
                  email: true,
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
  });

  if (!project) {
    return null;
  }

  // Authorization check
  if (role === 'CREATOR') {
    const isMember = project.team.some((member) => member.userId === userId);
    if (!isMember) {
      throw new Error('Unauthorized: User is not a member of this project');
    }
  }

  return project;
}

/**
 * Get recent activity with correct field names
 * Prevents actionType vs action confusion
 */
export async function getRecentActivity(userId: string, role: UserRole, limit = 10) {
  return await prisma.activity.findMany({
    where: role === 'CREATOR' ? {
      project: {  // Note: Capital P - matches schema
        team: {
          some: {
            userId: userId,
          },
        },
      },
    } : {},
    include: {
      user: {
        select: {
          fullName: true,
          avatarUrl: true,
        },
      },
      project: {  // Note: Capital P
        select: {
          projectName: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: limit,
  });
}

/**
 * Get dashboard stats with correct aggregations
 */
export async function getDashboardStats(userId: string, role: UserRole) {
  const projects = await getProjectsForUser(userId, role);

  const activeProjects = projects.filter(
    (p) => !['COMPLETED', 'ARCHIVED'].includes(p.status)
  ).length;

  const completedProjects = projects.filter(
    (p) => p.status === 'COMPLETED'
  ).length;

  const totalFiles = projects.reduce(
    (sum, p) => sum + (p._count?.files || 0),
    0
  );

  const pendingApprovals = await prisma.approval.count({
    where: {
      status: 'PENDING',
      ...(role === 'CREATOR' ? {
        project: {
          team: {
            some: {
              userId: userId,
            },
          },
        },
      } : {}),
    },
  });

  return {
    activeProjects,
    completedProjects,
    totalProjects: projects.length,
    totalFiles,
    pendingApprovals,
  };
}

/**
 * Create activity log with correct field names
 */
export async function createActivity(data: {
  projectId: string;
  userId: string;
  actionType: string;  // Note: actionType not action
  actionDescription: string;  // Note: actionDescription not description
  metadata?: Record<string, any>;
}) {
  return await prisma.activity.create({
    data: {
      projectId: data.projectId,
      userId: data.userId,
      actionType: data.actionType as any,  // Cast to ActivityType enum
      actionDescription: data.actionDescription,
      metadata: JSON.stringify(data.metadata || {}),
    },
  });
}

/**
 * Type-safe user validation
 */
export function validateUserRole(role: string): role is UserRole {
  return ['ADMIN', 'TEAM_MEMBER', 'CREATOR'].includes(role);
}

/**
 * Get correct redirect path based on role
 */
export function getRedirectPathForRole(role: UserRole): string {
  switch (role) {
    case 'CREATOR':
      return '/client/dashboard';
    case 'ADMIN':
    case 'TEAM_MEMBER':
      return '/dashboard';
    default:
      return '/auth/v2/login';
  }
}

/**
 * Get correct login path based on role
 */
export function getLoginPathForRole(role: UserRole): string {
  switch (role) {
    case 'CREATOR':
      return '/client/auth/login';
    case 'ADMIN':
    case 'TEAM_MEMBER':
      return '/auth/v2/login';
    default:
      return '/auth/v2/login';
  }
}
