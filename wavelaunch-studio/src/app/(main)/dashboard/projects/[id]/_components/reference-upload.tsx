/**
 * Reference Upload Component
 *
 * Allows uploading and tagging visual references for brand discovery
 */

"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Upload, X, Image as ImageIcon, Tag, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface Reference {
  id: string;
  filename: string;
  originalFilename: string;
  s3Url: string;
  thumbnailS3Url: string | null;
  category: string | null;
  tags: string; // JSON string
  createdAt: Date;
  uploadedBy: {
    fullName: string;
  };
}

interface ReferenceUploadProps {
  projectId: string;
  references: Reference[];
}

const REFERENCE_CATEGORIES = [
  { value: "LOGO_INSPO", label: "Logo Inspiration" },
  { value: "COLOR_INSPO", label: "Color Inspiration" },
  { value: "TYPOGRAPHY", label: "Typography" },
  { value: "PACKAGING", label: "Packaging" },
  { value: "LIFESTYLE", label: "Lifestyle & Mood" },
  { value: "PRODUCT_INSPO", label: "Product Design" },
  { value: "WEBSITE_INSPO", label: "Website Inspiration" },
  { value: "COMPETITOR", label: "Competitor Reference" },
  { value: "OTHER", label: "Other" },
];

const SUGGESTED_TAGS = [
  "minimal",
  "bold",
  "elegant",
  "playful",
  "modern",
  "vintage",
  "luxurious",
  "organic",
  "geometric",
  "handwritten",
  "serif",
  "sans-serif",
  "monochrome",
  "colorful",
  "pastel",
  "vibrant",
  "matte",
  "glossy",
  "feminine",
  "masculine",
  "neutral",
];

export function ReferenceUpload({ projectId, references }: ReferenceUploadProps) {
  const [open, setOpen] = React.useState(false);
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [category, setCategory] = React.useState<string>("");
  const [tags, setTags] = React.useState<string[]>([]);
  const [customTag, setCustomTag] = React.useState("");
  const [isUploading, setIsUploading] = React.useState(false);
  const [selectedCategory, setSelectedCategory] = React.useState<string>("ALL");
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
      if (file.type.startsWith("image/")) {
        setSelectedFile(file);
      } else {
        toast.error("Please upload an image file");
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type.startsWith("image/")) {
        setSelectedFile(file);
      } else {
        toast.error("Please upload an image file");
      }
    }
  };

  const handleAddTag = (tag: string) => {
    if (!tags.includes(tag)) {
      setTags([...tags, tag]);
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleAddCustomTag = () => {
    if (customTag.trim() && !tags.includes(customTag.trim())) {
      setTags([...tags, customTag.trim()]);
      setCustomTag("");
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select a file");
      return;
    }

    if (!category) {
      toast.error("Please select a category");
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("projectId", projectId);
      formData.append("folder", "QUESTIONNAIRE_REFS");
      formData.append("category", category);
      formData.append("tags", JSON.stringify(tags));

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      toast.success("Reference uploaded successfully");
      setOpen(false);
      setSelectedFile(null);
      setCategory("");
      setTags([]);
      router.refresh();
    } catch (error) {
      console.error("Error uploading reference:", error);
      toast.error("Failed to upload reference");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (referenceId: string) => {
    try {
      const response = await fetch(`/api/files/${referenceId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Delete failed");
      }

      toast.success("Reference deleted");
      router.refresh();
    } catch (error) {
      console.error("Error deleting reference:", error);
      toast.error("Failed to delete reference");
    }
  };

  // Filter references by category
  const filteredReferences =
    selectedCategory === "ALL"
      ? references
      : references.filter((ref) => ref.category === selectedCategory);

  // Group references by category
  const referencesByCategory = references.reduce((acc, ref) => {
    const cat = ref.category || "OTHER";
    if (!acc[cat]) {
      acc[cat] = [];
    }
    acc[cat].push(ref);
    return acc;
  }, {} as Record<string, Reference[]>);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Visual References</h3>
          <p className="text-sm text-muted-foreground">
            Upload images that inspire your brand's visual direction
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Upload className="h-4 w-4 mr-2" />
              Upload Reference
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Upload Visual Reference</DialogTitle>
              <DialogDescription>
                Upload an image and tag it to help us understand your brand vision
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
                  accept="image/*"
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
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </div>
                )}
              </div>

              {/* Category Selection */}
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {REFERENCE_CATEGORIES.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <Label>Tags (Optional)</Label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="cursor-pointer"
                      onClick={() => handleRemoveTag(tag)}
                    >
                      {tag}
                      <X className="h-3 w-3 ml-1" />
                    </Badge>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Input
                    placeholder="Add custom tag"
                    value={customTag}
                    onChange={(e) => setCustomTag(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddCustomTag();
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAddCustomTag}
                    disabled={!customTag.trim()}
                  >
                    <Tag className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2 mt-3">
                  {SUGGESTED_TAGS.map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                      onClick={() => handleAddTag(tag)}
                    >
                      + {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpload} disabled={isUploading || !selectedFile}>
                {isUploading ? "Uploading..." : "Upload"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Category Filter */}
      {references.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedCategory === "ALL" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory("ALL")}
          >
            All ({references.length})
          </Button>
          {REFERENCE_CATEGORIES.map((cat) => {
            const count = referencesByCategory[cat.value]?.length || 0;
            if (count === 0) return null;
            return (
              <Button
                key={cat.value}
                variant={selectedCategory === cat.value ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(cat.value)}
              >
                {cat.label} ({count})
              </Button>
            );
          })}
        </div>
      )}

      {/* References Grid */}
      {filteredReferences.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredReferences.map((ref) => (
            <Card key={ref.id} className="overflow-hidden">
              <div className="aspect-square relative bg-muted">
                <img
                  src={ref.thumbnailS3Url || ref.s3Url}
                  alt={ref.originalFilename}
                  className="object-cover w-full h-full"
                />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 h-8 w-8"
                  onClick={() => handleDelete(ref.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <CardContent className="p-3">
                <p className="text-xs font-medium truncate mb-2">
                  {ref.originalFilename}
                </p>
                <div className="flex flex-wrap gap-1">
                  {(() => {
                    try {
                      const parsedTags = JSON.parse(ref.tags || "[]");
                      return (
                        <>
                          {parsedTags.slice(0, 3).map((tag: string) => (
                            <Badge
                              key={tag}
                              variant="secondary"
                              className="text-[10px] px-1"
                            >
                              {tag}
                            </Badge>
                          ))}
                          {parsedTags.length > 3 && (
                            <Badge variant="secondary" className="text-[10px] px-1">
                              +{parsedTags.length - 3}
                            </Badge>
                          )}
                        </>
                      );
                    } catch {
                      return null;
                    }
                  })()}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <ImageIcon className="h-16 w-16 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium mb-2">No references yet</h3>
            <p className="text-muted-foreground text-center max-w-sm mb-6">
              Upload images that inspire your brand's visual direction. These will help
              guide the asset generation process.
            </p>
            <Button onClick={() => setOpen(true)}>
              <Upload className="h-4 w-4 mr-2" />
              Upload First Reference
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
