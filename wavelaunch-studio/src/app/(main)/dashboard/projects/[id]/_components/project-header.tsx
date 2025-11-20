/**
 * Project Header Component
 *
 * Displays project name, creator, status, and actions
 */

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MoreHorizontal, User } from "lucide-react";
import { format } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ProjectHeaderProps {
  project: {
    projectName: string;
    creatorName: string;
    category: string;
    status: string;
    startDate: Date;
    expectedLaunchDate: Date;
    leadStrategist: {
      fullName: string;
    };
  };
}

export function ProjectHeader({ project }: ProjectHeaderProps) {
  const statusColors: Record<string, string> = {
    ONBOARDING: "bg-slate-100 text-slate-800",
    DISCOVERY: "bg-blue-100 text-blue-800",
    BRANDING: "bg-purple-100 text-purple-800",
    PRODUCT_DEV: "bg-green-100 text-green-800",
    MANUFACTURING: "bg-yellow-100 text-yellow-800",
    WEBSITE: "bg-orange-100 text-orange-800",
    MARKETING: "bg-pink-100 text-pink-800",
    LAUNCH: "bg-red-100 text-red-800",
    COMPLETED: "bg-emerald-100 text-emerald-800",
    ARCHIVED: "bg-gray-100 text-gray-800",
  };

  return (
    <div className="flex items-start justify-between">
      <div className="space-y-3">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold">{project.projectName}</h1>
            <Badge className={`${statusColors[project.status]} border-0 font-medium`}>
              {project.status.replace("_", " ")}
            </Badge>
          </div>
          <p className="text-muted-foreground mt-1">
            Creator: {project.creatorName} • {project.category}
          </p>
        </div>

        <div className="flex items-center gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>Lead: {project.leadStrategist.fullName}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>Started: {format(project.startDate, "MMM d, yyyy")}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>Launch: {format(project.expectedLaunchDate, "MMM d, yyyy")}</span>
          </div>
        </div>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem disabled>Edit project details</DropdownMenuItem>
          <DropdownMenuItem disabled>Manage team</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem disabled>Export project data</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem disabled className="text-destructive">
            Archive project
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
