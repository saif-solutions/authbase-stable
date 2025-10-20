import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function SkeletonLoader() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Metrics Skeleton */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="border-gray-200 dark:border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
              <div className="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Table Skeleton */}
      <Card className="border-gray-200 dark:border-gray-700">
        <CardHeader>
          <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                <div className="space-y-2 flex-1">
                  <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
