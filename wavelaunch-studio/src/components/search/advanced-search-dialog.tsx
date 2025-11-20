"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  FolderKanban,
  Users,
  FileText,
  CheckSquare,
  Loader2,
  ArrowRight,
  Filter,
} from "lucide-react";
import { useSearch } from "@/hooks/use-search";
import { SearchResultItem } from "./search-result-item";
import { SearchFilters } from "./search-filters";
import { cn } from "@/lib/utils";

interface AdvancedSearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AdvancedSearchDialog({ open, onOpenChange }: AdvancedSearchDialogProps) {
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
    navigateToResults,
    clearSearch,
  } = useSearch();

  const [showFilters, setShowFilters] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  React.useEffect(() => {
    if (!open) {
      clearSearch();
      setShowFilters(false);
    }
  }, [open, clearSearch]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      search(query, filters);
    }
  };

  const handleViewAll = () => {
    navigateToResults(query, filters);
    onOpenChange(false);
  };

  const hasResults = results && results.totalResults > 0;
  const hasFilters = Object.keys(filters).length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] p-0">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle>Search</DialogTitle>
          <DialogDescription>
            Search across projects, users, files, and approvals
          </DialogDescription>
        </DialogHeader>

        {/* Search Input */}
        <form onSubmit={handleSearch} className="px-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              ref={inputRef}
              type="text"
              placeholder="Search anything..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-9 pr-24"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className={cn(hasFilters && "text-primary")}
              >
                <Filter className="h-4 w-4 mr-1" />
                Filters
                {hasFilters && (
                  <Badge variant="default" className="ml-1 h-4 px-1 text-[10px]">
                    {Object.keys(filters).length}
                  </Badge>
                )}
              </Button>
            </div>
          </div>
        </form>

        {/* Filters */}
        {showFilters && (
          <div className="px-6 pb-4">
            <SearchFilters
              filters={filters}
              onUpdateFilters={updateFilters}
              onClearFilters={clearFilters}
            />
          </div>
        )}

        {/* Results */}
        <div className="flex-1 overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : error ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          ) : !results ? (
            <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
              <Search className="h-12 w-12 text-muted-foreground mb-3" />
              <p className="text-sm font-medium">Search for anything</p>
              <p className="text-xs text-muted-foreground mt-1">
                Projects, users, files, approvals, and more
              </p>
            </div>
          ) : hasResults ? (
            <Tabs defaultValue="all" className="h-full flex flex-col">
              <TabsList className="mx-6">
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

              <ScrollArea className="flex-1 px-6 pb-6">
                <TabsContent value="all" className="mt-4 space-y-2">
                  {results.results.projects.map((item: any) => (
                    <SearchResultItem
                      key={`project-${item.id}`}
                      type="project"
                      item={item}
                      query={query}
                      onSelect={() => onOpenChange(false)}
                    />
                  ))}
                  {results.results.users.map((item: any) => (
                    <SearchResultItem
                      key={`user-${item.id}`}
                      type="user"
                      item={item}
                      query={query}
                      onSelect={() => onOpenChange(false)}
                    />
                  ))}
                  {results.results.files.map((item: any) => (
                    <SearchResultItem
                      key={`file-${item.id}`}
                      type="file"
                      item={item}
                      query={query}
                      onSelect={() => onOpenChange(false)}
                    />
                  ))}
                  {results.results.approvals.map((item: any) => (
                    <SearchResultItem
                      key={`approval-${item.id}`}
                      type="approval"
                      item={item}
                      query={query}
                      onSelect={() => onOpenChange(false)}
                    />
                  ))}
                </TabsContent>

                {results.results.projects.length > 0 && (
                  <TabsContent value="projects" className="mt-4 space-y-2">
                    {results.results.projects.map((item: any) => (
                      <SearchResultItem
                        key={item.id}
                        type="project"
                        item={item}
                        query={query}
                        onSelect={() => onOpenChange(false)}
                      />
                    ))}
                  </TabsContent>
                )}

                {results.results.users.length > 0 && (
                  <TabsContent value="users" className="mt-4 space-y-2">
                    {results.results.users.map((item: any) => (
                      <SearchResultItem
                        key={item.id}
                        type="user"
                        item={item}
                        query={query}
                        onSelect={() => onOpenChange(false)}
                      />
                    ))}
                  </TabsContent>
                )}

                {results.results.files.length > 0 && (
                  <TabsContent value="files" className="mt-4 space-y-2">
                    {results.results.files.map((item: any) => (
                      <SearchResultItem
                        key={item.id}
                        type="file"
                        item={item}
                        query={query}
                        onSelect={() => onOpenChange(false)}
                      />
                    ))}
                  </TabsContent>
                )}

                {results.results.approvals.length > 0 && (
                  <TabsContent value="approvals" className="mt-4 space-y-2">
                    {results.results.approvals.map((item: any) => (
                      <SearchResultItem
                        key={item.id}
                        type="approval"
                        item={item}
                        query={query}
                        onSelect={() => onOpenChange(false)}
                      />
                    ))}
                  </TabsContent>
                )}
              </ScrollArea>

              <div className="p-4 border-t">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full"
                  onClick={handleViewAll}
                >
                  View All Results
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </Tabs>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
              <Search className="h-12 w-12 text-muted-foreground mb-3" />
              <p className="text-sm font-medium">No results found</p>
              <p className="text-xs text-muted-foreground mt-1">
                Try adjusting your search query or filters
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
