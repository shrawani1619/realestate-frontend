export function StatCardSkeleton() {
  return (
    <div className="card animate-pulse">
      <div className="mb-4 h-10 w-10 rounded-lg bg-gray-200" />
      <div className="h-8 w-16 rounded bg-gray-200" />
      <div className="mt-2 h-4 w-24 rounded bg-gray-200" />
      <div className="mt-2 h-3 w-20 rounded bg-gray-100" />
    </div>
  );
}

export function ChartSkeleton({ height = 'h-64' }: { height?: string }) {
  return (
    <div className={`card animate-pulse ${height}`}>
      <div className="mb-4 h-5 w-40 rounded bg-gray-200" />
      <div className="mt-6 h-full rounded-lg bg-gray-100" />
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="card animate-pulse">
      <div className="mb-4 h-5 w-36 rounded bg-gray-200" />
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="h-10 rounded bg-gray-100" />
        ))}
      </div>
    </div>
  );
}

export function UserListSkeleton() {
  return (
    <div className="card animate-pulse">
      <div className="mb-4 h-5 w-32 rounded bg-gray-200" />
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gray-200" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-32 rounded bg-gray-200" />
              <div className="h-3 w-48 rounded bg-gray-100" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
