

import type { ReactNode } from "react";

type CardProps = {
  children: ReactNode;
};

export default function Card({ children }: CardProps) {
  return (
    <div className="w-full max-w-md rounded-xl bg-white p-6 text-center shadow-xl">
      {children}
    </div>
  );
}