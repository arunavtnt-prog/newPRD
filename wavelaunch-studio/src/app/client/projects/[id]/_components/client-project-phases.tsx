"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Circle, Clock } from "lucide-react";
import { format } from "date-fns";

interface Phase {
  id: string;
  phaseName: string;
  phaseNumber: number;
  status: string;
  startDate: Date | null;
  endDate: Date | null;
  targetCompletionDate: Date | null;
  description: string | null;
}

interface ClientProjectPhasesProps {
  phases: Phase[];
}

const phaseStatusIcons: Record<string, React.ElementType> = {
  NOT_STARTED: Circle,
  IN_PROGRESS: Clock,
  COMPLETED: CheckCircle2,
  ON_HOLD: Circle,
};

const phaseStatusColors: Record<string, string> = {
  NOT_STARTED: "text-gray-400",
  IN_PROGRESS: "text-yellow-500",
  COMPLETED: "text-green-500",
  ON_HOLD: "text-gray-300",
};

export function ClientProjectPhases({ phases }: ClientProjectPhasesProps) {
  const completedPhases = phases.filter((p) => p.status === "COMPLETED").length;
  const totalPhases = phases.length;
  const progress = totalPhases > 0 ? (completedPhases / totalPhases) * 100 : 0;

  if (phases.length === 0) {
    return (
      <Card className="border-purple-100">
        <CardContent className="p-12 text-center text-muted-foreground">
          No phases have been created yet.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-purple-100">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Project Phases</CardTitle>
          <Badge variant="outline" className="text-sm">
            {completedPhases} of {totalPhases} Complete
          </Badge>
        </div>
        <Progress value={progress} className="mt-4 h-2" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {phases.map((phase, index) => {
            const Icon = phaseStatusIcons[phase.status] || Circle;
            const iconColor = phaseStatusColors[phase.status] || "text-gray-400";

            return (
              <div
                key={phase.id}
                className="flex gap-4 p-4 rounded-lg border border-purple-100 hover:bg-purple-50/50 transition-colors"
              >
                {/* Icon */}
                <div className="flex flex-col items-center">
                  <div
                    className={`${iconColor} ${
                      phase.status === "COMPLETED" ? "fill-current" : ""
                    }`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  {index < phases.length - 1 && (
                    <div className="w-px h-full bg-purple-200 mt-2" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold">
                        Phase {phase.phaseNumber}: {phase.phaseName}
                      </h3>
                      {phase.description && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {phase.description}
                        </p>
                      )}
                    </div>
                    <Badge
                      variant="outline"
                      className={
                        phase.status === "COMPLETED"
                          ? "bg-green-100 text-green-700 border-green-200"
                          : phase.status === "IN_PROGRESS"
                          ? "bg-yellow-100 text-yellow-700 border-yellow-200"
                          : "bg-gray-100 text-gray-700 border-gray-200"
                      }
                    >
                      {phase.status.replace("_", " ")}
                    </Badge>
                  </div>

                  {/* Dates */}
                  <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                    {phase.startDate && (
                      <span>
                        Started: {format(new Date(phase.startDate), "MMM d, yyyy")}
                      </span>
                    )}
                    {phase.endDate && (
                      <span>
                        Completed: {format(new Date(phase.endDate), "MMM d, yyyy")}
                      </span>
                    )}
                    {phase.targetCompletionDate && !phase.endDate && (
                      <span>
                        Target: {format(new Date(phase.targetCompletionDate), "MMM d, yyyy")}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
