/**
 * Typography Selector Component
 *
 * Select and preview font pairings for brand identity
 */

"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Check, Plus, Sparkles, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface TypographyData {
  id: string;
  name: string;
  primaryFontFamily: string;
  primaryFontWeights: string;
  primaryFontSource: string | null;
  secondaryFontFamily: string;
  secondaryFontWeights: string;
  secondaryFontSource: string | null;
  accentFontFamily: string | null;
  accentFontWeights: string | null;
  accentFontSource: string | null;
  notes: string | null;
  isApproved: boolean;
  createdAt: Date;
}

interface TypographySelectorProps {
  projectId: string;
  typography?: TypographyData | null;
}

// Curated Google Font pairings
const FONT_PAIRINGS = [
  {
    name: "Modern & Clean",
    primary: "Inter",
    secondary: "Inter",
    description: "Professional and highly readable",
    category: "Sans-serif",
    primaryWeights: ["400", "600", "700"],
    secondaryWeights: ["400", "500"],
  },
  {
    name: "Elegant Serif",
    primary: "Playfair Display",
    secondary: "Source Sans Pro",
    description: "Sophisticated and luxurious",
    category: "Serif + Sans",
    primaryWeights: ["400", "600", "700"],
    secondaryWeights: ["400", "600"],
  },
  {
    name: "Bold & Minimal",
    primary: "Montserrat",
    secondary: "Open Sans",
    description: "Strong presence, easy readability",
    category: "Sans-serif",
    primaryWeights: ["400", "600", "800"],
    secondaryWeights: ["400", "600"],
  },
  {
    name: "Classic Editorial",
    primary: "Merriweather",
    secondary: "Lato",
    description: "Traditional yet contemporary",
    category: "Serif + Sans",
    primaryWeights: ["400", "700", "900"],
    secondaryWeights: ["400", "700"],
  },
  {
    name: "Tech & Modern",
    primary: "Poppins",
    secondary: "Roboto",
    description: "Tech-forward and friendly",
    category: "Sans-serif",
    primaryWeights: ["400", "600", "700"],
    secondaryWeights: ["400", "500"],
  },
  {
    name: "Luxury Brand",
    primary: "Cormorant Garamond",
    secondary: "Montserrat",
    description: "High-end and refined",
    category: "Serif + Sans",
    primaryWeights: ["400", "600", "700"],
    secondaryWeights: ["300", "400"],
  },
  {
    name: "Warm & Friendly",
    primary: "Quicksand",
    secondary: "Nunito",
    description: "Approachable and soft",
    category: "Rounded",
    primaryWeights: ["400", "600", "700"],
    secondaryWeights: ["400", "600"],
  },
  {
    name: "Editorial Bold",
    primary: "Libre Baskerville",
    secondary: "Raleway",
    description: "Magazine-quality typography",
    category: "Serif + Sans",
    primaryWeights: ["400", "700"],
    secondaryWeights: ["400", "600", "700"],
  },
];

export function TypographySelector({
  projectId,
  typography,
}: TypographySelectorProps) {
  const [open, setOpen] = React.useState(false);
  const [selectedPairing, setSelectedPairing] = React.useState<string>("");
  const [customMode, setCustomMode] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  const [previewText, setPreviewText] = React.useState(
    "The quick brown fox jumps over the lazy dog"
  );
  const router = useRouter();

  // Custom font form state
  const [customName, setCustomName] = React.useState("");
  const [customPrimary, setCustomPrimary] = React.useState("");
  const [customSecondary, setCustomSecondary] = React.useState("");
  const [customNotes, setCustomNotes] = React.useState("");

  // Load Google Fonts dynamically
  React.useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    const families = FONT_PAIRINGS.flatMap((p) => [
      `${p.primary}:${p.primaryWeights.join(",")}`,
      `${p.secondary}:${p.secondaryWeights.join(",")}`,
    ]).join("|");
    link.href = `https://fonts.googleapis.com/css2?${families
      .split("|")
      .map((f) => `family=${f.replace(" ", "+")}`)
      .join("&")}&display=swap`;
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
  }, []);

  const handleSavePairing = async () => {
    let fontData;

    if (customMode) {
      if (!customName || !customPrimary || !customSecondary) {
        toast.error("Please fill in all required fields");
        return;
      }

      fontData = {
        name: customName,
        primaryFontFamily: customPrimary,
        primaryFontWeights: JSON.stringify(["400", "600", "700"]),
        primaryFontSource: null,
        secondaryFontFamily: customSecondary,
        secondaryFontWeights: JSON.stringify(["400", "600"]),
        secondaryFontSource: null,
        notes: customNotes || null,
      };
    } else {
      if (!selectedPairing) {
        toast.error("Please select a font pairing");
        return;
      }

      const pairing = FONT_PAIRINGS.find((p) => p.name === selectedPairing);
      if (!pairing) return;

      fontData = {
        name: pairing.name,
        primaryFontFamily: pairing.primary,
        primaryFontWeights: JSON.stringify(pairing.primaryWeights),
        primaryFontSource: `https://fonts.google.com/specimen/${pairing.primary.replace(
          " ",
          "+"
        )}`,
        secondaryFontFamily: pairing.secondary,
        secondaryFontWeights: JSON.stringify(pairing.secondaryWeights),
        secondaryFontSource: `https://fonts.google.com/specimen/${pairing.secondary.replace(
          " ",
          "+"
        )}`,
        notes: pairing.description,
      };
    }

    setIsSaving(true);

    try {
      const response = await fetch(`/api/projects/${projectId}/typography`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fontData),
      });

      if (!response.ok) {
        throw new Error("Failed to save typography");
      }

      toast.success("Typography saved successfully");
      setOpen(false);
      setSelectedPairing("");
      setCustomMode(false);
      setCustomName("");
      setCustomPrimary("");
      setCustomSecondary("");
      setCustomNotes("");
      router.refresh();
    } catch (error) {
      console.error("Error saving typography:", error);
      toast.error("Failed to save typography");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!typography) return;

    try {
      const response = await fetch(
        `/api/projects/${projectId}/typography/${typography.id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete typography");
      }

      toast.success("Typography deleted");
      router.refresh();
    } catch (error) {
      console.error("Error deleting typography:", error);
      toast.error("Failed to delete typography");
    }
  };

  const handleApprove = async () => {
    if (!typography) return;

    try {
      const response = await fetch(
        `/api/projects/${projectId}/typography/${typography.id}/approve`,
        {
          method: "PATCH",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to approve typography");
      }

      toast.success("Typography approved");
      router.refresh();
    } catch (error) {
      console.error("Error approving typography:", error);
      toast.error("Failed to approve typography");
    }
  };

  const selectedPairingData = FONT_PAIRINGS.find(
    (p) => p.name === selectedPairing
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Typography System</h3>
          <p className="text-sm text-muted-foreground">
            Select font pairings that align with your brand voice
          </p>
        </div>
        {!typography && (
          <Button onClick={() => setOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Typography
          </Button>
        )}
      </div>

      {/* Current Typography */}
      {typography ? (
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  {typography.name}
                  {typography.isApproved && (
                    <Badge variant="default" className="ml-2">
                      Approved
                    </Badge>
                  )}
                </CardTitle>
                {typography.notes && (
                  <p className="text-sm text-muted-foreground mt-2">
                    {typography.notes}
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                {!typography.isApproved && (
                  <Button
                    variant="default"
                    size="sm"
                    onClick={handleApprove}
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Approve
                  </Button>
                )}
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleDelete}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Preview */}
            <div className="space-y-4">
              <div>
                <Label className="text-xs text-muted-foreground">
                  Primary/Heading Font
                </Label>
                <p
                  className="text-3xl font-bold mt-2"
                  style={{ fontFamily: typography.primaryFontFamily }}
                >
                  {typography.primaryFontFamily}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Weights: {JSON.parse(typography.primaryFontWeights).join(", ")}
                </p>
              </div>

              <div>
                <Label className="text-xs text-muted-foreground">
                  Secondary/Body Font
                </Label>
                <p
                  className="text-lg mt-2"
                  style={{ fontFamily: typography.secondaryFontFamily }}
                >
                  {typography.secondaryFontFamily}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Weights: {JSON.parse(typography.secondaryFontWeights).join(", ")}
                </p>
              </div>

              {/* Sample Text */}
              <div className="border-t pt-4">
                <Label className="text-xs text-muted-foreground mb-2 block">
                  Preview
                </Label>
                <div className="space-y-2">
                  <h1
                    className="text-4xl font-bold"
                    style={{ fontFamily: typography.primaryFontFamily }}
                  >
                    Brand Headline
                  </h1>
                  <p
                    className="text-lg"
                    style={{ fontFamily: typography.secondaryFontFamily }}
                  >
                    The quick brown fox jumps over the lazy dog. This is how
                    your body text will appear across all brand materials.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Sparkles className="h-16 w-16 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium mb-2">
              No typography selected yet
            </h3>
            <p className="text-muted-foreground text-center max-w-sm mb-6">
              Choose from curated font pairings or create a custom typography
              system for your brand
            </p>
            <Button onClick={() => setOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Select Typography
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Selection Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Select Typography System</DialogTitle>
            <DialogDescription>
              Choose a font pairing or create a custom system
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Mode Toggle */}
            <div className="flex gap-2">
              <Button
                variant={!customMode ? "default" : "outline"}
                size="sm"
                onClick={() => setCustomMode(false)}
              >
                Curated Pairings
              </Button>
              <Button
                variant={customMode ? "default" : "outline"}
                size="sm"
                onClick={() => setCustomMode(true)}
              >
                Custom Fonts
              </Button>
            </div>

            {/* Curated Pairings */}
            {!customMode && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {FONT_PAIRINGS.map((pairing) => (
                    <Card
                      key={pairing.name}
                      className={`cursor-pointer transition-all hover:border-primary ${
                        selectedPairing === pairing.name
                          ? "border-primary ring-2 ring-primary/20"
                          : ""
                      }`}
                      onClick={() => setSelectedPairing(pairing.name)}
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-base">
                              {pairing.name}
                            </CardTitle>
                            <Badge variant="secondary" className="mt-1 text-xs">
                              {pairing.category}
                            </Badge>
                          </div>
                          {selectedPairing === pairing.name && (
                            <Check className="h-5 w-5 text-primary" />
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <p className="text-xs text-muted-foreground">
                          {pairing.description}
                        </p>
                        <div
                          className="text-2xl font-bold"
                          style={{ fontFamily: pairing.primary }}
                        >
                          Heading
                        </div>
                        <div
                          className="text-sm"
                          style={{ fontFamily: pairing.secondary }}
                        >
                          Body text example for brand content
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Preview Selected */}
                {selectedPairingData && (
                  <Card className="bg-muted/30">
                    <CardHeader>
                      <CardTitle className="text-sm">Preview</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Input
                        placeholder="Type to preview..."
                        value={previewText}
                        onChange={(e) => setPreviewText(e.target.value)}
                        className="mb-4"
                      />
                      <div className="space-y-3 p-4 bg-background rounded-lg">
                        <div
                          className="text-3xl font-bold"
                          style={{
                            fontFamily: selectedPairingData.primary,
                          }}
                        >
                          {previewText}
                        </div>
                        <div
                          className="text-base"
                          style={{
                            fontFamily: selectedPairingData.secondary,
                          }}
                        >
                          {previewText}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </>
            )}

            {/* Custom Mode */}
            {customMode && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="customName">System Name *</Label>
                  <Input
                    id="customName"
                    placeholder="e.g., My Brand Typography"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="customPrimary">
                      Primary/Heading Font *
                    </Label>
                    <Input
                      id="customPrimary"
                      placeholder="e.g., Inter"
                      value={customPrimary}
                      onChange={(e) => setCustomPrimary(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="customSecondary">
                      Secondary/Body Font *
                    </Label>
                    <Input
                      id="customSecondary"
                      placeholder="e.g., Roboto"
                      value={customSecondary}
                      onChange={(e) => setCustomSecondary(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="customNotes">Notes (Optional)</Label>
                  <Textarea
                    id="customNotes"
                    placeholder="Add usage guidelines or notes..."
                    value={customNotes}
                    onChange={(e) => setCustomNotes(e.target.value)}
                    rows={3}
                  />
                </div>

                {/* Custom Preview */}
                {customPrimary && customSecondary && (
                  <Card className="bg-muted/30">
                    <CardHeader>
                      <CardTitle className="text-sm">Preview</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3 p-4 bg-background rounded-lg">
                        <div
                          className="text-3xl font-bold"
                          style={{ fontFamily: customPrimary }}
                        >
                          {previewText}
                        </div>
                        <div
                          className="text-base"
                          style={{ fontFamily: customSecondary }}
                        >
                          {previewText}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSavePairing}
              disabled={
                isSaving ||
                (!customMode && !selectedPairing) ||
                (customMode && (!customName || !customPrimary || !customSecondary))
              }
            >
              {isSaving ? "Saving..." : "Save Typography"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
