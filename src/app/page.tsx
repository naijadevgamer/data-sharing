"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Shield, Upload, Users, Zap } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen relative overflow-hidden bg-dark-bg">
      {/* Navigation */}
      <nav className="relative z-50 p-4 sm:p-6" aria-label="Main navigation">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-2"
          >
            <Link
              href="/"
              className="flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-cyber-blue focus:ring-opacity-50 rounded-lg p-1"
              aria-label="DataSync Pro Home"
            >
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-cyber-blue to-cyber-purple rounded-lg"></div>
              <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-cyber-blue to-cyber-purple bg-clip-text text-transparent">
                DataSync Pro
              </span>
            </Link>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Link
              href="/login"
              className="group relative overflow-hidden bg-gradient-to-r from-cyber-blue to-cyber-purple px-4 py-2 sm:px-6 sm:py-2 rounded-full font-semibold transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-cyber-blue focus:ring-offset-2 focus:ring-offset-dark-bg cursor-pointer"
              aria-label="Get started with DataSync Pro"
            >
              <span className="relative z-10 flex items-center space-x-2 text-sm sm:text-base">
                <span>Get Started</span>
                <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
          </motion.div>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        className="relative z-10 pt-12 pb-20 sm:pt-20 sm:pb-32 px-4 sm:px-6"
        aria-labelledby="main-heading"
      >
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1
            id="main-heading"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl sm:text-6xl md:text-8xl font-bold mb-4 sm:mb-6"
          >
            <span className="bg-gradient-to-r from-cyber-blue via-cyber-purple to-neon-pink bg-clip-text text-transparent">
              DataSync
            </span>
            <br />
            <span className="text-white text-3xl sm:text-5xl md:text-7xl">
              Pro
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg sm:text-xl md:text-2xl text-gray-300 mb-6 sm:mb-8 max-w-4xl mx-auto px-4"
          >
            Secure, real-time data sharing platform. Collaboration tool built
            for seamless interaction between two users. User A can share data
            instantly, while User B can upload images for User A to view.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center"
          >
            <Link
              href="/login"
              className="group relative overflow-hidden bg-gradient-to-r from-cyber-blue to-cyber-purple px-6 py-3 sm:px-8 sm:py-4 rounded-full font-semibold text-base sm:text-lg transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-cyber-blue focus:ring-offset-2 focus:ring-offset-dark-bg cursor-pointer w-full sm:w-auto text-center"
              aria-label="Launch DataSync Pro App"
            >
              <span className="relative z-10 flex items-center justify-center sm:justify-start space-x-2">
                <Zap className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Launch App</span>
              </span>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section
        className="relative z-10 py-12 sm:py-20 px-4 sm:px-6"
        aria-labelledby="features-heading"
      >
        <div className="max-w-7xl mx-auto">
          <motion.h2
            id="features-heading"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-8 sm:mb-16"
          >
            <span className="bg-gradient-to-r from-cyber-blue to-cyber-purple bg-clip-text text-transparent">
              Features
            </span>
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="glass-card p-6 sm:p-8 rounded-xl sm:rounded-2xl group hover:cyber-glow transition-all duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyber-blue focus:ring-opacity-50"
                tabIndex={0}
                aria-label={`Feature: ${feature.title}`}
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-cyber-blue to-cyber-purple rounded-lg flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon
                    className="w-5 h-5 sm:w-6 sm:h-6 text-white"
                    aria-hidden="true"
                  />
                </div>
                <h3 className="text-lg sm:text-xl font-bold mb-2 text-white">
                  {feature.title}
                </h3>
                <p className="text-gray-400 text-sm sm:text-base">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        className="relative z-10 py-12 sm:py-20 px-4 sm:px-6"
        aria-labelledby="cta-heading"
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="glass-card p-6 sm:p-8 md:p-12 rounded-2xl sm:rounded-3xl cyber-glow"
          >
            <h2
              id="cta-heading"
              className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4"
            >
              Ready to Experience Effortless Collaboration?
            </h2>
            <p className="text-lg sm:text-xl text-gray-300 mb-6 sm:mb-8">
              Connect, share, and exchange data securely between users in
              real-time.
            </p>
            <Link
              href="/login"
              className="inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-cyber-blue to-cyber-purple px-6 py-3 sm:px-8 sm:py-4 rounded-full font-semibold text-base sm:text-lg transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-cyber-blue focus:ring-offset-2 focus:ring-offset-dark-bg cursor-pointer w-full sm:w-auto"
              aria-label="Start using DataSync Pro now"
            >
              <span>Start Now</span>
              <ArrowRight
                className="w-4 h-4 sm:w-5 sm:h-5"
                aria-hidden="true"
              />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Background Elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-cyber-blue rounded-full mix-blend-soft-light filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyber-purple rounded-full mix-blend-soft-light filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
      </div>
    </div>
  );
}

const features = [
  {
    icon: Shield,
    title: "Secure Data Exchange",
    description:
      "Your shared data and uploaded files are encrypted to ensure privacy between users A and B.",
  },
  {
    icon: Upload,
    title: "Image Upload & Sync",
    description:
      "User B can upload images that appear instantly on User A’s dashboard with real-time sync.",
  },
  {
    icon: Users,
    title: "Two-User Collaboration",
    description:
      "Built around a simple flow between two users — one shares data, the other contributes files — for efficient teamwork.",
  },
];
