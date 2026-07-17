/**
 * PURPOSE:
 * Renders the sliding drawer menu for mobile devices, including the backdrop overlay,
 * category navigation links, active user role status indicator, and auth actions (Sign In / Sign Out).
 *
 * CONTEXT/PARENT FILE:
 * Extracted from 'app/components/NavbarMobile.tsx' to modularize the slide-in drawer layout.
 *
 * INPUTS / PARAMETERS:
 * - isOpen (boolean, Required): Controls drawer and backdrop visibility.
 * - onClose (() => void, Required): Callback to close the menu.
 * - user (ProfileInsert | null, Required): Active user profile data.
 * - pathname (string, Required): The current route path for active state highlighting.
 * - visibleCategories (any[], Required): Filtered list of navigation items authorized for the user.
 * - handleLogout (() => Promise<void>, Required): Event handler to trigger user signout.
 */

'use client'

import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { ProfileInsert } from "../../types/profile"
import { tw } from "@/app/constants/design-tokens"

interface NavigationItem {
  title: string
  link: string
}

interface NavigationCategory {
  category: string
  items: NavigationItem[]
}

interface MobileMenuDrawerProps {
  isOpen: boolean
  onClose: () => void
  user: ProfileInsert | null
  pathname: string
  visibleCategories: NavigationCategory[]
  handleLogout: () => Promise<void>
}

export default function MobileMenuDrawer({
  isOpen,
  onClose,
  user,
  pathname,
  visibleCategories,
  handleLogout,
}: MobileMenuDrawerProps) {
  /**
   * BEHAVIORAL MECHANISM:
   * Maps a navigation link's title to its corresponding Google Material Symbols icon name.
   *
   * PARAMETERS:
   * - title (string): The title string of the menu option.
   *
   * RETURNS:
   * - string: The name of the icon glyph.
   */
  const getIcon = (title: string): string => {
    switch (title.toLowerCase()) {
      case 'home':
        return 'home'
      case 'events':
      case 'create events':
        return 'event'
      case 'past projects':
      case 'showcase projects':
      case 'projects management':
        return 'account_tree'
      case 'groups':
      case 'group management':
        return 'group'
      case 'user management':
        return 'manage_accounts'
      case 'profiles':
      case 'profile':
      case 'invitations':
        return 'person'
      case 'terms & condition':
      case 'privacy policies':
        return 'description'
      default:
        return 'link'
    }
  }

  /**
   * BEHAVIORAL MECHANISM:
   * Implements internal AnimatePresence wrappers to animate drawer translation and backdrop opacity.
   * Clicking the backdrop triggers the onClose callback to dismiss the menu. Navigation links
   * trigger onClose as well.
   *
   * PARAMETERS:
   * - props (MobileMenuDrawerProps): Drawer state controls and navigation elements.
   *
   * RETURNS:
   * - React.JSX.Element: The animated backdrop and drawer sidebar portal components.
   */
  return (
    <>
      {/* Drawer Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm xl:hidden"
          />
        )}
      </AnimatePresence>

      {/* Slide-in Drawer Container */}
      <AnimatePresence>
        {isOpen && (
          <motion.aside
            key="drawer"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            className="fixed top-0 left-0 z-50 h-full w-[220px] bg-[#151312]/95 backdrop-blur-xl border-r border-white/5 flex flex-col py-6 px-3 shadow-2xl xl:hidden overflow-y-auto"
          >
            {/* Brand Logo & Version Info */}
            <div className="mb-6 flex flex-col px-2 select-none">
              <Link href="/" onClick={onClose} className="text-xl font-bold tracking-tighter text-[#00e0b3] font-montserrat">
                ITEE SPOT
              </Link>
              <div className="text-white/20 text-[8px] font-mono uppercase tracking-[0.3em] mt-0.5">
                System.v2.0_Stable
              </div>
            </div>

            {/* Auth Status Badge */}
            <div className="flex items-center gap-2 px-2 mb-6 text-[9px] font-mono text-[#83958d] select-none">
              <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${user ? 'bg-[#00e0b3]' : 'bg-red-500'}`} />
              <span>{user ? `Auth: ${user.role!.toUpperCase()}` : 'Auth: Offline'}</span>
            </div>

            {/* Navigation Lists */}
            <nav className="flex flex-col gap-5 flex-grow pr-1">
              {visibleCategories.map((category, catIdx) => (
                <div key={`category-${category.category}-${catIdx}`} className="flex flex-col gap-1.5">
                  <span className="text-[9px] font-mono text-[#83958d]/40 uppercase tracking-widest px-3 select-none">
                    {category.category}
                  </span>
                  <div className="flex flex-col gap-1">
                    {category.items.map((item) => {
                      const isActive = pathname === item.link
                      return (
                        <Link
                          key={`item-${item.title}`}
                          href={item.link}
                          onClick={onClose}
                          className={`flex items-center gap-3 px-3 py-2 rounded-sm transition-all font-semibold text-xs group ${
                            isActive
                              ? "text-[#00e0b3] bg-[#00e0b3]/5 border-r-2 border-[#00e0b3]"
                              : "text-[#b9cbc2] hover:text-[#00e0b3] hover:bg-[#00e0b3]/5"
                          }`}
                        >
                          <span className="material-symbols-outlined text-sm group-hover:scale-110 transition-transform">
                            {getIcon(item.title)}
                          </span>
                          <span>{item.title}</span>
                        </Link>
                      )
                    })}
                  </div>
                </div>
              ))}
            </nav>

            {/* System Actions Area */}
            <div className="flex flex-col gap-1 pt-4 border-t border-white/5 mt-auto">
              {user ? (
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-3 py-2 rounded-sm text-xs font-semibold text-red-400 bg-red-500/10 hover:bg-red-500 hover:text-white border border-red-500/20 transition-all uppercase tracking-widest cursor-pointer w-full justify-center"
                >
                  <span className="material-symbols-outlined text-xs">logout</span>
                  <span>Sign Out</span>
                </button>
              ) : (
                <Link
                  href="/login"
                  onClick={onClose}
                  className="flex items-center gap-3 px-3 py-2 rounded-sm text-xs font-semibold text-[#00382b] bg-[#00e0b3] hover:brightness-110 transition-all uppercase tracking-widest font-bold w-full justify-center"
                >
                  <span className="material-symbols-outlined text-xs">login</span>
                  <span>Sign In</span>
                </Link>
              )}
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  )
}
