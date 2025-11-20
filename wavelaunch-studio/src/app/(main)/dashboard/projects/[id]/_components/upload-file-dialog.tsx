/**
 * Upload File Dialog
 *
 * Modal for uploading files to a project
 */

"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Upload, File, X, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
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
import { Label } from "@/components/ui/label";

interface UploadFileDialogProps {
  children: React.ReactNode;
  projectId: string;
}

export function UploadFileDialog({
  children,
  projectId,
}: UploadFileDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [isUploading, setIsUploading] = React.useState(false);
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [folder, setFolder] = React.useState<string>("CREATOR_UPLOADS");
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select a file to upload");
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("projectId", projectId);
      formData.append("folder", folder);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload file");
      }

      toast.success("File uploaded successfully!");
      setOpen(false);
      setSelectedFile(null);
      router.refresh();
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("Failed to upload file. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Upload File</DialogTitle>
          <DialogDescription>
            Upload files to this project for organization and sharing
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Folder Selection */}
          <div className="space-y-2">
            <Label htmlFor="folder">Folder</Label>
            <Select value={folder} onValueChange={setFolder}>
              <SelectTrigger id="folder">
                <SelectValue placeholder="Select folder" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="REFS">References</SelectItem>
                <SelectItem value="BRAND">Brand Assets</SelectItem>
                <SelectItem value="PRODUCT">Product Files</SelectItem>
                <SelectItem value="MANUFACTURING">Manufacturing</SelectItem>
                <SelectItem value="WEBSITE">Website</SelectItem>
                <SelectItem value="MARKETING">Marketing</SelectItem>
                <SelectItem value="CREATOR_UPLOADS">Creator Uploads</SelectItem>
                <SelectItem value="QUESTIONNAIRE_REFS">
                  Questionnaire References
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* File Drop Zone */}
          <div
            className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
            onClick={() => fileInputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={handleFileSelect}
              disabled={isUploading}
            />

            {selectedFile ? (
              <div className="flex items-center justify-between bg-muted p-4 rounded">
                <div className="flex items-center gap-3">
                  <File className="h-8 w-8 text-muted-foreground" />
                  <div className="text-left">
                    <p className="font-medium">{selectedFile.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatFileSize(selectedFile.size)}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedFile(null);
                  }}
                  disabled={isUploading}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div>
                <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-sm font-medium mb-1">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-muted-foreground">
                  Any file up to 10MB
                </p>
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isUploading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpload}
            disabled={!selectedFile || isUploading}
          >
            {isUploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Upload
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
