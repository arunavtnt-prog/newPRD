"use client";

import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface NotificationSettingsProps {
  userId: string;
}

export function NotificationSettings({ userId }: NotificationSettingsProps) {
  const [isSaving, setIsSaving] = React.useState(false);
  const [notifications, setNotifications] = React.useState({
    emailApprovals: true,
    emailComments: true,
    emailMentions: true,
    emailUpdates: false,
    pushApprovals: true,
    pushComments: false,
    pushMentions: true,
    pushUpdates: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      // API call would go here
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Notification preferences updated");
    } catch (error) {
      toast.error("Failed to update preferences");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Preferences</CardTitle>
        <CardDescription>
          Choose how you want to be notified about updates
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Notifications */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Email Notifications</h3>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="emailApprovals">Approval Requests</Label>
                <p className="text-sm text-muted-foreground">
                  Get notified when you're assigned to review assets
                </p>
              </div>
              <Switch
                id="emailApprovals"
                checked={notifications.emailApprovals}
                onCheckedChange={(checked) =>
                  setNotifications({ ...notifications, emailApprovals: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="emailComments">Comments</Label>
                <p className="text-sm text-muted-foreground">
                  Get notified about new comments on projects
                </p>
              </div>
              <Switch
                id="emailComments"
                checked={notifications.emailComments}
                onCheckedChange={(checked) =>
                  setNotifications({ ...notifications, emailComments: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="emailMentions">Mentions</Label>
                <p className="text-sm text-muted-foreground">
                  Get notified when someone mentions you
                </p>
              </div>
              <Switch
                id="emailMentions"
                checked={notifications.emailMentions}
                onCheckedChange={(checked) =>
                  setNotifications({ ...notifications, emailMentions: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="emailUpdates">Project Updates</Label>
                <p className="text-sm text-muted-foreground">
                  Weekly summary of project activity
                </p>
              </div>
              <Switch
                id="emailUpdates"
                checked={notifications.emailUpdates}
                onCheckedChange={(checked) =>
                  setNotifications({ ...notifications, emailUpdates: checked })
                }
              />
            </div>
          </div>

          {/* Push Notifications */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Push Notifications</h3>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="pushApprovals">Approval Requests</Label>
                <p className="text-sm text-muted-foreground">
                  Instant notifications for urgent approvals
                </p>
              </div>
              <Switch
                id="pushApprovals"
                checked={notifications.pushApprovals}
                onCheckedChange={(checked) =>
                  setNotifications({ ...notifications, pushApprovals: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="pushMentions">Mentions</Label>
                <p className="text-sm text-muted-foreground">
                  Get push notifications when mentioned
                </p>
              </div>
              <Switch
                id="pushMentions"
                checked={notifications.pushMentions}
                onCheckedChange={(checked) =>
                  setNotifications({ ...notifications, pushMentions: checked })
                }
              />
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline">
              Reset to Defaults
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Preferences
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
