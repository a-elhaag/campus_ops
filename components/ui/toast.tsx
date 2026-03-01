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
        return "bg-gradient-to-br from-green-500 to-green-600 text-white shadow-xl border border-green-400/50";
      case "error":
        return "bg-gradient-to-br from-red-500 to-red-600 text-white shadow-xl border border-red-400/50";
      case "warning":
        return "bg-gradient-to-br from-yellow-400 to-yellow-500 text-gray-900 shadow-xl border border-yellow-300/50";
      case "info":
      default:
        return "bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-xl border border-blue-400/50";
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
          "flex items-center gap-3 px-6 py-4 rounded-2xl max-w-sm shadow-2xl border backdrop-blur-md",
          getStyles(toast.type),
        )}
      >
        <span className="text-lg flex-shrink-0 drop-shadow-lg">
          {getIcon(toast.type)}
        </span>
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
