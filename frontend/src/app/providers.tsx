"use client";

import { AuthProvider } from "@/features/auth/context/AuthContext";
import { Toaster } from "sonner";
import { ReactNode } from "react";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      {children}
      <Toaster position="top-right" richColors />
    </AuthProvider>
  );
}
