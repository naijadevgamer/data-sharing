"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { apiClient } from "@/lib/apiClient";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import Container from "@/components/Container";
import {
  ImageGridSkeleton,
  SubmissionCardSkeleton,
} from "@/components/LoadingSkeleton";
import {
  Upload,
  BarChart3,
  Building,
  Users,
  Package,
  Percent,
  RefreshCw,
  Image as ImageIcon,
} from "lucide-react";
import toast from "react-hot-toast";

const submissionSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  numberOfUsers: z.number().min(1, "Number of users must be at least 1"),
  numberOfProducts: z.number().min(1, "Number of products must be at least 1"),
});

type SubmissionForm = z.infer<typeof submissionSchema>;

interface Submission {
  id: string;
  companyName: string;
  numberOfUsers: number;
  numberOfProducts: number;
  percentage: number;
  createdAt: string;
}

interface Image {
  id: string;
  url: string;
  filename: string;
  createdAt: string;
}

export default function UserADashboard() {
  const { user, logout } = useAuth();
  const [percentage, setPercentage] = useState<number>(0);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [images, setImages] = useState<Image[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<SubmissionForm>({
    resolver: zodResolver(submissionSchema),
    defaultValues: {
      numberOfUsers: 0,
      numberOfProducts: 0,
    },
  });

  const watchNumberOfUsers = watch("numberOfUsers", 0);
  const watchNumberOfProducts = watch("numberOfProducts", 0);

  // Calculate percentage
  useEffect(() => {
    if (watchNumberOfProducts > 0) {
      setPercentage((watchNumberOfUsers / watchNumberOfProducts) * 100);
    } else {
      setPercentage(0);
    }
  }, [watchNumberOfUsers, watchNumberOfProducts]);

  // Fetch submissions and images
  const fetchData = async (isManualRefresh = false) => {
    if (!user) return;

    if (isManualRefresh || initialLoad) {
      setRefreshing(true);
      setError(null);
    }

    try {
      const res = await apiClient.get(`/images/list/${user.uid}`);
      setImages(res);
      if (isManualRefresh) {
        toast.success("Data refreshed successfully!");
      }
    } catch (error) {
      console.error(error);
      const errorMessage = "Failed to fetch data";
      setError(errorMessage);
      if (isManualRefresh || initialLoad) {
        toast.error(errorMessage);
      }
    } finally {
      setRefreshing(false);
      setInitialLoad(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchData();
  }, [user]);

  // Automatic refresh (silent)
  useEffect(() => {
    if (!initialLoad) {
      const interval = setInterval(() => {
        fetchData(false); // Silent refresh
      }, 30000); // Every 30 seconds

      return () => clearInterval(interval);
    }
  }, [initialLoad]);

  const onSubmit = async (data: SubmissionForm) => {
    if (!user) return;

    setIsLoading(true);
    try {
      const payload = {
        ...data,
        percentage: percentage,
      };

      await apiClient.post("/submission", payload);
      // await fetchData(true); // Manual refresh after submission
      reset();
      toast.success("Data submitted successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to submit data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchData(true); // Manual refresh
  };

  return (
    <ProtectedRoute requiredRole="userA">
      <div className="min-h-screen bg-dark-bg py-6">
        <Container>
          {/* Header */}
          <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8"
          >
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-cyber-blue to-cyber-purple bg-clip-text text-transparent">
                DataSync Pro - User A
              </h1>
              <p className="text-gray-400 text-sm sm:text-base">
                Data Submission Dashboard
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex items-center space-x-2 px-3 sm:px-4 py-2 bg-dark-bg border border-glass-border rounded-lg hover:cyber-glow transition-all disabled:opacity-50 cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyber-blue focus:ring-opacity-50"
                aria-label="Refresh data"
              >
                <RefreshCw
                  className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
                />
                <span className="hidden sm:inline">Refresh</span>
              </button>
              <button
                onClick={logout}
                className="px-3 sm:px-4 py-2 bg-red-500 bg-opacity-20 border border-red-500 rounded-lg hover:bg-red-700 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-500/50"
                aria-label="Logout"
              >
                Logout
              </button>
            </div>
          </motion.header>

          <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
            {/* Submission Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-card p-4 sm:p-6 rounded-xl sm:rounded-2xl w-full"
            >
              <div className="flex items-center space-x-2 mb-4 sm:mb-6">
                <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 text-cyber-blue" />
                <h2 className="text-lg sm:text-xl font-semibold">
                  Submit New Data
                </h2>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label
                    htmlFor="companyName"
                    className="flex items-center space-x-2 text-sm font-medium text-gray-300 mb-2"
                  >
                    <Building className="w-4 h-4" />
                    <span>Company Name</span>
                  </label>
                  <input
                    {...register("companyName")}
                    id="companyName"
                    className="w-full p-3 bg-dark-bg border border-glass-border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyber-blue transition-colors focus:ring-1 focus:ring-cyber-blue"
                    placeholder="Enter company name"
                    aria-invalid={errors.companyName ? "true" : "false"}
                  />
                  {errors.companyName && (
                    <p className="text-red-400 text-sm mt-1" role="alert">
                      {errors.companyName.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label
                      htmlFor="numberOfUsers"
                      className="flex items-center space-x-2 text-sm font-medium text-gray-300 mb-2"
                    >
                      <Users className="w-4 h-4" />
                      <span>Number of Users</span>
                    </label>
                    <input
                      {...register("numberOfUsers", { valueAsNumber: true })}
                      id="numberOfUsers"
                      type="number"
                      min="0"
                      className="w-full p-3 bg-dark-bg border border-glass-border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyber-blue transition-colors focus:ring-1 focus:ring-cyber-blue"
                      placeholder="0"
                      aria-invalid={errors.numberOfUsers ? "true" : "false"}
                    />
                    {errors.numberOfUsers && (
                      <p className="text-red-400 text-sm mt-1" role="alert">
                        {errors.numberOfUsers.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="numberOfProducts"
                      className="flex items-center space-x-2 text-sm font-medium text-gray-300 mb-2"
                    >
                      <Package className="w-4 h-4" />
                      <span>Number of Products</span>
                    </label>
                    <input
                      {...register("numberOfProducts", { valueAsNumber: true })}
                      id="numberOfProducts"
                      type="number"
                      min="0"
                      className="w-full p-3 bg-dark-bg border border-glass-border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyber-blue transition-colors focus:ring-1 focus:ring-cyber-blue"
                      placeholder="0"
                      aria-invalid={errors.numberOfProducts ? "true" : "false"}
                    />
                    {errors.numberOfProducts && (
                      <p className="text-red-400 text-sm mt-1" role="alert">
                        {errors.numberOfProducts.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="percentage"
                    className="flex items-center space-x-2 text-sm font-medium text-gray-300 mb-2"
                  >
                    <Percent className="w-4 h-4" />
                    <span>Percentage</span>
                  </label>
                  <div className="relative">
                    <input
                      id="percentage"
                      value={percentage.toFixed(2) + "%"}
                      disabled
                      className="w-full p-3 bg-dark-bg border border-glass-border rounded-lg text-cyber-blue font-mono disabled:opacity-70 focus:outline-none focus:ring-1 focus:ring-cyber-blue"
                      aria-label="Calculated percentage"
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <div className="w-8 h-2 bg-gradient-to-r from-cyber-blue to-cyber-purple rounded-full"></div>
                    </div>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isLoading}
                  className="w-full cursor-pointer bg-gradient-to-r from-cyber-blue to-cyber-purple p-3 rounded-lg font-semibold text-white transition-all duration-300 disabled:opacity-50 flex items-center justify-center space-x-2 focus:outline-none focus:ring-2 focus:ring-cyber-blue focus:ring-offset-2 focus:ring-offset-dark-bg"
                  aria-label={isLoading ? "Submitting data" : "Submit data"}
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Upload className="w-5 h-5" />
                  )}
                  <span>{isLoading ? "Submitting..." : "Submit Data"}</span>
                </motion.button>
              </form>
            </motion.div>

            {/* Uploaded Images */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-card p-4 sm:p-6 rounded-xl sm:rounded-2xl"
            >
              <div className="flex items-center space-x-2 mb-4 sm:mb-6">
                <ImageIcon className="w-5 h-5 sm:w-6 sm:h-6 text-neon-pink" />
                <h2 className="text-lg sm:text-xl font-semibold">
                  Images from User B
                </h2>
              </div>

              {error && (refreshing || initialLoad) ? (
                <div className="text-center py-8 text-red-400" role="alert">
                  <p>{error}</p>
                  <button
                    onClick={handleRefresh}
                    className="mt-2 text-cyber-blue hover:underline cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyber-blue rounded"
                  >
                    Try again
                  </button>
                </div>
              ) : initialLoad || refreshing ? (
                <ImageGridSkeleton />
              ) : images.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                  <AnimatePresence>
                    {images.slice(0, 8).map((image, index) => (
                      <motion.div
                        key={image.id}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                        className="group relative aspect-square bg-black/50 rounded-lg overflow-hidden hover:cyber-glow transition-all cursor-pointer focus-within:ring-2 focus-within:ring-cyber-blue"
                        tabIndex={0}
                        role="button"
                        aria-label={`View image ${image.filename}`}
                      >
                        <img
                          src={image.url}
                          alt={image.filename}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 flex items-center justify-center group-hover:bg-black/70">
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-center p-2">
                            <p className="text-xs truncate text-white">
                              {image.filename}
                            </p>
                            <p className="text-xs text-gray-300">
                              {new Date(image.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <ImageIcon className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 opacity-50" />
                  <p>No images uploaded by User B yet</p>
                  <p className="text-sm mt-1">
                    User B can upload images that will appear here
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        </Container>
      </div>
    </ProtectedRoute>
  );
}
