"use client";

import Container from "@/components/Container";
import { SubmissionCardSkeleton } from "@/components/LoadingSkeleton";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import { apiClient } from "@/lib/apiClient";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  BarChart3,
  CheckCircle,
  Image as ImageIcon,
  RefreshCw,
  Upload,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import toast from "react-hot-toast";

interface Submission {
  id: string;
  companyName: string;
  numberOfUsers: number;
  numberOfProducts: number;
  percentage: number;
  createdAt: string;
}

interface UploadProgress {
  filename: string;
  progress: number;
  status: "uploading" | "success" | "error";
}

export default function UserBDashboard() {
  const { user, logout } = useAuth();
  const [latestSubmission, setLatestSubmission] = useState<Submission | null>(
    null
  );
  const [uploadProgress, setUploadProgress] = useState<UploadProgress[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch latest submission from User A
  const fetchLatestSubmission = async (isManualRefresh = false) => {
    if (!user) return;

    if (isManualRefresh || initialLoad) {
      setIsRefreshing(true);
      setError(null);
    }

    try {
      const res = await apiClient.get(
        "/submission/latest/SvTdrfODk0VMcCkM2nswoZ54wzn2"
      );
      setLatestSubmission(res);
      if (isManualRefresh) {
        toast.success("Data refreshed successfully!");
      }
    } catch (error) {
      console.error(error);
      const errorMessage = "Failed to fetch latest data";
      setError(errorMessage);
      if (isManualRefresh || initialLoad) {
        toast.error(errorMessage);
      }
    } finally {
      setIsRefreshing(false);
      setInitialLoad(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchLatestSubmission();
  }, [user]);

  // Automatic refresh (silent)
  useEffect(() => {
    if (!initialLoad) {
      const interval = setInterval(() => {
        fetchLatestSubmission(false); // Silent refresh
      }, 30000); // Poll every 30 seconds

      return () => clearInterval(interval);
    }
  }, [initialLoad]);

  const onDrop = async (acceptedFiles: File[]) => {
    if (!user) return;

    const newUploads: UploadProgress[] = acceptedFiles.map((file) => ({
      filename: file.name,
      progress: 0,
      status: "uploading" as const,
    }));

    setUploadProgress((prev) => [...prev, ...newUploads]);

    for (const file of acceptedFiles) {
      try {
        const updateProgress = (progress: number) => {
          setUploadProgress((prev) =>
            prev.map((upload) =>
              upload.filename === file.name ? { ...upload, progress } : upload
            )
          );
        };

        await apiClient.uploadFile(
          "/images/upload/SvTdrfODk0VMcCkM2nswoZ54wzn2",
          file,
          updateProgress
        );

        setUploadProgress((prev) =>
          prev.map((upload) =>
            upload.filename === file.name
              ? { ...upload, status: "success" }
              : upload
          )
        );

        toast.success(`${file.name} uploaded successfully!`);
      } catch (error) {
        console.error(error);
        setUploadProgress((prev) =>
          prev.map((upload) =>
            upload.filename === file.name
              ? { ...upload, status: "error" }
              : upload
          )
        );
        toast.error(`Failed to upload ${file.name}`);
      }
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".gif"],
    },
    multiple: true,
  });

  const removeUpload = (filename: string) => {
    setUploadProgress((prev) =>
      prev.filter((upload) => upload.filename !== filename)
    );
  };

  const handleRefresh = () => {
    fetchLatestSubmission(true); // Manual refresh
  };

  return (
    <ProtectedRoute requiredRole="userB">
      <div className="min-h-screen bg-dark-bg py-6">
        <Container>
          {/* Header */}
          <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8"
          >
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-green-400 to-cyber-blue bg-clip-text text-transparent">
                DataSync Pro - User B
              </h1>
              <p className="text-gray-400 text-sm sm:text-base">
                Data Monitoring & File Upload
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="flex items-center space-x-2 px-3 sm:px-4 py-2 bg-dark-bg border border-glass-border rounded-lg hover:cyber-glow transition-all disabled:opacity-50 cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyber-blue focus:ring-opacity-50"
                aria-label="Refresh data"
              >
                <RefreshCw
                  className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
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
            {/* Latest Submission Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-card p-4 sm:p-6 rounded-xl sm:rounded-2xl"
            >
              <div className="flex items-center space-x-2 mb-4 sm:mb-6">
                <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 text-green-400" />
                <h2 className="text-lg sm:text-xl font-semibold">
                  Latest from User A
                </h2>
              </div>

              <AnimatePresence mode="wait">
                {error && (isRefreshing || initialLoad) ? (
                  <motion.div
                    key="error"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center py-8 text-red-400"
                    role="alert"
                  >
                    <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>{error}</p>
                    <button
                      onClick={handleRefresh}
                      className="mt-2 text-cyber-blue hover:underline cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyber-blue rounded"
                    >
                      Try again
                    </button>
                  </motion.div>
                ) : initialLoad || isRefreshing ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <SubmissionCardSkeleton />
                  </motion.div>
                ) : latestSubmission ? (
                  <motion.div
                    key="submission"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-2 gap-3 sm:gap-4">
                      <div className="p-3 sm:p-4 bg-dark-bg rounded-lg border border-glass-border">
                        <div className="text-xl sm:text-2xl font-bold text-green-400 mb-1">
                          {latestSubmission.numberOfUsers}
                        </div>
                        <div className="text-xs sm:text-sm text-gray-400">
                          Users
                        </div>
                      </div>
                      <div className="p-3 sm:p-4 bg-dark-bg rounded-lg border border-glass-border">
                        <div className="text-xl sm:text-2xl font-bold text-cyber-blue mb-1">
                          {latestSubmission.numberOfProducts}
                        </div>
                        <div className="text-xs sm:text-sm text-gray-400">
                          Products
                        </div>
                      </div>
                    </div>

                    <div className="p-3 sm:p-4 bg-dark-bg rounded-lg border border-glass-border">
                      <div className="text-2xl sm:text-3xl font-bold text-cyber-purple mb-1">
                        {latestSubmission.percentage.toFixed(2)}%
                      </div>
                      <div className="text-xs sm:text-sm text-gray-400">
                        User-to-Product Ratio
                      </div>
                    </div>

                    <div className="p-3 sm:p-4 bg-dark-bg rounded-lg border border-glass-border">
                      <div className="font-semibold text-cyber-blue mb-1 text-sm sm:text-base">
                        {latestSubmission.companyName}
                      </div>
                      <div className="text-xs text-gray-400">
                        Last updated:{" "}
                        {new Date(latestSubmission.createdAt).toLocaleString()}
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="no-data"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center py-8 text-gray-400"
                  >
                    <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No data available from User A</p>
                    <p className="text-sm mt-1">
                      User A needs to submit data first
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* File Upload Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-card p-4 sm:p-6 rounded-xl sm:rounded-2xl"
            >
              <div className="flex items-center space-x-2 mb-4 sm:mb-6">
                <Upload className="w-5 h-5 sm:w-6 sm:h-6 text-cyber-blue" />
                <h2 className="text-lg sm:text-xl font-semibold">
                  Upload Images to User A
                </h2>
              </div>

              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-xl sm:rounded-2xl p-6 text-center cursor-pointer transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyber-blue ${
                  isDragActive
                    ? "border-cyber-blue bg-cyber-blue bg-opacity-10"
                    : "border-glass-border hover:border-cyber-blue hover:bg-opacity-5"
                }`}
                tabIndex={0}
                role="button"
                aria-label="Upload images by dragging and dropping or clicking to select files"
              >
                <input {...getInputProps()} />
                <Upload className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 text-cyber-blue opacity-70" />
                <p className="text-base sm:text-lg font-semibold mb-2">
                  Drop images here
                </p>
                <p className="text-gray-400 text-sm">
                  or click to select files
                </p>
                <p className="text-gray-500 text-xs mt-2">
                  PNG, JPG, GIF up to 10MB
                </p>
              </div>

              {/* Upload Progress */}
              <AnimatePresence>
                {uploadProgress.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 sm:mt-6 space-y-2"
                  >
                    <h3 className="text-sm font-semibold text-gray-400">
                      Upload Progress
                    </h3>
                    {uploadProgress.map((upload, index) => (
                      <motion.div
                        key={upload.filename}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between p-3 bg-dark-bg rounded-lg border border-glass-border"
                      >
                        <div className="flex items-center space-x-3 flex-1 min-w-0">
                          <ImageIcon className="w-4 h-4 text-cyber-blue flex-shrink-0" />
                          <span
                            className="text-sm truncate"
                            title={upload.filename}
                          >
                            {upload.filename}
                          </span>
                        </div>

                        <div className="flex items-center space-x-2">
                          {upload.status === "uploading" && (
                            <>
                              <div
                                className="w-12 sm:w-16 bg-gray-700 rounded-full h-2"
                                role="progressbar"
                                aria-valuenow={upload.progress}
                                aria-valuemin={0}
                                aria-valuemax={100}
                              >
                                <div
                                  className="bg-cyber-blue h-2 rounded-full transition-all duration-300"
                                  style={{ width: `${upload.progress}%` }}
                                />
                              </div>
                              <span className="text-xs text-gray-400 w-6 text-right">
                                {upload.progress}%
                              </span>
                            </>
                          )}

                          {upload.status === "success" && (
                            <CheckCircle
                              className="w-4 h-4 text-green-400"
                              aria-label="Upload successful"
                            />
                          )}

                          {upload.status === "error" && (
                            <span className="text-xs text-red-400">Failed</span>
                          )}

                          <button
                            onClick={() => removeUpload(upload.filename)}
                            className="text-gray-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-cyber-blue rounded"
                            aria-label={`Remove ${upload.filename}`}
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Real-time Updates Indicator */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 flex items-center space-x-2 text-xs text-gray-400 bg-dark-bg bg-opacity-80 backdrop-blur-sm px-3 py-2 rounded-full border border-glass-border"
            aria-live="polite"
            aria-label="Real-time updates active"
          >
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="hidden sm:inline">Real-time updates active</span>
          </motion.div>
        </Container>
      </div>
    </ProtectedRoute>
  );
}
