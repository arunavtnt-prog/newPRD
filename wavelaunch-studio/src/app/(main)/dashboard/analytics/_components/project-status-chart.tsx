"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

interface ProjectStatusChartProps {
  data: Array<{
    status: string;
    count: number;
    percentage: number;
  }>;
}

const COLORS = {
  DISCOVERY: "#3b82f6", // blue
  BRANDING: "#8b5cf6", // purple
  "PRODUCT DEV": "#06b6d4", // cyan
  MANUFACTURING: "#f59e0b", // amber
  WEBSITE: "#10b981", // green
  MARKETING: "#ec4899", // pink
  LAUNCH: "#6366f1", // indigo
  COMPLETED: "#22c55e", // green
  ARCHIVED: "#6b7280", // gray
};

export function ProjectStatusChart({ data }: ProjectStatusChartProps) {
  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Project Status Distribution</CardTitle>
          <CardDescription>Breakdown by current phase</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[300px]">
          <p className="text-sm text-muted-foreground">No project data available</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Status Distribution</CardTitle>
        <CardDescription>Breakdown by current phase</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ percentage }) => `${percentage}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="count"
              nameKey="status"
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[entry.status.toUpperCase().replace(/ /g, "_")] || "#94a3b8"}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number, name: string, props: any) => [
                `${value} projects (${props.payload.percentage}%)`,
                name,
              ]}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
