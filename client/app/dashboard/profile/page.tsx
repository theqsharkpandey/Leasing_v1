"use client";

import { useState, useEffect, useRef } from "react";
import NextImage from "next/image";
import { useAuth } from "@/lib/auth-context";
import api from "@/lib/api";
import {
  User,
  Mail,
  MapPin,
  Building2,
  Shield,
  Lock,
  Eye,
  EyeOff,
  Save,
  Loader2,
  CheckCircle,
  AlertCircle,
  Camera,
} from "lucide-react";
import PhoneInput from "@/components/PhoneInput";

interface Toast {
  id: number;
  type: "success" | "error";
  message: string;
}

function ToastContainer({
  toasts,
  onDismiss,
}: {
  toasts: Toast[];
  onDismiss: (id: number) => void;
}) {
  return (
    <div className="fixed top-6 right-6 z-50 flex flex-col gap-3">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg backdrop-blur-sm animate-in slide-in-from-right transition-all cursor-pointer ${
            toast.type === "success"
              ? "bg-green-500/10 border-green-500/20 text-green-400"
              : "bg-red-500/10 border-red-500/20 text-red-400"
          }`}
          onClick={() => onDismiss(toast.id)}
        >
          {toast.type === "success" ? (
            <CheckCircle className="w-5 h-5 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
          )}
          <span className="text-sm font-medium">{toast.message}</span>
        </div>
      ))}
    </div>
  );
}

export default function ProfilePage() {
  const { user, updateUser } = useAuth();

  const [toasts, setToasts] = useState<Toast[]>([]);
  const [toastCounter, setToastCounter] = useState(0);

  // Avatar
  const [avatarUploading, setAvatarUploading] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  // Profile form state
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);

  // Password form state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setPhone(user.phone || "");
      setCity(user.city || "");
      setCompanyName(user.companyName || "");
    }
  }, [user]);

  function addToast(type: "success" | "error", message: string) {
    const id = toastCounter + 1;
    setToastCounter(id);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }

  function dismissToast(id: number) {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const MAX_MB = 2;
    if (file.size > MAX_MB * 1024 * 1024) {
      addToast("error", `Photo must be smaller than ${MAX_MB} MB.`);
      if (avatarInputRef.current) avatarInputRef.current.value = "";
      return;
    }

    setAvatarUploading(true);
    try {
      const formData = new FormData();
      formData.append("avatar", file);
      const res = await api.post("/auth/avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const updatedUser = res.data;
      updateUser(updatedUser);
      addToast("success", "Profile picture updated!");
    } catch (err: any) {
      addToast(
        "error",
        err.response?.data?.error || "Failed to upload picture.",
      );
    } finally {
      setAvatarUploading(false);
      // Reset input so same file can be re-selected
      if (avatarInputRef.current) avatarInputRef.current.value = "";
    }
  }

  async function handleProfileSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const res = await api.put("/auth/profile", {
        name,
        phone,
        city,
        companyName,
      });
      const updatedUser = res.data.data || res.data.user || res.data;
      updateUser(updatedUser);
      addToast("success", "Profile updated successfully.");
    } catch (err: any) {
      addToast(
        "error",
        err.response?.data?.message || "Failed to update profile.",
      );
    } finally {
      setSavingProfile(false);
    }
  }

  async function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (newPassword.length < 6) {
      addToast("error", "New password must be at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      addToast("error", "New password and confirmation do not match.");
      return;
    }

    setSavingPassword(true);
    try {
      await api.put("/auth/profile", {
        currentPassword,
        newPassword,
      });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      addToast("success", "Password changed successfully.");
    } catch (err: any) {
      addToast(
        "error",
        err.response?.data?.message || "Failed to change password.",
      );
    } finally {
      setSavingPassword(false);
    }
  }

  const inputClasses =
    "w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/40 transition-all";
  const disabledInputClasses =
    "w-full bg-white/[0.02] border border-white/[0.06] rounded-lg px-4 py-3 text-white/40 text-sm cursor-not-allowed";
  const labelClasses = "block text-sm font-medium text-white/70 mb-1.5";

  return (
    <div className="min-h-screen bg-[#0a0a0f] py-8 px-4 sm:px-6 lg:px-8">
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-1">
            Profile Settings
          </h1>
          <p className="text-white/50 text-sm">
            Manage your account information and security.
          </p>
        </div>

        {/* Avatar */}
        <div className="flex flex-col items-center mb-8">
          <div
            className="relative group cursor-pointer"
            onClick={() => avatarInputRef.current?.click()}
          >
            {/* Circle */}
            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-white/10 bg-blue-600 flex items-center justify-center">
              {user?.avatar ? (
                <NextImage
                  src={user.avatar}
                  alt={user.name}
                  width={96}
                  height={96}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-white text-3xl font-bold">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            {/* Overlay */}
            <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              {avatarUploading ? (
                <Loader2 className="w-6 h-6 text-white animate-spin" />
              ) : (
                <Camera className="w-6 h-6 text-white" />
              )}
            </div>
          </div>
          <p className="text-white/40 text-xs mt-2">Click to change photo</p>
          <input
            ref={avatarInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarChange}
          />
        </div>

        {/* Profile Information Section */}
        <form onSubmit={handleProfileSubmit}>
          <div className="bg-[#111118] border border-white/10 rounded-xl p-6 mb-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <User className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">
                  Personal Information
                </h2>
                <p className="text-xs text-white/40">
                  Update your personal details
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Name */}
              <div>
                <label htmlFor="name" className={labelClasses}>
                  <span className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5" />
                    Name
                  </span>
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  className={inputClasses}
                />
              </div>

              {/* Email (read-only) */}
              <div>
                <label htmlFor="email" className={labelClasses}>
                  <span className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5" />
                    Email
                  </span>
                </label>
                <input
                  id="email"
                  type="email"
                  value={user?.email || ""}
                  disabled
                  className={disabledInputClasses}
                />
              </div>

              {/* Phone */}
              <div className="sm:col-span-2">
                <PhoneInput label="Phone" value={phone} onChange={setPhone} />
              </div>

              {/* Role (read-only) */}
              <div>
                <label htmlFor="role" className={labelClasses}>
                  <span className="flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5" />
                    Role
                  </span>
                </label>
                <input
                  id="role"
                  type="text"
                  value={user?.role || ""}
                  disabled
                  className={disabledInputClasses}
                />
              </div>

              {/* City */}
              <div>
                <label htmlFor="city" className={labelClasses}>
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" />
                    City
                  </span>
                </label>
                <input
                  id="city"
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Your city"
                  className={inputClasses}
                />
              </div>

              {/* Company Name */}
              <div>
                <label htmlFor="companyName" className={labelClasses}>
                  <span className="flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5" />
                    Company Name
                  </span>
                </label>
                <input
                  id="companyName"
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Your company name"
                  className={inputClasses}
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="submit"
                disabled={savingProfile}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium text-sm px-6 py-2.5 rounded-lg transition-colors shadow-lg shadow-blue-600/20"
              >
                {savingProfile ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {savingProfile ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </form>

        {/* Change Password Section */}
        <form onSubmit={handlePasswordSubmit}>
          <div className="bg-[#111118] border border-white/10 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <Lock className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">
                  Change Password
                </h2>
                <p className="text-xs text-white/40">
                  Update your account password
                </p>
              </div>
            </div>

            <div className="space-y-5">
              {/* Current Password */}
              <div>
                <label htmlFor="currentPassword" className={labelClasses}>
                  Current Password
                </label>
                <div className="relative">
                  <input
                    id="currentPassword"
                    type={showCurrentPassword ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    className={`${inputClasses} pr-11`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label htmlFor="newPassword" className={labelClasses}>
                  New Password
                </label>
                <div className="relative">
                  <input
                    id="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password (min 6 characters)"
                    className={`${inputClasses} pr-11`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                  >
                    {showNewPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm New Password */}
              <div>
                <label htmlFor="confirmPassword" className={labelClasses}>
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className={`${inputClasses} pr-11`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="submit"
                disabled={
                  savingPassword ||
                  !currentPassword ||
                  !newPassword ||
                  !confirmPassword
                }
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium text-sm px-6 py-2.5 rounded-lg transition-colors shadow-lg shadow-blue-600/20"
              >
                {savingPassword ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Lock className="w-4 h-4" />
                )}
                {savingPassword ? "Updating..." : "Update Password"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
