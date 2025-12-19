"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth";
import type { User, LoginCredentials, RegisterData } from "@/types/auth";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Load user on mount
  useEffect(() => {
    const loadUser = async () => {
      try {
        // First check if we have tokens in localStorage
        const hasToken = authService.isAuthenticated();
        
        if (hasToken) {
          // Try to get user from localStorage first (faster)
          const cachedUser = authService.getUserData();
          
          if (cachedUser) {
            // Set cached user immediately for better UX
            setUser(cachedUser);
            setLoading(false);
            
            // Then verify with backend in background
            authService.getCurrentUser()
              .then(freshUser => {
                if (freshUser) {
                  setUser(freshUser);
                }
              })
              .catch(err => {
                console.error('Failed to refresh user data:', err);
                // Keep cached user if backend fails
              });
          } else {
            // No cached user, fetch from backend
            const userData = await authService.getCurrentUser();
            setUser(userData);
            setLoading(false);
          }
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error("Failed to load user:", error);
        setUser(null);
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      const response = await authService.login(credentials);
      setUser(response.data.user);
      router.push("/dashboard");
    } catch (error: any) {
      throw error;
    }
  };

  const register = async (data: RegisterData) => {
    try {
      const response = await authService.register(data);
      setUser(response.data.user);
      router.push("/dashboard");
    } catch (error: any) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
