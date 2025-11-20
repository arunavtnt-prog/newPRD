"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Calendar,
  Mail,
  Phone,
  ArrowLeft,
  ExternalLink,
} from "lucide-react";
import { format } from "date-fns";

interface Project {
  id: string;
  projectName: string;
  status: string;
  creatorName: string;
  category: string | null;
  expectedLaunchDate: Date | null;
  startDate: Date | null;
  description: string | null;
  leadStrategist: {
    id: string;
    fullName: string;
    avatarUrl: string | null;
    email: string;
    phoneNumber: string | null;
  } | null;
}

interface ClientProjectHeaderProps {
  project: Project;
}

const statusColors: Record<string, string> = {
  DISCOVERY: "bg-blue-100 text-blue-700 border-blue-200",
  PLANNING: "bg-purple-100 text-purple-700 border-purple-200",
  IN_PROGRESS: "bg-yellow-100 text-yellow-700 border-yellow-200",
  REVIEW: "bg-orange-100 text-orange-700 border-orange-200",
  COMPLETED: "bg-green-100 text-green-700 border-green-200",
  ON_HOLD: "bg-gray-100 text-gray-700 border-gray-200",
};

export function ClientProjectHeader({ project }: ClientProjectHeaderProps) {
  const strategistInitials = project.leadStrategist?.fullName
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div className="space-y-4">
      {/* Back Button */}
      <Button variant="ghost" asChild>
        <a href="/client/projects">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Projects
        </a>
      </Button>

      {/* Project Info Card */}
      <Card className="border-purple-100">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            {/* Left Side - Project Info */}
            <div className="flex-1 space-y-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold">{project.projectName}</h1>
                  <Badge
                    variant="outline"
                    className={statusColors[project.status]}
                  >
                    {project.status.replace("_", " ")}
                  </Badge>
                </div>
                <p className="text-muted-foreground">{project.creatorName}</p>
              </div>

              {project.description && (
                <p className="text-sm">{project.description}</p>
              )}

              <div className="flex flex-wrap gap-4 text-sm">
                {project.category && (
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">Category:</span>
                    <span className="font-medium">{project.category}</span>
                  </div>
                )}

                {project.startDate && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Started:</span>
                    <span className="font-medium">
                      {format(new Date(project.startDate), "MMM d, yyyy")}
                    </span>
                  </div>
                )}

                {project.expectedLaunchDate && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Launch:</span>
                    <span className="font-medium">
                      {format(new Date(project.expectedLaunchDate), "MMM d, yyyy")}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Right Side - Team Contact */}
            {project.leadStrategist && (
              <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
                <CardContent className="p-4 space-y-4">
                  <div>
                    <p className="text-xs text-muted-foreground mb-2">
                      YOUR LEAD STRATEGIST
                    </p>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage
                          src={project.leadStrategist.avatarUrl || undefined}
                        />
                        <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-500 text-white">
                          {strategistInitials}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">
                          {project.leadStrategist.fullName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Lead Strategist
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <a
                      href={`mailto:${project.leadStrategist.email}`}
                      className="flex items-center gap-2 text-sm hover:text-purple-600 transition-colors"
                    >
                      <Mail className="h-4 w-4" />
                      <span>{project.leadStrategist.email}</span>
                    </a>

                    {project.leadStrategist.phoneNumber && (
                      <a
                        href={`tel:${project.leadStrategist.phoneNumber}`}
                        className="flex items-center gap-2 text-sm hover:text-purple-600 transition-colors"
                      >
                        <Phone className="h-4 w-4" />
                        <span>{project.leadStrategist.phoneNumber}</span>
                      </a>
                    )}
                  </div>

                  <Button variant="outline" size="sm" className="w-full" asChild>
                    <a href={`mailto:${project.leadStrategist.email}?subject=Question about ${project.projectName}`}>
                      <Mail className="mr-2 h-4 w-4" />
                      Send Message
                    </a>
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
