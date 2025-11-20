import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface TeamPerformanceProps {
  teamMetrics: Array<{
    id: string;
    name: string;
    activeProjects: number;
    completedProjects: number;
    totalProjects: number;
  }>;
}

export function TeamPerformance({ teamMetrics }: TeamPerformanceProps) {
  // Sort by total projects descending
  const sortedMetrics = [...teamMetrics]
    .sort((a, b) => b.totalProjects - a.totalProjects)
    .slice(0, 8); // Show top 8

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getCompletionRate = (completed: number, total: number) => {
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  };

  if (sortedMetrics.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Team Performance</CardTitle>
          <CardDescription>Project leads and completion rates</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[300px]">
          <p className="text-sm text-muted-foreground">No team data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Team Performance</CardTitle>
        <CardDescription>Project leads and completion rates</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 max-h-[300px] overflow-y-auto">
        {sortedMetrics.map((member) => {
          const completionRate = getCompletionRate(
            member.completedProjects,
            member.totalProjects
          );

          return (
            <div key={member.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <Avatar className="h-10 w-10 flex-shrink-0">
                    <AvatarFallback className="text-sm">
                      {getInitials(member.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{member.name}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{member.totalProjects} projects</span>
                      <span>•</span>
                      <span>{member.activeProjects} active</span>
                    </div>
                  </div>
                </div>
                <Badge variant="outline" className="ml-2">
                  {completionRate}%
                </Badge>
              </div>
              <Progress value={completionRate} className="h-2" />
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
