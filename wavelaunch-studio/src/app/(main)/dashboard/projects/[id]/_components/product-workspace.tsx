/**
 * Product Development Workspace Component
 *
 * M4-M5 Phase - SKU planning, prototypes, and product specifications
 */

"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Package,
  Layers,
  FileText,
  Sparkles,
} from "lucide-react";
import { SKUManagement } from "./sku-management";
import { PrototypeTracking } from "./prototype-tracking";

interface ProductWorkspaceProps {
  projectId: string;
  projectName: string;
  productSKUs?: any[];
}

export function ProductWorkspace({
  projectId,
  projectName,
  productSKUs = [],
}: ProductWorkspaceProps) {
  const [activeTab, setActiveTab] = React.useState("skus");

  // Calculate completion stats
  const hasSKUs = productSKUs.length > 0;
  const approvedSKUs = productSKUs.filter((s: any) => s.status === "APPROVED").length;
  const allPrototypes = productSKUs.flatMap((s: any) => s.prototypes || []);
  const approvedPrototypes = allPrototypes.filter((p: any) => p.status === "APPROVED").length;

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold">Product Development</h2>
          <p className="text-muted-foreground">
            M4-M5: SKU planning, prototypes, and specifications
          </p>
        </div>
        <Badge variant="secondary" className="text-sm">
          {productSKUs.length} SKUs
        </Badge>
      </div>

      {/* Progress Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                <Package className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{productSKUs.length}</p>
                <p className="text-xs text-muted-foreground">Total SKUs</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-green-100 dark:bg-green-900 flex items-center justify-center">
                <Layers className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{approvedSKUs}</p>
                <p className="text-xs text-muted-foreground">Approved SKUs</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{allPrototypes.length}</p>
                <p className="text-xs text-muted-foreground">Prototypes</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-amber-100 dark:bg-amber-900 flex items-center justify-center">
                <FileText className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{approvedPrototypes}</p>
                <p className="text-xs text-muted-foreground">Approved Samples</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabbed Interface */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full justify-start">
          <TabsTrigger value="skus">
            <Package className="h-4 w-4 mr-2" />
            SKU Management
          </TabsTrigger>
          <TabsTrigger value="prototypes">
            <Layers className="h-4 w-4 mr-2" />
            Prototypes
          </TabsTrigger>
          <TabsTrigger value="specs">
            <FileText className="h-4 w-4 mr-2" />
            Specifications
          </TabsTrigger>
        </TabsList>

        <TabsContent value="skus" className="space-y-4 mt-6">
          <SKUManagement projectId={projectId} skus={productSKUs} />
        </TabsContent>

        <TabsContent value="prototypes" className="space-y-4 mt-6">
          <PrototypeTracking projectId={projectId} skus={productSKUs} />
        </TabsContent>

        <TabsContent value="specs" className="space-y-4 mt-6">
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <FileText className="h-16 w-16 text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-medium mb-2">
                Tech Pack Generator
              </h3>
              <p className="text-muted-foreground text-center max-w-sm">
                Detailed product specifications and tech packs coming soon
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
