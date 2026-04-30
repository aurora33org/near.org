"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@near/cms-core/components/ui/button";
import { Input } from "@near/cms-core/components/ui/input";
import { toast } from "sonner";
import { useOnboarding } from "@near/cms-core/components/admin/onboarding/useOnboarding";

interface CurrentUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function SettingsPage() {
  const router = useRouter();
  const onboarding = useOnboarding();
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  // Profile form state
  const [profileName, setProfileName] = useState("");
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [profileError, setProfileError] = useState("");
  const [profileSuccess, setProfileSuccess] = useState(false);

  // Password form state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoadingPassword, setIsLoadingPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  // Load current user on mount
  useEffect(() => {
    async function loadUser() {
      try {
        const res = await fetch("/api/users/me");
        const data = await res.json();
        if (res.ok) {
          setCurrentUser(data);
          setProfileName(data.name);
        }
      } catch (error) {
        console.error("Failed to load user:", error);
      } finally {
        setIsLoadingUser(false);
      }
    }
    loadUser();
  }, []);

  async function handleProfileSubmit(e: React.FormEvent) {
    e.preventDefault();
    setProfileError("");
    setProfileSuccess(false);

    if (!profileName.trim()) {
      setProfileError("Name cannot be empty.");
      return;
    }

    setIsLoadingProfile(true);
    try {
      const res = await fetch("/api/users/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: profileName }),
      });

      const data = await res.json();
      if (!res.ok) {
        setProfileError(data.error ?? "Failed to update profile.");
        return;
      }

      setCurrentUser(data);
      setProfileSuccess(true);
      toast.success("Profile updated successfully");
      setTimeout(() => setProfileSuccess(false), 3000);
    } finally {
      setIsLoadingProfile(false);
    }
  }

  async function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess(false);

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }

    setIsLoadingPassword(true);
    try {
      const res = await fetch("/api/users/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();
      if (!res.ok) {
        setPasswordError(data.error ?? "Failed to update password.");
        return;
      }

      setPasswordSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      toast.success("Password updated successfully");
      setTimeout(() => setPasswordSuccess(false), 3000);
    } finally {
      setIsLoadingPassword(false);
    }
  }

  if (isLoadingUser) {
    return (
      <div className="space-y-8 max-w-lg">
        <h1 className="text-4xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-lg">
      <h1 className="text-4xl font-bold">Settings</h1>

      {/* Profile Section */}
      <div className="bg-card border border-border rounded-xl p-6 space-y-6">
        <h2 className="text-lg font-semibold">Profile</h2>

        <form onSubmit={handleProfileSubmit} className="space-y-4">
          {profileError && (
            <div className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-4 py-3">
              {profileError}
            </div>
          )}
          {profileSuccess && (
            <div className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-4 py-3">
              Profile updated successfully.
            </div>
          )}

          <div className="space-y-1">
            <label className="text-sm font-medium text-muted-foreground">Email</label>
            <Input type="email" value={currentUser?.email || ""} disabled className="opacity-60" />
            <p className="text-xs text-muted-foreground mt-1">Email cannot be changed</p>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-muted-foreground">Name</label>
            <Input
              type="text"
              value={profileName}
              onChange={(e) => setProfileName(e.target.value)}
              required
            />
          </div>

          <Button type="submit" disabled={isLoadingProfile} className="w-full">
            {isLoadingProfile ? "Saving…" : "Save Profile"}
          </Button>
        </form>
      </div>

      {/* Change Password Section */}
      <div className="bg-card border border-border rounded-xl p-6 space-y-6">
        <h2 className="text-lg font-semibold">Change Password</h2>

        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          {passwordError && (
            <div className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-4 py-3">
              {passwordError}
            </div>
          )}
          {passwordSuccess && (
            <div className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-4 py-3">
              Password updated successfully.
            </div>
          )}

          <div className="space-y-1">
            <label className="text-sm font-medium text-muted-foreground">Current password</label>
            <Input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-muted-foreground">New password</label>
            <Input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={8}
              autoComplete="new-password"
              placeholder="At least 8 characters"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-muted-foreground">Confirm new password</label>
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              autoComplete="new-password"
            />
          </div>

          <Button type="submit" disabled={isLoadingPassword} className="w-full">
            {isLoadingPassword ? "Updating…" : "Update Password"}
          </Button>
        </form>
      </div>

      {/* Onboarding Section */}
      <div className="bg-card border border-border rounded-xl p-6 space-y-4">
        <h2 className="text-lg font-semibold">Onboarding</h2>
        <p className="text-sm text-muted-foreground">
          Replay the getting-started tour to revisit how this CMS works.
        </p>
        <Button
          variant="outline"
          className="w-full"
          onClick={() => {
            onboarding.restartTour();
            router.push("/admin/dashboard");
            toast.success("Tour restarted — head to the dashboard to begin.");
          }}
        >
          Restart tour
        </Button>
      </div>
    </div>
  );
}
