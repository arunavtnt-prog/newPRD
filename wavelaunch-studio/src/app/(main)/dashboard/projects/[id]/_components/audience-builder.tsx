/**
 * Audience Builder Component
 *
 * Interactive tool for defining target audience personas
 */

"use client";

import { useState } from "react";
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Save, Users, Heart, Target } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface AudienceBuilderProps {
  projectId: string;
  initialData?: {
    targetAgeRange: string;
    targetGender: string;
    targetIncome: string;
    targetLocation: string;
    audiencePainPoints: string;
    audienceAspirations: string;
  };
  discoveryData?: any;
}

export function AudienceBuilder({ projectId, initialData, discoveryData }: AudienceBuilderProps) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);

  // Form state
  const [ageRange, setAgeRange] = useState(initialData?.targetAgeRange || "");
  const [gender, setGender] = useState(initialData?.targetGender || "ALL");
  const [income, setIncome] = useState(initialData?.targetIncome || "50K_75K");
  const [location, setLocation] = useState(initialData?.targetLocation || "");
  const [painPoints, setPainPoints] = useState(initialData?.audiencePainPoints || "");
  const [aspirations, setAspirations] = useState(initialData?.audienceAspirations || "");

  const handleSave = async () => {
    // Validation
    if (!ageRange || ageRange.length < 3) {
      toast.error("Please enter a valid age range (e.g., '25-35')");
      return;
    }
    if (!location || location.length < 3) {
      toast.error("Please enter a target location");
      return;
    }
    if (!painPoints || painPoints.length < 20) {
      toast.error("Pain points description must be at least 20 characters");
      return;
    }
    if (!aspirations || aspirations.length < 20) {
      toast.error("Aspirations description must be at least 20 characters");
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
        targetAgeRange: ageRange,
        targetGender: gender,
        targetIncome: income,
        targetLocation: location,
        audiencePainPoints: painPoints,
        audienceAspirations: aspirations,
      };

      const response = await fetch(`/api/projects/${projectId}/discovery`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to save audience data");
      }

      toast.success("Audience profile saved successfully!");
      router.refresh();
    } catch (error) {
      console.error("Error saving audience data:", error);
      toast.error(error instanceof Error ? error.message : "Failed to save audience data");
    } finally {
      setIsSaving(false);
    }
  };

  const genderOptions = [
    { value: "FEMALE", label: "Female" },
    { value: "MALE", label: "Male" },
    { value: "NON_BINARY", label: "Non-Binary" },
    { value: "ALL", label: "All Genders" },
  ];

  const incomeOptions = [
    { value: "UNDER_30K", label: "Under $30,000" },
    { value: "30K_50K", label: "$30,000 - $50,000" },
    { value: "50K_75K", label: "$50,000 - $75,000" },
    { value: "75K_100K", label: "$75,000 - $100,000" },
    { value: "OVER_100K", label: "Over $100,000" },
  ];

  return (
    <div className="space-y-6">
      {/* Demographics Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            <CardTitle>Demographics</CardTitle>
          </div>
          <CardDescription>
            Define the basic demographic characteristics of your target audience
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ageRange">Age Range *</Label>
              <Input
                id="ageRange"
                placeholder="e.g., 25-35, 18-24, 30-45"
                value={ageRange}
                onChange={(e) => setAgeRange(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Enter the primary age range of your target customers
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender">Gender *</Label>
              <Select value={gender} onValueChange={setGender}>
                <SelectTrigger id="gender">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {genderOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="income">Income Level *</Label>
              <Select value={income} onValueChange={setIncome}>
                <SelectTrigger id="income">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {incomeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Primary Location *</Label>
              <Input
                id="location"
                placeholder="e.g., United States, Urban areas, NYC Metro"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Geographic focus or where they live
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Psychographics Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            <CardTitle>Pain Points & Challenges</CardTitle>
          </div>
          <CardDescription>
            What problems or frustrations does your audience experience?
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="painPoints">Audience Pain Points *</Label>
            <Textarea
              id="painPoints"
              placeholder="Describe the key problems, frustrations, or challenges your target audience faces that your brand can solve..."
              value={painPoints}
              onChange={(e) => setPainPoints(e.target.value)}
              rows={4}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground">
              {painPoints.length}/500 characters (minimum 20)
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-primary" />
            <CardTitle>Goals & Aspirations</CardTitle>
          </div>
          <CardDescription>
            What does your audience want to achieve or become?
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="aspirations">Audience Aspirations *</Label>
            <Textarea
              id="aspirations"
              placeholder="Describe what your target audience aspires to be, achieve, or how they want to feel. What are their goals and dreams?"
              value={aspirations}
              onChange={(e) => setAspirations(e.target.value)}
              rows={4}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground">
              {aspirations.length}/500 characters (minimum 20)
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end gap-3">
        <Button
          onClick={handleSave}
          disabled={isSaving}
          size="lg"
        >
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Audience Profile
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
