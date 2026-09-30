"use client";

import ToastContext from "./ToastService";
import { useRef, useState, type ReactNode } from "react";

type Props = {
  children: ReactNode;
};

type Toast = {
  id: number;
  component: ReactNode;
  success: boolean;
};

export default function ToastProvider({ children }: Props) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextId = useRef(0);

  function open(component: ReactNode, success = true, timeout = 5000) {
    const id = ++nextId.current;
    setToasts((toasts) => [...toasts, { id, component, success }]);
    setTimeout(() => close(id), timeout);
  }

  function close(id: number) {
    setToasts((toasts) => toasts.filter((toast) => toast.id !== id));
  }

  return (
    <ToastContext.Provider value={{ open, close }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 space-y-2" aria-live="polite">
        {toasts.map(({ id, component, success }) => (
          <div
            className={`relative min-w-80 max-w-md rounded-xl border p-6 pr-12 text-base font-medium shadow-xl ${
              success
                ? "border-green-300 bg-green-100 text-green-900"
                : "border-red-300 bg-red-100 text-red-900"
            }`}
            key={id}
          >
            {component}
            <button
              aria-label="Dismiss notification"
              className="absolute right-3 top-3 rounded px-2 text-xl opacity-60 hover:bg-black/5 hover:opacity-100"
              onClick={() => close(id)}
              type="button"
            >
              &times;
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
