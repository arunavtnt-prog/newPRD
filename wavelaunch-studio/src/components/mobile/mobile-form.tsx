"use client";

import * as React from "react";
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
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AlertCircle, Check } from "lucide-react";

interface MobileFormFieldProps {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  autoComplete?: string;
  className?: string;
}

export function MobileFormField({
  label,
  name,
  type = "text",
  value,
  onChange,
  error,
  placeholder,
  required,
  disabled,
  autoComplete,
  className,
}: MobileFormFieldProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={name} className="text-base font-medium">
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>
      <Input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        autoComplete={autoComplete}
        className={cn(
          "h-12 text-base touch-manipulation", // Larger touch target
          error && "border-destructive focus-visible:ring-destructive"
        )}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-error` : undefined}
      />
      {error && (
        <div
          id={`${name}-error`}
          className="flex items-start gap-2 text-sm text-destructive"
        >
          <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}

interface MobileTextareaFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  rows?: number;
  className?: string;
}

export function MobileTextareaField({
  label,
  name,
  value,
  onChange,
  error,
  placeholder,
  required,
  disabled,
  rows = 4,
  className,
}: MobileTextareaFieldProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={name} className="text-base font-medium">
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>
      <Textarea
        id={name}
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        rows={rows}
        className={cn(
          "text-base touch-manipulation resize-none",
          error && "border-destructive focus-visible:ring-destructive"
        )}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-error` : undefined}
      />
      {error && (
        <div
          id={`${name}-error`}
          className="flex items-start gap-2 text-sm text-destructive"
        >
          <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}

interface MobileSelectFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
  error?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

export function MobileSelectField({
  label,
  name,
  value,
  onChange,
  options,
  error,
  placeholder,
  required,
  disabled,
  className,
}: MobileSelectFieldProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={name} className="text-base font-medium">
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>
      <Select value={value} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger
          id={name}
          className={cn(
            "h-12 text-base touch-manipulation",
            error && "border-destructive focus-visible:ring-destructive"
          )}
          aria-invalid={!!error}
          aria-describedby={error ? `${name}-error` : undefined}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              className="text-base py-3"
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && (
        <div
          id={`${name}-error`}
          className="flex items-start gap-2 text-sm text-destructive"
        >
          <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}

interface MobileFormProps {
  children: React.ReactNode;
  onSubmit: (e: React.FormEvent) => void;
  submitLabel?: string;
  cancelLabel?: string;
  onCancel?: () => void;
  isSubmitting?: boolean;
  isSuccess?: boolean;
  className?: string;
}

export function MobileForm({
  children,
  onSubmit,
  submitLabel = "Submit",
  cancelLabel = "Cancel",
  onCancel,
  isSubmitting = false,
  isSuccess = false,
  className,
}: MobileFormProps) {
  return (
    <form onSubmit={onSubmit} className={cn("space-y-6", className)}>
      {children}

      <div className="flex flex-col gap-3 pt-4">
        <Button
          type="submit"
          size="lg"
          className="w-full h-12 text-base touch-manipulation"
          disabled={isSubmitting || isSuccess}
        >
          {isSuccess ? (
            <>
              <Check className="mr-2 h-5 w-5" />
              Success
            </>
          ) : isSubmitting ? (
            "Submitting..."
          ) : (
            submitLabel
          )}
        </Button>
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="w-full h-12 text-base touch-manipulation"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            {cancelLabel}
          </Button>
        )}
      </div>
    </form>
  );
}
