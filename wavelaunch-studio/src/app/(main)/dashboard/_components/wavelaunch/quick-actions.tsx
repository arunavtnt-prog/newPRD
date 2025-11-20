/**
 * Quick Actions Component
 *
 * Provides quick access buttons for common tasks
 */

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Plus, Upload, Sparkles } from "lucide-react";

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Button variant="outline" className="w-full justify-start" disabled>
            <Plus className="h-4 w-4 mr-2" />
            Create Project
          </Button>
          <Button variant="outline" className="w-full justify-start" disabled>
            <Upload className="h-4 w-4 mr-2" />
            Upload Files
          </Button>
          <Button variant="outline" className="w-full justify-start" disabled>
            <Sparkles className="h-4 w-4 mr-2" />
            Generate Assets
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-3">
          These features will be available in the next update
        </p>
      </CardContent>
    </Card>
  );
}
