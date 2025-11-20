"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

interface SearchFilters {
  type?: string;
  status?: string;
  assignedTo?: string;
}

export function useSearch() {
  const router = useRouter();
  const [query, setQuery] = React.useState("");
  const [filters, setFilters] = React.useState<SearchFilters>({});
  const [results, setResults] = React.useState<any>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const search = React.useCallback(
    async (searchQuery: string, searchFilters?: SearchFilters) => {
      if (!searchQuery.trim()) {
        setResults(null);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams({
          q: searchQuery,
          ...(searchFilters?.type && { type: searchFilters.type }),
          ...(searchFilters?.status && { status: searchFilters.status }),
          ...(searchFilters?.assignedTo && { assignedTo: searchFilters.assignedTo }),
        });

        const response = await fetch(`/api/search?${params}`);
        if (!response.ok) throw new Error("Search failed");

        const data = await response.json();
        setResults(data);
      } catch (err) {
        setError("Failed to search. Please try again.");
        console.error("Search error:", err);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const navigateToResults = React.useCallback(
    (searchQuery: string, searchFilters?: SearchFilters) => {
      const params = new URLSearchParams({
        q: searchQuery,
        ...(searchFilters?.type && { type: searchFilters.type }),
        ...(searchFilters?.status && { status: searchFilters.status }),
        ...(searchFilters?.assignedTo && { assignedTo: searchFilters.assignedTo }),
      });

      router.push(`/dashboard/search?${params}`);
    },
    [router]
  );

  const updateFilters = React.useCallback(
    (newFilters: Partial<SearchFilters>) => {
      const updatedFilters = { ...filters, ...newFilters };
      setFilters(updatedFilters);
      if (query) {
        search(query, updatedFilters);
      }
    },
    [filters, query, search]
  );

  const clearFilters = React.useCallback(() => {
    setFilters({});
    if (query) {
      search(query, {});
    }
  }, [query, search]);

  const clearSearch = React.useCallback(() => {
    setQuery("");
    setResults(null);
    setFilters({});
    setError(null);
  }, []);

  return {
    query,
    setQuery,
    filters,
    updateFilters,
    clearFilters,
    results,
    isLoading,
    error,
    search,
    navigateToResults,
    clearSearch,
  };
}
