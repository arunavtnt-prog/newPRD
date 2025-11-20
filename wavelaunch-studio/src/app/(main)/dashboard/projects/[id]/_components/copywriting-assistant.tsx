/**
 * Copywriting Assistant Component
 *
 * AI-powered copywriting tool for website content
 */

"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Pencil,
  Plus,
  Sparkles,
  Copy,
  Check,
  Star,
  Trash2,
  Loader2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CopywritingAssistantProps {
  projectId: string;
  projectName: string;
  copySnippets: any[];
}

const COPY_PURPOSES = [
  { value: "HOMEPAGE_HERO", label: "Homepage Hero" },
  { value: "HOMEPAGE_SUBTITLE", label: "Homepage Subtitle" },
  { value: "ABOUT_STORY", label: "About Story" },
  { value: "PRODUCT_HEADLINE", label: "Product Headline" },
  { value: "PRODUCT_DESCRIPTION", label: "Product Description" },
  { value: "PRODUCT_FEATURES", label: "Product Features" },
  { value: "CTA_BUTTON", label: "CTA Button" },
  { value: "EMAIL_SUBJECT", label: "Email Subject" },
  { value: "EMAIL_PREVIEW", label: "Email Preview" },
  { value: "SOCIAL_CAPTION", label: "Social Media Caption" },
  { value: "AD_HEADLINE", label: "Ad Headline" },
  { value: "AD_DESCRIPTION", label: "Ad Description" },
  { value: "SEO_TITLE", label: "SEO Title" },
  { value: "META_DESCRIPTION", label: "Meta Description" },
];

export function CopywritingAssistant({
  projectId,
  projectName,
  copySnippets,
}: CopywritingAssistantProps) {
  const { toast } = useToast();
  const [snippets, setSnippets] = React.useState(copySnippets);
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  const [generateForm, setGenerateForm] = React.useState({
    purpose: "HOMEPAGE_HERO",
    context: "",
    targetLength: 100,
  });

  const [manualForm, setManualForm] = React.useState({
    purpose: "HOMEPAGE_HERO",
    content: "",
    context: "",
  });

  const handleGenerate = async () => {
    if (!generateForm.context) {
      toast({
        title: "Context required",
        description: "Please provide some context for the AI to work with",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);

    try {
      const response = await fetch(`/api/projects/${projectId}/copy/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          purpose: generateForm.purpose,
          context: generateForm.context,
          targetLength: generateForm.targetLength,
          projectName: projectName,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate copy");
      }

      const data = await response.json();

      toast({
        title: "Copy generated",
        description: "3 variations have been created for you to review",
      });

      setTimeout(() => window.location.reload(), 1000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate copy. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleManualSave = async () => {
    if (!manualForm.content) {
      toast({
        title: "Content required",
        description: "Please enter the copy content",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch(`/api/projects/${projectId}/copy`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          purpose: manualForm.purpose,
          content: manualForm.content,
          context: manualForm.context,
          generatedBy: "MANUAL",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save copy");
      }

      toast({
        title: "Copy saved",
        description: "Your copy has been saved",
      });

      setManualForm({
        purpose: "HOMEPAGE_HERO",
        content: "",
        context: "",
      });

      setTimeout(() => window.location.reload(), 1000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save copy",
        variant: "destructive",
      });
    }
  };

  const handleApprove = async (snippetId: string) => {
    try {
      const response = await fetch(
        `/api/projects/${projectId}/copy/${snippetId}/approve`,
        {
          method: "PATCH",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to approve");
      }

      toast({
        title: "Copy approved",
      });

      setTimeout(() => window.location.reload(), 1000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve copy",
        variant: "destructive",
      });
    }
  };

  const handleToggleFavorite = async (snippetId: string) => {
    try {
      const snippet = snippets.find((s) => s.id === snippetId);
      const response = await fetch(
        `/api/projects/${projectId}/copy/${snippetId}/favorite`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ isFavorite: !snippet?.isFavorite }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update favorite");
      }

      setTimeout(() => window.location.reload(), 500);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update favorite",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (snippetId: string) => {
    if (!confirm("Are you sure you want to delete this copy snippet?")) {
      return;
    }

    try {
      const response = await fetch(
        `/api/projects/${projectId}/copy/${snippetId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete");
      }

      toast({
        title: "Copy deleted",
      });

      setTimeout(() => window.location.reload(), 1000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete copy",
        variant: "destructive",
      });
    }
  };

  const handleCopy = (snippetId: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(snippetId);
    toast({
      title: "Copied to clipboard",
    });
    setTimeout(() => setCopiedId(null), 2000);
  };

  const groupedSnippets = snippets.reduce((acc, snippet) => {
    if (!acc[snippet.purpose]) {
      acc[snippet.purpose] = [];
    }
    acc[snippet.purpose].push(snippet);
    return acc;
  }, {} as Record<string, any[]>);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold">Copywriting Assistant</h3>
        <p className="text-sm text-muted-foreground">
          Generate AI-powered copy or write your own for different purposes
        </p>
      </div>

      <Tabs defaultValue="generate" className="space-y-6">
        <TabsList>
          <TabsTrigger value="generate">
            <Sparkles className="h-4 w-4 mr-2" />
            AI Generate
          </TabsTrigger>
          <TabsTrigger value="manual">
            <Pencil className="h-4 w-4 mr-2" />
            Write Manually
          </TabsTrigger>
          <TabsTrigger value="library">
            <Copy className="h-4 w-4 mr-2" />
            Copy Library ({snippets.length})
          </TabsTrigger>
        </TabsList>

        {/* AI Generate Tab */}
        <TabsContent value="generate">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-purple-500" />
                Generate Copy with AI
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="generate-purpose">Copy Purpose</Label>
                <Select
                  value={generateForm.purpose}
                  onValueChange={(value) =>
                    setGenerateForm((prev) => ({ ...prev, purpose: value }))
                  }
                >
                  <SelectTrigger id="generate-purpose">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {COPY_PURPOSES.map((purpose) => (
                      <SelectItem key={purpose.value} value={purpose.value}>
                        {purpose.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="context">
                  Context / Brief
                  <span className="text-muted-foreground ml-1">(required)</span>
                </Label>
                <Textarea
                  id="context"
                  placeholder="Describe your brand, product, target audience, key messages, tone of voice, etc. The more detail you provide, the better the AI can tailor the copy."
                  rows={5}
                  value={generateForm.context}
                  onChange={(e) =>
                    setGenerateForm((prev) => ({
                      ...prev,
                      context: e.target.value,
                    }))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="targetLength">Target Length (characters)</Label>
                <Input
                  id="targetLength"
                  type="number"
                  value={generateForm.targetLength}
                  onChange={(e) =>
                    setGenerateForm((prev) => ({
                      ...prev,
                      targetLength: parseInt(e.target.value) || 100,
                    }))
                  }
                />
              </div>

              <Button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating 3 variations...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate Copy
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Manual Write Tab */}
        <TabsContent value="manual">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Pencil className="h-5 w-5" />
                Write Copy Manually
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="manual-purpose">Copy Purpose</Label>
                <Select
                  value={manualForm.purpose}
                  onValueChange={(value) =>
                    setManualForm((prev) => ({ ...prev, purpose: value }))
                  }
                >
                  <SelectTrigger id="manual-purpose">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {COPY_PURPOSES.map((purpose) => (
                      <SelectItem key={purpose.value} value={purpose.value}>
                        {purpose.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">
                  Copy Content
                  <span className="text-muted-foreground ml-1">(required)</span>
                </Label>
                <Textarea
                  id="content"
                  placeholder="Write your copy here..."
                  rows={5}
                  value={manualForm.content}
                  onChange={(e) =>
                    setManualForm((prev) => ({
                      ...prev,
                      content: e.target.value,
                    }))
                  }
                />
                <p className="text-sm text-muted-foreground">
                  {manualForm.content.length} characters
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="manual-context">Notes / Context (optional)</Label>
                <Textarea
                  id="manual-context"
                  placeholder="Add any notes about this copy..."
                  rows={3}
                  value={manualForm.context}
                  onChange={(e) =>
                    setManualForm((prev) => ({
                      ...prev,
                      context: e.target.value,
                    }))
                  }
                />
              </div>

              <Button onClick={handleManualSave} className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                Save Copy
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Copy Library Tab */}
        <TabsContent value="library">
          {snippets.length > 0 ? (
            <div className="space-y-6">
              {Object.entries(groupedSnippets).map(([purpose, purposeSnippets]) => {
                const purposeLabel =
                  COPY_PURPOSES.find((p) => p.value === purpose)?.label ||
                  purpose;

                return (
                  <div key={purpose} className="space-y-3">
                    <h4 className="font-semibold text-sm uppercase text-muted-foreground">
                      {purposeLabel}
                    </h4>
                    <div className="space-y-3">
                      {purposeSnippets.map((snippet) => (
                        <Card key={snippet.id}>
                          <CardContent className="p-4">
                            <div className="space-y-3">
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                  <p className="text-sm mb-2">{snippet.content}</p>
                                  <div className="flex items-center gap-2 flex-wrap">
                                    {snippet.isApproved && (
                                      <Badge variant="default">
                                        <Check className="h-3 w-3 mr-1" />
                                        Approved
                                      </Badge>
                                    )}
                                    {snippet.isFavorite && (
                                      <Badge variant="secondary">
                                        <Star className="h-3 w-3 mr-1 fill-current" />
                                        Favorite
                                      </Badge>
                                    )}
                                    {snippet.generatedBy && (
                                      <Badge variant="outline">
                                        {snippet.generatedBy === "MANUAL"
                                          ? "Manual"
                                          : "AI Generated"}
                                      </Badge>
                                    )}
                                    {snippet.variation > 1 && (
                                      <Badge variant="outline">
                                        Var. {snippet.variation}
                                      </Badge>
                                    )}
                                  </div>
                                  {snippet.context && (
                                    <p className="text-xs text-muted-foreground mt-2">
                                      {snippet.context}
                                    </p>
                                  )}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                      handleCopy(snippet.id, snippet.content)
                                    }
                                  >
                                    {copiedId === snippet.id ? (
                                      <Check className="h-4 w-4" />
                                    ) : (
                                      <Copy className="h-4 w-4" />
                                    )}
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleToggleFavorite(snippet.id)}
                                  >
                                    <Star
                                      className={`h-4 w-4 ${
                                        snippet.isFavorite ? "fill-current" : ""
                                      }`}
                                    />
                                  </Button>
                                  {!snippet.isApproved && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleApprove(snippet.id)}
                                    >
                                      <Check className="h-4 w-4" />
                                    </Button>
                                  )}
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDelete(snippet.id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16">
                <Pencil className="h-16 w-16 text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-medium mb-2">No copy yet</h3>
                <p className="text-muted-foreground text-center max-w-sm mb-6">
                  Generate copy with AI or write your own to build your content
                  library
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
