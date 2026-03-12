"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "@/lib/auth-context";
import api from "@/lib/api";
import { Send, CheckCircle } from "lucide-react";

interface LeadFormProps {
  propertyId: string;
  propertyTitle: string;
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

export default function LeadForm({ propertyId, propertyTitle }: LeadFormProps) {
  const { user } = useAuth();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      message: `I am interested in "${propertyTitle}"`,
    },
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setError("");
    try {
      await api.post("/leads", { ...data, property: propertyId });
      setSuccess(true);
      reset();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-[#111118] border border-white/10 rounded-xl p-6 text-center">
        <CheckCircle className="h-10 w-10 text-green-400 mx-auto mb-3" />
        <h3 className="text-white font-semibold text-lg mb-2">Thank You!</h3>
        <p className="text-gray-400 text-sm mb-4">
          Your inquiry has been sent. Our agent will contact you shortly.
        </p>
        <button
          onClick={() => setSuccess(false)}
          className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
        >
          Send another inquiry
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[#111118] border border-white/10 rounded-xl p-5">
      <h3 className="text-white font-semibold mb-4">
        Inquire About This Property
      </h3>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <div>
          <input
            {...register("name", { required: "Name is required" })}
            placeholder="Your Name"
            className={`w-full bg-white/5 border rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-500 outline-none transition-colors ${
              errors.name
                ? "border-red-500/50"
                : "border-white/10 focus:border-blue-500/50"
            }`}
          />
          {errors.name && (
            <span className="text-red-400 text-xs mt-1">
              {errors.name.message}
            </span>
          )}
        </div>

        <div>
          <input
            {...register("email", {
              required: "Email is required",
              pattern: { value: /^\S+@\S+$/i, message: "Invalid email" },
            })}
            placeholder="Email Address"
            type="email"
            className={`w-full bg-white/5 border rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-500 outline-none transition-colors ${
              errors.email
                ? "border-red-500/50"
                : "border-white/10 focus:border-blue-500/50"
            }`}
          />
          {errors.email && (
            <span className="text-red-400 text-xs mt-1">
              {errors.email.message}
            </span>
          )}
        </div>

        <div>
          <input
            {...register("phone", { required: "Phone is required" })}
            placeholder="Phone Number"
            type="tel"
            className={`w-full bg-white/5 border rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-500 outline-none transition-colors ${
              errors.phone
                ? "border-red-500/50"
                : "border-white/10 focus:border-blue-500/50"
            }`}
          />
          {errors.phone && (
            <span className="text-red-400 text-xs mt-1">
              {errors.phone.message}
            </span>
          )}
        </div>

        <div>
          <textarea
            {...register("message")}
            placeholder="I am interested in this property..."
            rows={3}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-500 outline-none focus:border-blue-500/50 transition-colors resize-none"
          />
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2 text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
        >
          <Send className="h-4 w-4" />
          {loading ? "Sending..." : "Send Inquiry"}
        </button>
      </form>
    </div>
  );
}
