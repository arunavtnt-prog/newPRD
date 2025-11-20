/**
 * Discovery Questionnaire Component
 *
 * 28-question brand discovery form for capturing creator vision
 */

"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Save, ChevronRight, ChevronLeft } from "lucide-react";
import { toast } from "sonner";

// Validation schema
const questionnaireSchema = z.object({
  // Brand Basics
  brandVision: z.string().min(20).max(500),
  brandMission: z.string().min(20).max(500),
  brandValues: z.string().min(20).max(500),
  brandPersonality: z.string().min(20).max(300),

  // Product & Category
  productCategory: z.enum(["FASHION", "BEAUTY", "FITNESS", "LIFESTYLE", "OTHER"]),
  productDescription: z.string().min(20).max(500),
  productDifferentiators: z.string().min(20).max(500),
  pricePoint: z.enum(["BUDGET", "MID_RANGE", "PREMIUM", "LUXURY"]),

  // Audience
  targetAgeRange: z.string().min(3).max(50),
  targetGender: z.enum(["FEMALE", "MALE", "NON_BINARY", "ALL"]),
  targetIncome: z.enum(["UNDER_30K", "30K_50K", "50K_75K", "75K_100K", "OVER_100K"]),
  targetLocation: z.string().min(3).max(200),
  audiencePainPoints: z.string().min(20).max(500),
  audienceAspirations: z.string().min(20).max(500),

  // Brand Voice & Aesthetic
  toneOfVoice: z.enum(["PLAYFUL", "SOPHISTICATED", "BOLD", "MINIMAL", "AUTHENTIC", "LUXURIOUS", "EDGY", "WARM"]),
  aestheticDirection: z.string().min(20).max(500),
  colorPreferences: z.string().optional(),
  avoidColors: z.string().optional(),

  // Inspiration & Competition
  inspirationBrands: z.string().min(10).max(500),
  competitorBrands: z.string().min(10).max(500),
  differentiationStrategy: z.string().min(20).max(500),

  // Content & Marketing
  contentPillars: z.string().min(20).max(500),
  socialMediaFocus: z.string().min(10).max(300),
  launchGoals: z.string().min(20).max(500),

  // Additional
  mustHaveElements: z.string().optional(),
  avoidElements: z.string().optional(),
  additionalNotes: z.string().optional(),
});

type QuestionnaireFormValues = z.infer<typeof questionnaireSchema>;

interface DiscoveryQuestionnaireProps {
  projectId: string;
  initialData?: Partial<QuestionnaireFormValues>;
}

export function DiscoveryQuestionnaire({
  projectId,
  initialData,
}: DiscoveryQuestionnaireProps) {
  const [currentSection, setCurrentSection] = React.useState(0);
  const [isSaving, setIsSaving] = React.useState(false);
  const router = useRouter();

  const form = useForm<QuestionnaireFormValues>({
    resolver: zodResolver(questionnaireSchema),
    defaultValues: initialData || {},
  });

  const sections = [
    {
      title: "Brand Foundation",
      description: "Core mission, vision, and values",
      fields: ["brandVision", "brandMission", "brandValues", "brandPersonality"],
    },
    {
      title: "Product & Category",
      description: "What you're building and selling",
      fields: ["productCategory", "productDescription", "productDifferentiators", "pricePoint"],
    },
    {
      title: "Target Audience",
      description: "Who you're building for",
      fields: ["targetAgeRange", "targetGender", "targetIncome", "targetLocation", "audiencePainPoints", "audienceAspirations"],
    },
    {
      title: "Brand Voice & Aesthetic",
      description: "How your brand looks and sounds",
      fields: ["toneOfVoice", "aestheticDirection", "colorPreferences", "avoidColors"],
    },
    {
      title: "Market Position",
      description: "Inspiration and differentiation",
      fields: ["inspirationBrands", "competitorBrands", "differentiationStrategy"],
    },
    {
      title: "Content & Launch",
      description: "Marketing strategy and goals",
      fields: ["contentPillars", "socialMediaFocus", "launchGoals", "mustHaveElements", "avoidElements", "additionalNotes"],
    },
  ];

  const currentSectionData = sections[currentSection];
  const progress = ((currentSection + 1) / sections.length) * 100;

  async function onSubmit(data: QuestionnaireFormValues) {
    setIsSaving(true);

    try {
      const response = await fetch(`/api/projects/${projectId}/discovery`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to save questionnaire");
      }

      toast.success("Discovery questionnaire saved successfully");
      router.refresh();
    } catch (error) {
      console.error("Error saving questionnaire:", error);
      toast.error("Failed to save questionnaire");
    } finally {
      setIsSaving(false);
    }
  }

  const handleNext = () => {
    if (currentSection < sections.length - 1) {
      setCurrentSection(currentSection + 1);
    }
  };

  const handlePrevious = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
    }
  };

  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium">Section {currentSection + 1} of {sections.length}</span>
          <span className="text-muted-foreground">{Math.round(progress)}% Complete</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Section Card */}
      <Card>
        <CardHeader>
          <CardTitle>{currentSectionData.title}</CardTitle>
          <p className="text-sm text-muted-foreground">
            {currentSectionData.description}
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Section 0: Brand Foundation */}
            {currentSection === 0 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="brandVision">Brand Vision *</Label>
                  <Textarea
                    id="brandVision"
                    placeholder="What's the ultimate impact you want your brand to have?"
                    {...form.register("brandVision")}
                    rows={3}
                  />
                  {form.formState.errors.brandVision && (
                    <p className="text-sm text-red-500">
                      {form.formState.errors.brandVision.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="brandMission">Brand Mission *</Label>
                  <Textarea
                    id="brandMission"
                    placeholder="What problem does your brand solve? Why does it exist?"
                    {...form.register("brandMission")}
                    rows={3}
                  />
                  {form.formState.errors.brandMission && (
                    <p className="text-sm text-red-500">
                      {form.formState.errors.brandMission.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="brandValues">Core Values *</Label>
                  <Textarea
                    id="brandValues"
                    placeholder="What principles guide your brand? (e.g., sustainability, inclusivity, innovation)"
                    {...form.register("brandValues")}
                    rows={3}
                  />
                  {form.formState.errors.brandValues && (
                    <p className="text-sm text-red-500">
                      {form.formState.errors.brandValues.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="brandPersonality">Brand Personality *</Label>
                  <Textarea
                    id="brandPersonality"
                    placeholder="If your brand were a person, how would you describe them?"
                    {...form.register("brandPersonality")}
                    rows={3}
                  />
                  {form.formState.errors.brandPersonality && (
                    <p className="text-sm text-red-500">
                      {form.formState.errors.brandPersonality.message}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Section 1: Product & Category */}
            {currentSection === 1 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="productCategory">Product Category *</Label>
                  <Select
                    onValueChange={(value) => form.setValue("productCategory", value as any)}
                    defaultValue={form.getValues("productCategory")}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="FASHION">Fashion</SelectItem>
                      <SelectItem value="BEAUTY">Beauty</SelectItem>
                      <SelectItem value="FITNESS">Fitness</SelectItem>
                      <SelectItem value="LIFESTYLE">Lifestyle</SelectItem>
                      <SelectItem value="OTHER">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  {form.formState.errors.productCategory && (
                    <p className="text-sm text-red-500">
                      {form.formState.errors.productCategory.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="productDescription">Product Description *</Label>
                  <Textarea
                    id="productDescription"
                    placeholder="Describe your product line in detail..."
                    {...form.register("productDescription")}
                    rows={4}
                  />
                  {form.formState.errors.productDescription && (
                    <p className="text-sm text-red-500">
                      {form.formState.errors.productDescription.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="productDifferentiators">What Makes It Different? *</Label>
                  <Textarea
                    id="productDifferentiators"
                    placeholder="What sets your product apart from competitors?"
                    {...form.register("productDifferentiators")}
                    rows={3}
                  />
                  {form.formState.errors.productDifferentiators && (
                    <p className="text-sm text-red-500">
                      {form.formState.errors.productDifferentiators.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pricePoint">Price Point *</Label>
                  <Select
                    onValueChange={(value) => form.setValue("pricePoint", value as any)}
                    defaultValue={form.getValues("pricePoint")}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select price range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BUDGET">Budget ($-$$)</SelectItem>
                      <SelectItem value="MID_RANGE">Mid-Range ($$-$$$)</SelectItem>
                      <SelectItem value="PREMIUM">Premium ($$$-$$$$)</SelectItem>
                      <SelectItem value="LUXURY">Luxury ($$$$+)</SelectItem>
                    </SelectContent>
                  </Select>
                  {form.formState.errors.pricePoint && (
                    <p className="text-sm text-red-500">
                      {form.formState.errors.pricePoint.message}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Section 2: Target Audience */}
            {currentSection === 2 && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="targetAgeRange">Age Range *</Label>
                    <Input
                      id="targetAgeRange"
                      placeholder="e.g., 18-35"
                      {...form.register("targetAgeRange")}
                    />
                    {form.formState.errors.targetAgeRange && (
                      <p className="text-sm text-red-500">
                        {form.formState.errors.targetAgeRange.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="targetGender">Gender *</Label>
                    <Select
                      onValueChange={(value) => form.setValue("targetGender", value as any)}
                      defaultValue={form.getValues("targetGender")}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="FEMALE">Female</SelectItem>
                        <SelectItem value="MALE">Male</SelectItem>
                        <SelectItem value="NON_BINARY">Non-Binary</SelectItem>
                        <SelectItem value="ALL">All Genders</SelectItem>
                      </SelectContent>
                    </Select>
                    {form.formState.errors.targetGender && (
                      <p className="text-sm text-red-500">
                        {form.formState.errors.targetGender.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="targetIncome">Income Level *</Label>
                  <Select
                    onValueChange={(value) => form.setValue("targetIncome", value as any)}
                    defaultValue={form.getValues("targetIncome")}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select income range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UNDER_30K">Under $30K</SelectItem>
                      <SelectItem value="30K_50K">$30K - $50K</SelectItem>
                      <SelectItem value="50K_75K">$50K - $75K</SelectItem>
                      <SelectItem value="75K_100K">$75K - $100K</SelectItem>
                      <SelectItem value="OVER_100K">Over $100K</SelectItem>
                    </SelectContent>
                  </Select>
                  {form.formState.errors.targetIncome && (
                    <p className="text-sm text-red-500">
                      {form.formState.errors.targetIncome.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="targetLocation">Target Location *</Label>
                  <Input
                    id="targetLocation"
                    placeholder="e.g., US (nationwide), CA + NY, Global"
                    {...form.register("targetLocation")}
                  />
                  {form.formState.errors.targetLocation && (
                    <p className="text-sm text-red-500">
                      {form.formState.errors.targetLocation.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="audiencePainPoints">Audience Pain Points *</Label>
                  <Textarea
                    id="audiencePainPoints"
                    placeholder="What problems or frustrations does your audience have?"
                    {...form.register("audiencePainPoints")}
                    rows={3}
                  />
                  {form.formState.errors.audiencePainPoints && (
                    <p className="text-sm text-red-500">
                      {form.formState.errors.audiencePainPoints.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="audienceAspirations">Audience Aspirations *</Label>
                  <Textarea
                    id="audienceAspirations"
                    placeholder="What are their goals and dreams? What do they aspire to?"
                    {...form.register("audienceAspirations")}
                    rows={3}
                  />
                  {form.formState.errors.audienceAspirations && (
                    <p className="text-sm text-red-500">
                      {form.formState.errors.audienceAspirations.message}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Section 3: Brand Voice & Aesthetic */}
            {currentSection === 3 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="toneOfVoice">Tone of Voice *</Label>
                  <Select
                    onValueChange={(value) => form.setValue("toneOfVoice", value as any)}
                    defaultValue={form.getValues("toneOfVoice")}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select tone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PLAYFUL">Playful & Fun</SelectItem>
                      <SelectItem value="SOPHISTICATED">Sophisticated & Elegant</SelectItem>
                      <SelectItem value="BOLD">Bold & Confident</SelectItem>
                      <SelectItem value="MINIMAL">Minimal & Clean</SelectItem>
                      <SelectItem value="AUTHENTIC">Authentic & Real</SelectItem>
                      <SelectItem value="LUXURIOUS">Luxurious & Premium</SelectItem>
                      <SelectItem value="EDGY">Edgy & Rebellious</SelectItem>
                      <SelectItem value="WARM">Warm & Approachable</SelectItem>
                    </SelectContent>
                  </Select>
                  {form.formState.errors.toneOfVoice && (
                    <p className="text-sm text-red-500">
                      {form.formState.errors.toneOfVoice.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="aestheticDirection">Aesthetic Direction *</Label>
                  <Textarea
                    id="aestheticDirection"
                    placeholder="Describe the visual style you're drawn to (modern, vintage, minimalist, maximalist, etc.)"
                    {...form.register("aestheticDirection")}
                    rows={4}
                  />
                  {form.formState.errors.aestheticDirection && (
                    <p className="text-sm text-red-500">
                      {form.formState.errors.aestheticDirection.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="colorPreferences">Color Preferences</Label>
                  <Input
                    id="colorPreferences"
                    placeholder="e.g., earthy tones, pastels, neons, black & white"
                    {...form.register("colorPreferences")}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="avoidColors">Colors to Avoid</Label>
                  <Input
                    id="avoidColors"
                    placeholder="e.g., avoid bright yellows, no neon colors"
                    {...form.register("avoidColors")}
                  />
                </div>
              </div>
            )}

            {/* Section 4: Market Position */}
            {currentSection === 4 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="inspirationBrands">Inspiration Brands *</Label>
                  <Textarea
                    id="inspirationBrands"
                    placeholder="List 3-5 brands you admire (in any category) and why"
                    {...form.register("inspirationBrands")}
                    rows={4}
                  />
                  {form.formState.errors.inspirationBrands && (
                    <p className="text-sm text-red-500">
                      {form.formState.errors.inspirationBrands.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="competitorBrands">Direct Competitors *</Label>
                  <Textarea
                    id="competitorBrands"
                    placeholder="List 3-5 brands in your category that compete for the same audience"
                    {...form.register("competitorBrands")}
                    rows={4}
                  />
                  {form.formState.errors.competitorBrands && (
                    <p className="text-sm text-red-500">
                      {form.formState.errors.competitorBrands.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="differentiationStrategy">How Will You Stand Out? *</Label>
                  <Textarea
                    id="differentiationStrategy"
                    placeholder="What makes your brand uniquely positioned in the market?"
                    {...form.register("differentiationStrategy")}
                    rows={4}
                  />
                  {form.formState.errors.differentiationStrategy && (
                    <p className="text-sm text-red-500">
                      {form.formState.errors.differentiationStrategy.message}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Section 5: Content & Launch */}
            {currentSection === 5 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="contentPillars">Content Pillars *</Label>
                  <Textarea
                    id="contentPillars"
                    placeholder="What topics will you focus on? (e.g., tutorials, lifestyle, behind-the-scenes)"
                    {...form.register("contentPillars")}
                    rows={3}
                  />
                  {form.formState.errors.contentPillars && (
                    <p className="text-sm text-red-500">
                      {form.formState.errors.contentPillars.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="socialMediaFocus">Primary Social Channels *</Label>
                  <Input
                    id="socialMediaFocus"
                    placeholder="e.g., Instagram, TikTok, YouTube"
                    {...form.register("socialMediaFocus")}
                  />
                  {form.formState.errors.socialMediaFocus && (
                    <p className="text-sm text-red-500">
                      {form.formState.errors.socialMediaFocus.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="launchGoals">Launch Goals *</Label>
                  <Textarea
                    id="launchGoals"
                    placeholder="What does a successful launch look like? (revenue, units sold, brand awareness, etc.)"
                    {...form.register("launchGoals")}
                    rows={3}
                  />
                  {form.formState.errors.launchGoals && (
                    <p className="text-sm text-red-500">
                      {form.formState.errors.launchGoals.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mustHaveElements">Must-Have Elements</Label>
                  <Textarea
                    id="mustHaveElements"
                    placeholder="Specific things that MUST be included in your brand"
                    {...form.register("mustHaveElements")}
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="avoidElements">Elements to Avoid</Label>
                  <Textarea
                    id="avoidElements"
                    placeholder="Things you definitely DON'T want in your brand"
                    {...form.register("avoidElements")}
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="additionalNotes">Additional Notes</Label>
                  <Textarea
                    id="additionalNotes"
                    placeholder="Anything else we should know?"
                    {...form.register("additionalNotes")}
                    rows={3}
                  />
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={handlePrevious}
                disabled={currentSection === 0}
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={form.handleSubmit(onSubmit)}
                  disabled={isSaving}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Draft
                </Button>

                {currentSection < sections.length - 1 ? (
                  <Button type="button" onClick={handleNext}>
                    Next
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={isSaving}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Complete Questionnaire
                  </Button>
                )}
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
