"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { X, CheckCircle2, AlertCircle, XCircle, Info } from "lucide-react";

export interface Toast {
  id: string;
  message: string;
  type?: "success" | "error" | "info" | "warning";
  duration?: number;
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, "id">) => void;
  removeToast: (id: string) => void;
}

const ToastContext = React.createContext<ToastContextType | undefined>(
  undefined,
);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([]);

  const addToast = React.useCallback((toast: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).substr(2, 9);
    const duration = toast.duration || 3000;

    setToasts((prev) => [...prev, { ...toast, id }]);

    const timer = setTimeout(() => {
      removeToast(id);
    }, duration);

    return id;
  }, []);

  const removeToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
}

function ToastContainer({
  toasts,
  onRemove,
}: {
  toasts: Toast[];
  onRemove: (id: string) => void;
}) {
  return (
    <div className="fixed top-4 right-4 z-[999999] flex flex-col gap-3">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
        ))}
      </AnimatePresence>
    </div>
  );
}

function ToastItem({
  toast,
  onRemove,
}: {
  toast: Toast;
  onRemove: (id: string) => void;
}) {
  const getStyles = (type?: string) => {
    switch (type) {
      case "success":
        return "bg-white text-green-700 neo-flat border border-green-200/30 shadow-lg";
      case "error":
        return "bg-white text-red-700 neo-flat border border-red-200/30 shadow-lg";
      case "warning":
        return "bg-white text-yellow-700 neo-flat border border-yellow-200/30 shadow-lg";
      case "info":
      default:
        return "bg-white text-blue-700 neo-flat border border-blue-200/30 shadow-lg";
    }
  };

  const getIcon = (type?: string) => {
    switch (type) {
      case "success":
        return <CheckCircle2 size={20} className="flex-shrink-0" />;
      case "error":
        return <XCircle size={20} className="flex-shrink-0" />;
      case "warning":
        return <AlertCircle size={20} className="flex-shrink-0" />;
      case "info":
      default:
        return <Info size={20} className="flex-shrink-0" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, x: 100 }}
      animate={{ opacity: 1, y: 0, x: 0 }}
      exit={{ opacity: 0, y: -20, x: 100 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className="pointer-events-auto"
    >
      <div
        className={cn(
          "flex items-center gap-3 px-6 py-4 rounded-2xl max-w-sm shadow-2xl border backdrop-blur-md",
          getStyles(toast.type),
        )}
      >
        {getIcon(toast.type)}
        <p className="flex-1 text-sm font-medium">{toast.message}</p>
        <button
          onClick={() => onRemove(toast.id)}
          className="flex-shrink-0 hover:opacity-70 transition-opacity"
        >
          <X size={18} />
        </button>
      </div>
    </motion.div>
  );
}
