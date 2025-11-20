/**
 * Prototype Tracking Component
 *
 * Track product samples, iterations, and feedback
 */

"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Layers, Plus, CheckCircle, XCircle, Clock } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

interface Prototype {
  id: string;
  version: string;
  sampleType: string;
  description: string | null;
  feedback: string | null;
  status: string;
  orderedDate: Date | null;
  receivedDate: Date | null;
  approvedDate: Date | null;
  createdAt: Date;
}

interface SKU {
  id: string;
  skuCode: string;
  productName: string;
  prototypes?: Prototype[];
}

interface PrototypeTrackingProps {
  projectId: string;
  skus: SKU[];
}

const SAMPLE_TYPES = [
  { value: "FIRST_SAMPLE", label: "First Sample" },
  { value: "REVISED_SAMPLE", label: "Revised Sample" },
  { value: "PRE_PRODUCTION", label: "Pre-Production" },
  { value: "PRODUCTION_RUN", label: "Production Run" },
];

const STATUS_OPTIONS = [
  { value: "ORDERED", label: "Ordered", icon: Clock, color: "secondary" },
  { value: "IN_TRANSIT", label: "In Transit", icon: Clock, color: "secondary" },
  { value: "RECEIVED", label: "Received", icon: CheckCircle, color: "default" },
  { value: "UNDER_REVIEW", label: "Under Review", icon: Clock, color: "default" },
  { value: "APPROVED", label: "Approved", icon: CheckCircle, color: "default" },
  { value: "REJECTED", label: "Rejected", icon: XCircle, color: "destructive" },
];

export function PrototypeTracking({ projectId, skus }: PrototypeTrackingProps) {
  const [open, setOpen] = React.useState(false);
  const [selectedSKUId, setSelectedSKUId] = React.useState("");
  const [isSaving, setIsSaving] = React.useState(false);
  const router = useRouter();

  const [formData, setFormData] = React.useState({
    version: "",
    sampleType: "FIRST_SAMPLE",
    description: "",
    status: "ORDERED",
    orderedDate: "",
    receivedDate: "",
    feedback: "",
  });

  const handleOpenAdd = (skuId?: string) => {
    setSelectedSKUId(skuId || "");
    setFormData({
      version: "",
      sampleType: "FIRST_SAMPLE",
      description: "",
      status: "ORDERED",
      orderedDate: "",
      receivedDate: "",
      feedback: "",
    });
    setOpen(true);
  };

  const handleSave = async () => {
    if (!selectedSKUId) {
      toast.error("Please select a SKU");
      return;
    }

    if (!formData.version) {
      toast.error("Version is required");
      return;
    }

    setIsSaving(true);

    try {
      const response = await fetch(
        `/api/projects/${projectId}/skus/${selectedSKUId}/prototypes`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...formData,
            orderedDate: formData.orderedDate || null,
            receivedDate: formData.receivedDate || null,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to save prototype");
      }

      toast.success("Prototype created successfully");
      setOpen(false);
      router.refresh();
    } catch (error) {
      console.error("Error saving prototype:", error);
      toast.error("Failed to save prototype");
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateStatus = async (
    prototypeId: string,
    newStatus: string
  ) => {
    try {
      const response = await fetch(
        `/api/projects/${projectId}/prototypes/${prototypeId}/status`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update status");
      }

      toast.success("Status updated");
      router.refresh();
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    }
  };

  // Group all prototypes
  const allPrototypes = skus.flatMap((sku) =>
    (sku.prototypes || []).map((proto) => ({
      ...proto,
      sku,
    }))
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Prototype Tracking</h3>
          <p className="text-sm text-muted-foreground">
            Track samples, iterations, and feedback for each SKU
          </p>
        </div>
        <Button onClick={() => handleOpenAdd()}>
          <Plus className="h-4 w-4 mr-2" />
          Add Prototype
        </Button>
      </div>

      {/* Prototypes by SKU */}
      {skus.length > 0 ? (
        <div className="space-y-6">
          {skus.map((sku) => {
            const prototypes = sku.prototypes || [];

            return (
              <Card key={sku.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-base">{sku.productName}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        SKU: {sku.skuCode}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenAdd(sku.id)}
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Add Sample
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {prototypes.length > 0 ? (
                    <div className="space-y-4">
                      {prototypes.map((proto) => {
                        const statusOption = STATUS_OPTIONS.find(
                          (s) => s.value === proto.status
                        );
                        const StatusIcon = statusOption?.icon || Clock;

                        return (
                          <div
                            key={proto.id}
                            className="flex items-start gap-4 p-4 border rounded-lg"
                          >
                            <div className="flex-1 space-y-2">
                              <div className="flex items-center gap-2">
                                <Badge variant="secondary">{proto.version}</Badge>
                                <Badge variant="outline">
                                  {SAMPLE_TYPES.find(
                                    (t) => t.value === proto.sampleType
                                  )?.label}
                                </Badge>
                                <Badge
                                  variant={statusOption?.color as any || "secondary"}
                                  className="flex items-center gap-1"
                                >
                                  <StatusIcon className="h-3 w-3" />
                                  {statusOption?.label}
                                </Badge>
                              </div>

                              {proto.description && (
                                <p className="text-sm text-muted-foreground">
                                  {proto.description}
                                </p>
                              )}

                              {/* Dates */}
                              <div className="flex gap-4 text-xs text-muted-foreground">
                                {proto.orderedDate && (
                                  <div>
                                    Ordered:{" "}
                                    {format(new Date(proto.orderedDate), "MMM d, yyyy")}
                                  </div>
                                )}
                                {proto.receivedDate && (
                                  <div>
                                    Received:{" "}
                                    {format(new Date(proto.receivedDate), "MMM d, yyyy")}
                                  </div>
                                )}
                                {proto.approvedDate && (
                                  <div>
                                    Approved:{" "}
                                    {format(new Date(proto.approvedDate), "MMM d, yyyy")}
                                  </div>
                                )}
                              </div>

                              {/* Feedback */}
                              {proto.feedback && (
                                <div className="p-3 bg-muted/50 rounded-lg">
                                  <p className="text-xs font-medium mb-1">Feedback:</p>
                                  <p className="text-sm">{proto.feedback}</p>
                                </div>
                              )}
                            </div>

                            {/* Status Actions */}
                            <div className="flex flex-col gap-1">
                              {proto.status === "ORDERED" && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() =>
                                    handleUpdateStatus(proto.id, "RECEIVED")
                                  }
                                >
                                  Mark Received
                                </Button>
                              )}
                              {proto.status === "RECEIVED" && (
                                <>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                      handleUpdateStatus(proto.id, "UNDER_REVIEW")
                                    }
                                  >
                                    Review
                                  </Button>
                                </>
                              )}
                              {proto.status === "UNDER_REVIEW" && (
                                <>
                                  <Button
                                    variant="default"
                                    size="sm"
                                    onClick={() =>
                                      handleUpdateStatus(proto.id, "APPROVED")
                                    }
                                  >
                                    Approve
                                  </Button>
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() =>
                                      handleUpdateStatus(proto.id, "REJECTED")
                                    }
                                  >
                                    Reject
                                  </Button>
                                </>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground text-sm">
                      No prototypes yet for this SKU
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Layers className="h-16 w-16 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium mb-2">No SKUs available</h3>
            <p className="text-muted-foreground text-center max-w-sm">
              Create SKUs first before tracking prototypes
            </p>
          </CardContent>
        </Card>
      )}

      {/* Add Prototype Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add Prototype</DialogTitle>
            <DialogDescription>
              Track a new sample or prototype iteration
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* SKU Selection */}
            <div className="space-y-2">
              <Label htmlFor="sku">SKU *</Label>
              <Select value={selectedSKUId} onValueChange={setSelectedSKUId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a SKU" />
                </SelectTrigger>
                <SelectContent>
                  {skus.map((sku) => (
                    <SelectItem key={sku.id} value={sku.id}>
                      {sku.productName} ({sku.skuCode})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Version & Type */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="version">Version *</Label>
                <Input
                  id="version"
                  placeholder="e.g., V1, V2, Rev A"
                  value={formData.version}
                  onChange={(e) =>
                    setFormData({ ...formData, version: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sampleType">Sample Type *</Label>
                <Select
                  value={formData.sampleType}
                  onValueChange={(value) =>
                    setFormData({ ...formData, sampleType: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SAMPLE_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="What's being tested in this sample..."
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={3}
              />
            </div>

            {/* Status & Dates */}
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) =>
                    setFormData({ ...formData, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="orderedDate">Ordered Date</Label>
                <Input
                  id="orderedDate"
                  type="date"
                  value={formData.orderedDate}
                  onChange={(e) =>
                    setFormData({ ...formData, orderedDate: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="receivedDate">Received Date</Label>
                <Input
                  id="receivedDate"
                  type="date"
                  value={formData.receivedDate}
                  onChange={(e) =>
                    setFormData({ ...formData, receivedDate: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Feedback */}
            <div className="space-y-2">
              <Label htmlFor="feedback">Feedback / Notes</Label>
              <Textarea
                id="feedback"
                placeholder="Initial observations, issues, improvements needed..."
                value={formData.feedback}
                onChange={(e) =>
                  setFormData({ ...formData, feedback: e.target.value })
                }
                rows={4}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? "Saving..." : "Create Prototype"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
