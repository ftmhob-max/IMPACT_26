"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase/client";
import { SignOutButton } from "@/components/auth/SignOutButton";
import { IconTile, SectionPanel, StatusBadge } from "@/components/ui/LearnerPrimitives";
import * as Icons from "@/components/ui/Icons";
import { UserAvatar } from "@/components/profile/UserAvatar";

type ProfileUser = {
  uid: string;
  email: string;
  fullName: string;
  role: string;
  photoURL: string | null;
  emailVerified: boolean;
  providerIds: string[];
  createdAt?: string;
  lastSignInAt?: string;
};

type ProfilePayload = {
  user: ProfileUser;
};

export function ProfileClient() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [profile, setProfile] = useState<ProfilePayload | null>(null);
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function loadProfile() {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/profile", { cache: "no-store" });
      if (!response.ok) throw new Error("Unable to load profile.");
      const payload = (await response.json()) as ProfilePayload;
      setProfile(payload);
      setFullName(payload.user.fullName || "");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load profile.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadProfile();
  }, []);

  const user = profile?.user;
  const createdAt = useMemo(() => formatDate(user?.createdAt), [user?.createdAt]);
  const lastSignInAt = useMemo(() => formatDate(user?.lastSignInAt), [user?.lastSignInAt]);

  async function refreshClientAuth() {
    await auth.currentUser?.reload();
    window.dispatchEvent(new Event("impact26:profile-updated"));
    router.refresh();
  }

  async function saveName(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");
    try {
      const response = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.error || "Unable to save profile.");
      setProfile(payload as ProfilePayload);
      setMessage("Profile saved.");
      await refreshClientAuth();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save profile.");
    } finally {
      setSaving(false);
    }
  }

  async function uploadAvatar(file: File | undefined) {
    if (!file) return;
    setUploading(true);
    setMessage("");
    setError("");
    try {
      const formData = new FormData();
      formData.append("avatar", file);
      const response = await fetch("/api/profile/avatar", { method: "POST", body: formData });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.error || "Unable to upload avatar.");
      setProfile((current) => current ? { ...current, user: { ...current.user, photoURL: payload.photoURL } } : current);
      setMessage("Avatar updated.");
      await refreshClientAuth();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to upload avatar.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function removeAvatar() {
    setUploading(true);
    setMessage("");
    setError("");
    try {
      const response = await fetch("/api/profile/avatar", { method: "DELETE" });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.error || "Unable to remove avatar.");
      setProfile((current) => current ? { ...current, user: { ...current.user, photoURL: null } } : current);
      setMessage("Avatar removed.");
      await refreshClientAuth();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to remove avatar.");
    } finally {
      setUploading(false);
    }
  }

  if (loading) {
    return (
      <SectionPanel>
        <div className="flex items-center gap-3 p-6 text-sm font-semibold text-slate-500">
          <Icons.Loader size={16} className="animate-spin" />
          Loading profile...
        </div>
      </SectionPanel>
    );
  }

  if (!user) {
    return (
      <SectionPanel>
        <div className="p-6 text-sm font-semibold text-red-700">{error || "Profile unavailable."}</div>
      </SectionPanel>
    );
  }

  return (
    <div className="space-y-6">
      {(message || error) && (
        <div
          className={`rounded-lg border px-4 py-3 text-sm font-bold ${
            error ? "border-red-200 bg-red-50 text-red-700" : "border-emerald-200 bg-emerald-50 text-emerald-700"
          }`}
        >
          {error || message}
        </div>
      )}

      <SectionPanel>
        <div className="grid gap-6 p-5 lg:grid-cols-[260px_1fr] lg:p-6">
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-5 text-center">
            <UserAvatar
              fullName={user.fullName}
              email={user.email}
              photoURL={user.photoURL}
              size="xl"
              className="mx-auto shadow-sm"
            />
            <div className="mt-4">
              <p className="text-lg font-extrabold tracking-[-0.02em] text-slate-950">{user.fullName || "Learner"}</p>
              <p className="mt-1 truncate text-sm font-medium text-slate-500">{user.email}</p>
              <StatusBadge tone="blue" className="mt-3 capitalize">{user.role}</StatusBadge>
            </div>
            <div className="mt-5 grid gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif"
                className="hidden"
                onChange={(event) => void uploadAvatar(event.target.files?.[0])}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-[#185FA5] px-4 py-2 text-sm font-bold text-white shadow-sm transition-colors hover:bg-[#0d3d6e] disabled:cursor-not-allowed disabled:opacity-55"
              >
                {uploading ? <Icons.Loader size={15} className="animate-spin" /> : <Icons.Upload size={15} />}
                {uploading ? "Updating..." : "Upload avatar"}
              </button>
              <button
                type="button"
                onClick={() => void removeAvatar()}
                disabled={uploading || !user.photoURL}
                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-600 shadow-sm transition-colors hover:bg-slate-50 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-55"
              >
                <Icons.Trash2 size={15} />
                Remove photo
              </button>
            </div>
            <p className="mt-3 text-xs leading-5 text-slate-500">JPG, PNG, WebP, or GIF. Max 2 MB.</p>
          </div>

          <div className="min-w-0">
            <form onSubmit={saveName} className="rounded-lg border border-slate-200 bg-white p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-sm font-extrabold text-slate-900">Account details</h2>
                  <p className="mt-1 text-xs leading-5 text-slate-500">Update the name learners and admins see.</p>
                </div>
                <IconTile icon={Icons.User} tone="blue" />
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <label className="block sm:col-span-2">
                  <span className="mb-1.5 block text-sm font-bold text-slate-700">Display name</span>
                  <input
                    value={fullName}
                    onChange={(event) => setFullName(event.target.value)}
                    required
                    maxLength={120}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-900 outline-none transition-shadow focus:border-[#185FA5] focus:ring-4 focus:ring-[#185FA5]/12"
                  />
                </label>
                <ReadOnlyField label="Email" value={user.email || "No email available"} />
                <ReadOnlyField label="Role" value={user.role} />
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-[#185FA5] px-4 py-2 text-sm font-bold text-white shadow-sm transition-colors hover:bg-[#0d3d6e] disabled:cursor-not-allowed disabled:opacity-55"
                >
                  {saving ? <Icons.Loader size={15} className="animate-spin" /> : <Icons.Check size={15} />}
                  {saving ? "Saving..." : "Save profile"}
                </button>
                <SignOutButton />
              </div>
            </form>

            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <SummaryTile label="Email status" value={user.emailVerified ? "Verified" : "Not verified"} icon={Icons.ShieldCheck} />
              <SummaryTile label="Joined" value={createdAt} icon={Icons.History} />
              <SummaryTile label="Last sign in" value={lastSignInAt} icon={Icons.Lock} />
            </div>
          </div>
        </div>
      </SectionPanel>

      <div className="grid gap-4 md:grid-cols-3">
        <ProfileLink href="/progress" title="My Progress" detail="Scores, domain focus, saved formulas, and notes." icon={Icons.BarChart3} />
        <ProfileLink href="/settings" title="Settings" detail="Reminders, display preferences, privacy, and security." icon={Icons.Settings} />
        <ProfileLink href="/courses" title="Continue Learning" detail="Return to courses and practice exams." icon={Icons.GraduationCap} />
      </div>
    </div>
  );
}

function ReadOnlyField({ label, value }: { label: string; value: string }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-bold text-slate-700">{label}</span>
      <input
        value={value}
        readOnly
        className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-3 text-sm font-semibold text-slate-600 outline-none"
      />
    </label>
  );
}

function SummaryTile({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <Icon size={17} className="text-[#185FA5]" />
      <p className="mt-3 text-[11px] font-extrabold uppercase tracking-[0.08em] text-slate-500">{label}</p>
      <p className="mt-1 truncate text-sm font-bold text-slate-900">{value}</p>
    </div>
  );
}

function ProfileLink({
  href,
  title,
  detail,
  icon: Icon,
}: {
  href: string;
  title: string;
  detail: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
}) {
  return (
    <Link
      href={href}
      className="group rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="flex items-center justify-between gap-3">
        <IconTile icon={Icon} tone="blue" />
        <Icons.ArrowRight size={16} className="text-slate-400 transition-colors group-hover:text-[#185FA5]" />
      </div>
      <p className="mt-4 text-sm font-extrabold text-slate-900">{title}</p>
      <p className="mt-1 text-xs leading-5 text-slate-500">{detail}</p>
    </Link>
  );
}

function formatDate(value?: string) {
  if (!value) return "Unknown";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Unknown";
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}
