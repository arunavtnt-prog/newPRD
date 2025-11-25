/**
 * Asset Generation Page
 *
 * Central hub for AI-powered asset generation
 */

import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AssetGenerationHub } from "./_components/asset-generation-hub";

export default async function AssetGenerationPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/v2/login");
  }

  // Only admins and team members can access
  if (session.user.role === "CREATOR") {
    redirect("/dashboard");
  }

  // Fetch recent generation jobs
  const generationJobs = await prisma.assetGeneration.findMany({
    include: {
      project: {
        select: {
          id: true,
          projectName: true,
          creatorName: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 50,
  });

  // Get all projects for the generation form
  const projects = await prisma.project.findMany({
    where: {
      status: {
        not: "ARCHIVED",
      },
    },
    select: {
      id: true,
      projectName: true,
      creatorName: true,
      discovery: {
        select: {
          id: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="container mx-auto py-8">
      <AssetGenerationHub
        generationJobs={generationJobs}
        projects={projects}
      />
    </div>
  );
}
