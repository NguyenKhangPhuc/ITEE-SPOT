'use client'
import Link from "next/link"
import { User } from "@supabase/supabase-js"
import { signout } from "../actions/authentication"
import { useNotification } from "../context/NotificationContext"
import { useEffect, useState } from "react"

const NavBar = ({ initialUser }: { initialUser: User | null }) => {
    const { showNotification } = useNotification()
    const [user, setUser] = useState(initialUser);
    useEffect(() => {

        setUser(initialUser);
    }, [initialUser]);
    const handleLogout = async () => {
        try {
            await signout()
        } catch (error) {
            console.log(error + `--- ${error == 'Error: NEXT_REDIRECT' ? 'true' : 'false'}`)
            if (error instanceof Error && error.message !== 'NEXT_REDIRECT') {

                showNotification(error.message)
            }
        }
    }

    return (
        <nav className="fixed top-0 left-0 w-full bg-black text-white z-50 font-roboto-mono">
            <div className="max-w-4xl mx-auto px-6">
                <div className="flex items-center justify-between h-16">
                    <Link href={`/`} className="text-xl font-bold">
                        ITEE SKILLFORGE
                    </Link>

                    <div className="hidden md:flex gap-6 items-center">
                        <Link
                            href="/events"
                            className="px-3 py-1.5 rounded-md hover:bg-white/10 transition-colors duration-200"
                        >
                            Events
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
                        </Link>

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