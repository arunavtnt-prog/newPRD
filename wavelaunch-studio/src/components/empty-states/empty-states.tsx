/**
 * Empty State Components
 *
 * Reusable empty state components for different content types
 */

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  FolderOpen,
  Users,
  FileText,
  Image,
  MessageSquare,
  CheckCircle,
  Search,
  Phases,
  Megaphone,
  Bell,
  Package,
  ShoppingCart,
  Calendar,
  Sparkles,
  Palette,
  UserPlus,
  CircleDot,
} from "lucide-react";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className = "",
}: EmptyStateProps) {
  return (
    <Card className={`border-dashed ${className}`}>
      <CardContent className="flex flex-col items-center justify-center py-12 px-6 text-center">
        {icon && (
          <div className="mb-4 rounded-full bg-muted p-4">{icon}</div>
        )}
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground mb-6 max-w-md">
          {description}
        </p>
        {action && (
          <Button onClick={action.onClick} size="default">
            {action.label}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

export function EmptyProjects({ onCreateProject }: { onCreateProject?: () => void }) {
  return (
    <EmptyState
      icon={<FolderOpen className="h-8 w-8 text-muted-foreground" />}
      title="No projects yet"
      description="Get started by creating your first project. You'll be able to track all your product launches and manage phases from discovery to launch."
      action={
        onCreateProject
          ? {
              label: "Create Your First Project",
              onClick: onCreateProject,
            }
          : undefined
      }
    />
  );
}

export function EmptyTeamMembers({ onInviteMember }: { onInviteMember?: () => void }) {
  return (
    <EmptyState
      icon={<Users className="h-8 w-8 text-muted-foreground" />}
      title="No team members found"
      description="Build your team by inviting members to collaborate on projects. Team members can be assigned roles and access different parts of the platform."
      action={
        onInviteMember
          ? {
              label: "Invite Team Member",
              onClick: onInviteMember,
            }
          : undefined
      }
    />
  );
}

export function EmptyFiles({ onUploadFile }: { onUploadFile?: () => void }) {
  return (
    <EmptyState
      icon={<FileText className="h-8 w-8 text-muted-foreground" />}
      title="No files uploaded"
      description="Upload project files, documents, and resources. Keep everything organized in one place for easy access by your team."
      action={
        onUploadFile
          ? {
              label: "Upload File",
              onClick: onUploadFile,
            }
          : undefined
      }
    />
  );
}

export function EmptyAssets({ onAddAsset }: { onAddAsset?: () => void }) {
  return (
    <EmptyState
      icon={<Image className="h-8 w-8 text-muted-foreground" />}
      title="No assets yet"
      description="Add visual assets like images, logos, and design files. Keep all your creative work organized and accessible."
      action={
        onAddAsset
          ? {
              label: "Add Asset",
              onClick: onAddAsset,
            }
          : undefined
      }
    />
  );
}

export function EmptyComments() {
  return (
    <EmptyState
      icon={<MessageSquare className="h-8 w-8 text-muted-foreground" />}
      title="No comments yet"
      description="Be the first to leave a comment. Share your thoughts, ask questions, or provide feedback to your team."
    />
  );
}

export function EmptyApprovals() {
  return (
    <EmptyState
      icon={<CheckCircle className="h-8 w-8 text-muted-foreground" />}
      title="No pending approvals"
      description="You're all caught up! There are no approval requests waiting for your review at this time."
    />
  );
}

export function EmptySearchResults({ query }: { query?: string }) {
  return (
    <EmptyState
      icon={<Search className="h-8 w-8 text-muted-foreground" />}
      title="No results found"
      description={
        query
          ? `We couldn't find any results for "${query}". Try adjusting your search terms or filters.`
          : "Try adjusting your search terms or filters to find what you're looking for."
      }
    />
  );
}

export function EmptyPhases({ onAddPhase }: { onAddPhase?: () => void }) {
  return (
    <EmptyState
      icon={<CircleDot className="h-8 w-8 text-muted-foreground" />}
      title="No phases configured"
      description="Set up project phases to organize your workflow. Track progress from discovery through launch with milestone-based phases."
      action={
        onAddPhase
          ? {
              label: "Add Phase",
              onClick: onAddPhase,
            }
          : undefined
      }
    />
  );
}

export function EmptyCampaigns({ onCreateCampaign }: { onCreateCampaign?: () => void }) {
  return (
    <EmptyState
      icon={<Megaphone className="h-8 w-8 text-muted-foreground" />}
      title="No campaigns yet"
      description="Create marketing campaigns to promote your product. Plan content, manage ads, and track performance all in one place."
      action={
        onCreateCampaign
          ? {
              label: "Create Campaign",
              onClick: onCreateCampaign,
            }
          : undefined
      }
    />
  );
}

export function EmptyNotifications() {
  return (
    <EmptyState
      icon={<Bell className="h-8 w-8 text-muted-foreground" />}
      title="No notifications"
      description="You're all caught up! You'll see notifications here when there are updates, mentions, or approval requests."
    />
  );
}

export function EmptyProductSKUs({ onAddSKU }: { onAddSKU?: () => void }) {
  return (
    <EmptyState
      icon={<Package className="h-8 w-8 text-muted-foreground" />}
      title="No products defined"
      description="Add product SKUs to track different variations, manage prototypes, and organize your product line."
      action={
        onAddSKU
          ? {
              label: "Add Product SKU",
              onClick: onAddSKU,
            }
          : undefined
      }
    />
  );
}

export function EmptyPurchaseOrders({ onCreatePO }: { onCreatePO?: () => void }) {
  return (
    <EmptyState
      icon={<ShoppingCart className="h-8 w-8 text-muted-foreground" />}
      title="No purchase orders"
      description="Create purchase orders to manage vendor relationships, track shipments, and handle quality control checkpoints."
      action={
        onCreatePO
          ? {
              label: "Create Purchase Order",
              onClick: onCreatePO,
            }
          : undefined
      }
    />
  );
}

export function EmptyContentCalendar({ onAddContent }: { onAddContent?: () => void }) {
  return (
    <EmptyState
      icon={<Calendar className="h-8 w-8 text-muted-foreground" />}
      title="No content scheduled"
      description="Plan your content calendar by scheduling posts, articles, and social media content. Keep your launch timeline organized."
      action={
        onAddContent
          ? {
              label: "Schedule Content",
              onClick: onAddContent,
            }
          : undefined
      }
    />
  );
}

export function EmptyInfluencers({ onAddInfluencer }: { onAddInfluencer?: () => void }) {
  return (
    <EmptyState
      icon={<UserPlus className="h-8 w-8 text-muted-foreground" />}
      title="No influencers yet"
      description="Build relationships with influencers to promote your product. Track partnerships, manage UGC submissions, and measure impact."
      action={
        onAddInfluencer
          ? {
              label: "Add Influencer",
              onClick: onAddInfluencer,
            }
          : undefined
      }
    />
  );
}

export function EmptyColorPalettes({ onCreatePalette }: { onCreatePalette?: () => void }) {
  return (
    <EmptyState
      icon={<Palette className="h-8 w-8 text-muted-foreground" />}
      title="No color palettes"
      description="Create color palettes for your brand identity. Define primary, secondary, and accent colors to maintain consistency."
      action={
        onCreatePalette
          ? {
              label: "Create Palette",
              onClick: onCreatePalette,
            }
          : undefined
      }
    />
  );
}

export function EmptyAds({ onCreateAd }: { onCreateAd?: () => void }) {
  return (
    <EmptyState
      icon={<Sparkles className="h-8 w-8 text-muted-foreground" />}
      title="No ad creatives"
      description="Design and manage ad creatives for your campaigns. Upload visuals, write copy, and track performance across platforms."
      action={
        onCreateAd
          ? {
              label: "Create Ad",
              onClick: onCreateAd,
            }
          : undefined
      }
    />
  );
}
