import React from "react"

export default function NavbarSkeleton() {
  return (
    <>
      {/* Desktop Sidebar Skeleton */}
      <aside className="fixed left-0 top-0 h-screen w-72 bg-[#151312]/95 backdrop-blur-xl border-r border-white/5 z-50 flex flex-col p-8 hidden xl:flex">
        <div className="mb-12 flex justify-center items-center">
          <div className="w-28 h-8 bg-white/5 rounded animate-pulse" />
        </div>
        <div className="flex flex-col gap-6 flex-grow">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-6 bg-white/5 rounded animate-pulse w-3/4" />
          ))}
        </div>
      </aside>

      {/* Mobile Bar Skeleton */}
      <header className="fixed top-0 left-0 right-0 h-18 bg-[#151312]/95 border-b border-white/5 z-50 px-6 flex items-center justify-between xl:hidden">
        <div className="w-24 h-6 bg-white/5 rounded animate-pulse" />
        <div className="w-8 h-8 bg-white/5 rounded animate-pulse" />
      </header>
    </>
  )
}
