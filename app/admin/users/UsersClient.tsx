"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatAdminDate } from "@/lib/utils";
import { toast } from "sonner";

type Role = "ADMIN" | "EDITOR"; // VIEWER exists in DB/backend but is not assignable from the UI

interface User {
  id: string;
  name: string;
  email: string;
  role: string; // string to accommodate any legacy VIEWER rows in DB
  createdAt: string;
}

interface UsersClientProps {
  initialUsers: User[];
  currentUserId: string;
}

const ROLES: Role[] = ["ADMIN", "EDITOR"]; // VIEWER intentionally excluded from UI

const roleBadgeClass = (role: string) => {
  if (role === "ADMIN") return "bg-destructive/10 text-destructive border-destructive/30";
  if (role === "EDITOR") return "bg-primary/10 text-primary border-primary/30";
  return "bg-muted text-muted-foreground border-border";
};

export function UsersClient({ initialUsers, currentUserId }: UsersClientProps) {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [showCreate, setShowCreate] = useState(false);
  const [showInvite, setShowInvite] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Create form state
  const [createName, setCreateName] = useState("");
  const [createEmail, setCreateEmail] = useState("");
  const [createPassword, setCreatePassword] = useState("");
  const [createRole, setCreateRole] = useState<Role>("EDITOR");

  // Invite form state
  const [inviteName, setInviteName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<Role>("EDITOR");

  // Edit form state
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editRole, setEditRole] = useState<string>("EDITOR");
  const [editPassword, setEditPassword] = useState("");

  function openEdit(user: User) {
    setEditingUser(user);
    setEditName(user.name);
    setEditEmail(user.email);
    setEditRole(user.role);
    setEditPassword("");
    setError("");
  }

  function closeCreate() {
    setShowCreate(false);
    setCreateName(""); setCreateEmail(""); setCreatePassword(""); setCreateRole("EDITOR");
    setError("");
  }

  function closeInvite() {
    setShowInvite(false);
    setInviteName(""); setInviteEmail(""); setInviteRole("EDITOR");
    setError("");
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: createName, email: createEmail, password: createPassword, role: createRole }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Failed to create user"); return; }
      setUsers((prev) => [data, ...prev]);
      closeCreate();
    } finally {
      setIsLoading(false);
    }
  }

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (!editingUser) return;
    setError("");
    setIsLoading(true);
    try {
      const body: any = { name: editName, email: editEmail, role: editRole };
      if (editPassword) body.password = editPassword;
      const res = await fetch(`/api/users/${editingUser.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Failed to update user"); return; }
      setUsers((prev) => prev.map((u) => (u.id === data.id ? data : u)));
      setEditingUser(null);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDelete() {
    if (!deleteConfirm) return;
    setIsLoading(true);
    try {
      const res = await fetch(`/api/users/${deleteConfirm.id}`, { method: "DELETE" });
      if (res.ok) {
        setUsers((prev) => prev.filter((u) => u.id !== deleteConfirm.id));
        setDeleteConfirm(null);
      }
    } finally {
      setIsLoading(false);
    }
  }

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      const res = await fetch("/api/users/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: inviteName, email: inviteEmail, role: inviteRole }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Failed to send invitation"); return; }
      closeInvite();
      // Show success message (optional: add toast)
      toast.success(`Invitation sent to ${inviteEmail}`);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center gap-3">
        <h1 className="text-4xl font-bold">Users</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => { setShowInvite(true); setError(""); }}>Invite User</Button>
          <Button onClick={() => { setShowCreate(true); setError(""); }}>+ New User</Button>
        </div>
      </div>

      <div className="bg-background border border-border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th className="px-6 py-3 text-left font-medium text-muted-foreground text-sm">Name</th>
              <th className="px-6 py-3 text-left font-medium text-muted-foreground text-sm">Email</th>
              <th className="px-6 py-3 text-left font-medium text-muted-foreground text-sm">Role</th>
              <th className="px-6 py-3 text-left font-medium text-muted-foreground text-sm">Created</th>
              <th className="px-6 py-3 text-right font-medium text-muted-foreground text-sm">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-muted/40 transition-colors">
                <td className="px-6 py-4 font-medium text-foreground">{user.name}</td>
                <td className="px-6 py-4 text-sm text-muted-foreground">{user.email}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${roleBadgeClass(user.role)}`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-muted-foreground">
                  {formatAdminDate(user.createdAt)}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="ghost" size="sm" onClick={() => openEdit(user)}>Edit</Button>
                    {user.id !== currentUserId && (
                      <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => setDeleteConfirm(user)}>
                        Delete
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create Dialog */}
      {showCreate && (
        <Modal title="New User" onClose={closeCreate}>
          <form onSubmit={handleCreate} className="space-y-4">
            {error && <p className="text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2">{error}</p>}
            <Field label="Name"><Input value={createName} onChange={(e) => setCreateName(e.target.value)} required /></Field>
            <Field label="Email"><Input type="email" value={createEmail} onChange={(e) => setCreateEmail(e.target.value)} required /></Field>
            <Field label="Password"><Input type="password" value={createPassword} onChange={(e) => setCreatePassword(e.target.value)} required minLength={8} placeholder="Min. 8 characters" /></Field>
            <Field label="Role">
              <RoleSelect value={createRole} onChange={setCreateRole} />
            </Field>
            <div className="flex gap-3 pt-2">
              <Button type="button" variant="outline" className="flex-1" onClick={closeCreate}>Cancel</Button>
              <Button type="submit" className="flex-1" disabled={isLoading}>{isLoading ? "Creating…" : "Create"}</Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Invite Dialog */}
      {showInvite && (
        <Modal title="Invite User" onClose={closeInvite}>
          <form onSubmit={handleInvite} className="space-y-4">
            {error && <p className="text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2">{error}</p>}
            <Field label="Name"><Input value={inviteName} onChange={(e) => setInviteName(e.target.value)} required /></Field>
            <Field label="Email"><Input type="email" value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} required /></Field>
            <Field label="Role">
              <RoleSelect value={inviteRole} onChange={setInviteRole} />
            </Field>
            <p className="text-xs text-muted-foreground bg-muted/30 rounded-lg px-3 py-2">
              An invitation link will be sent to this email. The user will set their own password when they accept.
            </p>
            <div className="flex gap-3 pt-2">
              <Button type="button" variant="outline" className="flex-1" onClick={closeInvite}>Cancel</Button>
              <Button type="submit" className="flex-1" disabled={isLoading}>{isLoading ? "Sending…" : "Send Invitation"}</Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Edit Dialog */}
      {editingUser && (
        <Modal title="Edit User" onClose={() => setEditingUser(null)}>
          <form onSubmit={handleUpdate} className="space-y-4">
            {error && <p className="text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2">{error}</p>}
            <Field label="Name"><Input value={editName} onChange={(e) => setEditName(e.target.value)} required /></Field>
            <Field label="Email"><Input type="email" value={editEmail} onChange={(e) => setEditEmail(e.target.value)} required /></Field>
            <Field label="Role">
              <RoleSelect value={editRole} onChange={setEditRole} />
            </Field>
            <Field label="New password (leave blank to keep)">
              <Input type="password" value={editPassword} onChange={(e) => setEditPassword(e.target.value)} minLength={8} placeholder="Min. 8 characters" />
            </Field>
            <div className="flex gap-3 pt-2">
              <Button type="button" variant="outline" className="flex-1" onClick={() => setEditingUser(null)}>Cancel</Button>
              <Button type="submit" className="flex-1" disabled={isLoading}>{isLoading ? "Saving…" : "Save"}</Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Confirm */}
      {deleteConfirm && (
        <Modal title="Delete User" onClose={() => setDeleteConfirm(null)}>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Are you sure you want to delete <span className="font-medium text-foreground">{deleteConfirm.name}</span> ({deleteConfirm.email})?
              This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setDeleteConfirm(null)}>Cancel</Button>
              <Button variant="destructive" className="flex-1" onClick={handleDelete} disabled={isLoading}>
                {isLoading ? "Deleting…" : "Delete"}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-muted-foreground">{label}</label>
      {children}
    </div>
  );
}

function RoleSelect({ value, onChange }: { value: string; onChange: (r: Role) => void }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as Role)}
      className="w-full border border-input rounded-[var(--radius)] px-3 py-2 text-sm bg-input/40 dark:bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
    >
      {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
    </select>
  );
}

function Modal({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={onClose}>
      <div className="bg-background border border-border rounded-2xl shadow-xl w-full max-w-md mx-4 p-6 space-y-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button type="button" onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-muted text-muted-foreground text-lg leading-none">×</button>
        </div>
        {children}
      </div>
    </div>
  );
}
