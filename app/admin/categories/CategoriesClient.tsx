"use client";

import { useState, useEffect, KeyboardEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface TaxonomyItem {
  id: string;
  name: string;
  slug: string;
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

    if (res.status === 409) {
      setError("Already exists");
      return;
    }
    if (!res.ok) {
      setError("Failed to create");
      return;
    }

    const created = await res.json();
    setItems((prev) => [...prev, created].sort((a, b) => a.name.localeCompare(b.name)));
    setNewName("");
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAdd();
    }
  }

  async function handleDelete(id: string) {
    const res = await fetch(`${apiPath}/${id}`, { method: "DELETE" });
    if (res.ok) {
      setItems((prev) => prev.filter((i) => i.id !== id));
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">{title}</h2>

      <div className="flex gap-2">
        <Input
          value={newName}
          onChange={(e) => { setNewName(e.target.value); setError(""); }}
          onKeyDown={handleKeyDown}
          placeholder={`New ${title.toLowerCase().slice(0, -1)} name...`}
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
              <div>
                <span className="font-medium">{item.name}</span>
                <span className="ml-2 text-xs text-muted-foreground font-mono">{item.slug}</span>
              </div>
              {isAdmin && (
                <button
                  type="button"
                  onClick={() => handleDelete(item.id)}
                  className="text-xs text-destructive hover:underline"
                >
                  Delete
                </button>
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
