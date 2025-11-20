/**
 * Purchase Orders Component
 *
 * Manage production purchase orders
 */

"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Plus } from "lucide-react";

interface PurchaseOrdersProps {
  projectId: string;
  purchaseOrders: any[];
  vendors: any[];
}

const STATUS_COLORS: Record<string, string> = {
  DRAFT: "secondary",
  SENT: "default",
  CONFIRMED: "default",
  IN_PRODUCTION: "default",
  READY_TO_SHIP: "default",
  SHIPPED: "default",
  DELIVERED: "default",
  CANCELLED: "destructive",
};

export function PurchaseOrders({
  projectId,
  purchaseOrders,
  vendors,
}: PurchaseOrdersProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Purchase Orders</h3>
          <p className="text-sm text-muted-foreground">
            Track production orders and shipments
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create PO
        </Button>
      </div>

      {/* PO List */}
      {purchaseOrders.length > 0 ? (
        <div className="space-y-4">
          {purchaseOrders.map((po) => (
            <Card key={po.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold">PO #{po.poNumber}</h4>
                      <Badge
                        variant={
                          (STATUS_COLORS[po.status] as any) || "secondary"
                        }
                      >
                        {po.status.replace("_", " ")}
                      </Badge>
                      <Badge variant="outline">{po.paymentStatus}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Vendor: {po.vendor.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {po.lineItems?.length || 0} items • $
                      {parseFloat(po.totalAmount).toFixed(2)}
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <FileText className="h-16 w-16 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium mb-2">No purchase orders yet</h3>
            <p className="text-muted-foreground text-center max-w-sm mb-6">
              Create purchase orders to track production runs
            </p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create First PO
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
