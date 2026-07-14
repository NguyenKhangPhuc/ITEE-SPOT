'use client'

import { createClient } from "@/app/utils/supabase/client"
import { handleGetUrl } from "@/app/helpers/FileUrl"
import { Event } from "@/app/types/event"
import { Profile } from "@/app/types/profile"
import BackButton from "@/app/components/BackButton"
import EventHero from "./components/EventHero"
import EventOverview from "./components/EventOverview"
import EventLocation from "./components/EventLocation"
import EventSidebar from "./components/EventSidebar"
import { tw } from "@/app/constants/design-tokens"

/**
 * PURPOSE:
 * This is the primary client-side orchestrator for the single event detail page. It initialises
 * the Supabase client, defines shared formatter utilities, and composes the page layout from
 * decomposed sub-components: EventHero, EventOverview, EventLocation, and EventSidebar.
 *
 * CONTEXT/PARENT FILE:
 * Rendered by 'app/events/[id]/page.tsx'. Sub-components are located in
 * 'app/events/[id]/components/'.
 *
 * INPUTS / PARAMETERS:
 * - event (Event, Required): The full event record fetched from the database.
 * - user (Profile, Required): The currently authenticated user's profile, forwarded to the
 *   sidebar for role-gating the action buttons.
 */
export default function SingleEventClient({ event, user }: { event: Event; user: Profile }) {
  const supabase = createClient()

  /**
   * BEHAVIORAL MECHANISM:
   * Resolves a Supabase storage attachment path into a fully qualified public URL
   * using the shared FileUrl helper function.
   *
   * PARAMETERS:
   * - path (string): The relative storage path of the asset.
   *
   * RETURNS:
   * - string: The public-facing URL for the asset.
   */
  const getUrl = (path: string): string => handleGetUrl(supabase, path)

  /**
   * BEHAVIORAL MECHANISM:
   * Converts a nullable ISO date string into a short uppercase locale date label.
   * Returns 'N/A' when the input is absent.
   *
   * PARAMETERS:
   * - dateStr (string | null | undefined): Raw ISO date string from the database.
   *
   * RETURNS:
   * - string: Formatted date such as 'OCT 12, 2025', or 'N/A'.
   */
  const fmtDate = (dateStr: string | null | undefined): string => {
    if (!dateStr) return 'N/A'
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short', day: '2-digit', year: 'numeric'
    }).toUpperCase()
  }

  /**
   * BEHAVIORAL MECHANISM:
   * Converts a nullable ISO date-time string into a 12-hour clock time label.
   * Returns 'N/A' when the input is absent.
   *
   * PARAMETERS:
   * - dateStr (string | null | undefined): Raw ISO date-time string from the database.
   *
   * RETURNS:
   * - string: Formatted time such as '09:00 AM', or 'N/A'.
   */
  const fmtTime = (dateStr: string | null | undefined): string => {
    if (!dateStr) return 'N/A'
    return new Date(dateStr).toLocaleTimeString('en-US', {
      hour: '2-digit', minute: '2-digit'
    }).toUpperCase()
  }

  return (
    <div className={`w-full min-h-screen ${tw.bg.background} ${tw.text.onBackground} font-montserrat`}>
      <div className="max-w-7xl mx-auto px-6 md:px-16 py-24">

        {/* Back Navigation */}
        <BackButton />

        {/* Hero — full-width poster banner */}
        <EventHero event={event} getUrl={getUrl} />

        {/* Two-Column Body */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Left Column — Overview + Location */}
          <div className="lg:col-span-7 flex flex-col gap-8">
            <EventOverview content={event.content} />
            <EventLocation location={event.location} />
          </div>

          {/* Right Column — Specification Sidebar + Action Buttons */}
          <EventSidebar
            event={event}
            user={user}
            fmtDate={fmtDate}
            fmtTime={fmtTime}
          />
        </div>
      </div>
    </div>
  )
}