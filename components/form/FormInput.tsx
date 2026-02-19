'use client';

import { FieldError, UseFormRegisterReturn } from 'react-hook-form';

interface FormInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'label'> {
  label: string;
  register: UseFormRegisterReturn;
  error?: FieldError | string;
  rows?: number; // For textarea
}

/**
 * Reusable form input component that works with React Hook Form
 * Handles both text inputs and textarea elements
 */
export default function FormInput({
  label,
  type = 'text',
  placeholder,
  register,
  error,
  disabled = false,
  required = false,
  rows,
  ...rest
}: FormInputProps) {
  const isTextarea = type === 'textarea';
  const fieldName = register.name || 'field';

  return (
    <div className="mb-4">
      <label
        htmlFor={fieldName}
        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {isTextarea ? (
        <textarea
          id={fieldName}
          placeholder={placeholder}
          disabled={disabled}
          rows={rows || 4}
          {...register}
          className={`w-full px-3 py-2 border rounded-lg outline-none transition-colors ${
            error
              ? 'border-red-500 focus:ring-1 focus:ring-red-500'
              : 'border-gray-300 focus:border-green-500 focus:ring-1 focus:ring-green-500'
          } dark:border-gray-600 dark:bg-gray-800 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed`}
        />
      ) : (
        <input
          id={fieldName}
          type={type}
          placeholder={placeholder}
          disabled={disabled}
          {...register}
          {...rest}
          className={`w-full px-3 py-2 border rounded-lg outline-none transition-colors ${
            error
              ? 'border-red-500 focus:ring-1 focus:ring-red-500'
              : 'border-gray-300 focus:border-green-500 focus:ring-1 focus:ring-green-500'
          } dark:border-gray-600 dark:bg-gray-800 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed`}
        />
      )}

      {error && (
        <p className="mt-1 text-sm text-red-500 dark:text-red-400">
          {typeof error === 'string' ? error : error.message}
        </p>
      )}
    </div>
  );
}
