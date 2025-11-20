/**
 * Client Approval Detail Page
 * Review and respond to a specific approval request
 */

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import { ClientApprovalDetail } from "./_components/client-approval-detail";
import { ClientApprovalForm } from "./_components/client-approval-form";

export default async function ClientApprovalDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await auth();

  if (!session?.user || session.user.role !== "CLIENT") {
    redirect("/client/auth/login");
  }

  // Get approval request
  const approval = await prisma.approvalRequest.findUnique({
    where: {
      id: params.id,
    },
    include: {
      project: {
        include: {
          leadStrategist: {
            select: {
              id: true,
              fullName: true,
              avatarUrl: true,
              email: true,
            },
          },
        },
      },
      requestedBy: {
        select: {
          id: true,
          fullName: true,
          avatarUrl: true,
          email: true,
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
  });

  if (!approval) {
    notFound();
  }

  // Verify client has access to this approval
  if (approval.project.creatorEmail !== session.user.email) {
    redirect("/client/approvals");
  }

  return (
    <div className="space-y-6">
      <ClientApprovalDetail approval={approval} />
      {approval.status === "PENDING" && (
        <ClientApprovalForm approvalId={approval.id} />
      )}
    </div>
  );
}
