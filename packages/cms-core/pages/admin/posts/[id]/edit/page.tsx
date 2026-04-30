import { auth } from "@cms/lib/auth";
import { redirect } from "next/navigation";
import EditPostClient from "@cms/components/admin/EditPostClient";

export default async function EditPostPage() {
  const session = await auth();
  if ((session?.user as any)?.role === "VIEWER") redirect("/admin/posts");
  const userRole = (session?.user as any)?.role || "VIEWER";
  return <EditPostClient userRole={userRole} />;
}
