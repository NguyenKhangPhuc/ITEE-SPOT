import React from "react"

export default function ProjectsSkeleton() {
  return (
    <section className="py-24 max-w-7xl mx-auto px-6 md:px-16 animate-pulse">
      <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="h-3 bg-[#00e0b3]/20 rounded w-24 mb-2" />
          <div className="h-9 bg-white/10 rounded w-48" />
        </div>
        <div className="h-[1px] flex-grow bg-white/10 mb-2 mx-8 hidden md:block" />
        <div className="h-4 bg-white/10 rounded w-28 shrink-0" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-[#1d1b1a] border border-white/5 rounded-lg p-6 flex flex-col gap-4"
          >
            <div className="h-48 bg-white/5 rounded-md w-full" />
            <div className="h-6 bg-white/10 rounded w-3/4" />
            <div className="h-4 bg-white/5 rounded w-full" />
            <div className="h-4 bg-white/5 rounded w-5/6" />
          </div>
        ))}
      </div>
    </section>
  )
}
