/**
 * Search Results Page
 *
 * Full page search results with filters
 */

"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Loader2, FolderKanban, Users, FileText, CheckSquare, Filter } from "lucide-react";
import { useSearch } from "@/hooks/use-search";
import { SearchResultItem } from "@/components/search/search-result-item";
import { SearchFilters } from "@/components/search/search-filters";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const initialType = searchParams.get("type") || undefined;
  const initialStatus = searchParams.get("status") || undefined;

  const {
    query,
    setQuery,
    filters,
    updateFilters,
    clearFilters,
    results,
    isLoading,
    error,
    search,
  } = useSearch();

  const [showFilters, setShowFilters] = React.useState(false);

  React.useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery);
      const initialFilters: any = {};
      if (initialType) initialFilters.type = initialType;
      if (initialStatus) initialFilters.status = initialStatus;
      search(initialQuery, initialFilters);
    }
  }, [initialQuery, initialType, initialStatus, search, setQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      search(query, filters);
    }
  };

  const hasResults = results && results.totalResults > 0;
  const hasFilters = Object.keys(filters).length > 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Search</h1>
        <p className="text-muted-foreground mt-1">
          Find projects, users, files, and more
        </p>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search anything..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className={cn(hasFilters && "border-primary")}
        >
          <Filter className="h-4 w-4 mr-2" />
          Filters
          {hasFilters && (
            <Badge variant="default" className="ml-2 h-5 px-1.5 text-xs">
              {Object.keys(filters).length}
            </Badge>
          )}
        </Button>
        <Button type="submit" disabled={isLoading || !query.trim()}>
          {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          Search
        </Button>
      </form>

      {/* Filters */}
      {showFilters && (
        <SearchFilters
          filters={filters}
          onUpdateFilters={updateFilters}
          onClearFilters={clearFilters}
        />
      )}

      {/* Results */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : error ? (
        <div className="flex items-center justify-center py-12">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      ) : !results ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Search className="h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Start searching</h3>
          <p className="text-sm text-muted-foreground max-w-md">
            Enter a search query to find projects, users, files, and approvals across the platform
          </p>
        </div>
      ) : hasResults ? (
        <Tabs defaultValue="all">
          <div className="flex items-center justify-between mb-4">
            <TabsList>
              <TabsTrigger value="all">
                All ({results.totalResults})
              </TabsTrigger>
              {results.results.projects.length > 0 && (
                <TabsTrigger value="projects">
                  <FolderKanban className="h-4 w-4 mr-1" />
                  Projects ({results.results.projects.length})
                </TabsTrigger>
              )}
              {results.results.users.length > 0 && (
                <TabsTrigger value="users">
                  <Users className="h-4 w-4 mr-1" />
                  Users ({results.results.users.length})
                </TabsTrigger>
              )}
              {results.results.files.length > 0 && (
                <TabsTrigger value="files">
                  <FileText className="h-4 w-4 mr-1" />
                  Files ({results.results.files.length})
                </TabsTrigger>
              )}
              {results.results.approvals.length > 0 && (
                <TabsTrigger value="approvals">
                  <CheckSquare className="h-4 w-4 mr-1" />
                  Approvals ({results.results.approvals.length})
                </TabsTrigger>
              )}
            </TabsList>
            <p className="text-sm text-muted-foreground">
              {results.totalResults} result{results.totalResults !== 1 ? "s" : ""} for "{results.query}"
            </p>
          </div>

          <TabsContent value="all" className="space-y-2">
            {results.results.projects.map((item: any) => (
              <SearchResultItem
                key={`project-${item.id}`}
                type="project"
                item={item}
                query={query}
                onSelect={() => {}}
              />
            ))}
            {results.results.users.map((item: any) => (
              <SearchResultItem
                key={`user-${item.id}`}
                type="user"
                item={item}
                query={query}
                onSelect={() => {}}
              />
            ))}
            {results.results.files.map((item: any) => (
              <SearchResultItem
                key={`file-${item.id}`}
                type="file"
                item={item}
                query={query}
                onSelect={() => {}}
              />
            ))}
            {results.results.approvals.map((item: any) => (
              <SearchResultItem
                key={`approval-${item.id}`}
                type="approval"
                item={item}
                query={query}
                onSelect={() => {}}
              />
            ))}
          </TabsContent>

          {results.results.projects.length > 0 && (
            <TabsContent value="projects" className="space-y-2">
              {results.results.projects.map((item: any) => (
                <SearchResultItem
                  key={item.id}
                  type="project"
                  item={item}
                  query={query}
                  onSelect={() => {}}
                />
              ))}
            </TabsContent>
          )}

          {results.results.users.length > 0 && (
            <TabsContent value="users" className="space-y-2">
              {results.results.users.map((item: any) => (
                <SearchResultItem
                  key={item.id}
                  type="user"
                  item={item}
                  query={query}
                  onSelect={() => {}}
                />
              ))}
            </TabsContent>
          )}

          {results.results.files.length > 0 && (
            <TabsContent value="files" className="space-y-2">
              {results.results.files.map((item: any) => (
                <SearchResultItem
                  key={item.id}
                  type="file"
                  item={item}
                  query={query}
                  onSelect={() => {}}
                />
              ))}
            </TabsContent>
          )}

          {results.results.approvals.length > 0 && (
            <TabsContent value="approvals" className="space-y-2">
              {results.results.approvals.map((item: any) => (
                <SearchResultItem
                  key={item.id}
                  type="approval"
                  item={item}
                  query={query}
                  onSelect={() => {}}
                />
              ))}
            </TabsContent>
          )}
        </Tabs>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Search className="h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No results found</h3>
          <p className="text-sm text-muted-foreground max-w-md">
            Try adjusting your search query or filters to find what you're looking for
          </p>
        </div>
      )}
    </div>
  );
}
