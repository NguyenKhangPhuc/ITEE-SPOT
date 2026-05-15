'use client'
import Link from "next/link"
import { User } from "@supabase/supabase-js"
import { signout } from "../actions/authentication"
import { useNotification } from "../context/NotificationContext"
import { useEffect, useState } from "react"
import Image from "next/image"
import { NAVIGATION_BAR } from "../constants"
import { ProfileInsert } from "../types/profile"
import { PROFILE_ROLE } from "../types/enum"
import React from "react"
import { Item } from "@radix-ui/react-dropdown-menu"

const NavBar = ({ initialUser }: { initialUser: ProfileInsert | null }) => {
    const { showNotification } = useNotification()
    const [user, setUser] = useState(initialUser);
    useEffect(() => {

        setUser(initialUser);
    }, [initialUser]);
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
    }

    return (
        <nav className="fixed top-0 left-0 w-full bg-black text-white z-50 font-roboto-mono">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex items-center justify-between h-20">

                    <Link href={`/`} className="text-2xl font-bold flex items-center gap-5">
                        <div className="">
                            ITEE SPOT
                        </div>
                        <div className="flex gap-5">
                            <div className=" relative z-10 2xl:w-25 w-17 h-17 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gray-800 flex items-center justify-center bg-white">

                                <Image
                                    src="/assets/IKAPO_logo.png"
                                    alt="ikapo"
                                    width={65}   // Kích thước mặc định (Desktop)
                                    height={100}
                                    className="w-[50px] 2xl:w-[65px] h-auto object-contain"

                                />

                            </div>

                            <div className=" relative z-10 2xl:w-30 w-20 h-17 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gray-800 flex items-center justify-center bg-white">

                                <Image
                                    src="/assets/EU_LOGO.png"
                                    alt="EU Logo"
                                    width={65}   // Kích thước mặc định (Desktop)
                                    height={100}
                                    className="w-[50px] 2xl:w-[70px] h-auto"
                                />

                            </div>
                        </div>
                    </Link>
                    <div className="flex items-center">
                        {/* <Link
                            href="/events"
                            className="px-3 py-1.5 rounded-md hover:bg-white/10 transition-colors duration-200"
                        >
                            Events
                        </Link>
                        <Link
                            href="/invitations"
                            className="px-3 py-1.5 rounded-md hover:bg-white/10 transition-colors duration-200"
                        >
                            Invitations
                        </Link>
                        <Link
                            href={`/groups`}
                            className="px-3 py-1.5 rounded-md hover:bg-white/10 transition-colors duration-200"
                        >
                            Groups
                        </Link>
                        <Link
                            href="/profile"
                            className="px-3 py-1.5 rounded-md hover:bg-white/10 transition-colors duration-200"
                        >
                            Profile
                        </Link> */}
                        {NAVIGATION_BAR.map((nav) => {
                            return (
                                <React.Fragment key={`nav ${nav.category}`}>
                                    {handleGetNavigation(nav.role) && <div key={`category ${nav.category}`} className="dropdown text-center min-w-[160px]">
                                        <div className="dropbtn text-center" >{nav.category}</div>
                                        <div className="dropdown-content bg-white text-black w-[160px]">
                                            {nav.items.map((dropdown) => {
                                                return (
                                                    <Link key={`Link ${dropdown.title}`} href={dropdown.link} className="dropdown-link">
                                                        {dropdown.title}
                                                    </Link>

                                                )
                                            })}
                                        </div>
                                    </div>}
                                    {nav.role == null && <div key={`category ${nav.category}`} className="dropdown text-center min-w-[160px]">
                                        <div className="dropbtn text-center" >{nav.category}</div>
                                        <div className="dropdown-content bg-white text-black w-[160px]">
                                            {nav.items.map((dropdown) => {
                                                return (
                                                    <Link key={`Link ${dropdown.title}`} href={dropdown.link} className="dropdown-link">
                                                        {dropdown.title}
                                                    </Link>

                                                )
                                            })}
                                        </div>
                                    </div>}
                                </React.Fragment>
                            )
                        })}
                        <div className="absolute right-6 top-1/2 -translate-y-1/2">
                            {user ? (
                                <button
                                    onClick={handleLogout}
                                    className="cursor-pointer px-4 py-1.5 rounded-md bg-red-500/20 text-red-500 hover:bg-red-500 hover:text-white transition-colors duration-200"
                                >
                                    Logout
                                </button>
                            ) : (
                                <Link
                                    href="/login"
                                    className="px-4 py-1.5 rounded-md text-white hover:bg-white/10 transition-colors duration-200"
                                >
                                    Login
                                </Link>
                            )}
                        </div>

                    </div>
                </div>

            </div>
        </nav>
    )
}




export default NavBar