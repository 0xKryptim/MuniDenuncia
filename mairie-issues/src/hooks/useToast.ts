import { toast as sonnerToast } from 'sonner';

// Simple wrapper around sonner that matches the shadcn toast hook interface
export function useToast() {
  return {
    toast: sonnerToast,
    toasts: [],
    dismiss: sonnerToast.dismiss,
  };
}
