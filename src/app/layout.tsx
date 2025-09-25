import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DataSync Pro - Secure Data Sharing Platform",
  description: "Enterprise-grade secure data sharing between trusted partners",
  keywords: "data sharing, secure, enterprise, collaboration",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-dark-bg min-h-screen`}
      >
        <AuthProvider>
          <div className="min-h-screen relative overflow-hidden">
            {/* Animated background elements */}
            <div className="fixed inset-0 -z-10">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-900 via-dark-bg to-darker-bg"></div>
              <div className="absolute top-0 left-0 w-full h-full opacity-20">
                <div className="absolute top-20 left-10 w-72 h-72 bg-cyber-blue rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-float"></div>
                <div
                  className="absolute top-60 right-10 w-72 h-72 bg-cyber-purple rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-float"
                  style={{ animationDelay: "2s" }}
                ></div>
                <div
                  className="absolute bottom-20 left-1/2 w-72 h-72 bg-neon-pink rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-float"
                  style={{ animationDelay: "4s" }}
                ></div>
              </div>
            </div>
            {children}
          </div>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: "var(--card-bg)",
                color: "white",
                border: "1px solid var(--glass-border)",
                backdropFilter: "blur(20px)",
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
