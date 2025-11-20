"use client";

import { Button } from "@/components/ui/button";
import { Plus, Users } from "lucide-react";
import { InviteTeamMemberDialog } from "./invite-team-member-dialog";

interface TeamHeaderProps {
  totalMembers: number;
}

export function TeamHeader({ totalMembers }: TeamHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Users className="h-8 w-8" />
          Team Management
        </h1>
        <p className="text-muted-foreground mt-1">
          Manage team members, roles, and permissions ({totalMembers} members)
        </p>
      </div>
      <InviteTeamMemberDialog>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Invite Member
        </Button>
      </InviteTeamMemberDialog>
    </div>
  );
}
