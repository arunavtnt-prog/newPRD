/**
 * Projects List Component
 *
 * Displays active projects with status
 */

import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Folder } from "lucide-react";

interface Project {
  id: string;
  name: string;
  creator: string;
  status: string;
  phase: string;
}

interface ProjectsListProps {
  projects: Project[];
}

export function ProjectsList({ projects }: ProjectsListProps) {
  const getStatusColor = (status: string) => {
    const statusMap: Record<string, "default" | "secondary" | "outline"> = {
      DISCOVERY: "secondary",
      BRANDING: "default",
      PRODUCT_DEV: "default",
      MANUFACTURING: "default",
      WEBSITE: "default",
      MARKETING: "default",
      LAUNCH: "default",
    };
    return statusMap[status] || "outline";
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Active Projects</CardTitle>
          <Badge variant="outline">{projects.length}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {projects.length === 0 ? (
            <div className="text-center py-8">
              <Folder className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
              <p className="text-sm text-muted-foreground">No active projects</p>
            </div>
          ) : (
            projects.map((project) => (
              <div
                key={project.id}
                className="flex items-start justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{project.name}</p>
                  <p className="text-sm text-muted-foreground truncate">{project.creator}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant={getStatusColor(project.status)} className="text-xs">
                      {project.phase}
                    </Badge>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="shrink-0" asChild>
                  <Link href={`/dashboard/projects/${project.id}`}>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            ))
          )}
        </div>
        {projects.length > 0 && (
          <Button variant="link" className="w-full mt-4" asChild>
            <Link href="/dashboard/projects">View All Projects</Link>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
