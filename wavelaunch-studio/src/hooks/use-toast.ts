/**
 * Toast Hook
 * 
 * Wrapper around Sonner toast library for notifications
 */

import { toast as sonnerToast } from "sonner";

export type ToastVariant = "default" | "success" | "error" | "warning" | "info";

export interface ToastOptions {
    title?: string;
    description?: string;
    variant?: ToastVariant;
    duration?: number;
    action?: {
        label: string;
        onClick: () => void;
    };
}

export function useToast() {
    const toast = ({ title, description, variant = "default", duration, action }: ToastOptions) => {
        const message = title || description || "";
        const options = {
            description: title && description ? description : undefined,
            duration,
            action: action ? {
                label: action.label,
                onClick: action.onClick,
            } : undefined,
        };

        switch (variant) {
            case "success":
                return sonnerToast.success(message, options);
            case "error":
                return sonnerToast.error(message, options);
            case "warning":
                return sonnerToast.warning(message, options);
            case "info":
                return sonnerToast.info(message, options);
            default:
                return sonnerToast(message, options);
        }
    };

    return {
        toast,
        success: (message: string, options?: Omit<ToastOptions, "variant">) =>
            toast({ ...options, title: message, variant: "success" }),
        error: (message: string, options?: Omit<ToastOptions, "variant">) =>
            toast({ ...options, title: message, variant: "error" }),
        warning: (message: string, options?: Omit<ToastOptions, "variant">) =>
            toast({ ...options, title: message, variant: "warning" }),
        info: (message: string, options?: Omit<ToastOptions, "variant">) =>
            toast({ ...options, title: message, variant: "info" }),
        dismiss: sonnerToast.dismiss,
    };
}
