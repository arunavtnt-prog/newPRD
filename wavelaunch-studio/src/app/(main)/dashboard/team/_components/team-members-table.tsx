"use client";

import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { MoreHorizontal, Search, UserCheck, UserX, Edit, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { EmptySearchResults } from "@/components/empty-states/empty-states";

interface TeamMember {
  id: string;
  fullName: string;
  email: string;
  role: string;
  department: string;
  jobTitle: string;
  avatarUrl: string | null;
  isActive: boolean;
  projectsLead: number;
  joinedDate: Date;
}

interface TeamMembersTableProps {
  data: TeamMember[];
}

const ROLE_COLORS: Record<string, string> = {
  ADMIN: "default",
  TEAM_MEMBER: "secondary",
  DESIGNER: "outline",
  CREATOR: "outline",
};

export function TeamMembersTable({ data }: TeamMembersTableProps) {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [members, setMembers] = React.useState(data);

  const filteredMembers = members.filter((member) => {
    const query = searchQuery.toLowerCase();
    return (
      member.fullName.toLowerCase().includes(query) ||
      member.email.toLowerCase().includes(query) ||
      member.role.toLowerCase().includes(query) ||
      member.department.toLowerCase().includes(query)
    );
  });

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleToggleStatus = async (memberId: string, currentStatus: boolean) => {
    const newStatus = !currentStatus;
    toast.success(
      newStatus
        ? "Team member activated"
        : "Team member deactivated"
    );
    
    // Update local state
    setMembers(members.map(m => 
      m.id === memberId ? { ...m, isActive: newStatus } : m
    ));
  };

  const handleEditMember = (memberId: string) => {
    toast.info("Edit member dialog would open here");
  };

  const handleDeleteMember = (memberId: string, memberName: string) => {
    if (confirm(`Are you sure you want to remove ${memberName} from the team?`)) {
      toast.success(`${memberName} removed from team`);
      setMembers(members.filter(m => m.id !== memberId));
    }
  };

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search team members..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="text-sm text-muted-foreground">
          {filteredMembers.length} of {members.length} members
        </div>
      </div>

      {/* Table or Empty State */}
      {filteredMembers.length === 0 && searchQuery ? (
        <EmptySearchResults query={searchQuery} />
      ) : (
        <div className="border rounded-lg overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[200px]">Member</TableHead>
                <TableHead className="hidden sm:table-cell">Role</TableHead>
                <TableHead className="hidden md:table-cell">Department</TableHead>
                <TableHead className="hidden lg:table-cell">Projects Led</TableHead>
                <TableHead className="hidden sm:table-cell">Status</TableHead>
                <TableHead className="hidden md:table-cell">Joined</TableHead>
                <TableHead className="w-[70px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMembers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                    No team members found
                  </TableCell>
                </TableRow>
              ) : (
              filteredMembers.map((member) => (
                <TableRow key={member.id}>
                  <TableCell className="min-w-[200px]">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 flex-shrink-0">
                        <AvatarImage src={member.avatarUrl || undefined} />
                        <AvatarFallback>
                          {getInitials(member.fullName)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <div className="font-medium truncate">{member.fullName}</div>
                        <div className="text-sm text-muted-foreground truncate">
                          {member.email}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <Badge variant={ROLE_COLORS[member.role] as any}>
                      {member.role.replace("_", " ")}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div>
                      <div className="font-medium">{member.department}</div>
                      <div className="text-sm text-muted-foreground">
                        {member.jobTitle}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <Badge variant="outline">{member.projectsLead}</Badge>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    {member.isActive ? (
                      <Badge className="bg-green-500">
                        <UserCheck className="h-3 w-3 mr-1" />
                        Active
                      </Badge>
                    ) : (
                      <Badge variant="secondary">
                        <UserX className="h-3 w-3 mr-1" />
                        Inactive
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                    {format(new Date(member.joinedDate), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleEditMember(member.id)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Member
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleToggleStatus(member.id, member.isActive)}
                        >
                          {member.isActive ? (
                            <>
                              <UserX className="h-4 w-4 mr-2" />
                              Deactivate
                            </>
                          ) : (
                            <>
                              <UserCheck className="h-4 w-4 mr-2" />
                              Activate
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => handleDeleteMember(member.id, member.fullName)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Remove Member
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
