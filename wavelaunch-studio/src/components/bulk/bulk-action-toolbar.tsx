"use client";

import * as React from "react";
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
  CheckCircle,
  XCircle,
  Trash2,
  UserPlus,
  ChevronDown,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface BulkActionToolbarProps {
  selectedCount: number;
  onClearSelection: () => void;
  actions?: BulkAction[];
  className?: string;
}

export interface BulkAction {
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  onClick: () => void;
  variant?: "default" | "destructive" | "success";
  disabled?: boolean;
}

export function BulkActionToolbar({
  selectedCount,
  onClearSelection,
  actions = [],
  className,
}: BulkActionToolbarProps) {
  if (selectedCount === 0) return null;

  return (
    <div
      className={cn(
        "flex items-center gap-3 p-3 bg-primary/5 border-b border-primary/20",
        className
      )}
    >
      <Badge variant="secondary" className="font-medium">
        {selectedCount} {selectedCount === 1 ? "item" : "items"} selected
      </Badge>

      <div className="flex-1 flex items-center gap-2">
        {actions.map((action, index) => (
          <Button
            key={index}
            variant={
              action.variant === "destructive"
                ? "destructive"
                : action.variant === "success"
                ? "default"
                : "outline"
            }
            size="sm"
            onClick={action.onClick}
            disabled={action.disabled}
            className={cn(
              action.variant === "success" &&
                "bg-green-600 hover:bg-green-700 text-white"
            )}
          >
            {action.icon && <action.icon className="h-4 w-4 mr-2" />}
            {action.label}
          </Button>
        ))}
      </div>

      <Button
        variant="ghost"
        size="sm"
        onClick={onClearSelection}
        className="ml-auto"
      >
        <X className="h-4 w-4 mr-1" />
        Clear
      </Button>
    </div>
  );
}

// Predefined bulk actions for common use cases
export const projectBulkActions = {
  updateStatus: (onClick: () => void): BulkAction => ({
    label: "Update Status",
    icon: CheckCircle,
    onClick,
    variant: "default",
  }),
  assignLead: (onClick: () => void): BulkAction => ({
    label: "Assign Lead",
    icon: UserPlus,
    onClick,
    variant: "default",
  }),
  delete: (onClick: () => void): BulkAction => ({
    label: "Archive",
    icon: Trash2,
    onClick,
    variant: "destructive",
  }),
};

export const approvalBulkActions = {
  approve: (onClick: () => void): BulkAction => ({
    label: "Approve All",
    icon: CheckCircle,
    onClick,
    variant: "success",
  }),
  reject: (onClick: () => void): BulkAction => ({
    label: "Request Changes",
    icon: XCircle,
    onClick,
    variant: "destructive",
  }),
};
