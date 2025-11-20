/**
 * Form Validation Utilities
 *
 * Reusable validation functions for common form fields
 */

export interface ValidationRule {
  test: (value: string) => boolean;
  message: string;
}

export interface FieldValidation {
  rules: ValidationRule[];
}

/**
 * Validates a single field against its validation rules
 */
export function validateField(
  value: string,
  rules: ValidationRule[]
): string | undefined {
  for (const rule of rules) {
    if (!rule.test(value)) {
      return rule.message;
    }
  }
  return undefined;
}

/**
 * Validates all fields in a form
 */
export function validateForm<T extends Record<string, string>>(
  values: T,
  validations: Partial<Record<keyof T, ValidationRule[]>>
): Partial<Record<keyof T, string>> {
  const errors: Partial<Record<keyof T, string>> = {};

  for (const field in validations) {
    const rules = validations[field];
    if (rules) {
      const error = validateField(values[field], rules);
      if (error) {
        errors[field] = error;
      }
    }
  }

  return errors;
}

/**
 * Common validation rules
 */
export const ValidationRules = {
  required: (fieldName: string = "This field"): ValidationRule => ({
    test: (value) => value.trim().length > 0,
    message: `${fieldName} is required`,
  }),

  email: (): ValidationRule => ({
    test: (value) => {
      if (!value) return true; // Allow empty if not required
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(value);
    },
    message: "Please enter a valid email address",
  }),

  minLength: (length: number, fieldName: string = "This field"): ValidationRule => ({
    test: (value) => {
      if (!value) return true; // Allow empty if not required
      return value.length >= length;
    },
    message: `${fieldName} must be at least ${length} characters`,
  }),

  maxLength: (length: number, fieldName: string = "This field"): ValidationRule => ({
    test: (value) => {
      if (!value) return true; // Allow empty if not required
      return value.length <= length;
    },
    message: `${fieldName} must be at most ${length} characters`,
  }),

  pattern: (regex: RegExp, message: string): ValidationRule => ({
    test: (value) => {
      if (!value) return true; // Allow empty if not required
      return regex.test(value);
    },
    message,
  }),

  matches: (otherValue: string, fieldName: string = "Fields"): ValidationRule => ({
    test: (value) => value === otherValue,
    message: `${fieldName} do not match`,
  }),

  url: (): ValidationRule => ({
    test: (value) => {
      if (!value) return true; // Allow empty if not required
      try {
        new URL(value);
        return true;
      } catch {
        return false;
      }
    },
    message: "Please enter a valid URL",
  }),

  phoneNumber: (): ValidationRule => ({
    test: (value) => {
      if (!value) return true; // Allow empty if not required
      const phoneRegex = /^[\d\s\-\+\(\)]+$/;
      return phoneRegex.test(value) && value.replace(/\D/g, "").length >= 10;
    },
    message: "Please enter a valid phone number",
  }),

  passwordStrength: (): ValidationRule => ({
    test: (value) => {
      if (!value) return true; // Allow empty if not required
      // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
      const hasLength = value.length >= 8;
      const hasUpper = /[A-Z]/.test(value);
      const hasLower = /[a-z]/.test(value);
      const hasNumber = /\d/.test(value);
      return hasLength && hasUpper && hasLower && hasNumber;
    },
    message:
      "Password must be at least 8 characters with uppercase, lowercase, and number",
  }),

  numeric: (fieldName: string = "This field"): ValidationRule => ({
    test: (value) => {
      if (!value) return true; // Allow empty if not required
      return !isNaN(Number(value));
    },
    message: `${fieldName} must be a number`,
  }),

  positiveNumber: (fieldName: string = "This field"): ValidationRule => ({
    test: (value) => {
      if (!value) return true; // Allow empty if not required
      const num = Number(value);
      return !isNaN(num) && num > 0;
    },
    message: `${fieldName} must be a positive number`,
  }),

  integer: (fieldName: string = "This field"): ValidationRule => ({
    test: (value) => {
      if (!value) return true; // Allow empty if not required
      return Number.isInteger(Number(value));
    },
    message: `${fieldName} must be a whole number`,
  }),
};

/**
 * Hook for managing form validation state
 */
export function useFormValidation<T extends Record<string, string>>(
  initialValues: T
) {
  const [values, setValues] = React.useState<T>(initialValues);
  const [errors, setErrors] = React.useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = React.useState<Partial<Record<keyof T, boolean>>>({});

  const handleChange = (field: keyof T, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleBlur = (field: keyof T) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const validate = (validations: Partial<Record<keyof T, ValidationRule[]>>) => {
    const newErrors = validateForm(values, validations);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const reset = () => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  };

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validate,
    reset,
    setValues,
    setErrors,
  };
}

// Re-export React for the hook
import * as React from "react";
