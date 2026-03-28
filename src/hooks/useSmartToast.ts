import { useToast } from "@/hooks/use-toast";
import { useConnectionStatus } from "./useConnectionStatus";
import { useEffect, useRef } from "react";

interface SmartToastOptions {
  title?: string;
  description?: string;
  variant?: "default" | "destructive" | "success";
  duration?: number;
}

export function useSmartToast() {
  const { toast } = useToast();
  const { isOnline } = useConnectionStatus();
  const previousOnlineStatus = useRef(isOnline);

  // Handle online/offline status changes
  useEffect(() => {
    if (previousOnlineStatus.current !== isOnline) {
      if (isOnline) {
        showConnectionRestored();
      } else {
        showConnectionLost();
      }
      previousOnlineStatus.current = isOnline;
    }
  }, [isOnline]);

  const showSaveSuccess = (itemName = "Changes") => {
    toast({
      title: "✓ Saved successfully",
      description: `${itemName} have been saved`,
      variant: "default",
      duration: 3000,
    });
  };

  const showSaveError = (error?: string) => {
    toast({
      title: "⚠ Save failed",
      description: error || "Unable to save changes. Please try again.",
      variant: "destructive",
      duration: 5000,
    });
  };

  const showLoadingError = (resource = "content") => {
    toast({
      title: "⚠ Loading failed",
      description: `Unable to load ${resource}. Please refresh the page.`,
      variant: "destructive",
      duration: 5000,
    });
  };

  const showNetworkError = () => {
    toast({
      title: "⚠ Network error",
      description: "Check your internet connection and try again.",
      variant: "destructive",
      duration: 5000,
    });
  };

  const showConnectionLost = () => {
    toast({
      title: "📱 Offline",
      description: "You're now offline. Some features may be limited.",
      variant: "destructive",
      duration: 4000,
    });
  };

  const showConnectionRestored = () => {
    toast({
      title: "🌐 Back online",
      description: "Your connection has been restored.",
      variant: "default",
      duration: 3000,
    });
  };

  const showFormValidationError = (fieldName: string) => {
    toast({
      title: "⚠ Validation error",
      description: `Please check the ${fieldName} field and try again.`,
      variant: "destructive",
      duration: 4000,
    });
  };

  const showGenericSuccess = (action: string) => {
    toast({
      title: "✓ Success",
      description: `${action} completed successfully.`,
      variant: "default",
      duration: 3000,
    });
  };

  const showGenericError = (action: string, error?: string) => {
    toast({
      title: `⚠ ${action} failed`,
      description: error || `Unable to ${action.toLowerCase()}. Please try again.`,
      variant: "destructive",
      duration: 5000,
    });
  };

  const showCustomToast = (options: SmartToastOptions) => {
    toast({
      title: options.title,
      description: options.description,
      variant: options.variant || "default",
      duration: options.duration || 4000,
    });
  };

  return {
    // Success toasts
    showSaveSuccess,
    showGenericSuccess,
    
    // Error toasts
    showSaveError,
    showLoadingError,
    showNetworkError,
    showFormValidationError,
    showGenericError,
    
    // Connection status
    showConnectionLost,
    showConnectionRestored,
    
    // Custom toast
    showCustomToast,
    
    // Connection status
    isOnline
  };
}