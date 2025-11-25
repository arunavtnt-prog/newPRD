/**
 * Files Browser Component
 *
 * Browse, search, and manage files across all projects
 */

"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  File,
  FileText,
  Image,
  Video,
  FileArchive,
  Download,
  ExternalLink,
  Search,
  Filter,
  HardDrive,
  FolderOpen,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";

interface FileItem {
  id: string;
  filename: string;
  originalFilename: string;
  fileType: string;
  fileSize: number;
  s3Url: string;
  folder: string;
  category: string | null;
  createdAt: Date;
  project: {
    id: string;
    projectName: string;
    creatorName: string;
  };
  uploadedBy: {
    fullName: string;
    avatarUrl: string | null;
  };
}

interface FilesBrowserProps {
  files: FileItem[];
  totalCount: number;
  totalSize: number;
  folderCounts: Array<{ folder: string; _count: number }>;
  isAdmin: boolean;
}

export function FilesBrowser({
  files,
  totalCount,
  totalSize,
  folderCounts,
  isAdmin,
}: FilesBrowserProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFolder, setSelectedFolder] = useState<string>("all");
  const [selectedFileType, setSelectedFileType] = useState<string>("all");

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    if (bytes < 1024 * 1024 * 1024)
      return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
  };

  // Get file icon
  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith("image/")) return Image;
    if (fileType.startsWith("video/")) return Video;
    if (fileType === "application/pdf") return FileText;
    if (fileType.includes("zip") || fileType.includes("archive"))
      return FileArchive;
    return File;
  };

  // Filter files
  const filteredFiles = files.filter((file) => {
    const matchesSearch =
      file.originalFilename.toLowerCase().includes(searchQuery.toLowerCase()) ||
      file.project.projectName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFolder =
      selectedFolder === "all" || file.folder === selectedFolder;

    const matchesType =
      selectedFileType === "all" ||
      (selectedFileType === "images" && file.fileType.startsWith("image/")) ||
      (selectedFileType === "videos" && file.fileType.startsWith("video/")) ||
      (selectedFileType === "documents" &&
        (file.fileType.includes("pdf") || file.fileType.includes("document"))) ||
      (selectedFileType === "archives" &&
        (file.fileType.includes("zip") || file.fileType.includes("archive")));

    return matchesSearch && matchesFolder && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Files</h1>
        <p className="text-muted-foreground mt-2">
          Browse and manage files across all projects
        </p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <File className="h-4 w-4" />
              Total Files
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCount.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <HardDrive className="h-4 w-4" />
              Total Storage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatFileSize(totalSize)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <FolderOpen className="h-4 w-4" />
              Folders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{folderCounts.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search files or projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={selectedFolder} onValueChange={setSelectedFolder}>
              <SelectTrigger>
                <SelectValue placeholder="All folders" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Folders</SelectItem>
                {folderCounts.map((f) => (
                  <SelectItem key={f.folder} value={f.folder}>
                    {f.folder.replace(/_/g, " ")} ({f._count})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedFileType} onValueChange={setSelectedFileType}>
              <SelectTrigger>
                <SelectValue placeholder="All types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="images">Images</SelectItem>
                <SelectItem value="videos">Videos</SelectItem>
                <SelectItem value="documents">Documents</SelectItem>
                <SelectItem value="archives">Archives</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Files List */}
      <div className="space-y-2">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-muted-foreground">
            Showing {filteredFiles.length} of {totalCount} files
          </p>
          {filteredFiles.length > 0 && (
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </Button>
          )}
        </div>

        {filteredFiles.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center text-muted-foreground">
              <File className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No files found matching your criteria</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {filteredFiles.map((file) => {
              const FileIcon = getFileIcon(file.fileType);
              return (
                <Card
                  key={file.id}
                  className="hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => window.open(file.s3Url, "_blank")}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      {/* Icon */}
                      <div className="flex-shrink-0">
                        <div className="h-12 w-12 rounded bg-muted flex items-center justify-center">
                          <FileIcon className="h-6 w-6 text-muted-foreground" />
                        </div>
                      </div>

                      {/* File Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium truncate">
                          {file.originalFilename}
                        </h3>
                        <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                          <span>{formatFileSize(file.fileSize)}</span>
                          <span>•</span>
                          <span>{file.folder.replace(/_/g, " ")}</span>
                          <span>•</span>
                          <span>
                            {format(new Date(file.createdAt), "MMM d, yyyy")}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline" className="text-xs">
                            {file.project.projectName}
                          </Badge>
                          {file.category && (
                            <Badge variant="secondary" className="text-xs">
                              {file.category}
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Uploader */}
                      <div className="flex-shrink-0 flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={file.uploadedBy.avatarUrl || undefined} />
                          <AvatarFallback>
                            {file.uploadedBy.fullName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="hidden md:block">
                          <p className="text-sm font-medium">
                            {file.uploadedBy.fullName}
                          </p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex-shrink-0 flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/dashboard/projects/${file.project.id}`);
                          }}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(file.s3Url, "_blank");
                          }}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
