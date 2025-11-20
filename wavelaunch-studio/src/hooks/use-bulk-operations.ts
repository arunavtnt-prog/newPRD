"use client";

import * as React from "react";
import { toast } from "sonner";

interface BulkOperationOptions {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export function useBulkOperations<T extends { id: string }>(
  items: T[],
  options?: BulkOperationOptions
) {
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set());
  const [isProcessing, setIsProcessing] = React.useState(false);

  const selectedItems = React.useMemo(
    () => items.filter((item) => selectedIds.has(item.id)),
    [items, selectedIds]
  );

  const toggleSelection = React.useCallback((id: string) => {
    setSelectedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }, []);

  const toggleAll = React.useCallback(() => {
    if (selectedIds.size === items.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(items.map((item) => item.id)));
    }
  }, [items, selectedIds.size]);

  const clearSelection = React.useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  const isSelected = React.useCallback(
    (id: string) => selectedIds.has(id),
    [selectedIds]
  );

  const isAllSelected = items.length > 0 && selectedIds.size === items.length;
  const isIndeterminate = selectedIds.size > 0 && selectedIds.size < items.length;

  const executeBulkOperation = React.useCallback(
    async (endpoint: string, operation: string, data?: any) => {
      if (selectedIds.size === 0) {
        toast.error("No items selected");
        return false;
      }

      setIsProcessing(true);

      try {
        const response = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            operation,
            [endpoint.includes("projects") ? "projectIds" : "approvalIds"]:
              Array.from(selectedIds),
            data,
          }),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "Operation failed");
        }

        toast.success(result.message || "Operation completed successfully");
        clearSelection();
        options?.onSuccess?.();
        return true;
      } catch (error: any) {
        const errorMessage = error.message || "Operation failed";
        toast.error(errorMessage);
        options?.onError?.(errorMessage);
        return false;
      } finally {
        setIsProcessing(false);
      }
    },
    [selectedIds, clearSelection, options]
  );

  return {
    selectedIds: Array.from(selectedIds),
    selectedItems,
    selectedCount: selectedIds.size,
    isSelected,
    isAllSelected,
    isIndeterminate,
    isProcessing,
    toggleSelection,
    toggleAll,
    clearSelection,
    executeBulkOperation,
  };
}
