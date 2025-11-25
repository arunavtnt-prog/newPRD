/**
 * Approvals Queue Page
 *
 * Central hub for managing all pending approvals across projects
 */

import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ApprovalsQueue } from "./_components/approvals-queue";

export default async function ApprovalsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/v2/login");
  }

  // Fetch all approvals where the user is a reviewer
  const approvals = await prisma.approval.findMany({
    where: {
      reviewers: {
        some: {
          reviewerId: session.user.id,
        },
      },
    },
    include: {
      project: {
        select: {
          id: true,
          projectName: true,
          creatorName: true,
          category: true,
          status: true,
        },
      },
      reviewers: {
        include: {
          reviewer: {
            select: {
              id: true,
              fullName: true,
              avatarUrl: true,
            },
          },
        },
        where: {
          reviewerId: session.user.id,
        },
      },
    },
    orderBy: [
      { dueDate: "asc" },
      { createdAt: "desc" },
    ],
  });

  // Also fetch all approvals for admin/team members
  const allApprovals =
    session.user.role !== "CREATOR"
      ? await prisma.approval.findMany({
          include: {
            project: {
              select: {
                id: true,
                projectName: true,
                creatorName: true,
                category: true,
                status: true,
              },
            },
            reviewers: {
              include: {
                reviewer: {
                  select: {
                    id: true,
                    fullName: true,
                    avatarUrl: true,
                  },
                },
              },
            },
          },
          orderBy: [
            { status: "asc" },
            { dueDate: "asc" },
            { createdAt: "desc" },
          ],
          take: 100,
        })
      : [];

  return (
    <div className="container mx-auto py-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Approvals Queue</h1>
          <p className="text-muted-foreground mt-2">
            Manage approval requests across all projects
          </p>
        </div>

        <ApprovalsQueue
          userApprovals={approvals}
          allApprovals={allApprovals}
          userId={session.user.id}
          isAdmin={session.user.role !== "CREATOR"}
        />
      </div>
    </div>
  );
}
