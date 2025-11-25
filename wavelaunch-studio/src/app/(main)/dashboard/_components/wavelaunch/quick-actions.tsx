/**
 * Quick Actions Component
 *
 * Provides quick access buttons for common tasks
 */

"use client";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Upload, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CreateProjectDialog } from "./create-project-dialog";

export function QuickActions() {
  const router = useRouter();

  const handleUploadFiles = () => {
    toast.info("Please select a project first to upload files");
    router.push("/dashboard/projects");
  };

  const handleGenerateAssets = () => {
    toast.info("Please open a project to generate brand assets");
    router.push("/dashboard/projects");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <CreateProjectDialog />
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={handleUploadFiles}
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload Files
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={handleGenerateAssets}
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Generate Assets
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-3">
          Quick access to common actions - create projects, upload files, or
          generate AI assets
        </p>
      </CardContent>
    </Card>
  );
}
