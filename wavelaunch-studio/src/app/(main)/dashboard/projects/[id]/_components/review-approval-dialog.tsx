/**
 * Review Approval Dialog Component
 *
 * Allows reviewers to approve or request changes on approval requests
 */

"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";

interface ReviewApprovalDialogProps {
  approvalId: string;
  reviewerId: string;
  currentStatus: string;
  children?: React.ReactNode;
}

export function ReviewApprovalDialog({
  approvalId,
  reviewerId,
  currentStatus,
  children,
}: ReviewApprovalDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [feedback, setFeedback] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const router = useRouter();

  // Reset form when dialog closes
  React.useEffect(() => {
    if (!open) {
      setFeedback("");
    }
  }, [open]);

  const handleReview = async (decision: "APPROVED" | "CHANGES_REQUESTED") => {
    if (decision === "CHANGES_REQUESTED" && !feedback.trim()) {
      toast.error("Please provide feedback when requesting changes");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/approvals/${approvalId}/review`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reviewerId,
          status: decision,
          feedbackText: feedback.trim() || null,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to submit review");
      }

      toast.success(
        decision === "APPROVED"
          ? "Approval submitted successfully"
          : "Changes requested successfully"
      );
      setOpen(false);
      router.refresh();
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to submit review"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Don't show dialog if already reviewed
  if (currentStatus !== "PENDING") {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || <Button size="sm">Review</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Review Approval Request</DialogTitle>
          <DialogDescription>
            Provide your feedback on this approval request. You can approve it
            or request changes.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="feedback">
              Feedback
              <span className="text-muted-foreground ml-1">
                (Required for changes)
              </span>
            </Label>
            <Textarea
              id="feedback"
              placeholder="Share your thoughts, suggestions, or required changes..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={5}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground">
              {feedback.length}/500 characters
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => handleReview("CHANGES_REQUESTED")}
            disabled={isSubmitting}
            className="border-amber-500 text-amber-700 hover:bg-amber-50 dark:text-amber-400 dark:hover:bg-amber-950"
          >
            <XCircle className="h-4 w-4 mr-2" />
            Request Changes
          </Button>
          <Button
            type="button"
            onClick={() => handleReview("APPROVED")}
            disabled={isSubmitting}
            className="bg-green-600 hover:bg-green-700"
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Approve
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
