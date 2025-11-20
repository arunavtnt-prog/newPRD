/**
 * Request Approval Dialog
 *
 * Modal form for requesting approval from team members
 */

"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";
import { CalendarIcon, Loader2, UserCheck } from "lucide-react";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

// Form validation schema
const requestApprovalSchema = z.object({
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(500, "Message must be less than 500 characters"),
  dueDate: z.date().optional(),
  reviewerIds: z.array(z.string()).min(1, "Select at least one reviewer"),
});

type RequestApprovalFormValues = z.infer<typeof requestApprovalSchema>;

interface RequestApprovalDialogProps {
  children: React.ReactNode;
  projectId: string;
  availableReviewers: Array<{
    id: string;
    fullName: string;
    email: string;
  }>;
}

export function RequestApprovalDialog({
  children,
  projectId,
  availableReviewers,
}: RequestApprovalDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const router = useRouter();

  const form = useForm<RequestApprovalFormValues>({
    resolver: zodResolver(requestApprovalSchema),
    defaultValues: {
      message: "",
      reviewerIds: [],
    },
  });

  async function onSubmit(data: RequestApprovalFormValues) {
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/projects/${projectId}/approvals`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to request approval");
      }

      toast.success("Approval request sent successfully!");
      setOpen(false);
      form.reset();
      router.refresh();
    } catch (error) {
      console.error("Error requesting approval:", error);
      toast.error("Failed to request approval. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Request Approval</DialogTitle>
          <DialogDescription>
            Request team members to review and approve project deliverables
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Message */}
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe what needs to be reviewed (e.g., Please review the updated brand logo designs)"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Provide context about what you're requesting approval for
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Due Date */}
            <FormField
              control={form.control}
              name="dueDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Due Date (Optional)</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date < new Date(new Date().setHours(0, 0, 0, 0))
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    When do you need this approval by?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Reviewers */}
            <FormField
              control={form.control}
              name="reviewerIds"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel>Select Reviewers *</FormLabel>
                    <FormDescription>
                      Choose team members to review and approve
                    </FormDescription>
                  </div>
                  {availableReviewers.length > 0 ? (
                    <div className="space-y-2 max-h-[200px] overflow-y-auto border rounded-lg p-3">
                      {availableReviewers.map((reviewer) => (
                        <FormField
                          key={reviewer.id}
                          control={form.control}
                          name="reviewerIds"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={reviewer.id}
                                className="flex flex-row items-start space-x-3 space-y-0 py-2"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(reviewer.id)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([
                                            ...field.value,
                                            reviewer.id,
                                          ])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== reviewer.id
                                            )
                                          );
                                    }}
                                  />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                  <FormLabel className="font-normal cursor-pointer">
                                    {reviewer.fullName}
                                  </FormLabel>
                                  <p className="text-xs text-muted-foreground">
                                    {reviewer.email}
                                  </p>
                                </div>
                              </FormItem>
                            );
                          }}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground py-4 text-center border rounded-lg">
                      No team members available for review
                    </div>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                <UserCheck className="mr-2 h-4 w-4" />
                Request Approval
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
