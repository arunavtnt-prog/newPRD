/**
 * Campaign Manager Component
 *
 * Manage marketing campaigns
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
import { Megaphone, Plus, Edit, Trash2, Play, Pause, Loader2, TrendingUp } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

interface CampaignManagerProps {
  projectId: string;
  campaigns: any[];
}

const CAMPAIGN_TYPES = [
  { value: "PRODUCT_LAUNCH", label: "Product Launch" },
  { value: "BRAND_AWARENESS", label: "Brand Awareness" },
  { value: "LEAD_GENERATION", label: "Lead Generation" },
  { value: "SALES_PROMOTION", label: "Sales Promotion" },
  { value: "ENGAGEMENT", label: "Engagement" },
  { value: "RETARGETING", label: "Retargeting" },
];

const STATUS_COLORS: Record<string, string> = {
  PLANNING: "secondary",
  READY: "default",
  ACTIVE: "default",
  PAUSED: "secondary",
  COMPLETED: "outline",
  CANCELLED: "destructive",
};

export function CampaignManager({ projectId, campaigns }: CampaignManagerProps) {
  const { toast } = useToast();
  const [isCampaignDialogOpen, setIsCampaignDialogOpen] = React.useState(false);
  const [editingCampaign, setEditingCampaign] = React.useState<any>(null);
  const [isSaving, setIsSaving] = React.useState(false);

  const [campaignFormData, setCampaignFormData] = React.useState({
    campaignName: "",
    campaignType: "PRODUCT_LAUNCH",
    objective: "",
    budget: "",
    startDate: "",
    endDate: "",
    status: "PLANNING",
    notes: "",
  });

  const handleCreateCampaign = () => {
    setEditingCampaign(null);
    setCampaignFormData({
      campaignName: "",
      campaignType: "PRODUCT_LAUNCH",
      objective: "",
      budget: "",
      startDate: "",
      endDate: "",
      status: "PLANNING",
      notes: "",
    });
    setIsCampaignDialogOpen(true);
  };

  const handleEditCampaign = (campaign: any) => {
    setEditingCampaign(campaign);
    setCampaignFormData({
      campaignName: campaign.campaignName,
      campaignType: campaign.campaignType,
      objective: campaign.objective || "",
      budget: campaign.budget || "",
      startDate: campaign.startDate
        ? format(new Date(campaign.startDate), "yyyy-MM-dd")
        : "",
      endDate: campaign.endDate
        ? format(new Date(campaign.endDate), "yyyy-MM-dd")
        : "",
      status: campaign.status,
      notes: campaign.notes || "",
    });
    setIsCampaignDialogOpen(true);
  };

  const handleSaveCampaign = async () => {
    if (!campaignFormData.campaignName) {
      toast({
        title: "Missing fields",
        description: "Campaign name is required",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);

    try {
      const url = editingCampaign
        ? `/api/projects/${projectId}/campaigns/${editingCampaign.id}`
        : `/api/projects/${projectId}/campaigns`;

      const response = await fetch(url, {
        method: editingCampaign ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...campaignFormData,
          budget: campaignFormData.budget ? parseFloat(campaignFormData.budget) : null,
          startDate: campaignFormData.startDate || null,
          endDate: campaignFormData.endDate || null,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save campaign");
      }

      toast({
        title: editingCampaign ? "Campaign updated" : "Campaign created",
      });

      setIsCampaignDialogOpen(false);
      setTimeout(() => window.location.reload(), 1000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save campaign",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteCampaign = async (campaign: any) => {
    if (!confirm(`Are you sure you want to delete "${campaign.campaignName}"?`)) {
      return;
    }

    try {
      const response = await fetch(
        `/api/projects/${projectId}/campaigns/${campaign.id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete campaign");
      }

      toast({
        title: "Campaign deleted",
      });

      setTimeout(() => window.location.reload(), 1000);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete campaign",
        variant: "destructive",
      });
    }
  };

  const handleToggleStatus = async (campaign: any) => {
    const newStatus = campaign.status === "ACTIVE" ? "PAUSED" : "ACTIVE";

    try {
      const response = await fetch(
        `/api/projects/${projectId}/campaigns/${campaign.id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update campaign status");
      }

      toast({
        title: newStatus === "ACTIVE" ? "Campaign activated" : "Campaign paused",
      });

      setTimeout(() => window.location.reload(), 1000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update campaign status",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Campaigns</h3>
          <p className="text-sm text-muted-foreground">
            Organize your marketing efforts into campaigns
          </p>
        </div>
        <Button onClick={handleCreateCampaign}>
          <Plus className="h-4 w-4 mr-2" />
          Create Campaign
        </Button>
      </div>

      {campaigns.length > 0 ? (
        <div className="space-y-4">
          {campaigns.map((campaign) => (
            <Card key={campaign.id}>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold">{campaign.campaignName}</h4>
                        <Badge variant={STATUS_COLORS[campaign.status] as any}>
                          {campaign.status}
                        </Badge>
                        <Badge variant="outline">
                          {CAMPAIGN_TYPES.find((t) => t.value === campaign.campaignType)?.label}
                        </Badge>
                      </div>
                      {campaign.objective && (
                        <p className="text-sm text-muted-foreground mb-2">
                          {campaign.objective}
                        </p>
                      )}
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        {campaign.budget && (
                          <span>Budget: ${parseFloat(campaign.budget).toLocaleString()}</span>
                        )}
                        {campaign.startDate && (
                          <span>Start: {format(new Date(campaign.startDate), "MMM d, yyyy")}</span>
                        )}
                        {campaign.endDate && (
                          <span>End: {format(new Date(campaign.endDate), "MMM d, yyyy")}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {(campaign.status === "ACTIVE" || campaign.status === "PAUSED") && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleToggleStatus(campaign)}
                        >
                          {campaign.status === "ACTIVE" ? (
                            <Pause className="h-4 w-4" />
                          ) : (
                            <Play className="h-4 w-4" />
                          )}
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditCampaign(campaign)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteCampaign(campaign)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {(campaign.impressions || campaign.clicks || campaign.conversions) && (
                    <div className="grid grid-cols-4 gap-4 pt-4 border-t">
                      <div>
                        <p className="text-xs text-muted-foreground">Impressions</p>
                        <p className="text-lg font-semibold">{campaign.impressions?.toLocaleString() || 0}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Clicks</p>
                        <p className="text-lg font-semibold">{campaign.clicks?.toLocaleString() || 0}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Conversions</p>
                        <p className="text-lg font-semibold">{campaign.conversions?.toLocaleString() || 0}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Spend</p>
                        <p className="text-lg font-semibold">
                          ${campaign.spend ? parseFloat(campaign.spend).toLocaleString() : 0}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Megaphone className="h-16 w-16 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium mb-2">No campaigns yet</h3>
            <p className="text-muted-foreground text-center max-w-sm mb-6">
              Create campaigns to organize your marketing content and ads
            </p>
            <Button onClick={handleCreateCampaign}>
              <Plus className="h-4 w-4 mr-2" />
              Create First Campaign
            </Button>
          </CardContent>
        </Card>
      )}

      <Dialog open={isCampaignDialogOpen} onOpenChange={setIsCampaignDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingCampaign ? "Edit Campaign" : "Create New Campaign"}
            </DialogTitle>
            <DialogDescription>
              Organize your marketing efforts with campaigns
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Campaign Name</Label>
              <Input
                placeholder="e.g., Summer Launch 2024"
                value={campaignFormData.campaignName}
                onChange={(e) =>
                  setCampaignFormData((prev) => ({
                    ...prev,
                    campaignName: e.target.value,
                  }))
                }
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Campaign Type</Label>
                <Select
                  value={campaignFormData.campaignType}
                  onValueChange={(value) =>
                    setCampaignFormData((prev) => ({ ...prev, campaignType: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CAMPAIGN_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={campaignFormData.status}
                  onValueChange={(value) =>
                    setCampaignFormData((prev) => ({ ...prev, status: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PLANNING">Planning</SelectItem>
                    <SelectItem value="READY">Ready</SelectItem>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="PAUSED">Paused</SelectItem>
                    <SelectItem value="COMPLETED">Completed</SelectItem>
                    <SelectItem value="CANCELLED">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Objective (optional)</Label>
              <Textarea
                placeholder="What's the goal of this campaign?"
                rows={2}
                value={campaignFormData.objective}
                onChange={(e) =>
                  setCampaignFormData((prev) => ({ ...prev, objective: e.target.value }))
                }
              />
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label>Budget (optional)</Label>
                <Input
                  type="number"
                  placeholder="10000"
                  value={campaignFormData.budget}
                  onChange={(e) =>
                    setCampaignFormData((prev) => ({ ...prev, budget: e.target.value }))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Start Date (optional)</Label>
                <Input
                  type="date"
                  value={campaignFormData.startDate}
                  onChange={(e) =>
                    setCampaignFormData((prev) => ({ ...prev, startDate: e.target.value }))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>End Date (optional)</Label>
                <Input
                  type="date"
                  value={campaignFormData.endDate}
                  onChange={(e) =>
                    setCampaignFormData((prev) => ({ ...prev, endDate: e.target.value }))
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Notes (optional)</Label>
              <Textarea
                placeholder="Add any internal notes..."
                rows={2}
                value={campaignFormData.notes}
                onChange={(e) =>
                  setCampaignFormData((prev) => ({ ...prev, notes: e.target.value }))
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCampaignDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveCampaign} disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>{editingCampaign ? "Update" : "Create"} Campaign</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
