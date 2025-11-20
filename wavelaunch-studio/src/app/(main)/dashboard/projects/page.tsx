/**
 * Projects List Page
 *
 * Displays all projects in a data table with filtering and search
 */

import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ProjectsDataTableWithBulk } from "./_components/projects-data-table-with-bulk";
import { type ProjectRow } from "./_components/projects-table-columns";
import { CreateProjectDialog } from "./_components/create-project-dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { EmptyProjects } from "@/components/empty-states/empty-states";

export default async function ProjectsPage() {
  // Check authentication
  const session = await auth();
  if (!session?.user) {
    redirect("/auth/v2/login");
  }

  // Fetch all projects with related data
  const projects = await prisma.project.findMany({
    include: {
      leadStrategist: {
        select: {
          fullName: true,
        },
      },
      phases: {
        where: { status: "IN_PROGRESS" },
        orderBy: { phaseOrder: "asc" },
        take: 1,
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  // Fetch available lead strategists (admins and team members)
  const leadStrategists = await prisma.user.findMany({
    where: {
      role: {
        in: ["ADMIN", "TEAM_MEMBER"],
      },
      isActive: true,
    },
    select: {
      id: true,
      fullName: true,
    },
    orderBy: {
      fullName: "asc",
    },
  });

  // Transform data for table
  const tableData: ProjectRow[] = projects.map((project) => ({
    id: project.id,
    projectName: project.projectName,
    creatorName: project.creatorName,
    category: project.category,
    status: project.status,
    currentPhase: project.phases[0]?.phaseName || "M0: Onboarding",
    leadStrategist: project.leadStrategist.fullName,
    startDate: project.startDate,
    expectedLaunchDate: project.expectedLaunchDate,
    updatedAt: project.updatedAt,
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="text-muted-foreground mt-1">
            Manage all creator brand projects ({projects.length} total)
          </p>
        </div>
        <CreateProjectDialog leadStrategists={leadStrategists}>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Project
          </Button>
        </CreateProjectDialog>
      </div>

      {/* Projects Table or Empty State */}
      {projects.length === 0 ? (
        <EmptyProjects />
      ) : (
        <ProjectsDataTableWithBulk
          data={tableData}
          leadStrategists={leadStrategists}
        />
      )}
    </div>
  );
}
