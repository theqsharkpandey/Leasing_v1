"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Users,
  Search,
  ChevronDown,
  ShieldCheck,
  ShieldAlert,
  Shield,
  UserCheck,
  UserX,
  RefreshCw,
  Loader2,
  X,
} from "lucide-react";
import api from "@/lib/api";

// ── Types ─────────────────────────────────────────────────────────────────────
interface AdminUser {
  _id: string;
  name: string;
  email: string;
  role: string;
  accountStatus: string;
  createdAt: string;
  city?: string;
  companyName?: string;
}

// ── Role badge config ─────────────────────────────────────────────────────────
const ROLE_BADGE: Record<string, { label: string; cls: string }> = {
  owner: {
    label: "Owner",
    cls: "bg-gray-400/10 text-gray-300 border-gray-400/20",
  },
  agent: {
    label: "Agent",
    cls: "bg-blue-400/10 text-blue-400 border-blue-400/20",
  },
  builder: {
    label: "Builder",
    cls: "bg-purple-400/10 text-purple-400 border-purple-400/20",
  },
  admin: {
    label: "Admin",
    cls: "bg-red-400/10 text-red-400 border-red-400/20",
  },
  super_admin: {
    label: "Super Admin",
    cls: "bg-yellow-400/10 text-yellow-300 border-yellow-400/20",
  },
  public_user: {
    label: "Public",
    cls: "bg-gray-400/10 text-gray-400 border-gray-400/20",
  },
};

const STATUS_BADGE: Record<string, string> = {
  active: "bg-green-400/10 text-green-400 border-green-400/20",
  suspended: "bg-red-400/10 text-red-400 border-red-400/20",
};

function RoleBadge({ role }: { role: string }) {
  const cfg = ROLE_BADGE[role] || {
    label: role,
    cls: "bg-gray-400/10 text-gray-400 border-gray-400/20",
  };
  return (
    <span
      className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded border capitalize ${cfg.cls}`}
    >
      {cfg.label}
    </span>
  );
}

// ── Confirmation modal ────────────────────────────────────────────────────────
interface ModalProps {
  title: string;
  description: string;
  confirmLabel: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

function ConfirmModal({
  title,
  description,
  confirmLabel,
  danger,
  onConfirm,
  onCancel,
}: ModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="bg-[#111118] border border-white/10 rounded-2xl p-6 max-w-sm w-full shadow-2xl">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-white font-semibold text-base">{title}</h3>
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <p className="text-sm text-gray-400 mb-6">{description}</p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 text-sm border border-white/10 text-gray-400 hover:text-white rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 px-4 py-2 text-sm font-semibold text-white rounded-lg transition-colors ${
              danger
                ? "bg-red-600 hover:bg-red-700"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Actions dropdown ──────────────────────────────────────────────────────────
interface ActionsProps {
  user: AdminUser;
  currentRole: string;
  onRoleChange: (userId: string, role: string) => void;
  onStatusChange: (userId: string, status: string) => void;
}

function ActionsDropdown({
  user,
  currentRole,
  onRoleChange,
  onStatusChange,
}: ActionsProps) {
  const [open, setOpen] = useState(false);
  const isSuperAdmin = currentRole === "super_admin";

  const toggle = () => setOpen((p) => !p);
  const close = () => setOpen(false);

  const isAdmin = ["admin", "super_admin"].includes(user.role);
  const canChangeRole = isSuperAdmin && user.role !== "super_admin";
  const canChangeStatus = user.role !== "super_admin";

  return (
    <div className="relative">
      <button
        onClick={toggle}
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-white/10 text-gray-400 hover:text-white hover:border-white/20 rounded-lg transition-colors"
      >
        Actions <ChevronDown className="h-3 w-3" />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={close} />
          <div className="absolute right-0 top-full mt-1 z-20 bg-[#111118] border border-white/10 rounded-xl shadow-2xl py-1 min-w-[180px]">
            {/* Role actions — super_admin only */}
            {canChangeRole && (
              <>
                {user.role !== "admin" && (
                  <button
                    onClick={() => {
                      onRoleChange(user._id, "admin");
                      close();
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-left text-red-400 hover:bg-white/5 transition-colors"
                  >
                    <ShieldAlert className="h-3.5 w-3.5" />
                    Promote to Admin
                  </button>
                )}
                {user.role === "admin" && (
                  <button
                    onClick={() => {
                      onRoleChange(user._id, "owner");
                      close();
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-left text-amber-400 hover:bg-white/5 transition-colors"
                  >
                    <Shield className="h-3.5 w-3.5" />
                    Demote to Owner
                  </button>
                )}
                {user.role === "owner" && (
                  <>
                    <button
                      onClick={() => {
                        onRoleChange(user._id, "agent");
                        close();
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-left text-blue-400 hover:bg-white/5 transition-colors"
                    >
                      <ShieldCheck className="h-3.5 w-3.5" />
                      Set as Agent
                    </button>
                    <button
                      onClick={() => {
                        onRoleChange(user._id, "builder");
                        close();
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-left text-purple-400 hover:bg-white/5 transition-colors"
                    >
                      <ShieldCheck className="h-3.5 w-3.5" />
                      Set as Builder
                    </button>
                  </>
                )}
                {(user.role === "agent" || user.role === "builder") && (
                  <button
                    onClick={() => {
                      onRoleChange(user._id, "owner");
                      close();
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-left text-gray-300 hover:bg-white/5 transition-colors"
                  >
                    <Shield className="h-3.5 w-3.5" />
                    Set as Owner
                  </button>
                )}
                <div className="border-t border-white/5 my-1" />
              </>
            )}

            {/* Status actions — admin + super_admin */}
            {canChangeStatus && (
              <>
                {user.accountStatus !== "suspended" ? (
                  <button
                    onClick={() => {
                      onStatusChange(user._id, "suspended");
                      close();
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-left text-red-400 hover:bg-white/5 transition-colors"
                  >
                    <UserX className="h-3.5 w-3.5" />
                    Suspend Account
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      onStatusChange(user._id, "active");
                      close();
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-left text-green-400 hover:bg-white/5 transition-colors"
                  >
                    <UserCheck className="h-3.5 w-3.5" />
                    Activate Account
                  </button>
                )}
              </>
            )}

            {!canChangeRole && !canChangeStatus && (
              <p className="px-4 py-2 text-xs text-gray-500">
                No actions available
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);
  const [currentUserRole, setCurrentUserRole] = useState("");

  // Confirmation modal state
  const [modal, setModal] = useState<{
    title: string;
    description: string;
    confirmLabel: string;
    danger?: boolean;
    onConfirm: () => void;
  } | null>(null);

  // Get current user role from localStorage
  useEffect(() => {
    try {
      const u = JSON.parse(localStorage.getItem("user") || "{}");
      setCurrentUserRole(u.role || "");
    } catch {}
  }, []);

  const showToast = (msg: string, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (roleFilter) params.set("role", roleFilter);
      if (statusFilter) params.set("status", statusFilter);
      const res = await api.get(`/admin/users?${params.toString()}`);
      setUsers(res.data.users || []);
      setTotal(res.data.total || 0);
    } catch (err: any) {
      showToast(err.response?.data?.error || "Failed to load users", false);
    } finally {
      setLoading(false);
    }
  }, [search, roleFilter, statusFilter]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleRoleChange = (userId: string, newRole: string) => {
    const user = users.find((u) => u._id === userId);
    const isPromotion = ["admin"].includes(newRole);
    setModal({
      title: isPromotion ? "Promote to Admin?" : `Set role to ${newRole}?`,
      description: `Change ${user?.name}'s role to "${newRole}". This affects their access immediately.`,
      confirmLabel: isPromotion ? "Promote" : "Change Role",
      danger: isPromotion,
      onConfirm: async () => {
        setModal(null);
        try {
          const res = await api.patch(`/admin/users/${userId}/role`, {
            role: newRole,
          });
          setUsers((prev) =>
            prev.map((u) => (u._id === userId ? { ...u, role: newRole } : u)),
          );
          showToast(res.data.message || "Role updated");
        } catch (err: any) {
          showToast(
            err.response?.data?.error || "Failed to change role",
            false,
          );
        }
      },
    });
  };

  const handleStatusChange = (userId: string, newStatus: string) => {
    const user = users.find((u) => u._id === userId);
    const isSuspend = newStatus === "suspended";
    setModal({
      title: isSuspend ? "Suspend Account?" : "Activate Account?",
      description: isSuspend
        ? `${user?.name} will be blocked from logging in.`
        : `${user?.name}'s account will be restored.`,
      confirmLabel: isSuspend ? "Suspend" : "Activate",
      danger: isSuspend,
      onConfirm: async () => {
        setModal(null);
        try {
          const res = await api.patch(`/admin/users/${userId}/status`, {
            accountStatus: newStatus,
          });
          setUsers((prev) =>
            prev.map((u) =>
              u._id === userId ? { ...u, accountStatus: newStatus } : u,
            ),
          );
          showToast(res.data.message || "Status updated");
        } catch (err: any) {
          showToast(
            err.response?.data?.error || "Failed to change status",
            false,
          );
        }
      },
    });
  };

  const ROLE_OPTIONS = ["owner", "agent", "builder", "admin", "super_admin"];

  return (
    <div>
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl text-sm font-semibold shadow-lg ${
            toast.ok ? "bg-green-600 text-white" : "bg-red-600 text-white"
          }`}
        >
          {toast.msg}
        </div>
      )}

      {/* Confirmation modal */}
      {modal && (
        <ConfirmModal
          title={modal.title}
          description={modal.description}
          confirmLabel={modal.confirmLabel}
          danger={modal.danger}
          onConfirm={modal.onConfirm}
          onCancel={() => setModal(null)}
        />
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">User Management</h1>
          <p className="text-sm text-gray-500 mt-0.5">{total} total users</p>
        </div>
        <button
          onClick={fetchUsers}
          className="flex items-center gap-2 px-4 py-2 text-sm border border-white/10 text-gray-400 hover:text-white hover:border-white/20 rounded-lg transition-colors"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-5">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-4 py-2.5 text-sm text-white placeholder-gray-500 outline-none focus:border-blue-500/40"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="bg-[#13131a] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white outline-none"
          style={{ colorScheme: "dark" }}
        >
          <option value="">All Roles</option>
          {ROLE_OPTIONS.map((r) => (
            <option key={r} value={r} className="bg-[#13131a]">
              {ROLE_BADGE[r]?.label ?? r}
            </option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-[#13131a] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white outline-none"
          style={{ colorScheme: "dark" }}
        >
          <option value="">All Statuses</option>
          <option value="active" className="bg-[#13131a]">
            Active
          </option>
          <option value="suspended" className="bg-[#13131a]">
            Suspended
          </option>
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="h-8 w-8 text-blue-400 animate-spin" />
        </div>
      ) : users.length === 0 ? (
        <div className="bg-[#111118] border border-white/10 rounded-xl p-12 text-center">
          <Users className="h-10 w-10 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-500">No users found.</p>
        </div>
      ) : (
        <div className="bg-[#111118] border border-white/10 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">
                  Role
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                  Status
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                  Joined
                </th>
                <th className="px-5 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {users.map((u) => (
                <tr
                  key={u._id}
                  className="hover:bg-white/[0.02] transition-colors"
                >
                  <td className="px-5 py-4">
                    <div>
                      <p className="text-sm font-medium text-white">{u.name}</p>
                      <p className="text-xs text-gray-500">{u.email}</p>
                      {u.companyName && (
                        <p className="text-xs text-gray-600 mt-0.5">
                          {u.companyName}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-4 hidden md:table-cell">
                    <RoleBadge role={u.role} />
                  </td>
                  <td className="px-5 py-4 hidden sm:table-cell">
                    <span
                      className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded border capitalize ${
                        STATUS_BADGE[u.accountStatus] || STATUS_BADGE.active
                      }`}
                    >
                      {u.accountStatus || "active"}
                    </span>
                  </td>
                  <td className="px-5 py-4 hidden lg:table-cell">
                    <span className="text-xs text-gray-500">
                      {new Date(u.createdAt).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <ActionsDropdown
                      user={u}
                      currentRole={currentUserRole}
                      onRoleChange={handleRoleChange}
                      onStatusChange={handleStatusChange}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Role legend */}
      <div className="mt-6 flex flex-wrap gap-3">
        <p className="text-xs text-gray-600 self-center">Role legend:</p>
        {Object.entries(ROLE_BADGE).map(([key, { label, cls }]) => (
          <span
            key={key}
            className={`text-[10px] font-bold px-2 py-0.5 rounded border ${cls}`}
          >
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
