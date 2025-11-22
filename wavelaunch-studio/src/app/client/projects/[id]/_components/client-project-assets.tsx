"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Download,
  FileText,
  Image as ImageIcon,
  File,
  Upload,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Asset {
  id: string;
  assetName: string;
  fileType: string;
  fileSize: number | null;
  fileUrl: string;
  uploadDate: Date;
  uploadedBy: {
    id: string;
    fullName: string;
    avatarUrl: string | null;
  };
}

interface ClientProjectAssetsProps {
  assets: Asset[];
  projectId: string;
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

export function ClientProjectAssets({
  assets,
  projectId,
}: ClientProjectAssetsProps) {
  return (
    <div className="space-y-6">
      {/* Upload Button */}
      <Card className="border-purple-100 bg-gradient-to-br from-purple-50 to-blue-50">
        <CardContent className="p-6 text-center">
          <Upload className="h-8 w-8 mx-auto mb-3 text-purple-600" />
          <h3 className="font-semibold mb-2">Upload Files</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Share files with your team for review and approval
          </p>
          <Button asChild>
            <a href={`/client/projects/${projectId}/upload`}>
              Upload Files
            </a>
          </Button>
        </CardContent>
      </Card>

      {/* Assets List */}
      {assets.length === 0 ? (
        <Card className="border-purple-100">
          <CardContent className="p-12 text-center text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-4" />
            <p>No files have been uploaded yet</p>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-purple-100">
          <CardHeader>
            <CardTitle>Project Files ({assets.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {assets.map((asset) => {
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

                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium truncate">
                          {asset.assetName}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Avatar className="h-5 w-5">
                            <AvatarImage
                              src={asset.uploadedBy.avatarUrl || undefined}
                            />
                            <AvatarFallback className="text-xs">
                              {uploaderInitials}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-xs text-muted-foreground">
                            {asset.uploadedBy.fullName}
                          </span>
                          <span className="text-xs text-muted-foreground">•</span>
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(asset.uploadDate))} ago
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 ml-4">
                      <Badge variant="outline" className="text-xs">
                        {formatFileSize(asset.fileSize)}
                      </Badge>

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
          </CardContent>
        </Card>
      )}
    </div>
  );
}
