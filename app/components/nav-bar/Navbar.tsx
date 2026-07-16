'use client'
import Link from "next/link"
import Image from "next/image"

import React, { useState } from "react"
import { usePathname } from "next/navigation"
import { signout } from "@/app/actions/authentication"
import { NAVIGATION_BAR } from "@/app/constants"
import { useNotification } from "@/app/context/NotificationContext"
import { PROFILE_ROLE } from "@/app/types/enum"
import { ProfileInsert } from "@/app/types/profile"

const NavBar = ({ initialUser }: { initialUser: ProfileInsert | null }) => {
    const { showNotification } = useNotification()
    const [user, setUser] = useState(initialUser)
    const pathname = usePathname()


    const handleLogout = async () => {
        try {
            await signout()
        } catch (error) {
            if (error instanceof Error && error.message !== 'NEXT_REDIRECT') {
                showNotification(error.message)
            }
        }
    }

    const handleGetNavigation = (navRole: PROFILE_ROLE | null) => {
        if (user == null) {
            return false
        }
        if (navRole != null && user.role == PROFILE_ROLE.JUDGES) {
            return navRole != PROFILE_ROLE.ADMIN
        }
        if (navRole != null && user.role == PROFILE_ROLE.ADMIN) {
            return true
        }
        if (navRole != null && navRole == user.role) {
            return navRole == user.role
        }
        return false
    }

    const getIcon = (title: string) => {
        switch (title.toLowerCase()) {
            case 'home':
                return 'home';
            case 'events':
            case 'create events':
                return 'event';
            case 'past projects':
            case 'showcase projects':
            case 'projects management':
                return 'account_tree';
            case 'groups':
                return 'group';
            case 'profiles':
            case 'profile':
            case 'invitations':
                return 'person';
            case 'terms & condition':
            case 'privacy policies':
                return 'description';
            default:
                return 'link';
        }
    }

    // Filter categories based on dynamic roles
    const visibleCategories = NAVIGATION_BAR.filter(
        (nav) => nav.role === null || handleGetNavigation(nav.role)
    )

    return (
        <nav className="fixed left-0 top-0 h-screen w-72 bg-[#151312]/95 backdrop-blur-xl border-r border-white/5 z-50 flex flex-col p-8 transition-transform duration-300 overflow-y-auto hidden xl:flex font-montserrat">
            {/* Logo Section */}
            <div className="mb-12 flex justify-center items-center">
                <Link href="/" className="relative w-28 h-8 flex items-center mb-2 justify-start">
                    <Image
                        src="/assets/iteespot_logo.png"
                        alt="ITEE SPOT"
                        width={100}
                        height={32}
                        className="object-contain"
                        priority
                    />
                </Link>
            </div>

            {/* Navigation Links */}
            <div className="flex flex-col gap-6 flex-grow">
                {visibleCategories.map((category, catIdx) => (
                    <div key={`category-${category.category}-${catIdx}`} className="flex flex-col gap-2">
                        <div className="text-[10px] font-mono text-[#83958d]/40 uppercase tracking-widest mb-2 px-4">
                            {category.category}
                        </div>
                        <div className="flex flex-col gap-1">
                            {category.items.map((item) => {
                                const isActive = pathname === item.link
                                return (
                                    <Link
                                        key={`item-${item.title}`}
                                        href={item.link}
                                        className={`flex items-center gap-4 px-4 py-3 rounded-sm transition-all font-semibold text-sm group ${
                                            isActive
                                                ? "text-[#00e0b3] bg-[#00e0b3]/5 border-r-2 border-[#00e0b3]"
                                                : "text-[#b9cbc2] hover:text-[#00e0b3] hover:bg-[#00e0b3]/5"
                                        }`}
                                    >
                                        <span className="material-symbols-outlined text-lg group-hover:scale-110 transition-transform">
                                            {getIcon(item.title)}
                                        </span>
                                        {item.title}
                                    </Link>
                                )
                            })}
                        </div>
                    </div>
                ))}

                {/* Operations Section */}
                <div className="mt-4 flex flex-col gap-2">
                    <div className="text-[10px] font-mono text-[#83958d]/40 uppercase tracking-widest mb-2 px-4">
                        System_Operations
                    </div>
                    <div className="px-4">
                        <div className="relative">
                            <input
                                className="bg-[#2c2928] border border-[#3a4a44]/30 rounded-sm px-4 py-2 text-[12px] font-semibold text-[#e8e1df] focus:ring-1 focus:ring-[#00e0b3] focus:border-[#00e0b3] w-full placeholder-[#83958d]/50 outline-none"
                                placeholder="Search logs..."
                                type="text"
                            />
                            <span className="material-symbols-outlined absolute right-3 top-2 text-[#83958d]/50 scale-75">
                                search
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* User & Auth Status Section */}
            <div className="mt-auto pt-8 border-t border-white/5">
                {user ? (
                    <button
                        onClick={handleLogout}
                        className="w-full bg-red-500/10 text-red-400 border border-red-500/20 px-6 py-3 rounded-sm font-semibold text-sm hover:bg-red-500 hover:text-white transition-all uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer"
                    >
                        <span className="material-symbols-outlined text-sm">logout</span>
                        Sign Out
                    </button>
                ) : (
                    <Link
                        href="/login"
                        className="w-full bg-[#00e0b3] text-[#00382b] px-6 py-3 rounded-sm font-semibold text-sm hover:brightness-110 transition-all uppercase tracking-widest font-bold flex items-center justify-center gap-2 text-center"
                    >
                        <span className="material-symbols-outlined text-sm">login</span>
                        Sign In
                    </Link>
                )}

                <div className="mt-6 flex items-center gap-3 text-[10px] font-mono text-[#83958d]">
                    <div className={`w-2 h-2 rounded-full animate-pulse ${user ? 'bg-[#00e0b3]' : 'bg-red-500'}`}></div>
                    {user ? `Auth: ${user?.role!.toUpperCase()}` : 'Auth: Offline'}
                </div>
            </div>
        </nav>
    )
}

export default NavBar