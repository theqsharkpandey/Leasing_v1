"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { Eye, EyeOff, KeyRound, CheckCircle2 } from "lucide-react";
import { FadeIn } from "@/components/Motion";

type FormData = {
  password: string;
  confirmPassword: string;
};

function ResetPasswordForm() {
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get("token") ?? "";

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>();
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const onSubmit = async (data: FormData) => {
    if (!token) {
      setError("Invalid or missing reset token. Please request a new link.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const base =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
      const res = await fetch(`${base}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password: data.password }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Something went wrong");
      setDone(true);
      setTimeout(() => router.push("/login"), 3000);
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
          {done ? (
            <div className="text-center py-4">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-green-500/10 mb-4">
                <CheckCircle2 className="h-7 w-7 text-green-400" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">
                Password updated!
              </h2>
              <p className="text-gray-400 text-sm">
                Your password has been changed successfully. Redirecting to
                login&hellip;
              </p>
              <Link
                href="/login"
                className="mt-6 inline-block text-blue-400 hover:text-blue-300 text-sm font-medium"
              >
                Go to login now
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-500/10 mb-4">
                  <KeyRound className="h-6 w-6 text-blue-400" />
                </div>
                <h1 className="text-2xl font-bold text-white">
                  Set new password
                </h1>
                <p className="text-gray-400 text-sm mt-1">
                  Choose a strong password for your account.
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* New password */}
                <div>
                  <label className="text-sm font-medium text-gray-300 mb-1.5 block">
                    New password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Min. 6 characters"
                      {...register("password", {
                        required: "Password is required",
                        minLength: {
                          value: 6,
                          message: "Password must be at least 6 characters",
                        },
                      })}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none focus:border-blue-500 transition-colors pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <span className="text-red-400 text-xs mt-1">
                      {errors.password.message}
                    </span>
                  )}
                </div>

                {/* Confirm password */}
                <div>
                  <label className="text-sm font-medium text-gray-300 mb-1.5 block">
                    Confirm password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirm ? "text" : "password"}
                      placeholder="Re-enter your password"
                      {...register("confirmPassword", {
                        required: "Please confirm your password",
                        validate: (val) =>
                          val === watch("password") || "Passwords do not match",
                      })}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none focus:border-blue-500 transition-colors pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                    >
                      {showConfirm ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <span className="text-red-400 text-xs mt-1">
                      {errors.confirmPassword.message}
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
                  {loading ? "Updating..." : "Update password"}
                </button>

                <p className="text-center text-gray-500 text-sm">
                  <Link
                    href="/login"
                    className="text-blue-400 hover:text-blue-300 font-medium"
                  >
                    Back to login
                  </Link>
                </p>
              </form>
            </>
          )}
        </div>
      </FadeIn>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordForm />
    </Suspense>
  );
}
