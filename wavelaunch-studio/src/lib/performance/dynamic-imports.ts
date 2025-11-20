/**
 * Dynamic Import Utilities
 *
 * Helper functions for lazy loading heavy components
 */

import dynamic from "next/dynamic";
import { ComponentType } from "react";
import {
  PageLoader,
  ChartLoader,
  DialogLoader,
  MinimalLoader,
} from "@/components/performance/lazy-wrapper";

/**
 * Lazy load a component with custom loading state
 */
export function lazyLoad<P extends object>(
  importFn: () => Promise<{ default: ComponentType<P> }>,
  options?: {
    loading?: ComponentType;
    ssr?: boolean;
  }
) {
  return dynamic(importFn, {
    loading: options?.loading || PageLoader,
    ssr: options?.ssr ?? true,
  });
}

/**
 * Lazy load a chart component
 */
export function lazyLoadChart<P extends object>(
  importFn: () => Promise<{ default: ComponentType<P> }>
) {
  return dynamic(importFn, {
    loading: ChartLoader,
    ssr: false, // Charts usually don't need SSR
  });
}

/**
 * Lazy load a dialog/modal component
 */
export function lazyLoadDialog<P extends object>(
  importFn: () => Promise<{ default: ComponentType<P> }>
) {
  return dynamic(importFn, {
    loading: DialogLoader,
    ssr: false, // Dialogs are client-side only
  });
}

/**
 * Lazy load a minimal component (no loading state)
 */
export function lazyLoadMinimal<P extends object>(
  importFn: () => Promise<{ default: ComponentType<P> }>
) {
  return dynamic(importFn, {
    loading: MinimalLoader,
    ssr: false,
  });
}

/**
 * Preload a component (useful for critical paths)
 */
export async function preloadComponent<T>(
  importFn: () => Promise<T>
): Promise<T> {
  return importFn();
}

/**
 * Lazy load with retry logic
 */
export function lazyLoadWithRetry<P extends object>(
  importFn: () => Promise<{ default: ComponentType<P> }>,
  options?: {
    loading?: ComponentType;
    maxRetries?: number;
  }
) {
  const maxRetries = options?.maxRetries || 3;

  const retryImport = async (
    retriesLeft: number
  ): Promise<{ default: ComponentType<P> }> => {
    try {
      return await importFn();
    } catch (error) {
      if (retriesLeft > 0) {
        // Wait a bit before retrying
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return retryImport(retriesLeft - 1);
      }
      throw error;
    }
  };

  return dynamic(() => retryImport(maxRetries), {
    loading: options?.loading || PageLoader,
    ssr: false,
  });
}

// Commonly lazy-loaded components

/**
 * Lazy load rich text editor
 */
export const LazyRichTextEditor = lazyLoadMinimal(
  () => import("@/components/editors/rich-text-editor")
);

/**
 * Lazy load code editor
 */
export const LazyCodeEditor = lazyLoadMinimal(
  () => import("@/components/editors/code-editor")
);

/**
 * Lazy load file uploader
 */
export const LazyFileUploader = lazyLoadDialog(
  () => import("@/components/upload/file-uploader")
);

/**
 * Lazy load image editor
 */
export const LazyImageEditor = lazyLoadDialog(
  () => import("@/components/editors/image-editor")
);

/**
 * Lazy load calendar/date picker
 */
export const LazyCalendar = lazyLoadMinimal(
  () => import("@/components/ui/calendar")
);

/**
 * Lazy load data table
 */
export const LazyDataTable = lazyLoad(
  () => import("@/components/data-table/data-table")
);
