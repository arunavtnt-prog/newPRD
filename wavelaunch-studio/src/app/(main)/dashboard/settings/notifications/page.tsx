/**
 * Notifications Settings Page
 *
 * Manage notification preferences (redirects to account settings)
 */

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function NotificationsSettingsPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to account settings where notification preferences are managed
    router.push("/dashboard/settings/account");
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
    </div>
  );
}
