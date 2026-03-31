"use client";

import { useState, useEffect, KeyboardEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Pencil, Check, X } from "lucide-react";

interface TaxonomyItem {
  id: string;
  name: string;
  slug: string;
  _count?: { posts: number };
}

interface TaxonomySectionProps {
  title: string;
  apiPath: string;
  isAdmin: boolean;
}

function TaxonomySection({ title, apiPath, isAdmin }: TaxonomySectionProps) {
  const [items, setItems] = useState<TaxonomyItem[]>([]);
  const [newName, setNewName] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [editError, setEditError] = useState("");

  useEffect(() => {
    fetch(apiPath)
      .then((r) => r.json())
      .then((data) => setItems(data))
      .finally(() => setIsLoading(false));
  }, [apiPath]);

  async function handleAdd() {
    const name = newName.trim();
    if (!name) return;
    setError("");

    const res = await fetch(apiPath, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });

    if (res.status === 409) { setError("Already exists"); return; }
    if (!res.ok) { setError("Failed to create"); return; }

    const created = await res.json();
    setItems((prev) => [...prev, created].sort((a, b) => a.name.localeCompare(b.name)));
    setNewName("");
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") { e.preventDefault(); handleAdd(); }
  }

  async function handleDelete(id: string) {
    const res = await fetch(`${apiPath}/${id}`, { method: "DELETE" });
    if (res.ok) setItems((prev) => prev.filter((i) => i.id !== id));
  }

  function startEdit(item: TaxonomyItem) {
    setEditingId(item.id);
    setEditingName(item.name);
    setEditError("");
  }

  function cancelEdit() {
    setEditingId(null);
    setEditingName("");
    setEditError("");
  }

  async function handleRename(id: string) {
    const name = editingName.trim();
    if (!name) return;
    setEditError("");

    const res = await fetch(`${apiPath}/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });

    if (res.status === 409) { setEditError("Already exists"); return; }
    if (!res.ok) { setEditError("Failed to update"); return; }

    const updated = await res.json();
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...updated, _count: i._count } : i))
        .sort((a, b) => a.name.localeCompare(b.name))
    );
    cancelEdit();
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">{title}</h2>

      <div className="flex gap-2">
        <Input
          value={newName}
          onChange={(e) => { setNewName(e.target.value); setError(""); }}
          onKeyDown={handleKeyDown}
          placeholder={`New ${title.toLowerCase().slice(0, -1)} name…`}
          className="max-w-xs"
        />
        <Button onClick={handleAdd} disabled={!newName.trim()}>Add</Button>
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading...</p>
      ) : items.length === 0 ? (
        <p className="text-sm text-muted-foreground">No {title.toLowerCase()} yet.</p>
      ) : (
        <ul className="space-y-2">
          {items.map((item) => (
            <li
              key={item.id}
              className="flex items-center justify-between px-4 py-2 border border-border rounded-lg bg-card"
            >
              {editingId === item.id ? (
                <div className="flex items-center gap-2 flex-1 mr-2">
                  <Input
                    value={editingName}
                    onChange={(e) => { setEditingName(e.target.value); setEditError(""); }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") { e.preventDefault(); handleRename(item.id); }
                      if (e.key === "Escape") cancelEdit();
                    }}
                    className="h-7 text-sm"
                    autoFocus
                  />
                  {editError && <p className="text-xs text-destructive whitespace-nowrap">{editError}</p>}
                  <button type="button" onClick={() => handleRename(item.id)} className="text-primary hover:opacity-70">
                    <Check className="w-4 h-4" />
                  </button>
                  <button type="button" onClick={cancelEdit} className="text-muted-foreground hover:opacity-70">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 flex-1">
                  <span className="font-medium">{item.name}</span>
                  <span className="text-xs text-muted-foreground font-mono">{item.slug}</span>
                  {item._count !== undefined && (
                    <span className="ml-auto mr-3 text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                      {item._count.posts} {item._count.posts === 1 ? "post" : "posts"}
                    </span>
                  )}
                </div>
              )}

              {isAdmin && editingId !== item.id && (
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => startEdit(item)}
                    className="text-xs text-muted-foreground hover:text-foreground transition"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(item.id)}
                    className="text-xs text-destructive hover:underline"
                  >
                    Delete
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

interface CategoriesClientProps {
  isAdmin: boolean;
}

export function CategoriesClient({ isAdmin }: CategoriesClientProps) {
  return (
    <div className="space-y-12">
      <TaxonomySection title="Categories" apiPath="/api/categories" isAdmin={isAdmin} />
      <TaxonomySection title="Tags" apiPath="/api/tags" isAdmin={isAdmin} />
    </div>
  );
}
