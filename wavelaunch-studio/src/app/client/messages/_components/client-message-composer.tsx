"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Send, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface Project {
  id: string;
  projectName: string;
  leadStrategist: {
    id: string;
    fullName: string;
    avatarUrl: string | null;
    email: string;
  } | null;
}

interface ClientMessageComposerProps {
  projects: Project[];
}

export function ClientMessageComposer({ projects }: ClientMessageComposerProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    projectId: "",
    message: "",
  });

  const selectedProject = projects.find((p) => p.id === formData.projectId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.projectId) {
      setError("Please select a project");
      return;
    }

    if (!formData.message.trim()) {
      setError("Please enter a message");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/messages/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: formData.projectId,
          message: formData.message.trim(),
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to send message");
      }

      toast.success("Message sent successfully");
      setFormData({ projectId: "", message: "" });
      router.refresh();
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  if (projects.length === 0) {
    return (
      <Card className="border-purple-100">
        <CardContent className="p-6 text-center text-muted-foreground">
          <p className="text-sm">
            No projects available. You'll be able to send messages once your first
            project is created.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-purple-100">
      <CardHeader>
        <CardTitle>Send Message</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Project Selection */}
          <div className="space-y-2">
            <Label htmlFor="project">Project</Label>
            <Select
              value={formData.projectId}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, projectId: value }))
              }
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a project" />
              </SelectTrigger>
              <SelectContent>
                {projects.map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.projectName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {selectedProject?.leadStrategist && (
              <p className="text-xs text-muted-foreground">
                Message will be sent to {selectedProject.leadStrategist.fullName}
              </p>
            )}
          </div>

          {/* Message */}
          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              placeholder="Type your message here..."
              value={formData.message}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, message: e.target.value }))
              }
              disabled={isLoading}
              rows={6}
            />
          </div>

          {/* Submit Button */}
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Send Message
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
