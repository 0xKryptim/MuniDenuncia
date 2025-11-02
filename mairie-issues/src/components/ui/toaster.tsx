import { Toaster as SonnerToaster } from 'sonner';

// We use sonner for toasts, this is a simple wrapper
export function Toaster() {
  return <SonnerToaster position="top-right" richColors />;
}
