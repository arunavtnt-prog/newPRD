/**
 * Notifications Center Page
 *
 * Full page view of all notifications
 */

import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { NotificationsCenter } from "./_components/notifications-center";

export default async function NotificationsPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/auth/v2/login");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Notifications</h1>
        <p className="text-muted-foreground mt-1">
          Stay updated with all your project activities
        </p>
      </div>

      <NotificationsCenter />
    </div>
  );
}
