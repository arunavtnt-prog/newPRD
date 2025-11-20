/**
 * Projects Data Table (Client Component)
 *
 * Wrapper for DataTable that creates the table instance
 */

"use client";

import * as React from "react";
import { DataTable } from "@/components/data-table/data-table";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { DataTableViewOptions } from "@/components/data-table/data-table-view-options";
import { useDataTableInstance } from "@/hooks/use-data-table-instance";
import { columns, type ProjectRow } from "./projects-table-columns";
import { ProjectsToolbar } from "./projects-toolbar";

interface ProjectsDataTableProps {
  data: ProjectRow[];
}

export function ProjectsDataTable({ data }: ProjectsDataTableProps) {
  // Create table instance
  const table = useDataTableInstance({
    data,
    columns,
    getRowId: (row) => row.id,
  });

  return (
    <div className="space-y-4">
      {/* Toolbar with Filters and Search */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex-1">
          <ProjectsToolbar table={table} />
        </div>
        <DataTableViewOptions table={table} />
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-lg border">
        <DataTable table={table} columns={columns} />
      </div>

      {/* Pagination */}
      <DataTablePagination table={table} />
    </div>
  );
}
