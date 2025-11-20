"use client";

import * as React from "react";
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
import { FormField, FormSelect } from "@/components/ui/form-field";
import { ValidationRules, useFormValidation } from "@/lib/validation";
import { toast } from "sonner";
import { Loader2, Mail } from "lucide-react";

interface InviteTeamMemberDialogProps {
  children: React.ReactNode;
}

export function InviteTeamMemberDialog({ children }: InviteTeamMemberDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [isSending, setIsSending] = React.useState(false);

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validate,
    reset,
  } = useFormValidation({
    email: "",
    fullName: "",
    role: "TEAM_MEMBER",
    department: "",
    jobTitle: "",
  });

  const validationRules = {
    email: [ValidationRules.required("Email"), ValidationRules.email()],
    fullName: [ValidationRules.required("Full name"), ValidationRules.minLength(2, "Full name")],
    role: [ValidationRules.required("Role")],
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields
    if (!validate(validationRules)) {
      toast.error("Please fix the errors in the form");
      return;
    }

    setIsSending(true);

    try {
      // API call would go here
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success(`Invitation sent to ${values.email}`);
      setOpen(false);
      reset();
    } catch (error) {
      toast.error("Failed to send invitation");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite Team Member</DialogTitle>
          <DialogDescription>
            Send an invitation email to add a new member to your team
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField
            label="Email Address"
            name="email"
            type="email"
            value={values.email}
            onChange={(value) => handleChange("email", value)}
            error={touched.email ? errors.email : undefined}
            placeholder="colleague@company.com"
            required
            autoComplete="email"
          />

          <FormField
            label="Full Name"
            name="fullName"
            value={values.fullName}
            onChange={(value) => handleChange("fullName", value)}
            error={touched.fullName ? errors.fullName : undefined}
            placeholder="John Doe"
            required
            autoComplete="name"
          />

          <FormSelect
            label="Role"
            name="role"
            value={values.role}
            onChange={(value) => handleChange("role", value)}
            error={touched.role ? errors.role : undefined}
            required
            options={[
              { value: "ADMIN", label: "Admin" },
              { value: "TEAM_MEMBER", label: "Team Member" },
              { value: "DESIGNER", label: "Designer" },
              { value: "CREATOR", label: "Creator" },
            ]}
          />

          <FormField
            label="Department"
            name="department"
            value={values.department}
            onChange={(value) => handleChange("department", value)}
            error={touched.department ? errors.department : undefined}
            placeholder="Creative, Operations, etc."
            description="Optional: Organizational department"
          />

          <FormField
            label="Job Title"
            name="jobTitle"
            value={values.jobTitle}
            onChange={(value) => handleChange("jobTitle", value)}
            error={touched.jobTitle ? errors.jobTitle : undefined}
            placeholder="Brand Strategist"
            description="Optional: Job role or position"
          />

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSending}>
              {isSending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isSending ? "Sending..." : (
                <>
                  <Mail className="mr-2 h-4 w-4" />
                  Send Invitation
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
