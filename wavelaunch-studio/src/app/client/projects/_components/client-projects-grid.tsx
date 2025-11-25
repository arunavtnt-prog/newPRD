"use client";

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  ArrowRight,
  Calendar,
  FileText,
  Layers,
  CheckSquare,
  FolderOpen,
} from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";

interface Project {
  id: string;
  projectName: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  expectedLaunchDate: Date | null;
  creatorName: string;
  leadStrategist: {
    id: string;
    fullName: string;
    avatarUrl: string | null;
    email: string;
  } | null;
  _count: {
    projectPhases: number;
    projectAssets: number;
    approvalRequests: number;
  };
}

interface ClientProjectsGridProps {
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

const statusProgress: Record<string, number> = {
  DISCOVERY: 10,
  PLANNING: 25,
  IN_PROGRESS: 50,
  REVIEW: 75,
  COMPLETED: 100,
  ON_HOLD: 50,
};

export function ClientProjectsGrid({ projects }: ClientProjectsGridProps) {
  if (projects.length === 0) {
    return (
      <Card className="border-purple-100">
        <CardContent className="p-12">
          <div className="text-center">
            <FolderOpen className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Projects Found</h3>
            <p className="text-muted-foreground mb-6">
              {projects.length === 0
                ? "You don't have any projects yet."
                : "No projects match your current filters."}
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => {
        const strategistInitials = project.leadStrategist?.fullName
          ?.split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase();

        const progress = statusProgress[project.status] || 0;

        return (
          <Card
            key={project.id}
            className="border-purple-100 hover:border-purple-200 hover:shadow-lg transition-all group"
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-purple-600 transition-colors">
                  {project.projectName}
                </h3>
                <Badge
                  variant="outline"
                  className={`${statusColors[project.status]} shrink-0`}
                >
                  {project.status.replace("_", " ")}
                </Badge>
              </div>

              <p className="text-sm text-muted-foreground">
                {project.creatorName}
              </p>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Progress */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium">{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-2 pt-2">
                <div className="flex flex-col items-center p-2 rounded-lg bg-purple-50">
                  <Layers className="h-4 w-4 text-purple-600 mb-1" />
                  <span className="text-xs font-medium">
                    {project._count.projectPhases}
                  </span>
                  <span className="text-xs text-muted-foreground">Phases</span>
                </div>

                <div className="flex flex-col items-center p-2 rounded-lg bg-blue-50">
                  <FileText className="h-4 w-4 text-blue-600 mb-1" />
                  <span className="text-xs font-medium">
                    {project._count.projectAssets}
                  </span>
                  <span className="text-xs text-muted-foreground">Assets</span>
                </div>

                <div className="flex flex-col items-center p-2 rounded-lg bg-orange-50">
                  <CheckSquare className="h-4 w-4 text-orange-600 mb-1" />
                  <span className="text-xs font-medium">
                    {project._count.approvalRequests}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Approvals
                  </span>
                </div>
              </div>

              {/* Launch Date */}
              {project.expectedLaunchDate && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground pt-2 border-t">
                  <Calendar className="h-4 w-4" />
                  <span>
                    Launch: {format(new Date(project.expectedLaunchDate), "MMM d, yyyy")}
                  </span>
                </div>
              )}

              {/* Lead Strategist */}
              {project.leadStrategist && (
                <div className="flex items-center gap-2 pt-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage
                      src={project.leadStrategist.avatarUrl || undefined}
                    />
                    <AvatarFallback className="text-xs">
                      {strategistInitials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate">
                      {project.leadStrategist.fullName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Lead Strategist
                    </p>
                  </div>
                </div>
              )}
            </CardContent>

            <CardFooter className="pt-4 border-t">
              <Button variant="ghost" className="w-full group-hover:bg-purple-50 group-hover:text-purple-600" asChild>
                <a href={`/client/projects/${project.id}`}>
                  View Project
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
