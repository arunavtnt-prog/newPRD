/**
 * Approvals Queue Component
 *
 * Displays pending approvals requiring attention
 */

import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, CheckCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Approval {
  id: string;
  projectName: string;
  assetCount: number;
  requestedBy: string;
  dueDate: Date | null;
  status: string;
}

interface ApprovalsQueueProps {
  approvals: Approval[];
}

export function ApprovalsQueue({ approvals }: ApprovalsQueueProps) {
  const pendingApprovals = approvals.filter((a) => a.status === "PENDING");

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Approvals Queue</CardTitle>
          <Badge variant={pendingApprovals.length > 0 ? "default" : "outline"}>
            {pendingApprovals.length}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {pendingApprovals.length === 0 ? (
            <div className="text-center py-8 px-4">
              <div className="mb-3 rounded-full bg-muted p-3 inline-block">
                <CheckCircle className="h-8 w-8 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium mb-1">All caught up!</p>
              <p className="text-xs text-muted-foreground">
                No pending approvals at the moment
              </p>
            </div>
          ) : (
            pendingApprovals.map((approval) => (
              <div
                key={approval.id}
                className="flex items-start justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{approval.projectName}</p>
                  <p className="text-sm text-muted-foreground">
                    {approval.assetCount} asset{approval.assetCount > 1 ? "s" : ""}
                  </p>
                  {approval.dueDate && (
                    <div className="flex items-center gap-1 mt-2">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        Due {formatDistanceToNow(approval.dueDate, { addSuffix: true })}
                      </span>
                    </div>
                  )}
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/dashboard/approvals/${approval.id}`}>Review</Link>
                </Button>
              </div>
            ))
          )}
        </div>
        {pendingApprovals.length > 0 && (
          <Button variant="link" className="w-full mt-4" asChild>
            <Link href="/dashboard/approvals">View All Approvals</Link>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
