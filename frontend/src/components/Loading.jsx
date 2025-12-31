export function LoadingSpinner({ size = "md", className = "" }) {
    const sizeClasses = {
        sm: "w-4 h-4",
        md: "w-8 h-8",
        lg: "w-12 h-12",
        xl: "w-16 h-16",
    };

    return (
        <div className={`flex items-center justify-center ${className}`}>
            <div
                className={`${sizeClasses[size]} border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin`}
            />
        </div>
    );
}

export function PageLoader({ message = "Loading..." }) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <LoadingSpinner size="xl" />
            <p className="mt-4 text-slate-600 animate-pulse">{message}</p>
        </div>
    );
}

export function SkeletonCard() {
    return (
        <div className="card-organic p-5 animate-pulse">
            <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-slate-200" />
                <div className="flex-1">
                    <div className="h-4 bg-slate-200 rounded w-3/4 mb-2" />
                    <div className="h-3 bg-slate-200 rounded w-1/2" />
                </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
                <div className="h-16 bg-slate-100 rounded-lg" />
                <div className="h-16 bg-slate-100 rounded-lg" />
            </div>
        </div>
    );
}

export function SkeletonTable({ rows = 5 }) {
    return (
        <div className="card-organic overflow-hidden animate-pulse">
            <div className="p-4 border-b bg-slate-50">
                <div className="flex gap-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="h-4 bg-slate-200 rounded flex-1" />
                    ))}
                </div>
            </div>
            {[...Array(rows)].map((_, i) => (
                <div key={i} className="p-4 border-b last:border-0">
                    <div className="flex gap-4">
                        {[1, 2, 3, 4, 5].map((j) => (
                            <div key={j} className="h-4 bg-slate-100 rounded flex-1" />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}

export default LoadingSpinner;
