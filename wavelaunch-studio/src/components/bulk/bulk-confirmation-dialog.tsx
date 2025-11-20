"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertTriangle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface BulkConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  operation: "updateStatus" | "assignLead" | "delete" | "approve" | "reject";
  selectedCount: number;
  selectedItems?: { id: string; name: string }[];
  onConfirm: (data?: any) => Promise<void>;
  isProcessing?: boolean;
  availableLeads?: { id: string; fullName: string }[];
}

export function BulkConfirmationDialog({
  open,
  onOpenChange,
  title,
  description,
  operation,
  selectedCount,
  selectedItems = [],
  onConfirm,
  isProcessing = false,
  availableLeads = [],
}: BulkConfirmationDialogProps) {
  const [statusValue, setStatusValue] = React.useState<string>("");
  const [leadValue, setLeadValue] = React.useState<string>("");
  const [feedback, setFeedback] = React.useState<string>("");

  const isDestructive = operation === "delete" || operation === "reject";
  const requiresFeedback = operation === "reject";
  const requiresStatus = operation === "updateStatus";
  const requiresLead = operation === "assignLead";

  const showItemList = selectedItems.length > 0 && selectedItems.length <= 10;

  const handleConfirm = async () => {
    let data: any = {};

    if (requiresStatus && statusValue) {
      data.status = statusValue;
    }
    if (requiresLead && leadValue) {
      data.leadStrategistId = leadValue;
    }
    if (requiresFeedback && feedback) {
      data.feedback = feedback;
    }

    await onConfirm(Object.keys(data).length > 0 ? data : undefined);

    // Reset form
    setStatusValue("");
    setLeadValue("");
    setFeedback("");
  };

  const canConfirm = () => {
    if (requiresFeedback && !feedback.trim()) return false;
    if (requiresStatus && !statusValue) return false;
    if (requiresLead && !leadValue) return false;
    return true;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isDestructive && (
              <AlertTriangle className="h-5 w-5 text-destructive" />
            )}
            {title}
          </DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Selected count badge */}
          <div className="flex items-center gap-2">
            <Badge variant={isDestructive ? "destructive" : "secondary"}>
              {selectedCount} {selectedCount === 1 ? "item" : "items"} selected
            </Badge>
          </div>

          {/* Show list of selected items if not too many */}
          {showItemList && (
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">
                Selected Items:
              </Label>
              <ScrollArea className="h-32 rounded-md border p-3">
                <ul className="space-y-1 text-sm">
                  {selectedItems.map((item) => (
                    <li key={item.id} className="truncate">
                      • {item.name}
                    </li>
                  ))}
                </ul>
              </ScrollArea>
            </div>
          )}

          {/* Status selection for updateStatus operation */}
          {requiresStatus && (
            <div className="space-y-2">
              <Label>New Status</Label>
              <Select value={statusValue} onValueChange={setStatusValue}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DISCOVERY">Discovery</SelectItem>
                  <SelectItem value="BRANDING">Branding</SelectItem>
                  <SelectItem value="PRODUCT_DEV">Product Development</SelectItem>
                  <SelectItem value="MANUFACTURING">Manufacturing</SelectItem>
                  <SelectItem value="WEBSITE">Website</SelectItem>
                  <SelectItem value="MARKETING">Marketing</SelectItem>
                  <SelectItem value="LAUNCH">Launch</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Lead selection for assignLead operation */}
          {requiresLead && (
            <div className="space-y-2">
              <Label>Assign Lead Strategist</Label>
              <Select value={leadValue} onValueChange={setLeadValue}>
                <SelectTrigger>
                  <SelectValue placeholder="Select lead strategist" />
                </SelectTrigger>
                <SelectContent>
                  {availableLeads.map((lead) => (
                    <SelectItem key={lead.id} value={lead.id}>
                      {lead.fullName}
                    </SelectItem>
                  ))}
                  {availableLeads.length === 0 && (
                    <SelectItem value="none" disabled>
                      No team members available
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Feedback textarea for reject operation */}
          {requiresFeedback && (
            <div className="space-y-2">
              <Label>
                Feedback <span className="text-destructive">*</span>
              </Label>
              <Textarea
                placeholder="Please provide feedback on what needs to be changed..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                rows={4}
                className={cn(
                  requiresFeedback &&
                    !feedback.trim() &&
                    "border-destructive focus-visible:ring-destructive"
                )}
              />
              <p className="text-xs text-muted-foreground">
                Feedback is required when requesting changes
              </p>
            </div>
          )}

          {/* Warning for destructive actions */}
          {isDestructive && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              <p className="font-medium">Warning</p>
              <p className="text-xs mt-1">
                {operation === "delete"
                  ? "This will archive the selected projects. They can be restored later."
                  : "This will request changes for all selected approvals. Make sure to provide clear feedback."}
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isProcessing}
          >
            Cancel
          </Button>
          <Button
            variant={isDestructive ? "destructive" : "default"}
            onClick={handleConfirm}
            disabled={isProcessing || !canConfirm()}
            className={cn(
              !isDestructive &&
                operation === "approve" &&
                "bg-green-600 hover:bg-green-700"
            )}
          >
            {isProcessing && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            {isProcessing
              ? "Processing..."
              : operation === "delete"
              ? "Archive"
              : operation === "reject"
              ? "Request Changes"
              : operation === "approve"
              ? "Approve All"
              : "Confirm"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
