/**
 * Marketing Workspace Component
 *
 * M8 Phase: Marketing & Launch Planning
 */

"use client";

import * as React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Megaphone, CheckSquare, Users, Star, Target } from "lucide-react";
import { CampaignManager } from "./campaign-manager";
import { ContentCalendar } from "./content-calendar";
import { AdCreativeManager } from "./ad-creative-manager";
import { LaunchChecklist } from "./launch-checklist";
import { InfluencerTrackerFull } from "./influencer-tracker-full";

interface MarketingWorkspaceProps {
  projectId: string;
  projectName: string;
  campaigns: any[];
  contentPosts: any[];
  adCreatives: any[];
  launchTasks: any[];
  influencers: any[];
  ugcSubmissions: any[];
}

export function MarketingWorkspace({
  projectId,
  projectName,
  campaigns,
  contentPosts,
  adCreatives,
  launchTasks,
  influencers,
  ugcSubmissions,
}: MarketingWorkspaceProps) {
  const activeCampaigns = campaigns.filter((c) => c.status === "ACTIVE").length;
  const scheduledPosts = contentPosts.filter((p) => p.status === "SCHEDULED").length;
  const activeAds = adCreatives.filter((a) => a.status === "ACTIVE").length;
  const completedTasks = launchTasks.filter((t) => t.status === "COMPLETED").length;
  const totalTasks = launchTasks.length;
  const launchProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold mb-2">Marketing & Launch</h2>
        <p className="text-muted-foreground">
          Plan campaigns, schedule content, manage ads, and track your launch progress
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Megaphone className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Campaigns</p>
                <p className="text-2xl font-bold">{activeCampaigns}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-500/10 rounded-lg">
                <Calendar className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Scheduled Posts</p>
                <p className="text-2xl font-bold">{scheduledPosts}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-500/10 rounded-lg">
                <Star className="h-6 w-6 text-purple-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Ads</p>
                <p className="text-2xl font-bold">{activeAds}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-500/10 rounded-lg">
                <CheckSquare className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Launch Progress</p>
                <p className="text-2xl font-bold">{launchProgress}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Workspace Tabs */}
      <Tabs defaultValue="campaigns" className="space-y-6">
        <TabsList>
          <TabsTrigger value="campaigns">
            <Target className="h-4 w-4 mr-2" />
            Campaigns
          </TabsTrigger>
          <TabsTrigger value="calendar">
            <Calendar className="h-4 w-4 mr-2" />
            Content Calendar
          </TabsTrigger>
          <TabsTrigger value="ads">
            <Megaphone className="h-4 w-4 mr-2" />
            Ad Creatives
          </TabsTrigger>
          <TabsTrigger value="launch">
            <CheckSquare className="h-4 w-4 mr-2" />
            Launch Checklist
          </TabsTrigger>
          <TabsTrigger value="influencers">
            <Users className="h-4 w-4 mr-2" />
            Influencers & UGC
          </TabsTrigger>
        </TabsList>

        <TabsContent value="campaigns" className="space-y-6">
          <CampaignManager
            projectId={projectId}
            campaigns={campaigns}
          />
        </TabsContent>

        <TabsContent value="calendar" className="space-y-6">
          <ContentCalendar
            projectId={projectId}
            campaigns={campaigns}
            contentPosts={contentPosts}
          />
        </TabsContent>

        <TabsContent value="ads" className="space-y-6">
          <AdCreativeManager
            projectId={projectId}
            campaigns={campaigns}
            adCreatives={adCreatives}
          />
        </TabsContent>

        <TabsContent value="launch" className="space-y-6">
          <LaunchChecklist
            projectId={projectId}
            launchTasks={launchTasks}
          />
        </TabsContent>

        <TabsContent value="influencers" className="space-y-6">
          <InfluencerTrackerFull
            projectId={projectId}
            influencers={influencers}
            ugcSubmissions={ugcSubmissions}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
