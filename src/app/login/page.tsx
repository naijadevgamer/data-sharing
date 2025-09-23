"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebaseClient";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      // user is signed in. Token will be used by apiClient.getIdToken() when calling backend.
      console.log("Signed in", userCred.user.uid, userCred.user.email);
      // redirect to app page e.g. /
      window.location.href = "/";
    } catch (error: any) {
      console.error(error);
      setErr(error.message || "Sign-in failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <form className="p-6 bg-white rounded shadow" onSubmit={onSubmit}>
        <h1 className="text-xl font-semibold mb-4">Sign In</h1>
        <label className="block mb-2">
          <span className="text-sm">Email</span>
          <input
            className="mt-1 block w-full border p-2 rounded"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label className="block mb-4">
          <span className="text-sm">Password</span>
          <input
            className="mt-1 block w-full border p-2 rounded"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {err && <div className="text-red-600 mb-2">{err}</div>}
        <button
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </div>
  );
}
