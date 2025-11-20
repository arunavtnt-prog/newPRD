/**
 * Team Management Page
 *
 * Manage team members, roles, and permissions
 */

import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { TeamHeader } from "./_components/team-header";
import { TeamMembersTable } from "./_components/team-members-table";
import { EmptyTeamMembers } from "@/components/empty-states/empty-states";

export default async function TeamPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/auth/v2/login");
  }

  // Only admins can access team management
  const currentUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });

  if (currentUser?.role !== "ADMIN") {
    redirect("/unauthorized");
  }

  // Fetch all team members
  const teamMembers = await prisma.user.findMany({
    select: {
      id: true,
      fullName: true,
      email: true,
      role: true,
      department: true,
      jobTitle: true,
      avatarUrl: true,
      isActive: true,
      createdAt: true,
      _count: {
        select: {
          leadingProjects: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Transform data for table
  const tableData = teamMembers.map((member) => ({
    id: member.id,
    fullName: member.fullName,
    email: member.email,
    role: member.role,
    department: member.department || "—",
    jobTitle: member.jobTitle || "—",
    avatarUrl: member.avatarUrl,
    isActive: member.isActive,
    projectsLead: member._count.leadingProjects,
    joinedDate: member.createdAt,
  }));

  return (
    <div className="space-y-6">
      <TeamHeader totalMembers={teamMembers.length} />
      {teamMembers.length === 0 ? (
        <EmptyTeamMembers />
      ) : (
        <TeamMembersTable data={tableData} />
      )}
    </div>
  );
}
