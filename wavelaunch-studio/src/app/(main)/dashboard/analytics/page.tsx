/**
 * Analytics Dashboard Page
 *
 * Comprehensive analytics and insights for projects and team performance
 */

import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AnalyticsHeader } from "./_components/analytics-header";
import { ProjectMetrics } from "./_components/project-metrics";
import { TeamPerformance } from "./_components/team-performance";
import { ProjectStatusChart } from "./_components/project-status-chart";
import { PhaseCompletionChart } from "./_components/phase-completion-chart";
import { TimeToLaunchChart } from "./_components/time-to-launch-chart";
import { startOfMonth, endOfMonth, subMonths, differenceInDays } from "date-fns";

export default async function AnalyticsPage() {
  // Check authentication
  const session = await auth();
  if (!session?.user) {
    redirect("/auth/v2/login");
  }

  // Date range for analytics (last 6 months)
  const now = new Date();
  const startDate = startOfMonth(subMonths(now, 6));
  const endDate = endOfMonth(now);

  // Fetch all projects with phases
  const projects = await prisma.project.findMany({
    include: {
      phases: {
        orderBy: { phaseOrder: "asc" },
      },
      leadStrategist: {
        select: {
          id: true,
          fullName: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Fetch all users for team metrics
  const users = await prisma.user.findMany({
    where: {
      role: {
        in: ["ADMIN", "TEAM_MEMBER"],
      },
      isActive: true,
    },
    include: {
      leadProjects: {
        select: {
          id: true,
          status: true,
          createdAt: true,
          expectedLaunchDate: true,
        },
      },
    },
  });

  // Calculate project metrics
  const totalProjects = projects.length;
  const activeProjects = projects.filter(
    (p: any) => !["COMPLETED", "ARCHIVED"].includes(p.status)
  ).length;
  const completedProjects = projects.filter((p: any) => p.status === "COMPLETED").length;
  const onTimeProjects = projects.filter(
    (p: any) =>
      p.status === "COMPLETED" &&
      p.expectedLaunchDate &&
      p.updatedAt <= p.expectedLaunchDate
  ).length;

  // Calculate project status distribution
  const statusDistribution = projects.reduce(
    (acc, project) => {
      acc[project.status] = (acc[project.status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  // Calculate average time to launch for completed projects
  const completedWithDates = projects.filter(
    (p: any) => p.status === "COMPLETED" && p.startDate
  );
  const avgTimeToLaunch =
    completedWithDates.length > 0
      ? Math.round(
        completedWithDates.reduce(
          (sum, p) => sum + differenceInDays(p.updatedAt, p.startDate!),
          0
        ) / completedWithDates.length
      )
      : 0;

  // Calculate phase completion rates
  const phaseStats = projects.reduce(
    (acc, project) => {
      project.phases.forEach((phase) => {
        const phaseName = phase.phaseName.split(":")[0]; // Get M0, M1, etc.
        if (!acc[phaseName]) {
          acc[phaseName] = { total: 0, completed: 0 };
        }
        acc[phaseName].total++;
        if (phase.status === "COMPLETED") {
          acc[phaseName].completed++;
        }
      });
      return acc;
    },
    {} as Record<string, { total: number; completed: number }>
  );

  // Calculate team performance
  const teamMetrics = users.map((user) => ({
    id: user.id,
    name: user.fullName,
    activeProjects: user.leadProjects.filter(
      (p: any) => !["COMPLETED", "ARCHIVED"].includes(p.status)
    ).length,
    completedProjects: user.leadProjects.filter((p: any) => p.status === "COMPLETED")
      .length,
    totalProjects: user.leadProjects.length,
  }));

  // Prepare data for charts
  const statusChartData = Object.entries(statusDistribution).map(
    ([status, count]) => ({
      status: status.replace("_", " "),
      count,
      percentage: Math.round((count / totalProjects) * 100),
    })
  );

  const phaseChartData = Object.entries(phaseStats).map(([phase, stats]) => ({
    phase,
    completionRate: Math.round((stats.completed / stats.total) * 100),
    total: stats.total,
    completed: stats.completed,
  }));

  return (
    <div className="space-y-6">
      <AnalyticsHeader />

      {/* Key Metrics */}
      <ProjectMetrics
        totalProjects={totalProjects}
        activeProjects={activeProjects}
        completedProjects={completedProjects}
        onTimeProjects={onTimeProjects}
        avgTimeToLaunch={avgTimeToLaunch}
        completionRate={
          completedProjects > 0
            ? Math.round((completedProjects / totalProjects) * 100)
            : 0
        }
      />

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProjectStatusChart data={statusChartData} />
        <PhaseCompletionChart data={phaseChartData} />
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TimeToLaunchChart projects={completedWithDates} />
        <TeamPerformance teamMetrics={teamMetrics} />
      </div>
    </div>
  );
}
