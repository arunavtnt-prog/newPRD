"use client";

import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  FolderKanban,
  Users,
  FileText,
  CheckSquare,
  Calendar,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface SearchResultItemProps {
  type: "project" | "user" | "file" | "approval";
  item: any;
  query: string;
  onSelect: () => void;
}

export function SearchResultItem({ type, item, query, onSelect }: SearchResultItemProps) {
  const getProjectUrl = (id: string) => `/dashboard/projects/${id}`;
  const getUserUrl = (id: string) => `/dashboard/team`; // Could be user profile page
  const getFileUrl = (projectId: string) => `/dashboard/projects/${projectId}?tab=files`;
  const getApprovalUrl = (id: string) => `/dashboard/projects/${item.project?.id}?tab=approvals`;

  const renderProject = () => (
    <Link
      href={getProjectUrl(item.id)}
      onClick={onSelect}
      className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent transition-colors group"
    >
      <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
        <FolderKanban className="h-4 w-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium truncate group-hover:text-primary">{item.projectName}</p>
        <p className="text-sm text-muted-foreground">{item.creatorName} · {item.category}</p>
        <div className="flex items-center gap-2 mt-1">
          <Badge variant="outline" className="text-xs">
            {item.status.replace("_", " ")}
          </Badge>
          {item.leadStrategist && (
            <span className="text-xs text-muted-foreground">
              Lead: {item.leadStrategist.fullName}
            </span>
          )}
        </div>
      </div>
    </Link>
  );

  const renderUser = () => (
    <Link
      href={getUserUrl(item.id)}
      onClick={onSelect}
      className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent transition-colors group"
    >
      <Avatar className="h-10 w-10">
        <AvatarImage src={item.avatarUrl || undefined} />
        <AvatarFallback>
          {item.fullName.split(" ").map((n: string) => n[0]).join("")}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <p className="font-medium truncate group-hover:text-primary">{item.fullName}</p>
        <p className="text-sm text-muted-foreground truncate">{item.email}</p>
        <div className="flex items-center gap-2 mt-1">
          <Badge variant="outline" className="text-xs">
            {item.role.replace("_", " ")}
          </Badge>
          {item.department && (
            <span className="text-xs text-muted-foreground">{item.department}</span>
          )}
        </div>
      </div>
    </Link>
  );

  const renderFile = () => (
    <Link
      href={getFileUrl(item.project?.id)}
      onClick={onSelect}
      className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent transition-colors group"
    >
      <div className="p-2 rounded-lg bg-cyan-100 dark:bg-cyan-950 text-cyan-600 dark:text-cyan-400">
        <FileText className="h-4 w-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium truncate group-hover:text-primary">{item.originalFilename}</p>
        <p className="text-sm text-muted-foreground">
          {item.project?.projectName || "Unknown Project"} · {item.folder}
        </p>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs text-muted-foreground">
            {formatFileSize(item.fileSize)}
          </span>
          <span>·</span>
          <span className="text-xs text-muted-foreground">
            {format(new Date(item.createdAt), "MMM d, yyyy")}
          </span>
        </div>
      </div>
    </Link>
  );

  const renderApproval = () => (
    <Link
      href={getApprovalUrl(item.id)}
      onClick={onSelect}
      className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent transition-colors group"
    >
      <div className={cn(
        "p-2 rounded-lg",
        item.status === "PENDING" && "bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400",
        item.status === "APPROVED" && "bg-green-100 dark:bg-green-950 text-green-600 dark:text-green-400",
        item.status === "CHANGES_REQUESTED" && "bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400"
      )}>
        <CheckSquare className="h-4 w-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium truncate group-hover:text-primary">
          {item.message || "Approval Request"}
        </p>
        <p className="text-sm text-muted-foreground">{item.project?.projectName}</p>
        <div className="flex items-center gap-2 mt-1">
          <Badge variant="outline" className="text-xs">
            {item.status.replace("_", " ")}
          </Badge>
          {item.dueDate && (
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              Due {format(new Date(item.dueDate), "MMM d")}
            </span>
          )}
        </div>
      </div>
    </Link>
  );

  switch (type) {
    case "project":
      return renderProject();
    case "user":
      return renderUser();
    case "file":
      return renderFile();
    case "approval":
      return renderApproval();
    default:
      return null;
  }
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}
