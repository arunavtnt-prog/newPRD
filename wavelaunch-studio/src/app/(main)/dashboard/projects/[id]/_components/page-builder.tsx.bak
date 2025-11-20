/**
 * Page Builder Component
 *
 * Manage website pages and sections
 */

"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Plus,
  Eye,
  EyeOff,
  Edit,
  Trash2,
  GripVertical,
  Loader2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PageBuilderProps {
  projectId: string;
  websitePages: any[];
}

const PAGE_TYPES = [
  { value: "HOME", label: "Home Page" },
  { value: "ABOUT", label: "About Page" },
  { value: "PRODUCT", label: "Product Page" },
  { value: "COLLECTION", label: "Collection Page" },
  { value: "CONTACT", label: "Contact Page" },
  { value: "BLOG", label: "Blog Page" },
  { value: "CUSTOM", label: "Custom Page" },
];

const SECTION_TYPES = [
  { value: "HERO", label: "Hero Section", icon: "🎯" },
  { value: "FEATURES", label: "Features", icon: "⭐" },
  { value: "PRODUCT_GRID", label: "Product Grid", icon: "🛍️" },
  { value: "TESTIMONIALS", label: "Testimonials", icon: "💬" },
  { value: "CTA", label: "Call to Action", icon: "🎯" },
  { value: "FAQ", label: "FAQ", icon: "❓" },
  { value: "ABOUT_STORY", label: "About Story", icon: "📖" },
  { value: "GALLERY", label: "Gallery", icon: "🖼️" },
  { value: "CONTACT_FORM", label: "Contact Form", icon: "📧" },
  { value: "CUSTOM_HTML", label: "Custom HTML", icon: "💻" },
];

export function PageBuilder({ projectId, websitePages }: PageBuilderProps) {
  const { toast } = useToast();
  const [pages, setPages] = React.useState(websitePages);
  const [isPageDialogOpen, setIsPageDialogOpen] = React.useState(false);
  const [isSectionDialogOpen, setIsSectionDialogOpen] = React.useState(false);
  const [editingPage, setEditingPage] = React.useState<any>(null);
  const [selectedPageForSection, setSelectedPageForSection] =
    React.useState<any>(null);
  const [isSaving, setIsSaving] = React.useState(false);

  const [pageFormData, setPageFormData] = React.useState({
    pageName: "",
    slug: "",
    pageType: "CUSTOM",
    metaTitle: "",
    metaDescription: "",
  });

  const [sectionFormData, setSectionFormData] = React.useState({
    sectionName: "",
    sectionType: "HERO",
    orderIndex: 0,
  });

  const handleCreatePage = () => {
    setEditingPage(null);
    setPageFormData({
      pageName: "",
      slug: "",
      pageType: "CUSTOM",
      metaTitle: "",
      metaDescription: "",
    });
    setIsPageDialogOpen(true);
  };

  const handleEditPage = (page: any) => {
    setEditingPage(page);
    setPageFormData({
      pageName: page.pageName,
      slug: page.slug,
      pageType: page.pageType,
      metaTitle: page.metaTitle || "",
      metaDescription: page.metaDescription || "",
    });
    setIsPageDialogOpen(true);
  };

  const handleSavePage = async () => {
    if (!pageFormData.pageName || !pageFormData.slug) {
      toast({
        title: "Missing fields",
        description: "Page name and slug are required",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);

    try {
      const url = editingPage
        ? `/api/projects/${projectId}/pages/${editingPage.id}`
        : `/api/projects/${projectId}/pages`;

      const response = await fetch(url, {
        method: editingPage ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pageFormData),
      });

      if (!response.ok) {
        throw new Error("Failed to save page");
      }

      toast({
        title: editingPage ? "Page updated" : "Page created",
        description: `${pageFormData.pageName} has been saved`,
      });

      setIsPageDialogOpen(false);
      setTimeout(() => window.location.reload(), 1000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save page",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleTogglePublish = async (page: any) => {
    try {
      const response = await fetch(
        `/api/projects/${projectId}/pages/${page.id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ isPublished: !page.isPublished }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update page");
      }

      toast({
        title: page.isPublished ? "Page unpublished" : "Page published",
      });

      setTimeout(() => window.location.reload(), 1000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update page status",
        variant: "destructive",
      });
    }
  };

  const handleDeletePage = async (page: any) => {
    if (
      !confirm(
        `Are you sure you want to delete "${page.pageName}"? This will also delete all sections.`
      )
    ) {
      return;
    }

    try {
      const response = await fetch(
        `/api/projects/${projectId}/pages/${page.id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete page");
      }

      toast({
        title: "Page deleted",
        description: `${page.pageName} has been removed`,
      });

      setTimeout(() => window.location.reload(), 1000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete page",
        variant: "destructive",
      });
    }
  };

  const handleAddSection = (page: any) => {
    setSelectedPageForSection(page);
    setSectionFormData({
      sectionName: "",
      sectionType: "HERO",
      orderIndex: (page.sections || []).length,
    });
    setIsSectionDialogOpen(true);
  };

  const handleSaveSection = async () => {
    if (!sectionFormData.sectionName) {
      toast({
        title: "Missing fields",
        description: "Section name is required",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);

    try {
      const response = await fetch(
        `/api/projects/${projectId}/pages/${selectedPageForSection.id}/sections`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(sectionFormData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create section");
      }

      toast({
        title: "Section added",
        description: `${sectionFormData.sectionName} has been added to ${selectedPageForSection.pageName}`,
      });

      setIsSectionDialogOpen(false);
      setTimeout(() => window.location.reload(), 1000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add section",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Page Builder</h3>
          <p className="text-sm text-muted-foreground">
            Create and manage website pages with section-based layouts
          </p>
        </div>
        <Button onClick={handleCreatePage}>
          <Plus className="h-4 w-4 mr-2" />
          Create Page
        </Button>
      </div>

      {/* Pages List */}
      {pages.length > 0 ? (
        <div className="space-y-4">
          {pages.map((page) => (
            <Card key={page.id}>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Page Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold">{page.pageName}</h4>
                        <Badge variant="outline">{page.pageType}</Badge>
                        {page.isPublished ? (
                          <Badge variant="default">
                            <Eye className="h-3 w-3 mr-1" />
                            Published
                          </Badge>
                        ) : (
                          <Badge variant="secondary">
                            <EyeOff className="h-3 w-3 mr-1" />
                            Draft
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        /{page.slug}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {(page.sections || []).length} section(s)
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleTogglePublish(page)}
                      >
                        {page.isPublished ? (
                          <>
                            <EyeOff className="h-4 w-4 mr-1" />
                            Unpublish
                          </>
                        ) : (
                          <>
                            <Eye className="h-4 w-4 mr-1" />
                            Publish
                          </>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditPage(page)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeletePage(page)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Sections */}
                  {(page.sections || []).length > 0 && (
                    <div className="border-t pt-4">
                      <div className="space-y-2">
                        {page.sections.map((section: any) => {
                          const sectionType = SECTION_TYPES.find(
                            (t) => t.value === section.sectionType
                          );
                          return (
                            <div
                              key={section.id}
                              className="flex items-center gap-2 p-2 bg-muted/50 rounded"
                            >
                              <GripVertical className="h-4 w-4 text-muted-foreground" />
                              <span className="text-lg">
                                {sectionType?.icon}
                              </span>
                              <span className="flex-1 text-sm">
                                {section.sectionName}
                              </span>
                              <Badge variant="outline" className="text-xs">
                                {sectionType?.label}
                              </Badge>
                              {!section.isVisible && (
                                <Badge variant="secondary" className="text-xs">
                                  Hidden
                                </Badge>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Add Section Button */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddSection(page)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Section
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <FileText className="h-16 w-16 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium mb-2">No pages yet</h3>
            <p className="text-muted-foreground text-center max-w-sm mb-6">
              Create your first page to start building your website
            </p>
            <Button onClick={handleCreatePage}>
              <Plus className="h-4 w-4 mr-2" />
              Create First Page
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Page Dialog */}
      <Dialog open={isPageDialogOpen} onOpenChange={setIsPageDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingPage ? "Edit Page" : "Create New Page"}
            </DialogTitle>
            <DialogDescription>
              Configure page settings and metadata
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="pageName">Page Name</Label>
              <Input
                id="pageName"
                placeholder="e.g., Home, About Us, Contact"
                value={pageFormData.pageName}
                onChange={(e) =>
                  setPageFormData((prev) => ({
                    ...prev,
                    pageName: e.target.value,
                  }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">URL Slug</Label>
              <Input
                id="slug"
                placeholder="e.g., home, about-us, contact"
                value={pageFormData.slug}
                onChange={(e) =>
                  setPageFormData((prev) => ({ ...prev, slug: e.target.value }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pageType">Page Type</Label>
              <Select
                value={pageFormData.pageType}
                onValueChange={(value) =>
                  setPageFormData((prev) => ({ ...prev, pageType: value }))
                }
              >
                <SelectTrigger id="pageType">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PAGE_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="metaTitle">Meta Title (SEO)</Label>
              <Input
                id="metaTitle"
                placeholder="Page title for search engines"
                value={pageFormData.metaTitle}
                onChange={(e) =>
                  setPageFormData((prev) => ({
                    ...prev,
                    metaTitle: e.target.value,
                  }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="metaDescription">Meta Description (SEO)</Label>
              <Input
                id="metaDescription"
                placeholder="Brief description for search engines"
                value={pageFormData.metaDescription}
                onChange={(e) =>
                  setPageFormData((prev) => ({
                    ...prev,
                    metaDescription: e.target.value,
                  }))
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsPageDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleSavePage} disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>{editingPage ? "Update" : "Create"} Page</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Section Dialog */}
      <Dialog open={isSectionDialogOpen} onOpenChange={setIsSectionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Section</DialogTitle>
            <DialogDescription>
              Add a new section to {selectedPageForSection?.pageName}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="sectionName">Section Name</Label>
              <Input
                id="sectionName"
                placeholder="e.g., Hero Banner, Product Features"
                value={sectionFormData.sectionName}
                onChange={(e) =>
                  setSectionFormData((prev) => ({
                    ...prev,
                    sectionName: e.target.value,
                  }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sectionType">Section Type</Label>
              <Select
                value={sectionFormData.sectionType}
                onValueChange={(value) =>
                  setSectionFormData((prev) => ({ ...prev, sectionType: value }))
                }
              >
                <SelectTrigger id="sectionType">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SECTION_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      <span className="flex items-center gap-2">
                        <span>{type.icon}</span>
                        <span>{type.label}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsSectionDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveSection} disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                <>Add Section</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
