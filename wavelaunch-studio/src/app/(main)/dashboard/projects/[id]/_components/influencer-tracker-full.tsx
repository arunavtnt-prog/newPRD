/**
 * Influencer Tracker Component (Full CRUD)
 *
 * Track influencers and UGC submissions with full management
 */

"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Star, Plus, Edit, Trash2, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

interface InfluencerTrackerProps {
  projectId: string;
  influencers: any[];
  ugcSubmissions: any[];
}

const PLATFORMS = [
  { value: "INSTAGRAM", label: "Instagram" },
  { value: "FACEBOOK", label: "Facebook" },
  { value: "TIKTOK", label: "TikTok" },
  { value: "TWITTER", label: "Twitter" },
  { value: "LINKEDIN", label: "LinkedIn" },
  { value: "PINTEREST", label: "Pinterest" },
  { value: "YOUTUBE", label: "YouTube" },
];

const PARTNERSHIP_TYPES = [
  { value: "GIFTED_PRODUCT", label: "Gifted Product" },
  { value: "PAID_POST", label: "Paid Post" },
  { value: "AFFILIATE", label: "Affiliate" },
  { value: "BRAND_AMBASSADOR", label: "Brand Ambassador" },
  { value: "EVENT_COLLABORATION", label: "Event Collaboration" },
];

const STATUS_COLORS: Record<string, string> = {
  PROSPECTING: "secondary",
  CONTACTED: "default",
  NEGOTIATING: "default",
  CONTRACTED: "default",
  CONTENT_PENDING: "default",
  POSTED: "default",
  COMPLETED: "outline",
  DECLINED: "destructive",
};

export function InfluencerTrackerFull({
  projectId,
  influencers,
  ugcSubmissions,
}: InfluencerTrackerProps) {
  const { toast } = useToast();
  const [isInfluencerDialogOpen, setIsInfluencerDialogOpen] = React.useState(false);
  const [editingInfluencer, setEditingInfluencer] = React.useState<any>(null);
  const [isSaving, setIsSaving] = React.useState(false);

  const [influencerFormData, setInfluencerFormData] = React.useState({
    name: "",
    platform: "INSTAGRAM",
    handle: "",
    email: "",
    phone: "",
    followerCount: "",
    engagementRate: "",
    niche: "",
    status: "PROSPECTING",
    partnershipType: "",
    rate: "",
    notes: "",
  });

  const handleCreateInfluencer = () => {
    setEditingInfluencer(null);
    setInfluencerFormData({
      name: "",
      platform: "INSTAGRAM",
      handle: "",
      email: "",
      phone: "",
      followerCount: "",
      engagementRate: "",
      niche: "",
      status: "PROSPECTING",
      partnershipType: "",
      rate: "",
      notes: "",
    });
    setIsInfluencerDialogOpen(true);
  };

  const handleEditInfluencer = (influencer: any) => {
    setEditingInfluencer(influencer);
    setInfluencerFormData({
      name: influencer.name,
      platform: influencer.platform,
      handle: influencer.handle,
      email: influencer.email || "",
      phone: influencer.phone || "",
      followerCount: influencer.followerCount || "",
      engagementRate: influencer.engagementRate || "",
      niche: influencer.niche || "",
      status: influencer.status,
      partnershipType: influencer.partnershipType || "",
      rate: influencer.rate || "",
      notes: influencer.notes || "",
    });
    setIsInfluencerDialogOpen(true);
  };

  const handleSaveInfluencer = async () => {
    if (!influencerFormData.name || !influencerFormData.handle) {
      toast({
        title: "Missing fields",
        description: "Name and handle are required",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);

    try {
      const url = editingInfluencer
        ? `/api/projects/${projectId}/influencers/${editingInfluencer.id}`
        : `/api/projects/${projectId}/influencers`;

      const response = await fetch(url, {
        method: editingInfluencer ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...influencerFormData,
          followerCount: influencerFormData.followerCount ? parseInt(influencerFormData.followerCount) : null,
          engagementRate: influencerFormData.engagementRate ? parseFloat(influencerFormData.engagementRate) : null,
          rate: influencerFormData.rate ? parseFloat(influencerFormData.rate) : null,
          partnershipType: influencerFormData.partnershipType || null,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save influencer");
      }

      toast({
        title: editingInfluencer ? "Influencer updated" : "Influencer added",
      });

      setIsInfluencerDialogOpen(false);
      setTimeout(() => window.location.reload(), 1000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save influencer",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteInfluencer = async (influencer: any) => {
    if (!confirm(`Are you sure you want to remove "${influencer.name}"?`)) {
      return;
    }

    try {
      const response = await fetch(
        `/api/projects/${projectId}/influencers/${influencer.id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete influencer");
      }

      toast({
        title: "Influencer removed",
      });

      setTimeout(() => window.location.reload(), 1000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove influencer",
        variant: "destructive",
      });
    }
  };

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
          <div className="flex justify-end">
            <Button onClick={handleCreateInfluencer}>
              <Plus className="h-4 w-4 mr-2" />
              Add Influencer
            </Button>
          </div>

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
                        {influencer.partnershipType && (
                          <Badge variant="outline">
                            {PARTNERSHIP_TYPES.find((t) => t.value === influencer.partnershipType)?.label}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        @{influencer.handle} • {influencer.platform}
                      </p>
                      {influencer.followerCount && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {influencer.followerCount.toLocaleString()} followers
                          {influencer.engagementRate && ` • ${parseFloat(influencer.engagementRate).toFixed(2)}% engagement`}
                        </p>
                      )}
                      {influencer.rate && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Rate: ${parseFloat(influencer.rate).toLocaleString()}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditInfluencer(influencer)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteInfluencer(influencer)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
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
                <Button onClick={handleCreateInfluencer}>
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

      {/* Influencer Dialog */}
      <Dialog open={isInfluencerDialogOpen} onOpenChange={setIsInfluencerDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingInfluencer ? "Edit Influencer" : "Add New Influencer"}
            </DialogTitle>
            <DialogDescription>
              Track influencer partnerships and campaigns
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input
                placeholder="Influencer name"
                value={influencerFormData.name}
                onChange={(e) =>
                  setInfluencerFormData((prev) => ({ ...prev, name: e.target.value }))
                }
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Platform</Label>
                <Select
                  value={influencerFormData.platform}
                  onValueChange={(value) =>
                    setInfluencerFormData((prev) => ({ ...prev, platform: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PLATFORMS.map((p) => (
                      <SelectItem key={p.value} value={p.value}>
                        {p.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Handle</Label>
                <Input
                  placeholder="@username"
                  value={influencerFormData.handle}
                  onChange={(e) =>
                    setInfluencerFormData((prev) => ({ ...prev, handle: e.target.value }))
                  }
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Email (optional)</Label>
                <Input
                  type="email"
                  placeholder="email@example.com"
                  value={influencerFormData.email}
                  onChange={(e) =>
                    setInfluencerFormData((prev) => ({ ...prev, email: e.target.value }))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Phone (optional)</Label>
                <Input
                  placeholder="Phone number"
                  value={influencerFormData.phone}
                  onChange={(e) =>
                    setInfluencerFormData((prev) => ({ ...prev, phone: e.target.value }))
                  }
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label>Followers (optional)</Label>
                <Input
                  type="number"
                  placeholder="10000"
                  value={influencerFormData.followerCount}
                  onChange={(e) =>
                    setInfluencerFormData((prev) => ({ ...prev, followerCount: e.target.value }))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Engagement % (optional)</Label>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="5.5"
                  value={influencerFormData.engagementRate}
                  onChange={(e) =>
                    setInfluencerFormData((prev) => ({ ...prev, engagementRate: e.target.value }))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Niche (optional)</Label>
                <Input
                  placeholder="Fashion, Beauty..."
                  value={influencerFormData.niche}
                  onChange={(e) =>
                    setInfluencerFormData((prev) => ({ ...prev, niche: e.target.value }))
                  }
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={influencerFormData.status}
                  onValueChange={(value) =>
                    setInfluencerFormData((prev) => ({ ...prev, status: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PROSPECTING">Prospecting</SelectItem>
                    <SelectItem value="CONTACTED">Contacted</SelectItem>
                    <SelectItem value="NEGOTIATING">Negotiating</SelectItem>
                    <SelectItem value="CONTRACTED">Contracted</SelectItem>
                    <SelectItem value="CONTENT_PENDING">Content Pending</SelectItem>
                    <SelectItem value="POSTED">Posted</SelectItem>
                    <SelectItem value="COMPLETED">Completed</SelectItem>
                    <SelectItem value="DECLINED">Declined</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Partnership Type (optional)</Label>
                <Select
                  value={influencerFormData.partnershipType}
                  onValueChange={(value) =>
                    setInfluencerFormData((prev) => ({ ...prev, partnershipType: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {PARTNERSHIP_TYPES.map((t) => (
                      <SelectItem key={t.value} value={t.value}>
                        {t.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Rate/Compensation (optional)</Label>
              <Input
                type="number"
                placeholder="500"
                value={influencerFormData.rate}
                onChange={(e) =>
                  setInfluencerFormData((prev) => ({ ...prev, rate: e.target.value }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Notes (optional)</Label>
              <Textarea
                placeholder="Add any notes..."
                rows={2}
                value={influencerFormData.notes}
                onChange={(e) =>
                  setInfluencerFormData((prev) => ({ ...prev, notes: e.target.value }))
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsInfluencerDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveInfluencer} disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>{editingInfluencer ? "Update" : "Add"} Influencer</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
