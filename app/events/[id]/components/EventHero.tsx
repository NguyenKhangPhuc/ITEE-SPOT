'use client'

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { EVENT_STATUS } from "@/app/types/enum"
import { Event } from "@/app/types/event"
import { tw } from "@/app/constants/design-tokens"

interface EventHeroProps {
  event: Event
  getUrl: (path: string) => string
}

/**
 * PURPOSE:
 * Renders the full-width hero section for a single event detail page. It displays the
 * event poster as a background cover image, overlaid with a dark gradient, a status badge,
 * the event title, a short description, and a primary call-to-action button.
 *
 * CONTEXT/PARENT FILE:
 * Extracted from 'app/events/[id]/SingleEventClient.tsx' and placed in
 * 'app/events/[id]/components/EventHero.tsx'.
 *
 * INPUTS / PARAMETERS:
 * - event (Event, Required): The full event data record.
 * - getUrl ((path: string) => string, Required): Callback to resolve a storage path to a public URL.
 */
export default function EventHero({ event, getUrl }: EventHeroProps) {
  const isOngoing = event.status === EVENT_STATUS.ONGOING

  return (
    <motion.div
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`relative w-full min-h-[320px] md:min-h-[380px] overflow-hidden rounded-sm border ${tw.border.whiteSubtle} mb-10 flex flex-col justify-end`}
    >
      {/* Cover Image */}
      {event.poster_path ? (
        <Image
          src={getUrl(event.poster_path)}
          alt={event.title ?? "Event poster"}
          fill
          sizes="(max-width: 1280px) 100vw, 1280px"
          className="object-cover opacity-50"
          priority
        />
      ) : (
        <div className={`absolute inset-0 ${tw.bg.surfaceContainerHigh}`} />
      )}

      {/* Dark Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#151312] via-[#151312]/60 to-transparent" />

      {/* Hero Content */}
      <div className="relative z-10 p-8 md:p-10 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div className="flex flex-col gap-3">
          {/* Status Badge */}
          <div className={`inline-flex items-center gap-2 w-fit font-mono text-[9px] px-2 py-1 tracking-widest uppercase font-bold rounded-sm border ${
            isOngoing
              ? 'bg-[#00e0b3]/10 border-[#00e0b3]/30 text-[#00e0b3]'
              : 'bg-white/5 border-white/10 text-[#83958d]'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${isOngoing ? 'bg-[#00e0b3] animate-pulse' : 'bg-[#83958d]'}`} />
            {isOngoing ? 'ACTIVE' : 'CLOSED'}
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight max-w-2xl">
            {event.title ?? 'Untitled Event'}
          </h1>

          {event.short_description && (
            <p className={`${tw.text.onSurfaceVariant} text-sm max-w-xl leading-relaxed opacity-80`}>
              {event.short_description}
            </p>
          )}
        </div>

        {/* CTA Button */}
        {isOngoing ? (
          <Link
            href={`/register/${event.id}`}
            className="shrink-0 border border-[#00e0b3] text-[#00e0b3] hover:bg-[#00e0b3] hover:text-[#00382b] font-mono text-xs uppercase font-bold tracking-widest py-3 px-8 transition-all duration-300 rounded-sm"
          >
            Initialize Registration
          </Link>
        ) : (
          <div className="shrink-0 border border-white/10 text-[#83958d] font-mono text-xs uppercase font-bold tracking-widest py-3 px-8 rounded-sm cursor-not-allowed">
            Registration Closed
          </div>
        )}
      </div>
    </motion.div>
  )
}
