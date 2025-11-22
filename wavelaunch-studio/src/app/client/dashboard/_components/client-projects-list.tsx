"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ArrowRight, Folder } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Project {
  id: string;
  projectName: string;
  status: string;
  updatedAt: Date;
  expectedLaunchDate: Date | null;
  leadStrategist: {
    id: string;
    fullName: string;
    avatarUrl: string | null;
  } | null;
  _count: {
    projectPhases: number;
    projectAssets: number;
    approvalRequests: number;
  };
}

interface ClientProjectsListProps {
  projects: Project[];
}

const statusColors: Record<string, string> = {
  DISCOVERY: "bg-blue-100 text-blue-700 border-blue-200",
  PLANNING: "bg-purple-100 text-purple-700 border-purple-200",
  IN_PROGRESS: "bg-yellow-100 text-yellow-700 border-yellow-200",
  REVIEW: "bg-orange-100 text-orange-700 border-orange-200",
  COMPLETED: "bg-green-100 text-green-700 border-green-200",
  ON_HOLD: "bg-gray-100 text-gray-700 border-gray-200",
};

export function ClientProjectsList({ projects }: ClientProjectsListProps) {
  if (projects.length === 0) {
    return (
      <Card className="border-purple-100">
        <CardContent className="p-12">
          <div className="text-center">
            <Folder className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Projects Yet</h3>
            <p className="text-muted-foreground mb-4">
              You don't have any projects yet. Contact us to get started!
            </p>
            <Button asChild>
              <a href="mailto:support@wavelaunch.studio">Contact Support</a>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-purple-100">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>My Projects</span>
          <Button variant="ghost" size="sm" asChild>
            <a href="/client/projects">
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {projects.slice(0, 5).map((project) => {
            const strategistInitials = project.leadStrategist?.fullName
              ?.split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase();

            return (
              <div
                key={project.id}
                className="flex items-center justify-between p-4 rounded-lg border border-purple-100 hover:border-purple-200 hover:bg-purple-50/50 transition-all"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold">{project.projectName}</h3>
                    <Badge
                      variant="outline"
                      className={statusColors[project.status] || ""}
                    >
                      {project.status.replace("_", " ")}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    {project.leadStrategist && (
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage
                            src={project.leadStrategist.avatarUrl || undefined}
                          />
                          <AvatarFallback className="text-xs">
                            {strategistInitials}
                          </AvatarFallback>
                        </Avatar>
                        <span>{project.leadStrategist.fullName}</span>
                      </div>
                    )}
                    <span>•</span>
                    <span>
                      Updated {formatDistanceToNow(new Date(project.updatedAt))}{" "}
                      ago
                    </span>
                  </div>

                  <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                    <span>{project._count.projectPhases} phases</span>
                    <span>•</span>
                    <span>{project._count.projectAssets} assets</span>
                    {project._count.approvalRequests > 0 && (
                      <>
                        <span>•</span>
                        <span className="text-orange-600 font-medium">
                          {project._count.approvalRequests} pending approval
                          {project._count.approvalRequests > 1 ? "s" : ""}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <Button variant="ghost" size="sm" asChild>
                  <a href={`/client/projects/${project.id}`}>
                    View
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
