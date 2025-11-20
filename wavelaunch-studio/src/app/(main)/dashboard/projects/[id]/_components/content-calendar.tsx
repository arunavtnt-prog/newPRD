/**
 * Content Calendar Component
 *
 * Schedule and manage social media content
 */

"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  Calendar as CalendarIcon,
  Plus,
  Edit,
  Trash2,
  Send,
  Clock,
  Loader2,
  TrendingUp,
} from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

interface ContentCalendarProps {
  projectId: string;
  campaigns: any[];
  contentPosts: any[];
}

const PLATFORMS = [
  { value: "INSTAGRAM", label: "Instagram", icon: "📷" },
  { value: "FACEBOOK", label: "Facebook", icon: "👍" },
  { value: "TIKTOK", label: "TikTok", icon: "🎵" },
  { value: "TWITTER", label: "Twitter/X", icon: "🐦" },
  { value: "LINKEDIN", label: "LinkedIn", icon: "💼" },
  { value: "PINTEREST", label: "Pinterest", icon: "📌" },
  { value: "YOUTUBE", label: "YouTube", icon: "📺" },
];

const CONTENT_TYPES = [
  { value: "PHOTO", label: "Photo" },
  { value: "VIDEO", label: "Video" },
  { value: "CAROUSEL", label: "Carousel" },
  { value: "STORY", label: "Story" },
  { value: "REEL", label: "Reel/Short" },
  { value: "THREAD", label: "Thread" },
  { value: "ARTICLE", label: "Article" },
];

const STATUS_COLORS: Record<string, string> = {
  DRAFT: "secondary",
  SCHEDULED: "default",
  PUBLISHED: "default",
  FAILED: "destructive",
  ARCHIVED: "outline",
};

export function ContentCalendar({
  projectId,
  campaigns,
  contentPosts,
}: ContentCalendarProps) {
  const { toast } = useToast();
  const [posts, setPosts] = React.useState(contentPosts);
  const [isPostDialogOpen, setIsPostDialogOpen] = React.useState(false);
  const [editingPost, setEditingPost] = React.useState<any>(null);
  const [isSaving, setIsSaving] = React.useState(false);

  const [postFormData, setPostFormData] = React.useState({
    postTitle: "",
    postContent: "",
    platform: "INSTAGRAM",
    postType: "PHOTO",
    campaignId: "",
    scheduledDate: "",
    hashtags: "",
    taggedAccounts: "",
    notes: "",
  });

  const handleCreatePost = () => {
    setEditingPost(null);
    setPostFormData({
      postTitle: "",
      postContent: "",
      platform: "INSTAGRAM",
      postType: "PHOTO",
      campaignId: "",
      scheduledDate: "",
      hashtags: "",
      taggedAccounts: "",
      notes: "",
    });
    setIsPostDialogOpen(true);
  };

  const handleEditPost = (post: any) => {
    setEditingPost(post);
    setPostFormData({
      postTitle: post.postTitle,
      postContent: post.postContent,
      platform: post.platform,
      postType: post.postType,
      campaignId: post.campaignId || "",
      scheduledDate: post.scheduledDate
        ? format(new Date(post.scheduledDate), "yyyy-MM-dd'T'HH:mm")
        : "",
      hashtags: post.hashtags || "",
      taggedAccounts: post.taggedAccounts || "",
      notes: post.notes || "",
    });
    setIsPostDialogOpen(true);
  };

  const handleSavePost = async () => {
    if (!postFormData.postTitle || !postFormData.postContent) {
      toast({
        title: "Missing fields",
        description: "Title and content are required",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);

    try {
      const url = editingPost
        ? `/api/projects/${projectId}/content/${editingPost.id}`
        : `/api/projects/${projectId}/content`;

      const response = await fetch(url, {
        method: editingPost ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...postFormData,
          campaignId: postFormData.campaignId || null,
          scheduledDate: postFormData.scheduledDate || null,
          status: postFormData.scheduledDate ? "SCHEDULED" : "DRAFT",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save post");
      }

      toast({
        title: editingPost ? "Post updated" : "Post created",
        description: `${postFormData.postTitle} has been saved`,
      });

      setIsPostDialogOpen(false);
      setTimeout(() => window.location.reload(), 1000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save post",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeletePost = async (post: any) => {
    if (!confirm(`Are you sure you want to delete "${post.postTitle}"?`)) {
      return;
    }

    try {
      const response = await fetch(
        `/api/projects/${projectId}/content/${post.id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete post");
      }

      toast({
        title: "Post deleted",
      });

      setTimeout(() => window.location.reload(), 1000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete post",
        variant: "destructive",
      });
    }
  };

  const handlePublish = async (post: any) => {
    try {
      const response = await fetch(
        `/api/projects/${projectId}/content/${post.id}/publish`,
        {
          method: "PATCH",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to publish");
      }

      toast({
        title: "Post published",
        description: "Content has been marked as published",
      });

      setTimeout(() => window.location.reload(), 1000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to publish post",
        variant: "destructive",
      });
    }
  };

  // Group posts by month
  const groupedPosts = posts.reduce((acc, post) => {
    const date = post.scheduledDate || post.createdAt;
    const monthKey = format(new Date(date), "MMMM yyyy");
    if (!acc[monthKey]) {
      acc[monthKey] = [];
    }
    acc[monthKey].push(post);
    return acc;
  }, {} as Record<string, any[]>);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Content Calendar</h3>
          <p className="text-sm text-muted-foreground">
            Schedule posts across all social platforms
          </p>
        </div>
        <Button onClick={handleCreatePost}>
          <Plus className="h-4 w-4 mr-2" />
          Schedule Post
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground">Total Posts</div>
            <div className="text-2xl font-bold">{posts.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground">Scheduled</div>
            <div className="text-2xl font-bold">
              {posts.filter((p) => p.status === "SCHEDULED").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground">Published</div>
            <div className="text-2xl font-bold">
              {posts.filter((p) => p.status === "PUBLISHED").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground">Drafts</div>
            <div className="text-2xl font-bold">
              {posts.filter((p) => p.status === "DRAFT").length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Posts by Month */}
      {Object.keys(groupedPosts).length > 0 ? (
        <div className="space-y-6">
          {Object.entries(groupedPosts).map(([month, monthPosts]) => (
            <div key={month} className="space-y-3">
              <h4 className="font-semibold text-sm uppercase text-muted-foreground">
                {month}
              </h4>
              <div className="space-y-3">
                {monthPosts.map((post) => {
                  const platform = PLATFORMS.find((p) => p.value === post.platform);
                  const contentType = CONTENT_TYPES.find(
                    (t) => t.value === post.postType
                  );

                  return (
                    <Card key={post.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-2">
                              <span className="text-lg">{platform?.icon}</span>
                              <h5 className="font-semibold">{post.postTitle}</h5>
                              <Badge
                                variant={
                                  (STATUS_COLORS[post.status] as any) || "secondary"
                                }
                              >
                                {post.status}
                              </Badge>
                              <Badge variant="outline">{contentType?.label}</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {post.postContent}
                            </p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              {post.scheduledDate && (
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {format(new Date(post.scheduledDate), "MMM d, h:mm a")}
                                </span>
                              )}
                              {post.likes && (
                                <span className="flex items-center gap-1">
                                  <TrendingUp className="h-3 w-3" />
                                  {post.likes} likes
                                </span>
                              )}
                              {post.campaign && (
                                <Badge variant="secondary" className="text-xs">
                                  {post.campaign.campaignName}
                                </Badge>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            {post.status === "DRAFT" && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handlePublish(post)}
                              >
                                <Send className="h-4 w-4" />
                              </Button>
                            )}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditPost(post)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeletePost(post)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <CalendarIcon className="h-16 w-16 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium mb-2">No content scheduled yet</h3>
            <p className="text-muted-foreground text-center max-w-sm mb-6">
              Start scheduling content to build your social media presence
            </p>
            <Button onClick={handleCreatePost}>
              <Plus className="h-4 w-4 mr-2" />
              Schedule First Post
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Post Dialog */}
      <Dialog open={isPostDialogOpen} onOpenChange={setIsPostDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingPost ? "Edit Post" : "Schedule New Post"}
            </DialogTitle>
            <DialogDescription>
              Create content for your social media channels
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="platform">Platform</Label>
                <Select
                  value={postFormData.platform}
                  onValueChange={(value) =>
                    setPostFormData((prev) => ({ ...prev, platform: value }))
                  }
                >
                  <SelectTrigger id="platform">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PLATFORMS.map((platform) => (
                      <SelectItem key={platform.value} value={platform.value}>
                        {platform.icon} {platform.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="postType">Content Type</Label>
                <Select
                  value={postFormData.postType}
                  onValueChange={(value) =>
                    setPostFormData((prev) => ({ ...prev, postType: value }))
                  }
                >
                  <SelectTrigger id="postType">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CONTENT_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="postTitle">Post Title</Label>
              <Input
                id="postTitle"
                placeholder="Internal title for this post"
                value={postFormData.postTitle}
                onChange={(e) =>
                  setPostFormData((prev) => ({
                    ...prev,
                    postTitle: e.target.value,
                  }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="postContent">Caption / Content</Label>
              <Textarea
                id="postContent"
                placeholder="Write your post caption..."
                rows={5}
                value={postFormData.postContent}
                onChange={(e) =>
                  setPostFormData((prev) => ({
                    ...prev,
                    postContent: e.target.value,
                  }))
                }
              />
              <p className="text-xs text-muted-foreground">
                {postFormData.postContent.length} characters
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="campaignId">Campaign (optional)</Label>
                <Select
                  value={postFormData.campaignId}
                  onValueChange={(value) =>
                    setPostFormData((prev) => ({ ...prev, campaignId: value }))
                  }
                >
                  <SelectTrigger id="campaignId">
                    <SelectValue placeholder="No campaign" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">No campaign</SelectItem>
                    {campaigns.map((campaign) => (
                      <SelectItem key={campaign.id} value={campaign.id}>
                        {campaign.campaignName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="scheduledDate">Scheduled Date/Time</Label>
                <Input
                  id="scheduledDate"
                  type="datetime-local"
                  value={postFormData.scheduledDate}
                  onChange={(e) =>
                    setPostFormData((prev) => ({
                      ...prev,
                      scheduledDate: e.target.value,
                    }))
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="hashtags">Hashtags</Label>
              <Input
                id="hashtags"
                placeholder="#brand #product #launch"
                value={postFormData.hashtags}
                onChange={(e) =>
                  setPostFormData((prev) => ({ ...prev, hashtags: e.target.value }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="taggedAccounts">Tagged Accounts</Label>
              <Input
                id="taggedAccounts"
                placeholder="@account1 @account2"
                value={postFormData.taggedAccounts}
                onChange={(e) =>
                  setPostFormData((prev) => ({
                    ...prev,
                    taggedAccounts: e.target.value,
                  }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes (internal)</Label>
              <Textarea
                id="notes"
                placeholder="Add any internal notes..."
                rows={2}
                value={postFormData.notes}
                onChange={(e) =>
                  setPostFormData((prev) => ({ ...prev, notes: e.target.value }))
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsPostDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleSavePost} disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>{editingPost ? "Update" : "Create"} Post</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
