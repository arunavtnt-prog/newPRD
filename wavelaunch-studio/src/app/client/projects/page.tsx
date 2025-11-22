/**
 * Client Projects List Page
 * View all projects assigned to the client
 */

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { ClientProjectsGrid } from "./_components/client-projects-grid";
import { ClientProjectsFilters } from "./_components/client-projects-filters";

interface SearchParams {
  status?: string;
  search?: string;
}

export default async function ClientProjectsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const session = await auth();

  if (!session?.user || session.user.role !== "CLIENT") {
    redirect("/client/auth/login");
  }

  // Build filters
  const whereClause: any = {
    creatorEmail: session.user.email,
  };

  if (searchParams.status && searchParams.status !== "ALL") {
    whereClause.status = searchParams.status;
  }

  if (searchParams.search) {
    whereClause.OR = [
      { projectName: { contains: searchParams.search, mode: "insensitive" } },
      { creatorName: { contains: searchParams.search, mode: "insensitive" } },
    ];
  }

  // Get projects
  const projects = await prisma.project.findMany({
    where: whereClause,
    include: {
      leadStrategist: {
        select: {
          id: true,
          fullName: true,
          avatarUrl: true,
          email: true,
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          My Projects
        </h1>
        <p className="text-muted-foreground mt-1">
          View and manage all your brand launch projects
        </p>
      </div>

      {/* Filters */}
      <ClientProjectsFilters />

      {/* Projects Grid */}
      <ClientProjectsGrid projects={projects} />
    </div>
  );
}
