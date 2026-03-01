export default function ArticleCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-gray-200 animate-pulse">
      <div className="h-48 w-full bg-gray-200" />
      <div className="flex flex-1 flex-col p-4">
        <div className="mb-2 flex gap-2">
          <div className="h-5 w-16 rounded-full bg-gray-200" />
        </div>
        <div className="mb-2 space-y-2">
          <div className="h-4 w-full rounded bg-gray-200" />
          <div className="h-4 w-3/4 rounded bg-gray-200" />
        </div>
        <div className="mb-3 space-y-1.5">
          <div className="h-3 w-full rounded bg-gray-200" />
          <div className="h-3 w-5/6 rounded bg-gray-200" />
        </div>
        <div className="mt-auto flex gap-2">
          <div className="h-3 w-24 rounded bg-gray-200" />
          <div className="h-3 w-20 rounded bg-gray-200" />
        </div>
      </div>
    </div>
  );
}
