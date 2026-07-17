'use client'

import { useState } from "react"
import { motion } from "framer-motion"

interface ReadOnlyYoutubeVideoProps {
  embeddedUrl: string | null
}

/**
 * PURPOSE:
 * Renders a premium YouTube video showcase. In its initial state, it displays a themed
 * placeholder thumbnail with a bright mint play overlay and a system filename caption
 * underneath. Clicking the play button dynamically swaps it to render the interactive
 * YouTube iframe.
 *
 * CONTEXT/PARENT FILE:
 * Placed in 'app/submission/[groupId]/read-only/components/ReadOnlyYoutubeVideo.tsx'
 * to match the visual showcase preview design.
 *
 * INPUTS / PARAMETERS:
 * - embeddedUrl (string | null, Required): Fully qualified YouTube embed URL.
 */
export default function ReadOnlyYoutubeVideo({ embeddedUrl }: ReadOnlyYoutubeVideoProps) {
  const [isPlaying, setIsPlaying] = useState<boolean>(false)

  if (!embeddedUrl) return null

  return (
    <div className="w-full flex flex-col gap-2">
      {isPlaying ? (
        <div className="w-full relative aspect-video rounded-sm overflow-hidden border border-white/10 bg-black">
          <iframe
            width="100%"
            height="100%"
            src={`${embeddedUrl}?autoplay=1`}
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
            className="absolute inset-0"
          ></iframe>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setIsPlaying(true)}
          className="w-full relative aspect-video rounded-sm overflow-hidden border border-white/5 bg-[#151312] hover:border-[#00e0b3]/30 transition-colors flex flex-col items-center justify-center group cursor-pointer"
        >
          {/* Decorative Waveform/Matrix Grid Background */}
          <div className="absolute inset-0 bg-[radial-gradient(rgba(0,224,179,0.02)_1px,transparent_1px)] [background-size:12px_12px] opacity-60" />

          {/* Central Play Button */}
          <div className="w-12 h-12 bg-[#00e0b3]/10 border border-[#00e0b3]/30 rounded-full flex items-center justify-center group-hover:scale-110 group-hover:bg-[#00e0b3] group-hover:text-[#00382b] text-[#00e0b3] transition-all duration-300 z-10 shadow-lg shadow-black/40">
            <span className="material-symbols-outlined text-2xl pl-[2px]">play_arrow</span>
          </div>

          <span className="text-[8px] font-mono text-[#83958d] uppercase tracking-wider mt-4 block z-10 group-hover:text-[#e8e1df] transition-colors">
            01_SHOWCASE_PREVIEW_V1.MP4
          </span>
        </button>
      )}
    </div>
  )
}
