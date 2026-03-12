"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { Mail, ArrowLeft, CheckCircle2 } from "lucide-react";
import { FadeIn } from "@/components/Motion";

type FormData = { email: string };

export default function ForgotPasswordPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setError("");
    try {
      const base =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
      const res = await fetch(`${base}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Something went wrong");
      setSent(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4 py-12">
      <FadeIn className="w-full max-w-md">
        <div className="bg-[#111118] border border-white/10 rounded-2xl p-8">
          {/* Back link */}
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-300 transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to login
          </Link>

          {sent ? (
            /* Success state */
            <div className="text-center py-4">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-green-500/10 mb-4">
                <CheckCircle2 className="h-7 w-7 text-green-400" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">
                Check your email
              </h2>
              <p className="text-gray-400 text-sm">
                If an account exists for that email address, we&apos;ve sent a
                password reset link. It expires in 1 hour.
              </p>
              <Link
                href="/login"
                className="mt-6 inline-block text-blue-400 hover:text-blue-300 text-sm font-medium"
              >
                Return to login
              </Link>
            </div>
          ) : (
            /* Form state */
            <>
              <div className="mb-6">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-500/10 mb-4">
                  <Mail className="h-6 w-6 text-blue-400" />
                </div>
                <h1 className="text-2xl font-bold text-white">
                  Forgot password?
                </h1>
                <p className="text-gray-400 text-sm mt-1">
                  Enter your email and we&apos;ll send you a reset link.
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-300 mb-1.5 block">
                    Email address
                  </label>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Enter a valid email address",
                      },
                    })}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none focus:border-blue-500 transition-colors"
                  />
                  {errors.email && (
                    <span className="text-red-400 text-xs mt-1">
                      {errors.email.message}
                    </span>
                  )}
                </div>

                {error && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2.5 text-red-400 text-sm text-center">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl text-sm transition-colors"
                >
                  {loading ? "Sending..." : "Send reset link"}
                </button>
              </form>
            </>
          )}
        </div>
      </FadeIn>
    </div>
  );
}
