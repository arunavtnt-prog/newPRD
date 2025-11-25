/**
 * Global Search Command Palette
 *
 * Provides Cmd+K search across projects, files, comments, and users
 */

"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { Loader2, Search, FolderOpen, FileText, MessageSquare, User } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";

interface SearchResult {
  projects: Array<{
    id: string;
    projectName: string;
    creatorName: string;
    category: string;
    status: string;
    leadStrategist?: {
      id: string;
      fullName: string;
    };
  }>;
  files: Array<{
    id: string;
    originalFilename: string;
    fileType: string;
    folder: string;
    project: {
      id: string;
      projectName: string;
    };
  }>;
  comments: Array<{
    id: string;
    commentText: string;
    project: {
      id: string;
      projectName: string;
    };
    user: {
      fullName: string;
    };
  }>;
  users: Array<{
    id: string;
    fullName: string;
    email: string;
    role: string;
  }>;
  totalResults: number;
}

export function GlobalSearch() {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [results, setResults] = React.useState<SearchResult | null>(null);
  const [isSearching, setIsSearching] = React.useState(false);

  const debouncedQuery = useDebounce(query, 300);

  // Keyboard shortcut: Cmd+K or Ctrl+K
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  // Perform search when debounced query changes
  React.useEffect(() => {
    if (!debouncedQuery || debouncedQuery.length < 2) {
      setResults(null);
      return;
    }

    const performSearch = async () => {
      setIsSearching(true);
      try {
        const response = await fetch(
          `/api/search?q=${encodeURIComponent(debouncedQuery)}`
        );

        if (response.ok) {
          const data = await response.json();
          setResults(data);
        } else {
          console.error("Search failed:", response.statusText);
          setResults(null);
        }
      } catch (error) {
        console.error("Search error:", error);
        setResults(null);
      } finally {
        setIsSearching(false);
      }
    };

    performSearch();
  }, [debouncedQuery]);

  // Reset when dialog closes
  const handleOpenChange = (open: boolean) => {
    setOpen(open);
    if (!open) {
      setQuery("");
      setResults(null);
    }
  };

  // Navigate to project
  const goToProject = (projectId: string) => {
    router.push(`/dashboard/projects/${projectId}`);
    setOpen(false);
  };

  // Navigate to file in project
  const goToFile = (projectId: string, fileId: string) => {
    router.push(`/dashboard/projects/${projectId}?tab=files&file=${fileId}`);
    setOpen(false);
  };

  // Navigate to comment in project
  const goToComment = (projectId: string, commentId: string) => {
    router.push(`/dashboard/projects/${projectId}?tab=activity&comment=${commentId}`);
    setOpen(false);
  };

  // Navigate to user profile (if admin)
  const goToUser = (userId: string) => {
    router.push(`/dashboard/team/${userId}`);
    setOpen(false);
  };

  return (
    <>
      {/* Search Trigger Button */}
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground bg-muted rounded-md hover:bg-muted/80 transition-colors"
      >
        <Search className="h-4 w-4" />
        <span>Search...</span>
        <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      {/* Command Dialog */}
      <CommandDialog open={open} onOpenChange={handleOpenChange}>
        <CommandInput
          placeholder="Search projects, files, comments..."
          value={query}
          onValueChange={setQuery}
        />
        <CommandList>
          {isSearching && (
            <div className="flex items-center justify-center py-6">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          )}

          {!isSearching && query.length > 0 && query.length < 2 && (
            <CommandEmpty>Type at least 2 characters to search</CommandEmpty>
          )}

          {!isSearching && query.length >= 2 && results && results.totalResults === 0 && (
            <CommandEmpty>No results found</CommandEmpty>
          )}

          {!isSearching && results && results.totalResults > 0 && (
            <>
              {/* Projects */}
              {results.projects.length > 0 && (
                <>
                  <CommandGroup heading="Projects">
                    {results.projects.map((project) => (
                      <CommandItem
                        key={project.id}
                        onSelect={() => goToProject(project.id)}
                        className="flex items-center gap-3"
                      >
                        <FolderOpen className="h-4 w-4 text-blue-600" />
                        <div className="flex-1">
                          <div className="font-medium">{project.projectName}</div>
                          <div className="text-xs text-muted-foreground">
                            {project.creatorName} • {project.category}
                          </div>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {project.status}
                        </Badge>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                  <CommandSeparator />
                </>
              )}

              {/* Files */}
              {results.files.length > 0 && (
                <>
                  <CommandGroup heading="Files">
                    {results.files.map((file) => (
                      <CommandItem
                        key={file.id}
                        onSelect={() => goToFile(file.project.id, file.id)}
                        className="flex items-center gap-3"
                      >
                        <FileText className="h-4 w-4 text-green-600" />
                        <div className="flex-1">
                          <div className="font-medium">{file.originalFilename}</div>
                          <div className="text-xs text-muted-foreground">
                            {file.project.projectName} • {file.folder}
                          </div>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {file.fileType}
                        </Badge>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                  <CommandSeparator />
                </>
              )}

              {/* Comments */}
              {results.comments.length > 0 && (
                <>
                  <CommandGroup heading="Comments">
                    {results.comments.map((comment) => (
                      <CommandItem
                        key={comment.id}
                        onSelect={() => goToComment(comment.project.id, comment.id)}
                        className="flex items-center gap-3"
                      >
                        <MessageSquare className="h-4 w-4 text-purple-600" />
                        <div className="flex-1">
                          <div className="font-medium line-clamp-1">
                            {comment.commentText}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {comment.user.fullName} in {comment.project.projectName}
                          </div>
                        </div>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                  <CommandSeparator />
                </>
              )}

              {/* Users (Admin only) */}
              {results.users.length > 0 && (
                <CommandGroup heading="Users">
                  {results.users.map((user) => (
                    <CommandItem
                      key={user.id}
                      onSelect={() => goToUser(user.id)}
                      className="flex items-center gap-3"
                    >
                      <User className="h-4 w-4 text-amber-600" />
                      <div className="flex-1">
                        <div className="font-medium">{user.fullName}</div>
                        <div className="text-xs text-muted-foreground">
                          {user.email}
                        </div>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {user.role}
                      </Badge>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}
