"use client";

import * as React from "react";
import { DataTable } from "@/components/data-table/data-table";
import { DataTablePagination } from "@/components/data-table/data-table-pagination";
import { DataTableViewOptions } from "@/components/data-table/data-table-view-options";
import { useDataTableInstance } from "@/hooks/use-data-table-instance";
import { useBulkOperations } from "@/hooks/use-bulk-operations";
import { columns, type ProjectRow } from "./projects-table-columns";
import { ProjectsToolbar } from "./projects-toolbar";
import { BulkActionToolbar, projectBulkActions } from "@/components/bulk/bulk-action-toolbar";
import { BulkConfirmationDialog } from "@/components/bulk/bulk-confirmation-dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";

interface ProjectsDataTableWithBulkProps {
  data: ProjectRow[];
  leadStrategists: { id: string; fullName: string }[];
}

export function ProjectsDataTableWithBulk({
  data,
  leadStrategists,
}: ProjectsDataTableWithBulkProps) {
  const router = useRouter();
  const [confirmDialog, setConfirmDialog] = React.useState<{
    open: boolean;
    operation: "updateStatus" | "assignLead" | "delete";
    title: string;
    description: string;
  }>({
    open: false,
    operation: "updateStatus",
    title: "",
    description: "",
  });

  // Bulk operations hook
  const {
    selectedIds,
    selectedItems,
    selectedCount,
    isSelected,
    isAllSelected,
    isIndeterminate,
    isProcessing,
    toggleSelection,
    toggleAll,
    clearSelection,
    executeBulkOperation,
  } = useBulkOperations<ProjectRow>(data, {
    onSuccess: () => {
      setConfirmDialog({ ...confirmDialog, open: false });
      router.refresh();
    },
  });

  // Define columns with checkbox
  const columnsWithCheckbox: ColumnDef<ProjectRow>[] = React.useMemo(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={isAllSelected}
            onCheckedChange={toggleAll}
            aria-label="Select all"
            className="translate-y-[2px]"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={isSelected(row.original.id)}
            onCheckedChange={() => toggleSelection(row.original.id)}
            aria-label="Select row"
            className="translate-y-[2px]"
          />
        ),
        enableSorting: false,
        enableHiding: false,
      },
      ...columns,
    ],
    [isAllSelected, isSelected, toggleAll, toggleSelection, columns]
  );

  // Create table instance
  const table = useDataTableInstance({
    data,
    columns: columnsWithCheckbox,
    getRowId: (row) => row.id,
  });

  // Bulk action handlers
  const handleUpdateStatus = () => {
    setConfirmDialog({
      open: true,
      operation: "updateStatus",
      title: "Update Project Status",
      description: `Update the status for ${selectedCount} selected project${selectedCount === 1 ? "" : "s"}.`,
    });
  };

  const handleAssignLead = () => {
    setConfirmDialog({
      open: true,
      operation: "assignLead",
      title: "Assign Lead Strategist",
      description: `Assign a lead strategist to ${selectedCount} selected project${selectedCount === 1 ? "" : "s"}.`,
    });
  };

  const handleDelete = () => {
    setConfirmDialog({
      open: true,
      operation: "delete",
      title: "Archive Projects",
      description: `Archive ${selectedCount} selected project${selectedCount === 1 ? "" : "s"}? They can be restored later.`,
    });
  };

  // Execute bulk operation
  const handleConfirm = async (data?: any) => {
    await executeBulkOperation(
      "/api/bulk/projects",
      confirmDialog.operation,
      data
    );
  };

  // Get selected items with names for confirmation dialog
  const selectedItemsWithNames = selectedItems.map((item) => ({
    id: item.id,
    name: item.projectName,
  }));

  return (
    <div className="space-y-4">
      {/* Bulk Action Toolbar */}
      <BulkActionToolbar
        selectedCount={selectedCount}
        onClearSelection={clearSelection}
        actions={[
          projectBulkActions.updateStatus(handleUpdateStatus),
          projectBulkActions.assignLead(handleAssignLead),
          projectBulkActions.delete(handleDelete),
        ]}
      />

      {/* Toolbar with Filters and Search */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex-1">
          <ProjectsToolbar table={table} />
        </div>
        <DataTableViewOptions table={table} />
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-lg border">
        <DataTable table={table} columns={columnsWithCheckbox} />
      </div>

      {/* Pagination */}
      <DataTablePagination table={table} />

      {/* Confirmation Dialog */}
      <BulkConfirmationDialog
        open={confirmDialog.open}
        onOpenChange={(open) =>
          setConfirmDialog({ ...confirmDialog, open })
        }
        title={confirmDialog.title}
        description={confirmDialog.description}
        operation={confirmDialog.operation}
        selectedCount={selectedCount}
        selectedItems={selectedItemsWithNames}
        onConfirm={handleConfirm}
        isProcessing={isProcessing}
        availableLeads={leadStrategists}
      />
    </div>
  );
}
