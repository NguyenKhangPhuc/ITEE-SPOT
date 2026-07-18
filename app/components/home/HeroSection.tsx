'use client'

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"

/**
 * PURPOSE:
 * This component renders the Hero section of the Home page. It includes a typing typewriter
 * simulation of system logs in the background, a highlighted version badge, the title "ITEE SPOT"
 * with subtitle, and navigation action buttons.
 *
 * CONTEXT/PARENT FILE:
 * Extracted from 'app/page.tsx' to modularize the landing page layout.
 *
 * INPUTS / PARAMETERS:
 * None.
 */
export default function HeroSection() {
  const [typedLines, setTypedLines] = useState<string[]>([])

  /**
   * BEHAVIORAL MECHANISM:
   * The effect hook sets up an interval that iterates over an array of console log lines.
   * On each tick, it types the current line letter-by-letter. When a line completes, it appends
   * a new empty line and repeats. It keeps at most 12 lines in the buffer to simulate a scrolling
   * terminal output.
   *
   * PARAMETERS:
   * None.
   *
   * RETURNS:
   * A cleanup function to clear the interval on component unmount.
   */
  useEffect(() => {
    const lines = [
      "// BOOTSTRAPPING PLATFORM CORE 0x01",
      "import { api } from '@/lib/api-client';",
      "// console.log('Establishing secure session...');",
      "// SESSION ESTABLISHED (handshake: 12ms)",
      "async function fetchSpotlightProjects() {",
      "  const res = await api.get('/projects', {",
      "    include: ['groups'],",
      "    sort: '-created_at',",
      "  });",
      "  if (!res.ok) throw new Error('Fetch failed');",
      "  return res.json();",
      "}",
      "// BUNDLING & OPTIMIZING ASSETS",
      "npm run build --minify",
      "Route (app)      Size     First Load JS",
      "┌ λ /            1.82 kB         142 kB",
      "├ λ /projects    932 B           112 kB",
      "└ λ /events      1.2 kB          118 kB",
      "// SYSTEM STATE: NOMINAL //",
      "spotlight_server listening on port 3000...",
      "Active sessions: 104/1000",
      "Spotlight Engine: ACTIVE",
      "System.v2.0_Stable running..."
    ];

    let currentLineIdx = 0
    let currentCharIdx = 0
    let currentLines: string[] = [""]

    const interval = setInterval(() => {
      if (currentLineIdx >= lines.length) {
        currentLineIdx = 0
        currentCharIdx = 0
        currentLines = [""]
      }

      const lineText = lines[currentLineIdx]
      if (currentCharIdx < lineText.length) {
        currentLines[currentLines.length - 1] = lineText.slice(0, currentCharIdx + 1)
        setTypedLines([...currentLines])
        currentCharIdx++
      } else {
        currentLineIdx++
        currentCharIdx = 0
        if (currentLines.length > 20) {
          currentLines.shift()
        }
        currentLines.push("")
      }
    }, 25)

    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden px-6 md:px-16 bg-[linear-gradient(to_right,rgba(0,224,179,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,224,179,0.05)_1px,transparent_1px)] bg-[size:40px_40px]">

      <div className="absolute inset-0 bg-gradient-to-b from-[#151312]/50 via-[#151312] to-[#151312] pointer-events-none"></div>

      <div className="absolute inset-0 p-10 font-mono text-[9px] md:text-[11px] text-[#00e0b3]/50 overflow-hidden pointer-events-none select-none flex flex-col justify-end leading-relaxed text-left max-w-full">
        {typedLines.map((line, idx) => (
          <div key={`bg-line-${idx}`} className="whitespace-pre min-h-[1.5em]">
            {line}
            {idx === typedLines.length - 1 && (
              <span className="inline-block w-1 h-3 bg-[#00e0b3]/30 ml-1 animate-pulse">|</span>
            )}
          </div>
        ))}
      </div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.1
            }
          }
        }}
        className="relative z-10 text-center max-w-4xl mx-auto py-20 animate-fade-in flex flex-col items-center"
      >
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
          }}
          className="inline-flex items-center gap-3 px-4 py-1.5 bg-[#00e0b3]/5 border border-[#00e0b3]/20 rounded-sm mb-12"
        >
          <div className="flex gap-1">
            <span className="w-1.5 h-1.5 bg-[#00e0b3] rounded-full animate-pulse"></span>
            <span className="w-1.5 h-1.5 bg-[#00e0b3]/40 rounded-full"></span>
            <span className="w-1.5 h-1.5 bg-[#00e0b3]/20 rounded-full"></span>
          </div>
          <span className="text-[#00e0b3] font-semibold text-[11px] uppercase tracking-[0.2em] font-mono">
            Engineering Hub 0x01
          </span>
        </motion.div>

        <motion.div
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
          }}
          className="relative w-[400px] h-26 sm:w-[480px] sm:h-44 mb-8"
        >
          <Image
            src="/assets/iteespot_logo.png"
            alt="ITEE SPOT Logo"
            fill
            className="object-contain"
            priority
          />
        </motion.div>

        <motion.div
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
          }}
          className="h-[1px] w-32 mx-auto mb-8 bg-[linear-gradient(90deg,#00e0b3_0%,transparent_100%)]"
        ></motion.div>

        <motion.p
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
          }}
          className="text-lg md:text-2xl text-[#b9cbc2] max-w-2xl mx-auto mb-12 font-medium opacity-80 leading-relaxed"
        >
          Exploring <span className="text-[#00e0b3]">student&apos;s spot on solutions</span> in the <span className="text-[#00e0b3]">spotlight</span>
        </motion.p>
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
          }}
          className="flex flex-col sm:flex-row gap-6 justify-center items-center"
        >
          <Link
            href="/events"
            className="w-full sm:w-auto bg-[#00e0b3] text-[#00382b] font-bold text-sm px-10 py-4 rounded-sm flex items-center justify-center gap-3 group transition-all hover:translate-y-[-2px] uppercase tracking-widest duration-300"
          >
            Explore Events
            <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform duration-300">
              arrow_forward
            </span>
          </Link>
          <Link
            href="/login"
            className="w-full sm:w-auto border border-[#3a4a44] bg-transparent text-[#e8e1df] font-bold text-sm px-10 py-4 rounded-sm hover:bg-white/5 transition-all text-center uppercase tracking-widest duration-300"
          >
            Pitch a Project
          </Link>
        </motion.div>
      </motion.div>
    </section>

  )
}
