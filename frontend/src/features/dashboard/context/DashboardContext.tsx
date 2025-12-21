"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { useAuth } from "@/features/auth";
import { UserRole } from "@/features/dashboard/types";

interface DashboardContextType {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userRole: UserRole;
  userName: string;
  isLoading: boolean;
}

const DashboardContext = createContext<DashboardContextType | undefined>(
  undefined
);

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error("useDashboard must be used within DashboardProvider");
  }
  return context;
};

interface DashboardProviderProps {
  children: ReactNode;
}

export const DashboardProvider: React.FC<DashboardProviderProps> = ({
  children,
}) => {
  const { user, loading } = useAuth(); // Get user from auth context
  const [activeTab, setActiveTab] = useState("overview");

  // Use actual user data from auth context
  // Important: Only use user.role when user exists to ensure correct role is used
  const userRole = user?.role as UserRole;
  const userName = user?.name || "User";

  return (
    <DashboardContext.Provider
      value={{
        activeTab,
        setActiveTab,
        userRole,
        userName,
        isLoading: loading,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};
