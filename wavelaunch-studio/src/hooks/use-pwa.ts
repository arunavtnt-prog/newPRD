/**
 * PWA Hooks
 */

import * as React from "react";
import {
  registerServiceWorker,
  isStandalone,
  canInstall,
  isOnline,
  getCacheStorageUsage,
} from "@/lib/pwa/pwa-utils";

/**
 * Hook to register service worker on mount
 */
export function useServiceWorker() {
  const [registration, setRegistration] =
    React.useState<ServiceWorkerRegistration | null>(null);
  const [isRegistered, setIsRegistered] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    registerServiceWorker()
      .then((reg) => {
        setRegistration(reg);
        setIsRegistered(!!reg);
      })
      .catch((err) => {
        setError(err);
      });
  }, []);

  return { registration, isRegistered, error };
}

/**
 * Hook to handle PWA install prompt
 */
export function useInstallPrompt() {
  const [promptEvent, setPromptEvent] = React.useState<any>(null);
  const [isInstallable, setIsInstallable] = React.useState(false);
  const [isInstalled, setIsInstalled] = React.useState(false);

  React.useEffect(() => {
    setIsInstalled(isStandalone());
    setIsInstallable(canInstall() && !isStandalone());

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setPromptEvent(e);
      setIsInstallable(true);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setPromptEvent(null);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const promptInstall = React.useCallback(async () => {
    if (!promptEvent) return false;

    promptEvent.prompt();
    const result = await promptEvent.userChoice;

    if (result.outcome === "accepted") {
      setIsInstalled(true);
      setIsInstallable(false);
    }

    setPromptEvent(null);
    return result.outcome === "accepted";
  }, [promptEvent]);

  return {
    isInstallable,
    isInstalled,
    promptInstall,
  };
}

/**
 * Hook to track online/offline status
 */
export function useOnlineStatus() {
  const [online, setOnline] = React.useState(isOnline());

  React.useEffect(() => {
    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return online;
}

/**
 * Hook to monitor cache storage
 */
export function useCacheStorage() {
  const [storage, setStorage] = React.useState({
    usage: 0,
    quota: 0,
    percentage: 0,
  });

  React.useEffect(() => {
    const updateStorage = async () => {
      const stats = await getCacheStorageUsage();
      setStorage(stats);
    };

    updateStorage();

    // Update every minute
    const interval = setInterval(updateStorage, 60000);

    return () => clearInterval(interval);
  }, []);

  return storage;
}

/**
 * Hook to detect if running as PWA
 */
export function useIsPWA() {
  const [isPWA, setIsPWA] = React.useState(false);

  React.useEffect(() => {
    setIsPWA(isStandalone());
  }, []);

  return isPWA;
}

/**
 * Hook for app update detection
 */
export function useAppUpdate() {
  const [updateAvailable, setUpdateAvailable] = React.useState(false);
  const [newWorker, setNewWorker] = React.useState<ServiceWorker | null>(null);

  React.useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
      return;
    }

    navigator.serviceWorker.ready.then((registration) => {
      registration.addEventListener("updatefound", () => {
        const worker = registration.installing;

        if (!worker) return;

        worker.addEventListener("statechange", () => {
          if (
            worker.state === "installed" &&
            navigator.serviceWorker.controller
          ) {
            setUpdateAvailable(true);
            setNewWorker(worker);
          }
        });
      });
    });
  }, []);

  const applyUpdate = React.useCallback(() => {
    if (!newWorker) return;

    newWorker.postMessage({ type: "SKIP_WAITING" });
    window.location.reload();
  }, [newWorker]);

  return {
    updateAvailable,
    applyUpdate,
  };
}
