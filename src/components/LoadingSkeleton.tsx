export function ImageGridSkeleton() {
  return (
    <div
      className="grid grid-cols-2 md:grid-cols-4 gap-4"
      role="status"
      aria-label="Loading images"
    >
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="aspect-square bg-gray-800 rounded-lg animate-pulse"
        />
      ))}
    </div>
  );
}

export function SubmissionCardSkeleton() {
  return (
    <div
      className="space-y-4"
      role="status"
      aria-label="Loading submission data"
    >
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-gray-800 rounded-lg animate-pulse h-20" />
        <div className="p-4 bg-gray-800 rounded-lg animate-pulse h-20" />
      </div>
      <div className="p-4 bg-gray-800 rounded-lg animate-pulse h-24" />
      <div className="p-4 bg-gray-800 rounded-lg animate-pulse h-16" />
    </div>
  );
}
