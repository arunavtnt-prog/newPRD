/**
 * Project Files Component
 *
 * Displays and manages files for a project
 */

"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  File,
  FileText,
  Image as ImageIcon,
  Video,
  Music,
  Archive,
  MoreVertical,
  Download,
  Trash2,
  Eye,
  Upload,
  FolderOpen,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { UploadFileDialog } from "./upload-file-dialog";

interface ProjectFile {
  id: string;
  filename: string;
  originalFilename: string;
  fileType: string;
  fileSize: number;
  s3Url: string;
  thumbnailS3Url: string | null;
  folder: string;
  uploadedBy: {
    fullName: string;
  };
  createdAt: Date;
}

interface ProjectFilesProps {
  projectId: string;
  files: ProjectFile[];
}

export function ProjectFiles({ projectId, files }: ProjectFilesProps) {
  const [selectedFolder, setSelectedFolder] = React.useState<string | null>(
    null
  );

  // Group files by folder
  const filesByFolder = files.reduce(
    (acc, file) => {
      if (!acc[file.folder]) {
        acc[file.folder] = [];
      }
      acc[file.folder].push(file);
      return acc;
    },
    {} as Record<string, ProjectFile[]>
  );

  const folders = Object.keys(filesByFolder);
  const displayFiles = selectedFolder
    ? filesByFolder[selectedFolder] || []
    : files;

  // Get file icon based on type
  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith("image/")) return ImageIcon;
    if (fileType.startsWith("video/")) return Video;
    if (fileType.startsWith("audio/")) return Music;
    if (fileType.includes("pdf")) return FileText;
    if (
      fileType.includes("zip") ||
      fileType.includes("rar") ||
      fileType.includes("tar")
    )
      return Archive;
    return File;
  };

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  // Get folder display name
  const getFolderName = (folder: string) => {
    const names: Record<string, string> = {
      REFS: "References",
      BRAND: "Brand Assets",
      PRODUCT: "Product Files",
      MANUFACTURING: "Manufacturing",
      WEBSITE: "Website",
      MARKETING: "Marketing",
      CREATOR_UPLOADS: "Creator Uploads",
      QUESTIONNAIRE_REFS: "Questionnaire References",
      GENERATED_LOGOS: "Generated Logos",
      GENERATED_TEMPLATES: "Generated Templates",
    };
    return names[folder] || folder;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Files</h2>
          <p className="text-muted-foreground">
            {files.length} file{files.length !== 1 ? "s" : ""} total
          </p>
        </div>
        <UploadFileDialog projectId={projectId}>
          <Button>
            <Upload className="h-4 w-4 mr-2" />
            Upload Files
          </Button>
        </UploadFileDialog>
      </div>

      {/* Folder Filter */}
      {folders.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant={selectedFolder === null ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedFolder(null)}
          >
            <FolderOpen className="h-4 w-4 mr-2" />
            All Files
          </Button>
          {folders.map((folder) => (
            <Button
              key={folder}
              variant={selectedFolder === folder ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedFolder(folder)}
            >
              {getFolderName(folder)} ({filesByFolder[folder].length})
            </Button>
          ))}
        </div>
      )}

      {/* Files List */}
      {displayFiles.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {displayFiles.map((file) => {
            const FileIcon = getFileIcon(file.fileType);

            return (
              <Card key={file.id}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    {/* Thumbnail or Icon */}
                    <div className="flex-shrink-0">
                      {file.thumbnailS3Url ? (
                        <img
                          src={file.thumbnailS3Url}
                          alt={file.originalFilename}
                          className="h-16 w-16 rounded object-cover"
                        />
                      ) : (
                        <div className="flex h-16 w-16 items-center justify-center rounded bg-muted">
                          <FileIcon className="h-8 w-8 text-muted-foreground" />
                        </div>
                      )}
                    </div>

                    {/* File Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium truncate">
                          {file.originalFilename}
                        </h3>
                        <Badge variant="outline">
                          {getFolderName(file.folder)}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                        <span>{formatFileSize(file.fileSize)}</span>
                        <span>•</span>
                        <span>Uploaded by {file.uploadedBy.fullName}</span>
                        <span>•</span>
                        <span>
                          {formatDistanceToNow(new Date(file.createdAt), {
                            addSuffix: true,
                          })}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem disabled>
                          <Eye className="h-4 w-4 mr-2" />
                          Preview
                        </DropdownMenuItem>
                        <DropdownMenuItem disabled>
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem disabled className="text-destructive">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="mb-4 rounded-full bg-muted p-4">
              <FolderOpen className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">
              {selectedFolder ? "No files in this folder" : "No files uploaded"}
            </h3>
            <p className="text-sm text-muted-foreground text-center max-w-md mb-6">
              {selectedFolder
                ? "Upload files to this folder to get started"
                : "Upload files to organize project assets and references. Keep everything in one place for easy access by your team."}
            </p>
            <UploadFileDialog projectId={projectId}>
              <Button>
                <Upload className="h-4 w-4 mr-2" />
                Upload Files
              </Button>
            </UploadFileDialog>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
