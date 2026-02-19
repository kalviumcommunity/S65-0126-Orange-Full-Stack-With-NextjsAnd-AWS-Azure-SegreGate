'use client';

import { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import Button from '@/components/ui/Button';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    description?: string;
    children?: React.ReactNode;
    footer?: React.ReactNode;
    variant?: 'default' | 'destructive';
}

export default function Modal({
    isOpen,
    onClose,
    title,
    description,
    children,
    footer,
    variant = 'default',
}: ModalProps) {

    // Close on Escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (isOpen && e.key === 'Escape') {
                onClose();
            }
        };

        // Lock body scroll
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        }

        window.addEventListener('keydown', handleEscape);

        return () => {
            window.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={onClose}
            role="presentation"
        >
            <div
                className={cn(
                    "bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-md border animate-in zoom-in-95 duration-200 relative overflow-hidden",
                    variant === 'destructive' ? "border-red-200 dark:border-red-900" : "border-gray-200 dark:border-gray-800"
                )}
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-title"
                aria-describedby={description ? "modal-description" : undefined}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-gray-50/50 dark:bg-gray-900/50">
                    <div>
                        <h2 id="modal-title" className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                            {title}
                        </h2>
                        {description && (
                            <p id="modal-description" className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                {description}
                            </p>
                        )}
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                        aria-label="Close"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    {children}
                </div>

                {/* Footer */}
                {footer && (
                    <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900/50 flex justify-end gap-3 border-t border-gray-100 dark:border-gray-800">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
}
