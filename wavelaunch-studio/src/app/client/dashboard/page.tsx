/**
 * Client Dashboard
 * Overview of client's projects, approvals, and recent activity
 */

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { ClientDashboardStats } from "./_components/client-dashboard-stats";
import { ClientProjectsList } from "./_components/client-projects-list";
import { ClientRecentActivity } from "./_components/client-recent-activity";
import { ClientUpcomingMilestones } from "./_components/client-upcoming-milestones";

export default async function ClientDashboardPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== "CLIENT") {
    redirect("/client/auth/login");
  }

  // Get client's projects
  const projects = await prisma.project.findMany({
    where: {
      creatorEmail: session.user.email, // Assuming creator email links to client
    },
    include: {
      leadStrategist: {
        select: {
          id: true,
          fullName: true,
          avatarUrl: true,
        },
      },
      _count: {
        select: {
          projectPhases: true,
          projectAssets: true,
          approvalRequests: true,
        },
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  // Get pending approvals
  const pendingApprovals = await prisma.approvalRequest.count({
    where: {
      project: {
        creatorEmail: session.user.email,
      },
      status: "PENDING",
    },
  });

  // Get recent activity
  const recentActivity = await prisma.activityLog.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 10,
    include: {
      user: {
        select: {
          id: true,
          fullName: true,
          avatarUrl: true,
        },
      },
    },
  });

  // Calculate stats
  const stats = {
    totalProjects: projects.length,
    activeProjects: projects.filter((p) => p.status === "IN_PROGRESS").length,
    completedProjects: projects.filter((p) => p.status === "COMPLETED").length,
    pendingApprovals,
  };

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Welcome back, {session.user.fullName?.split(" ")[0]}!
        </h1>
        <p className="text-muted-foreground mt-1">
          Here's an overview of your brand launch projects
        </p>
      </div>

      {/* Stats */}
      <ClientDashboardStats stats={stats} />

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Projects List */}
        <div className="lg:col-span-2">
          <ClientProjectsList projects={projects} />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <ClientUpcomingMilestones projects={projects} />
          <ClientRecentActivity activity={recentActivity} />
        </div>
      </div>
    </div>
  );
}
