"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, XCircle, MessageSquare, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface ClientApprovalFormProps {
  approvalId: string;
}

export function ClientApprovalForm({ approvalId }: ClientApprovalFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [comments, setComments] = useState("");

  const handleSubmit = async (status: "APPROVED" | "REJECTED" | "CHANGES_REQUESTED") => {
    if (status !== "APPROVED" && !comments.trim()) {
      setError("Please provide comments when rejecting or requesting changes");
      return;
    }

    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch(`/api/approvals/${approvalId}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status,
          comments: comments.trim() || null,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to submit review");
      }

      toast.success(
        status === "APPROVED"
          ? "Approval submitted successfully"
          : status === "REJECTED"
          ? "Rejection submitted successfully"
          : "Change request submitted successfully"
      );

      router.push("/client/approvals");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "An error occurred");
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-purple-100">
      <CardHeader>
        <CardTitle>Submit Your Review</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Comments */}
        <div className="space-y-2">
          <Label htmlFor="comments">
            Comments <span className="text-muted-foreground">(optional for approval, required for rejection/changes)</span>
          </Label>
          <Textarea
            id="comments"
            placeholder="Add your feedback, questions, or concerns..."
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            disabled={isLoading}
            rows={5}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={() => handleSubmit("APPROVED")}
            disabled={isLoading}
            className="flex-1 bg-green-600 hover:bg-green-700"
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <CheckCircle className="mr-2 h-4 w-4" />
            )}
            Approve
          </Button>

          <Button
            onClick={() => handleSubmit("CHANGES_REQUESTED")}
            disabled={isLoading}
            variant="outline"
            className="flex-1"
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <MessageSquare className="mr-2 h-4 w-4" />
            )}
            Request Changes
          </Button>

          <Button
            onClick={() => handleSubmit("REJECTED")}
            disabled={isLoading}
            variant="destructive"
            className="flex-1"
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <XCircle className="mr-2 h-4 w-4" />
            )}
            Reject
          </Button>
        </div>

        <p className="text-xs text-muted-foreground text-center">
          Your review will be sent to the project team and recorded in the project timeline.
        </p>
      </CardContent>
    </Card>
  );
}
