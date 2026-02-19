'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import useSWR from 'swr';
import { useAuth } from '@/hooks/useAuth';
import { reportSubmitSchema, type ReportSubmitInput } from '@/src/lib/schemas/formSchema';
import { advancedFetcher } from '@/src/lib/fetcher';
import FormInput from '@/components/form/FormInput';
import Button from '@/components/ui/Button';

export default function ReportSubmissionPage() {
  const { user, isLoading: authLoading } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ReportSubmitInput>({
    resolver: zodResolver(reportSubmitSchema),
    defaultValues: {
      location: '',
      description: '',
      photoUrl: '',
      segregationQuality: 'good',
    },
  });

  // Optional: mutate reports list after submission
  const { mutate: mutateReports } = useSWR(
    mounted && !authLoading && user ? '/api/reports' : null,
    advancedFetcher,
    { revalidateOnFocus: false }
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || authLoading) {
    return (
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">Submit Report</h1>
        <div className="animate-pulse space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          You need to be logged in to submit a report.
        </p>
      </div>
    );
  }

  const onSubmit = async (values: ReportSubmitInput) => {
    setIsSubmitting(true);

    const submitPromise = new Promise(async (resolve, reject) => {
      try {
        const response = await fetch('/api/reports', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(values),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to submit report');
        }

        await response.json();
        reset();
        mutateReports?.();
        resolve('Report submitted successfully!');
      } catch (error) {
        reject(error instanceof Error ? error.message : 'An error occurred');
      } finally {
        setIsSubmitting(false);
      }
    });

    toast.promise(submitPromise, {
      loading: 'Submitting report...',
      success: (msg) => `${msg}`,
      error: (err) => `Error: ${err}`,
    });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Submit Waste Segregation Report</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Help us improve waste management by reporting segregation quality at your location.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormInput
          label="Location"
          placeholder="e.g., Corporate Office, Building A, Floor 3"
          error={errors.location?.message}
          register={register('location')}
          required
        />

        <FormInput
          label="Description"
          placeholder="Describe the waste segregation status..."
          type="textarea"
          error={errors.description?.message}
          register={register('description')}
          rows={4}
        />

        <FormInput
          label="Photo URL (Optional)"
          placeholder="https://example.com/photo.jpg"
          type="url"
          error={errors.photoUrl?.message}
          register={register('photoUrl')}
        />

        <div>
          <label className="block text-sm font-medium mb-2">
            Segregation Quality <span className="text-red-500">*</span>
          </label>
          <select
            {...register('segregationQuality')}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select a quality level...</option>
            <option value="excellent">Excellent - Properly segregated</option>
            <option value="good">Good - Mostly segregated</option>
            <option value="fair">Fair - Some segregation issues</option>
            <option value="poor">Poor - Segregation not followed</option>
          </select>
          {errors.segregationQuality && (
            <p className="text-red-500 text-sm mt-1">{errors.segregationQuality.message}</p>
          )}
        </div>

        <div className="flex gap-3 pt-4">
          <Button type="submit" variant="primary" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit Report'}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              reset();
            }}
            disabled={isSubmitting}
          >
            Reset
          </Button>
        </div>
      </form>

      <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900 rounded border border-blue-200 dark:border-blue-700">
        <p className="text-sm text-blue-700 dark:text-blue-200 mb-2">
          <strong>Form Validation:</strong>
        </p>
        <ul className="text-sm text-blue-700 dark:text-blue-200 space-y-1 ml-4 list-disc">
          <li>Location: 3-255 characters</li>
          <li>Description: 10-1000 characters (optional)</li>
          <li>Photo URL: Must be valid URL format (optional)</li>
          <li>Quality: Must select a level</li>
        </ul>
      </div>
    </div>
  );
}
