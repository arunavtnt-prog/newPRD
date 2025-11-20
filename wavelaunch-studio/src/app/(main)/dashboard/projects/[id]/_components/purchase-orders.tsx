/**
 * Purchase Orders Component
 *
 * Manage production purchase orders with line items
 */

"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { FileText, Plus, Trash2, X } from "lucide-react";
import { toast } from "sonner";

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

interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  productSKUId: string;
}

export function PurchaseOrders({
  projectId,
  purchaseOrders,
  vendors,
}: PurchaseOrdersProps) {
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);

  const [formData, setFormData] = React.useState({
    vendorId: "",
    poNumber: "",
    orderDate: new Date().toISOString().split("T")[0],
    expectedShipDate: "",
    expectedDelivery: "",
    paymentTerms: "",
    notes: "",
  });

  const [lineItems, setLineItems] = React.useState<LineItem[]>([
    {
      id: crypto.randomUUID(),
      description: "",
      quantity: 1,
      unitPrice: 0,
      productSKUId: "",
    },
  ]);

  const handleUpdateStatus = async (poId: string, newStatus: string) => {
    try {
      const response = await fetch(
        `/api/projects/${projectId}/purchase-orders/${poId}/status`,
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

  const handleOpenDialog = () => {
    setFormData({
      vendorId: "",
      poNumber: `PO-${Date.now()}`,
      orderDate: new Date().toISOString().split("T")[0],
      expectedShipDate: "",
      expectedDelivery: "",
      paymentTerms: "",
      notes: "",
    });
    setLineItems([
      {
        id: crypto.randomUUID(),
        description: "",
        quantity: 1,
        unitPrice: 0,
        productSKUId: "",
      },
    ]);
    setIsDialogOpen(true);
  };

  const addLineItem = () => {
    setLineItems([
      ...lineItems,
      {
        id: crypto.randomUUID(),
        description: "",
        quantity: 1,
        unitPrice: 0,
        productSKUId: "",
      },
    ]);
  };

  const removeLineItem = (id: string) => {
    if (lineItems.length === 1) {
      toast.error("At least one line item is required");
      return;
    }
    setLineItems(lineItems.filter((item) => item.id !== id));
  };

  const updateLineItem = (id: string, field: keyof LineItem, value: any) => {
    setLineItems(
      lineItems.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const calculateTotals = () => {
    const subtotal = lineItems.reduce(
      (sum, item) => sum + item.quantity * item.unitPrice,
      0
    );
    const shipping = 0;
    const tax = 0;
    const total = subtotal + shipping + tax;

    return { subtotal, shipping, tax, total };
  };

  const handleSavePO = async () => {
    if (!formData.vendorId) {
      toast.error("Please select a vendor");
      return;
    }

    if (!formData.poNumber) {
      toast.error("PO number is required");
      return;
    }

    if (lineItems.some((item) => !item.description || item.quantity <= 0 || item.unitPrice <= 0)) {
      toast.error("All line items must have description, quantity, and unit price");
      return;
    }

    setIsSaving(true);

    try {
      const { subtotal, shipping, tax, total } = calculateTotals();

      const response = await fetch(
        `/api/projects/${projectId}/purchase-orders`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...formData,
            subtotal,
            shipping,
            tax,
            totalAmount: total,
            lineItems: lineItems.map((item) => ({
              productSKUId: item.productSKUId || null,
              description: item.description,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
            })),
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create PO");
      }

      toast.success("Purchase order created successfully");
      setIsDialogOpen(false);
      router.refresh();
    } catch (error: any) {
      console.error("Error creating PO:", error);
      toast.error(error.message || "Failed to create purchase order");
    } finally {
      setIsSaving(false);
    }
  };

  const totals = calculateTotals();

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
        <Button onClick={handleOpenDialog}>
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
                <div className="flex items-start justify-between gap-4">
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

                  {/* Status Actions */}
                  <div className="flex flex-col gap-1">
                    {po.status === "DRAFT" && (
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => handleUpdateStatus(po.id, "SENT")}
                      >
                        Send PO
                      </Button>
                    )}
                    {po.status === "SENT" && (
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => handleUpdateStatus(po.id, "CONFIRMED")}
                      >
                        Mark Confirmed
                      </Button>
                    )}
                    {po.status === "CONFIRMED" && (
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => handleUpdateStatus(po.id, "IN_PRODUCTION")}
                      >
                        In Production
                      </Button>
                    )}
                    {po.status === "IN_PRODUCTION" && (
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => handleUpdateStatus(po.id, "READY_TO_SHIP")}
                      >
                        Ready to Ship
                      </Button>
                    )}
                    {po.status === "READY_TO_SHIP" && (
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => handleUpdateStatus(po.id, "SHIPPED")}
                      >
                        Mark Shipped
                      </Button>
                    )}
                    {po.status === "SHIPPED" && (
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => handleUpdateStatus(po.id, "DELIVERED")}
                      >
                        Mark Delivered
                      </Button>
                    )}
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </div>
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
            <Button onClick={handleOpenDialog}>
              <Plus className="h-4 w-4 mr-2" />
              Create First PO
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Create PO Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Purchase Order</DialogTitle>
            <DialogDescription>
              Create a new production purchase order with line items
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Basic Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Vendor *</Label>
                <Select
                  value={formData.vendorId}
                  onValueChange={(value) =>
                    setFormData({ ...formData, vendorId: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select vendor" />
                  </SelectTrigger>
                  <SelectContent>
                    {vendors.map((vendor) => (
                      <SelectItem key={vendor.id} value={vendor.id}>
                        {vendor.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>PO Number *</Label>
                <Input
                  value={formData.poNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, poNumber: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Order Date *</Label>
                <Input
                  type="date"
                  value={formData.orderDate}
                  onChange={(e) =>
                    setFormData({ ...formData, orderDate: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Expected Ship Date</Label>
                <Input
                  type="date"
                  value={formData.expectedShipDate}
                  onChange={(e) =>
                    setFormData({ ...formData, expectedShipDate: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>Expected Delivery</Label>
                <Input
                  type="date"
                  value={formData.expectedDelivery}
                  onChange={(e) =>
                    setFormData({ ...formData, expectedDelivery: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Line Items */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-base">Line Items *</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addLineItem}
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Add Item
                </Button>
              </div>

              <div className="space-y-3">
                {lineItems.map((item, index) => (
                  <Card key={item.id}>
                    <CardContent className="p-4">
                      <div className="flex gap-3 items-start">
                        <div className="flex-1 space-y-3">
                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <Label className="text-xs">Description *</Label>
                              <Input
                                placeholder="Item description"
                                value={item.description}
                                onChange={(e) =>
                                  updateLineItem(
                                    item.id,
                                    "description",
                                    e.target.value
                                  )
                                }
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <div className="space-y-1">
                                <Label className="text-xs">Quantity *</Label>
                                <Input
                                  type="number"
                                  min="1"
                                  value={item.quantity}
                                  onChange={(e) =>
                                    updateLineItem(
                                      item.id,
                                      "quantity",
                                      parseInt(e.target.value) || 0
                                    )
                                  }
                                />
                              </div>
                              <div className="space-y-1">
                                <Label className="text-xs">Unit Price *</Label>
                                <Input
                                  type="number"
                                  min="0"
                                  step="0.01"
                                  value={item.unitPrice}
                                  onChange={(e) =>
                                    updateLineItem(
                                      item.id,
                                      "unitPrice",
                                      parseFloat(e.target.value) || 0
                                    )
                                  }
                                />
                              </div>
                            </div>
                          </div>
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-muted-foreground">
                              Item #{index + 1} Total
                            </span>
                            <span className="font-semibold">
                              ${(item.quantity * item.unitPrice).toFixed(2)}
                            </span>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeLineItem(item.id)}
                          disabled={lineItems.length === 1}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Totals */}
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">${totals.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span className="font-medium">${totals.shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tax</span>
                <span className="font-medium">${totals.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-base font-semibold border-t pt-2">
                <span>Total</span>
                <span>${totals.total.toFixed(2)}</span>
              </div>
            </div>

            {/* Additional Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Payment Terms</Label>
                <Input
                  placeholder="e.g., Net 30, 50% deposit"
                  value={formData.paymentTerms}
                  onChange={(e) =>
                    setFormData({ ...formData, paymentTerms: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Notes</Label>
              <Textarea
                placeholder="Additional notes or instructions..."
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button onClick={handleSavePO} disabled={isSaving}>
              {isSaving ? "Creating..." : "Create Purchase Order"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
