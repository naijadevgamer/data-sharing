"use client";

import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Eye, EyeOff, LogIn, Zap, ArrowLeft } from "lucide-react";
import Link from "next/link";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { login, user } = useAuth();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    try {
      await login(data.email, data.password);
    } catch (error: any) {
      setError("root", {
        message: "Login failed. Please check your credentials.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const demoCredentials = [
    { role: "User A", email: "usera@example.com", password: "password123" },
    { role: "User B", email: "userb@example.com", password: "password123" },
  ];

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 sm:p-6 bg-dark-bg">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        {/* Back to Landing */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <Link
            href="/"
            className="inline-flex items-center space-x-2 text-cyber-blue hover:text-cyber-purple transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-cyber-blue rounded-lg p-1 cursor-pointer"
            aria-label="Back to homepage"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Homepage</span>
          </Link>
        </motion.div>

        {/* Login Card */}
        <div className="glass-card p-6 sm:p-8 rounded-2xl sm:rounded-3xl shadow-2xl border border-glass-border">
          <div className="text-center mb-6 sm:mb-8">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-cyber-blue to-cyber-purple rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4"
            >
              <Zap
                className="w-6 h-6 sm:w-8 sm:h-8 text-white"
                aria-hidden="true"
              />
            </motion.div>
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-cyber-blue to-cyber-purple bg-clip-text text-transparent">
              Welcome Back
            </h1>
            <p className="text-gray-400 mt-2 text-sm sm:text-base">
              Sign in to your DataSync Pro account
            </p>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4 sm:space-y-6"
          >
            {errors.root && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-3 bg-red-500 bg-opacity-10 border text-white border-red-500 rounded-lg text-sm"
                role="alert"
                aria-live="polite"
              >
                {errors.root.message}
              </motion.div>
            )}

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Email Address
              </label>
              <div className="relative">
                <input
                  {...register("email")}
                  id="email"
                  type="email"
                  className="w-full p-3 bg-dark-bg border border-glass-border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyber-blue focus:ring-1 focus:ring-cyber-blue transition-colors"
                  placeholder="enter your email"
                  aria-invalid={errors.email ? "true" : "false"}
                  aria-describedby={errors.email ? "email-error" : undefined}
                />
              </div>
              {errors.email && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  id="email-error"
                  className="text-red-400 text-sm mt-1"
                  role="alert"
                >
                  {errors.email.message}
                </motion.p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <input
                  {...register("password")}
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className="w-full p-3 bg-dark-bg border border-glass-border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyber-blue focus:ring-1 focus:ring-cyber-blue transition-colors pr-10"
                  placeholder="enter your password"
                  aria-invalid={errors.password ? "true" : "false"}
                  aria-describedby={
                    errors.password ? "password-error" : undefined
                  }
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-cyber-blue rounded p-1 cursor-pointer"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  aria-controls="password"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />
                  ) : (
                    <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  id="password-error"
                  className="text-red-400 text-sm mt-1"
                  role="alert"
                >
                  {errors.password.message}
                </motion.p>
              )}
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="w-full mx-auto cursor-pointer bg-gradient-to-r from-cyber-blue to-cyber-purple p-3 rounded-lg font-semibold text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 focus:outline-none focus:ring-2 focus:ring-cyber-blue focus:ring-offset-2 focus:ring-offset-dark-bg"
              aria-label={isLoading ? "Signing in" : "Sign in"}
            >
              {isLoading ? (
                <div
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"
                  aria-hidden="true"
                />
              ) : (
                <LogIn className="w-5 h-5" aria-hidden="true" />
              )}
              <span>{isLoading ? "Signing In..." : "Sign In"}</span>
            </motion.button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-glass-border">
            <h3 className="text-sm font-medium text-gray-400 mb-3">
              Demo Credentials
            </h3>
            <div className="space-y-2">
              {demoCredentials.map((cred, index) => (
                <motion.div
                  key={cred.role}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex justify-between items-center p-2 sm:p-3 bg-dark-bg rounded-lg text-xs"
                  role="listitem"
                >
                  <span className="text-cyber-blue">{cred.role}</span>
                  <div className="text-gray-400 text-right">
                    <div className="truncate max-w-[120px] sm:max-w-none">
                      {cred.email}
                    </div>
                    <div>{cred.password}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
