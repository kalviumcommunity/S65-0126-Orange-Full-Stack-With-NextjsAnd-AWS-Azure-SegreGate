'use client';

import { useState, useEffect, useRef } from 'react';
import { toast } from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/hooks/useAuth';
import { useAuthenticatedSWR } from '@/hooks/useAuthenticatedSWR';
import { reportSubmitSchema, type ReportSubmitInput } from '@/src/lib/schemas/formSchema';
import { ALLOWED_IMAGE_TYPES, MAX_FILE_SIZE_BYTES } from '@/src/lib/s3';
import FormInput from '@/components/form/FormInput';
import Button from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ImagePlus, X } from 'lucide-react';

type UploadState = 'idle' | 'requesting' | 'uploading' | 'done' | 'error';

export default function ReportSubmissionPage() {
  const { user, isLoading: authLoading, accessToken } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // File upload state
  const [uploadState, setUploadState] = useState<UploadState>('idle');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadedPhotoUrl, setUploadedPhotoUrl] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<ReportSubmitInput>({
    resolver: zodResolver(reportSubmitSchema),
    defaultValues: {
      location: '',
      description: '',
      photoUrl: '',
      segregationQuality: 'good',
    },
  });

  const { mutate: mutateReports } = useAuthenticatedSWR(
    mounted && !authLoading && user ? '/api/reports' : null,
    { revalidateOnFocus: false }
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  // ─── File selection & S3 upload ──────────────────────────────────────────
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      toast.error('Only JPEG, PNG, WebP and GIF images are allowed.');
      return;
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
      toast.error('File is too large. Maximum size is 5 MB.');
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    setUploadState('requesting');
    setUploadProgress(0);

    try {
      // Step 1: Get presigned URL from our API
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(accessToken && { 'Authorization': `Bearer ${accessToken}` }),
        },
        credentials: 'include',
        body: JSON.stringify({ filename: file.name, mimeType: file.type, size: file.size }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Failed to get upload URL');
      }

      const { data } = await res.json();
      const { presignedUrl, publicUrl } = data as { presignedUrl: string; publicUrl: string; key: string };

      // Step 2: Upload file directly to S3 via XHR for progress tracking
      setUploadState('uploading');

      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.upload.addEventListener('progress', (evt) => {
          if (evt.lengthComputable) setUploadProgress(Math.round((evt.loaded / evt.total) * 100));
        });
        xhr.addEventListener('load', () => {
          xhr.status === 200 || xhr.status === 204 ? resolve() : reject(new Error(`S3 upload failed: ${xhr.status}`));
        });
        xhr.addEventListener('error', () => reject(new Error('Network error during upload')));
        xhr.open('PUT', presignedUrl);
        xhr.setRequestHeader('Content-Type', file.type);
        xhr.send(file);
      });

      // Step 3: Store URL in form
      setUploadedPhotoUrl(publicUrl);
      setValue('photoUrl', publicUrl);
      setUploadState('done');
      toast.success('Photo uploaded!');
    } catch (err) {
      setUploadState('error');
      setPreviewUrl(null);
      toast.error(err instanceof Error ? err.message : 'Upload failed');
    }
  };

  const clearUpload = () => {
    setUploadState('idle');
    setUploadProgress(0);
    setPreviewUrl(null);
    setUploadedPhotoUrl('');
    setValue('photoUrl', '');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // ─── Report submit ────────────────────────────────────────────────────────
  const onSubmit = async (values: ReportSubmitInput) => {
    setIsSubmitting(true);

    const submitPromise = new Promise(async (resolve, reject) => {
      try {
        const response = await fetch('/api/reports', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(accessToken && { 'Authorization': `Bearer ${accessToken}` }),
          },
          credentials: 'include',
          body: JSON.stringify(values),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to submit report');
        }

        await response.json();
        reset();
        clearUpload();
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

  // ─── Guards ───────────────────────────────────────────────────────────────
  if (!mounted || authLoading) {
    return (
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">Submit Report</h1>
        <div className="animate-pulse space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-12 bg-gray-200 dark:bg-gray-700 rounded" />
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

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Submit Report</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Report waste segregation quality at your location.
        </p>
      </div>

      <Card>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 p-6">
          <FormInput
            label="Location"
            placeholder="e.g., Building A, Floor 3"
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
            rows={3}
          />

          {/* Photo Upload */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Photo <span className="font-normal text-gray-400">(optional, max 5 MB)</span>
            </label>

            {(uploadState === 'idle' || uploadState === 'error') ? (
              <label
                htmlFor="photo-upload"
                className="flex h-32 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 transition-colors hover:border-green-400 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-green-600"
              >
                <ImagePlus className="mb-2 h-6 w-6 text-gray-400" />
                <p className="text-sm text-gray-500 dark:text-gray-400">Click to upload</p>
                <p className="mt-0.5 text-xs text-gray-400">JPEG, PNG, WebP, GIF</p>
                <input
                  id="photo-upload"
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
            ) : (
              <div className="relative overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
                {previewUrl && (
                  <img src={previewUrl} alt="Preview" className="h-44 w-full object-cover" />
                )}

                {(uploadState === 'requesting' || uploadState === 'uploading') && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/50">
                    <p className="text-sm font-medium text-white">
                      {uploadState === 'requesting' ? 'Preparing...' : `${uploadProgress}%`}
                    </p>
                    <div className="h-1.5 w-2/3 overflow-hidden rounded-full bg-white/20">
                      <div
                        className="h-full bg-green-400 transition-all"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                )}

                {uploadState === 'done' && (
                  <button
                    type="button"
                    onClick={clearUpload}
                    className="absolute right-2 top-2 rounded-full bg-gray-900/70 p-1.5 text-white transition-colors hover:bg-red-600"
                    aria-label="Remove photo"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            )}

            <input type="hidden" {...register('photoUrl')} value={uploadedPhotoUrl} />
            {errors.photoUrl && (
              <p className="mt-1 text-sm text-red-500">{errors.photoUrl.message}</p>
            )}
          </div>

          {/* Segregation Quality */}
          <div>
            <label
              htmlFor="quality"
              className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Segregation Quality <span className="text-red-500">*</span>
            </label>
            <select
              id="quality"
              {...register('segregationQuality')}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            >
              <option value="">Select quality level...</option>
              <option value="excellent">Excellent — Properly segregated</option>
              <option value="good">Good — Mostly segregated</option>
              <option value="fair">Fair — Some issues</option>
              <option value="poor">Poor — Not followed</option>
            </select>
            {errors.segregationQuality && (
              <p className="mt-1 text-sm text-red-500">{errors.segregationQuality.message}</p>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting || uploadState === 'uploading' || uploadState === 'requesting'}
              loading={isSubmitting}
            >
              Submit Report
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => { reset(); clearUpload(); }}
              disabled={isSubmitting}
            >
              Reset
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
