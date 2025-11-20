/**
 * Theme Selector Component
 *
 * Select and configure website theme with brand integration
 */

"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Palette, Type, Globe, Check, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ThemeSelectorProps {
  projectId: string;
  websiteConfig: any;
  colorPalettes: any[];
  typography: any;
}

const THEME_TEMPLATES = [
  {
    id: "modern-minimal",
    name: "Modern Minimal",
    description: "Clean lines, ample whitespace, sophisticated typography",
    preview: "https://placeholder.co/400x300/e5e7eb/1f2937?text=Modern+Minimal",
    category: "Professional",
  },
  {
    id: "bold-vibrant",
    name: "Bold & Vibrant",
    description: "Eye-catching colors, dynamic layouts, energetic feel",
    preview: "https://placeholder.co/400x300/fbbf24/1f2937?text=Bold+Vibrant",
    category: "Creative",
  },
  {
    id: "elegant-luxury",
    name: "Elegant Luxury",
    description: "Refined aesthetics, premium feel, sophisticated details",
    preview: "https://placeholder.co/400x300/f3f4f6/6b7280?text=Elegant+Luxury",
    category: "Premium",
  },
  {
    id: "playful-fun",
    name: "Playful & Fun",
    description: "Whimsical elements, bright colors, friendly vibe",
    preview: "https://placeholder.co/400x300/fde68a/f59e0b?text=Playful+Fun",
    category: "Lifestyle",
  },
  {
    id: "editorial-magazine",
    name: "Editorial Magazine",
    description: "Content-focused, strong typography, editorial layouts",
    preview: "https://placeholder.co/400x300/fafafa/000000?text=Editorial",
    category: "Content",
  },
  {
    id: "product-showcase",
    name: "Product Showcase",
    description: "Hero imagery, product-focused grids, conversion-optimized",
    preview: "https://placeholder.co/400x300/ffffff/4b5563?text=Product+Focus",
    category: "E-commerce",
  },
];

const PLATFORMS = [
  { value: "SHOPIFY", label: "Shopify" },
  { value: "WEBFLOW", label: "Webflow" },
  { value: "WORDPRESS", label: "WordPress" },
  { value: "CUSTOM", label: "Custom Development" },
];

export function ThemeSelector({
  projectId,
  websiteConfig,
  colorPalettes,
  typography,
}: ThemeSelectorProps) {
  const { toast } = useToast();
  const [selectedTheme, setSelectedTheme] = React.useState(
    websiteConfig?.themeName || ""
  );
  const [isSaving, setIsSaving] = React.useState(false);

  const [formData, setFormData] = React.useState({
    themeName: websiteConfig?.themeName || "",
    platform: websiteConfig?.platform || "",
    platformUrl: websiteConfig?.platformUrl || "",
    domain: websiteConfig?.domain || "",
    metaTitle: websiteConfig?.metaTitle || "",
    metaDescription: websiteConfig?.metaDescription || "",
  });

  const approvedPalette = colorPalettes.find((p) => p.isApproved);
  const hasApprovedBranding = approvedPalette && typography?.isApproved;

  const handleThemeSelect = (themeId: string) => {
    setSelectedTheme(themeId);
    const theme = THEME_TEMPLATES.find((t) => t.id === themeId);
    if (theme) {
      setFormData((prev) => ({ ...prev, themeName: theme.name }));
    }
  };

  const handleSave = async () => {
    if (!formData.themeName) {
      toast({
        title: "Theme required",
        description: "Please select a theme template",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);

    try {
      const response = await fetch(`/api/projects/${projectId}/website`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          primaryColor: approvedPalette?.primaryHex || null,
          fontPrimary: typography?.primaryFontFamily || null,
          fontSecondary: typography?.secondaryFontFamily || null,
          status: "IN_DESIGN",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save theme");
      }

      toast({
        title: "Theme saved",
        description: "Website theme configuration has been saved",
      });

      setTimeout(() => window.location.reload(), 1000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save theme configuration",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Theme Selection</h3>
          <p className="text-sm text-muted-foreground">
            Choose a theme template and configure your website settings
          </p>
        </div>
        {websiteConfig && (
          <Badge variant="outline" className="text-sm">
            Status: {websiteConfig.status.replace("_", " ")}
          </Badge>
        )}
      </div>

      {/* Brand Integration Status */}
      {hasApprovedBranding ? (
        <Card className="border-green-500/20 bg-green-500/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Check className="h-5 w-5 text-green-500" />
              <div>
                <p className="font-medium">Brand assets ready</p>
                <p className="text-sm text-muted-foreground">
                  Your approved colors and typography will be automatically
                  applied to the selected theme
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-yellow-500/20 bg-yellow-500/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Palette className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="font-medium">Brand assets pending</p>
                <p className="text-sm text-muted-foreground">
                  Complete your brand design (colors & typography) for automatic
                  theme integration
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Theme Templates */}
      <div>
        <h4 className="font-medium mb-4">Select Theme Template</h4>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {THEME_TEMPLATES.map((theme) => (
            <Card
              key={theme.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                selectedTheme === theme.id
                  ? "ring-2 ring-primary border-primary"
                  : ""
              }`}
              onClick={() => handleThemeSelect(theme.id)}
            >
              <CardContent className="p-0">
                <div className="relative">
                  <img
                    src={theme.preview}
                    alt={theme.name}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  {selectedTheme === theme.id && (
                    <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1">
                      <Check className="h-4 w-4" />
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-semibold">{theme.name}</h5>
                    <Badge variant="secondary" className="text-xs">
                      {theme.category}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {theme.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Website Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="platform">Platform</Label>
              <Select
                value={formData.platform}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, platform: value }))
                }
              >
                <SelectTrigger id="platform">
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent>
                  {PLATFORMS.map((platform) => (
                    <SelectItem key={platform.value} value={platform.value}>
                      {platform.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="domain">Domain</Label>
              <Input
                id="domain"
                placeholder="www.yourwebsite.com"
                value={formData.domain}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, domain: e.target.value }))
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="platformUrl">Platform URL (Dev/Staging)</Label>
            <Input
              id="platformUrl"
              placeholder="e.g., yourstore.myshopify.com"
              value={formData.platformUrl}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  platformUrl: e.target.value,
                }))
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="metaTitle">Site Title (SEO)</Label>
            <Input
              id="metaTitle"
              placeholder="Your Brand Name - Tagline"
              value={formData.metaTitle}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  metaTitle: e.target.value,
                }))
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="metaDescription">Site Description (SEO)</Label>
            <Input
              id="metaDescription"
              placeholder="Brief description of your brand and products"
              value={formData.metaDescription}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  metaDescription: e.target.value,
                }))
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>Save Theme Configuration</>
          )}
        </Button>
      </div>
    </div>
  );
}
