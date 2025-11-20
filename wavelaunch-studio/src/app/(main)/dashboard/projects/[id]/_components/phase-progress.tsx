/**
 * Phase Progress Component
 *
 * Visualizes project progress through 8 phases (M0-M7)
 */

"use client";

import { Badge } from "@/components/ui/badge";
import { CheckCircle, Circle, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

interface Phase {
  id: string;
  phaseName: string;
  phaseOrder: number;
  status: string;
  startDate: Date | null;
  endDate: Date | null;
}

interface PhaseProgressProps {
  phases: Phase[];
  status: string;
}

export function PhaseProgress({ phases, status }: PhaseProgressProps) {
  // Define all 8 phases in order
  const allPhases = [
    { order: 0, name: "M0: Onboarding", key: "ONBOARDING" },
    { order: 1, name: "M1: Discovery", key: "DISCOVERY" },
    { order: 2, name: "M2: Brand Identity", key: "BRANDING" },
    { order: 3, name: "M3: Visual Design", key: "BRANDING" },
    { order: 4, name: "M4: Product Development", key: "PRODUCT_DEV" },
    { order: 5, name: "M5: Manufacturing", key: "MANUFACTURING" },
    { order: 6, name: "M6: Website", key: "WEBSITE" },
    { order: 7, name: "M7: Marketing", key: "MARKETING" },
  ];

  // Map phases to their status
  const getPhaseStatus = (phaseOrder: number) => {
    const phase = phases.find((p) => p.phaseOrder === phaseOrder);
    if (!phase) return "locked";
    return phase.status.toLowerCase();
  };

  const getPhaseIcon = (phaseOrder: number) => {
    const status = getPhaseStatus(phaseOrder);
    if (status === "completed") {
      return <CheckCircle className="h-5 w-5 text-green-600" />;
    } else if (status === "in_progress") {
      return <Circle className="h-5 w-5 text-blue-600 fill-blue-600" />;
    } else {
      return <Lock className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getPhaseColor = (phaseOrder: number) => {
    const status = getPhaseStatus(phaseOrder);
    if (status === "completed") {
      return "bg-green-600";
    } else if (status === "in_progress") {
      return "bg-blue-600";
    } else {
      return "bg-muted";
    }
  };

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <div className="relative">
        {/* Background line */}
        <div className="absolute top-6 left-0 right-0 h-1 bg-muted" />

        {/* Phase dots and labels */}
        <div className="relative flex justify-between">
          {allPhases.map((phase, index) => {
            const status = getPhaseStatus(phase.order);
            const isCompleted = status === "completed";
            const isInProgress = status === "in_progress";
            const isLocked = status === "locked";

            return (
              <div key={phase.order} className="flex flex-col items-center flex-1">
                {/* Connector line */}
                {index > 0 && (
                  <div
                    className={cn(
                      "absolute h-1 top-6",
                      getPhaseColor(phase.order - 1)
                    )}
                    style={{
                      left: `${(index - 1) * (100 / (allPhases.length - 1))}%`,
                      width: `${100 / (allPhases.length - 1)}%`,
                    }}
                  />
                )}

                {/* Phase dot */}
                <div
                  className={cn(
                    "relative z-10 flex items-center justify-center w-12 h-12 rounded-full border-4 bg-background",
                    isCompleted && "border-green-600",
                    isInProgress && "border-blue-600",
                    isLocked && "border-muted"
                  )}
                >
                  {getPhaseIcon(phase.order)}
                </div>

                {/* Phase label */}
                <div className="mt-3 text-center max-w-[100px]">
                  <p
                    className={cn(
                      "text-xs font-medium",
                      isLocked && "text-muted-foreground"
                    )}
                  >
                    {phase.name}
                  </p>
                  {isInProgress && (
                    <Badge variant="default" className="mt-1 text-xs">
                      Active
                    </Badge>
                  )}
                  {isCompleted && (
                    <Badge variant="outline" className="mt-1 text-xs">
                      Done
                    </Badge>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Phase Summary */}
      <div className="flex items-center justify-between pt-4 border-t">
        <div className="flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <span className="text-muted-foreground">
              {phases.filter((p) => p.status === "COMPLETED").length} Completed
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Circle className="h-4 w-4 text-blue-600 fill-blue-600" />
            <span className="text-muted-foreground">
              {phases.filter((p) => p.status === "IN_PROGRESS").length} In Progress
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Lock className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">
              {8 - phases.length} Locked
            </span>
          </div>
        </div>

        <div className="text-sm text-muted-foreground">
          Overall Progress:{" "}
          <span className="font-medium">
            {Math.round((phases.filter((p) => p.status === "COMPLETED").length / 8) * 100)}%
          </span>
        </div>
      </div>
    </div>
  );
}
