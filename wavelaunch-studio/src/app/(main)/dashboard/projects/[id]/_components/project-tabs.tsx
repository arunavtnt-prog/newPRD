/**
 * Project Tabs Component
 *
 * Tabbed interface for different project sections
 */

"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProjectOverview } from "./project-overview";
import { ProjectFiles } from "./project-files";
import { ProjectApprovals } from "./project-approvals";
import { DiscoveryWorkspace } from "./discovery-workspace";
import { BrandingWorkspace } from "./branding-workspace";
import { ProductWorkspace } from "./product-workspace";
import { ManufacturingWorkspace } from "./manufacturing-workspace";
import { WebsiteWorkspace } from "./website-workspace";
import { MarketingWorkspace } from "./marketing-workspace";
import { LaunchDashboard } from "./launch-dashboard";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CheckCircle2, Circle, Lock } from "lucide-react";

interface ProjectTabsProps {
  project: any; // We'll properly type this later
  availableReviewers: Array<{
    id: string;
    fullName: string;
    email: string;
  }>;
  currentUserId: string;
}

export function ProjectTabs({
  project,
  availableReviewers,
  currentUserId,
}: ProjectTabsProps) {
  // Get phases grouped by milestone
  const phases = project.phases || [];

  // Get pending approvals count
  const pendingApprovalsCount =
    project.approvals?.filter((a: any) => a.status === "PENDING").length || 0;

  // Define available tabs based on project phases
  const phaseTabs = [
    { value: "overview", label: "Overview", icon: null },
    { value: "files", label: "Files", icon: null, alwaysEnabled: true },
    { value: "approvals", label: "Approvals", icon: null, alwaysEnabled: true },
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
      <TooltipProvider>
        <TabsList className="w-full justify-start overflow-x-auto h-auto flex-wrap gap-1">
          {phaseTabs.map((tab: any) => {
            // Check if this phase exists and is unlocked
            const phase = phases.find((p: any) =>
              p.phaseName.toUpperCase().includes(tab.phaseKey || "")
            );
            const isActive = phase?.status === "IN_PROGRESS";
            const isCompleted = phase?.status === "COMPLETED";
            const isLocked = !phase || phase.status === "LOCKED";

            // Some tabs are always enabled (overview, files)
            const isDisabled = !tab.alwaysEnabled && tab.value !== "overview" && isLocked;

            // Build status text for tooltip
            let statusText = "Not started";
            if (isCompleted) statusText = "Completed";
            else if (isActive) statusText = "In progress";
            else if (isLocked && tab.phaseKey) statusText = "Locked";

            // Determine border color based on status (subtle indicator)
            let borderClass = "";
            if (isActive) borderClass = "border-b-2 border-b-blue-500";
            else if (isCompleted) borderClass = "border-b-2 border-b-green-500";

            return (
              <Tooltip key={tab.value}>
                <TooltipTrigger asChild>
                  <TabsTrigger
                    value={tab.value}
                    disabled={isDisabled}
                    className={`relative ${borderClass}`}
                  >
                    <span className="flex items-center gap-2">
                      {/* Status icon (small, subtle) */}
                      {tab.phaseKey && (
                        <>
                          {isCompleted && (
                            <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
                          )}
                          {isActive && (
                            <Circle className="h-3.5 w-3.5 text-blue-600 fill-blue-600" />
                          )}
                          {isLocked && (
                            <Lock className="h-3.5 w-3.5 text-muted-foreground" />
                          )}
                          {!isCompleted && !isActive && !isLocked && (
                            <Circle className="h-3.5 w-3.5 text-muted-foreground" />
                          )}
                        </>
                      )}

                      {tab.label}

                      {/* Keep useful counts - they're informational, not status */}
                      {tab.value === "files" && project.files && project.files.length > 0 && (
                        <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
                          {project.files.length}
                        </Badge>
                      )}
                      {tab.value === "approvals" && pendingApprovalsCount > 0 && (
                        <Badge variant="destructive" className="ml-1 h-5 px-1.5 text-xs">
                          {pendingApprovalsCount}
                        </Badge>
                      )}
                    </span>
                  </TabsTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="text-sm">
                    <p className="font-medium">{tab.label}</p>
                    {tab.phaseKey && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Status: {statusText}
                      </p>
                    )}
                  </div>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </TabsList>
      </TooltipProvider>

      <TabsContent value="overview" className="space-y-6 mt-6">
        <ProjectOverview project={project} />
      </TabsContent>

      <TabsContent value="files" className="space-y-6 mt-6">
        <ProjectFiles projectId={project.id} files={project.files || []} />
      </TabsContent>

      <TabsContent value="approvals" className="space-y-6 mt-6">
        <ProjectApprovals
          projectId={project.id}
          approvals={project.approvals || []}
          availableReviewers={availableReviewers}
          currentUserId={currentUserId}
        />
      </TabsContent>

      <TabsContent value="discovery" className="space-y-6 mt-6">
        <DiscoveryWorkspace
          projectId={project.id}
          discoveryData={project.discovery}
          references={
            project.files?.filter(
              (f: any) => f.folder === "QUESTIONNAIRE_REFS" && !f.isDeleted
            ) || []
          }
        />
      </TabsContent>

      <TabsContent value="branding" className="space-y-6 mt-6">
        <BrandingWorkspace
          projectId={project.id}
          projectName={project.projectName}
          colorPalettes={project.colorPalettes || []}
          logos={
            project.files?.filter(
              (f: any) => f.folder === "GENERATED_LOGOS" && !f.isDeleted
            ) || []
          }
          typography={project.typography}
          discovery={project.discovery}
        />
      </TabsContent>

      <TabsContent value="product" className="space-y-6 mt-6">
        <ProductWorkspace
          projectId={project.id}
          projectName={project.projectName}
          productSKUs={project.productSKUs || []}
        />
      </TabsContent>

      <TabsContent value="manufacturing" className="space-y-6 mt-6">
        <ManufacturingWorkspace
          projectId={project.id}
          projectName={project.projectName}
          vendors={project.vendors || []}
          purchaseOrders={project.purchaseOrders || []}
        />
      </TabsContent>

      <TabsContent value="website" className="space-y-6 mt-6">
        <WebsiteWorkspace
          projectId={project.id}
          projectName={project.projectName}
          websiteConfig={project.websiteConfig}
          websitePages={project.websitePages || []}
          copySnippets={project.copySnippets || []}
          colorPalettes={project.colorPalettes || []}
          typography={project.typography}
        />
      </TabsContent>

      <TabsContent value="marketing" className="space-y-6 mt-6">
        <MarketingWorkspace
          projectId={project.id}
          projectName={project.projectName}
          campaigns={project.campaigns || []}
          contentPosts={project.contentPosts || []}
          adCreatives={project.adCreatives || []}
          launchTasks={project.launchTasks || []}
          influencers={project.influencers || []}
          ugcSubmissions={project.ugcSubmissions || []}
        />
      </TabsContent>

      <TabsContent value="launch" className="space-y-6 mt-6">
        <LaunchDashboard project={project} />
      </TabsContent>
    </Tabs>
  );
}
