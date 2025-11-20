/**
 * Client Project Detail Page
 * Detailed view of a single project with phases, assets, and approvals
 */

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import { ClientProjectHeader } from "./_components/client-project-header";
import { ClientProjectPhases } from "./_components/client-project-phases";
import { ClientProjectAssets } from "./_components/client-project-assets";
import { ClientProjectTimeline } from "./_components/client-project-timeline";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default async function ClientProjectDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await auth();

  if (!session?.user || session.user.role !== "CLIENT") {
    redirect("/client/auth/login");
  }

  // Get project
  const project = await prisma.project.findUnique({
    where: {
      id: params.id,
      creatorEmail: session.user.email, // Ensure client can only see their own projects
    },
    include: {
      leadStrategist: {
        select: {
          id: true,
          fullName: true,
          avatarUrl: true,
          email: true,
          phoneNumber: true,
        },
      },
      projectPhases: {
        orderBy: {
          phaseNumber: "asc",
        },
      },
      projectAssets: {
        orderBy: {
          uploadDate: "desc",
        },
        include: {
          uploadedBy: {
            select: {
              id: true,
              fullName: true,
              avatarUrl: true,
            },
          },
        },
      },
      approvalRequests: {
        orderBy: {
          requestDate: "desc",
        },
        include: {
          requestedBy: {
            select: {
              id: true,
              fullName: true,
              avatarUrl: true,
            },
          },
          reviewedBy: {
            select: {
              id: true,
              fullName: true,
              avatarUrl: true,
            },
          },
        },
      },
    },
  });

  if (!project) {
    notFound();
  }

  return (
    <div className="space-y-6">
      {/* Project Header */}
      <ClientProjectHeader project={project} />

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="assets">
            Assets ({project.projectAssets.length})
          </TabsTrigger>
          <TabsTrigger value="approvals">
            Approvals ({project.approvalRequests.length})
          </TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Project Phases */}
          <ClientProjectPhases phases={project.projectPhases} />
        </TabsContent>

        <TabsContent value="assets">
          <ClientProjectAssets
            assets={project.projectAssets}
            projectId={project.id}
          />
        </TabsContent>

        <TabsContent value="approvals">
          <ClientProjectTimeline approvals={project.approvalRequests} />
        </TabsContent>

        <TabsContent value="timeline">
          <ClientProjectTimeline approvals={project.approvalRequests} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
