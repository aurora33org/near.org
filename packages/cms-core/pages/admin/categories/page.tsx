import { auth } from "@cms/lib/auth";
import { CategoriesClient } from "./CategoriesClient";

export default async function CategoriesPage() {
  const session = await auth();
  const role = (session?.user as any)?.role ?? "EDITOR";

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold">Categories &amp; Tags</h1>
      <CategoriesClient isAdmin={role === "ADMIN"} />
    </div>
  );
}
