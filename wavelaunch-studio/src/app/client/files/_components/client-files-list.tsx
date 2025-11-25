"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  Download,
  FileText,
  Image as ImageIcon,
  File,
  Search,
  FolderOpen,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";

interface Asset {
  id: string;
  assetName: string;
  fileType: string;
  fileSize: number | null;
  fileUrl: string;
  uploadDate: Date;
  project: {
    id: string;
    projectName: string;
    status: string;
  };
  uploadedBy: {
    id: string;
    fullName: string;
    avatarUrl: string | null;
  };
}

interface ClientFilesListProps {
  assets: Asset[];
}

const fileIcons: Record<string, React.ElementType> = {
  image: ImageIcon,
  pdf: FileText,
  document: FileText,
  default: File,
};

function formatFileSize(bytes: number | null): string {
  if (!bytes) return "Unknown size";
  const sizes = ["Bytes", "KB", "MB", "GB"];
  if (bytes === 0) return "0 Bytes";
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + " " + sizes[i];
}

function getFileIcon(fileType: string): React.ElementType {
  if (fileType.startsWith("image/")) return fileIcons.image;
  if (fileType === "application/pdf") return fileIcons.pdf;
  if (fileType.includes("document")) return fileIcons.document;
  return fileIcons.default;
}

export function ClientFilesList({ assets }: ClientFilesListProps) {
  const [search, setSearch] = useState("");

  const filteredAssets = assets.filter((asset) =>
    asset.assetName.toLowerCase().includes(search.toLowerCase()) ||
    asset.project.projectName.toLowerCase().includes(search.toLowerCase())
  );

  if (assets.length === 0) {
    return (
      <Card className="border-purple-100">
        <CardContent className="p-12">
          <div className="text-center">
            <FolderOpen className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Files Yet</h3>
            <p className="text-muted-foreground">
              Files uploaded to your projects will appear here
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-purple-100">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle>All Files ({assets.length})</CardTitle>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search files..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {filteredAssets.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No files match your search
          </div>
        ) : (
          <div className="space-y-3">
            {filteredAssets.map((asset) => {
              const Icon = getFileIcon(asset.fileType);
              const uploaderInitials = asset.uploadedBy.fullName
                ?.split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase();

              return (
                <div
                  key={asset.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-purple-100 hover:bg-purple-50/50 transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="shrink-0 p-2 rounded-lg bg-purple-100">
                      <Icon className="h-5 w-5 text-purple-600" />
                    </div>

                    <div className="flex-1 min-w-0 space-y-1">
                      <h4 className="font-medium truncate">{asset.assetName}</h4>

                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {asset.project.projectName}
                        </Badge>

                        <span className="text-xs text-muted-foreground">•</span>

                        <div className="flex items-center gap-1">
                          <Avatar className="h-4 w-4">
                            <AvatarImage
                              src={asset.uploadedBy.avatarUrl || undefined}
                            />
                            <AvatarFallback className="text-[8px]">
                              {uploaderInitials}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-xs text-muted-foreground">
                            {asset.uploadedBy.fullName}
                          </span>
                        </div>

                        <span className="text-xs text-muted-foreground">•</span>

                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(asset.uploadDate))} ago
                        </span>

                        <span className="text-xs text-muted-foreground">•</span>

                        <span className="text-xs text-muted-foreground">
                          {formatFileSize(asset.fileSize)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <Button size="sm" variant="ghost" asChild>
                      <a href={`/client/projects/${asset.project.id}`}>
                        View Project
                      </a>
                    </Button>

                    <Button size="sm" variant="outline" asChild>
                      <a
                        href={asset.fileUrl}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Download className="h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
