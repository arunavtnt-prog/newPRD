/**
 * Mobile Hook Tests
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useIsMobile, useScreenSize, useHasTouch } from '@/hooks/use-mobile';

describe('useIsMobile', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns false for desktop width', () => {
    global.innerWidth = 1024;
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(false);
  });

  it('returns true for mobile width', () => {
    global.innerWidth = 375;
    const { result } = renderHook(() => useIsMobile());

    // Trigger resize event
    act(() => {
      global.dispatchEvent(new Event('resize'));
    });

    expect(result.current).toBe(true);
  });

  it('updates on window resize', () => {
    global.innerWidth = 1024;
    const { result, rerender } = renderHook(() => useIsMobile());

    expect(result.current).toBe(false);

    // Change width and trigger resize
    global.innerWidth = 375;
    act(() => {
      global.dispatchEvent(new Event('resize'));
    });
    rerender();

    expect(result.current).toBe(true);
  });
});

describe('useScreenSize', () => {
  it('returns "desktop" for large screens', () => {
    global.innerWidth = 1920;
    const { result } = renderHook(() => useScreenSize());

    act(() => {
      global.dispatchEvent(new Event('resize'));
    });

    expect(result.current).toBe('desktop');
  });

  it('returns "tablet" for medium screens', () => {
    global.innerWidth = 800;
    const { result } = renderHook(() => useScreenSize());

    act(() => {
      global.dispatchEvent(new Event('resize'));
    });

    expect(result.current).toBe('tablet');
  });

  it('returns "mobile" for small screens', () => {
    global.innerWidth = 375;
    const { result } = renderHook(() => useScreenSize());

    act(() => {
      global.dispatchEvent(new Event('resize'));
    });

    expect(result.current).toBe('mobile');
  });
});

describe('useHasTouch', () => {
  it('returns true when touch is supported', () => {
    Object.defineProperty(window, 'ontouchstart', {
      value: {},
      writable: true,
    });

    const { result } = renderHook(() => useHasTouch());
    expect(result.current).toBe(true);
  });

  it('returns false when touch is not supported', () => {
    Object.defineProperty(window, 'ontouchstart', {
      value: undefined,
      writable: true,
    });
    Object.defineProperty(navigator, 'maxTouchPoints', {
      value: 0,
      writable: true,
    });

    const { result } = renderHook(() => useHasTouch());
    expect(result.current).toBe(false);
  });
});
