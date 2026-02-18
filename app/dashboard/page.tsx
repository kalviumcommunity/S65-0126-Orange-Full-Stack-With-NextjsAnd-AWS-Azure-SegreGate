"use client";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";

export default function DashboardPage() {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated || !user) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Please log in to access the dashboard.
        </p>
        <Link href="/login" className="text-blue-600 hover:underline">
          Go to Login
        </Link>
      </div>
    );
  }

  return (
    <div className="py-12 px-6">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">My Reports</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            View and manage your waste segregation reports.
          </p>
          <Link
            href="/reports"
            className="text-blue-600 hover:underline font-medium"
          >
            Go to Reports →
          </Link>
        </div>

        <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Users</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            View all users and their roles.
          </p>
          <Link
            href="/users/1"
            className="text-blue-600 hover:underline font-medium"
          >
            View Users →
          </Link>
        </div>
      </div>

      <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Your Role</h2>
        <p className="text-gray-600 dark:text-gray-300">
          Current role: <strong>{user.role}</strong>
        </p>
      </div>
    </div>
  );
}
