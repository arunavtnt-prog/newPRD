/**
 * Logo Concepts Component
 *
 * Display and manage logo concept variations with voting and approval
 */

"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Image as ImageIcon,
  Upload,
  Trash2,
  Check,
  ThumbsUp,
  Download,
  Star,
} from "lucide-react";
import { toast } from "sonner";

interface LogoConcept {
  id: string;
  filename: string;
  originalFilename: string;
  s3Url: string;
  thumbnailS3Url: string | null;
  category: string | null;
  tags: string;
  createdAt: Date;
  uploadedBy: {
    fullName: string;
  };
}

interface LogoConceptsProps {
  projectId: string;
  logos: LogoConcept[];
}

const LOGO_VARIATIONS = [
  { value: "PRIMARY", label: "Primary Logo" },
  { value: "SECONDARY", label: "Secondary/Icon" },
  { value: "WORDMARK", label: "Wordmark Only" },
  { value: "SUBMARK", label: "Submark" },
  { value: "BADGE", label: "Badge/Seal" },
  { value: "CONCEPT", label: "Concept/Draft" },
];

export function LogoConcepts({ projectId, logos }: LogoConceptsProps) {
  const [open, setOpen] = React.useState(false);
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [variation, setVariation] = React.useState<string>("");
  const [notes, setNotes] = React.useState("");
  const [isUploading, setIsUploading] = React.useState(false);
  const [selectedVariation, setSelectedVariation] = React.useState<string>("ALL");
  const [dragActive, setDragActive] = React.useState(false);
  const router = useRouter();
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith("image/") || file.name.endsWith(".svg")) {
        setSelectedFile(file);
      } else {
        toast.error("Please upload an image file (PNG, JPG, SVG)");
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type.startsWith("image/") || file.name.endsWith(".svg")) {
        setSelectedFile(file);
      } else {
        toast.error("Please upload an image file (PNG, JPG, SVG)");
      }
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select a file");
      return;
    }

    if (!variation) {
      toast.error("Please select a logo variation");
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("projectId", projectId);
      formData.append("folder", "GENERATED_LOGOS");
      formData.append("category", variation);
      formData.append("tags", JSON.stringify(notes ? [notes] : []));

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      toast.success("Logo uploaded successfully");
      setOpen(false);
      setSelectedFile(null);
      setVariation("");
      setNotes("");
      router.refresh();
    } catch (error) {
      console.error("Error uploading logo:", error);
      toast.error("Failed to upload logo");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (logoId: string) => {
    try {
      const response = await fetch(`/api/files/${logoId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Delete failed");
      }

      toast.success("Logo deleted");
      router.refresh();
    } catch (error) {
      console.error("Error deleting logo:", error);
      toast.error("Failed to delete logo");
    }
  };

  const handleApprove = async (logoId: string) => {
    try {
      const response = await fetch(`/api/logos/${logoId}/approve`, {
        method: "PATCH",
      });

      if (!response.ok) {
        throw new Error("Failed to approve logo");
      }

      toast.success("Logo approved");
      router.refresh();
    } catch (error) {
      console.error("Error approving logo:", error);
      toast.error("Failed to approve logo");
    }
  };

  // Filter logos by variation
  const filteredLogos =
    selectedVariation === "ALL"
      ? logos
      : logos.filter((logo) => logo.category === selectedVariation);

  // Group logos by variation
  const logosByVariation = logos.reduce((acc, logo) => {
    const variation = logo.category || "CONCEPT";
    if (!acc[variation]) {
      acc[variation] = [];
    }
    acc[variation].push(logo);
    return acc;
  }, {} as Record<string, LogoConcept[]>);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Logo Concepts</h3>
          <p className="text-sm text-muted-foreground">
            Upload and manage logo variations for your brand
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Upload className="h-4 w-4 mr-2" />
              Upload Logo
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Upload Logo Concept</DialogTitle>
              <DialogDescription>
                Upload a logo variation (PNG, JPG, or SVG recommended)
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              {/* File Upload */}
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                  dragActive
                    ? "border-primary bg-primary/5"
                    : "border-muted-foreground/25 hover:border-primary/50"
                }`}
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,.svg"
                  onChange={handleFileChange}
                  className="hidden"
                />
                {selectedFile ? (
                  <div className="space-y-2">
                    <ImageIcon className="h-12 w-12 mx-auto text-green-600" />
                    <p className="font-medium">{selectedFile.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Upload className="h-12 w-12 mx-auto text-muted-foreground" />
                    <p className="font-medium">Click or drag to upload</p>
                    <p className="text-sm text-muted-foreground">
                      PNG, JPG, SVG up to 10MB
                    </p>
                  </div>
                )}
              </div>

              {/* Variation Selection */}
              <div className="space-y-2">
                <Label htmlFor="variation">Logo Variation *</Label>
                <Select value={variation} onValueChange={setVariation}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select variation type" />
                  </SelectTrigger>
                  <SelectContent>
                    {LOGO_VARIATIONS.map((v) => (
                      <SelectItem key={v.value} value={v.value}>
                        {v.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Add any notes about this logo variation..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpload} disabled={isUploading || !selectedFile}>
                {isUploading ? "Uploading..." : "Upload Logo"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Variation Filter */}
      {logos.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedVariation === "ALL" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedVariation("ALL")}
          >
            All ({logos.length})
          </Button>
          {LOGO_VARIATIONS.map((v) => {
            const count = logosByVariation[v.value]?.length || 0;
            if (count === 0) return null;
            return (
              <Button
                key={v.value}
                variant={selectedVariation === v.value ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedVariation(v.value)}
              >
                {v.label} ({count})
              </Button>
            );
          })}
        </div>
      )}

      {/* Logos Grid */}
      {filteredLogos.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredLogos.map((logo) => {
            const variationLabel =
              LOGO_VARIATIONS.find((v) => v.value === logo.category)?.label ||
              "Concept";

            return (
              <Card key={logo.id} className="overflow-hidden">
                <div className="aspect-square relative bg-muted flex items-center justify-center p-4">
                  <img
                    src={logo.s3Url}
                    alt={logo.originalFilename}
                    className="max-w-full max-h-full object-contain"
                  />
                  <div className="absolute top-2 right-2 flex gap-2">
                    <Button
                      variant="secondary"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleApprove(logo.id)}
                      title="Approve"
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleDelete(logo.id)}
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <CardContent className="p-3">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="secondary" className="text-xs">
                      {variationLabel}
                    </Badge>
                    <a
                      href={logo.s3Url}
                      download={logo.originalFilename}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <Download className="h-4 w-4" />
                    </a>
                  </div>
                  <p className="text-xs font-medium truncate">
                    {logo.originalFilename}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    by {logo.uploadedBy.fullName}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <ImageIcon className="h-16 w-16 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium mb-2">No logo concepts yet</h3>
            <p className="text-muted-foreground text-center max-w-sm mb-6">
              Upload logo variations to build your brand's visual identity. You can
              upload primary logos, icons, wordmarks, and more.
            </p>
            <Button onClick={() => setOpen(true)}>
              <Upload className="h-4 w-4 mr-2" />
              Upload First Logo
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
