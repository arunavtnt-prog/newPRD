/**
 * Project Tabs Component
 *
 * Tabbed interface for different project sections
 */

"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProjectOverview } from "./project-overview";
import { Badge } from "@/components/ui/badge";

interface ProjectTabsProps {
  project: any; // We'll properly type this later
}

export function ProjectTabs({ project }: ProjectTabsProps) {
  // Get phases grouped by milestone
  const phases = project.phases || [];

  // Define available tabs based on project phases
  const phaseTabs = [
    { value: "overview", label: "Overview", icon: null },
    { value: "discovery", label: "Discovery (M1)", icon: null, phaseKey: "DISCOVERY" },
    { value: "branding", label: "Branding (M2-M3)", icon: null, phaseKey: "BRANDING" },
    { value: "product", label: "Product (M4-M5)", icon: null, phaseKey: "PRODUCT_DEV" },
    { value: "manufacturing", label: "Manufacturing (M6)", icon: null, phaseKey: "MANUFACTURING" },
    { value: "website", label: "Website (M7)", icon: null, phaseKey: "WEBSITE" },
    { value: "marketing", label: "Marketing (M8)", icon: null, phaseKey: "MARKETING" },
    { value: "launch", label: "Launch", icon: null, phaseKey: "LAUNCH" },
  ];

  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className="w-full justify-start overflow-x-auto h-auto flex-wrap">
        {phaseTabs.map((tab) => {
          // Check if this phase exists and is unlocked
          const phase = phases.find((p: any) =>
            p.phaseName.toUpperCase().includes(tab.phaseKey || "")
          );
          const isActive = phase?.status === "IN_PROGRESS";
          const isCompleted = phase?.status === "COMPLETED";
          const isLocked = !phase || phase.status === "LOCKED";

          return (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              disabled={tab.value !== "overview" && isLocked}
              className="relative"
            >
              {tab.label}
              {isActive && (
                <Badge variant="default" className="ml-2 h-5 px-1.5 text-xs">
                  Active
                </Badge>
              )}
              {isCompleted && (
                <Badge variant="outline" className="ml-2 h-5 px-1.5 text-xs">
                  Done
                </Badge>
              )}
            </TabsTrigger>
          );
        })}
      </TabsList>

      <TabsContent value="overview" className="space-y-6 mt-6">
        <ProjectOverview project={project} />
      </TabsContent>

      <TabsContent value="discovery" className="space-y-6 mt-6">
        <div className="text-center py-12 border rounded-lg bg-muted/30">
          <p className="text-muted-foreground">Discovery phase content coming soon</p>
        </div>
      </TabsContent>

      <TabsContent value="branding" className="space-y-6 mt-6">
        <div className="text-center py-12 border rounded-lg bg-muted/30">
          <p className="text-muted-foreground">Branding phase content coming soon</p>
        </div>
      </TabsContent>

      <TabsContent value="product" className="space-y-6 mt-6">
        <div className="text-center py-12 border rounded-lg bg-muted/30">
          <p className="text-muted-foreground">Product development content coming soon</p>
        </div>
      </TabsContent>

      <TabsContent value="manufacturing" className="space-y-6 mt-6">
        <div className="text-center py-12 border rounded-lg bg-muted/30">
          <p className="text-muted-foreground">Manufacturing phase content coming soon</p>
        </div>
      </TabsContent>

      <TabsContent value="website" className="space-y-6 mt-6">
        <div className="text-center py-12 border rounded-lg bg-muted/30">
          <p className="text-muted-foreground">Website phase content coming soon</p>
        </div>
      </TabsContent>

      <TabsContent value="marketing" className="space-y-6 mt-6">
        <div className="text-center py-12 border rounded-lg bg-muted/30">
          <p className="text-muted-foreground">Marketing phase content coming soon</p>
        </div>
      </TabsContent>

      <TabsContent value="launch" className="space-y-6 mt-6">
        <div className="text-center py-12 border rounded-lg bg-muted/30">
          <p className="text-muted-foreground">Launch phase content coming soon</p>
        </div>
      </TabsContent>
    </Tabs>
  );
}
