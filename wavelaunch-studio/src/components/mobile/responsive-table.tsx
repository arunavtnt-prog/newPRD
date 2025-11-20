"use client";

import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MobileCard } from "./mobile-card";
import { cn } from "@/lib/utils";

interface Column<T> {
  key: string;
  label: string;
  render?: (item: T) => React.ReactNode;
  className?: string;
  mobileLabel?: string; // Label for mobile card display
  hideOnMobile?: boolean; // Don't show this field in mobile cards
}

interface ResponsiveTableProps<T> {
  data: T[];
  columns: Column<T>[];
  getItemId: (item: T) => string;
  getItemHref?: (item: T) => string;
  getItemActions?: (item: T) => Array<{
    label: string;
    onClick?: () => void;
    href?: string;
    variant?: "default" | "destructive";
  }>;
  emptyMessage?: string;
  mobileCardTitle?: (item: T) => string;
  mobileCardSubtitle?: (item: T) => string;
  mobileCardBadge?: (item: T) => {
    text: string;
    variant?: "default" | "secondary" | "outline" | "destructive";
  } | undefined;
}

export function ResponsiveTable<T extends Record<string, any>>({
  data,
  columns,
  getItemId,
  getItemHref,
  getItemActions,
  emptyMessage = "No data available",
  mobileCardTitle,
  mobileCardSubtitle,
  mobileCardBadge,
}: ResponsiveTableProps<T>) {
  // Desktop table view
  const renderDesktopTable = () => (
    <div className="hidden md:block rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column.key} className={column.className}>
                {column.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="h-24 text-center text-muted-foreground"
              >
                {emptyMessage}
              </TableCell>
            </TableRow>
          ) : (
            data.map((item) => (
              <TableRow key={getItemId(item)}>
                {columns.map((column) => (
                  <TableCell key={column.key} className={column.className}>
                    {column.render
                      ? column.render(item)
                      : item[column.key]}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );

  // Mobile card view
  const renderMobileCards = () => {
    if (data.length === 0) {
      return (
        <div className="md:hidden flex flex-col items-center justify-center py-12 text-center">
          <p className="text-sm text-muted-foreground">{emptyMessage}</p>
        </div>
      );
    }

    return (
      <div className="md:hidden space-y-3">
        {data.map((item) => {
          // Build metadata from columns that aren't hidden on mobile
          const metadata = columns
            .filter((col) => !col.hideOnMobile)
            .map((col) => ({
              label: col.mobileLabel || col.label,
              value: col.render
                ? String(col.render(item) || "")
                : String(item[col.key] || ""),
            }))
            .filter((m) => m.value); // Remove empty values

          return (
            <MobileCard
              key={getItemId(item)}
              title={
                mobileCardTitle
                  ? mobileCardTitle(item)
                  : item.name || item.title || getItemId(item)
              }
              subtitle={mobileCardSubtitle ? mobileCardSubtitle(item) : undefined}
              badge={mobileCardBadge ? mobileCardBadge(item) : undefined}
              metadata={metadata}
              href={getItemHref ? getItemHref(item) : undefined}
              actions={getItemActions ? getItemActions(item) : undefined}
            />
          );
        })}
      </div>
    );
  };

  return (
    <>
      {renderDesktopTable()}
      {renderMobileCards()}
    </>
  );
}
