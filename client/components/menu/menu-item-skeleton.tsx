import { Skeleton } from "@/components/ui/skeleton"

export function MenuItemSkeleton() {
  return (
    <div className="flex gap-4 p-4 border rounded-2xl border-border bg-card">
      <Skeleton className="w-24 h-24 rounded-2xl flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="flex justify-between items-start">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-12" />
        </div>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <div className="flex justify-between items-center pt-2">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-8 w-16 rounded-xl" />
        </div>
      </div>
    </div>
  )
}