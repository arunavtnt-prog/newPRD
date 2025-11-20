/**
 * Quality Control Component
 *
 * Track QC checkpoints and inspections
 */

"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ClipboardCheck, Plus, CheckCircle, XCircle, Clock } from "lucide-react";
import { format } from "date-fns";

interface QualityControlProps {
  projectId: string;
  purchaseOrders: any[];
}

const QC_STATUS_CONFIG: Record<
  string,
  { icon: any; color: string; label: string }
> = {
  PENDING: { icon: Clock, color: "secondary", label: "Pending" },
  IN_PROGRESS: { icon: Clock, color: "default", label: "In Progress" },
  PASSED: { icon: CheckCircle, color: "default", label: "Passed" },
  FAILED: { icon: XCircle, color: "destructive", label: "Failed" },
  CONDITIONAL_PASS: {
    icon: CheckCircle,
    color: "default",
    label: "Conditional Pass",
  },
};

export function QualityControl({
  projectId,
  purchaseOrders,
}: QualityControlProps) {
  // Collect all QC checkpoints
  const allCheckpoints = purchaseOrders.flatMap(
    (po) =>
      (po.qcCheckpoints || []).map((qc: any) => ({
        ...qc,
        poNumber: po.poNumber,
        vendor: po.vendor.name,
      }))
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Quality Control</h3>
          <p className="text-sm text-muted-foreground">
            Track QC inspections and results
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Checkpoint
        </Button>
      </div>

      {/* QC List */}
      {allCheckpoints.length > 0 ? (
        <div className="space-y-4">
          {allCheckpoints.map((qc: any) => {
            const config = QC_STATUS_CONFIG[qc.status] || QC_STATUS_CONFIG.PENDING;
            const StatusIcon = config.icon;

            return (
              <Card key={qc.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold">{qc.checkpointName}</h4>
                        <Badge variant={config.color as any}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {config.label}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        PO #{qc.poNumber} • {qc.vendor}
                      </p>
                      {qc.inspectionDate && (
                        <p className="text-sm text-muted-foreground">
                          Inspected: {format(new Date(qc.inspectionDate), "MMM d, yyyy")}
                        </p>
                      )}
                      {qc.defectRate && (
                        <p className="text-sm text-muted-foreground">
                          Defect Rate: {parseFloat(qc.defectRate).toFixed(2)}%
                        </p>
                      )}
                      {qc.notes && (
                        <p className="text-sm text-muted-foreground mt-2">
                          {qc.notes}
                        </p>
                      )}
                    </div>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <ClipboardCheck className="h-16 w-16 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium mb-2">
              No QC checkpoints yet
            </h3>
            <p className="text-muted-foreground text-center max-w-sm mb-6">
              Add quality control checkpoints to track production quality
            </p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add First Checkpoint
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
