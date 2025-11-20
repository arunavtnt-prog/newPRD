/**
 * Vendor Management Component
 *
 * Manage suppliers and vendors
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
import { Factory, Plus, Edit, Trash2, Star, Mail, Phone } from "lucide-react";
import { toast } from "sonner";

interface Vendor {
  id: string;
  name: string;
  contactPerson: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  country: string | null;
  moqRange: string | null;
  leadTimeRange: string | null;
  rating: any;
  notes: string | null;
  purchaseOrders?: any[];
  createdAt: Date;
}

interface VendorManagementProps {
  projectId: string;
  vendors: Vendor[];
}

export function VendorManagement({ projectId, vendors }: VendorManagementProps) {
  const [open, setOpen] = React.useState(false);
  const [editingVendor, setEditingVendor] = React.useState<Vendor | null>(null);
  const [isSaving, setIsSaving] = React.useState(false);
  const router = useRouter();

  const [formData, setFormData] = React.useState({
    name: "",
    contactPerson: "",
    email: "",
    phone: "",
    address: "",
    country: "",
    moqRange: "",
    leadTimeRange: "",
    rating: "",
    notes: "",
  });

  const handleOpenAdd = () => {
    setEditingVendor(null);
    setFormData({
      name: "",
      contactPerson: "",
      email: "",
      phone: "",
      address: "",
      country: "",
      moqRange: "",
      leadTimeRange: "",
      rating: "",
      notes: "",
    });
    setOpen(true);
  };

  const handleOpenEdit = (vendor: Vendor) => {
    setEditingVendor(vendor);
    setFormData({
      name: vendor.name,
      contactPerson: vendor.contactPerson || "",
      email: vendor.email || "",
      phone: vendor.phone || "",
      address: vendor.address || "",
      country: vendor.country || "",
      moqRange: vendor.moqRange || "",
      leadTimeRange: vendor.leadTimeRange || "",
      rating: vendor.rating?.toString() || "",
      notes: vendor.notes || "",
    });
    setOpen(true);
  };

  const handleSave = async () => {
    if (!formData.name) {
      toast.error("Vendor name is required");
      return;
    }

    setIsSaving(true);

    try {
      const url = editingVendor
        ? `/api/projects/${projectId}/vendors/${editingVendor.id}`
        : `/api/projects/${projectId}/vendors`;

      const method = editingVendor ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          rating: formData.rating ? parseFloat(formData.rating) : null,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save vendor");
      }

      toast.success(
        editingVendor ? "Vendor updated successfully" : "Vendor created successfully"
      );
      setOpen(false);
      router.refresh();
    } catch (error) {
      console.error("Error saving vendor:", error);
      toast.error("Failed to save vendor");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (vendorId: string) => {
    try {
      const response = await fetch(
        `/api/projects/${projectId}/vendors/${vendorId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete vendor");
      }

      toast.success("Vendor deleted");
      router.refresh();
    } catch (error) {
      console.error("Error deleting vendor:", error);
      toast.error("Failed to delete vendor");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Vendor Management</h3>
          <p className="text-sm text-muted-foreground">
            Manage suppliers and manufacturing partners
          </p>
        </div>
        <Button onClick={handleOpenAdd}>
          <Plus className="h-4 w-4 mr-2" />
          Add Vendor
        </Button>
      </div>

      {/* Vendor List */}
      {vendors.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {vendors.map((vendor) => {
            const poCount = vendor.purchaseOrders?.length || 0;
            const rating = vendor.rating ? parseFloat(vendor.rating.toString()) : 0;

            return (
              <Card key={vendor.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-base">{vendor.name}</CardTitle>
                      {vendor.country && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {vendor.country}
                        </p>
                      )}
                    </div>
                    {rating > 0 && (
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                        <span className="text-sm font-medium">{rating.toFixed(1)}</span>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Contact Info */}
                  {(vendor.contactPerson || vendor.email || vendor.phone) && (
                    <div className="space-y-2 text-sm">
                      {vendor.contactPerson && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Factory className="h-3 w-3" />
                          {vendor.contactPerson}
                        </div>
                      )}
                      {vendor.email && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Mail className="h-3 w-3" />
                          {vendor.email}
                        </div>
                      )}
                      {vendor.phone && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Phone className="h-3 w-3" />
                          {vendor.phone}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Capabilities */}
                  {(vendor.moqRange || vendor.leadTimeRange) && (
                    <div className="space-y-1 text-xs">
                      {vendor.moqRange && (
                        <p className="text-muted-foreground">
                          MOQ: {vendor.moqRange}
                        </p>
                      )}
                      {vendor.leadTimeRange && (
                        <p className="text-muted-foreground">
                          Lead Time: {vendor.leadTimeRange}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Stats */}
                  {poCount > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      {poCount} PO{poCount !== 1 ? "s" : ""}
                    </Badge>
                  )}

                  {/* Notes */}
                  {vendor.notes && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {vendor.notes}
                    </p>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleOpenEdit(vendor)}
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(vendor.id)}
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
            <Factory className="h-16 w-16 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium mb-2">No vendors yet</h3>
            <p className="text-muted-foreground text-center max-w-sm mb-6">
              Add your manufacturing partners and suppliers to track production
            </p>
            <Button onClick={handleOpenAdd}>
              <Plus className="h-4 w-4 mr-2" />
              Add First Vendor
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingVendor ? "Edit Vendor" : "Add New Vendor"}
            </DialogTitle>
            <DialogDescription>
              Enter vendor details and capabilities
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Basic Info */}
            <div className="space-y-4">
              <h4 className="font-medium">Basic Information</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Vendor Name *</Label>
                  <Input
                    id="name"
                    placeholder="e.g., ABC Manufacturing"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    placeholder="e.g., China, Vietnam"
                    value={formData.country}
                    onChange={(e) =>
                      setFormData({ ...formData, country: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-4">
              <h4 className="font-medium">Contact Information</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contactPerson">Contact Person</Label>
                  <Input
                    id="contactPerson"
                    placeholder="e.g., John Doe"
                    value={formData.contactPerson}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        contactPerson: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@example.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    placeholder="+1 234 567 8900"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    placeholder="Street address"
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>

            {/* Capabilities */}
            <div className="space-y-4">
              <h4 className="font-medium">Capabilities</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="moqRange">MOQ Range</Label>
                  <Input
                    id="moqRange"
                    placeholder="e.g., 100-500 units"
                    value={formData.moqRange}
                    onChange={(e) =>
                      setFormData({ ...formData, moqRange: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="leadTimeRange">Lead Time Range</Label>
                  <Input
                    id="leadTimeRange"
                    placeholder="e.g., 30-45 days"
                    value={formData.leadTimeRange}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        leadTimeRange: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rating">Rating (1-5)</Label>
                  <Input
                    id="rating"
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    placeholder="4.5"
                    value={formData.rating}
                    onChange={(e) =>
                      setFormData({ ...formData, rating: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                placeholder="Additional notes about this vendor..."
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
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
              {isSaving
                ? "Saving..."
                : editingVendor
                ? "Update Vendor"
                : "Create Vendor"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
