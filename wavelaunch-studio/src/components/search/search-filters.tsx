"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";

interface SearchFiltersProps {
  filters: {
    type?: string;
    status?: string;
    assignedTo?: string;
  };
  onUpdateFilters: (filters: any) => void;
  onClearFilters: () => void;
}

export function SearchFilters({
  filters,
  onUpdateFilters,
  onClearFilters,
}: SearchFiltersProps) {
  const hasFilters = Object.keys(filters).length > 0;

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium">Filters</h4>
        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="h-7 text-xs"
          >
            <X className="h-3 w-3 mr-1" />
            Clear All
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Type Filter */}
        <div className="space-y-2">
          <Label className="text-xs">Type</Label>
          <Select
            value={filters.type || "all"}
            onValueChange={(value) =>
              onUpdateFilters({ type: value === "all" ? undefined : value })
            }
          >
            <SelectTrigger className="h-9 text-sm">
              <SelectValue placeholder="All types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="project">Projects</SelectItem>
              <SelectItem value="user">Users</SelectItem>
              <SelectItem value="file">Files</SelectItem>
              <SelectItem value="approval">Approvals</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Status Filter */}
        <div className="space-y-2">
          <Label className="text-xs">Status</Label>
          <Select
            value={filters.status || "all"}
            onValueChange={(value) =>
              onUpdateFilters({ status: value === "all" ? undefined : value })
            }
          >
            <SelectTrigger className="h-9 text-sm">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="DISCOVERY">Discovery</SelectItem>
              <SelectItem value="BRANDING">Branding</SelectItem>
              <SelectItem value="PRODUCT_DEV">Product Dev</SelectItem>
              <SelectItem value="MANUFACTURING">Manufacturing</SelectItem>
              <SelectItem value="WEBSITE">Website</SelectItem>
              <SelectItem value="MARKETING">Marketing</SelectItem>
              <SelectItem value="LAUNCH">Launch</SelectItem>
              <SelectItem value="COMPLETED">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Future: Assigned To Filter */}
        <div className="space-y-2">
          <Label className="text-xs">Assigned To</Label>
          <Select
            value={filters.assignedTo || "all"}
            onValueChange={(value) =>
              onUpdateFilters({ assignedTo: value === "all" ? undefined : value })
            }
            disabled
          >
            <SelectTrigger className="h-9 text-sm">
              <SelectValue placeholder="Anyone" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Anyone</SelectItem>
              {/* Populate with actual users */}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
