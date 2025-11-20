/**
 * Mobile Device Detection Hooks
 */

import * as React from "react";

const MOBILE_BREAKPOINT = 768;
const TABLET_BREAKPOINT = 1024;

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined);

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    mql.addEventListener("change", onChange);
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return !!isMobile;
}

/**
 * Detect if device is tablet (between mobile and desktop)
 */
export function useIsTablet() {
  const [isTablet, setIsTablet] = React.useState(false);

  React.useEffect(() => {
    const checkIsTablet = () => {
      const width = window.innerWidth;
      setIsTablet(width >= MOBILE_BREAKPOINT && width < TABLET_BREAKPOINT);
    };

    checkIsTablet();
    window.addEventListener("resize", checkIsTablet);

    return () => window.removeEventListener("resize", checkIsTablet);
  }, []);

  return isTablet;
}

/**
 * Get current screen size category
 */
export function useScreenSize() {
  const [screenSize, setScreenSize] = React.useState<
    "mobile" | "tablet" | "desktop"
  >("desktop");

  React.useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      if (width < MOBILE_BREAKPOINT) {
        setScreenSize("mobile");
      } else if (width < TABLET_BREAKPOINT) {
        setScreenSize("tablet");
      } else {
        setScreenSize("desktop");
      }
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  return screenSize;
}

/**
 * Detect if device has touch support
 */
export function useHasTouch() {
  const [hasTouch, setHasTouch] = React.useState(false);

  React.useEffect(() => {
    setHasTouch(
      "ontouchstart" in window ||
        navigator.maxTouchPoints > 0 ||
        (navigator as any).msMaxTouchPoints > 0
    );
  }, []);

  return hasTouch;
}

/**
 * Get viewport dimensions
 */
export function useViewport() {
  const [viewport, setViewport] = React.useState({
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    height: typeof window !== "undefined" ? window.innerHeight : 0,
  });

  React.useEffect(() => {
    const handleResize = () => {
      setViewport({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return viewport;
}

/**
 * Detect device orientation
 */
export function useOrientation() {
  const [orientation, setOrientation] = React.useState<
    "portrait" | "landscape"
  >("portrait");

  React.useEffect(() => {
    const handleOrientationChange = () => {
      setOrientation(
        window.innerHeight > window.innerWidth ? "portrait" : "landscape"
      );
    };

    handleOrientationChange();
    window.addEventListener("resize", handleOrientationChange);

    return () => window.removeEventListener("resize", handleOrientationChange);
  }, []);

  return orientation;
}

/**
 * Responsive value based on screen size
 */
export function useResponsiveValue<T>(values: {
  mobile?: T;
  tablet?: T;
  desktop: T;
}): T {
  const screenSize = useScreenSize();

  if (screenSize === "mobile" && values.mobile !== undefined) {
    return values.mobile;
  }

  if (screenSize === "tablet" && values.tablet !== undefined) {
    return values.tablet;
  }

  return values.desktop;
}
