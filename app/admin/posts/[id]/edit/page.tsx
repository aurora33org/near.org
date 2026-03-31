import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import EditPostClient from "@/components/admin/EditPostClient";

export default async function EditPostPage() {
  const session = await auth();
  if ((session?.user as any)?.role === "VIEWER") redirect("/admin/posts");
  return <EditPostClient />;
}
