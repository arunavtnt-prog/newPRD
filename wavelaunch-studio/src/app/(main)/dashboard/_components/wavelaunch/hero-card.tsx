/**
 * Hero Card Component
 *
 * Displays "This Week at Wavelaunch" with top priorities
 */

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";

interface Priority {
  id: string;
  title: string;
  description: string;
  color: "orange" | "teal" | "amber";
}

interface HeroCardProps {
  priorities: Priority[];
  weekRange: string;
}

export function HeroCard({ priorities, weekRange }: HeroCardProps) {
  const colorMap = {
    orange: "bg-orange-500",
    teal: "bg-teal-500",
    amber: "bg-amber-500",
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-2xl">This Week at Wavelaunch</CardTitle>
            <CardDescription className="flex items-center gap-2 mt-1">
              <Clock className="h-4 w-4" />
              {weekRange}
            </CardDescription>
          </div>
          <Badge variant="outline">{priorities.length} priorities</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {priorities.length === 0 ? (
          <p className="text-sm text-muted-foreground">No priorities this week. Great job!</p>
        ) : (
          priorities.map((priority) => (
            <div key={priority.id} className="flex items-start gap-3">
              <div className={`h-2 w-2 rounded-full ${colorMap[priority.color]} mt-2`} />
              <div className="flex-1">
                <p className="font-medium">{priority.title}</p>
                <p className="text-sm text-muted-foreground">{priority.description}</p>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
