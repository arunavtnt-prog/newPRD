/**
 * Brand Naming Generator Component
 *
 * AI-powered brand name generation with domain and trademark availability checking
 */

"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Sparkles,
  Loader2,
  Globe,
  CheckCircle2,
  XCircle,
  AlertCircle,
  RefreshCw,
  Heart,
  Copy,
  Check
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface BrandNamingGeneratorProps {
  projectId: string;
  discoveryData?: any;
}

interface NameSuggestion {
  name: string;
  description: string;
  domainAvailable: boolean;
  trademarkStatus: "available" | "unavailable" | "checking";
  favorite: boolean;
}

export function BrandNamingGenerator({
  projectId,
  discoveryData,
}: BrandNamingGeneratorProps) {
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [keywords, setKeywords] = React.useState("");
  const [industry, setIndustry] = React.useState("");
  const [style, setStyle] = React.useState("modern");
  const [suggestions, setSuggestions] = React.useState<NameSuggestion[]>([]);
  const [copiedName, setCopiedName] = React.useState<string | null>(null);

  // Pre-fill from discovery data if available
  React.useEffect(() => {
    if (discoveryData) {
      if (discoveryData.brandDescription) {
        setKeywords(discoveryData.brandDescription);
      }
      if (discoveryData.targetAudience) {
        setIndustry(discoveryData.targetAudience);
      }
    }
  }, [discoveryData]);

  const handleGenerate = async () => {
    if (!keywords.trim()) {
      toast.error("Please enter keywords or brand description");
      return;
    }

    setIsGenerating(true);

    try {
      const response = await fetch("/api/naming/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId,
          keywords,
          industry,
          style,
          discoveryData,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate names");
      }

      const data = await response.json();
      setSuggestions(data.suggestions);
      toast.success(`Generated ${data.suggestions.length} name suggestions!`);
    } catch (error) {
      console.error("Error generating names:", error);
      toast.error("Failed to generate names. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const checkAvailability = async (name: string, index: number) => {
    try {
      const response = await fetch("/api/naming/check-availability", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      if (!response.ok) {
        throw new Error("Failed to check availability");
      }

      const data = await response.json();

      setSuggestions((prev) =>
        prev.map((s, i) =>
          i === index
            ? {
                ...s,
                domainAvailable: data.domainAvailable,
                trademarkStatus: data.trademarkStatus,
              }
            : s
        )
      );
    } catch (error) {
      console.error("Error checking availability:", error);
      toast.error("Failed to check availability");
    }
  };

  const toggleFavorite = (index: number) => {
    setSuggestions((prev) =>
      prev.map((s, i) => (i === index ? { ...s, favorite: !s.favorite } : s))
    );
  };

  const copyToClipboard = (name: string) => {
    navigator.clipboard.writeText(name);
    setCopiedName(name);
    toast.success("Name copied to clipboard!");
    setTimeout(() => setCopiedName(null), 2000);
  };

  const saveFavorites = async () => {
    const favorites = suggestions.filter((s) => s.favorite);
    if (favorites.length === 0) {
      toast.error("Please favorite at least one name");
      return;
    }

    try {
      const response = await fetch("/api/naming/save-favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId,
          favorites: favorites.map((f) => f.name),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save favorites");
      }

      toast.success(`Saved ${favorites.length} favorite name(s)!`);
    } catch (error) {
      console.error("Error saving favorites:", error);
      toast.error("Failed to save favorites");
    }
  };

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-600" />
            Generate Brand Names
          </CardTitle>
          <CardDescription>
            AI-powered name generation with domain and trademark availability checking
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="keywords">Keywords or Brand Description</Label>
            <Textarea
              id="keywords"
              placeholder="E.g., sustainable fashion, eco-friendly, modern lifestyle..."
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              rows={3}
            />
            <p className="text-xs text-muted-foreground">
              Describe your brand, values, or key characteristics
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="industry">Industry/Category (Optional)</Label>
              <Input
                id="industry"
                placeholder="E.g., fashion, tech, food..."
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="style">Naming Style</Label>
              <select
                id="style"
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <option value="modern">Modern & Sleek</option>
                <option value="playful">Playful & Creative</option>
                <option value="professional">Professional & Trustworthy</option>
                <option value="edgy">Edgy & Bold</option>
                <option value="minimal">Minimal & Simple</option>
                <option value="luxurious">Luxurious & Premium</option>
              </select>
            </div>
          </div>

          <Button
            onClick={handleGenerate}
            disabled={isGenerating || !keywords.trim()}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating Names...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Generate Name Suggestions
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Results Section */}
      {suggestions.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Name Suggestions ({suggestions.length})</CardTitle>
                <CardDescription>
                  Click the heart icon to favorite names you like
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleGenerate}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Regenerate
                </Button>
                {suggestions.some((s) => s.favorite) && (
                  <Button size="sm" onClick={saveFavorites}>
                    <Heart className="h-4 w-4 mr-2 fill-current" />
                    Save Favorites ({suggestions.filter((s) => s.favorite).length})
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className={cn(
                    "border rounded-lg p-4 transition-all hover:shadow-md",
                    suggestion.favorite && "border-purple-300 bg-purple-50 dark:bg-purple-950/20"
                  )}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h4 className="text-lg font-semibold">{suggestion.name}</h4>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(suggestion.name)}
                          className="h-7 w-7 p-0"
                        >
                          {copiedName === suggestion.name ? (
                            <Check className="h-4 w-4 text-green-600" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {suggestion.description}
                      </p>

                      {/* Availability Status */}
                      <div className="flex items-center gap-3 mt-3">
                        {/* Domain Status */}
                        <div className="flex items-center gap-1.5">
                          <Globe className="h-4 w-4 text-muted-foreground" />
                          {suggestion.domainAvailable ? (
                            <Badge variant="outline" className="text-green-600 border-green-600">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              .com Available
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-red-600 border-red-600">
                              <XCircle className="h-3 w-3 mr-1" />
                              .com Taken
                            </Badge>
                          )}
                        </div>

                        {/* Trademark Status */}
                        {suggestion.trademarkStatus === "checking" ? (
                          <Badge variant="outline" className="text-blue-600 border-blue-600">
                            <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                            Checking TM
                          </Badge>
                        ) : suggestion.trademarkStatus === "available" ? (
                          <Badge variant="outline" className="text-green-600 border-green-600">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            TM Available
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-amber-600 border-amber-600">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            TM Conflicts
                          </Badge>
                        )}

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => checkAvailability(suggestion.name, index)}
                          className="text-xs h-7"
                        >
                          <RefreshCw className="h-3 w-3 mr-1" />
                          Recheck
                        </Button>
                      </div>
                    </div>

                    {/* Favorite Button */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleFavorite(index)}
                      className={cn(
                        "h-9 w-9 p-0",
                        suggestion.favorite && "text-red-600"
                      )}
                    >
                      <Heart
                        className={cn(
                          "h-5 w-5",
                          suggestion.favorite && "fill-current"
                        )}
                      />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {suggestions.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Sparkles className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Names Generated Yet</h3>
            <p className="text-sm text-muted-foreground text-center max-w-md">
              Enter your brand keywords and click "Generate Name Suggestions" to get AI-powered name ideas with availability checking.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
