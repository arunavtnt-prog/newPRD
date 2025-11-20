/**
 * Brand Design Workspace Component
 *
 * M2-M3 Phase - Logo concepts, color palettes, typography, and brand book
 */

"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Palette,
  Type,
  Image as ImageIcon,
  FileText,
  Sparkles,
} from "lucide-react";
import { ColorPaletteGenerator } from "./color-palette-generator";

interface BrandingWorkspaceProps {
  projectId: string;
  colorPalettes?: any[];
  logos?: any[];
  typography?: any;
}

export function BrandingWorkspace({
  projectId,
  colorPalettes = [],
  logos = [],
  typography,
}: BrandingWorkspaceProps) {
  const [activeTab, setActiveTab] = React.useState("colors");

  // Calculate completion stats
  const hasColors = colorPalettes.length > 0;
  const hasLogos = logos.length > 0;
  const hasTypography = !!typography;
  const completionPercentage = Math.round(
    ((hasColors ? 1 : 0) + (hasLogos ? 1 : 0) + (hasTypography ? 1 : 0)) / 3 * 100
  );

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold">Brand Design</h2>
          <p className="text-muted-foreground">
            M2-M3: Visual identity, logos, colors, and typography
          </p>
        </div>
        <Badge variant="secondary" className="text-sm">
          {completionPercentage}% Complete
        </Badge>
      </div>

      {/* Progress Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-pink-100 dark:bg-pink-900 flex items-center justify-center">
                <ImageIcon className="h-5 w-5 text-pink-600 dark:text-pink-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{logos.length}</p>
                <p className="text-xs text-muted-foreground">Logo Concepts</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                <Palette className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{colorPalettes.length}</p>
                <p className="text-xs text-muted-foreground">Color Palettes</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                <Type className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{hasTypography ? "1" : "0"}</p>
                <p className="text-xs text-muted-foreground">Typography</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-green-100 dark:bg-green-900 flex items-center justify-center">
                <FileText className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{hasColors && hasLogos ? "1" : "0"}</p>
                <p className="text-xs text-muted-foreground">Brand Book</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabbed Interface */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full justify-start">
          <TabsTrigger value="colors">
            <Palette className="h-4 w-4 mr-2" />
            Color Palettes
          </TabsTrigger>
          <TabsTrigger value="logos">
            <ImageIcon className="h-4 w-4 mr-2" />
            Logo Concepts
          </TabsTrigger>
          <TabsTrigger value="typography">
            <Type className="h-4 w-4 mr-2" />
            Typography
          </TabsTrigger>
          <TabsTrigger value="brandbook">
            <FileText className="h-4 w-4 mr-2" />
            Brand Book
          </TabsTrigger>
        </TabsList>

        <TabsContent value="colors" className="space-y-4 mt-6">
          <ColorPaletteGenerator
            projectId={projectId}
            palettes={colorPalettes}
          />
        </TabsContent>

        <TabsContent value="logos" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Logo Concepts</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center py-8">
                Logo concepts display coming soon
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="typography" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Typography System</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center py-8">
                Typography selector coming soon
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="brandbook" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Brand Book</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center py-8">
                Brand book generator coming soon
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
