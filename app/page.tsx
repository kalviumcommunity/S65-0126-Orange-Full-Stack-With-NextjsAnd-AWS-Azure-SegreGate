import Link from 'next/link';
import { Recycle, FileText, CheckCircle, BarChart3, Home, HandHelping, Building2 } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="-m-6">
      {/* Hero */}
      <section className="border-b border-gray-200 bg-white px-6 py-20 dark:border-gray-800 dark:bg-gray-900">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-4 py-1.5 text-sm font-medium text-green-700 dark:border-green-800 dark:bg-green-900/20 dark:text-green-400">
            <Recycle className="h-4 w-4" />
            Community-Driven Waste Segregation
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
            SegreGate
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-gray-600 dark:text-gray-400">
            Track, report, and verify waste segregation at the source level.
            Empowering households, volunteers, and authorities to work together.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/login"
              className="inline-flex h-11 items-center rounded-lg bg-green-600 px-6 text-sm font-semibold text-white transition-colors hover:bg-green-700"
            >
              Get Started
            </Link>
            <Link
              href="/about"
              className="inline-flex h-11 items-center rounded-lg border border-gray-300 bg-white px-6 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="px-6 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center text-2xl font-bold text-gray-900 dark:text-white">
            How It Works
          </h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              { icon: FileText, title: 'Report', desc: 'Households submit waste segregation reports with photo proof and location details.' },
              { icon: CheckCircle, title: 'Verify', desc: 'Community volunteers verify submitted reports to ensure compliance.' },
              { icon: BarChart3, title: 'Monitor', desc: 'Authorities view area-wise segregation statistics and trends.' },
            ].map((step) => (
              <div
                key={step.title}
                className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400">
                  <step.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-semibold text-gray-900 dark:text-white">
                  {step.title}
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Roles */}
      <section className="border-t border-gray-200 bg-gray-50 px-6 py-16 dark:border-gray-800 dark:bg-gray-950">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Built for Everyone
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              { icon: Home, title: 'Households', desc: 'Submit reports & track your segregation habits' },
              { icon: HandHelping, title: 'Volunteers', desc: 'Verify reports & help maintain standards' },
              { icon: Building2, title: 'Authorities', desc: 'Monitor compliance & make data-driven decisions' },
            ].map((role) => (
              <div
                key={role.title}
                className="rounded-lg border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900"
              >
                <role.icon className="mx-auto h-6 w-6 text-green-600 dark:text-green-400" />
                <h3 className="mt-3 font-semibold text-gray-900 dark:text-white">
                  {role.title}
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {role.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
