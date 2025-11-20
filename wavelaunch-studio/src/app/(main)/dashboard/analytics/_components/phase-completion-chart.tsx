"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
} from "recharts";

interface PhaseCompletionChartProps {
  data: Array<{
    phase: string;
    completionRate: number;
    total: number;
    completed: number;
  }>;
}

const getColorByRate = (rate: number) => {
  if (rate >= 80) return "#22c55e"; // green
  if (rate >= 60) return "#3b82f6"; // blue
  if (rate >= 40) return "#f59e0b"; // amber
  return "#ef4444"; // red
};

export function PhaseCompletionChart({ data }: PhaseCompletionChartProps) {
  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Phase Completion Rates</CardTitle>
          <CardDescription>Completion percentage by milestone</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[300px]">
          <p className="text-sm text-muted-foreground">No phase data available</p>
        </CardContent>
      </Card>
    );
  }

  // Sort data by phase order (M0, M1, M2, etc.)
  const sortedData = [...data].sort((a, b) => {
    const aNum = parseInt(a.phase.replace("M", ""));
    const bNum = parseInt(b.phase.replace("M", ""));
    return aNum - bNum;
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Phase Completion Rates</CardTitle>
        <CardDescription>Completion percentage by milestone</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={sortedData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="phase"
              className="text-xs"
              tick={{ fill: "currentColor" }}
            />
            <YAxis
              className="text-xs"
              tick={{ fill: "currentColor" }}
              label={{
                value: "Completion %",
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
                      <p className="font-semibold">{data.phase}</p>
                      <p className="text-sm text-muted-foreground">
                        Completion Rate: {data.completionRate}%
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Completed: {data.completed} / {data.total}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="completionRate" radius={[4, 4, 0, 0]}>
              {sortedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getColorByRate(entry.completionRate)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
