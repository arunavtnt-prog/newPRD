/**
 * Project Not Found Page
 */

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { FolderX } from "lucide-react";

export default function ProjectNotFound() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="max-w-md">
        <CardHeader>
          <div className="flex flex-col items-center text-center">
            <FolderX className="h-16 w-16 text-muted-foreground mb-4" />
            <CardTitle>Project Not Found</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-muted-foreground mb-6">
            The project you're looking for doesn't exist or you don't have permission to view
            it.
          </p>
          <Button asChild>
            <Link href="/dashboard/projects">Back to Projects</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
