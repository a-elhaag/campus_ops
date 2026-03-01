"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

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
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-3 pointer-events-none">
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
        return "neo-vibrant text-white border-green-400/30";
      case "error":
        return "neo-flat text-white border-red-400/30 bg-red-500/10";
      case "warning":
        return "neo-flat text-gray-900 border-yellow-400/30 bg-yellow-500/10";
      case "info":
      default:
        return "neo-flat text-gray-900 border border-gray-200/50";
    }
  };

  const getIcon = (type?: string) => {
    switch (type) {
      case "success":
        return "✓";
      case "error":
        return "✕";
      case "warning":
        return "⚠";
      case "info":
      default:
        return "ℹ";
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
          "flex items-center gap-3 px-6 py-4 rounded-2xl max-w-sm shadow-lg border backdrop-blur-sm",
          getStyles(toast.type),
        )}
      >
        <span className="text-lg flex-shrink-0">{getIcon(toast.type)}</span>
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
