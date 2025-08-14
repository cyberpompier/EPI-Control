import { toast } from '@/hooks/use-toast';

export const showSuccess = (message: string) => {
  toast({
    title: "Succès",
    description: message,
  });
};

export const showError = (message: string) => {
  toast({
    title: "Erreur",
    description: message,
    variant: "destructive",
  });
};

export const showLoading = (message: string) => {
  return toast({
    title: "Chargement",
    description: message,
  });
};

export const dismissToast = (toastId: string) => {
  // Implementation for dismissing toast
};