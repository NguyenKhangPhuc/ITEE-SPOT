'use client'
import { User } from "@supabase/supabase-js"
import Link from "next/link"
import { SetStateAction, useEffect, useState } from "react"
import { signout } from "../actions/authentication"
import { useNotification } from "../context/NotificationContext"
import Image from "next/image"
import { NAVIGATION_BAR } from "../constants"
import React from "react"
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
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

            if (error instanceof Error && error.message !== 'NEXT_REDIRECT') {

                showNotification(error.message)
            }
        }
    }
    return (
        <div className="fixed top-0 left-0 w-full bg-black text-white z-50 font-roboto-mono">
            <div className="max-w-full mx-auto px-6 flex">
                <div className="w-full flex items-center justify-between h-18">
                    <Link href={`/`} className="text-xl font-bold z-100">
                        ITEE SPOT
                    </Link>
                    <div className="flex items-center gap-1 h-full ">

                        <div className=" relative z-10 sm:w-25 w-17 h-17 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gray-800 flex items-center justify-center bg-white">

                            <Image
                                src="/assets/IKAPO_logo.png"
                                alt="ikapo"
                                width={65}   // Kích thước mặc định (Desktop)
                                height={100}
                                className="w-[40px] sm:w-[65px] h-auto object-contain"

                            />

                        </div>

                        <div className=" relative z-10 sm:w-30 w-17 h-17 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gray-800 flex items-center justify-center bg-white">

                            <Image
                                src="/assets/EU_LOGO.png"
                                alt="EU Logo"
                                width={65}
                                height={100}
                                className="w-[50px] sm:w-[70px] h-auto"
                            />
                        </div>
                    </div>
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
                    <div className=" max-w-full mx-auto px-6  flex flex-col">
                        {NAVIGATION_BAR.map((item, index) => {
                            return (
                                <React.Fragment key={`${item.category} - ${index}`}>
                                    <NavigationItem item={item} setIsChecked={setIsChecked} />
                                </React.Fragment>
                            )
                        })}


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

interface NavigationItemProp {
    item: {
        category: string;
        items: {
            title: string;
            link: string;
        }[];
    }
    setIsChecked: React.Dispatch<SetStateAction<boolean>>
}

const NavigationItem = ({ item, setIsChecked }: NavigationItemProp) => {
    const [isOpenItem, setIsOpenItem] = useState<boolean>(false)
    return (
        <div className="w-full py-4 text-lg font-medium text-start flex flex-col gap-2">
            <div className="w-full flex justify-between border-b border-white/20 cursor-pointer"
                onClick={() => setIsOpenItem(!isOpenItem)}
            >
                <div


                    className="hover:pl-2 duration-300 pb-1 cursor-pointer"
                >
                    {item.category}

                </div>
                {isOpenItem ? <KeyboardArrowUpIcon sx={{ color: 'white', fontSize: '25px' }} /> : <KeyboardArrowDownIcon sx={{ color: 'white', fontSize: '25px' }} />}
            </div>
            <div className="w-full  flex flex-col gap-3 p-2">
                {isOpenItem && item.items.map((subItem) => {
                    return (
                        <Link href={subItem.link}
                            onClick={() => setIsChecked(false)}
                            className="w-full flex justify-between border-b border-white/20 pb-1" key={`${item.category} - ${subItem.title}`}>
                            <div


                                className="hover:pl-2 duration-300"
                            >
                                {subItem.title}
                            </div>
                            <ArrowForwardIosIcon sx={{ color: 'white', fontSize: '12px' }} />
                        </Link>
                    )
                })}
            </div>
        </div>
    )
}

export default NavbarMobile