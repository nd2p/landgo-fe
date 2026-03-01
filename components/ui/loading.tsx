import { cn } from '@/lib/utils'

export interface LoadingProps {
    readonly label?: string
    readonly className?: string
    readonly spinnerClassName?: string
    readonly fullScreen?: boolean
}

export function Loading({
    label = 'Loading...',
    className,
    spinnerClassName,
    fullScreen = true,
}: LoadingProps) {
    return (
        <div
            className={cn(
                fullScreen ? 'min-h-screen flex items-center justify-center' : 'flex',
                className
            )}
            role="status"
            aria-live="polite"
        >
            <div className="flex items-center gap-3 text-muted-foreground">
                <span
                    className={cn(
                        'h-5 w-5 rounded-full border-2 border-muted-foreground/30 border-t-muted-foreground animate-spin',
                        spinnerClassName
                    )}
                    aria-hidden="true"
                />
                <span>{label}</span>
            </div>
        </div>
    )
}
