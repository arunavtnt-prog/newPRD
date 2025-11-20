"use client";

import * as React from "react";
import Image, { ImageProps } from "next/image";
import { cn } from "@/lib/utils";

interface LazyImageProps extends Omit<ImageProps, "onLoad"> {
  fallbackSrc?: string;
  wrapperClassName?: string;
  onLoad?: () => void;
}

/**
 * Lazy-loaded image with blur placeholder and intersection observer
 */
export function LazyImage({
  src,
  alt,
  fallbackSrc = "/images/placeholder.png",
  wrapperClassName,
  className,
  onLoad,
  ...props
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [error, setError] = React.useState(false);
  const imgRef = React.useRef<HTMLDivElement>(null);
  const [inView, setInView] = React.useState(false);

  React.useEffect(() => {
    if (!imgRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: "50px", // Start loading 50px before image comes into view
      }
    );

    observer.observe(imgRef.current);

    return () => observer.disconnect();
  }, []);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setError(true);
  };

  return (
    <div ref={imgRef} className={cn("relative overflow-hidden", wrapperClassName)}>
      {inView && (
        <Image
          src={error ? fallbackSrc : src}
          alt={alt}
          className={cn(
            "transition-opacity duration-300",
            isLoaded ? "opacity-100" : "opacity-0",
            className
          )}
          onLoad={handleLoad}
          onError={handleError}
          {...props}
        />
      )}
      {!isLoaded && (
        <div className="absolute inset-0 bg-muted animate-pulse" />
      )}
    </div>
  );
}

interface LazyBackgroundImageProps {
  src: string;
  alt?: string;
  className?: string;
  children?: React.ReactNode;
}

/**
 * Lazy-loaded background image
 */
export function LazyBackgroundImage({
  src,
  alt,
  className,
  children,
}: LazyBackgroundImageProps) {
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [inView, setInView] = React.useState(false);
  const divRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!divRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: "50px",
      }
    );

    observer.observe(divRef.current);

    return () => observer.disconnect();
  }, []);

  React.useEffect(() => {
    if (!inView) return;

    const img = new window.Image();
    img.src = src;
    img.onload = () => setIsLoaded(true);
  }, [inView, src]);

  return (
    <div
      ref={divRef}
      className={cn(
        "relative bg-cover bg-center bg-no-repeat transition-opacity duration-300",
        !isLoaded && "bg-muted animate-pulse",
        className
      )}
      style={isLoaded ? { backgroundImage: `url(${src})` } : undefined}
      role={alt ? "img" : undefined}
      aria-label={alt}
    >
      {children}
    </div>
  );
}

interface LazyAvatarProps {
  src?: string | null;
  alt: string;
  fallback: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

/**
 * Lazy-loaded avatar with fallback
 */
export function LazyAvatar({
  src,
  alt,
  fallback,
  size = "md",
  className,
}: LazyAvatarProps) {
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [error, setError] = React.useState(false);

  const sizeClasses = {
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-12 w-12 text-base",
  };

  if (!src || error) {
    return (
      <div
        className={cn(
          "flex items-center justify-center rounded-full bg-primary text-primary-foreground font-medium",
          sizeClasses[size],
          className
        )}
      >
        {fallback}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative rounded-full overflow-hidden",
        sizeClasses[size],
        className
      )}
    >
      <Image
        src={src}
        alt={alt}
        fill
        className={cn(
          "object-cover transition-opacity duration-300",
          isLoaded ? "opacity-100" : "opacity-0"
        )}
        onLoad={() => setIsLoaded(true)}
        onError={() => setError(true)}
      />
      {!isLoaded && (
        <div className="absolute inset-0 bg-muted animate-pulse" />
      )}
    </div>
  );
}
