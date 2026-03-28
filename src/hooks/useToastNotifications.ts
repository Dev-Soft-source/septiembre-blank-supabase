import { useToast } from "@/hooks/use-toast";

export function useToastNotifications() {
  const { toast } = useToast();

  const showSuccess = (message: string, description?: string) => {
    toast({
      title: message,
      description,
      duration: 3000,
    });
  };

  const showError = (message: string, description?: string) => {
    toast({
      title: message,
      description,
      variant: "destructive",
      duration: 5000,
    });
  };

  const showInfo = (message: string, description?: string) => {
    toast({
      title: message,
      description,
      duration: 4000,
    });
  };

  const showSaving = () => {
    toast({
      title: "Saving...",
      description: "Your changes are being saved.",
      duration: 2000,
    });
  };

  const showSaved = () => {
    toast({
      title: "Saved",
      description: "Your changes have been saved successfully.",
      duration: 3000,
    });
  };

  return {
    showSuccess,
    showError,
    showInfo,
    showSaving,
    showSaved,
  };
}