/**
 * Ad Creative Manager Component
 *
 * Manage ad creatives and A/B testing
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
import {
  Megaphone,
  Plus,
  Edit,
  Trash2,
  TrendingUp,
  Loader2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AdCreativeManagerProps {
  projectId: string;
  campaigns: any[];
  adCreatives: any[];
}

const AD_PLATFORMS = [
  { value: "FACEBOOK_ADS", label: "Facebook Ads" },
  { value: "INSTAGRAM_ADS", label: "Instagram Ads" },
  { value: "GOOGLE_ADS", label: "Google Ads" },
  { value: "TIKTOK_ADS", label: "TikTok Ads" },
  { value: "PINTEREST_ADS", label: "Pinterest Ads" },
];

const AD_FORMATS = [
  { value: "SINGLE_IMAGE", label: "Single Image" },
  { value: "CAROUSEL", label: "Carousel" },
  { value: "VIDEO", label: "Video" },
  { value: "COLLECTION", label: "Collection" },
  { value: "STORIES", label: "Stories" },
  { value: "REELS", label: "Reels" },
];

export function AdCreativeManager({
  projectId,
  campaigns,
  adCreatives,
}: AdCreativeManagerProps) {
  const { toast } = useToast();
  const [isAdDialogOpen, setIsAdDialogOpen] = React.useState(false);
  const [editingAd, setEditingAd] = React.useState<any>(null);
  const [isSaving, setIsSaving] = React.useState(false);

  const [adFormData, setAdFormData] = React.useState({
    adName: "",
    platform: "FACEBOOK_ADS",
    adFormat: "SINGLE_IMAGE",
    campaignId: "",
    headline: "",
    primaryText: "",
    description: "",
    callToAction: "",
    variant: "",
    notes: "",
  });

  const handleCreateAd = () => {
    setEditingAd(null);
    setAdFormData({
      adName: "",
      platform: "FACEBOOK_ADS",
      adFormat: "SINGLE_IMAGE",
      campaignId: "",
      headline: "",
      primaryText: "",
      description: "",
      callToAction: "",
      variant: "",
      notes: "",
    });
    setIsAdDialogOpen(true);
  };

  const handleSaveAd = async () => {
    if (!adFormData.adName) {
      toast({
        title: "Missing fields",
        description: "Ad name is required",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);

    try {
      const url = editingAd
        ? `/api/projects/${projectId}/ads/${editingAd.id}`
        : `/api/projects/${projectId}/ads`;

      const response = await fetch(url, {
        method: editingAd ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...adFormData,
          campaignId: adFormData.campaignId || null,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save ad");
      }

      toast({
        title: editingAd ? "Ad updated" : "Ad created",
      });

      setIsAdDialogOpen(false);
      setTimeout(() => window.location.reload(), 1000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save ad creative",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Ad Creatives</h3>
          <p className="text-sm text-muted-foreground">
            Manage ad variations and track performance
          </p>
        </div>
        <Button onClick={handleCreateAd}>
          <Plus className="h-4 w-4 mr-2" />
          Create Ad
        </Button>
      </div>

      {adCreatives.length > 0 ? (
        <div className="space-y-4">
          {adCreatives.map((ad) => (
            <Card key={ad.id}>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h5 className="font-semibold">{ad.adName}</h5>
                        <Badge>{ad.status}</Badge>
                        <Badge variant="outline">{ad.adFormat.replace("_", " ")}</Badge>
                        {ad.variant && (
                          <Badge variant="secondary">Var. {ad.variant}</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {ad.platform.replace("_", " ")}
                      </p>
                    </div>
                  </div>

                  {ad.headline && (
                    <div>
                      <p className="text-sm font-medium">{ad.headline}</p>
                      <p className="text-sm text-muted-foreground">{ad.primaryText}</p>
                    </div>
                  )}

                  {(ad.impressions || ad.clicks || ad.conversions) && (
                    <div className="grid grid-cols-3 gap-4 pt-2 border-t">
                      <div>
                        <p className="text-xs text-muted-foreground">Impressions</p>
                        <p className="text-sm font-semibold">{ad.impressions || 0}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Clicks</p>
                        <p className="text-sm font-semibold">{ad.clicks || 0}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Conversions</p>
                        <p className="text-sm font-semibold">{ad.conversions || 0}</p>
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
            <h3 className="text-lg font-medium mb-2">No ads yet</h3>
            <p className="text-muted-foreground text-center max-w-sm mb-6">
              Create ad creatives to promote your brand
            </p>
            <Button onClick={handleCreateAd}>
              <Plus className="h-4 w-4 mr-2" />
              Create First Ad
            </Button>
          </CardContent>
        </Card>
      )}

      <Dialog open={isAdDialogOpen} onOpenChange={setIsAdDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingAd ? "Edit Ad" : "Create New Ad"}</DialogTitle>
            <DialogDescription>Configure your ad creative</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Ad Name</Label>
              <Input
                placeholder="e.g., Summer Launch - Image A"
                value={adFormData.adName}
                onChange={(e) =>
                  setAdFormData((prev) => ({ ...prev, adName: e.target.value }))
                }
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Platform</Label>
                <Select
                  value={adFormData.platform}
                  onValueChange={(value) =>
                    setAdFormData((prev) => ({ ...prev, platform: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {AD_PLATFORMS.map((p) => (
                      <SelectItem key={p.value} value={p.value}>
                        {p.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Format</Label>
                <Select
                  value={adFormData.adFormat}
                  onValueChange={(value) =>
                    setAdFormData((prev) => ({ ...prev, adFormat: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {AD_FORMATS.map((f) => (
                      <SelectItem key={f.value} value={f.value}>
                        {f.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Headline</Label>
              <Input
                placeholder="Ad headline"
                value={adFormData.headline}
                onChange={(e) =>
                  setAdFormData((prev) => ({ ...prev, headline: e.target.value }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Primary Text</Label>
              <Textarea
                placeholder="Main ad copy..."
                rows={3}
                value={adFormData.primaryText}
                onChange={(e) =>
                  setAdFormData((prev) => ({ ...prev, primaryText: e.target.value }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Call to Action</Label>
              <Input
                placeholder="e.g., Shop Now, Learn More"
                value={adFormData.callToAction}
                onChange={(e) =>
                  setAdFormData((prev) => ({ ...prev, callToAction: e.target.value }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Variant (optional)</Label>
              <Input
                placeholder="e.g., A, B, Control"
                value={adFormData.variant}
                onChange={(e) =>
                  setAdFormData((prev) => ({ ...prev, variant: e.target.value }))
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAdDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveAd} disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>{editingAd ? "Update" : "Create"} Ad</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
