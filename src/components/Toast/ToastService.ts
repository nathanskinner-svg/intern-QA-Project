"use client";

import { createContext, useContext, type ReactNode } from "react";

type ToastContextValue = {
  open: (component: ReactNode, success?: boolean, timeout?: number) => void;
  close: (id: number) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const toast = useContext(ToastContext);
  if (!toast) throw new Error("useToast must be used inside ToastProvider");
  return toast;
}

export default ToastContext;
