'use client'
import { User } from "@supabase/supabase-js"
import Link from "next/link"
import { useEffect, useState } from "react"
import { signout } from "../actions/authentication"
import { useNotification } from "../context/NotificationContext"

const NavbarMobile = ({ initialUser }: { initialUser: User | null }) => {
    const [isChecked, setIsChecked] = useState(false)
    const [user, setUser] = useState<User | null>(null)
    const { showNotification } = useNotification()
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
        <div className="fixed top-0 left-0 w-full bg-black text-white z-50 font-roboto-mono">
            <div className="max-w-4xl mx-auto px-6 flex">
                <div className="w-full flex items-center justify-between h-16">
                    <Link href={`/`} className="text-xl font-bold z-100">
                        ITEE SKILLFORGE
                    </Link>
                    <label className="hamburger  z-100">
                        <input type="checkbox" checked={isChecked}
                            onChange={() => setIsChecked(!isChecked)} />
                        <svg viewBox="0 0 32 32">
                            <path className="line line-top-bottom" d="M27 10 13 10C10.8 10 9 8.2 9 6 9 3.5 10.8 2 13 2 15.2 2 17 3.8 17 6L17 26C17 28.2 18.8 30 21 30 23.2 30 25 28.2 25 26 25 23.8 23.2 22 21 22L7 22"></path>
                            <path className="line" d="M7 16 27 16"></path>
                        </svg>
                    </label>
                </div>
                {isChecked ? <div className={`
        fixed inset-0 bg-black z-[80] pt-24 gap-2 duration-300
        ${isChecked ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}
    `}>
                    <div className=" max-w-4xl mx-auto px-6  flex flex-col">
                        <Link
                            href="/events"
                            onClick={() => setIsChecked(false)}
                            className="w-full py-4 text-lg font-medium border-b border-white/20 text-start hover:pl-2 duration-300"
                        >
                            Events
                        </Link>
                        <Link
                            href="/invitations"
                            onClick={() => setIsChecked(false)}
                            className="w-full py-4 text-lg font-medium border-b border-white/20 text-start hover:pl-2 duration-300"
                        >
                            Invitations
                        </Link>
                        <Link
                            href="/groups"
                            onClick={() => setIsChecked(false)}
                            className="w-full py-4 text-lg font-medium border-b border-white/20 text-start hover:pl-2 duration-300"
                        >
                            Groups
                        </Link>
                        <Link
                            href="/profile"
                            onClick={() => setIsChecked(false)}
                            className="w-full py-4 text-lg font-medium border-b border-white/20 text-start hover:pl-2 duration-300"
                        >
                            Profile
                        </Link>

                        {/* AUTH BUTTONS AT BOTTOM OF LIST */}
                        <div className="mt-6">
                            {user ? (
                                <button
                                    onClick={() => {
                                        handleLogout();
                                        setIsChecked(false);
                                    }}
                                    className="w-full py-4 text-start text-red-500 font-bold border-b border-white/20 uppercase hover:pl-2 duration-300 cursor-pointer"
                                >
                                    Logout
                                </button>
                            ) : (
                                <Link
                                    href="/login"
                                    onClick={() => setIsChecked(false)}
                                    className="w-full py-4 text-start text-white font-bold border-b border-white/20 uppercase tracking-widest"
                                >
                                    Login
                                </Link>
                            )}
                        </div>
                    </div>
                </div> : <></>}
            </div>
        </div>
    )
}

export default NavbarMobile