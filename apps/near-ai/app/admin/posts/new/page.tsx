import { auth } from "@near/cms-core/lib/auth";
import { redirect } from "next/navigation";
import NewPostClient from "@near/cms-core/components/admin/NewPostClient";

export default async function NewPostPage() {
  const session = await auth();
  if ((session?.user as any)?.role === "VIEWER") redirect("/admin/posts");
  return <NewPostClient />;
}
