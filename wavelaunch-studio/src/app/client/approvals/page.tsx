/**
 * Client Approvals Page
 * View and manage all approval requests
 */

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { ClientApprovalsList } from "./_components/client-approvals-list";
import { ClientApprovalsStats } from "./_components/client-approvals-stats";

interface SearchParams {
  status?: string;
}

export default async function ClientApprovalsPage({
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
    project: {
      creatorEmail: session.user.email,
    },
  };

  if (searchParams.status && searchParams.status !== "ALL") {
    whereClause.status = searchParams.status;
  }

  // Get approvals
  const approvals = await prisma.approvalRequest.findMany({
    where: whereClause,
    include: {
      project: {
        select: {
          id: true,
          projectName: true,
          status: true,
        },
      },
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
    orderBy: {
      requestDate: "desc",
    },
  });

  // Calculate stats
  const stats = {
    total: approvals.length,
    pending: approvals.filter((a) => a.status === "PENDING").length,
    approved: approvals.filter((a) => a.status === "APPROVED").length,
    rejected: approvals.filter((a) => a.status === "REJECTED").length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Approvals
        </h1>
        <p className="text-muted-foreground mt-1">
          Review and respond to approval requests from your team
        </p>
      </div>

      {/* Stats */}
      <ClientApprovalsStats stats={stats} />

      {/* Approvals List */}
      <ClientApprovalsList approvals={approvals} />
    </div>
  );
}
