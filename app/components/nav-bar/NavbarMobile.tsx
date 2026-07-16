/**
 * PURPOSE:
 * Client Component representing the mobile navigation bar. It displays a fixed top bar
 * with co-funding logos, brand name, a smooth animating hamburger toggle, and mounts
 * the slide-in MobileMenuDrawer drawer.
 *
 * CONTEXT/PARENT FILE:
 * Mounted via 'app/components/NavbarServer.tsx' for viewports narrower than 2xl (1536px).
 *
 * INPUTS / PARAMETERS:
 * - initialUser (ProfileInsert | null, Required): The authenticated user profile passed from the server wrapper.
 */

'use client'

import { useState } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { signout } from "@/app/actions/authentication"
import { NAVIGATION_BAR } from "@/app/constants"
import { useNotification } from "@/app/context/NotificationContext"
import { PROFILE_ROLE } from "@/app/types/enum"
import { ProfileInsert } from "@/app/types/profile"
import MobileMenuDrawer from "./MobileMenuDrawer"


export default function NavbarMobile({ initialUser }: { initialUser: ProfileInsert | null }) {
  const pathname = usePathname()
  const { showNotification } = useNotification()
  
  // State variables for drawer open toggle and authenticated user payload
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [user] = useState<ProfileInsert | null>(initialUser)

  /**
   * BEHAVIORAL MECHANISM:
   * Triggers the user logout authentication action, closes the mobile drawer, and reports errors.
   *
   * PARAMETERS:
   * None.
   *
   * RETURNS:
   * - Promise<void>
   */
  const handleLogout = async (): Promise<void> => {
    try {
      setIsOpen(false)
      await signout()
    } catch (error) {
      if (error instanceof Error && error.message !== 'NEXT_REDIRECT') {
        showNotification(error.message)
      }
    }
  }

  /**
   * BEHAVIORAL MECHANISM:
   * Validates if a navigation section is authorized based on the user's role.
   *
   * PARAMETERS:
   * - navRole (PROFILE_ROLE | null): The role required to access the navigation category.
   *
   * RETURNS:
   * - boolean: True if authorized, otherwise false.
   */
  const handleGetNavigation = (navRole: PROFILE_ROLE | null): boolean => {
    if (user == null) {
      return false
    }
    if (navRole != null && user.role === PROFILE_ROLE.JUDGES) {
      return navRole !== PROFILE_ROLE.ADMIN
    }
    if (navRole != null && user.role === PROFILE_ROLE.ADMIN) {
      return true
    }
    if (navRole != null && navRole === user.role) {
      return navRole === user.role
    }
    return false
  }

  // Filtered categories according to user roles
  const visibleCategories = NAVIGATION_BAR.filter(
    (nav) => nav.role === null || handleGetNavigation(nav.role)
  )

  return (
    <>
      {/* Fixed top bar */}
      <header className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 bg-[#151312]/95 backdrop-blur-xl border-b border-white/5 xl:hidden h-18 select-none">
        
        <Link href="/" className="relative w-24 h-6 flex items-center justify-start z-10">
          <Image
            src="/assets/iteespot_logo.png"
            alt="ITEE SPOT"
            width={70}
            height={24}
            className="object-contain"
            priority
          />
        </Link>

        {/* Co-funding EU & IKAPO Logos */}
        <div className="flex items-center gap-2">
          <div className="relative w-8 h-8 rounded-full overflow-hidden bg-white flex items-center justify-center border border-white/10 shadow-sm shrink-0">
            <Image
              src="/assets/IKAPO_logo.png"
              alt="IKAPO"
              width={24}
              height={24}
              className="object-contain"
            />
          </div>
          <div className="relative w-8 h-8 rounded-full overflow-hidden bg-white flex items-center justify-center border border-white/10 shadow-sm shrink-0">
            <Image
              src="/assets/EU_LOGO.png"
              alt="EU"
              width={24}
              height={24}
              className="object-contain"
            />
          </div>
        </div>

        {/* Hamburger Toggle Button */}
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label="Toggle menu"
          className="relative w-9 h-9 flex items-center justify-center rounded-sm hover:bg-[#00e0b3]/5 transition-colors cursor-pointer select-none text-[#83958d] hover:text-[#00e0b3]"
        >
          <AnimatePresence mode="wait" initial={false}>
            {isOpen ? (
              <motion.span
                key="close"
                initial={{ opacity: 0, rotate: -90 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: 90 }}
                transition={{ duration: 0.18 }}
                className="flex items-center justify-center"
              >
                <span className="material-symbols-outlined text-xl">close</span>
              </motion.span>
            ) : (
              <motion.span
                key="open"
                initial={{ opacity: 0, rotate: 90 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: -90 }}
                transition={{ duration: 0.18 }}
                className="flex items-center justify-center"
              >
                <svg viewBox="0 0 32 32" width="22" height="22" fill="none">
                  <path
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    d="M27 10 13 10C10.8 10 9 8.2 9 6 9 3.5 10.8 2 13 2 15.2 2 17 3.8 17 6L17 26C17 28.2 18.8 30 21 30 23.2 30 25 28.2 25 26 25 23.8 23.2 22 21 22L7 22"
                  />
                  <path
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    d="M7 16 27 16"
                  />
                </svg>
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </header>

      {/* Slide-in Navigation Drawer */}
      <MobileMenuDrawer
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        user={user}
        pathname={pathname}
        visibleCategories={visibleCategories}
        handleLogout={handleLogout}
      />
    </>
  )
}