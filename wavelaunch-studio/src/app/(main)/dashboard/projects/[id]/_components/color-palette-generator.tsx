/**
 * Color Palette Generator Component
 *
 * Create and manage brand color palettes with accessibility checking
 */

"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Palette, Plus, Trash2, Check, X, Sparkles } from "lucide-react";
import { toast } from "sonner";

interface ColorPalette {
  id: string;
  name: string;
  primaryColor: string;
  secondaryColor: string | null;
  accentColor: string | null;
  neutralLight: string | null;
  neutralDark: string | null;
  backgroundColor: string | null;
  textColor: string | null;
  isApproved: boolean;
  createdAt: Date;
}

interface ColorPaletteGeneratorProps {
  projectId: string;
  palettes: ColorPalette[];
}

export function ColorPaletteGenerator({
  projectId,
  palettes,
}: ColorPaletteGeneratorProps) {
  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState("");
  const [primaryColor, setPrimaryColor] = React.useState("#000000");
  const [secondaryColor, setSecondaryColor] = React.useState("#666666");
  const [accentColor, setAccentColor] = React.useState("#FF5733");
  const [neutralLight, setNeutralLight] = React.useState("#F5F5F5");
  const [neutralDark, setNeutralDark] = React.useState("#1A1A1A");
  const [backgroundColor, setBackgroundColor] = React.useState("#FFFFFF");
  const [textColor, setTextColor] = React.useState("#000000");
  const [isSaving, setIsSaving] = React.useState(false);
  const router = useRouter();

  // Calculate contrast ratio (simplified WCAG calculation)
  const getContrastRatio = (color1: string, color2: string): number => {
    const getLuminance = (color: string): number => {
      const rgb = parseInt(color.substring(1), 16);
      const r = (rgb >> 16) & 0xff;
      const g = (rgb >> 8) & 0xff;
      const b = (rgb >> 0) & 0xff;

      const [rs, gs, bs] = [r, g, b].map((c) => {
        c = c / 255;
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
      });

      return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
    };

    const lum1 = getLuminance(color1);
    const lum2 = getLuminance(color2);
    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);
    return (brightest + 0.05) / (darkest + 0.05);
  };

  const checkAccessibility = (bgColor: string, textColor: string) => {
    const ratio = getContrastRatio(bgColor, textColor);
    if (ratio >= 7) return { level: "AAA", ratio, pass: true };
    if (ratio >= 4.5) return { level: "AA", ratio, pass: true };
    if (ratio >= 3) return { level: "AA Large", ratio, pass: true };
    return { level: "Fail", ratio, pass: false };
  };

  const accessibility = checkAccessibility(backgroundColor, textColor);

  const handleCreate = async () => {
    if (!name.trim()) {
      toast.error("Please enter a palette name");
      return;
    }

    setIsSaving(true);

    try {
      const response = await fetch(`/api/projects/${projectId}/palettes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          primaryColor,
          secondaryColor,
          accentColor,
          neutralLight,
          neutralDark,
          backgroundColor,
          textColor,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create palette");
      }

      toast.success("Color palette created successfully");
      setOpen(false);
      setName("");
      router.refresh();
    } catch (error) {
      console.error("Error creating palette:", error);
      toast.error("Failed to create color palette");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (paletteId: string) => {
    try {
      const response = await fetch(`/api/palettes/${paletteId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete palette");
      }

      toast.success("Palette deleted");
      router.refresh();
    } catch (error) {
      console.error("Error deleting palette:", error);
      toast.error("Failed to delete palette");
    }
  };

  const handleApprove = async (paletteId: string) => {
    try {
      const response = await fetch(`/api/palettes/${paletteId}/approve`, {
        method: "PATCH",
      });

      if (!response.ok) {
        throw new Error("Failed to approve palette");
      }

      toast.success("Palette approved");
      router.refresh();
    } catch (error) {
      console.error("Error approving palette:", error);
      toast.error("Failed to approve palette");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Color Palettes</h3>
          <p className="text-sm text-muted-foreground">
            Create and manage brand color systems
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Palette
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create Color Palette</DialogTitle>
              <DialogDescription>
                Define your brand colors with accessibility in mind
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              {/* Palette Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Palette Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g., Primary Brand Colors"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Primary Color */}
                <div className="space-y-2">
                  <Label htmlFor="primary">Primary Color *</Label>
                  <div className="flex gap-2">
                    <Input
                      id="primary"
                      type="color"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="w-16 h-10 p-1"
                    />
                    <Input
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      placeholder="#000000"
                    />
                  </div>
                </div>

                {/* Secondary Color */}
                <div className="space-y-2">
                  <Label htmlFor="secondary">Secondary Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="secondary"
                      type="color"
                      value={secondaryColor}
                      onChange={(e) => setSecondaryColor(e.target.value)}
                      className="w-16 h-10 p-1"
                    />
                    <Input
                      value={secondaryColor}
                      onChange={(e) => setSecondaryColor(e.target.value)}
                      placeholder="#666666"
                    />
                  </div>
                </div>

                {/* Accent Color */}
                <div className="space-y-2">
                  <Label htmlFor="accent">Accent Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="accent"
                      type="color"
                      value={accentColor}
                      onChange={(e) => setAccentColor(e.target.value)}
                      className="w-16 h-10 p-1"
                    />
                    <Input
                      value={accentColor}
                      onChange={(e) => setAccentColor(e.target.value)}
                      placeholder="#FF5733"
                    />
                  </div>
                </div>

                {/* Neutral Light */}
                <div className="space-y-2">
                  <Label htmlFor="neutralLight">Neutral Light</Label>
                  <div className="flex gap-2">
                    <Input
                      id="neutralLight"
                      type="color"
                      value={neutralLight}
                      onChange={(e) => setNeutralLight(e.target.value)}
                      className="w-16 h-10 p-1"
                    />
                    <Input
                      value={neutralLight}
                      onChange={(e) => setNeutralLight(e.target.value)}
                      placeholder="#F5F5F5"
                    />
                  </div>
                </div>

                {/* Neutral Dark */}
                <div className="space-y-2">
                  <Label htmlFor="neutralDark">Neutral Dark</Label>
                  <div className="flex gap-2">
                    <Input
                      id="neutralDark"
                      type="color"
                      value={neutralDark}
                      onChange={(e) => setNeutralDark(e.target.value)}
                      className="w-16 h-10 p-1"
                    />
                    <Input
                      value={neutralDark}
                      onChange={(e) => setNeutralDark(e.target.value)}
                      placeholder="#1A1A1A"
                    />
                  </div>
                </div>

                {/* Background Color */}
                <div className="space-y-2">
                  <Label htmlFor="background">Background</Label>
                  <div className="flex gap-2">
                    <Input
                      id="background"
                      type="color"
                      value={backgroundColor}
                      onChange={(e) => setBackgroundColor(e.target.value)}
                      className="w-16 h-10 p-1"
                    />
                    <Input
                      value={backgroundColor}
                      onChange={(e) => setBackgroundColor(e.target.value)}
                      placeholder="#FFFFFF"
                    />
                  </div>
                </div>

                {/* Text Color */}
                <div className="space-y-2">
                  <Label htmlFor="text">Text Color</Label>
                  <div className="flex gap-2">
                    <Input
                      id="text"
                      type="color"
                      value={textColor}
                      onChange={(e) => setTextColor(e.target.value)}
                      className="w-16 h-10 p-1"
                    />
                    <Input
                      value={textColor}
                      onChange={(e) => setTextColor(e.target.value)}
                      placeholder="#000000"
                    />
                  </div>
                </div>
              </div>

              {/* Accessibility Check */}
              <Card className="bg-muted/50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Accessibility Check</p>
                      <p className="text-xs text-muted-foreground">
                        Background vs Text: {accessibility.ratio.toFixed(2)}:1
                      </p>
                    </div>
                    <Badge
                      variant={accessibility.pass ? "default" : "destructive"}
                      className="gap-1"
                    >
                      {accessibility.pass ? (
                        <Check className="h-3 w-3" />
                      ) : (
                        <X className="h-3 w-3" />
                      )}
                      {accessibility.level}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreate} disabled={isSaving}>
                {isSaving ? "Creating..." : "Create Palette"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Palettes Grid */}
      {palettes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {palettes.map((palette) => (
            <Card key={palette.id} className="overflow-hidden">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{palette.name}</CardTitle>
                    {palette.isApproved && (
                      <Badge variant="default" className="mt-2 gap-1">
                        <Check className="h-3 w-3" />
                        Approved
                      </Badge>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {!palette.isApproved && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleApprove(palette.id)}
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(palette.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Color Swatches */}
                <div className="grid grid-cols-7 gap-2">
                  <div className="space-y-1">
                    <div
                      className="h-16 rounded border"
                      style={{ backgroundColor: palette.primaryColor }}
                    />
                    <p className="text-[10px] text-center font-mono">
                      {palette.primaryColor}
                    </p>
                    <p className="text-[9px] text-center text-muted-foreground">
                      Primary
                    </p>
                  </div>
                  {palette.secondaryColor && (
                    <div className="space-y-1">
                      <div
                        className="h-16 rounded border"
                        style={{ backgroundColor: palette.secondaryColor }}
                      />
                      <p className="text-[10px] text-center font-mono">
                        {palette.secondaryColor}
                      </p>
                      <p className="text-[9px] text-center text-muted-foreground">
                        Secondary
                      </p>
                    </div>
                  )}
                  {palette.accentColor && (
                    <div className="space-y-1">
                      <div
                        className="h-16 rounded border"
                        style={{ backgroundColor: palette.accentColor }}
                      />
                      <p className="text-[10px] text-center font-mono">
                        {palette.accentColor}
                      </p>
                      <p className="text-[9px] text-center text-muted-foreground">
                        Accent
                      </p>
                    </div>
                  )}
                  {palette.neutralLight && (
                    <div className="space-y-1">
                      <div
                        className="h-16 rounded border"
                        style={{ backgroundColor: palette.neutralLight }}
                      />
                      <p className="text-[10px] text-center font-mono">
                        {palette.neutralLight}
                      </p>
                      <p className="text-[9px] text-center text-muted-foreground">
                        Light
                      </p>
                    </div>
                  )}
                  {palette.neutralDark && (
                    <div className="space-y-1">
                      <div
                        className="h-16 rounded border"
                        style={{ backgroundColor: palette.neutralDark }}
                      />
                      <p className="text-[10px] text-center font-mono">
                        {palette.neutralDark}
                      </p>
                      <p className="text-[9px] text-center text-muted-foreground">
                        Dark
                      </p>
                    </div>
                  )}
                  {palette.backgroundColor && (
                    <div className="space-y-1">
                      <div
                        className="h-16 rounded border"
                        style={{ backgroundColor: palette.backgroundColor }}
                      />
                      <p className="text-[10px] text-center font-mono">
                        {palette.backgroundColor}
                      </p>
                      <p className="text-[9px] text-center text-muted-foreground">
                        BG
                      </p>
                    </div>
                  )}
                  {palette.textColor && (
                    <div className="space-y-1">
                      <div
                        className="h-16 rounded border"
                        style={{ backgroundColor: palette.textColor }}
                      />
                      <p className="text-[10px] text-center font-mono">
                        {palette.textColor}
                      </p>
                      <p className="text-[9px] text-center text-muted-foreground">
                        Text
                      </p>
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
            <Palette className="h-16 w-16 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium mb-2">No color palettes yet</h3>
            <p className="text-muted-foreground text-center max-w-sm mb-6">
              Create your first color palette to establish your brand's visual identity.
              The system will check accessibility automatically.
            </p>
            <Button onClick={() => setOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create First Palette
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
