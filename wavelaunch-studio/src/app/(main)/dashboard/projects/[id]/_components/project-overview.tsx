/**
 * Project Overview Component
 *
 * Displays project overview with phase progress, team, and activity
 */

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  FileText,
  Image as ImageIcon,
  CheckCircle,
  Clock,
  MessageSquare,
  Users,
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { PhaseProgress } from "./phase-progress";

interface ProjectOverviewProps {
  project: any;
}

export function ProjectOverview({ project }: ProjectOverviewProps) {
  // Quick stats
  const stats = [
    {
      label: "Files",
      value: project.files?.length || 0,
      icon: FileText,
      color: "text-blue-600",
    },
    {
      label: "Assets",
      value: project.assets?.length || 0,
      icon: ImageIcon,
      color: "text-purple-600",
    },
    {
      label: "Approvals",
      value: project.approvals?.filter((a: any) => a.status === "PENDING").length || 0,
      icon: CheckCircle,
      color: "text-green-600",
    },
    {
      label: "Comments",
      value: project.comments?.length || 0,
      icon: MessageSquare,
      color: "text-orange-600",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Phase Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Project Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <PhaseProgress phases={project.phases || []} status={project.status} />
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-muted ${stat.color}`}>
                  <stat.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Project Details */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Project Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Category</p>
                <p className="text-base mt-1">{project.category}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Status</p>
                <Badge className="mt-1">{project.status.replace("_", " ")}</Badge>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Start Date</p>
                <p className="text-base mt-1">
                  {format(new Date(project.startDate), "MMM d, yyyy")}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Expected Launch</p>
                <p className="text-base mt-1">
                  {format(new Date(project.expectedLaunchDate), "MMM d, yyyy")}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Budget</p>
                <p className="text-base mt-1">
                  {project.budget
                    ? new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                      }).format(Number(project.budget))
                    : "Not set"}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Last Updated</p>
                <p className="text-base mt-1">
                  {formatDistanceToNow(new Date(project.updatedAt), { addSuffix: true })}
                </p>
              </div>
            </div>

            {project.description && (
              <div className="pt-4 border-t">
                <p className="text-sm font-medium text-muted-foreground mb-2">Description</p>
                <p className="text-sm leading-relaxed">{project.description}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Team Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Team
              </CardTitle>
              <Button variant="ghost" size="sm" disabled>
                Manage
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* Lead Strategist */}
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={project.leadStrategist?.avatarUrl || undefined} />
                <AvatarFallback>
                  {project.leadStrategist?.fullName
                    .split(" ")
                    .map((n: string) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {project.leadStrategist?.fullName}
                </p>
                <p className="text-xs text-muted-foreground">Lead Strategist</p>
              </div>
            </div>

            {/* Creator */}
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarFallback>
                  {project.creatorName
                    .split(" ")
                    .map((n: string) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{project.creatorName}</p>
                <p className="text-xs text-muted-foreground">Creator</p>
              </div>
            </div>

            <div className="pt-3 border-t">
              <Button variant="outline" size="sm" className="w-full" disabled>
                Add Team Member
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Activity</CardTitle>
            <Button variant="ghost" size="sm" disabled>
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {project.comments && project.comments.length > 0 ? (
            <div className="space-y-4">
              {project.comments.slice(0, 5).map((comment: any) => (
                <div key={comment.id} className="flex gap-3 pb-4 border-b last:border-0">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={comment.author?.avatarUrl || undefined} />
                    <AvatarFallback>
                      {comment.author?.fullName
                        .split(" ")
                        .map((n: string) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">{comment.author?.fullName}</p>
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(comment.createdAt), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{comment.content}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Clock className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
              <p className="text-sm text-muted-foreground">No activity yet</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
