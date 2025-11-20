"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { differenceInDays, format } from "date-fns";

interface TimeToLaunchChartProps {
  projects: Array<{
    id: string;
    projectName: string;
    startDate: Date;
    updatedAt: Date;
  }>;
}

export function TimeToLaunchChart({ projects }: TimeToLaunchChartProps) {
  if (projects.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Time to Launch Trend</CardTitle>
          <CardDescription>Days from start to completion</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[300px]">
          <p className="text-sm text-muted-foreground">No completed projects yet</p>
        </CardContent>
      </Card>
    );
  }

  // Prepare data with time to launch in days
  const chartData = projects
    .map((project) => ({
      name: project.projectName.substring(0, 15) + (project.projectName.length > 15 ? "..." : ""),
      days: differenceInDays(project.updatedAt, project.startDate),
      completedDate: format(project.updatedAt, "MMM dd"),
    }))
    .slice(-10); // Show last 10 projects

  // Calculate average
  const avgDays = Math.round(
    chartData.reduce((sum, item) => sum + item.days, 0) / chartData.length
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Time to Launch Trend</CardTitle>
        <CardDescription>
          Days from start to completion (Last 10 projects)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="completedDate"
              className="text-xs"
              tick={{ fill: "currentColor" }}
            />
            <YAxis
              className="text-xs"
              tick={{ fill: "currentColor" }}
              label={{
                value: "Days",
                angle: -90,
                position: "insideLeft",
                style: { textAnchor: "middle" },
              }}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-background border rounded-lg p-3 shadow-lg">
                      <p className="font-semibold">{data.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Time to Launch: {data.days} days
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Completed: {data.completedDate}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="days"
              name="Days to Launch"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey={() => avgDays}
              name="Average"
              stroke="#f59e0b"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
