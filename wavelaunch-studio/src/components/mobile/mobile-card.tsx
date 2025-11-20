"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface MobileCardProps {
  title: string;
  subtitle?: string;
  badge?: {
    text: string;
    variant?: "default" | "secondary" | "outline" | "destructive";
  };
  metadata?: Array<{
    label: string;
    value: string;
  }>;
  actions?: Array<{
    label: string;
    onClick?: () => void;
    href?: string;
    variant?: "default" | "destructive";
  }>;
  href?: string;
  className?: string;
}

export function MobileCard({
  title,
  subtitle,
  badge,
  metadata = [],
  actions = [],
  href,
  className,
}: MobileCardProps) {
  const hasActions = actions.length > 0;

  const content = (
    <Card className={cn("touch-manipulation", className)}>
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm leading-tight truncate mb-1">
              {title}
            </h3>
            {subtitle && (
              <p className="text-xs text-muted-foreground truncate">
                {subtitle}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {badge && (
              <Badge variant={badge.variant || "default"} className="text-xs">
                {badge.text}
              </Badge>
            )}
            {hasActions && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 -mr-2"
                  >
                    <MoreVertical className="h-4 w-4" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {actions.map((action, index) => (
                    <DropdownMenuItem
                      key={index}
                      onClick={action.onClick}
                      asChild={!!action.href}
                      className={cn(
                        action.variant === "destructive" && "text-destructive"
                      )}
                    >
                      {action.href ? (
                        <Link href={action.href}>{action.label}</Link>
                      ) : (
                        <span>{action.label}</span>
                      )}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            {href && !hasActions && <ChevronRight className="h-4 w-4 text-muted-foreground" />}
          </div>
        </div>

        {/* Metadata */}
        {metadata.length > 0 && (
          <div className="grid grid-cols-2 gap-2 text-xs">
            {metadata.map((item, index) => (
              <div key={index}>
                <span className="text-muted-foreground">{item.label}:</span>
                <span className="ml-1 font-medium">{item.value}</span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );

  if (href && !hasActions) {
    return (
      <Link href={href} className="block">
        {content}
      </Link>
    );
  }

  return content;
}

interface MobileCardListProps {
  cards: MobileCardProps[];
  emptyMessage?: string;
}

export function MobileCardList({
  cards,
  emptyMessage = "No items to display",
}: MobileCardListProps) {
  if (cards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-sm text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {cards.map((card, index) => (
        <MobileCard key={index} {...card} />
      ))}
    </div>
  );
}
