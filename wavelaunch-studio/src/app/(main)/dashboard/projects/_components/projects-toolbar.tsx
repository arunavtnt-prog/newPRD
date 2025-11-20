/**
 * Projects Table Toolbar
 *
 * Provides filtering and search for projects table
 */

"use client";

import * as React from "react";
import { Table } from "@tanstack/react-table";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface ProjectsToolbarProps<TData> {
  table: Table<TData>;
}

export function ProjectsToolbar<TData>({ table }: ProjectsToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-2">
        {/* Search */}
        <div className="flex flex-1 items-center gap-2">
          <Input
            placeholder="Search projects..."
            value={(table.getColumn("projectName")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("projectName")?.setFilterValue(event.target.value)
            }
            className="h-9 w-[250px]"
          />

          {/* Status Filter */}
          <Select
            value={
              (table.getColumn("status")?.getFilterValue() as string) ?? "all"
            }
            onValueChange={(value) =>
              table
                .getColumn("status")
                ?.setFilterValue(value === "all" ? "" : value)
            }
          >
            <SelectTrigger className="h-9 w-[180px]">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="ONBOARDING">Onboarding</SelectItem>
              <SelectItem value="DISCOVERY">Discovery</SelectItem>
              <SelectItem value="BRANDING">Branding</SelectItem>
              <SelectItem value="PRODUCT_DEV">Product Development</SelectItem>
              <SelectItem value="MANUFACTURING">Manufacturing</SelectItem>
              <SelectItem value="WEBSITE">Website</SelectItem>
              <SelectItem value="MARKETING">Marketing</SelectItem>
              <SelectItem value="LAUNCH">Launch</SelectItem>
              <SelectItem value="COMPLETED">Completed</SelectItem>
              <SelectItem value="ARCHIVED">Archived</SelectItem>
            </SelectContent>
          </Select>

          {/* Category Filter */}
          <Select
            value={
              (table.getColumn("category")?.getFilterValue() as string) ?? "all"
            }
            onValueChange={(value) =>
              table
                .getColumn("category")
                ?.setFilterValue(value === "all" ? "" : value)
            }
          >
            <SelectTrigger className="h-9 w-[160px]">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="FASHION">Fashion</SelectItem>
              <SelectItem value="BEAUTY">Beauty</SelectItem>
              <SelectItem value="FITNESS">Fitness</SelectItem>
              <SelectItem value="LIFESTYLE">Lifestyle</SelectItem>
              <SelectItem value="OTHER">Other</SelectItem>
            </SelectContent>
          </Select>

          {/* Clear Filters */}
          {isFiltered && (
            <Button
              variant="ghost"
              onClick={() => table.resetColumnFilters()}
              className="h-9 px-2 lg:px-3"
            >
              Reset
              <X className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Active Filters */}
      {isFiltered && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          {table
            .getState()
            .columnFilters.map((filter) => {
              const column = table.getColumn(filter.id);
              if (!column) return null;

              return (
                <Badge key={filter.id} variant="secondary" className="gap-1">
                  {filter.id}: {String(filter.value)}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => column.setFilterValue(undefined)}
                  />
                </Badge>
              );
            })}
        </div>
      )}
    </div>
  );
}
