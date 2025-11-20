/**
 * Client Messages Page
 * View and send messages to the project team
 */

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { ClientMessagesList } from "./_components/client-messages-list";
import { ClientMessageComposer } from "./_components/client-message-composer";
import { Card } from "@/components/ui/card";

export default async function ClientMessagesPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== "CLIENT") {
    redirect("/client/auth/login");
  }

  // Get client's projects for message context
  const projects = await prisma.project.findMany({
    where: {
      creatorEmail: session.user.email,
    },
    select: {
      id: true,
      projectName: true,
      leadStrategist: {
        select: {
          id: true,
          fullName: true,
          avatarUrl: true,
          email: true,
        },
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Messages
        </h1>
        <p className="text-muted-foreground mt-1">
          Communicate with your project team
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Message Composer */}
        <div className="lg:col-span-1">
          <ClientMessageComposer projects={projects} />
        </div>

        {/* Messages List */}
        <div className="lg:col-span-2">
          <ClientMessagesList userId={session.user.id} />
        </div>
      </div>
    </div>
  );
}
