import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="-m-6">
      {/* ── Hero ──────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-green-50 to-emerald-100 px-6 py-20 dark:from-gray-900 dark:to-gray-800">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
            ♻️ SegreGate
          </h1>
          <p className="mt-2 text-lg font-medium text-green-600 dark:text-green-400">
            Community-Driven Waste Segregation
          </p>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600 dark:text-gray-300">
            Track, report, and verify waste segregation at the source level.
            Empower households, volunteers, and authorities to work together for
            cleaner, greener communities.
          </p>

          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href="/login"
              className="inline-flex h-12 items-center justify-center rounded-lg bg-green-600 px-8 text-base font-semibold text-white shadow-sm transition-colors hover:bg-green-700"
            >
              Get Started
            </Link>
            <Link
              href="/about"
              className="inline-flex h-12 items-center justify-center rounded-lg border border-gray-300 bg-white px-8 text-base font-semibold text-gray-700 shadow-sm transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* ── How It Works ──────────────────────────────────────────── */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-3xl font-bold text-gray-900 dark:text-white">
            How It Works
          </h2>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 text-2xl dark:bg-green-900/30">
                📝
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
                Report
              </h3>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Households submit waste segregation reports with photo proof and
                location details.
              </p>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-2xl dark:bg-blue-900/30">
                ✅
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
                Verify
              </h3>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Community volunteers and authorities verify submitted reports to
                ensure compliance.
              </p>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 text-2xl dark:bg-purple-900/30">
                📊
              </div>
              <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
                Monitor
              </h3>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Authorities view area-wise segregation statistics and trends
                through dashboards.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Roles ─────────────────────────────────────────────────── */}
      <section className="border-t border-gray-200 bg-gray-50 px-6 py-16 dark:border-gray-800 dark:bg-gray-900">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Built for Everyone
          </h2>

          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
              <p className="text-2xl">🏠</p>
              <h3 className="mt-2 font-semibold text-gray-900 dark:text-white">
                Households
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Submit reports &amp; track your segregation habits
              </p>
            </div>

            <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
              <p className="text-2xl">🤝</p>
              <h3 className="mt-2 font-semibold text-gray-900 dark:text-white">
                Volunteers
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Verify reports &amp; help maintain community standards
              </p>
            </div>

            <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
              <p className="text-2xl">🏛️</p>
              <h3 className="mt-2 font-semibold text-gray-900 dark:text-white">
                Authorities
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Monitor compliance &amp; make data-driven decisions
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Responsive & Theme Showcase ────────────────────────────── */}
      <section className="bg-white px-6 py-16 dark:bg-gray-950">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-3xl font-bold text-gray-900 dark:text-white">
            Responsive & Theme Aware
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-gray-600 dark:text-gray-400">
            This section demonstrates the custom brand colors and responsive
            layout configured in <code>tailwind.config.js</code>.
          </p>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {/* Brand Light */}
            <div className="rounded-lg bg-brand-light p-6 text-center shadow-sm">
              <p className="font-semibold text-gray-900">Brand Light</p>
              <p className="text-sm text-gray-800">#93C5FD</p>
            </div>

            {/* Brand Default */}
            <div className="rounded-lg bg-brand py-6 text-center shadow-sm">
              <p className="font-semibold text-white">Brand Default</p>
              <p className="text-sm text-white/90">#3B82F6</p>
            </div>

            {/* Brand Dark */}
            <div className="rounded-lg bg-brand-dark p-6 text-center shadow-sm">
              <p className="font-semibold text-white">Brand Dark</p>
              <p className="text-sm text-white/90">#1E40AF</p>
            </div>

            {/* Responsive Card */}
            <div className="rounded-lg border-2 border-dashed border-gray-300 p-6 text-center dark:border-gray-700">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Current Breakpoint:
              </p>
              <p className="mt-1 text-lg font-bold text-gray-900 dark:text-white sm:text-brand md:text-brand-dark lg:text-brand-light">
                <span className="block sm:hidden">Default (Mobile)</span>
                <span className="hidden sm:block md:hidden">SM (Small)</span>
                <span className="hidden md:block lg:hidden">MD (Medium)</span>
                <span className="hidden lg:block xl:hidden">LG (Large)</span>
                <span className="hidden xl:block">XL (Extra Large)</span>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
