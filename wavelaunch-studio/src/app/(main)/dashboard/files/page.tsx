/**
 * Files Browser Page
 *
 * Central file management across all projects
 */

import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { FilesBrowser } from "./_components/files-browser";

export default async function FilesPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/v2/login");
  }

  // Fetch all files (with pagination in component)
  const files = await prisma.file.findMany({
    where: {
      isDeleted: false,
    },
    include: {
      project: {
        select: {
          id: true,
          projectName: true,
          creatorName: true,
        },
      },
      uploadedBy: {
        select: {
          fullName: true,
          avatarUrl: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 100,
  });

  // Get file statistics
  const stats = await prisma.file.aggregate({
    where: {
      isDeleted: false,
    },
    _count: true,
    _sum: {
      fileSize: true,
    },
  });

  const folderCounts = await prisma.file.groupBy({
    by: ["folder"],
    where: {
      isDeleted: false,
    },
    _count: true,
  });

  return (
    <div className="container mx-auto py-8">
      <FilesBrowser
        files={files}
        totalCount={stats._count}
        totalSize={stats._sum.fileSize || 0}
        folderCounts={folderCounts}
        isAdmin={session.user.role !== "CREATOR"}
      />
    </div>
  );
}
