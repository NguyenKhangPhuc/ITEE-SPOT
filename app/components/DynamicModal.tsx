/**
 * PURPOSE:
 * Full-screen blocking confirmation modal component designed with dark terminal aesthetics.
 * Displays a blurred backdrop, customizable title, subtitle, and action buttons ("I'm sure" / "No")
 * for confirming destructive operations (e.g. member removal, challenge deletion).
 *
 * CONTEXT/PARENT FILE:
 * Mounted in 'app/components/DynamicModal.tsx' and reusable across system management pages.
 *
 * INPUTS / PARAMETERS:
 * - isOpen (boolean, Required): Controls modal visibility.
 * - onSave (() => void, Required): Callback triggered when user confirms action.
 * - onDismiss (() => void, Required): Callback triggered when user cancels action.
 * - title (string, Required): Primary modal heading.
 * - subTitle (string, Required): Explanatory warning message.
 * - confirmText (string, Optional): Text label for confirmation button (defaults to "I'm sure").
 * - cancelText (string, Optional): Text label for cancellation button (defaults to "No").
 */

'use client'

import React from "react"
import { motion, AnimatePresence } from "framer-motion"
import ClearIcon from "@mui/icons-material/Clear"
import { tw } from "@/app/constants/design-tokens"

interface DynamicModalProps {
    isOpen: boolean
    onSave: () => void
    onDismiss: () => void
    title: string
    subTitle: string
    confirmText?: string
    cancelText?: string
}

export function DynamicModal({
    isOpen,
    onSave,
    onDismiss,
    title,
    subTitle,
    confirmText = "I'm sure",
    cancelText = "No",
}: DynamicModalProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="fixed inset-0 z-50 flex items-center justify-center w-screen h-screen bg-black/80 backdrop-blur-md p-4 select-none"
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 30 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                        className={`w-full max-w-md ${tw.bg.surfaceContainerLow} ${tw.border.whiteSubtle} border rounded-sm p-6 shadow-2xl relative font-mono text-[#e8e1df]`}
                    >
                        {/* Top-right close icon */}
                        <button
                            type="button"
                            onClick={onDismiss}
                            className="absolute top-4 right-4 text-[#83958d] hover:text-[#00e0b3] transition-colors cursor-pointer"
                            aria-label="Dismiss"
                        >
                            <ClearIcon fontSize="small" />
                        </button>

                        {/* Top accent badge */}
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-[3px] h-3 bg-red-500" />
                            <span className="text-[8px] font-mono text-red-400 uppercase tracking-widest font-bold">
                                SYSTEM_ACTION_CONFIRMATION
                            </span>
                        </div>

                        {/* Title & Subtitle */}
                        <h2 className="text-base font-extrabold text-[#e8e1df] tracking-tight uppercase leading-snug font-mono">
                            {title}
                        </h2>
                        <p className="mt-3 text-xs text-[#83958d] leading-relaxed font-mono">
                            {subTitle}
                        </p>

                        {/* Action buttons */}
                        <div className="mt-6 flex gap-3 pt-4 border-t border-white/5">
                            <button
                                type="button"
                                onClick={onDismiss}
                                className="cursor-pointer flex-1 rounded-sm border border-white/10 bg-white/5 py-2.5 px-4 text-xs font-bold text-[#b9cbc2] hover:bg-white/10 hover:text-[#e8e1df] transition-all uppercase tracking-wider font-mono text-center"
                            >
                                {cancelText}
                            </button>
                            <button
                                type="button"
                                onClick={onSave}
                                className="cursor-pointer flex-1 rounded-sm bg-red-500/20 border border-red-500/40 py-2.5 px-4 text-xs font-bold text-red-400 hover:bg-red-500 hover:text-white transition-all uppercase tracking-wider font-mono text-center"
                            >
                                {confirmText}
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
