/**
 * Projects Table Columns Definition
 *
 * Defines columns for the projects data table
 */

"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { format } from "date-fns";

export type ProjectRow = {
  id: string;
  projectName: string;
  creatorName: string;
  category: string;
  status: string;
  currentPhase: string;
  leadStrategist: string;
  startDate: Date;
  expectedLaunchDate: Date;
  updatedAt: Date;
};

export const columns: ColumnDef<ProjectRow>[] = [
  {
    accessorKey: "projectName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Project Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <Link
          href={`/dashboard/projects/${row.original.id}`}
          className="font-medium hover:underline"
        >
          {row.getValue("projectName")}
        </Link>
      );
    },
  },
  {
    accessorKey: "creatorName",
    header: "Creator",
    cell: ({ row }) => {
      return <div className="text-sm">{row.getValue("creatorName")}</div>;
    },
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => {
      const category = row.getValue("category") as string;
      return (
        <Badge variant="outline" className="text-xs">
          {category}
        </Badge>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const statusColors: Record<string, string> = {
        ONBOARDING: "bg-slate-100 text-slate-800",
        DISCOVERY: "bg-blue-100 text-blue-800",
        BRANDING: "bg-purple-100 text-purple-800",
        PRODUCT_DEV: "bg-green-100 text-green-800",
        MANUFACTURING: "bg-yellow-100 text-yellow-800",
        WEBSITE: "bg-orange-100 text-orange-800",
        MARKETING: "bg-pink-100 text-pink-800",
        LAUNCH: "bg-red-100 text-red-800",
        COMPLETED: "bg-emerald-100 text-emerald-800",
        ARCHIVED: "bg-gray-100 text-gray-800",
      };
      return (
        <Badge className={`${statusColors[status]} border-0 text-xs font-medium`}>
          {status.replace("_", " ")}
        </Badge>
      );
    },
  },
  {
    accessorKey: "currentPhase",
    header: "Current Phase",
    cell: ({ row }) => {
      return <div className="text-sm text-muted-foreground">{row.getValue("currentPhase")}</div>;
    },
  },
  {
    accessorKey: "leadStrategist",
    header: "Lead",
    cell: ({ row }) => {
      return <div className="text-sm">{row.getValue("leadStrategist")}</div>;
    },
  },
  {
    accessorKey: "updatedAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Last Updated
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = row.getValue("updatedAt") as Date;
      return <div className="text-sm text-muted-foreground">{format(date, "MMM d, yyyy")}</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const project = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <Link href={`/dashboard/projects/${project.id}`}>View details</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem disabled>Edit project</DropdownMenuItem>
            <DropdownMenuItem disabled>Assign team</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem disabled className="text-destructive">
              Archive project
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
