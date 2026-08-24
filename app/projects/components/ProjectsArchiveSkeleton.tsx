import React from "react"

export default function ProjectsArchiveSkeleton() {
  return (
    <div className="w-full flex flex-col gap-10 animate-pulse">
      {/* Header controls skeleton */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/5">
        <div className="h-10 bg-white/5 rounded-md w-full md:w-96" />
        <div className="flex items-center gap-3">
          <div className="h-10 bg-white/5 rounded-md w-32" />
          <div className="h-10 bg-white/5 rounded-md w-28" />
        </div>
      </div>

      {/* Grid skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="bg-[#1d1b1a] border border-white/5 rounded-sm p-6 flex flex-col gap-4"
          >
            <div className="h-44 bg-white/5 rounded-sm w-full" />
            <div className="h-5 bg-white/10 rounded w-2/3" />
            <div className="h-4 bg-white/5 rounded w-full" />
            <div className="h-4 bg-white/5 rounded w-4/5" />
          </div>
        ))}
      </div>
    </div>
  )
}
