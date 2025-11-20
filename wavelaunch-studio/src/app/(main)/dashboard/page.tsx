/**
 * Wavelaunch Studio Dashboard
 *
 * Main dashboard showing overview of projects, approvals, and priorities
 */

import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { HeroCard } from "./_components/wavelaunch/hero-card";
import { MetricsRow } from "./_components/wavelaunch/metrics-row";
import { QuickActions } from "./_components/wavelaunch/quick-actions";
import { ProjectsList } from "./_components/wavelaunch/projects-list";
import { ApprovalsQueue } from "./_components/wavelaunch/approvals-queue";
import { startOfWeek, endOfWeek, format } from "date-fns";

export default async function DashboardPage() {
  // Check authentication
  const session = await auth();
  if (!session?.user) {
    redirect("/auth/v2/login");
  }

  // Get current week range
  const now = new Date();
  const weekStart = startOfWeek(now, { weekStartsOn: 1 }); // Monday
  const weekEnd = endOfWeek(now, { weekStartsOn: 1 }); // Sunday
  const weekRange = `${format(weekStart, "MMM d")} - ${format(weekEnd, "MMM d, yyyy")}`;

  // Fetch active projects
  const projects = await prisma.project.findMany({
    where: {
      status: {
        notIn: ["COMPLETED", "ARCHIVED"],
      },
    },
    include: {
      phases: {
        where: { status: "IN_PROGRESS" },
        orderBy: { phaseOrder: "asc" },
        take: 1,
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
    take: 5,
  });

  // Fetch pending approvals
  const approvals = await prisma.approval.findMany({
    where: {
      status: "PENDING",
    },
    include: {
      project: {
        select: {
          projectName: true,
        },
      },
    },
    orderBy: {
      dueDate: "asc",
    },
    take: 5,
  });

  // Calculate metrics
  const totalActiveProjects = await prisma.project.count({
    where: {
      status: {
        notIn: ["COMPLETED", "ARCHIVED"],
      },
    },
  });

  const totalPendingApprovals = await prisma.approval.count({
    where: {
      status: "PENDING",
    },
  });

  // Get projects with manufacturing phase
  const manufacturingAlerts = await prisma.project.count({
    where: {
      status: "MANUFACTURING",
    },
  });

  // Generate priorities based on real data
  const priorities: Array<{
    id: string;
    title: string;
    description: string;
    color: "orange" | "teal" | "amber";
  }> = [];

  // Add priority for pending approvals
  if (totalPendingApprovals > 0) {
    priorities.push({
      id: "approvals",
      title: `${totalPendingApprovals} Pending Approval${totalPendingApprovals > 1 ? "s" : ""}`,
      description: "Review and approve brand assets",
      color: "orange",
    });
  }

  // Add priority for manufacturing projects
  if (manufacturingAlerts > 0) {
    const manufacturingProjects = await prisma.project.findMany({
      where: { status: "MANUFACTURING" },
      take: 1,
    });
    if (manufacturingProjects.length > 0) {
      priorities.push({
        id: "manufacturing",
        title: `${manufacturingProjects[0].projectName} - Manufacturing Update`,
        description: "QC photos uploaded for review",
        color: "teal",
      });
    }
  }

  // Add priority for discovery phase projects
  const discoveryProjects = await prisma.project.findMany({
    where: { status: "DISCOVERY" },
    take: 1,
  });
  if (discoveryProjects.length > 0) {
    priorities.push({
      id: "discovery",
      title: `${discoveryProjects[0].projectName} - Brand Discovery Due`,
      description: "Creator questionnaire pending completion",
      color: "amber",
    });
  }

  // Format projects for display
  const projectsData = projects.map((project) => ({
    id: project.id,
    name: project.projectName,
    creator: project.creatorName,
    status: project.status,
    phase: project.phases[0]?.phaseName || "M0: Onboarding",
  }));

  // Format approvals for display
  const approvalsData = approvals.map((approval) => {
    const assetIds = JSON.parse(approval.assetIds) as string[];
    return {
      id: approval.id,
      projectName: approval.project.projectName,
      assetCount: assetIds.length,
      requestedBy: approval.requestedById,
      dueDate: approval.dueDate,
      status: approval.status,
    };
  });

  // Metrics data
  const metrics = [
    {
      title: "Active Projects",
      value: totalActiveProjects,
      change: "+2 this month",
      trend: "up" as const,
    },
    {
      title: "Pending Approvals",
      value: totalPendingApprovals,
      change: totalPendingApprovals > 0 ? "Requires attention" : "All caught up",
      trend: totalPendingApprovals > 0 ? ("neutral" as const) : undefined,
    },
    {
      title: "Manufacturing Alerts",
      value: manufacturingAlerts,
      change: manufacturingAlerts > 0 ? "Projects in manufacturing" : "No alerts",
      trend: manufacturingAlerts > 0 ? ("up" as const) : undefined,
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Section */}
        <div className="lg:col-span-8 space-y-6">
          <HeroCard priorities={priorities} weekRange={weekRange} />
          <MetricsRow metrics={metrics} />
          <QuickActions />
        </div>

        {/* Right Section */}
        <div className="lg:col-span-4 space-y-6">
          <ProjectsList projects={projectsData} />
          <ApprovalsQueue approvals={approvalsData} />
        </div>
      </div>
    </div>
  );
}
