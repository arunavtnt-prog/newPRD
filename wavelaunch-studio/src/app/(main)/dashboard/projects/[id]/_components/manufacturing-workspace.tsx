/**
 * Manufacturing Workspace Component
 *
 * M6 Phase - Vendor management, purchase orders, and quality control
 */

"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Factory,
  FileText,
  ClipboardCheck,
  TrendingUp,
} from "lucide-react";
import { VendorManagement } from "./vendor-management";
import { PurchaseOrders } from "./purchase-orders";
import { QualityControl } from "./quality-control";

interface ManufacturingWorkspaceProps {
  projectId: string;
  projectName: string;
  vendors?: any[];
  purchaseOrders?: any[];
}

export function ManufacturingWorkspace({
  projectId,
  projectName,
  vendors = [],
  purchaseOrders = [],
}: ManufacturingWorkspaceProps) {
  const [activeTab, setActiveTab] = React.useState("vendors");

  // Calculate stats
  const activePOs = purchaseOrders.filter(
    (po: any) => !["DELIVERED", "CANCELLED"].includes(po.status)
  ).length;
  const inProductionPOs = purchaseOrders.filter(
    (po: any) => po.status === "IN_PRODUCTION"
  ).length;
  const allQCCheckpoints = purchaseOrders.flatMap((po: any) => po.qcCheckpoints || []);
  const passedQC = allQCCheckpoints.filter((qc: any) => qc.status === "PASSED").length;

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold">Manufacturing</h2>
          <p className="text-muted-foreground">
            M6: Vendor management, purchase orders, and quality control
          </p>
        </div>
        <Badge variant="secondary" className="text-sm">
          {activePOs} Active POs
        </Badge>
      </div>

      {/* Progress Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                <Factory className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{vendors.length}</p>
                <p className="text-xs text-muted-foreground">Vendors</p>
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
                <p className="text-2xl font-bold">{purchaseOrders.length}</p>
                <p className="text-xs text-muted-foreground">Purchase Orders</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-amber-100 dark:bg-amber-900 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{inProductionPOs}</p>
                <p className="text-xs text-muted-foreground">In Production</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                <ClipboardCheck className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{passedQC}</p>
                <p className="text-xs text-muted-foreground">QC Passed</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabbed Interface */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full justify-start">
          <TabsTrigger value="vendors">
            <Factory className="h-4 w-4 mr-2" />
            Vendors
          </TabsTrigger>
          <TabsTrigger value="purchase-orders">
            <FileText className="h-4 w-4 mr-2" />
            Purchase Orders
          </TabsTrigger>
          <TabsTrigger value="quality-control">
            <ClipboardCheck className="h-4 w-4 mr-2" />
            Quality Control
          </TabsTrigger>
        </TabsList>

        <TabsContent value="vendors" className="space-y-4 mt-6">
          <VendorManagement projectId={projectId} vendors={vendors} />
        </TabsContent>

        <TabsContent value="purchase-orders" className="space-y-4 mt-6">
          <PurchaseOrders
            projectId={projectId}
            purchaseOrders={purchaseOrders}
            vendors={vendors}
          />
        </TabsContent>

        <TabsContent value="quality-control" className="space-y-4 mt-6">
          <QualityControl
            projectId={projectId}
            purchaseOrders={purchaseOrders}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
