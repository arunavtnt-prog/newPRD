/**
 * Launch Checklist Component
 *
 * Track pre-launch tasks and readiness
 */

"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  CheckSquare,
  Plus,
  Circle,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

interface LaunchChecklistProps {
  projectId: string;
  launchTasks: any[];
}

const CATEGORIES = [
  { value: "WEBSITE", label: "Website", icon: "🌐" },
  { value: "INVENTORY", label: "Inventory", icon: "📦" },
  { value: "MARKETING", label: "Marketing", icon: "📣" },
  { value: "LEGAL", label: "Legal", icon: "⚖️" },
  { value: "LOGISTICS", label: "Logistics", icon: "🚚" },
  { value: "CUSTOMER_SERVICE", label: "Customer Service", icon: "💬" },
  { value: "PAYMENT_SETUP", label: "Payment Setup", icon: "💳" },
  { value: "ANALYTICS", label: "Analytics", icon: "📊" },
  { value: "OTHER", label: "Other", icon: "📝" },
];

const PRIORITIES = [
  { value: "CRITICAL", label: "Critical", color: "destructive" },
  { value: "HIGH", label: "High", color: "default" },
  { value: "MEDIUM", label: "Medium", color: "secondary" },
  { value: "LOW", label: "Low", color: "outline" },
];

export function LaunchChecklist({
  projectId,
  launchTasks,
}: LaunchChecklistProps) {
  const { toast } = useToast();
  const [isTaskDialogOpen, setIsTaskDialogOpen] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);

  const [taskFormData, setTaskFormData] = React.useState({
    taskName: "",
    description: "",
    category: "WEBSITE",
    priority: "MEDIUM",
    dueDate: "",
    notes: "",
  });

  const handleCreateTask = () => {
    setTaskFormData({
      taskName: "",
      description: "",
      category: "WEBSITE",
      priority: "MEDIUM",
      dueDate: "",
      notes: "",
    });
    setIsTaskDialogOpen(true);
  };

  const handleSaveTask = async () => {
    if (!taskFormData.taskName) {
      toast({
        title: "Missing fields",
        description: "Task name is required",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);

    try {
      const response = await fetch(`/api/projects/${projectId}/launch-tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...taskFormData,
          dueDate: taskFormData.dueDate || null,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create task");
      }

      toast({
        title: "Task created",
      });

      setIsTaskDialogOpen(false);
      setTimeout(() => window.location.reload(), 1000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create task",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleComplete = async (task: any) => {
    try {
      const newStatus = task.status === "COMPLETED" ? "PENDING" : "COMPLETED";
      const response = await fetch(
        `/api/projects/${projectId}/launch-tasks/${task.id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            status: newStatus,
            completedDate: newStatus === "COMPLETED" ? new Date().toISOString() : null,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update task");
      }

      setTimeout(() => window.location.reload(), 500);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update task",
        variant: "destructive",
      });
    }
  };

  const completedTasks = launchTasks.filter((t) => t.status === "COMPLETED").length;
  const totalTasks = launchTasks.length;
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Group by category
  const groupedTasks = launchTasks.reduce((acc, task) => {
    if (!acc[task.category]) {
      acc[task.category] = [];
    }
    acc[task.category].push(task);
    return acc;
  }, {} as Record<string, any[]>);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Launch Checklist</h3>
          <p className="text-sm text-muted-foreground">
            Track all tasks before going live
          </p>
        </div>
        <Button onClick={handleCreateTask}>
          <Plus className="h-4 w-4 mr-2" />
          Add Task
        </Button>
      </div>

      {/* Progress */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Overall Progress</p>
              <p className="text-2xl font-bold">{progress}%</p>
            </div>
            <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              {completedTasks} of {totalTasks} tasks completed
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Tasks by Category */}
      {Object.keys(groupedTasks).length > 0 ? (
        <div className="space-y-6">
          {Object.entries(groupedTasks).map(([category, tasks]) => {
            const categoryInfo = CATEGORIES.find((c) => c.value === category);
            return (
              <div key={category} className="space-y-3">
                <h4 className="font-semibold text-sm flex items-center gap-2">
                  <span>{categoryInfo?.icon}</span>
                  <span>{categoryInfo?.label}</span>
                </h4>
                <div className="space-y-2">
                  {tasks.map((task) => {
                    const priority = PRIORITIES.find((p) => p.value === task.priority);
                    const isCompleted = task.status === "COMPLETED";

                    return (
                      <Card key={task.id}>
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="p-0 h-6 w-6 mt-0.5"
                              onClick={() => handleToggleComplete(task)}
                            >
                              {isCompleted ? (
                                <CheckCircle2 className="h-5 w-5 text-green-500" />
                              ) : (
                                <Circle className="h-5 w-5 text-muted-foreground" />
                              )}
                            </Button>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <p
                                  className={`font-medium ${
                                    isCompleted
                                      ? "line-through text-muted-foreground"
                                      : ""
                                  }`}
                                >
                                  {task.taskName}
                                </p>
                                <Badge variant={priority?.color as any}>
                                  {priority?.label}
                                </Badge>
                                {task.status === "BLOCKED" && (
                                  <Badge variant="destructive">
                                    <AlertCircle className="h-3 w-3 mr-1" />
                                    Blocked
                                  </Badge>
                                )}
                              </div>
                              {task.description && (
                                <p className="text-sm text-muted-foreground mb-2">
                                  {task.description}
                                </p>
                              )}
                              {task.dueDate && (
                                <p className="text-xs text-muted-foreground">
                                  Due: {format(new Date(task.dueDate), "MMM d, yyyy")}
                                </p>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <CheckSquare className="h-16 w-16 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium mb-2">No tasks yet</h3>
            <p className="text-muted-foreground text-center max-w-sm mb-6">
              Create a checklist to ensure you're ready to launch
            </p>
            <Button onClick={handleCreateTask}>
              <Plus className="h-4 w-4 mr-2" />
              Add First Task
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Task Dialog */}
      <Dialog open={isTaskDialogOpen} onOpenChange={setIsTaskDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Launch Task</DialogTitle>
            <DialogDescription>
              Create a task for your pre-launch checklist
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Task Name</Label>
              <Input
                placeholder="e.g., Set up payment gateway"
                value={taskFormData.taskName}
                onChange={(e) =>
                  setTaskFormData((prev) => ({ ...prev, taskName: e.target.value }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                placeholder="Task details..."
                rows={2}
                value={taskFormData.description}
                onChange={(e) =>
                  setTaskFormData((prev) => ({ ...prev, description: e.target.value }))
                }
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select
                  value={taskFormData.category}
                  onValueChange={(value) =>
                    setTaskFormData((prev) => ({ ...prev, category: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((c) => (
                      <SelectItem key={c.value} value={c.value}>
                        {c.icon} {c.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Priority</Label>
                <Select
                  value={taskFormData.priority}
                  onValueChange={(value) =>
                    setTaskFormData((prev) => ({ ...prev, priority: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PRIORITIES.map((p) => (
                      <SelectItem key={p.value} value={p.value}>
                        {p.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Due Date (optional)</Label>
              <Input
                type="date"
                value={taskFormData.dueDate}
                onChange={(e) =>
                  setTaskFormData((prev) => ({ ...prev, dueDate: e.target.value }))
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsTaskDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveTask} disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>Add Task</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
