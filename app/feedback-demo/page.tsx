'use client';

import { useState } from 'react';
import { toast } from 'react-hot-toast';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Loader from '@/components/ui/Loader';
import { Trash2, CheckCircle, Info, AlertTriangle } from 'lucide-react';

export default function FeedbackDemoPage() {
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    // Instant Feedback (Toast)
    const showSuccessToast = () => toast.success('Action completed successfully!');
    const showErrorToast = () => toast.error('Something went wrong!');
    const showLoadingToast = () => {
        toast.promise(
            new Promise((resolve) => setTimeout(resolve, 2000)),
            {
                loading: 'Processing...',
                success: 'Done!',
                error: 'Failed',
            }
        );
    };

    // Blocking Feedback (Modal) + Process Feedback (Loader)
    const handleDelete = async () => {
        setIsDeleting(true);
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 2000));
        setIsDeleting(false);
        setIsDeleteModalOpen(false);
        toast.success('Item deleted successfully!');
    };

    return (
        <div className="container mx-auto py-10 px-4 space-y-12">
            <div className="space-y-4">
                <h1 className="text-3xl font-bold">Feedback UI Showcase</h1>
                <p className="text-gray-600 dark:text-gray-400">
                    Demonstrating interactive feedback layers: Toasts, Modals, and Loaders.
                </p>
            </div>

            {/* 1. Instant Feedback */}
            <section className="space-y-4 p-6 border rounded-lg bg-gray-50 dark:bg-gray-900/50">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    1. Instant Feedback (Toasts)
                </h2>
                <p className="text-sm text-gray-500">Non-intrusive notifications for success, error, or status updates.</p>
                <div className="flex flex-wrap gap-4">
                    <Button onClick={showSuccessToast} variant="primary" className="bg-green-600 hover:bg-green-700">
                        Show Success
                    </Button>
                    <Button onClick={showErrorToast} variant="danger">
                        Show Error
                    </Button>
                    <Button onClick={showLoadingToast} variant="secondary">
                        Show Promise Toast
                    </Button>
                </div>
            </section>

            {/* 2. Blocking Feedback */}
            <section className="space-y-4 p-6 border rounded-lg bg-gray-50 dark:bg-gray-900/50">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-orange-500" />
                    2. Blocking Feedback (Modals)
                </h2>
                <p className="text-sm text-gray-500">
                    Dialogs that require user attention or confirmation before proceeding.
                </p>
                <div className="flex flex-wrap gap-4">
                    <Button onClick={() => setIsInfoModalOpen(true)} variant="secondary">
                        Open Info Modal
                    </Button>
                    <Button onClick={() => setIsDeleteModalOpen(true)} variant="danger">
                        Open Destructive Modal
                    </Button>
                </div>
            </section>

            {/* 3. Process Feedback */}
            <section className="space-y-4 p-6 border rounded-lg bg-gray-50 dark:bg-gray-900/50">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                    <Loader size="md" className="animate-spin text-blue-500" />
                    3. Process Feedback (Loaders)
                </h2>
                <p className="text-sm text-gray-500">Custom loader components for async operations.</p>
                <div className="flex gap-8 items-center p-4 bg-white dark:bg-gray-800 rounded border">
                    <div className="flex flex-col items-center gap-2">
                        <span className="text-xs text-gray-500">Small</span>
                        <Loader size="sm" />
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <span className="text-xs text-gray-500">Medium</span>
                        <Loader size="md" />
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <span className="text-xs text-gray-500">Large</span>
                        <Loader size="lg" />
                    </div>
                </div>
            </section>

            {/* 4. Combined Flow */}
            <section className="space-y-4 p-6 border border-blue-200 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h2 className="text-xl font-semibold flex items-center gap-2 text-blue-700 dark:text-blue-300">
                    <Info className="w-5 h-5" />
                    4. Combined User Flow
                </h2>
                <p className="text-sm text-blue-600 dark:text-blue-400">
                    <strong>Scenario:</strong> Deleting a critical item.
                    <br />
                    Flow: Click Delete (Toast) → Confirmation Modal (Blocking) → Confirm → Processing (Loader) → Success (Toast).
                </p>
                <Button onClick={() => setIsDeleteModalOpen(true)} variant="danger">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Critical Item
                </Button>
            </section>

            {/* Modals */}
            <Modal
                isOpen={isInfoModalOpen}
                onClose={() => setIsInfoModalOpen(false)}
                title="Information"
                description="This is a standard modal for displaying information."
                footer={
                    <Button onClick={() => setIsInfoModalOpen(false)} variant="secondary">
                        Close
                    </Button>
                }
            >
                <p className="text-gray-600 dark:text-gray-300">
                    Modals trap focus and prevent interaction with the background page.
                    Use them sparingly for important content.
                </p>
            </Modal>

            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => !isDeleting && setIsDeleteModalOpen(false)}
                title="Delete Item?"
                description="This action cannot be undone. Are you sure you want to permanently delete this item?"
                variant="destructive"
                footer={
                    <>
                        <Button
                            onClick={() => setIsDeleteModalOpen(false)}
                            variant="secondary"
                            disabled={isDeleting}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleDelete}
                            variant="danger"
                            disabled={isDeleting}
                            className="min-w-[100px]"
                        >
                            {isDeleting ? <Loader size="sm" className="text-white" /> : 'Delete'}
                        </Button>
                    </>
                }
            >
                <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded border border-red-100 dark:border-red-900 text-red-600 dark:text-red-400 text-sm">
                    <strong>Warning:</strong> This will remove the item from the database.
                </div>
            </Modal>
        </div>
    );
}
