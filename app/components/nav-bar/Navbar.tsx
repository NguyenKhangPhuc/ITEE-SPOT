'use client'
import Link from "next/link"
import Image from "next/image"

import React, { useState } from "react"
import { usePathname } from "next/navigation"
import { runAuthAction } from "@/app/actions/authentication/actions.gateway"
import { NAVIGATION_BAR } from "@/app/constants"
import { useNotification } from "@/app/context/NotificationContext"
import { PROFILE_ROLE } from "@/app/types/enum"
import { ProfileInsert } from "@/app/types/profile"

const NavBar = ({ initialUser }: { initialUser: ProfileInsert | null }) => {
    const { showNotification } = useNotification()
    const pathname = usePathname()


    const handleLogout = async () => {
        try {
            await runAuthAction({ type: 'signout' })
        } catch (error) {
            if (error instanceof Error && error.message !== 'NEXT_REDIRECT') {
                showNotification(error.message)
            }
        }
    }

    const handleGetNavigation = (navRole: PROFILE_ROLE | null) => {
        if (initialUser == null) {
            return false
        }
        if (navRole != null && initialUser.role == PROFILE_ROLE.JUDGES) {
            return navRole != PROFILE_ROLE.ADMIN
        }
        if (navRole != null && initialUser.role == PROFILE_ROLE.ADMIN) {
            return true
        }
        if (navRole != null && navRole == initialUser.role) {
            return navRole == initialUser.role
        }
        return false
    }

    const getIcon = (title: string) => {
        switch (title.toLowerCase()) {
            case 'home':
                return 'home';
            case 'about itee spot':
                return 'info';
            case 'events':
            case 'create events':
            case 'event management':
                return 'event';
            case 'past projects':
            case 'showcase projects':
            case 'projects management':
                return 'account_tree';
            case 'groups':
            case 'group management':
                return 'group';
            case 'user management':
            case 'initialuser management':
                return 'manage_accounts';
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

            </div>

            {/* initialUser & Auth Status Section */}
            <div className="mt-auto pt-8 border-t border-white/5">
                {initialUser ? (
                    <button
                        onClick={handleLogout}
                        className="w-full bg-red-500/10 text-red-400 border border-red-500/20 px-6 py-3 rounded-sm font-semibold text-sm hover:bg-red-500 hover:text-white transition-all uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer"
                    >
                        <span className="material-symbols-outlined text-sm">logout</span>
                        Sign Out
                    </button>
                ) : (
                    <div className="flex flex-col gap-2 w-full">
                        <Link
                            href="/login"
                            className="w-full bg-[#00e0b3] text-[#00382b] px-6 py-3 rounded-sm font-semibold text-sm hover:brightness-110 transition-all uppercase tracking-widest font-bold flex items-center justify-center gap-2 text-center"
                        >
                            <span className="material-symbols-outlined text-sm">login</span>
                            Sign In
                        </Link>
                        <Link
                            href="/sign-up"
                            className="w-full bg-[#373433] text-[#e8e1df] border border-white/10 hover:bg-[#474443] hover:border-[#00e0b3]/30 px-6 py-3 rounded-sm font-semibold text-sm transition-all uppercase tracking-widest font-bold flex items-center justify-center gap-2 text-center"
                        >
                            <span className="material-symbols-outlined text-sm">person_add</span>
                            Sign Up
                        </Link>
                    </div>
                )}

                <div className="mt-6 flex items-center gap-3 text-[10px] font-mono text-[#83958d]">
                    <div className={`w-2 h-2 rounded-full animate-pulse ${initialUser ? 'bg-[#00e0b3]' : 'bg-red-500'}`}></div>
                    {initialUser ? `Auth: ${initialUser?.role!.toUpperCase()}` : 'Auth: Offline'}
                </div>
            </div>
        </nav>
    )
}

export default NavBar