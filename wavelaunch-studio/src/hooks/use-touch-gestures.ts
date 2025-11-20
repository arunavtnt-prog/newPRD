/**
 * Touch Gesture Hooks
 */

import * as React from "react";

interface SwipeHandlers {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
}

interface SwipeConfig {
  threshold?: number; // Minimum distance for swipe (default: 50)
  velocity?: number; // Minimum velocity for swipe (default: 0.3)
}

/**
 * Hook for detecting swipe gestures
 */
export function useSwipe(handlers: SwipeHandlers, config: SwipeConfig = {}) {
  const threshold = config.threshold ?? 50;
  const velocityThreshold = config.velocity ?? 0.3;

  const touchStart = React.useRef<{ x: number; y: number; time: number } | null>(null);

  const onTouchStart = React.useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStart.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now(),
    };
  }, []);

  const onTouchEnd = React.useCallback(
    (e: React.TouchEvent) => {
      if (!touchStart.current) return;

      const touch = e.changedTouches[0];
      const deltaX = touch.clientX - touchStart.current.x;
      const deltaY = touch.clientY - touchStart.current.y;
      const deltaTime = Date.now() - touchStart.current.time;

      const velocityX = Math.abs(deltaX) / deltaTime;
      const velocityY = Math.abs(deltaY) / deltaTime;

      // Horizontal swipe
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > threshold) {
        if (velocityX > velocityThreshold) {
          if (deltaX > 0) {
            handlers.onSwipeRight?.();
          } else {
            handlers.onSwipeLeft?.();
          }
        }
      }
      // Vertical swipe
      else if (Math.abs(deltaY) > threshold) {
        if (velocityY > velocityThreshold) {
          if (deltaY > 0) {
            handlers.onSwipeDown?.();
          } else {
            handlers.onSwipeUp?.();
          }
        }
      }

      touchStart.current = null;
    },
    [handlers, threshold, velocityThreshold]
  );

  return { onTouchStart, onTouchEnd };
}

interface LongPressConfig {
  duration?: number; // Duration in ms (default: 500)
  threshold?: number; // Movement threshold in px (default: 10)
}

/**
 * Hook for detecting long press gestures
 */
export function useLongPress(
  onLongPress: () => void,
  config: LongPressConfig = {}
) {
  const duration = config.duration ?? 500;
  const threshold = config.threshold ?? 10;

  const timerRef = React.useRef<NodeJS.Timeout | null>(null);
  const startPos = React.useRef<{ x: number; y: number } | null>(null);

  const start = React.useCallback(
    (e: React.TouchEvent | React.MouseEvent) => {
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

      startPos.current = { x: clientX, y: clientY };

      timerRef.current = setTimeout(() => {
        onLongPress();
        timerRef.current = null;
      }, duration);
    },
    [onLongPress, duration]
  );

  const cancel = React.useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    startPos.current = null;
  }, []);

  const move = React.useCallback(
    (e: React.TouchEvent | React.MouseEvent) => {
      if (!startPos.current || !timerRef.current) return;

      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

      const deltaX = Math.abs(clientX - startPos.current.x);
      const deltaY = Math.abs(clientY - startPos.current.y);

      // Cancel if moved too much
      if (deltaX > threshold || deltaY > threshold) {
        cancel();
      }
    },
    [threshold, cancel]
  );

  React.useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return {
    onTouchStart: start,
    onTouchEnd: cancel,
    onTouchMove: move,
    onMouseDown: start,
    onMouseUp: cancel,
    onMouseMove: move,
    onMouseLeave: cancel,
  };
}

/**
 * Hook for pull-to-refresh gesture
 */
export function usePullToRefresh(
  onRefresh: () => void | Promise<void>,
  config: { threshold?: number; disabled?: boolean } = {}
) {
  const threshold = config.threshold ?? 80;
  const disabled = config.disabled ?? false;

  const [isPulling, setIsPulling] = React.useState(false);
  const [pullDistance, setPullDistance] = React.useState(0);
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  const touchStart = React.useRef<number>(0);
  const scrollTop = React.useRef<number>(0);

  const onTouchStart = React.useCallback((e: React.TouchEvent) => {
    if (disabled) return;
    scrollTop.current = window.scrollY || document.documentElement.scrollTop;
    touchStart.current = e.touches[0].clientY;
  }, [disabled]);

  const onTouchMove = React.useCallback(
    (e: React.TouchEvent) => {
      if (disabled || scrollTop.current > 0) return;

      const touchY = e.touches[0].clientY;
      const distance = touchY - touchStart.current;

      if (distance > 0) {
        setIsPulling(true);
        setPullDistance(Math.min(distance, threshold * 1.5));
      }
    },
    [disabled, threshold]
  );

  const onTouchEnd = React.useCallback(async () => {
    if (disabled) return;

    if (pullDistance >= threshold && !isRefreshing) {
      setIsRefreshing(true);
      try {
        await onRefresh();
      } finally {
        setIsRefreshing(false);
      }
    }

    setIsPulling(false);
    setPullDistance(0);
  }, [pullDistance, threshold, isRefreshing, onRefresh, disabled]);

  return {
    isPulling,
    pullDistance,
    isRefreshing,
    handlers: disabled
      ? {}
      : {
          onTouchStart,
          onTouchMove,
          onTouchEnd,
        },
  };
}

/**
 * Hook for detecting tap gestures (to distinguish from scroll)
 */
export function useTap(
  onTap: () => void,
  config: { threshold?: number } = {}
) {
  const threshold = config.threshold ?? 10;
  const startPos = React.useRef<{ x: number; y: number } | null>(null);

  const onTouchStart = React.useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    startPos.current = { x: touch.clientX, y: touch.clientY };
  }, []);

  const onTouchEnd = React.useCallback(
    (e: React.TouchEvent) => {
      if (!startPos.current) return;

      const touch = e.changedTouches[0];
      const deltaX = Math.abs(touch.clientX - startPos.current.x);
      const deltaY = Math.abs(touch.clientY - startPos.current.y);

      // If movement is minimal, consider it a tap
      if (deltaX < threshold && deltaY < threshold) {
        onTap();
      }

      startPos.current = null;
    },
    [onTap, threshold]
  );

  return { onTouchStart, onTouchEnd };
}
