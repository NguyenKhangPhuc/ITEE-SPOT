/**
 * PURPOSE:
 * Client Component for the User Profile edit dashboard.
 * It mounts the react-hook-form schema, watches input values for live sidebar updates,
 * and arranges modular IdentityCore and ProfessionalModule sections in a themed grid structure.
 *
 * CONTEXT/PARENT FILE:
 * Mounted in 'app/profile/page.tsx' to provide the edit profile form.
 *
 * INPUTS / PARAMETERS:
 * - user (Profile, Required): The user database profile row.
 */

'use client'

import Link from "next/link"
import { useForm } from "react-hook-form"
import { createClient } from "@/app/utils/supabase/client"
import { useLoader } from "../context/LoaderContext"
import { useNotification } from "../context/NotificationContext"
import { Profile, ProfileInsert } from "../types/profile"
import BackButton from "@/app/components/BackButton"
import ProfileSidebar from "./components/ProfileSidebar"
import IdentityCoreSection from "./components/IdentityCoreSection"
import ProfessionalModuleSection from "./components/ProfessionalModuleSection"

export default function UserProfileClient({ user }: { user: Profile }) {
  const supabase = createClient()
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<ProfileInsert>({
    defaultValues: user
  })

  const { showNotification } = useNotification()
  const { setIsOpenLoader } = useLoader()

  // Live watch previews to propagate values to the sidebar card instantly
  const fullNamePreview = watch("full_name") || ""
  const jobTitlePreview = watch("job_title") || ""
  const companyNamePreview = watch("company_name") || ""
  const descriptionPreview = watch("description") || ""

  /**
   * BEHAVIORAL MECHANISM:
   * Handles form submit. It opens the loading curtain, updates the user profile row
   * in Supabase directly, and triggers notifications.
   *
   * PARAMETERS:
   * - data (ProfileInsert): Updated profile field values.
   *
   * RETURNS:
   * - Promise<void>
   */
  const onSubmit = async (data: ProfileInsert): Promise<void> => {
    setIsOpenLoader(true)
    try {
      if (!data.id) throw new Error("User ID is missing")
      const { data: updatedValue, error } = await supabase.from('profiles').update(data).eq('id', data.id).select().maybeSingle()
      if (error) {
        throw new Error(error.message)
      }
      if (updatedValue) {
        reset(updatedValue)
        showNotification('Update Successfully')
      } else {
        showNotification('Fail to update the profile')
      }
    } catch (error) {
      if (error instanceof Error) {
        showNotification(error.message)
      }
    } finally {
      setIsOpenLoader(false)
    }
  }

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Back navigation button */}
      <BackButton />

      <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col gap-8 min-h-screen">
        {/* System Header with action button */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-8 mb-4 select-none">
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl md:text-3xl font-extrabold text-[#00e0b3] tracking-tight uppercase leading-tight font-mono">
              SYSTEM REGISTRY // EDIT PROFILE
            </h1>
            <div className="text-[9px] font-mono text-[#83958d] uppercase tracking-widest flex flex-wrap gap-x-4 gap-y-1">
              <span>USER_ID: {user.id.slice(0, 8).toUpperCase()}-ITEE-{user.id.slice(-4).toUpperCase()}</span>
            </div>
          </div>

          <Link
            href={`/student/${user.id}`}
            className="inline-flex items-center gap-2 px-6 py-3 border border-[#00e0b3]/20 bg-[#00e0b3]/5 text-[#00e0b3] font-mono text-xs uppercase font-bold tracking-widest hover:bg-[#00e0b3]/10 transition-all rounded-sm cursor-pointer select-none"
          >
            <span>VIEW YOUR PUBLIC PROFILE</span>
            <span className="material-symbols-outlined text-sm">open_in_new</span>
          </Link>
        </div>

        {/* Main Two-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Avatar Photo & Description Sidebar */}
          <div className="lg:col-span-4">
            <ProfileSidebar
              user={user}
              register={register}
              errors={errors}
              fullNamePreview={fullNamePreview}
              jobTitlePreview={jobTitlePreview}
              companyNamePreview={companyNamePreview}
              descriptionPreview={descriptionPreview}
            />
          </div>

          {/* Right Column: Identity Core & Professional Affiliations Form */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            <IdentityCoreSection
              user={user}
              register={register}
              errors={errors}
            />
            
            <ProfessionalModuleSection
              register={register}
              errors={errors}
            />

            {/* Save Changes Button */}
            <div className="flex justify-end mt-4">
              <button
                type="submit"
                className="px-6 py-3 bg-[#00e0b3] text-[#00382b] font-mono text-xs uppercase font-bold tracking-widest hover:brightness-110 transition-all rounded-sm cursor-pointer select-none"
              >
                SAVE CHANGES
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}