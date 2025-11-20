/**
 * Website Workspace Component
 *
 * M7 Phase: Website Build and Content Creation
 */

"use client";

import * as React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Globe, FileText, Pencil } from "lucide-react";
import { ThemeSelector } from "./theme-selector";
import { PageBuilder } from "./page-builder";
import { CopywritingAssistant } from "./copywriting-assistant";

interface WebsiteWorkspaceProps {
  projectId: string;
  projectName: string;
  websiteConfig: any;
  websitePages: any[];
  copySnippets: any[];
  colorPalettes: any[];
  typography: any;
}

export function WebsiteWorkspace({
  projectId,
  projectName,
  websiteConfig,
  websitePages,
  copySnippets,
  colorPalettes,
  typography,
}: WebsiteWorkspaceProps) {
  const publishedPages = websitePages.filter((p) => p.isPublished).length;
  const approvedSnippets = copySnippets.filter((s) => s.isApproved).length;
  const websiteStatus = websiteConfig?.status || "PLANNING";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold mb-2">Website Build</h2>
        <p className="text-muted-foreground">
          Build your brand's online presence with theme selection, page builder,
          and AI-powered copywriting
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Globe className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Website Status</p>
                <p className="text-2xl font-bold">
                  {websiteStatus.replace("_", " ")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-500/10 rounded-lg">
                <FileText className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pages</p>
                <p className="text-2xl font-bold">
                  {publishedPages}/{websitePages.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-500/10 rounded-lg">
                <Pencil className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Copy Snippets</p>
                <p className="text-2xl font-bold">
                  {approvedSnippets}/{copySnippets.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Workspace Tabs */}
      <Tabs defaultValue="theme" className="space-y-6">
        <TabsList>
          <TabsTrigger value="theme">Theme</TabsTrigger>
          <TabsTrigger value="pages">Pages</TabsTrigger>
          <TabsTrigger value="copywriting">Copywriting</TabsTrigger>
        </TabsList>

        <TabsContent value="theme" className="space-y-6">
          <ThemeSelector
            projectId={projectId}
            websiteConfig={websiteConfig}
            colorPalettes={colorPalettes}
            typography={typography}
          />
        </TabsContent>

        <TabsContent value="pages" className="space-y-6">
          <PageBuilder
            projectId={projectId}
            websitePages={websitePages}
          />
        </TabsContent>

        <TabsContent value="copywriting" className="space-y-6">
          <CopywritingAssistant
            projectId={projectId}
            projectName={projectName}
            copySnippets={copySnippets}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
