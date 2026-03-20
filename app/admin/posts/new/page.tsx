import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import NewPostClient from "@/components/admin/NewPostClient";

export default async function NewPostPage() {
  const session = await auth();
  if ((session?.user as any)?.role === "VIEWER") redirect("/admin/posts");
  return <NewPostClient />;
}
