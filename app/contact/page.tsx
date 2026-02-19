'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { contactSchema, type ContactFormInput } from '@/src/lib/schemas/formSchema';
import FormInput from '@/components/form/FormInput';
import Button from '@/components/ui/Button';

export default function ContactPage() {
  const [mounted, setMounted] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      message: '',
    },
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">Contact Us</h1>
        <div className="animate-pulse space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  const onSubmit = async (values: ContactFormInput) => {
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      // Simulate API call (in real app, you'd have /api/contact endpoint)
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // For demo purposes, just show success
      console.log('Contact form submitted:', values);
      setSubmitSuccess(true);
      reset();

      // Auto-hide success message after 3 seconds
      setTimeout(() => setSubmitSuccess(false), 3000);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Get in Touch</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Have a question or feedback? We&apos;d love to hear from you.
        </p>
      </div>

      {submitSuccess && (
        <div className="bg-green-100 dark:bg-green-900 border border-green-400 dark:border-green-700 text-green-700 dark:text-green-200 px-4 py-3 rounded">
          <p className="font-bold">✓ Message sent successfully!</p>
          <p className="text-sm">We&apos;ll get back to you soon.</p>
        </div>
      )}

      {submitError && (
        <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 px-4 py-3 rounded">
          <p className="font-bold">Error</p>
          <p className="text-sm">{submitError}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormInput
          label="Your Name"
          placeholder="John Doe"
          error={errors.name?.message}
          register={register('name')}
          required
        />

        <FormInput
          label="Email Address"
          placeholder="john@example.com"
          type="email"
          error={errors.email?.message}
          register={register('email')}
          required
        />

        <FormInput
          label="Message"
          placeholder="Your message here..."
          type="textarea"
          error={errors.message?.message}
          register={register('message')}
          rows={5}
          required
        />

        <div className="flex gap-3 pt-4">
          <Button type="submit" variant="primary" disabled={isSubmitting}>
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              reset();
              setSubmitError(null);
            }}
            disabled={isSubmitting}
          >
            Clear
          </Button>
        </div>
      </form>

      <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900 rounded border border-blue-200 dark:border-blue-700">
        <p className="text-sm text-blue-700 dark:text-blue-200 mb-2">
          <strong>Validation Rules:</strong>
        </p>
        <ul className="text-sm text-blue-700 dark:text-blue-200 space-y-1 ml-4 list-disc">
          <li>Name: 2-100 characters</li>
          <li>Email: Valid email format</li>
          <li>Message: 10-2000 characters</li>
        </ul>
      </div>
    </div>
  );
}
