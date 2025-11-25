/**
 * Business Plan Generator Component
 *
 * Client component for generating AI-powered business plan PDFs
 */

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { FileText, Loader2, Download, CheckCircle2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface BusinessPlanGeneratorProps {
  projectId: string;
  projectName: string;
  hasDiscoveryData: boolean;
}

export function BusinessPlanGenerator({
  projectId,
  projectName,
  hasDiscoveryData,
}: BusinessPlanGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [generatedFile, setGeneratedFile] = useState<{
    filename: string;
    downloadUrl: string;
    webViewLink: string;
  } | null>(null);

  const handleGenerate = async () => {
    if (!hasDiscoveryData) {
      toast.error(
        "Discovery data required. Please complete the Discovery phase first."
      );
      return;
    }

    setIsGenerating(true);
    setGeneratedFile(null);

    try {
      const response = await fetch("/api/documents/generate-business-plan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ projectId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate business plan");
      }

      setGeneratedFile({
        filename: data.file.filename,
        downloadUrl: data.file.downloadUrl,
        webViewLink: data.file.webViewLink,
      });

      toast.success("Business plan generated successfully!");
    } catch (error: any) {
      console.error("Error generating business plan:", error);
      toast.error(error.message || "Failed to generate business plan");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (generatedFile) {
      window.open(generatedFile.downloadUrl, "_blank");
    }
  };

  const handleViewInDrive = () => {
    if (generatedFile) {
      window.open(generatedFile.webViewLink, "_blank");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="w-full justify-start" size="sm">
          <FileText className="mr-2 h-4 w-4" />
          Generate Business Plan
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Generate Business Plan PDF</DialogTitle>
          <DialogDescription>
            Create a professionally branded business plan document for{" "}
            <span className="font-semibold">{projectName}</span>.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          {!hasDiscoveryData && (
            <Alert variant="destructive">
              <AlertDescription>
                Discovery data is required to generate a business plan. Please
                complete the Discovery phase (M1) first.
              </AlertDescription>
            </Alert>
          )}

          {hasDiscoveryData && !generatedFile && (
            <Alert>
              <FileText className="h-4 w-4" />
              <AlertDescription>
                This will generate a comprehensive business plan including:
                <ul className="list-disc list-inside mt-2 text-sm space-y-1">
                  <li>Executive Summary</li>
                  <li>Brand Overview & Strategy</li>
                  <li>Market Analysis & Target Audience</li>
                  <li>Product Strategy & Pricing</li>
                  <li>Marketing & Launch Plan</li>
                  <li>Timeline & Milestones</li>
                </ul>
              </AlertDescription>
            </Alert>
          )}

          {generatedFile && (
            <div className="rounded-lg border bg-muted/50 p-4 space-y-3">
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle2 className="h-5 w-5" />
                <span className="font-medium">Business Plan Generated!</span>
              </div>
              <div className="text-sm space-y-1">
                <p className="font-medium">{generatedFile.filename}</p>
                <p className="text-muted-foreground">
                  Your business plan has been saved to Google Drive.
                </p>
              </div>
              <div className="flex gap-2 pt-2">
                <Button
                  onClick={handleDownload}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download PDF
                </Button>
                <Button
                  onClick={handleViewInDrive}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  <FileText className="mr-2 h-4 w-4" />
                  View in Drive
                </Button>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          {!generatedFile ? (
            <>
              <Button
                variant="outline"
                onClick={() => setIsOpen(false)}
                disabled={isGenerating}
              >
                Cancel
              </Button>
              <Button
                onClick={handleGenerate}
                disabled={isGenerating || !hasDiscoveryData}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <FileText className="mr-2 h-4 w-4" />
                    Generate PDF
                  </>
                )}
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsOpen(false)} className="w-full">
              Done
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
