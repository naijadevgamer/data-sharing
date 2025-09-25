"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function DashboardPage() {
  const { user, userRole } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) return;

    if (userRole === "userA") {
      router.replace("/dashboard/userA");
    } else if (userRole === "userB") {
      router.replace("/dashboard/userB");
    } else {
      router.replace("/login");
    }
  }, [user, userRole, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-8 h-8 animate-spin text-cyber-blue mx-auto mb-4" />
        <p className="text-gray-400">Redirecting to your dashboard...</p>
      </div>
    </div>
  );
}
