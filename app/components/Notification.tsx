/**
 * PURPOSE:
 * Renders the global notification popup toast at the bottom right.
 * Uses Framer Motion's AnimatePresence to slide in from left to right on entry
 * and fade out on exit.
 *
 * CONTEXT/PARENT FILE:
 * Mounted globally in root layout wrappers to display success or failure alerts.
 *
 * INPUTS / PARAMETERS:
 * None (reads global state via useNotification context hook).
 */

'use client'

import { motion, AnimatePresence } from "framer-motion"
import { useNotification } from "../context/NotificationContext"

const NotificationCard = () => {
  const { notification, setNotification } = useNotification()

  return (
    <AnimatePresence>
      {notification.isOpen && (
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="fixed bottom-4 right-4 z-[100] pointer-events-none"
        >
          <div className="bg-[#1a1817] border border-[#00e0b3]/20 shadow-2xl shadow-black/80 rounded-sm p-4 flex items-center justify-between gap-4 max-w-sm pointer-events-auto relative overflow-hidden select-none">
            
            {/* Left vertical mint accent line */}
            <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#00e0b3]" />

            {/* Left Icon */}
            <div className="flex shrink-0 items-center justify-center w-8 h-8 rounded-sm bg-[#00e0b3]/5 border border-[#00e0b3]/10 text-[#00e0b3]">
              <span className="material-symbols-outlined text-sm font-bold">
                info
              </span>
            </div>

            {/* Alert Content */}
            <div className="flex flex-col gap-0.5 flex-1 min-w-0 pr-2">
              <span className="font-mono text-[8px] font-bold text-[#83958d] uppercase tracking-widest leading-none">
                SYSTEM_NOTIFICATION
              </span>
              <p className="font-mono text-xs text-[#e8e1df] leading-relaxed break-words select-text">
                {notification.content || "Operational parameters updated."}
              </p>
            </div>

            {/* Close button */}
            <button
              onClick={() => setNotification({ ...notification, isOpen: false })}
              type="button"
              className="flex shrink-0 items-center justify-center w-5 h-5 rounded-sm border border-white/5 hover:border-red-400/30 bg-white/5 hover:bg-red-400/5 text-[#83958d] hover:text-red-400 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[10px] font-bold">
                close
              </span>
            </button>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default NotificationCard