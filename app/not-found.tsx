import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <h1 className="text-6xl font-bold text-green-600">404</h1>

      <h2 className="mt-4 text-2xl font-semibold text-gray-900 dark:text-white">
        Page Not Found
      </h2>

      <p className="mt-2 text-gray-500 dark:text-gray-400">
        The page you are looking for doesn&apos;t exist or has been moved.
      </p>

      <div className="mt-8 flex gap-4">
        <Link
          href="/"
          className="inline-flex items-center rounded-lg bg-green-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-green-700"
        >
          Go Home
        </Link>
        <Link
          href="/dashboard"
          className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-6 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200"
        >
          Dashboard
        </Link>
      </div>
    </div>
  );
}
