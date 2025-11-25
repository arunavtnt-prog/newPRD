/**
 * Create Project Dialog
 *
 * Dialog for quickly creating a new project
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2, Plus } from "lucide-react";

export function CreateProjectDialog() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  // Form state
  const [projectName, setProjectName] = useState("");
  const [creatorName, setCreatorName] = useState("");
  const [category, setCategory] = useState("");
  const [launchDate, setLaunchDate] = useState("");

  const handleCreate = async () => {
    if (!projectName || !creatorName || !category || !launchDate) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsCreating(true);

    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectName,
          creatorName,
          category,
          expectedLaunchDate: launchDate,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create project");
      }

      toast.success("Project created successfully!");
      setIsOpen(false);

      // Reset form
      setProjectName("");
      setCreatorName("");
      setCategory("");
      setLaunchDate("");

      // Navigate to new project
      router.push(`/dashboard/projects/${data.project.id}`);
    } catch (error: any) {
      console.error("Error creating project:", error);
      toast.error(error.message || "Failed to create project");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full justify-start">
          <Plus className="h-4 w-4 mr-2" />
          Create Project
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
          <DialogDescription>
            Start a new brand launch project. Fill in the basic details to get
            started.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="projectName">
              Project Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="projectName"
              placeholder="e.g., Bloom Cosmetics"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="creatorName">
              Creator Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="creatorName"
              placeholder="e.g., Sarah Johnson"
              value={creatorName}
              onChange={(e) => setCreatorName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">
              Category <span className="text-destructive">*</span>
            </Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger id="category">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="FASHION">Fashion</SelectItem>
                <SelectItem value="BEAUTY">Beauty</SelectItem>
                <SelectItem value="FITNESS">Fitness</SelectItem>
                <SelectItem value="LIFESTYLE">Lifestyle</SelectItem>
                <SelectItem value="OTHER">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="launchDate">
              Expected Launch Date <span className="text-destructive">*</span>
            </Label>
            <Input
              id="launchDate"
              type="date"
              value={launchDate}
              onChange={(e) => setLaunchDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={isCreating}
          >
            Cancel
          </Button>
          <Button onClick={handleCreate} disabled={isCreating}>
            {isCreating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Project"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
