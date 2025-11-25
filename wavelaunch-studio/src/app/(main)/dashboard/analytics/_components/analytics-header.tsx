"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Filter, Loader2 } from "lucide-react";
import { toast } from "sonner";

export function AnalyticsHeader() {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const response = await fetch("/api/analytics/export");

      if (!response.ok) {
        throw new Error("Failed to export analytics");
      }

      // Get the CSV file blob
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      // Create download link and trigger download
      const a = document.createElement("a");
      a.href = url;
      a.download = `wavelaunch-analytics-${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      toast.success("Analytics exported successfully!");
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export analytics");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="text-muted-foreground mt-1">
          Track project performance and team productivity
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleExport}
          disabled={isExporting}
        >
          {isExporting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Exporting...
            </>
          ) : (
            <>
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
