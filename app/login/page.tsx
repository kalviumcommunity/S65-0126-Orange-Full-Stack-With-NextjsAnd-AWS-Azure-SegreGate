"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Login failed");
        setLoading(false);
        return;
      }

      // Store token in memory (frontend) and cookie is set by server
      if (data.data?.accessToken) {
        localStorage.setItem("accessToken", data.data.accessToken);
        login(data.data.user);
        router.push("/dashboard");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md p-8 border border-gray-200 dark:border-gray-700 rounded-lg">
        <h1 className="text-2xl font-bold mb-6">Login</h1>

        {error && <p className="text-red-600 mb-4">{error}</p>}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}\n              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600\"\n              required\n            />\n          </div>\n\n          <div>\n            <label className=\"block text-sm font-medium mb-2\">Password</label>\n            <input\n              type=\"password\"\n              value={password}\n              onChange={(e) => setPassword(e.target.value)}\n              className=\"w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600\"\n              required\n            />\n          </div>\n\n          <button\n            type=\"submit\"\n            disabled={loading}\n            className=\"w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400\"\n          >\n            {loading ? \"Logging in...\" : \"Login\"}\n          </button>\n        </form>\n\n        <p className=\"text-center mt-4 text-sm\">\n          Don't have an account?{\" \"}\n          <a href=\"/signup\" className=\"text-blue-600 hover:underline\">\n            Sign up\n          </a>\n        </p>\n      </div>\n    </div>\n  );\n}\n