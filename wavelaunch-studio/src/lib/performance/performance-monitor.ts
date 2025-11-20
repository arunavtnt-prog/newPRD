/**
 * Performance Monitoring Utilities
 */

/**
 * Measure component render time
 */
export function measureRender(componentName: string, callback: () => void) {
  if (typeof window === "undefined") return callback();

  const startTime = performance.now();
  callback();
  const endTime = performance.now();

  const duration = endTime - startTime;

  if (process.env.NODE_ENV === "development") {
    console.log(`[Performance] ${componentName} rendered in ${duration.toFixed(2)}ms`);
  }

  // Report to analytics in production
  if (typeof window !== "undefined" && (window as any).gtag) {
    (window as any).gtag("event", "timing_complete", {
      name: componentName,
      value: Math.round(duration),
      event_category: "Component Render",
    });
  }
}

/**
 * Measure async operation
 */
export async function measureAsync<T>(
  operationName: string,
  asyncFn: () => Promise<T>
): Promise<T> {
  const startTime = performance.now();

  try {
    const result = await asyncFn();
    const duration = performance.now() - startTime;

    if (process.env.NODE_ENV === "development") {
      console.log(
        `[Performance] ${operationName} completed in ${duration.toFixed(2)}ms`
      );
    }

    return result;
  } catch (error) {
    const duration = performance.now() - startTime;

    if (process.env.NODE_ENV === "development") {
      console.error(
        `[Performance] ${operationName} failed after ${duration.toFixed(2)}ms`,
        error
      );
    }

    throw error;
  }
}

/**
 * Track Core Web Vitals
 */
export function trackWebVitals() {
  if (typeof window === "undefined") return;

  // Largest Contentful Paint (LCP)
  if ("PerformanceObserver" in window) {
    try {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        const lcp = lastEntry.renderTime || lastEntry.loadTime;

        console.log("[WebVitals] LCP:", lcp);

        if ((window as any).gtag) {
          (window as any).gtag("event", "web_vitals", {
            event_category: "Web Vitals",
            event_label: "LCP",
            value: Math.round(lcp),
          });
        }
      });

      lcpObserver.observe({ type: "largest-contentful-paint", buffered: true });
    } catch (e) {
      // Ignore errors in older browsers
    }

    // First Input Delay (FID)
    try {
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          const fid = entry.processingStart - entry.startTime;

          console.log("[WebVitals] FID:", fid);

          if ((window as any).gtag) {
            (window as any).gtag("event", "web_vitals", {
              event_category: "Web Vitals",
              event_label: "FID",
              value: Math.round(fid),
            });
          }
        });
      });

      fidObserver.observe({ type: "first-input", buffered: true });
    } catch (e) {
      // Ignore errors in older browsers
    }

    // Cumulative Layout Shift (CLS)
    try {
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value;
          }
        }
      });

      clsObserver.observe({ type: "layout-shift", buffered: true });

      // Report CLS on page unload
      window.addEventListener("beforeunload", () => {
        console.log("[WebVitals] CLS:", clsValue);

        if ((window as any).gtag) {
          (window as any).gtag("event", "web_vitals", {
            event_category: "Web Vitals",
            event_label: "CLS",
            value: Math.round(clsValue * 1000), // Multiply by 1000 for better precision
          });
        }
      });
    } catch (e) {
      // Ignore errors in older browsers
    }
  }
}

/**
 * Debounce function for performance
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function for performance
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Request idle callback wrapper
 */
export function runWhenIdle(callback: () => void, timeout = 2000) {
  if (typeof window === "undefined") return callback();

  if ("requestIdleCallback" in window) {
    (window as any).requestIdleCallback(callback, { timeout });
  } else {
    setTimeout(callback, timeout);
  }
}

/**
 * Check if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Get connection quality
 */
export function getConnectionQuality():
  | "slow"
  | "medium"
  | "fast"
  | "unknown" {
  if (typeof navigator === "undefined") return "unknown";

  const connection =
    (navigator as any).connection ||
    (navigator as any).mozConnection ||
    (navigator as any).webkitConnection;

  if (!connection) return "unknown";

  const effectiveType = connection.effectiveType;

  if (effectiveType === "4g") return "fast";
  if (effectiveType === "3g") return "medium";
  return "slow";
}

/**
 * Check if user has data saver enabled
 */
export function hasDataSaver(): boolean {
  if (typeof navigator === "undefined") return false;

  const connection = (navigator as any).connection;
  return connection?.saveData === true;
}
