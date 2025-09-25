"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  User,
} from "firebase/auth";
import { auth } from "@/lib/firebaseClient";
import toast from "react-hot-toast";

interface AuthContextProps {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  userRole: "userA" | "userB" | null;
}

const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<"userA" | "userB" | null>(null);

  const login = async (email: string, password: string) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      if (result.user) {
        const token = await result.user.getIdToken();

        // Determine user role based on email
        if (email === "usera@example.com") {
          setUserRole("userA");
        } else if (email === "userb@example.com") {
          setUserRole("userB");
        }

        toast.success("Welcome back!");
      }
    } catch (error: any) {
      toast.error("Login failed");
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUserRole(null);
      toast.success("Logged out successfully");
    } catch (error: any) {
      toast.error("Logout failed");
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      setLoading(false);

      if (user) {
        const token = await user.getIdToken();
        document.cookie = `idToken=${token}; path=/; max-age=3600; secure; samesite=strict`;

        // Determine user role
        if (user.email === "usera@example.com") {
          setUserRole("userA");
        } else if (user.email === "userb@example.com") {
          setUserRole("userB");
        }
      } else {
        setUserRole(null);
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, userRole }}>
      {children}
    </AuthContext.Provider>
  );
};
