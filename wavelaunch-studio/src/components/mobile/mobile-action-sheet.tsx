"use client";

import * as React from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ActionSheetAction {
  label: string;
  onClick: () => void;
  variant?: "default" | "destructive" | "outline" | "secondary";
  icon?: React.ComponentType<{ className?: string }>;
  disabled?: boolean;
}

interface MobileActionSheetProps {
  trigger: React.ReactNode;
  title: string;
  description?: string;
  actions: ActionSheetAction[];
  children?: React.ReactNode;
}

export function MobileActionSheet({
  trigger,
  title,
  description,
  actions,
  children,
}: MobileActionSheetProps) {
  const [open, setOpen] = React.useState(false);

  const handleAction = (action: ActionSheetAction) => {
    action.onClick();
    setOpen(false);
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{trigger}</DrawerTrigger>
      <DrawerContent className="max-h-[90vh]">
        <DrawerHeader className="text-left border-b">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <DrawerTitle>{title}</DrawerTitle>
              {description && (
                <DrawerDescription className="mt-1">
                  {description}
                </DrawerDescription>
              )}
            </div>
            <DrawerClose asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2">
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </Button>
            </DrawerClose>
          </div>
        </DrawerHeader>

        {children && (
          <div className="p-4 max-h-[50vh] overflow-y-auto">{children}</div>
        )}

        <DrawerFooter className="pt-4 border-t">
          <div className="space-y-2 w-full">
            {actions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Button
                  key={index}
                  variant={action.variant || "default"}
                  className={cn(
                    "w-full h-12 touch-manipulation",
                    action.variant === "destructive" && "text-destructive-foreground"
                  )}
                  onClick={() => handleAction(action)}
                  disabled={action.disabled}
                >
                  {Icon && <Icon className="mr-2 h-5 w-5" />}
                  {action.label}
                </Button>
              );
            })}
          </div>
          <DrawerClose asChild>
            <Button variant="outline" className="w-full h-12">
              Cancel
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

interface QuickActionSheetProps {
  trigger: React.ReactNode;
  actions: ActionSheetAction[];
}

export function QuickActionSheet({ trigger, actions }: QuickActionSheetProps) {
  const [open, setOpen] = React.useState(false);

  const handleAction = (action: ActionSheetAction) => {
    action.onClick();
    setOpen(false);
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{trigger}</DrawerTrigger>
      <DrawerContent>
        <div className="p-4 space-y-2">
          {actions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Button
                key={index}
                variant={action.variant || "outline"}
                className={cn(
                  "w-full h-12 justify-start touch-manipulation",
                  action.variant === "destructive" && "text-destructive"
                )}
                onClick={() => handleAction(action)}
                disabled={action.disabled}
              >
                {Icon && <Icon className="mr-2 h-5 w-5" />}
                {action.label}
              </Button>
            );
          })}
          <DrawerClose asChild>
            <Button variant="ghost" className="w-full h-12">
              Cancel
            </Button>
          </DrawerClose>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
