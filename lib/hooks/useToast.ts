import { useToast as useToastContext } from "@/components/ui/toast";

export function useToast() {
  const { addToast } = useToastContext();

  return {
    success: (message: string, duration?: number) =>
      addToast({ message, type: "success", duration }),
    error: (message: string, duration?: number) =>
      addToast({ message, type: "error", duration }),
    info: (message: string, duration?: number) =>
      addToast({ message, type: "info", duration }),
    warning: (message: string, duration?: number) =>
      addToast({ message, type: "warning", duration }),
  };
}
