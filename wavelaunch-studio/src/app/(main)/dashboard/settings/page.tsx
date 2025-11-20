/**
 * Settings Page
 *
 * User settings, preferences, and account management
 */

import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { SettingsContainer } from "./_components/settings-container";

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/auth/v2/login");
  }

  // Fetch user details
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      fullName: true,
      email: true,
      avatarUrl: true,
      role: true,
      department: true,
      jobTitle: true,
      phoneNumber: true,
      skills: true,
      isActive: true,
      createdAt: true,
    },
  });

  if (!user) {
    redirect("/auth/v2/login");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your account settings and preferences
        </p>
      </div>

      <SettingsContainer user={user} />
    </div>
  );
}
