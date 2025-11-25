/**
 * Brand Discovery Workspace Component
 *
 * M1 Phase - Captures brand vision, references, audience, and strategy
 */

"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  Users,
  MessageCircle,
  FileText,
  Image as ImageIcon,
  Lightbulb,
} from "lucide-react";
import { DiscoveryQuestionnaire } from "./discovery-questionnaire";
import { ReferenceUpload } from "./reference-upload";
import { AudienceBuilder } from "./audience-builder";
import { ToneVoiceSelector } from "./tone-voice-selector";
import { BrandNamingGenerator } from "./brand-naming-generator";

interface DiscoveryWorkspaceProps {
  projectId: string;
  discoveryData?: any; // Will properly type later
  references?: any[]; // Will properly type later
}

export function DiscoveryWorkspace({
  projectId,
  discoveryData,
  references = [],
}: DiscoveryWorkspaceProps) {
  const [activeTab, setActiveTab] = React.useState("questionnaire");

  // Calculate completion percentage
  const getCompletionPercentage = () => {
    // This will be calculated based on filled fields
    return 35; // Placeholder
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold">Brand Discovery</h2>
          <p className="text-muted-foreground">
            M1: Define brand vision, audience, and strategic direction
          </p>
        </div>
        <Badge variant="secondary" className="text-sm">
          {getCompletionPercentage()}% Complete
        </Badge>
      </div>

      {/* Progress Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {discoveryData ? "28" : "0"}
                </p>
                <p className="text-xs text-muted-foreground">Questions</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                <ImageIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{references.length}</p>
                <p className="text-xs text-muted-foreground">References</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-green-100 dark:bg-green-900 flex items-center justify-center">
                <Users className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {discoveryData ? "100" : "0"}%
                </p>
                <p className="text-xs text-muted-foreground">Audience</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-amber-100 dark:bg-amber-900 flex items-center justify-center">
                <MessageCircle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {discoveryData?.toneOfVoice
                    ? discoveryData.toneOfVoice.charAt(0) +
                      discoveryData.toneOfVoice.slice(1).toLowerCase()
                    : "—"}
                </p>
                <p className="text-xs text-muted-foreground">Tone</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabbed Interface */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full justify-start">
          <TabsTrigger value="questionnaire">
            <FileText className="h-4 w-4 mr-2" />
            Questionnaire
          </TabsTrigger>
          <TabsTrigger value="references">
            <ImageIcon className="h-4 w-4 mr-2" />
            References
          </TabsTrigger>
          <TabsTrigger value="naming">
            <Lightbulb className="h-4 w-4 mr-2" />
            Naming
          </TabsTrigger>
          <TabsTrigger value="audience">
            <Users className="h-4 w-4 mr-2" />
            Audience
          </TabsTrigger>
          <TabsTrigger value="tone">
            <MessageCircle className="h-4 w-4 mr-2" />
            Tone & Voice
          </TabsTrigger>
        </TabsList>

        <TabsContent value="questionnaire" className="space-y-4 mt-6">
          <DiscoveryQuestionnaire
            projectId={projectId}
            initialData={discoveryData}
          />
        </TabsContent>

        <TabsContent value="references" className="space-y-4 mt-6">
          <ReferenceUpload projectId={projectId} references={references} />
        </TabsContent>

        <TabsContent value="naming" className="space-y-4 mt-6">
          <BrandNamingGenerator
            projectId={projectId}
            discoveryData={discoveryData}
          />
        </TabsContent>

        <TabsContent value="audience" className="space-y-4 mt-6">
          <AudienceBuilder
            projectId={projectId}
            initialData={discoveryData}
            discoveryData={discoveryData}
          />
        </TabsContent>

        <TabsContent value="tone" className="space-y-4 mt-6">
          <ToneVoiceSelector
            projectId={projectId}
            initialData={discoveryData}
            discoveryData={discoveryData}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
