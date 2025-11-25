/**
 * Client Files Page
 * View and manage all files across projects
 */

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { ClientFilesList } from "./_components/client-files-list";

export default async function ClientFilesPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== "CLIENT") {
    redirect("/client/auth/login");
  }

  // Get all assets from client's projects
  const assets = await prisma.projectAsset.findMany({
    where: {
      project: {
        creatorEmail: session.user.email,
      },
    },
    include: {
      project: {
        select: {
          id: true,
          projectName: true,
          status: true,
        },
      },
      uploadedBy: {
        select: {
          id: true,
          fullName: true,
          avatarUrl: true,
        },
      },
    },
    orderBy: {
      uploadDate: "desc",
    },
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Files
        </h1>
        <p className="text-muted-foreground mt-1">
          Access and download all your project files
        </p>
      </div>

      {/* Files List */}
      <ClientFilesList assets={assets} />
    </div>
  );
}
