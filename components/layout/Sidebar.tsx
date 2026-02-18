"use client";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useUI } from "@/hooks/useUI";

export default function Sidebar() {
  const { isAuthenticated, user } = useAuth();
  const { sidebarOpen } = useUI();

  const publicLinks = [{ label: "Home", href: "/" }];

  const authenticatedLinks = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Reports", href: "/reports" },
    { label: "Profile", href: "/users/1" },
  ];

  const adminLinks = [{ label: "Admin Panel", href: "/admin" }];

  return (
    <aside
      className={`fixed left-0 top-16 h-screen w-64 bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-transform duration-300 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      } lg:translate-x-0 lg:static z-30`}
    >
      <nav className="p-6 space-y-4">
        {publicLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
          >
            {link.label}
          </Link>
        ))}

        {isAuthenticated && (
          <>
            <hr className="dark:border-gray-700" />
            {authenticatedLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
              >
                {link.label}
              </Link>
            ))}

            {user?.role === "admin" && (
              <>
                <hr className="dark:border-gray-700" />
                {adminLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                  >
                    {link.label}
                  </Link>
                ))}
              </>
            )}
          </>
        )}
      </nav>
    </aside>
  );
}
