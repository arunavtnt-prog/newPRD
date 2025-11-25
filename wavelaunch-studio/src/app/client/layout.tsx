/**
 * Client Portal Layout
 * Different layout and navigation for external clients
 */

import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ClientHeader } from "./_components/client-header";
import { ClientSidebar } from "./_components/client-sidebar";

export default async function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Redirect if not authenticated
  if (!session?.user) {
    redirect("/client/auth/login");
  }

  // Redirect if not a client
  if (session.user.role !== "CLIENT") {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50/30 via-white to-blue-50/30">
      <ClientHeader user={session.user} />

      <div className="flex">
        <ClientSidebar />

        <main className="flex-1 p-6 lg:p-8 ml-0 lg:ml-64">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
