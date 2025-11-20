/**
 * Brand Book Component
 *
 * Comprehensive brand guidelines compiled from all approved assets
 */

"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  FileText,
  Download,
  Eye,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

interface BrandBookProps {
  projectId: string;
  projectName: string;
  discovery?: any;
  colorPalettes?: any[];
  logos?: any[];
  typography?: any;
}

export function BrandBook({
  projectId,
  projectName,
  discovery,
  colorPalettes = [],
  logos = [],
  typography,
}: BrandBookProps) {
  const [isGenerating, setIsGenerating] = React.useState(false);
  const printRef = React.useRef<HTMLDivElement>(null);

  // Check what assets are ready
  const hasApprovedColors = colorPalettes.some((p) => p.isApproved);
  const hasLogos = logos.length > 0;
  const hasApprovedTypography = typography?.isApproved;
  const hasDiscovery = !!discovery;

  const completionItems = [
    { label: "Brand Discovery", complete: hasDiscovery },
    { label: "Color Palette", complete: hasApprovedColors },
    { label: "Logo Designs", complete: hasLogos },
    { label: "Typography", complete: hasApprovedTypography },
  ];

  const completionPercentage = Math.round(
    (completionItems.filter((i) => i.complete).length /
      completionItems.length) *
      100
  );

  const isComplete = completionPercentage === 100;

  const handleGeneratePDF = async () => {
    setIsGenerating(true);

    try {
      // In production, this would call a PDF generation service
      // For now, we'll use browser print
      if (printRef.current) {
        const printWindow = window.open("", "_blank");
        if (printWindow) {
          printWindow.document.write(`
            <!DOCTYPE html>
            <html>
              <head>
                <title>${projectName} Brand Book</title>
                <style>
                  body {
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                    padding: 40px;
                    max-width: 1200px;
                    margin: 0 auto;
                  }
                  h1, h2, h3 { color: #1a1a1a; }
                  .section { page-break-inside: avoid; margin-bottom: 40px; }
                  .color-swatch {
                    width: 100px;
                    height: 100px;
                    border-radius: 8px;
                    display: inline-block;
                    margin: 10px;
                  }
                  .logo-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
                  .logo-item { border: 1px solid #e5e5e5; padding: 20px; text-align: center; }
                  img { max-width: 100%; height: auto; }
                  @media print {
                    .no-print { display: none; }
                  }
                </style>
              </head>
              <body>
                ${printRef.current.innerHTML}
              </body>
            </html>
          `);
          printWindow.document.close();
          printWindow.print();
        }
      }

      toast.success("Brand book opened in new window");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate brand book");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadAssets = async () => {
    toast.info("Asset package download coming soon");
  };

  const approvedPalette = colorPalettes.find((p) => p.isApproved);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold">Brand Book</h3>
          <p className="text-sm text-muted-foreground">
            Comprehensive brand guidelines compiled from all approved assets
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownloadAssets}
            disabled={!isComplete}
          >
            <Download className="h-4 w-4 mr-2" />
            Download Assets
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={handleGeneratePDF}
            disabled={!isComplete || isGenerating}
          >
            <FileText className="h-4 w-4 mr-2" />
            {isGenerating ? "Generating..." : "Generate PDF"}
          </Button>
        </div>
      </div>

      {/* Completion Status */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">
              Brand Book Readiness - {completionPercentage}%
            </CardTitle>
            {isComplete ? (
              <Badge variant="default">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                Complete
              </Badge>
            ) : (
              <Badge variant="secondary">In Progress</Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {completionItems.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                {item.complete ? (
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-muted-foreground" />
                )}
                <span
                  className={
                    item.complete
                      ? "text-foreground"
                      : "text-muted-foreground"
                  }
                >
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Preview */}
      {isComplete ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Brand Book Preview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div ref={printRef} className="space-y-8 p-6 bg-muted/30 rounded-lg">
              {/* Cover Page */}
              <div className="section text-center space-y-4">
                <h1 className="text-4xl font-bold">{projectName}</h1>
                <p className="text-xl text-muted-foreground">Brand Guidelines</p>
                <Separator className="my-6" />
              </div>

              {/* Brand Overview */}
              {discovery && (
                <div className="section space-y-4">
                  <h2 className="text-2xl font-bold">Brand Overview</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-semibold mb-2">Vision</h3>
                      <p className="text-sm text-muted-foreground">
                        {discovery.brandVision}
                      </p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Mission</h3>
                      <p className="text-sm text-muted-foreground">
                        {discovery.brandMission}
                      </p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Values</h3>
                      <p className="text-sm text-muted-foreground">
                        {discovery.brandValues}
                      </p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Personality</h3>
                      <p className="text-sm text-muted-foreground">
                        {discovery.brandPersonality}
                      </p>
                    </div>
                  </div>
                  <Separator className="my-6" />
                </div>
              )}

              {/* Color Palette */}
              {approvedPalette && (
                <div className="section space-y-4">
                  <h2 className="text-2xl font-bold">Color Palette</h2>
                  <p className="text-sm text-muted-foreground mb-4">
                    {approvedPalette.name}
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {approvedPalette.primaryColor && (
                      <div>
                        <div
                          className="w-full h-24 rounded-lg mb-2"
                          style={{
                            backgroundColor: approvedPalette.primaryColor,
                          }}
                        />
                        <p className="font-medium text-sm">Primary</p>
                        <p className="text-xs text-muted-foreground">
                          {approvedPalette.primaryColor}
                        </p>
                      </div>
                    )}
                    {approvedPalette.secondaryColor && (
                      <div>
                        <div
                          className="w-full h-24 rounded-lg mb-2"
                          style={{
                            backgroundColor: approvedPalette.secondaryColor,
                          }}
                        />
                        <p className="font-medium text-sm">Secondary</p>
                        <p className="text-xs text-muted-foreground">
                          {approvedPalette.secondaryColor}
                        </p>
                      </div>
                    )}
                    {approvedPalette.accentColor && (
                      <div>
                        <div
                          className="w-full h-24 rounded-lg mb-2"
                          style={{
                            backgroundColor: approvedPalette.accentColor,
                          }}
                        />
                        <p className="font-medium text-sm">Accent</p>
                        <p className="text-xs text-muted-foreground">
                          {approvedPalette.accentColor}
                        </p>
                      </div>
                    )}
                    {approvedPalette.neutralDark && (
                      <div>
                        <div
                          className="w-full h-24 rounded-lg mb-2 border"
                          style={{
                            backgroundColor: approvedPalette.neutralDark,
                          }}
                        />
                        <p className="font-medium text-sm">Neutral Dark</p>
                        <p className="text-xs text-muted-foreground">
                          {approvedPalette.neutralDark}
                        </p>
                      </div>
                    )}
                  </div>
                  <Separator className="my-6" />
                </div>
              )}

              {/* Typography */}
              {typography && (
                <div className="section space-y-4">
                  <h2 className="text-2xl font-bold">Typography</h2>
                  <p className="text-sm text-muted-foreground mb-4">
                    {typography.name}
                  </p>
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold mb-2">Primary Font (Headings)</h3>
                      <p
                        className="text-3xl font-bold mb-1"
                        style={{ fontFamily: typography.primaryFontFamily }}
                      >
                        {typography.primaryFontFamily}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Weights: {JSON.parse(typography.primaryFontWeights).join(", ")}
                      </p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Secondary Font (Body)</h3>
                      <p
                        className="text-xl mb-1"
                        style={{ fontFamily: typography.secondaryFontFamily }}
                      >
                        {typography.secondaryFontFamily}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Weights: {JSON.parse(typography.secondaryFontWeights).join(", ")}
                      </p>
                    </div>
                    <div className="p-4 bg-background rounded-lg">
                      <h4
                        className="text-2xl font-bold mb-2"
                        style={{ fontFamily: typography.primaryFontFamily }}
                      >
                        Heading Example
                      </h4>
                      <p
                        className="text-base"
                        style={{ fontFamily: typography.secondaryFontFamily }}
                      >
                        The quick brown fox jumps over the lazy dog. This is an example of how body text will appear using the secondary font family.
                      </p>
                    </div>
                  </div>
                  <Separator className="my-6" />
                </div>
              )}

              {/* Logo Variations */}
              {logos.length > 0 && (
                <div className="section space-y-4">
                  <h2 className="text-2xl font-bold">Logo Variations</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {logos.slice(0, 6).map((logo) => (
                      <div
                        key={logo.id}
                        className="border rounded-lg p-4 bg-background"
                      >
                        <div className="aspect-square flex items-center justify-center mb-2">
                          <img
                            src={logo.s3Url}
                            alt={logo.originalFilename}
                            className="max-w-full max-h-full object-contain"
                          />
                        </div>
                        <p className="text-xs text-center text-muted-foreground">
                          {logo.category || "Concept"}
                        </p>
                      </div>
                    ))}
                  </div>
                  <Separator className="my-6" />
                </div>
              )}

              {/* Usage Guidelines */}
              <div className="section space-y-4">
                <h2 className="text-2xl font-bold">Usage Guidelines</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2">Logo Usage</h3>
                    <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                      <li>Maintain minimum clear space around logo</li>
                      <li>Never distort or rotate the logo</li>
                      <li>Use approved color variations only</li>
                      <li>Ensure adequate contrast on backgrounds</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Color Usage</h3>
                    <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                      <li>Primary color for main brand elements</li>
                      <li>Secondary color for supporting elements</li>
                      <li>Accent color for calls-to-action</li>
                      <li>Maintain WCAG AA accessibility standards</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Typography Usage</h3>
                    <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                      <li>Use primary font for all headings</li>
                      <li>Use secondary font for body text</li>
                      <li>Maintain consistent hierarchy across materials</li>
                      <li>Ensure adequate line spacing for readability</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="text-center text-sm text-muted-foreground pt-8">
                <p>{projectName} Brand Guidelines</p>
                <p>Generated on {new Date().toLocaleDateString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Sparkles className="h-16 w-16 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium mb-2">
              Brand book not ready yet
            </h3>
            <p className="text-muted-foreground text-center max-w-sm mb-6">
              Complete all brand elements (discovery, colors, logos, typography)
              to generate your comprehensive brand book
            </p>
            <div className="text-sm text-muted-foreground">
              {completionPercentage}% complete
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
