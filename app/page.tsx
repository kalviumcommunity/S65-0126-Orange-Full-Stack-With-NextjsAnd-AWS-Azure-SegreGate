"use client";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useUI } from "@/hooks/useUI";

export default function Home() {
  const { isAuthenticated, user } = useAuth();
  const { theme, toggleTheme } = useUI();

  return (
    <div className="flex flex-col items-center justify-center py-12 px-6">
      <div className="max-w-2xl text-center">
        <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
          SegreGate
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
          Community-driven waste segregation tracking. Report your waste segregation, 
          help verify reports, and monitor compliance.
        </p>

        {!isAuthenticated ? (
          <Link
            href="/login"
            className="inline-block px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
          >
            Get Started
          </Link>
        ) : (
          <div className="space-y-4">
            <p className="text-lg mb-4">Welcome, {user?.name}!</p>
            <Link
              href="/dashboard"
              className="inline-block px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
            >
              Go to Dashboard
            </Link>
          </div>
        )}

        <button
          onClick={toggleTheme}
          className="mt-8 px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded text-sm"
        >
          Toggle {theme === "light" ? "Dark" : "Light"} Mode
        </button>
      </div>
    </div>
  );
}
