/**
 * Offline Page
 *
 * Shown when user is offline and tries to navigate
 */

import { WifiOff, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function OfflinePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="text-center space-y-6 max-w-md">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="rounded-full bg-muted p-6">
            <WifiOff className="h-16 w-16 text-muted-foreground" />
          </div>
        </div>

        {/* Title */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">You're Offline</h1>
          <p className="text-muted-foreground">
            It looks like you've lost your internet connection. Don't worry, some
            features may still work while offline.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <Button
            size="lg"
            onClick={() => window.location.reload()}
            className="w-full"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>

          <Button variant="outline" size="lg" asChild className="w-full">
            <Link href="/dashboard">Go to Dashboard</Link>
          </Button>
        </div>

        {/* Help Text */}
        <div className="pt-4 text-sm text-muted-foreground">
          <p>While offline, you can:</p>
          <ul className="mt-2 space-y-1">
            <li>• View recently accessed projects</li>
            <li>• Read cached notifications</li>
            <li>• Browse previously loaded content</li>
          </ul>
          <p className="mt-3">
            Your changes will sync automatically when you're back online.
          </p>
        </div>
      </div>
    </div>
  );
}
