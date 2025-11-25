"use client";

import { Card, CardContent } from "@/components/ui/card";
import { FolderOpen, Activity, CheckCircle, Clock } from "lucide-react";

interface ClientDashboardStatsProps {
  stats: {
    totalProjects: number;
    activeProjects: number;
    completedProjects: number;
    pendingApprovals: number;
  };
}

export function ClientDashboardStats({ stats }: ClientDashboardStatsProps) {
  const statCards = [
    {
      label: "Total Projects",
      value: stats.totalProjects,
      icon: FolderOpen,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      label: "Active Projects",
      value: stats.activeProjects,
      icon: Activity,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      label: "Completed",
      value: stats.completedProjects,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      label: "Pending Approvals",
      value: stats.pendingApprovals,
      icon: Clock,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.label} className="border-purple-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.label}
                  </p>
                  <p className="text-3xl font-bold mt-2">{stat.value}</p>
                </div>
                <div className={`${stat.bgColor} p-3 rounded-lg`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
