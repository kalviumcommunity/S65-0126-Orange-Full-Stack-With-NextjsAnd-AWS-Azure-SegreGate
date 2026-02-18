"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export default function UserProfilePage({ params }: { params: { id: string } }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await fetch(`/api/users/${params.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          setError("User not found");
          setLoading(false);
          return;
        }

        const data = await response.json();
        setUser(data.data);
      } catch (err) {
        setError("Failed to fetch user");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [params.id]);

  if (loading) return <p className="text-center py-12\">Loading...</p>;
  if (error) return <p className=\"text-center py-12 text-red-600\">{error}</p>;
  if (!user) return null;

  return (
    <div className=\"py-12 px-6\">
      <Link href=\"/dashboard\" className=\"text-blue-600 hover:underline mb-6 inline-block\">\n        ← Back to Dashboard\n      </Link>\n\n      <div className=\"max-w-2xl p-6 border border-gray-200 dark:border-gray-700 rounded-lg\">\n        <h1 className=\"text-3xl font-bold mb-4\">{user.name}</h1>\n        <div className=\"space-y-3\">\n          <p><span className=\"font-semibold\">Email:</span> {user.email}</p>\n          <p><span className=\"font-semibold\">Role:</span> {user.role}</p>\n          <p><span className=\"font-semibold\">Member Since:</span> {new Date(user.createdAt).toLocaleDateString()}</p>\n        </div>\n      </div>\n    </div>\n  );\n}\n