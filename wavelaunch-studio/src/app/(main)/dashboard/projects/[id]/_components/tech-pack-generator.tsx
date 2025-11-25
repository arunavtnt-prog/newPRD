/**
 * Tech Pack Generator Component
 *
 * Detailed product specifications and technical documentation
 */

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Loader2, Save, Package, FileText, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface TechPackGeneratorProps {
  projectId: string;
  skus: any[];
}

export function TechPackGenerator({ projectId, skus }: TechPackGeneratorProps) {
  const router = useRouter();
  const [savingSkuId, setSavingSkuId] = useState<string | null>(null);

  // State for each SKU's specifications
  const [skuSpecs, setSkuSpecs] = useState<Record<string, any>>(
    skus.reduce((acc, sku) => {
      acc[sku.id] = {
        dimensions: sku.dimensions || "",
        weight: sku.weight || "",
        materials: sku.materials || "",
        careInstructions: sku.careInstructions || "",
        moq: sku.moq?.toString() || "",
        leadTimeDays: sku.leadTimeDays?.toString() || "",
        supplierName: sku.supplierName || "",
        supplierContact: sku.supplierContact || "",
      };
      return acc;
    }, {} as Record<string, any>)
  );

  const updateSkuSpec = (skuId: string, field: string, value: string) => {
    setSkuSpecs((prev) => ({
      ...prev,
      [skuId]: {
        ...prev[skuId],
        [field]: value,
      },
    }));
  };

  const handleSave = async (skuId: string) => {
    const specs = skuSpecs[skuId];

    // Basic validation
    if (specs.moq && isNaN(parseInt(specs.moq))) {
      toast.error("MOQ must be a valid number");
      return;
    }
    if (specs.leadTimeDays && isNaN(parseInt(specs.leadTimeDays))) {
      toast.error("Lead time must be a valid number");
      return;
    }

    setSavingSkuId(skuId);
    try {
      const payload: any = {
        dimensions: specs.dimensions || null,
        weight: specs.weight || null,
        materials: specs.materials || null,
        careInstructions: specs.careInstructions || null,
        moq: specs.moq ? parseInt(specs.moq) : null,
        leadTimeDays: specs.leadTimeDays ? parseInt(specs.leadTimeDays) : null,
        supplierName: specs.supplierName || null,
        supplierContact: specs.supplierContact || null,
      };

      const response = await fetch(`/api/projects/${projectId}/skus/${skuId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to save specifications");
      }

      toast.success("Tech pack specifications saved successfully!");
      router.refresh();
    } catch (error) {
      console.error("Error saving specifications:", error);
      toast.error(error instanceof Error ? error.message : "Failed to save specifications");
    } finally {
      setSavingSkuId(null);
    }
  };

  if (skus.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <Package className="h-16 w-16 text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-medium mb-2">No SKUs Found</h3>
          <p className="text-muted-foreground text-center max-w-sm">
            Create product SKUs first to generate technical specifications
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            <CardTitle>Technical Specifications</CardTitle>
          </div>
          <CardDescription>
            Complete product specifications, measurements, and production details for each SKU
          </CardDescription>
        </CardHeader>
      </Card>

      {/* SKU Specifications Accordion */}
      <Accordion type="single" collapsible className="space-y-4">
        {skus.map((sku) => {
          const specs = skuSpecs[sku.id] || {};
          const completionFields = [
            specs.dimensions,
            specs.weight,
            specs.materials,
            specs.careInstructions,
            specs.moq,
            specs.leadTimeDays,
            specs.supplierName,
          ];
          const completedCount = completionFields.filter((f) => f && f.length > 0).length;
          const completionPercent = Math.round((completedCount / completionFields.length) * 100);

          return (
            <AccordionItem key={sku.id} value={sku.id} className="border rounded-lg">
              <AccordionTrigger className="px-6 hover:no-underline">
                <div className="flex items-center justify-between w-full pr-4">
                  <div className="flex items-center gap-3">
                    <Package className="h-5 w-5 text-muted-foreground" />
                    <div className="text-left">
                      <p className="font-semibold">{sku.productName}</p>
                      <p className="text-sm text-muted-foreground">
                        SKU: {sku.skuCode}
                        {sku.size && ` • Size: ${sku.size}`}
                        {sku.color && ` • Color: ${sku.color}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={completionPercent === 100 ? "default" : "secondary"}
                      className="ml-2"
                    >
                      {completionPercent}% Complete
                    </Badge>
                    <Badge variant="outline">{sku.status}</Badge>
                  </div>
                </div>
              </AccordionTrigger>

              <AccordionContent className="px-6 pb-6">
                <div className="space-y-6 pt-4">
                  {/* Product Specifications Section */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-sm">Product Specifications</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`dimensions-${sku.id}`}>Dimensions</Label>
                        <Input
                          id={`dimensions-${sku.id}`}
                          placeholder="e.g., 10 x 5 x 3 inches"
                          value={specs.dimensions}
                          onChange={(e) => updateSkuSpec(sku.id, "dimensions", e.target.value)}
                        />
                        <p className="text-xs text-muted-foreground">
                          Length × Width × Height
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`weight-${sku.id}`}>Weight</Label>
                        <Input
                          id={`weight-${sku.id}`}
                          placeholder="e.g., 0.5 lbs, 250g"
                          value={specs.weight}
                          onChange={(e) => updateSkuSpec(sku.id, "weight", e.target.value)}
                        />
                        <p className="text-xs text-muted-foreground">
                          Include unit of measurement
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`materials-${sku.id}`}>Materials & Composition</Label>
                      <Textarea
                        id={`materials-${sku.id}`}
                        placeholder="e.g., 100% Organic Cotton, Recycled Polyester Fill, YKK Zippers"
                        value={specs.materials}
                        onChange={(e) => updateSkuSpec(sku.id, "materials", e.target.value)}
                        rows={3}
                        className="resize-none"
                      />
                      <p className="text-xs text-muted-foreground">
                        List all materials and fabric composition
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`care-${sku.id}`}>Care Instructions</Label>
                      <Textarea
                        id={`care-${sku.id}`}
                        placeholder="e.g., Machine wash cold, tumble dry low, do not bleach"
                        value={specs.careInstructions}
                        onChange={(e) =>
                          updateSkuSpec(sku.id, "careInstructions", e.target.value)
                        }
                        rows={2}
                        className="resize-none"
                      />
                    </div>
                  </div>

                  {/* Production Details Section */}
                  <div className="space-y-4 pt-4 border-t">
                    <h4 className="font-semibold text-sm">Production Details</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`moq-${sku.id}`}>Minimum Order Quantity (MOQ)</Label>
                        <Input
                          id={`moq-${sku.id}`}
                          type="number"
                          placeholder="e.g., 100"
                          value={specs.moq}
                          onChange={(e) => updateSkuSpec(sku.id, "moq", e.target.value)}
                        />
                        <p className="text-xs text-muted-foreground">
                          Minimum units per production run
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`leadtime-${sku.id}`}>Lead Time (Days)</Label>
                        <Input
                          id={`leadtime-${sku.id}`}
                          type="number"
                          placeholder="e.g., 45"
                          value={specs.leadTimeDays}
                          onChange={(e) => updateSkuSpec(sku.id, "leadTimeDays", e.target.value)}
                        />
                        <p className="text-xs text-muted-foreground">
                          Production and delivery time
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Supplier Information Section */}
                  <div className="space-y-4 pt-4 border-t">
                    <h4 className="font-semibold text-sm">Supplier Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`supplier-${sku.id}`}>Supplier Name</Label>
                        <Input
                          id={`supplier-${sku.id}`}
                          placeholder="e.g., ABC Manufacturing Co."
                          value={specs.supplierName}
                          onChange={(e) => updateSkuSpec(sku.id, "supplierName", e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`contact-${sku.id}`}>Supplier Contact</Label>
                        <Input
                          id={`contact-${sku.id}`}
                          placeholder="e.g., john@supplier.com, +1-555-0123"
                          value={specs.supplierContact}
                          onChange={(e) =>
                            updateSkuSpec(sku.id, "supplierContact", e.target.value)
                          }
                        />
                      </div>
                    </div>
                  </div>

                  {/* Save Button */}
                  <div className="flex justify-end pt-4">
                    <Button
                      onClick={() => handleSave(sku.id)}
                      disabled={savingSkuId === sku.id}
                    >
                      {savingSkuId === sku.id ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Save Specifications
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>

      {/* Info Card */}
      <Card className="border-blue-200 bg-blue-50/50 dark:border-blue-900 dark:bg-blue-950/20">
        <CardContent className="flex items-start gap-3 pt-6">
          <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
          <div className="space-y-1">
            <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
              Tech Pack Best Practices
            </p>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              Complete tech packs help manufacturers produce exactly what you envision. Include
              detailed measurements, clear material specifications, and comprehensive care
              instructions to ensure quality production.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
