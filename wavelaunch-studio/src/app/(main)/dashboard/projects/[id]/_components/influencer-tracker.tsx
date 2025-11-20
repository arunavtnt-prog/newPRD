/**
 * Influencer Tracker Component
 *
 * Track influencers and UGC submissions
 */

"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Star, Plus } from "lucide-react";

interface InfluencerTrackerProps {
  projectId: string;
  influencers: any[];
  ugcSubmissions: any[];
}

const STATUS_COLORS: Record<string, string> = {
  PROSPECTING: "secondary",
  CONTACTED: "default",
  CONTRACTED: "default",
  POSTED: "default",
  COMPLETED: "outline",
};

export function InfluencerTracker({
  projectId,
  influencers,
  ugcSubmissions,
}: InfluencerTrackerProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold">Influencers & UGC</h3>
        <p className="text-sm text-muted-foreground">
          Track partnerships and user-generated content
        </p>
      </div>

      <Tabs defaultValue="influencers">
        <TabsList>
          <TabsTrigger value="influencers">
            Influencers ({influencers.length})
          </TabsTrigger>
          <TabsTrigger value="ugc">
            UGC Submissions ({ugcSubmissions.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="influencers" className="space-y-4 mt-4">
          {influencers.length > 0 ? (
            influencers.map((influencer) => (
              <Card key={influencer.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h5 className="font-semibold">{influencer.name}</h5>
                        <Badge variant={STATUS_COLORS[influencer.status] as any}>
                          {influencer.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        @{influencer.handle} • {influencer.platform}
                      </p>
                      {influencer.followerCount && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {influencer.followerCount.toLocaleString()} followers
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16">
                <Users className="h-16 w-16 text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-medium mb-2">No influencers yet</h3>
                <p className="text-muted-foreground text-center max-w-sm mb-6">
                  Start tracking influencer partnerships
                </p>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Influencer
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="ugc" className="space-y-4 mt-4">
          {ugcSubmissions.length > 0 ? (
            ugcSubmissions.map((ugc) => (
              <Card key={ugc.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h5 className="font-semibold">{ugc.submitterName}</h5>
                        <Badge>{ugc.status}</Badge>
                      </div>
                      {ugc.submitterHandle && (
                        <p className="text-sm text-muted-foreground">
                          @{ugc.submitterHandle} • {ugc.platform}
                        </p>
                      )}
                      {ugc.caption && (
                        <p className="text-sm mt-2">{ugc.caption}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16">
                <Star className="h-16 w-16 text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-medium mb-2">No UGC yet</h3>
                <p className="text-muted-foreground text-center max-w-sm mb-6">
                  User-generated content submissions will appear here
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
