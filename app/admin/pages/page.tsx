import Link from "next/link";

export default function PagesPage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Pages</h1>
        <Link
          href="/admin/pages/new"
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          + New Page
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-500">Pages management coming soon</p>
      </div>
    </div>
  );
}
