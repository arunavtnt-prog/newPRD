"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";

interface LazyWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  className?: string;
}

/**
 * Wrapper component for lazy-loaded content with Suspense
 */
export function LazyWrapper({
  children,
  fallback,
  className,
}: LazyWrapperProps) {
  const defaultFallback = (
    <div className="flex items-center justify-center py-12">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
    </div>
  );

  return (
    <React.Suspense fallback={fallback || defaultFallback}>
      <div className={className}>{children}</div>
    </React.Suspense>
  );
}

/**
 * Minimal loading fallback
 */
export function MinimalLoader() {
  return (
    <div className="flex items-center justify-center p-4">
      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
    </div>
  );
}

/**
 * Full page loading fallback
 */
export function PageLoader() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
      <p className="text-sm text-muted-foreground">Loading...</p>
    </div>
  );
}

/**
 * Chart loading fallback
 */
export function ChartLoader() {
  return (
    <div className="flex items-center justify-center h-[300px] border rounded-lg bg-muted/10">
      <div className="text-center space-y-2">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mx-auto" />
        <p className="text-sm text-muted-foreground">Loading chart...</p>
      </div>
    </div>
  );
}

/**
 * Dialog/Modal loading fallback
 */
export function DialogLoader() {
  return (
    <div className="flex items-center justify-center p-8">
      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
    </div>
  );
}
