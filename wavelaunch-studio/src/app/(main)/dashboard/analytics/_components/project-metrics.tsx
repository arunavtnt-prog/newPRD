import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FolderOpen,
  Loader2,
  CheckCircle2,
  Clock,
  TrendingUp,
  Calendar,
} from "lucide-react";

interface ProjectMetricsProps {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  onTimeProjects: number;
  avgTimeToLaunch: number;
  completionRate: number;
}

export function ProjectMetrics({
  totalProjects,
  activeProjects,
  completedProjects,
  onTimeProjects,
  avgTimeToLaunch,
  completionRate,
}: ProjectMetricsProps) {
  const metrics = [
    {
      title: "Total Projects",
      value: totalProjects,
      icon: FolderOpen,
      description: "All time",
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-100 dark:bg-blue-950",
    },
    {
      title: "Active Projects",
      value: activeProjects,
      icon: Loader2,
      description: "In progress",
      color: "text-amber-600 dark:text-amber-400",
      bgColor: "bg-amber-100 dark:bg-amber-950",
    },
    {
      title: "Completed",
      value: completedProjects,
      icon: CheckCircle2,
      description: `${completionRate}% completion rate`,
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-100 dark:bg-green-950",
    },
    {
      title: "On-Time Launches",
      value: onTimeProjects,
      icon: Clock,
      description: completedProjects > 0
        ? `${Math.round((onTimeProjects / completedProjects) * 100)}% on time`
        : "No completed projects",
      color: "text-purple-600 dark:text-purple-400",
      bgColor: "bg-purple-100 dark:bg-purple-950",
    },
    {
      title: "Avg Time to Launch",
      value: avgTimeToLaunch,
      suffix: "days",
      icon: Calendar,
      description: "From start to launch",
      color: "text-teal-600 dark:text-teal-400",
      bgColor: "bg-teal-100 dark:bg-teal-950",
    },
    {
      title: "Project Growth",
      value: "+12%",
      icon: TrendingUp,
      description: "vs last quarter",
      color: "text-indigo-600 dark:text-indigo-400",
      bgColor: "bg-indigo-100 dark:bg-indigo-950",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {metrics.map((metric) => {
        const Icon = metric.icon;
        return (
          <Card key={metric.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {metric.title}
              </CardTitle>
              <div className={`p-2 rounded-full ${metric.bgColor}`}>
                <Icon className={`h-4 w-4 ${metric.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {metric.value}
                {metric.suffix && (
                  <span className="text-sm font-normal text-muted-foreground ml-1">
                    {metric.suffix}
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {metric.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
