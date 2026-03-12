"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { Eye, EyeOff, Building2, User, HardHat } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { FadeIn } from "@/components/Motion";
import PhoneInput from "@/components/PhoneInput";

type FormData = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: string;
  companyName?: string;
};

const ROLES = [
  {
    value: "owner",
    label: "Owner",
    icon: User,
    desc: "I want to sell/rent my property",
  },
  {
    value: "agent",
    label: "Agent",
    icon: Building2,
    desc: "I am a real estate agent",
  },
  {
    value: "builder",
    label: "Builder",
    icon: HardHat,
    desc: "I am a builder/developer",
  },
];

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>({ defaultValues: { role: "owner" } });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  // Phone controlled separately (country code + local number)
  const [phone, setPhone] = useState("91"); // default India
  const [phoneError, setPhoneError] = useState("");

  const selectedRole = watch("role");
  const password = watch("password");

  const onSubmit = async (data: FormData) => {
    // Validate phone: must have at least 5 digits after the dial code
    const localDigits = phone.replace(/\D/g, "");
    if (localDigits.length < 7) {
      setPhoneError("Please enter a valid phone number");
      return;
    }
    setPhoneError("");
    setLoading(true);
    setError("");
    try {
      const base =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
      const res = await fetch(`${base}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          phone,
          password: data.password,
          role: data.role,
          companyName: data.companyName,
        }),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Registration failed");

      login(result.token, result.user);
      router.push("/");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4 py-12">
      <FadeIn className="w-full max-w-lg">
        <div className="bg-[#111118] border border-white/10 rounded-2xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              Create Account
            </h1>
            <p className="text-gray-400 text-sm">
              Join thousands of property seekers and owners
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Role Selection */}
            <div>
              <label className="text-sm font-medium text-gray-300 mb-2 block">
                I am a
              </label>
              <div className="grid grid-cols-3 gap-3">
                {ROLES.map((r) => {
                  const Icon = r.icon;
                  return (
                    <label
                      key={r.value}
                      className={`relative flex flex-col items-center gap-1.5 p-3 rounded-xl border cursor-pointer transition-all text-center ${
                        selectedRole === r.value
                          ? "border-blue-500 bg-blue-500/10 text-blue-400"
                          : "border-white/10 text-gray-400 hover:border-white/20"
                      }`}
                    >
                      <input
                        type="radio"
                        value={r.value}
                        {...register("role")}
                        className="sr-only"
                      />
                      <Icon className="h-5 w-5" />
                      <span className="text-xs font-semibold">{r.label}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Name */}
            <div>
              <label className="text-sm font-medium text-gray-300 mb-1.5 block">
                Full Name
              </label>
              <input
                type="text"
                placeholder="John Doe"
                {...register("name", { required: "Name is required" })}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none focus:border-blue-500 transition-colors"
              />
              {errors.name && (
                <span className="text-red-400 text-xs mt-1">
                  {errors.name.message}
                </span>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="text-sm font-medium text-gray-300 mb-1.5 block">
                Email
              </label>
              <input
                type="email"
                placeholder="name@example.com"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Invalid email address",
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

            {/* Phone */}
            <PhoneInput
              value={phone}
              onChange={setPhone}
              label="Phone Number"
              required
              error={phoneError}
            />

            {/* Company Name (conditional) */}
            {(selectedRole === "agent" || selectedRole === "builder") && (
              <div>
                <label className="text-sm font-medium text-gray-300 mb-1.5 block">
                  Company Name
                </label>
                <input
                  type="text"
                  placeholder="Your company name"
                  {...register("companyName")}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none focus:border-blue-500 transition-colors"
                />
              </div>
            )}

            {/* Password */}
            <div>
              <label className="text-sm font-medium text-gray-300 mb-1.5 block">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Min. 6 characters"
                  {...register("password", {
                    required: "Password is required",
                    minLength: { value: 6, message: "At least 6 characters" },
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

            {/* Confirm Password */}
            <div>
              <label className="text-sm font-medium text-gray-300 mb-1.5 block">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Re-enter password"
                  {...register("confirmPassword", {
                    required: "Please confirm your password",
                    validate: (value) =>
                      value === password || "Passwords do not match",
                  })}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none focus:border-blue-500 transition-colors pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                >
                  {showConfirmPassword ? (
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
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <p className="text-center text-gray-500 text-sm mt-6">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-blue-400 hover:text-blue-300 font-medium"
            >
              Login
            </Link>
          </p>
        </div>
      </FadeIn>
    </div>
  );
}
