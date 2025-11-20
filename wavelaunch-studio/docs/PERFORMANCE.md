# Performance Optimization Guide

This guide covers performance optimizations implemented in WaveLaunch Studio.

## 📦 Code Splitting & Lazy Loading

### Dynamic Imports

Use dynamic imports to lazy load heavy components:

```typescript
import { lazyLoad, lazyLoadChart, lazyLoadDialog } from "@/lib/performance/dynamic-imports";

// Lazy load a page component
const LazyDashboard = lazyLoad(() => import("./dashboard"));

// Lazy load a chart
const LazyAnalyticsChart = lazyLoadChart(() => import("./analytics-chart"));

// Lazy load a dialog
const LazyCreateProjectDialog = lazyLoadDialog(() => import("./create-project-dialog"));
```

### Lazy Wrapper with Suspense

Wrap lazy-loaded content with Suspense boundaries:

```typescript
import { LazyWrapper, ChartLoader } from "@/components/performance/lazy-wrapper";

function MyComponent() {
  return (
    <LazyWrapper fallback={<ChartLoader />}>
      <HeavyChartComponent />
    </LazyWrapper>
  );
}
```

### Pre-built Lazy Components

```typescript
import {
  LazyRichTextEditor,
  LazyCodeEditor,
  LazyFileUploader,
  LazyImageEditor,
  LazyCalendar,
  LazyDataTable,
} from "@/lib/performance/dynamic-imports";

// Use like regular components
<LazyRichTextEditor value={content} onChange={setContent} />
```

## 🖼️ Image Optimization

### Lazy Images

Use intersection observer for lazy loading:

```typescript
import { LazyImage } from "@/components/performance/lazy-image";

<LazyImage
  src="/images/hero.jpg"
  alt="Hero image"
  width={1200}
  height={600}
  fallbackSrc="/images/placeholder.png"
/>
```

### Lazy Background Images

```typescript
import { LazyBackgroundImage } from "@/components/performance/lazy-image";

<LazyBackgroundImage
  src="/images/background.jpg"
  className="h-64 w-full"
>
  <div>Content over background</div>
</LazyBackgroundImage>
```

### Lazy Avatars

```typescript
import { LazyAvatar } from "@/components/performance/lazy-image";

<LazyAvatar
  src={user.avatarUrl}
  alt={user.name}
  fallback={user.initials}
  size="md"
/>
```

### Next.js Image Optimization

Always use Next.js `Image` component for automatic optimization:

```typescript
import Image from "next/image";

<Image
  src="/images/hero.jpg"
  alt="Hero"
  width={1200}
  height={600}
  priority // For above-the-fold images
  placeholder="blur" // For images with blur data
/>
```

## 📊 Performance Monitoring

### Measure Component Render Time

```typescript
import { measureRender } from "@/lib/performance/performance-monitor";

useEffect(() => {
  measureRender("MyComponent", () => {
    // Component logic
  });
}, []);
```

### Measure Async Operations

```typescript
import { measureAsync } from "@/lib/performance/performance-monitor";

const fetchData = async () => {
  const data = await measureAsync("fetchProjects", () =>
    fetch("/api/projects").then((r) => r.json())
  );
  return data;
};
```

### Track Core Web Vitals

```typescript
import { trackWebVitals } from "@/lib/performance/performance-monitor";

// In _app.tsx or layout.tsx
useEffect(() => {
  trackWebVitals();
}, []);
```

## 🎯 Performance Utilities

### Debounce

Reduce function calls during rapid events:

```typescript
import { debounce } from "@/lib/performance/performance-monitor";

const debouncedSearch = debounce((query: string) => {
  searchProjects(query);
}, 300);

<Input onChange={(e) => debouncedSearch(e.target.value)} />
```

### Throttle

Limit function execution frequency:

```typescript
import { throttle } from "@/lib/performance/performance-monitor";

const throttledScroll = throttle(() => {
  handleScroll();
}, 100);

window.addEventListener("scroll", throttledScroll);
```

### Run When Idle

Execute low-priority tasks during idle time:

```typescript
import { runWhenIdle } from "@/lib/performance/performance-monitor";

runWhenIdle(() => {
  // Low priority analytics or logging
  trackUserBehavior();
});
```

### Connection Quality Detection

Adapt behavior based on network speed:

```typescript
import { getConnectionQuality, hasDataSaver } from "@/lib/performance/performance-monitor";

const connectionQuality = getConnectionQuality();
const dataSaverEnabled = hasDataSaver();

// Skip auto-playing videos on slow connections
if (connectionQuality === "slow" || dataSaverEnabled) {
  disableAutoPlay();
}
```

## 🔧 Next.js Configuration

### Recommended `next.config.js` Settings

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React strict mode for better development experience
  reactStrictMode: true,

  // Enable SWC minification (faster than Terser)
  swcMinify: true,

  // Image optimization
  images: {
    domains: ["your-cdn.com"],
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Compiler options
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },

  // Enable experimental features for better performance
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "recharts",
      "@radix-ui/react-icons",
    ],
  },

  // Webpack optimizations
  webpack: (config, { isServer }) => {
    // Optimize bundle size
    if (!isServer) {
      config.optimization.splitChunks = {
        chunks: "all",
        cacheGroups: {
          default: false,
          vendors: false,
          // Vendor chunk for react and react-dom
          framework: {
            name: "framework",
            test: /[\\/]node_modules[\\/](react|react-dom|scheduler)[\\/]/,
            priority: 40,
            enforce: true,
          },
          // Commons chunk for shared code
          commons: {
            name: "commons",
            minChunks: 2,
            priority: 20,
          },
          // Lib chunk for large libraries
          lib: {
            test: /[\\/]node_modules[\\/]/,
            name(module) {
              const packageName = module.context.match(
                /[\\/]node_modules[\\/](.*?)([\\/]|$)/
              )[1];
              return `npm.${packageName.replace("@", "")}`;
            },
            priority: 30,
            minChunks: 1,
            reuseExistingChunk: true,
          },
        },
      };
    }

    return config;
  },
};

module.exports = nextConfig;
```

## 📱 Mobile Performance

### Reduce Motion for Accessibility

```typescript
import { prefersReducedMotion } from "@/lib/performance/performance-monitor";

const shouldAnimate = !prefersReducedMotion();

<motion.div animate={shouldAnimate ? { x: 100 } : {}} />
```

### Touch-Optimized Components

Always use mobile-optimized components on mobile:

```typescript
import { useIsMobile } from "@/hooks/use-mobile";
import { MobileCard } from "@/components/mobile/mobile-card";
import { DesktopTable } from "@/components/desktop/table";

const isMobile = useIsMobile();

return isMobile ? <MobileCard {...data} /> : <DesktopTable data={data} />;
```

## 🎨 CSS Performance

### Use Tailwind JIT

Tailwind's JIT compiler generates only the CSS you use:

```javascript
// tailwind.config.js
module.exports = {
  mode: "jit", // Just-in-Time mode
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/app/**/*.{js,ts,jsx,tsx}",
  ],
  // ...
};
```

### Avoid Inline Styles

Use Tailwind classes instead of inline styles:

```typescript
// ❌ Bad - causes unnecessary re-renders
<div style={{ color: isActive ? "blue" : "gray" }} />

// ✅ Good - uses CSS classes
<div className={cn(isActive ? "text-blue-600" : "text-gray-600")} />
```

## 🗄️ Data Fetching

### Use React Query for Caching

```typescript
import { useQuery } from "@tanstack/react-query";

const { data, isLoading } = useQuery({
  queryKey: ["projects"],
  queryFn: () => fetch("/api/projects").then((r) => r.json()),
  staleTime: 5 * 60 * 1000, // 5 minutes
});
```

### Implement Pagination

```typescript
// Server-side
const projects = await prisma.project.findMany({
  take: 20,
  skip: (page - 1) * 20,
  orderBy: { createdAt: "desc" },
});

// Client-side
const { data, fetchNextPage, hasNextPage } = useInfiniteQuery({
  queryKey: ["projects"],
  queryFn: ({ pageParam = 0 }) => fetchProjects(pageParam),
  getNextPageParam: (lastPage) => lastPage.nextCursor,
});
```

### Use Data Loader Pattern

```typescript
// Fetch data in parallel
const [projects, users, stats] = await Promise.all([
  fetchProjects(),
  fetchUsers(),
  fetchStats(),
]);
```

## 🚀 Bundle Size Optimization

### Analyze Bundle Size

```bash
# Install bundle analyzer
npm install @next/bundle-analyzer

# Add to next.config.js
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

module.exports = withBundleAnalyzer(nextConfig);

# Run analysis
ANALYZE=true npm run build
```

### Tree Shaking

Import only what you need:

```typescript
// ❌ Bad - imports entire library
import _ from "lodash";

// ✅ Good - imports only what's needed
import { debounce } from "lodash";

// ✅ Better - use native methods
const debounce = (fn, delay) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
};
```

## 📈 Performance Checklist

### Before Production

- [ ] Enable React strict mode
- [ ] Minify and compress assets
- [ ] Optimize images (WebP, AVIF)
- [ ] Implement lazy loading
- [ ] Add code splitting
- [ ] Enable caching headers
- [ ] Use CDN for static assets
- [ ] Implement service worker (PWA)
- [ ] Remove console.logs in production
- [ ] Analyze and optimize bundle size
- [ ] Test on slow 3G connection
- [ ] Measure Core Web Vitals
- [ ] Add performance monitoring
- [ ] Implement error boundaries
- [ ] Use Suspense for loading states
- [ ] Optimize database queries with indexes

### Performance Targets

- **Lighthouse Score**: 90+ (all categories)
- **First Contentful Paint (FCP)**: < 1.8s
- **Largest Contentful Paint (LCP)**: < 2.5s
- **First Input Delay (FID)**: < 100ms
- **Cumulative Layout Shift (CLS)**: < 0.1
- **Time to Interactive (TTI)**: < 3.8s
- **Total Bundle Size**: < 200KB (gzipped)

## 🔍 Performance Debugging

### Chrome DevTools

1. **Performance tab**: Record and analyze runtime performance
2. **Network tab**: Check resource loading times
3. **Coverage tab**: Find unused JavaScript and CSS
4. **Lighthouse**: Run comprehensive performance audit

### React DevTools Profiler

```typescript
import { Profiler } from "react";

<Profiler
  id="MyComponent"
  onRender={(id, phase, actualDuration) => {
    console.log(`${id} (${phase}) took ${actualDuration}ms`);
  }}
>
  <MyComponent />
</Profiler>
```

### Performance API

```typescript
// Mark important events
performance.mark("data-fetch-start");
await fetchData();
performance.mark("data-fetch-end");

// Measure duration
performance.measure("data-fetch", "data-fetch-start", "data-fetch-end");

// Get measurements
const measures = performance.getEntriesByType("measure");
console.log(measures);
```

## 🎯 Best Practices Summary

1. **Lazy load everything that's not immediately visible**
2. **Use Next.js Image component for all images**
3. **Implement proper code splitting**
4. **Add Suspense boundaries for loading states**
5. **Optimize database queries and add indexes**
6. **Use caching strategies (React Query, SWR)**
7. **Debounce/throttle expensive operations**
8. **Minimize bundle size through tree shaking**
9. **Use Web Workers for heavy computations**
10. **Monitor Core Web Vitals in production**
11. **Test on slow connections and low-end devices**
12. **Implement Progressive Web App features**

---

For more information, see:
- [Next.js Performance Documentation](https://nextjs.org/docs/advanced-features/measuring-performance)
- [Web.dev Performance Guide](https://web.dev/performance/)
- [React Performance Optimization](https://react.dev/learn/render-and-commit#optimizing-performance)
