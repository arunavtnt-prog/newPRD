/**
 * Tone & Voice Selector Component
 *
 * Interactive tool for defining brand tone, voice, and aesthetic direction
 */

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Loader2, Save, MessageCircle, Palette } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface ToneVoiceSelectorProps {
  projectId: string;
  initialData?: {
    toneOfVoice: string;
    aestheticDirection: string;
    colorPreferences?: string;
    avoidColors?: string;
  };
  discoveryData?: any;
}

export function ToneVoiceSelector({
  projectId,
  initialData,
  discoveryData,
}: ToneVoiceSelectorProps) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);

  // Form state
  const [tone, setTone] = useState(initialData?.toneOfVoice || "AUTHENTIC");
  const [aesthetic, setAesthetic] = useState(initialData?.aestheticDirection || "");
  const [colorPrefs, setColorPrefs] = useState(initialData?.colorPreferences || "");
  const [avoidColors, setAvoidColors] = useState(initialData?.avoidColors || "");

  const toneOptions = [
    {
      value: "PLAYFUL",
      label: "Playful",
      description: "Fun, energetic, and lighthearted communication",
      example: "Let's make magic happen! 🎉",
    },
    {
      value: "SOPHISTICATED",
      label: "Sophisticated",
      description: "Refined, elegant, and cultured messaging",
      example: "Experience timeless elegance.",
    },
    {
      value: "BOLD",
      label: "Bold",
      description: "Confident, daring, and unapologetic voice",
      example: "Break the rules. Stand out.",
    },
    {
      value: "MINIMAL",
      label: "Minimal",
      description: "Simple, clean, and focused communication",
      example: "Less is more.",
    },
    {
      value: "AUTHENTIC",
      label: "Authentic",
      description: "Genuine, transparent, and relatable voice",
      example: "Real talk, real results.",
    },
    {
      value: "LUXURIOUS",
      label: "Luxurious",
      description: "Premium, exclusive, and aspirational messaging",
      example: "Indulge in excellence.",
    },
    {
      value: "EDGY",
      label: "Edgy",
      description: "Unconventional, provocative, and boundary-pushing",
      example: "Challenge everything.",
    },
    {
      value: "WARM",
      label: "Warm",
      description: "Friendly, approachable, and welcoming tone",
      example: "We're here for you, always.",
    },
  ];

  const handleSave = async () => {
    // Validation
    if (!aesthetic || aesthetic.length < 20) {
      toast.error("Aesthetic direction must be at least 20 characters");
      return;
    }

    setIsSaving(true);
    try {
      // If discovery data doesn't exist, we need all required fields
      if (!discoveryData) {
        toast.error("Please complete the Discovery Questionnaire first");
        setIsSaving(false);
        return;
      }

      // Merge with existing discovery data
      const payload = {
        ...discoveryData,
        toneOfVoice: tone,
        aestheticDirection: aesthetic,
        colorPreferences: colorPrefs || undefined,
        avoidColors: avoidColors || undefined,
      };

      const response = await fetch(`/api/projects/${projectId}/discovery`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to save tone & voice data");
      }

      toast.success("Tone & voice preferences saved successfully!");
      router.refresh();
    } catch (error) {
      console.error("Error saving tone & voice data:", error);
      toast.error(error instanceof Error ? error.message : "Failed to save tone & voice data");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Tone of Voice Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-primary" />
            <CardTitle>Tone of Voice</CardTitle>
          </div>
          <CardDescription>
            Select the tone that best represents how your brand should communicate
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup value={tone} onValueChange={setTone}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {toneOptions.map((option) => (
                <Label
                  key={option.value}
                  htmlFor={option.value}
                  className={cn(
                    "flex flex-col gap-2 p-4 rounded-lg border-2 cursor-pointer transition-all",
                    tone === option.value
                      ? "border-primary bg-primary/5"
                      : "border-muted hover:border-primary/50"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <RadioGroupItem
                      value={option.value}
                      id={option.value}
                      className="mt-0.5"
                    />
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{option.label}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {option.description}
                      </p>
                      <p className="text-xs italic text-primary/70 mt-2">
                        "{option.example}"
                      </p>
                    </div>
                  </div>
                </Label>
              ))}
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Aesthetic Direction Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Palette className="h-5 w-5 text-primary" />
            <CardTitle>Aesthetic Direction</CardTitle>
          </div>
          <CardDescription>
            Describe the overall visual style and feel of your brand
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="aesthetic">Visual & Aesthetic Description *</Label>
            <Textarea
              id="aesthetic"
              placeholder="Describe your desired aesthetic... e.g., 'Modern minimalist with organic textures, earthy tones, and clean typography. Inspired by Scandinavian design principles with warmth.'"
              value={aesthetic}
              onChange={(e) => setAesthetic(e.target.value)}
              rows={5}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground">
              {aesthetic.length}/500 characters (minimum 20)
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Color Preferences Section */}
      <Card>
        <CardHeader>
          <CardTitle>Color Preferences</CardTitle>
          <CardDescription>
            Optional: Guide the color palette generation
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="colorPrefs">Preferred Colors (Optional)</Label>
            <Input
              id="colorPrefs"
              placeholder="e.g., Deep blues, warm terracotta, natural greens"
              value={colorPrefs}
              onChange={(e) => setColorPrefs(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Colors you'd like to see in your brand palette
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="avoidColors">Colors to Avoid (Optional)</Label>
            <Input
              id="avoidColors"
              placeholder="e.g., Neon colors, pastels, bright reds"
              value={avoidColors}
              onChange={(e) => setAvoidColors(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Colors that don't align with your brand
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end gap-3">
        <Button onClick={handleSave} disabled={isSaving} size="lg">
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Tone & Voice
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
