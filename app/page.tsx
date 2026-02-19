'use client';

import Link from 'next/link';
import { Recycle, CheckCircle, BarChart3, ArrowRight, Leaf, MapPin, Camera } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export default function HomePage() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <div className="-m-6">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-green-50 to-white px-6 pb-16 pt-8 dark:from-gray-900 dark:to-gray-950">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-green-100 opacity-50 blur-3xl dark:bg-green-900/20" />
          <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-emerald-100 opacity-50 blur-3xl dark:bg-emerald-900/20" />
        </div>
        
        <div className="relative mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-green-200 bg-white/80 px-4 py-2 text-sm font-medium text-green-700 shadow-sm backdrop-blur dark:border-green-800 dark:bg-gray-900/80 dark:text-green-400">
            <Leaf className="h-4 w-4" />
            Making waste segregation accountable
          </div>
          
          <h1 className="text-5xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-6xl">
            Seg<span className="text-green-600 dark:text-green-500">re</span>Gate
          </h1>
          
          <p className="mx-auto mt-6 max-w-2xl text-xl leading-relaxed text-gray-600 dark:text-gray-400">
            A simple way for communities to track waste segregation. Report, verify, and improve together.
          </p>
          
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            {isLoading ? (
              <div className="h-12 w-40 animate-pulse rounded-xl bg-gray-200 dark:bg-gray-700" />
            ) : isAuthenticated ? (
              <Link
                href="/dashboard"
                className="inline-flex h-12 items-center gap-2 rounded-xl bg-green-600 px-8 text-base font-semibold text-white shadow-lg shadow-green-600/25 transition-all hover:bg-green-700 hover:shadow-xl hover:shadow-green-600/30"
              >
                Go to Dashboard
                <ArrowRight className="h-4 w-4" />
              </Link>
            ) : (
              <>
                <Link
                  href="/signup"
                  className="inline-flex h-12 items-center gap-2 rounded-xl bg-green-600 px-8 text-base font-semibold text-white shadow-lg shadow-green-600/25 transition-all hover:bg-green-700 hover:shadow-xl hover:shadow-green-600/30"
                >
                  Start Reporting
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/login"
                  className="inline-flex h-12 items-center rounded-xl border-2 border-gray-200 bg-white px-8 text-base font-semibold text-gray-700 transition-colors hover:border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
                >
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="px-6 py-10">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Three simple steps
            </h2>
            <p className="mt-3 text-gray-600 dark:text-gray-400">
              From report to verified — the process is straightforward
            </p>
          </div>
          
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {[
              { 
                step: '01',
                icon: Camera, 
                title: 'Submit a Report', 
                desc: 'Take a photo of your segregated waste and submit with your location. Takes less than a minute.',
                color: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
              },
              { 
                step: '02',
                icon: CheckCircle, 
                title: 'Get Verified', 
                desc: 'Community volunteers review submissions and verify compliance with segregation standards.',
                color: 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400'
              },
              { 
                step: '03',
                icon: BarChart3, 
                title: 'Track Progress', 
                desc: 'See your contribution and how your area is performing over time.',
                color: 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400'
              },
            ].map((item, index) => (
              <div key={item.step} className="flex flex-col items-center text-center">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-green-800 text-sm font-bold text-white shadow-md">
                  {index + 1}
                </div>
                <div className="flex h-full w-full flex-col rounded-2xl border border-gray-100 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                  <div className={`mx-auto inline-flex h-12 w-12 items-center justify-center rounded-xl ${item.color}`}>
                    <item.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-6 text-lg font-semibold text-gray-900 dark:text-white">
                    {item.title}
                  </h3>
                  <p className="mt-2 flex-1 text-gray-600 dark:text-gray-400">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="border-y border-gray-100 bg-gray-50 px-6 py-10 dark:border-gray-800 dark:bg-gray-900/50">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-gray-900">
              <Camera className="h-8 w-8 text-green-600" />
              <h3 className="mt-4 font-semibold text-gray-900 dark:text-white">Photo Evidence</h3>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Each report includes photo proof for transparency and verification.
              </p>
            </div>
            <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-gray-900">
              <MapPin className="h-8 w-8 text-green-600" />
              <h3 className="mt-4 font-semibold text-gray-900 dark:text-white">Location Tracking</h3>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Area-wise tracking helps identify neighborhoods that need attention.
              </p>
            </div>
            <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-gray-900">
              <Recycle className="h-8 w-8 text-green-600" />
              <h3 className="mt-4 font-semibold text-gray-900 dark:text-white">Segregation Quality</h3>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Rate and track the quality of waste segregation in your reports.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-10">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            {isAuthenticated ? 'Continue where you left off' : 'Ready to make a difference?'}
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            {isAuthenticated 
              ? 'Head back to your dashboard to submit reports or check your progress.'
              : 'Join your community in building better waste management practices.'
            }
          </p>
          {isLoading ? (
            <div className="mt-8 inline-block h-12 w-48 animate-pulse rounded-xl bg-gray-200 dark:bg-gray-700" />
          ) : (
            <Link
              href={isAuthenticated ? '/dashboard' : '/signup'}
              className="mt-8 inline-flex h-12 items-center gap-2 rounded-xl bg-green-600 px-8 text-base font-semibold text-white shadow-lg shadow-green-600/25 transition-all hover:bg-green-700"
            >
              {isAuthenticated ? 'Back to Dashboard' : 'Create Free Account'}
              <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </div>
      </section>
    </div>
  );
}
