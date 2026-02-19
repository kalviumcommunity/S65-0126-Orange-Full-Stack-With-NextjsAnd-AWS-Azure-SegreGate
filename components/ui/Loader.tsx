import { cn } from '@/src/lib/utils';
import { Loader2 } from 'lucide-react';

interface LoaderProps extends React.HTMLAttributes<HTMLDivElement> {
    size?: 'sm' | 'md' | 'lg';
}

export default function Loader({ className, size = 'md', ...props }: LoaderProps) {
    const sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-8 h-8',
        lg: 'w-12 h-12',
    };

    return (
        <div
            role="status"
            aria-live="polite"
            className={cn('flex items-center justify-center', className)}
            {...props}
        >
            <Loader2 className={cn('animate-spin text-blue-600', sizeClasses[size])} />
            <span className="sr-only">Loading...</span>
        </div>
    );
}
