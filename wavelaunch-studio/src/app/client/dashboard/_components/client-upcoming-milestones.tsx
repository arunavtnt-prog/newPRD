"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock } from "lucide-react";
import { format, isBefore, addDays } from "date-fns";

interface Project {
  id: string;
  projectName: string;
  expectedLaunchDate: Date | null;
}

interface ClientUpcomingMilestonesProps {
  projects: Project[];
}

export function ClientUpcomingMilestones({
  projects,
}: ClientUpcomingMilestonesProps) {
  // Filter projects with upcoming launch dates
  const upcomingMilestones = projects
    .filter((p) => p.expectedLaunchDate)
    .map((p) => ({
      ...p,
      daysUntil: Math.ceil(
        (new Date(p.expectedLaunchDate!).getTime() - new Date().getTime()) /
          (1000 * 60 * 60 * 24)
      ),
    }))
    .sort((a, b) => a.daysUntil - b.daysUntil)
    .slice(0, 5);

  if (upcomingMilestones.length === 0) {
    return (
      <Card className="border-purple-100">
        <CardHeader>
          <CardTitle className="text-lg">Upcoming Milestones</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Calendar className="h-8 w-8 mx-auto mb-2" />
            <p className="text-sm">No upcoming milestones</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-purple-100">
      <CardHeader>
        <CardTitle className="text-lg">Upcoming Milestones</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {upcomingMilestones.map((milestone) => {
            const isUrgent = milestone.daysUntil <= 7;
            const isPast = milestone.daysUntil < 0;

            return (
              <div
                key={milestone.id}
                className="p-3 rounded-lg border border-purple-100 hover:bg-purple-50/50 transition-colors"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h4 className="font-medium text-sm line-clamp-1">
                    {milestone.projectName}
                  </h4>
                  {isUrgent && !isPast && (
                    <Badge variant="destructive" className="text-xs">
                      Urgent
                    </Badge>
                  )}
                  {isPast && (
                    <Badge variant="secondary" className="text-xs">
                      Overdue
                    </Badge>
                  )}
                </div>

                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {isPast ? (
                    <span className="text-red-600 font-medium">
                      {Math.abs(milestone.daysUntil)} days overdue
                    </span>
                  ) : (
                    <span>
                      {milestone.daysUntil === 0
                        ? "Due today"
                        : milestone.daysUntil === 1
                        ? "Due tomorrow"
                        : `${milestone.daysUntil} days`}
                    </span>
                  )}
                </div>

                <p className="text-xs text-muted-foreground mt-1">
                  Launch Date:{" "}
                  {format(new Date(milestone.expectedLaunchDate!), "MMM d, yyyy")}
                </p>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
