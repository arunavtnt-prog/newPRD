/**
 * Metrics Row Component
 *
 * Displays key metrics: Active Projects, Pending Approvals, Alerts
 */

import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, AlertCircle } from "lucide-react";

interface Metric {
  title: string;
  value: string | number;
  change: string;
  trend?: "up" | "down" | "neutral";
}

interface MetricsRowProps {
  metrics: Metric[];
}

export function MetricsRow({ metrics }: MetricsRowProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {metrics.map((metric) => (
        <Card key={metric.title}>
          <CardHeader>
            <CardDescription>{metric.title}</CardDescription>
            <div className="flex items-center justify-between">
              <CardTitle className="text-3xl font-semibold">{metric.value}</CardTitle>
              {metric.trend === "up" && (
                <Badge variant="outline">
                  <TrendingUp className="h-3 w-3" />
                </Badge>
              )}
              {metric.trend === "neutral" && (
                <Badge variant="outline">
                  <AlertCircle className="h-3 w-3" />
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">{metric.change}</p>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}
