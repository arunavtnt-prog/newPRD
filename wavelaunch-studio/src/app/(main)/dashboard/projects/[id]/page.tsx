/**
 * Project Detail Page
 *
 * Shows detailed information about a specific project
 */

import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { ProjectHeader } from "./_components/project-header";
import { ProjectTabs } from "./_components/project-tabs";

interface ProjectDetailPageProps {
  params: {
    id: string;
  };
}

export default async function ProjectDetailPage({
  params,
}: ProjectDetailPageProps) {
  // Check authentication
  const session = await auth();
  if (!session?.user) {
    redirect("/auth/v2/login");
  }

  // Fetch project with all relations
  const project = await prisma.project.findUnique({
    where: { id: params.id },
    include: {
      leadStrategist: {
        select: {
          id: true,
          fullName: true,
          email: true,
          avatarUrl: true,
        },
      },
      phases: {
        orderBy: { phaseOrder: "asc" },
      },
      files: {
        include: {
          uploadedBy: {
            select: {
              fullName: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      },
      assets: {
        orderBy: { createdAt: "desc" },
        take: 10,
      },
      approvals: {
        include: {
          reviewers: {
            include: {
              reviewer: {
                select: {
                  fullName: true,
                  avatarUrl: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: "desc" },
      },
      comments: {
        include: {
          author: {
            select: {
              fullName: true,
              avatarUrl: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        take: 10,
      },
      discovery: true,
      colorPalettes: {
        orderBy: { createdAt: "desc" },
      },
      typography: true,
      productSKUs: {
        include: {
          prototypes: {
            orderBy: { createdAt: "desc" },
          },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  // Handle not found
  if (!project) {
    notFound();
  }

  // Fetch available reviewers for approval requests
  const availableReviewers = await prisma.user.findMany({
    where: {
      role: { in: ["ADMIN", "TEAM_MEMBER"] },
      isActive: true,
    },
    select: {
      id: true,
      fullName: true,
      email: true,
    },
    orderBy: { fullName: "asc" },
  });

  return (
    <div className="flex flex-col gap-6">
      <ProjectHeader project={project} />
      <ProjectTabs
        project={project}
        availableReviewers={availableReviewers}
        currentUserId={session.user.id}
      />
    </div>
  );
}
