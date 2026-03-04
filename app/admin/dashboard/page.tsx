import { auth } from "@/lib/auth";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function AdminDashboard() {
  const session = await auth();
  const [postsCount, pagesCount, usersCount] = await Promise.all([
    prisma.post.count(),
    prisma.page.count(),
    prisma.user.count(),
  ]);

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">Dashboard</h1>

      <p className="text-lg text-gray-700 mb-12">
        Welcome, <span className="font-bold">{session?.user?.name}</span>!
      </p>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-6 mb-12">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-600 text-sm font-medium mb-2">Blog Posts</h3>
          <p className="text-4xl font-bold">{postsCount}</p>
          <Link
            href="/admin/posts"
            className="text-blue-600 hover:underline text-sm mt-4 block"
          >
            Manage Posts →
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-600 text-sm font-medium mb-2">Pages</h3>
          <p className="text-4xl font-bold">{pagesCount}</p>
          <Link
            href="/admin/pages"
            className="text-blue-600 hover:underline text-sm mt-4 block"
          >
            Manage Pages →
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-600 text-sm font-medium mb-2">Users</h3>
          <p className="text-4xl font-bold">{usersCount}</p>
          <Link
            href="/admin/users"
            className="text-blue-600 hover:underline text-sm mt-4 block"
          >
            Manage Users →
          </Link>
        </div>
      </div>

      {/* Quick actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
        <div className="flex gap-4">
          <Link
            href="/admin/posts/new"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            + New Post
          </Link>
          <Link
            href="/admin/pages/new"
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
          >
            + New Page
          </Link>
        </div>
      </div>
    </div>
  );
}
