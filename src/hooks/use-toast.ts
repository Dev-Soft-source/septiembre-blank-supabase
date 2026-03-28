
import { toast as sonnerToast } from "sonner";

// Define type for toast options to match what our components are expecting
interface ToastOptions {
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive' | 'success' | 'warning' | 'info' | 'error';
  [key: string]: any;
}

// Create a customized version of sonnerToast that matches what our app expects
const customToast = (options: ToastOptions | string) => {
  if (typeof options === "string") {
    return sonnerToast(options);
  }
  
  const { title, description, variant, ...rest } = options;
  
  if (variant === 'destructive' || variant === 'error') {
    return sonnerToast.error(title || '', { description, ...rest });
  } else if (variant === 'success') {
    return sonnerToast.success(title || '', { description, ...rest });
  } else if (variant === 'warning') {
    return sonnerToast.warning(title || '', { description, ...rest });
  } else if (variant === 'info') {
    return sonnerToast.info(title || '', { description, ...rest });
  }
  
  // Default case
  return sonnerToast(title || '', { description, ...rest });
};

// Add methods to match our expected API
customToast.success = (message: string | ToastOptions, options?: ToastOptions) => {
  if (typeof message === 'string') {
    return sonnerToast.success(message, options);
  }
  const { title, description, ...rest } = message;
  return sonnerToast.success(title || '', { description, ...rest });
};

customToast.error = (message: string | ToastOptions, options?: ToastOptions) => {
  if (typeof message === 'string') {
    return sonnerToast.error(message, options);
  }
  const { title, description, ...rest } = message;
  return sonnerToast.error(title || '', { description, ...rest });
};

customToast.warning = (message: string | ToastOptions, options?: ToastOptions) => {
  if (typeof message === 'string') {
    return sonnerToast.warning(message, options);
  }
  const { title, description, ...rest } = message;
  return sonnerToast.warning(title || '', { description, ...rest });
};

customToast.info = (message: string | ToastOptions, options?: ToastOptions) => {
  if (typeof message === 'string') {
    return sonnerToast.info(message, options);
  }
  const { title, description, ...rest } = message;
  return sonnerToast.info(title || '', { description, ...rest });
};

// Export the enhanced toast functionality
export const toast = customToast;

// Custom hook for toast functionality
export const useToast = () => {
  return { toast: customToast };
};
