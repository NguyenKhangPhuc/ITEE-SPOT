'use client'

import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { createClient } from "@/app/utils/supabase/client"
import { handleGetUrl } from "@/app/helpers/FileUrl"
import { insertGroupMembers } from "@/app/actions/group_member"
import { useLoader } from "@/app/context/LoaderContext"
import { useNotification } from "@/app/context/NotificationContext"
import { Event } from "@/app/types/event"
import { EventChallengeInsert } from "@/app/types/event_challenges"
import { RegisterGroupMember } from "@/app/types/group_member"
import { User } from "@supabase/supabase-js"
import BackButton from "@/app/components/BackButton"
import IdentitySection from "./components/IdentitySection"
import ChallengeSection from "./components/ChallengeSection"
import RegistrationSummary from "./components/RegistrationSummary"
import { tw } from "@/app/constants/design-tokens"

/**
 * Extends RegisterGroupMember with an optional short_description field
 * added in the redesigned form. The field is captured locally and can be
 * forwarded to the server action if the API supports it.
 */

/**
 * PURPOSE:
 * Client-side orchestrator for the group registration flow. Initialises react-hook-form
 * with the correct default values, wires the submit handler to the insertGroupMembers
 * server action, and composes the two-column page layout from isolated sub-components.
 *
 * CONTEXT/PARENT FILE:
 * Rendered by 'app/register/[id]/page.tsx'. Sub-components live in
 * 'app/register/[id]/components/'.
 *
 * INPUTS / PARAMETERS:
 * - event (Event, Required): Full event record used for title, max_group_members, and poster.
 * - user (User, Required): Authenticated Supabase user, pre-fills slot 1 and sets user_id.
 * - challenges (EventChallengeInsert[], Required): Available challenges for this event.
 */
export default function RegisterClient({
  event,
  user,
  challenges,
}: {
  event: Event
  user: User
  challenges: EventChallengeInsert[]
}) {
  const supabase = createClient()
  const { setIsOpenLoader } = useLoader()
  const { showNotification } = useNotification()
  const router = useRouter()

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<RegisterGroupMember>({
    defaultValues: {
      title: "",
      short_description: "",
      member_emails: [user.email],
      challenges: [],
      event_id: event.id,
      user_id: user.id,
    },
  })

  /**
   * BEHAVIORAL MECHANISM:
   * Calls the insertGroupMembers server action with the validated form payload.
   * Shows a loader overlay during the async operation and a notification on success
   * or failure. On success, navigates the user to their newly created group page.
   *
   * PARAMETERS:
   * - data (RegisterForm): Validated form values from react-hook-form.
   *
   * RETURNS:
   * - Promise<void>
   */
  const handleCreateGroup = async (data: RegisterGroupMember) => {
    setIsOpenLoader(true)
    try {
      const { createdGroup, error } = await insertGroupMembers(data)
      if (error) throw new Error(error)
      if (!createdGroup) throw new Error("Failed to load created group")
      setIsOpenLoader(false)
      showNotification("Group registered successfully")
      router.push(`/groups/${createdGroup.id}`)
    } catch (error) {
      if (error instanceof Error) showNotification(error.message)
      setIsOpenLoader(false)
    }
  }

  /**
   * BEHAVIORAL MECHANISM:
   * Resolves a Supabase storage attachment path into a fully qualified public URL
   * using the shared FileUrl helper.
   *
   * PARAMETERS:
   * - path (string): Relative storage path.
   *
   * RETURNS:
   * - string: Public URL for the asset.
   */
  const getUrl = (path: string): string => handleGetUrl(supabase, path)

  // Build the array of slot indices for members 2..N
  const otherMembers = Array.from(
    { length: (event.max_group_members || 1) - 1 },
    (_, i) => i + 2
  )

  return (
    <div className={`w-full min-h-screen ${tw.bg.background} ${tw.text.onBackground} font-montserrat`}>
      <div className="max-w-7xl mx-auto px-6 md:px-16 py-24">

        {/* Back Navigation */}
        <BackButton />

        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00e0b3] animate-pulse" />
            <span className="text-[10px] font-mono text-[#00e0b3] uppercase tracking-[0.25em]">
              Protocol: Group_Init
            </span>
          </div>
          <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight uppercase leading-tight">
            System_Registration:{" "}
            <span className="text-[#00e0b3]">{event.title ?? "Event"}</span>
          </h1>
          <p className={`${tw.text.onSurfaceVariant} text-sm mt-2 max-w-2xl leading-relaxed opacity-80`}>
            Initialize collective entry for the{" "}
            <span className="text-[#00e0b3] font-semibold uppercase">{event.title}</span>{" "}
            protocol. Ensure all node parameters are accurately mapped.
          </p>
        </motion.div>

        {/* Two-Column Layout */}
        <form onSubmit={handleSubmit(handleCreateGroup)}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

            {/* Left Column — form panels */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.1 }}
              className="lg:col-span-7 flex flex-col gap-6"
            >
              {/* Identity Parameters Section */}
              <IdentitySection
                register={register}
                errors={errors}
                control={control}
                user={user}
                otherMembers={otherMembers}
              />

              {/* Challenge Selection Section */}
              <ChallengeSection
                register={register}
                errors={errors}
                control={control}
                challenges={challenges}
              />

              {/* Submit Button */}
              <motion.button
                type="submit"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.25 }}
                className="w-full border border-[#00e0b3] text-[#00e0b3] hover:bg-[#00e0b3] hover:text-[#00382b] font-mono text-xs uppercase font-bold tracking-widest py-4 transition-all duration-300 rounded-sm flex items-center justify-center gap-3"
              >
                <span>Initialize_Registration_Sequence</span>
                <span className="material-symbols-outlined text-sm">bolt</span>
              </motion.button>
            </motion.div>

            {/* Right Column — Summary Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.55, delay: 0.2 }}
              className="lg:col-span-5"
            >
              <RegistrationSummary
                event={event}
                control={control}
                initialMemberCount={event.max_group_members ?? 1}
                getUrl={getUrl}
              />
            </motion.div>
          </div>
        </form>
      </div>
    </div>
  )
}