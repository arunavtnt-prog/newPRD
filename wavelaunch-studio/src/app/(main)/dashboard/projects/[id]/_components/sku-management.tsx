/**
 * SKU Management Component
 *
 * Create and manage product SKUs with variants and pricing
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
import { Package, Plus, Edit, Trash2, DollarSign } from "lucide-react";
import { toast } from "sonner";

interface SKU {
  id: string;
  skuCode: string;
  productName: string;
  description: string | null;
  size: string | null;
  color: string | null;
  material: string | null;
  style: string | null;
  wholesaleCost: any;
  retailPrice: any;
  targetMargin: any;
  dimensions: string | null;
  weight: string | null;
  moq: number | null;
  leadTimeDays: number | null;
  supplierName: string | null;
  status: string;
  prototypes?: any[];
  createdAt: Date;
}

interface SKUManagementProps {
  projectId: string;
  skus: SKU[];
}

const STATUS_OPTIONS = [
  { value: "PLANNING", label: "Planning", color: "secondary" },
  { value: "SAMPLING", label: "Sampling", color: "default" },
  { value: "APPROVED", label: "Approved", color: "default" },
  { value: "IN_PRODUCTION", label: "In Production", color: "default" },
  { value: "READY_TO_SHIP", label: "Ready to Ship", color: "default" },
  { value: "DISCONTINUED", label: "Discontinued", color: "destructive" },
];

export function SKUManagement({ projectId, skus }: SKUManagementProps) {
  const [open, setOpen] = React.useState(false);
  const [editingSKU, setEditingSKU] = React.useState<SKU | null>(null);
  const [isSaving, setIsSaving] = React.useState(false);
  const router = useRouter();

  // Form state
  const [formData, setFormData] = React.useState({
    skuCode: "",
    productName: "",
    description: "",
    size: "",
    color: "",
    material: "",
    style: "",
    wholesaleCost: "",
    retailPrice: "",
    targetMargin: "",
    dimensions: "",
    weight: "",
    moq: "",
    leadTimeDays: "",
    supplierName: "",
    supplierContact: "",
    status: "PLANNING",
  });

  const handleOpenAdd = () => {
    setEditingSKU(null);
    setFormData({
      skuCode: "",
      productName: "",
      description: "",
      size: "",
      color: "",
      material: "",
      style: "",
      wholesaleCost: "",
      retailPrice: "",
      targetMargin: "",
      dimensions: "",
      weight: "",
      moq: "",
      leadTimeDays: "",
      supplierName: "",
      supplierContact: "",
      status: "PLANNING",
    });
    setOpen(true);
  };

  const handleOpenEdit = (sku: SKU) => {
    setEditingSKU(sku);
    setFormData({
      skuCode: sku.skuCode,
      productName: sku.productName,
      description: sku.description || "",
      size: sku.size || "",
      color: sku.color || "",
      material: sku.material || "",
      style: sku.style || "",
      wholesaleCost: sku.wholesaleCost?.toString() || "",
      retailPrice: sku.retailPrice?.toString() || "",
      targetMargin: sku.targetMargin?.toString() || "",
      dimensions: sku.dimensions || "",
      weight: sku.weight || "",
      moq: sku.moq?.toString() || "",
      leadTimeDays: sku.leadTimeDays?.toString() || "",
      supplierName: sku.supplierName || "",
      supplierContact: "",
      status: sku.status,
    });
    setOpen(true);
  };

  const handleSave = async () => {
    if (!formData.skuCode || !formData.productName) {
      toast.error("SKU Code and Product Name are required");
      return;
    }

    setIsSaving(true);

    try {
      const url = editingSKU
        ? `/api/projects/${projectId}/skus/${editingSKU.id}`
        : `/api/projects/${projectId}/skus`;

      const method = editingSKU ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          wholesaleCost: formData.wholesaleCost ? parseFloat(formData.wholesaleCost) : null,
          retailPrice: formData.retailPrice ? parseFloat(formData.retailPrice) : null,
          targetMargin: formData.targetMargin ? parseFloat(formData.targetMargin) : null,
          moq: formData.moq ? parseInt(formData.moq) : null,
          leadTimeDays: formData.leadTimeDays ? parseInt(formData.leadTimeDays) : null,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save SKU");
      }

      toast.success(editingSKU ? "SKU updated successfully" : "SKU created successfully");
      setOpen(false);
      router.refresh();
    } catch (error) {
      console.error("Error saving SKU:", error);
      toast.error("Failed to save SKU");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (skuId: string) => {
    try {
      const response = await fetch(`/api/projects/${projectId}/skus/${skuId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete SKU");
      }

      toast.success("SKU deleted");
      router.refresh();
    } catch (error) {
      console.error("Error deleting SKU:", error);
      toast.error("Failed to delete SKU");
    }
  };

  const calculateMargin = () => {
    const cost = parseFloat(formData.wholesaleCost);
    const price = parseFloat(formData.retailPrice);
    if (cost && price && price > cost) {
      const margin = ((price - cost) / price) * 100;
      return margin.toFixed(1) + "%";
    }
    return "-";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">SKU Management</h3>
          <p className="text-sm text-muted-foreground">
            Manage product variants, pricing, and specifications
          </p>
        </div>
        <Button onClick={handleOpenAdd}>
          <Plus className="h-4 w-4 mr-2" />
          Add SKU
        </Button>
      </div>

      {/* SKU List */}
      {skus.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {skus.map((sku) => {
            const statusOption = STATUS_OPTIONS.find((s) => s.value === sku.status);
            const margin = sku.wholesaleCost && sku.retailPrice
              ? (((parseFloat(sku.retailPrice) - parseFloat(sku.wholesaleCost)) / parseFloat(sku.retailPrice)) * 100).toFixed(1) + "%"
              : "-";

            return (
              <Card key={sku.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-base">{sku.productName}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        SKU: {sku.skuCode}
                      </p>
                    </div>
                    <Badge variant={statusOption?.color as any || "secondary"}>
                      {statusOption?.label}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Variants */}
                  {(sku.size || sku.color || sku.material || sku.style) && (
                    <div className="flex flex-wrap gap-1">
                      {sku.size && (
                        <Badge variant="outline" className="text-xs">
                          {sku.size}
                        </Badge>
                      )}
                      {sku.color && (
                        <Badge variant="outline" className="text-xs">
                          {sku.color}
                        </Badge>
                      )}
                      {sku.material && (
                        <Badge variant="outline" className="text-xs">
                          {sku.material}
                        </Badge>
                      )}
                      {sku.style && (
                        <Badge variant="outline" className="text-xs">
                          {sku.style}
                        </Badge>
                      )}
                    </div>
                  )}

                  {/* Description */}
                  {sku.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {sku.description}
                    </p>
                  )}

                  {/* Pricing */}
                  {(sku.wholesaleCost || sku.retailPrice) && (
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {sku.wholesaleCost && (
                        <div>
                          <p className="text-muted-foreground text-xs">Wholesale</p>
                          <p className="font-medium">${parseFloat(sku.wholesaleCost).toFixed(2)}</p>
                        </div>
                      )}
                      {sku.retailPrice && (
                        <div>
                          <p className="text-muted-foreground text-xs">Retail</p>
                          <p className="font-medium">${parseFloat(sku.retailPrice).toFixed(2)}</p>
                        </div>
                      )}
                      {margin !== "-" && (
                        <div className="col-span-2">
                          <p className="text-muted-foreground text-xs">Margin</p>
                          <p className="font-medium text-green-600">{margin}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Production */}
                  {(sku.moq || sku.leadTimeDays || sku.supplierName) && (
                    <div className="space-y-1 text-xs">
                      {sku.moq && (
                        <p className="text-muted-foreground">MOQ: {sku.moq} units</p>
                      )}
                      {sku.leadTimeDays && (
                        <p className="text-muted-foreground">Lead Time: {sku.leadTimeDays} days</p>
                      )}
                      {sku.supplierName && (
                        <p className="text-muted-foreground">Supplier: {sku.supplierName}</p>
                      )}
                    </div>
                  )}

                  {/* Prototypes */}
                  {sku.prototypes && sku.prototypes.length > 0 && (
                    <div>
                      <p className="text-xs text-muted-foreground">
                        {sku.prototypes.length} prototype{sku.prototypes.length !== 1 ? "s" : ""}
                      </p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleOpenEdit(sku)}
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(sku.id)}
                    >
                      <Trash2 className="h-3 w-3" />
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
            <Package className="h-16 w-16 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium mb-2">No SKUs yet</h3>
            <p className="text-muted-foreground text-center max-w-sm mb-6">
              Start by creating your first product SKU with variants and pricing
            </p>
            <Button onClick={handleOpenAdd}>
              <Plus className="h-4 w-4 mr-2" />
              Add First SKU
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingSKU ? "Edit SKU" : "Add New SKU"}</DialogTitle>
            <DialogDescription>
              Enter product details, variants, and pricing information
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Basic Info */}
            <div className="space-y-4">
              <h4 className="font-medium">Basic Information</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="skuCode">SKU Code *</Label>
                  <Input
                    id="skuCode"
                    placeholder="e.g., TSH-BLK-M"
                    value={formData.skuCode}
                    onChange={(e) =>
                      setFormData({ ...formData, skuCode: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="productName">Product Name *</Label>
                  <Input
                    id="productName"
                    placeholder="e.g., Classic T-Shirt"
                    value={formData.productName}
                    onChange={(e) =>
                      setFormData({ ...formData, productName: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Brief product description..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={3}
                />
              </div>
            </div>

            {/* Variants */}
            <div className="space-y-4">
              <h4 className="font-medium">Variants</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="size">Size</Label>
                  <Input
                    id="size"
                    placeholder="e.g., Medium, XL"
                    value={formData.size}
                    onChange={(e) =>
                      setFormData({ ...formData, size: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="color">Color</Label>
                  <Input
                    id="color"
                    placeholder="e.g., Black, Navy"
                    value={formData.color}
                    onChange={(e) =>
                      setFormData({ ...formData, color: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="material">Material</Label>
                  <Input
                    id="material"
                    placeholder="e.g., Cotton, Polyester"
                    value={formData.material}
                    onChange={(e) =>
                      setFormData({ ...formData, material: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="style">Style</Label>
                  <Input
                    id="style"
                    placeholder="e.g., Crew Neck, V-Neck"
                    value={formData.style}
                    onChange={(e) =>
                      setFormData({ ...formData, style: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="space-y-4">
              <h4 className="font-medium">Pricing</h4>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="wholesaleCost">Wholesale Cost</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="wholesaleCost"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      className="pl-9"
                      value={formData.wholesaleCost}
                      onChange={(e) =>
                        setFormData({ ...formData, wholesaleCost: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="retailPrice">Retail Price</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="retailPrice"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      className="pl-9"
                      value={formData.retailPrice}
                      onChange={(e) =>
                        setFormData({ ...formData, retailPrice: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Margin</Label>
                  <div className="h-10 px-3 rounded-md border bg-muted flex items-center">
                    <span className="font-medium text-green-600">{calculateMargin()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Production */}
            <div className="space-y-4">
              <h4 className="font-medium">Production Details</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="moq">MOQ (Minimum Order Quantity)</Label>
                  <Input
                    id="moq"
                    type="number"
                    placeholder="e.g., 500"
                    value={formData.moq}
                    onChange={(e) =>
                      setFormData({ ...formData, moq: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="leadTimeDays">Lead Time (days)</Label>
                  <Input
                    id="leadTimeDays"
                    type="number"
                    placeholder="e.g., 30"
                    value={formData.leadTimeDays}
                    onChange={(e) =>
                      setFormData({ ...formData, leadTimeDays: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="supplierName">Supplier Name</Label>
                  <Input
                    id="supplierName"
                    placeholder="e.g., ABC Manufacturing"
                    value={formData.supplierName}
                    onChange={(e) =>
                      setFormData({ ...formData, supplierName: e.target.value })
                    }
                  />
                </div>
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
              </div>
            </div>

            {/* Specifications */}
            <div className="space-y-4">
              <h4 className="font-medium">Specifications</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dimensions">Dimensions (L x W x H)</Label>
                  <Input
                    id="dimensions"
                    placeholder="e.g., 12 x 8 x 2 inches"
                    value={formData.dimensions}
                    onChange={(e) =>
                      setFormData({ ...formData, dimensions: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weight">Weight</Label>
                  <Input
                    id="weight"
                    placeholder="e.g., 200g"
                    value={formData.weight}
                    onChange={(e) =>
                      setFormData({ ...formData, weight: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? "Saving..." : editingSKU ? "Update SKU" : "Create SKU"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
