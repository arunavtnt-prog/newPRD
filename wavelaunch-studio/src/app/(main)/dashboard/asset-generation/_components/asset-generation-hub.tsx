/**
 * Asset Generation Hub Component
 *
 * UI for triggering and monitoring AI asset generation
 */

"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sparkles, Palette, Type, FileText, Image, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { format } from "date-fns";

interface GenerationJob {
  id: string;
  jobType: string;
  status: string;
  createdAt: Date;
  project: {
    id: string;
    projectName: string;
    creatorName: string;
  };
}

interface Project {
  id: string;
  projectName: string;
  creatorName: string;
  discovery: { id: string } | null;
}

interface AssetGenerationHubProps {
  generationJobs: GenerationJob[];
  projects: Project[];
}

export function AssetGenerationHub({ generationJobs, projects }: AssetGenerationHubProps) {
  const router = useRouter();
  const [selectedProject, setSelectedProject] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);

  const assetTypes = [
    {
      id: "LOGO_GEN",
      title: "Logo Generation",
      description: "Generate AI-powered logo concepts",
      icon: Image,
      requiresDiscovery: true,
    },
    {
      id: "PALETTE_GEN",
      title: "Color Palette",
      description: "Generate brand color palettes",
      icon: Palette,
      requiresDiscovery: true,
    },
    {
      id: "TAGLINE_GEN",
      title: "Tagline Generation",
      description: "Generate brand tagline variations",
      icon: Type,
      requiresDiscovery: true,
    },
    {
      id: "TEMPLATE_GEN",
      title: "Template Generation",
      description: "Generate social media templates",
      icon: FileText,
      requiresDiscovery: false,
    },
  ];

  const handleGenerate = async (jobType: string) => {
    if (!selectedProject) {
      toast.error("Please select a project first");
      return;
    }

    const project = projects.find((p) => p.id === selectedProject);
    const assetType = assetTypes.find((a) => a.id === jobType);

    if (assetType?.requiresDiscovery && !project?.discovery) {
      toast.error("Project must complete Discovery phase first");
      return;
    }

    setIsGenerating(true);
    try {
      toast.info("Asset generation queued. This may take a few moments...");

      // Navigate to project page where generation happens
      router.push(`/dashboard/projects/${selectedProject}`);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to queue generation");
    } finally {
      setIsGenerating(false);
    }
  };

  const statusColors: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-800",
    PROCESSING: "bg-blue-100 text-blue-800",
    COMPLETED: "bg-green-100 text-green-800",
    FAILED: "bg-red-100 text-red-800",
  };

  const statusIcons: Record<string, any> = {
    PENDING: Clock,
    PROCESSING: Loader2,
    COMPLETED: CheckCircle2,
    FAILED: XCircle,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Asset Generation</h1>
        <p className="text-muted-foreground mt-2">
          Generate AI-powered brand assets for your projects
        </p>
      </div>

      <Tabs defaultValue="generate" className="space-y-4">
        <TabsList>
          <TabsTrigger value="generate">Generate Assets</TabsTrigger>
          <TabsTrigger value="history">Generation History</TabsTrigger>
        </TabsList>

        <TabsContent value="generate" className="space-y-4">
          {/* Project Selector */}
          <Card>
            <CardHeader>
              <CardTitle>Select Project</CardTitle>
              <CardDescription>
                Choose a project to generate assets for
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Select value={selectedProject} onValueChange={setSelectedProject}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a project" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.projectName} - {project.creatorName}
                      {!project.discovery && " (No Discovery)"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Asset Type Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {assetTypes.map((assetType) => {
              const Icon = assetType.icon;
              const project = projects.find((p) => p.id === selectedProject);
              const disabled = assetType.requiresDiscovery && !project?.discovery;

              return (
                <Card key={assetType.id} className={disabled ? "opacity-50" : ""}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-base">{assetType.title}</CardTitle>
                          <CardDescription className="text-sm mt-1">
                            {assetType.description}
                          </CardDescription>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Button
                      onClick={() => handleGenerate(assetType.id)}
                      disabled={!selectedProject || disabled || isGenerating}
                      className="w-full"
                    >
                      <Sparkles className="h-4 w-4 mr-2" />
                      Generate
                    </Button>
                    {assetType.requiresDiscovery && (
                      <p className="text-xs text-muted-foreground mt-2">
                        * Requires completed Discovery phase
                      </p>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          {generationJobs.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center text-muted-foreground">
                <Sparkles className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No generation history yet</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {generationJobs.map((job) => {
                const StatusIcon = statusIcons[job.status];
                return (
                  <Card key={job.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium">{job.jobType.replace(/_/g, " ")}</h3>
                            <Badge className={statusColors[job.status]} variant="outline">
                              {job.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {job.project.projectName} • {format(new Date(job.createdAt), "MMM d, yyyy HH:mm")}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => router.push(`/dashboard/projects/${job.project.id}`)}
                        >
                          View Project
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
