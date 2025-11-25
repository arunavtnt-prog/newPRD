/**
 * Creator Portal Layout
 *
 * Simplified layout for brand creators/clients
 */

import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { CreatorNav } from "./_components/creator-nav";

export default async function CreatorLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth();

  // Redirect if not authenticated
  if (!session?.user) {
    redirect("/login");
  }

  // Redirect admins/team members to main dashboard
  if (session.user.role !== "CREATOR") {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-background">
      <CreatorNav user={session.user} />
      <main className="container max-w-7xl mx-auto py-6 px-4 md:px-6">
        {children}
      </main>
    </div>
  );
}
