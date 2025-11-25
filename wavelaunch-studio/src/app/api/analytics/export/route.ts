/**
 * Analytics Export API Route
 *
 * Exports analytics data in CSV format
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { differenceInDays, format } from 'date-fns';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only admins and team members can export analytics
    if (session.user.role === 'CREATOR') {
      return NextResponse.json(
        { error: 'Only admins can export analytics' },
        { status: 403 }
      );
    }

    // Fetch all projects with related data
    const projects = await prisma.project.findMany({
      include: {
        phases: {
          orderBy: { phaseOrder: 'asc' },
        },
        leadStrategist: {
          select: {
            fullName: true,
            email: true,
          },
        },
        files: {
          select: {
            id: true,
          },
        },
        approvals: {
          select: {
            id: true,
            status: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Fetch team members
    const users = await prisma.user.findMany({
      where: {
        role: {
          in: ['ADMIN', 'TEAM_MEMBER'],
        },
        isActive: true,
      },
      include: {
        leadProjects: {
          select: {
            id: true,
            status: true,
          },
        },
      },
    });

    // Generate CSV content
    let csv = '';

    // Section 1: Project Summary
    csv += '# PROJECT SUMMARY\n';
    csv +=
      'Project Name,Creator,Category,Status,Lead,Start Date,Expected Launch,Days to Launch,Phase Progress,Files,Approvals\n';

    projects.forEach((project) => {
      const completedPhases = project.phases.filter(
        (p) => p.status === 'COMPLETED'
      ).length;
      const totalPhases = project.phases.length;
      const phaseProgress = totalPhases
        ? `${completedPhases}/${totalPhases}`
        : '0/0';

      const daysToLaunch = differenceInDays(
        project.expectedLaunchDate,
        new Date()
      );

      const fileCount = project.files.length;
      const approvalsPending = project.approvals.filter(
        (a) => a.status === 'PENDING'
      ).length;
      const approvalsTotal = project.approvals.length;

      csv += `"${project.projectName}","${project.creatorName}","${project.category}","${project.status}","${project.leadStrategist.fullName}","${format(project.startDate, 'yyyy-MM-dd')}","${format(project.expectedLaunchDate, 'yyyy-MM-dd')}",${daysToLaunch},"${phaseProgress}",${fileCount},"${approvalsPending}/${approvalsTotal}"\n`;
    });

    csv += '\n';

    // Section 2: Status Distribution
    csv += '# STATUS DISTRIBUTION\n';
    csv += 'Status,Count,Percentage\n';

    const statusCounts = projects.reduce(
      (acc, p) => {
        acc[p.status] = (acc[p.status] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    Object.entries(statusCounts)
      .sort(([, a], [, b]) => b - a)
      .forEach(([status, count]) => {
        const percentage = ((count / projects.length) * 100).toFixed(1);
        csv += `"${status}",${count},${percentage}%\n`;
      });

    csv += '\n';

    // Section 3: Team Performance
    csv += '# TEAM PERFORMANCE\n';
    csv += 'Team Member,Email,Active Projects,Completed Projects,Total Projects\n';

    users.forEach((user) => {
      const activeProjects = user.leadProjects.filter(
        (p) => !['COMPLETED', 'ARCHIVED'].includes(p.status)
      ).length;
      const completedProjects = user.leadProjects.filter(
        (p) => p.status === 'COMPLETED'
      ).length;
      const totalProjects = user.leadProjects.length;

      csv += `"${user.fullName}","${user.email}",${activeProjects},${completedProjects},${totalProjects}\n`;
    });

    csv += '\n';

    // Section 4: Category Distribution
    csv += '# CATEGORY DISTRIBUTION\n';
    csv += 'Category,Count,Percentage\n';

    const categoryCounts = projects.reduce(
      (acc, p) => {
        acc[p.category] = (acc[p.category] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    Object.entries(categoryCounts)
      .sort(([, a], [, b]) => b - a)
      .forEach(([category, count]) => {
        const percentage = ((count / projects.length) * 100).toFixed(1);
        csv += `"${category}",${count},${percentage}%\n`;
      });

    csv += '\n';

    // Section 5: Phase Completion Statistics
    csv += '# PHASE COMPLETION STATISTICS\n';
    csv +=
      'Phase,Projects Started,Projects Completed,Completion Rate,Avg Days to Complete\n';

    const phaseNames = [
      'M0: Onboarding',
      'M1: Discovery',
      'M2: Branding',
      'M3: Product Development',
      'M4: Manufacturing',
      'M5: Website',
      'M6: Marketing',
      'M7: Launch',
    ];

    for (let i = 0; i < 8; i++) {
      const phasesAtOrder = projects
        .map((p) => p.phases.find((ph) => ph.phaseOrder === i))
        .filter(Boolean);

      const started = phasesAtOrder.filter(
        (p) => p && p.status !== 'NOT_STARTED'
      ).length;
      const completed = phasesAtOrder.filter(
        (p) => p && p.status === 'COMPLETED'
      ).length;
      const completionRate =
        started > 0 ? ((completed / started) * 100).toFixed(1) : '0.0';

      // Calculate average days for completed phases
      const completedWithDates = phasesAtOrder.filter(
        (p) => p && p.status === 'COMPLETED' && p.startDate && p.endDate
      );
      const avgDays =
        completedWithDates.length > 0
          ? Math.round(
              completedWithDates.reduce((sum, p) => {
                return (
                  sum + differenceInDays(p!.endDate!, p!.startDate!)
                );
              }, 0) / completedWithDates.length
            )
          : 0;

      csv += `"${phaseNames[i]}",${started},${completed},${completionRate}%,${avgDays}\n`;
    }

    csv += '\n';

    // Section 6: Summary Metrics
    csv += '# SUMMARY METRICS\n';
    csv += 'Metric,Value\n';
    csv += `"Total Projects",${projects.length}\n`;
    csv += `"Active Projects",${projects.filter((p) => !['COMPLETED', 'ARCHIVED'].includes(p.status)).length}\n`;
    csv += `"Completed Projects",${projects.filter((p) => p.status === 'COMPLETED').length}\n`;
    csv += `"Archived Projects",${projects.filter((p) => p.status === 'ARCHIVED').length}\n`;
    csv += `"Team Members",${users.length}\n`;
    csv += `"Total Files Uploaded",${projects.reduce((sum, p) => sum + p.files.length, 0)}\n`;
    csv += `"Total Approvals",${projects.reduce((sum, p) => sum + p.approvals.length, 0)}\n`;
    csv += `"Pending Approvals",${projects.reduce((sum, p) => sum + p.approvals.filter((a) => a.status === 'PENDING').length, 0)}\n`;

    const avgTimeToLaunch = projects
      .filter((p) => p.status === 'COMPLETED')
      .reduce((sum, p) => {
        return sum + differenceInDays(p.updatedAt, p.startDate);
      }, 0);
    const completedCount = projects.filter(
      (p) => p.status === 'COMPLETED'
    ).length;
    csv += `"Avg Days to Launch",${completedCount > 0 ? Math.round(avgTimeToLaunch / completedCount) : 0}\n`;

    csv += '\n';
    csv += `# Generated on ${format(new Date(), 'yyyy-MM-dd HH:mm:ss')}\n`;

    // Return CSV file
    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="wavelaunch-analytics-${format(new Date(), 'yyyy-MM-dd')}.csv"`,
      },
    });
  } catch (error) {
    console.error('Error exporting analytics:', error);
    return NextResponse.json(
      { error: 'Failed to export analytics' },
      { status: 500 }
    );
  }
}
